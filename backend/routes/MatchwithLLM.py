from pymongo import MongoClient
import google.genai as genai
import os
import json
import time
from tqdm import tqdm
from dotenv import load_dotenv
from typing import Dict, Any, Optional, Tuple, List
from bson import ObjectId
from datetime import datetime
from db.db import db_main, client
from pymongo import MongoClient
from flask import Blueprint, request,jsonify
import re

load_dotenv()

llm_bp_model = Blueprint("llmmodel", __name__)

@llm_bp_model.route("/modelanalysis", methods=["POST"])
def LLM():
    data = request.json
    if not data:
        return  jsonify({"Success": False, "message": "No data provided in request."}), 400
        
    User_id = data.get("UserId")
    isStartup = data.get("isStartup")

    if User_id is None or isStartup is None:
        return  jsonify({"Success": False, "message": "UserId and isStartup fields are required."}), 400

    USE_GEMINI = True

    if USE_GEMINI:
        try:
            Gemclient = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
            print("✅ Gemini API configured")
        except Exception as e:
            print(f"❌ Error configuring Gemini API: {e}")
            return  jsonify({"Success": False, "message": f"API configuration error: {e}"})
    else:
        # Placeholder for OpenAI API configuration if needed
        print("OpenAI configuration not implemented in this version.")
        pass

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
    # def connect_to_mongo():
    #     client = MongoClient(
    #         MONGODB_CONFIG['connection_string']
    #         )
    #     db_main = client[MONGODB_CONFIG['database_name']]

    #     return client, db_main
    def get_database_collections():
        """Connect to MongoDB and return collections."""
        try:
            # client, db_main = connect_to_mongo()
            startup_collection = db_main["startup"]
            investor_collection = db_main["investor"]
            matches_collection = db_main["matches"]
            client.admin.command('ping')
            print(f"✅ Connected to MongoDB database: {MONGODB_CONFIG['database_name']}")
            return startup_collection, investor_collection, matches_collection
        except Exception as e:
            print(f"❌ MongoDB connection error: {e}")
            return None, None, None    

    def get_filtered_investor_candidates_from_mongo(
        investor_collection: Any, 
        target_startup: dict
    ) -> List[Dict[str, Any]]:
        """
        [REFACTORED] Performs filtering directly in MongoDB to find suitable investors for a startup.
        
        Prerequisite: Assumes investor documents have 'check_size_min_inr' and 'check_size_max_inr' fields.
        """
        startup_details = extract_startup_profile(target_startup, valueType=True)
        stage_filter = startup_details["CurrentStage"]
        industries_filter = startup_details["StartupIndustryCategories"]
        funding_requirement = startup_details.get("FundingRequirementINR", 10000000)

        print("\n" + "="*50)
        print(f"🔍 [Step 1] Filtering investor candidates for startup: '{startup_details['StartupName']}' using MongoDB QL for stage {stage_filter} and industries {industries_filter}")
        print("="*50 + "\n")

        query = {
            "SelectedStages": stage_filter,
            "SelectedIndustries": {"$in": industries_filter},
            "check_size_min_inr": {"$lte": funding_requirement},
            "check_size_max_inr": {"$gte": funding_requirement}
        }
        
        # Limit to 50 candidates for LLM analysis to manage costs and time
        candidate_profiles = list(investor_collection.find(query).limit(15))
        
        print(f"✅ Retrieved {len(candidate_profiles)} potential investor profiles from MongoDB for deep analysis.\n")
        return candidate_profiles

    def get_filtered_startup_candidates_from_mongo(
        startup_collection: Any, 
        target_investor: dict
    ) -> List[Dict[str, Any]]:
        """
        [REFACTORED] Performs filtering directly in MongoDB to find suitable startups for an investor.
        """
        investor_details = extract_investor_profile(target_investor, valueType=True)
        print("Investor Details : ",investor_details)
        investor_stages = [s.strip() for s in investor_details["SelectedStages"]]
        investor_industries = [i.strip() for i in investor_details["SelectedIndustries"]]
        # min_check_size, max_check_size = parse_check_size(investor_details["CheckSizeRange"][len(investor_details["CheckSizeRange"]-1)])
        check_size_min_inr=investor_details["check_size_min_inr"]
        check_size_max_inr=investor_details["check_size_max_inr"]
        print("\n" + "="*50)
        print(f"🔍 [Step 1] Filtering startup candidates for investor: '{investor_details['FirmName']}' using MongoDB QL")
        print("="*50 + "\n")

        query = {
            "CurrentStage": {"$in": investor_stages},
            "StartupIndustryCategories": {"$in": investor_industries},
            "FundingRequirementINR": {"$gte":check_size_min_inr,"$lte": check_size_max_inr}
        }
        
        # Limit to 50 candidates for LLM analysis
        candidate_profiles = list(startup_collection.find(query).limit(15))
        
        print(f"✅ Retrieved {len(candidate_profiles)} potential startup profiles from MongoDB for deep analysis.\n")
        return candidate_profiles            

    def parse_stringified_list(s: Any) -> List[str]:
        if isinstance(s, list): return [str(item).strip() for item in s]
        if not isinstance(s, str): return []
        s = s.strip().lstrip('[').rstrip(']').replace("'", "").replace('"', "")
        return [item.strip() for item in s.split(',') if item.strip()]

    def extract_investor_profile(investor_doc: Dict[str, Any], valueType: bool = False) -> Any:
        def safe_get(key: str, default: Any = "Not specified"):
            val = investor_doc.get(key, default)
            return default if val is None or (isinstance(val, str) and val.lower() in ['nan', '', 'null']) else val
        
        if valueType:
            return {
                "FirmName": safe_get('FirmName', 'Unknown Firm'),"BioThesis": safe_get('BioThesis', 'Not available'),
                "SelectedIndustries": parse_stringified_list(safe_get('SelectedIndustries', [])),
                "check_size_min_inr": int(safe_get('check_size_min_inr', 0)),
                "check_size_max_inr": int(safe_get('check_size_max_inr', 1000000000)),
                "InvestorLocation": str(safe_get('InvestorLocation', 'Not specified')),
                "SelectedStages": parse_stringified_list(safe_get('SelectedStages', [])),
            }
        else:
            profile = f"""
            **Investor Profile:**
            - **Firm**: {str(safe_get('FirmName', 'Unknown Firm'))}
            - **Investment Thesis/Bio**: {str(safe_get('BioThesis', 'Not available'))}
            - **Focus Industries**: {', '.join(parse_stringified_list(safe_get('SelectedIndustries', [])))}
            - **Investment Stages**: {', '.join(parse_stringified_list(safe_get('SelectedStages', [])))}
            - **Check Size Range**: {str(safe_get('CheckSizeRange', 'Not specified'))}
            - **Location**: {str(safe_get('InvestorLocation', 'Not specified'))}
            """.strip()
            return profile

    def extract_startup_profile(startup_doc: Dict[str, Any], valueType: bool = False) -> Any:
        def safe_get(key: str, default: Any = "Not specified"):
            val = startup_doc.get(key, default)
            return default if val is None or (isinstance(val, str) and val.lower() in ['nan', '', 'null']) else val

        if valueType:
            return {
                "StartupName": str(safe_get('StartupName', 'Unknown Startup')),"BriefPitch": str(safe_get('BriefPitch', 'Not available')),
                "CurrentStage": str(safe_get('CurrentStage', 'Not specified')),"ProblemStatement": str(safe_get('ProblemStatement', 'Not available')),
                "Solution": str(safe_get('Solution', 'Not available')),                
                "StartupIndustryCategories": parse_stringified_list(safe_get('StartupIndustryCategories', [])),
                "FundingRequirementINR": int(safe_get('FundingRequirementINR', 0))
            }
        else:
            profile = f"""
            **Startup Profile:**
            - **Company**: {str(safe_get('StartupName', 'Unknown Startup'))}
            - **Industry Categories**: {', '.join(parse_stringified_list(safe_get('StartupIndustryCategories', [])))}
            - **Current Stage**: {str(safe_get('CurrentStage', 'Not specified'))}
            - **Brief Pitch**: {str(safe_get('BriefPitch', 'Not available'))}
            """.strip()
            return profile    

    def create_matching_prompt(startup_profile: str, investor_profile: str) -> str:
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
        """
        
    def call_gemini_api(prompt: str) -> Optional[str]:
        """Call Gemini API with the matching prompt."""
        try:
             model = "gemini-2.0-flash-001"
            # Assuming Gemclient is initialized globally in the request context
             response=Gemclient.models.generate_content(
            model=model,
            contents=prompt,
            config={  
                "temperature": 0.3,
                "top_p": 0.8,
                "top_k": 40,
                "max_output_tokens": 2000,
                }
            )
             if response.text:
                return response.text.strip() if response.candidates else None
        except Exception as e:
            print(f"❌ Gemini API error: {e}")
            return None

    def parse_llm_response(response_text: str) -> Optional[Dict[str, Any]]:
        if not response_text: return None
        try:
            cleaned_text = response_text.strip().removeprefix("```json").removesuffix("```").strip()
            scorecard = json.loads(cleaned_text)
            if not set(SCORE_WEIGHTS.keys()).issubset(scorecard.keys()): return None
            return scorecard
        except (json.JSONDecodeError, Exception) as e:
            print(f"❌ Response parsing error: {e}")
            return None

    def calculate_overall_score(scorecard: Dict[str, Any]) -> float:
        if not scorecard: return 0.0
        total_score = sum(scorecard.get(factor, {}).get('score', 0) * weight for factor, weight in SCORE_WEIGHTS.items())
        return round(total_score, 1)

    def analyze_startup_investor_match(startup_doc: Dict[str, Any], investor_doc: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        startup_profile = extract_startup_profile(startup_doc)
        investor_profile = extract_investor_profile(investor_doc)
        prompt = create_matching_prompt(startup_profile, investor_profile)
        
        for attempt in range(3):
            response = call_gemini_api(prompt)
            if response:
                scorecard = parse_llm_response(response)
                if scorecard:
                    return calculate_overall_score(scorecard), scorecard
            time.sleep(2) # Wait before retrying
        return 0.0, {}

    def save_match_to_db(matches_collection, startup_id: str, investor_id: str, overall_score: float, scorecard: Dict[str, Any]):
        match_document = {
            "startup_id": startup_id, "investor_id": investor_id,
            "overall_score": overall_score, "scorecard": scorecard,
            "created_at": datetime.utcnow(),
            "status": "completed" if overall_score > 0 else "failed"
        }
        try:
            matches_collection.update_one(
                {"startup_id": startup_id, "investor_id": investor_id},
                {"$set": match_document},
                upsert=True
            )
            return True
        except Exception as e:
            print(f"❌ Error saving match to database: {e}")
            return False

    def get_top_matches_for_startup(startup_id: str, top_k: int = 10):
        """Get top matches for a specific startup from the database."""
        
        startup_collection, investor_collection, matches_collection = get_database_collections()
        
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
                    investor_name=str(investor.get("FirmName","Not Available"))
                    investor_id=str(investor.get("_id","Not Available"))
                    inv_email=str(investor.get("CompanyEmail","Not Available"))
                    inv_company=str(investor.get("FirmName","Unknown Company"))
                    investor_location=str(investor.get("InvestorLocation","__"))
                    investor_title=str(investor.get("InvestorTitle",""))
                    investor_website=str(investor.get("InvestorWebsite",""))
                    social_link=str(investor.get("InvestorSocialMedia",""))
                    overall_score_val = match.get("overall_score", 0)
                    
                    investor_profiles.append({
                        "Investor_Name":investor_name,
                        "Investor_ID":investor_id,
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
        
        startup_collection, investor_collection, matches_collection = get_database_collections()
        
        if matches_collection is None:
            # print("❌ Failed to connect to database")
            return []
        
        try:
            matches = list(matches_collection.find(
                {"investor_id": investor_id, "overall_score": {"$gt": 0}}
            ).sort("overall_score", -1).limit(top_k))
            
            print(f"Found {len(matches)} matches for investor {investor_id}")
            
            startup_profiles = []
            if investor_collection is None or startup_collection is None:
                return []
                
            for i, match in enumerate(matches, 1):
                startup_id = match.get("startup_id")
                startup = startup_collection.find_one({"_id": ObjectId(startup_id)})
                investor_id_match = match.get("investor_id")
                investor = investor_collection.find_one({"_id": ObjectId(investor_id_match)})
                
                if startup and investor:
                    startup_name = str(startup.get("StartupName", "Unknown Startup"))
                    startup_id = str(startup.get("_id","Not Available"))
                    founder_name = str(startup.get("FounderName", "Unknown Founder"))
                    startup_email = str(startup.get("CompanyEmail", "Not Available"))
                    startup_location = str(startup.get("Location", "__"))
                    startup_website = str(startup.get("StartupWebsiteUrl", ""))
                    overall_score_val = match.get("overall_score", 0)
                    
                    startup_profiles.append({
                        "Startup_Name": startup_name,
                        "Startup_ID":startup_id,
                        "Founder_Name": founder_name,
                        "Startup_Email": startup_email,
                        "Startup_Location": startup_location,
                        "Startup_Website": startup_website,
                        "Overall_Score": overall_score_val
                    })
            
            return startup_profiles
        
        except Exception as e:
            print(f"❌ Error retrieving matches: {e}")
            return []


    def create_matches_for_candidates(target_doc: Dict[str, Any], candidates: List[Dict[str, Any]], is_target_startup: bool):
        """Processes a list of candidates against a single target document."""
        _, _, matches_collection = get_database_collections()
        if matches_collection is None or not candidates:
            print("No candidates or database connection to process.")
            return

        target_id = str(target_doc["_id"])
        
        # Limit processing to a max of 15 candidates to control cost/time
        for candidate_doc in tqdm(candidates[:15], desc="Analyzing matches"):
            if is_target_startup:
                startup_doc, investor_doc = target_doc, candidate_doc
                startup_id, investor_id = target_id, str(candidate_doc["_id"])
            else:
                startup_doc, investor_doc = candidate_doc, target_doc
                startup_id, investor_id = str(candidate_doc["_id"]), target_id
            
            overall_score, scorecard = analyze_startup_investor_match(startup_doc, investor_doc)
            
            if overall_score > 0:
                save_match_to_db(matches_collection, startup_id, investor_id, overall_score, scorecard)
                print(f"Saved match: S({startup_id}) - I({investor_id}) | Score: {overall_score}")
            
            time.sleep(1) # Rate limiting

    def run_matching_pipeline(isStartup: bool, user_id: str):
        """[REFACTORED] Main pipeline orchestrator."""
        startup_collection, investor_collection, _ = get_database_collections()
        if (startup_collection is None or investor_collection is None):
            return {"Success": False, "message": "Failed to connect to database collections"}

        if isStartup:
            target_startup = startup_collection.find_one({"_id": ObjectId(user_id)})
            if not target_startup:
                return {"Success": False, "message": f"Startup with ID {user_id} not found."}
            
            candidate_investors = get_filtered_investor_candidates_from_mongo(investor_collection, target_startup)
            create_matches_for_candidates(target_startup, candidate_investors, is_target_startup=True)
            result = get_top_matches_for_startup(user_id, 5)
        else:
            target_investor = investor_collection.find_one({"_id": ObjectId(user_id)})
            if not target_investor:
                return {"Success": False, "message": f"Investor with ID {user_id} not found."}

            candidate_startups = get_filtered_startup_candidates_from_mongo(startup_collection, target_investor)
            create_matches_for_candidates(target_investor, candidate_startups, is_target_startup=False)
            result = get_top_matches_for_investor(user_id, 5)
            
        print(f"Retrieved {len(result)} final matches.")
        print(result)
        return {"Success": True, "result": result}
    
    # --- Entry point of the Flask route ---
    return jsonify(run_matching_pipeline(isStartup, User_id))
