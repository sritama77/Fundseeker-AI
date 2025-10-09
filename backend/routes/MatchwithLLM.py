from pymongo import MongoClient
import google.genai as genai
import openai
import os
import json
import time
from tqdm import tqdm
from dotenv import load_dotenv
from typing import Dict, Any, Optional, Tuple, List
from bson import ObjectId
from datetime import datetime
from db.db import db_main,client
from flask import Blueprint,request,jsonify
import os
import uuid
import re
#from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient, models
from routes.QdrantConnection import qudrant_connection_var as qdrant_client
load_dotenv()

llm_bp_model = Blueprint("llmmodel",__name__)

@llm_bp_model.route("/modelanalysis",methods=["POST"])
def LLM():
    data = request.json
    if data:
        User_id = data["UserId"]
        isStartup = data["isStartup"]

    USE_GEMINI = True

    if USE_GEMINI:
        try:
            Gemclient=genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
            print("✅ Gemini API configured")
        except Exception as e:
            print(f"❌ Error configuring Gemini API: {e}")
            return jsonify({"Success": False, "message": f"API configuration error: {e}"})
    else:
        try:
            openai.api_key = os.getenv("OPENAI_API_KEY")
            print("✅ OpenAI API configured")
        except Exception as e:
            print(f"❌ Error configuring OpenAI API: {e}")
            return jsonify({"Success": False, "message": f"API configuration error: {e}"})

    SCORE_WEIGHTS = {
        "sector_alignment": 0.25,
        "business_model_fit": 0.20,
        "technology_adjacency": 0.20,
        "thesis_fit": 0.25,
        "stage_fit": 0.10,
    }

    MONGODB_CONFIG = {
        "connection_string": os.getenv("MONGODB_URL", "mongodb://localhost:27017/"),
        "database_name": os.getenv("DATABASE_NAME", "fundseeker"),
        "startup_collection": "startup",
        "investor_collection": "investor",
        "matches_collection": "matches"
    }
   

    def setup_collection(client: QdrantClient, collection_name: str, vector_size: int=1):
        print(f"🔧 Setting up collection: '{collection_name}'")
        if client.collection_exists(collection_name):
            print(f"⚠️ Collection '{collection_name}' already exists. Recreating it...")
            client.recreate_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(size=vector_size, distance=models.Distance.COSINE)
            )
        else:
            client.create_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(size=vector_size, distance=models.Distance.COSINE)
            )

    def create_payload_indexes(client: QdrantClient, collection_name: str):
        """Creates payload indexes for efficient filtering."""
        print(f"📈 Creating payload indexes for collection: '{collection_name}'")

        client.create_payload_index(collection_name, field_name="SelectedStages", field_schema=models.PayloadSchemaType.KEYWORD)

        client.create_payload_index(collection_name, field_name="SelectedIndustries", field_schema=models.PayloadSchemaType.KEYWORD)

        client.create_payload_index(collection_name, field_name="check_size_min_inr", field_schema=models.PayloadSchemaType.FLOAT)
        client.create_payload_index(collection_name, field_name="check_size_max_inr", field_schema=models.PayloadSchemaType.FLOAT)
        print("✅ Payload indexes created successfully!")
    
    def parse_check_size(check_range_str: str):
        """
        A robust parser for strings like '₹50 L - ₹1.5 Cr' into min/max float values in INR.
        Handles various units (L, Cr) and formats (ranges, open-ended '+').
        """
        multipliers = {
            'l': 100000,
            'cr': 10000000
        }

        matches = re.findall(r'([\d\.]+)\s*(L|Cr)', check_range_str, re.IGNORECASE)
        
        values_inr = []
        for value_str, unit_str in matches:
            value = float(value_str)
            multiplier = multipliers[unit_str.lower()]
            values_inr.append(value * multiplier)
            
        if not values_inr:
            return 0, float('inf') 
        
        min_val = values_inr[0]
        max_val = float('inf') # Default max for open-ended ranges like "3 Cr+"

        if len(values_inr) > 1:
            max_val = values_inr[1]
        elif '+' not in check_range_str:
            max_val = min_val
            
        return min_val, max_val

    def embed_and_upsert_investors(client: QdrantClient, investors: list):
        points_to_upsert = []
        print(f"✨ Embedding and preparing {len(investors)} investor profiles for upsert...")
        for investor_doc in investors:
            # Get the correctly typed dictionary
            investor = extract_investor_profile(investor_doc, valueType=True)
            
            # vector = model.encode(investor["BioThesis"], normalize_embeddings=True).tolist()
            
            # FIX: Pass the entire string to the parser, not just the first character.
            min_inr, max_inr = parse_check_size(investor["CheckSizeRange"])
            
            # FIX: These are now actual lists thanks to our corrected extraction function.
            cleaned_stages = [s.lower().strip() for s in investor["SelectedStages"]]
            cleaned_industries = [i.lower().strip() for i in investor["SelectedIndustries"]]

            print(f"  - UPLOADING: {investor['FirmName']} | Industries: {cleaned_industries}")

            payload = {
                "mongo_id": str(investor_doc["_id"]),
                "FirmName": investor["FirmName"],
                "SelectedIndustries": cleaned_industries,
                "SelectedStages": cleaned_stages,
                "InvestorLocation": investor["InvestorLocation"],
                "check_size_min_inr": min_inr,
                "check_size_max_inr": max_inr,
                "original_check_size": investor["CheckSizeRange"]
            }
            points_to_upsert.append(models.PointStruct(id=str(uuid.uuid4()), vector=[0.0], payload=payload))

        if points_to_upsert:
            client.upsert(collection_name="investors", points=points_to_upsert, wait=True)
            print("✅ Investor profiles upserted successfully!")
        else:
            print("⚠️ No investor profiles to upsert.")

    def get_filtered_investor_candidates(
        client: QdrantClient,         
        target_startup: dict, 
        funding_filter_inr: int,
        investor_collection: Any # Add mongo collection as an argument
    ) -> List[Dict[str, Any]]:
        """
        Step 1 of the pipeline: Performs fast filtering using Qdrant and returns a list 
        of full investor profiles from MongoDB for deep analysis.
        """
        # Extract startup details for the query
        startup_details = extract_startup_profile(target_startup, valueType=True)
        stage_filter = startup_details["CurrentStage"]
        industries_filter = startup_details["StartupIndustryCategories"]

        print("\n" + "="*50)
        print(f"🔍 [Step 1] Filtering candidates for startup: '{startup_details['StartupName']}'")
        print(f"  - Using Qdrant for initial semantic search and filtering...")
        print("="*50 + "\n")

        startup_text = (
            f"Pitch: {startup_details['BriefPitch']}. "
            f"Problem: {startup_details['ProblemStatement']}. "
            f"Solution: {startup_details['Solution']}."
        )
        # query_vector = model.encode(startup_text, normalize_embeddings=True).tolist()
        
        query_filter = models.Filter(
            must=[
                models.FieldCondition(key="SelectedStages", match=models.MatchValue(value=stage_filter.lower().strip())),
                models.FieldCondition(key="SelectedIndustries", match=models.MatchAny(any=[i.lower().strip() for i in industries_filter])),
                models.FieldCondition(key="check_size_min_inr", range=models.Range(lte=funding_filter_inr)),
                models.FieldCondition(key="check_size_max_inr", range=models.Range(gte=funding_filter_inr))
            ]
        )
        
        search_results = client.search(
            collection_name="investors",
            query_vector=[0.0],
            query_filter=query_filter,
            limit=15, # Get the top 15 most relevant candidates
            with_payload=True
        )
        
        if not search_results:
            print("  - No potential candidates found in Qdrant matching the criteria.")
            return []

        # --- KEY CHANGE: Use the mongo_id to fetch full documents ---
        investor_mongo_ids = [hit.payload["mongo_id"] for hit in search_results if hit.payload]
        print(f"🎯 Found {len(investor_mongo_ids)} potential candidates. Fetching full profiles from MongoDB...")

        # Convert string IDs to ObjectId for MongoDB query
        object_ids = [ObjectId(id_str) for id_str in investor_mongo_ids]
        
        # Fetch the full documents
        candidate_profiles = list(investor_collection.find({"_id": {"$in": object_ids}}))    
        print(f"✅ Retrieved {len(candidate_profiles)} full profiles for deep analysis.\n")

        return candidate_profiles
    def embed_and_upsert_startups(client: QdrantClient,
                                # model: SentenceTransformer,
                                startups: list):
        points_to_upsert = []
        print(f"✨ Embedding and preparing {len(startups)} startup profiles for upsert...")
        for startup_doc in startups:
            startup = extract_startup_profile(startup_doc, valueType=True)
            
            startup_text = (
                f"Pitch: {startup['BriefPitch']}. "
                f"Problem: {startup['ProblemStatement']}. "
                f"Solution: {startup['Solution']}."
            )
            cleaned_stages=startup["CurrentStage"].lower()
            cleaned_industries=[i.lower() for i in startup["StartupIndustryCategories"]]
            
            payload = {
                "mongo_id": str(startup_doc["_id"]),
                "StartupName": startup["StartupName"],
                "StartupIndustryCategories": cleaned_industries,
                "CurrentStage": cleaned_stages,
                "FundingRequirementINR": startup.get("FundingRequirementINR", 0) # Use .get for safety
            }
            points_to_upsert.append(models.PointStruct(id=str(uuid.uuid4()), vector=[0.0], payload=payload))

        if points_to_upsert:
            client.upsert(collection_name="startups", points=points_to_upsert, wait=True)
            print("✅ Startup profiles upserted successfully!")
        else:
            print("⚠️ No startup profiles to upsert.")
    def get_filtered_startup_candidates(
        client: QdrantClient, 
        # model: SentenceTransformer, 
        target_investor: dict, 
        startup_collection: Any
        ) -> List[Dict[str, Any]]:
        """
        Performs fast filtering using Qdrant to find startup candidates for an investor.
        """
        investor_details = extract_investor_profile(target_investor, valueType=True)
        investor_stages = [s.lower().strip() for s in investor_details["SelectedStages"]]
        investor_industries = [i.lower().strip() for i in investor_details["SelectedIndustries"]]
        min_check_size, max_check_size = parse_check_size(investor_details["CheckSizeRange"])

        print("\n" + "="*50)
        print(f"🔍 [Step 1] Filtering candidates for investor: '{investor_details['FirmName']}'")
        print(f"   - Using Qdrant for initial semantic search and filtering...")
        print("="*50 + "\n")

        # query_vector = model.encode(investor_details["BioThesis"], normalize_embeddings=True).tolist()
        print("Stage filter",investor_stages," Industries filter",investor_industries)
        query_filter = models.Filter(must=[
            models.FieldCondition(key="CurrentStage", match=models.MatchAny(any=investor_stages)),
            models.FieldCondition(key="StartupIndustryCategories", match=models.MatchAny(any=investor_industries)),
            models.FieldCondition(key="FundingRequirementINR", range=models.Range(gte=min_check_size, lte=max_check_size))
        ])
        
        search_results = client.search(
            collection_name="startups",
            query_vector=[0.0],
            query_filter=query_filter,
            limit=15,
            with_payload=True
        )
        
        if not search_results:
            print("   - No potential startup candidates found in Qdrant matching the criteria.")
            return []

        startup_mongo_ids = [hit.payload["mongo_id"] for hit in search_results if hit.payload]
        print(f"🎯 Found {len(startup_mongo_ids)} potential candidates. Fetching full profiles from MongoDB...")

        object_ids = [ObjectId(id_str) for id_str in startup_mongo_ids]
        candidate_profiles = []
        for id_str in object_ids:
            candidate_profiles.append(startup_collection.find_one({"_id": id_str}))
        # candidate_profiles = list(startup_collection.find({"_id": {"$in": object_ids}}))
        print(f"✅ Retrieved {len(candidate_profiles)} full profiles for deep analysis.\n")

        return candidate_profiles
    def get_database_collections():
        """Connect to MongoDB and return collections."""
        try:
            startup_collection = db_main["startup"]
            investor_collection = db_main["investor"]
            matches_collection = db_main["matches"]
            client.admin.command('ping')
            print(f"✅ Connected to MongoDB database: {MONGODB_CONFIG['database_name']}")
            
            return startup_collection, investor_collection, matches_collection, client
            
        except Exception as e:
            print(f"❌ MongoDB connection error: {e}")
            return None, None, None, None

    def parse_stringified_list(s: Any) -> List[str]:
        """
        Parses a string that represents a list into a Python list of strings.
        Handles formats like "['item1', 'item2']" or "item1, item2".
        """
        if isinstance(s, list):
            return [str(item).strip() for item in s]
        if not isinstance(s, str):
            return []
        
        # Clean the string: remove brackets, and single/double quotes
        s = s.strip().lstrip('[').rstrip(']')
        s = s.replace("'", "").replace('"', "")
        
        # Split by comma and clean up each item
        items = [item.strip() for item in s.split(',') if item.strip()]
        return items

    def extract_investor_profile(investor_doc: Dict[str, Any], valueType: bool = False) -> Any:
        """Extract investor profile from MongoDB document."""
        
        def safe_get(key: str, default: Any = "Not specified") -> Any:
            val = investor_doc.get(key, default)
            if val is None or (isinstance(val, str) and val.lower() in ['nan', '', 'null']):
                return default
            return val
        
        # When returning a dictionary for processing, ensure lists are actual lists.
        if valueType:
            return {
                "FirmName": safe_get('FirmName', 'Unknown Firm'),
                "Name": safe_get('Name', 'Unknown Investor'),
                "InvestorTitle": safe_get('InvestorTitle', ''),
                "BioThesis": safe_get('BioThesis', 'Not available'),
                # FIX: Parse stringified lists into actual Python lists
                "SelectedIndustries": parse_stringified_list(safe_get('SelectedIndustries', [])),
                "CheckSizeRange": str(safe_get('CheckSizeRange', '0L - 0L')), # Ensure it's a string
                "InvestorLocation": str(safe_get('InvestorLocation', 'Not specified')),
                # FIX: Parse stringified lists into actual Python lists
                "SelectedStages": parse_stringified_list(safe_get('SelectedStages', [])),
                "value_add": safe_get('value_add', 'Not specified')
            }
        
        else:
            firm_name = str(safe_get('FirmName', 'Unknown Firm'))
            bio_thesis = str(safe_get('BioThesis', 'Not available'))
            investment_focus = parse_stringified_list(safe_get('SelectedIndustries', []))
            check_size = str(safe_get('CheckSizeRange', 'Not specified'))
            investor_location = str(safe_get('InvestorLocation', 'Not specified'))
            selected_stages = parse_stringified_list(safe_get('SelectedStages', []))
            value_add = str(safe_get('value_add', 'Not specified'))

            profile = f"""
            **Investor Profile:**
            - **Firm**: {firm_name}
            - **Investment Thesis/Bio**: {bio_thesis}
            - **Focus Industries**: {', '.join(investment_focus)}
            - **Investment Stages**: {', '.join(selected_stages)}
            - **Check Size Range**: {check_size}
            - **Location**: {investor_location}
            - **Value Add**: {value_add}
            """.strip()
            return profile

    # extracting data for startup profiles --------------
    def extract_startup_profile(startup_doc: Dict[str, Any], valueType: bool = False) -> Any:
        """Extract startup profile from MongoDB document."""
        
        def safe_get(key: str, default: Any = "Not specified") -> Any:
            val = startup_doc.get(key, default)
            if val is None or (isinstance(val, str) and val.lower() in ['nan', '', 'null']):
                return default
            return val

        if valueType:
            return {
                "StartupName": str(safe_get('StartupName', 'Unknown Startup')),
                "BriefPitch": str(safe_get('BriefPitch', 'Not available')),
                "BusinessModel": str(safe_get('BusinessModel', 'Not specified')),
                "CurrentStage": str(safe_get('CurrentStage', 'Not specified')),
                "ProblemStatement": str(safe_get('ProblemStatement', 'Not available')),
                "Solution": str(safe_get('Solution', 'Not available')),                
                "StartupIndustryCategories": parse_stringified_list(safe_get('StartupIndustryCategories', [])),
            }
        else:
            # ... (Your existing string formatting code for display can remain here) ...
            # Again, the key fix is for the `valueType=True` case.
            startup_name = str(safe_get('StartupName', 'Unknown Startup'))
            brief_pitch = str(safe_get('BriefPitch', 'Not available'))
            current_stage = str(safe_get('CurrentStage', 'Not specified'))
            industry_categories = parse_stringified_list(safe_get('StartupIndustryCategories', []))
            
            profile = f"""
            **Startup Profile:**
            - **Company**: {startup_name}
            - **Industry Categories**: {', '.join(industry_categories)}
            - **Current Stage**: {current_stage}
            - **Brief Pitch**: {brief_pitch}
            """.strip()
            return profile    

    def create_matching_prompt(startup_profile: str, investor_profile: str) -> str:
        """Create the LLM prompt for startup-investor matching analysis."""
        
        return f"""
You are an expert venture capital analyst. Analyze the compatibility between this startup and investor pair.

{startup_profile}

{investor_profile}

**Task**: Score the match on a scale of 1-10 for each factor below, and provide a one-sentence justification for each score.

**Scoring Factors:**
1. **Sector Alignment** (1-10): How well do the startup's industry categories align with the investor's focus industries?
2. **Business Model Fit** (1-10): Does the startup's business model match the investor's preferences and portfolio patterns?
3. **Technology Adjacency** (1-10): Are there synergies between the startup's technology/solution and the investor's expertise or portfolio?
4. **Thesis Fit** (1-10): How well does this startup align with the investor's stated investment thesis and focus areas?
5. **Stage Fit** (1-10): Does the startup's current stage match the investor's typical investment stages?

**Response Format**: Respond ONLY with a valid JSON object in this exact format:

{{
"sector_alignment": {{"score": <integer_1_to_10>, "justification": "<one_sentence_explanation>"}},
"business_model_fit": {{"score": <integer_1_to_10>, "justification": "<one_sentence_explanation>"}},
"technology_adjacency": {{"score": <integer_1_to_10>, "justification": "<one_sentence_explanation>"}},
"thesis_fit": {{"score": <integer_1_to_10>, "justification": "<one_sentence_explanation>"}},
"stage_fit": {{"score": <integer_1_to_10>, "justification": "<one_sentence_explanation>"}}
}}

Provide specific, actionable justifications based on the actual data provided.
"""

    def call_gemini_api(prompt: str) -> Optional[str]:
        """Call Gemini API with the matching prompt."""
        try:
            model = "gemini-2.0-flash-exp"
            
            response=Gemclient.models.generate_content(
                model=model,
                contents=prompt,
                config={  
                    "temperature": 0.3,
                    "top_p": 0.8,
                    "top_k": 40,
                    "max_output_tokens": 1500,
                }
            )     
            print(response)             
            if response.text:
                return response.text.strip()
            
        except Exception as e:
            print(f"❌ Gemini API error: {e}")
            return None

    def parse_llm_response(response_text: str) -> Optional[Dict[str, Any]]:
        """Parse and validate LLM response."""
        if not response_text:
            return None
        
        try:
            cleaned_text = response_text.strip()
            
            if cleaned_text.startswith("```json"):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.startswith("```"):
                cleaned_text = cleaned_text[3:]
            if cleaned_text.endswith("```"):
                cleaned_text = cleaned_text[:-3]
            
            cleaned_text = cleaned_text.strip()
            
            scorecard = json.loads(cleaned_text)
            
            required_factors = set(SCORE_WEIGHTS.keys())
            if not required_factors.issubset(set(scorecard.keys())):
                print(f"⚠️ Missing factors in scorecard")
                return None
            
            for factor, data in scorecard.items():
                if not isinstance(data, dict) or 'score' not in data or 'justification' not in data:
                    print(f"⚠️ Invalid structure for {factor}")
                    return None
                
                score = data['score']
                if not isinstance(score, int) or not (1 <= score <= 10):
                    print(f"⚠️ Invalid score for {factor}: {score}")
                    return None
            
            return scorecard
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON parsing error: {e}")
            return None
        except Exception as e:
            print(f"❌ Response parsing error: {e}")
            return None

    def calculate_overall_score(scorecard: Dict[str, Any]) -> float:
        """Calculate weighted overall score."""
        if not scorecard:
            return 0.0
        
        total_score = 0.0
        for factor, weight in SCORE_WEIGHTS.items():
            if factor in scorecard:
                score = scorecard[factor].get('score', 0)
                total_score += score * weight
        
        return round(total_score, 1)

    def analyze_startup_investor_match(startup_doc: Dict[str, Any], investor_doc: Dict[str, Any],WaitTime: int=1) -> Tuple[float, Dict[str, Any]]:
        """
        Analyze a startup-investor pair from MongoDB documents.
        
        Returns:
            Tuple of (overall_score, scorecard_dict)
        """
        
        startup_profile = extract_startup_profile(startup_doc)
        investor_profile = extract_investor_profile(investor_doc)
        
        prompt = create_matching_prompt(startup_profile, investor_profile)
        
        max_retries = 3
        for attempt in range(max_retries):
            if USE_GEMINI:
                response = call_gemini_api(prompt)
            
            if response:
                scorecard = parse_llm_response(response)
                if scorecard:
                    overall_score = calculate_overall_score(scorecard)
                    return overall_score, scorecard
            
            if attempt < max_retries - 1:
                print(f"🔄 Retry {attempt + 1}/{max_retries}")
                time.sleep(WaitTime)
        
        print("❌ Failed to get valid response after retries")
        return 0.0, {}

    def save_match_to_db(matches_collection, startup_id: str, investor_id: str,overall_score: float,scorecard: Dict[str, Any]):
        """Save match result to MongoDB matches collection."""
        
        match_document = {
            "startup_id": startup_id,
            "investor_id": investor_id,
            "overall_score": overall_score,
            "scorecard": scorecard,
            "created_at": datetime.utcnow(),
            "status": "completed" if overall_score > 0 else "failed"
        }
        
        try:
            existing_match = matches_collection.find_one({
                "startup_id": startup_id,
                "investor_id": investor_id
            })
            
            if existing_match:
                matches_collection.update_one(
                    {"_id": existing_match["_id"]},
                    {"$set": match_document}
                )
            else:
                matches_collection.insert_one(match_document)
                
            return True
            
        except Exception as e:
            print(f"❌ Error saving match to database: {e}")
            return False

    def get_top_matches_for_startup(startup_id: str, top_k: int = 10):
        """Get top matches for a specific startup from the database."""
        
        startup_collection, investor_collection, matches_collection, client = get_database_collections()
        
        if matches_collection is None:
            print("❌ Failed to connect to database")
            return []
        
        try:
            matches = list(matches_collection.find(
                {"startup_id": startup_id, "overall_score": {"$gt": 0}}
            ).sort("overall_score", -1).limit(top_k))
            
            print(f"Found {len(matches)} matches for startup {startup_id}")
            
            investor_profiles=[]
            if investor_collection is None or startup_collection is None:
                return []
                
            for i, match in enumerate(matches, 1):
                startup_id_match = match.get("startup_id")
                startup=startup_collection.find_one({"_id": ObjectId(startup_id_match)})
                investor_id = match.get("investor_id")
                investor=investor_collection.find_one({"_id": ObjectId(investor_id)})
                
                if investor and startup:
                    
                    startup_name=str(startup.get("StartupName","Not Available"))
                    investor_id=str(investor.get("_id","Not Available"))
                    investor_name=str(investor.get("FirmName","Not Available"))
                    inv_email=str(investor.get("CompanyEmail","Not Available"))
                    inv_company=str(investor.get("FirmName","Unknown Company"))
                    investor_location=str(investor.get("InvestorLocation","__"))
                    investor_title=str(investor.get("InvestorTitle",""))
                    investor_website=str(investor.get("InvestorWebsite",""))
                    social_link=str(investor.get("InvestorSocialMedia",""))
                    overall_score_val = match.get("overall_score", 0)
                    
                    investor_profiles.append({
                        "Startup_name":startup_name,
                        "Investor_ID":investor_id,
                        "Investor_Name":investor_name,
                        "Investor_Company":inv_company,
                        "Investor_Email":inv_email,
                        "Investor_Location":investor_location,
                        "Investor_Title":investor_title,
                        "Investor_Website":investor_website,
                        "Investor_Social_Media":social_link,
                        "Overall_Score": overall_score_val
                    })
            
            return investor_profiles
        
        except Exception as e:
            print(f"❌ Error retrieving matches: {e}")
            return []

    def get_top_matches_for_investor(investor_id: str, top_k: int = 10):
        """Get top matches for a specific investor from the database."""
        
        startup_collection, investor_collection, matches_collection, client = get_database_collections()
        
        if matches_collection is None:
            # print("❌ Failed to connect to database")
            return []
        
        try:
            matches = list(matches_collection.find(
                {"investor_id": investor_id, "overall_score": {"$gt": 0}}
            ).sort("overall_score", -1).limit(top_k))
            
            print(f"Found {len(matches)} matches for investor {investor_id}, {matches}")
            startup_profiles = []
            if investor_collection is None or startup_collection is None:
                return []
                
            for i, match in enumerate(matches, 1):
                startup_id = match.get("startup_id")
                startup = startup_collection.find_one({"_id": ObjectId(startup_id)})
                investor_id_match = match.get("investor_id")
                investor = investor_collection.find_one({"_id": ObjectId(investor_id_match)})
                
                if startup and investor:
                    startup_id = str(startup.get("_id","Not Available"))
                    startup_name = str(startup.get("StartupName", "Unknown Startup"))
                    founder_name = str(startup.get("FounderName", "Unknown Founder"))
                    startup_email = str(startup.get("CompanyEmail", "Not Available"))
                    startup_location = str(startup.get("Location", "__"))
                    startup_website = str(startup.get("StartupWebsiteUrl", ""))
                    overall_score_val = match.get("overall_score", 0)
                    
                    startup_profiles.append({
                        "Startup_ID":startup_id,
                        "Startup_Name": startup_name,
                        "Founder_Name": founder_name,
                        "Startup_Email": startup_email,
                        "Startup_Location": startup_location,
                        "Startup_Website": startup_website,
                        "Overall_Score": overall_score_val
                    })
            print(startup_profiles)
            return startup_profiles
        
        except Exception as e:
            print(f"❌ Error retrieving matches: {e}")
            return []

    def create_matches(isStartup:bool):
        startup_collection, investor_collection, matches_collection, client = get_database_collections()

        if startup_collection is None or investor_collection is None or matches_collection is None or client is None:          
            return jsonify({"Success": False, "message":"Failed to fetch collections"})

        try:
            if isStartup:
                Startup = startup_collection.find_one({"_id": ObjectId(User_id)})
                
                if investor_collection is not None:
                    investors = list(investor_collection.find({}))
                
                if not Startup or not investors:
                    return jsonify({"Success": False, "message":"No startup or investor data found in database"})
                            
                startup_name = Startup.get("StartupName", "Unknown Startup")
                print(f"Processing {len(investors)} investors for startup: {startup_name}")
                
                for investor in investors:                
                    investor_name = investor.get("Name", investor.get("Username", "Unknown Investor"))
                    overall_score, scorecard = analyze_startup_investor_match(startup_doc= Startup,investor_doc= investor,WaitTime= 5)                     
                    investor_id = str(investor.get("_id"))
                    
                    save_match_to_db(matches_collection, User_id, investor_id=investor_id,overall_score=overall_score,scorecard=scorecard)
                    print(f"Saved match for {investor_name} with score {overall_score}")
                    time.sleep(5)
                    
            else:
                investor = investor_collection.find_one({"_id": ObjectId(User_id)})
                
                if startup_collection is not None:
                    startups = list(startup_collection.find({}))
                
                if not investor or not startups:
                    return jsonify({"Success": False, "message":"No investor or startup data found in database"})
                            
                investor_name = investor.get("Username", "Unknown investor")
                print(f"Processing {len(startups)} startups for investor: {investor_name}")
                
                for startup in startups:                
                    overall_score, scorecard = analyze_startup_investor_match(startup_doc=startup, investor_doc=investor,WaitTime= 5)                     
                    startup_id = str(startup.get("_id"))
                    
                    save_match_to_db(matches_collection, startup_id, investor_id=User_id,overall_score=overall_score,scorecard=scorecard)
                    startup_name = startup.get("StartupName", "Unknown Startup")
                    print(f"Saved match for {startup_name} with score {overall_score}")
                    time.sleep(5)
                    
        except Exception as e:
            print(f"Error in create_matches_trial: {e}")
            return jsonify({"Success": False, "message": f"Error: {str(e)}"})
        
    def create_matches_trial(isStartup:bool,maxRequests:int=5,candidates:Optional[list]=None):
        startup_collection, investor_collection, matches_collection, client = get_database_collections()

        # seconds between requests to avoid rate limits
        if startup_collection is None or matches_collection is None or investor_collection is None or client is None:          
            return  ({"Success": False, "message":"Failed to fetch collections"})

        try:
            if isStartup:
                Startup = startup_collection.find_one({"_id": ObjectId(User_id)})
                investors = candidates if candidates else []
                
                if not Startup or not investors:
                    return  ({"Success": False, "message":"No startup or investor data found in database"})
                            
                startup_name = Startup.get("StartupName", "Unknown Startup")
                print(f"Processing {len(investors)} investors for startup: {startup_name}")
                count=15
                for investor in investors:                
                    investor_name = investor.get("Name", investor.get("Username", "Unknown Investor"))
                    overall_score, scorecard = analyze_startup_investor_match(startup_doc= Startup,investor_doc= investor,WaitTime= 5)                     
                    investor_id = str(investor.get("_id"))        
                    save_match_to_db(matches_collection, User_id, investor_id=investor_id,overall_score=overall_score,scorecard=scorecard)
                    time.sleep(1)
                    if count<=0:    
                        break
                    count-=1
            else:
                investor = investor_collection.find_one({"_id": ObjectId(User_id)})
                
                startups = candidates if candidates else []
                
                if not investor or not startups:
                    return jsonify({"Success": False, "message":"No investor or startup data found in database"})
                            
                investor_name = investor.get("Username", "Unknown investor")
                print(f"Processing {len(startups)} startups for investor: {investor_name}")
                count=15
                for startup in startups:                
                    overall_score, scorecard = analyze_startup_investor_match(startup_doc=startup, investor_doc=investor,WaitTime= 5)                     
                    startup_id = str(startup.get("_id"))
                    
                    save_match_to_db(matches_collection, startup_id, investor_id=User_id,overall_score=overall_score,scorecard=scorecard)
                    startup_name = startup.get("StartupName", "Unknown Startup")
                    print(f"Saved match for {startup_name} with score {overall_score}")
                    time.sleep(1)                    
                    if count<=0:    
                        break
                    count-=1
        except Exception as e:
            print(f"Error in create_matches_trial: {e}")
            return  ({"Success": False, "message": f"Error: {str(e)}"})
        
    def run_matching_startup_pipeline(startup_id: str, funding_amount_inr: int, top_k: int = 10):

        startup_collection, investor_collection, matches_collection, client = get_database_collections()
        if startup_collection is None or investor_collection is None or matches_collection is None or client is None:          
            print({"Success": False, "message":"Failed to fetch collections"})
            exit(1)

        investor_profiles=list(investor_collection.find({}))
        target_startup_profile=startup_collection.find_one({"_id": ObjectId(User_id)})
        try:
            target_startup = startup_collection.find_one({"_id": ObjectId(startup_id)})
            if not target_startup:
                print(f"❌ Startup with ID {startup_id} not found.")
                return

            setup_collection(qdrant_client, "investors")
            create_payload_indexes(qdrant_client, "investors")
            embed_and_upsert_investors(qdrant_client, investor_profiles)
            
            required_funding_inr = 12_500_000 # ₹1.25 Cr

            if target_startup_profile:
                startup_stage = target_startup_profile["CurrentStage"]
                startup_industries = target_startup_profile["StartupIndustryCategories"]        
                candidate_investors=get_filtered_investor_candidates(qdrant_client, target_startup_profile, required_funding_inr, investor_collection=investor_collection)                
            return candidate_investors
        finally:
            print("Startup pipeline completed.")
            
    def run_investor_matching_pipeline(investor_id: str):
        startup_collection, investor_collection, _, client = get_database_collections()
        if startup_collection is None or investor_collection is None or client is None:
            print({"Success": False, "message": "Failed to fetch collections"})
            exit(1)

        all_startups = list(startup_collection.find({}))
        target_investor = investor_collection.find_one({"_id": ObjectId(investor_id)})
        
        if not target_investor:
            print(f"❌ Investor with ID {investor_id} not found.")
            return []

        try:
            setup_collection(qdrant_client, "startups")

            qdrant_client.create_payload_index("startups", "CurrentStage", models.PayloadSchemaType.KEYWORD)
            qdrant_client.create_payload_index("startups", "StartupIndustryCategories", models.PayloadSchemaType.KEYWORD)
            qdrant_client.create_payload_index("startups", "FundingRequirementINR", models.PayloadSchemaType.FLOAT)
            
            embed_and_upsert_startups(qdrant_client, all_startups)
            
            # Get the filtered list of candidates
            candidate_startups = get_filtered_startup_candidates(qdrant_client, target_investor, startup_collection)
            return candidate_startups

        finally:
            # if qdrant_client: qdrant_client.close()
            # if client: client.close()
            print("close")

    def main(isStartup:bool):            
        if isStartup:
            candidate_investors=run_matching_startup_pipeline(startup_id=User_id, funding_amount_inr=12500000, top_k=10)
            create_matches_trial(isStartup,candidates=candidate_investors) 
            result = get_top_matches_for_startup(User_id, 5)
        else:
            candidate_startups=run_investor_matching_pipeline(investor_id=User_id)
            create_matches_trial(isStartup,candidates=candidate_startups) 
            result = get_top_matches_for_investor(User_id, 5)
            
            print(f"Retrieved {len(result)} matches")
        return ({"Success":True,"result":result})
    
    return main(isStartup)