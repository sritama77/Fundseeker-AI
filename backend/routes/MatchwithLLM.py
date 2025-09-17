import pymongo
from pymongo import MongoClient
import google.genai as genai
from google.genai import types
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
# --- 1. CONFIGURATION ---
load_dotenv()


llm_bp_model = Blueprint("llmmodel",__name__)


@llm_bp_model.route("/modelanalysis",methods=["POST"])
def LLM():
# Configure APIs - you can choose which one to us
    data = request.json
    if data:
        User_id = data["UserId"]
        isStartup = data["isStartup"]

    USE_GEMINI = True  # Set to False to use OpenAI instead

    if USE_GEMINI:
        try:
            Gemclient=genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
            print("✅ Gemini API configured")
        except Exception as e:
            print(f"❌ Error configuring Gemini API: {e}")
            exit(1)
    else:
        try:
            openai.api_key = os.getenv("OPENAI_API_KEY")
            print("✅ OpenAI API configured")
        except Exception as e:
            print(f"❌ Error configuring OpenAI API: {e}")
            exit(1)

    # Scoring weights for final calculation
    SCORE_WEIGHTS = {
        "sector_alignment": 0.25,
        "business_model_fit": 0.20,
        "technology_adjacency": 0.20,
        "thesis_fit": 0.25,
        "stage_fit": 0.10,
    }

    # Model configurations

    OPENAI_CONFIG = {
        "model": "gpt-3.5-turbo",
        "temperature": 0.3,
        "max_tokens": 1000,
    }

    # MongoDB Configuration
    MONGODB_CONFIG = {
        "connection_string": os.getenv("MONGODB_URL", "mongodb://localhost:27017/"),
        "database_name": os.getenv("DATABASE_NAME", "fundseeker"),
        "startup_collection": "startup",
        "investor_collection": "investor",
        "matches_collection": "matches"
    }

    # --- 2. DATABASE CONNECTION ---
    def get_database_collections():
        """Connect to MongoDB and return collections."""
        try:
            # client = MongoClient(MONGODB_CONFIG["connection_string"])
            # db = client[MONGODB_CONFIG["database_name"]]
            
            # startup_collection = db[MONGODB_CONFIG["startup_collection"]]
            # investor_collection = db[MONGODB_CONFIG["investor_collection"]]
            # matches_collection = db[MONGODB_CONFIG["matches_collection"]]
            
            # Test connection
            startup_collection = db_main["startup"]
            investor_collection = db_main["investor"]
            matches_collection = db_main["matches"]
            client.admin.command('ping')
            print(f"✅ Connected to MongoDB database: {MONGODB_CONFIG['database_name']}")
            
            return startup_collection, investor_collection, matches_collection, client
            
        except Exception as e:
            print(f"❌ MongoDB connection error: {e}")
            return None, None, None, None


    # --- 3. DATA EXTRACTION FUNCTIONS ---
    # extracting data for investor profiles --------------
    def extract_investor_profile(investor_doc: Dict[str, Any]) -> str:
        """Extract investor profile from MongoDB document."""
        
        def safe_get(key: str, default: str = "Not specified") -> str:
            val = investor_doc.get(key, default)
            if val is None or (isinstance(val, str) and val.lower() in ['nan', '', 'null']):
                return default
            return str(val)
        
        def format_list(val: Any) -> str:
            if isinstance(val, list):
                return ', '.join(str(x) for x in val if x)
            return str(val) if val else "Not specified"
        
        # Extract key information matching your schema
        firm_name = safe_get('FirmName', 'Unknown Firm')
        name = safe_get('Name', 'Unknown Investor')
        title = safe_get('InvestorTitle', '')
        company = safe_get('Company', firm_name)
        bio_thesis = safe_get('BioThesis', 'Not available')
        investment_focus = safe_get('investment_focus', safe_get('SelectedIndustries', 'Not specified'))
        check_size = safe_get('CheckSizeRange', 'Not specified')
        investor_location = safe_get('InvestorLocation', safe_get('Location', 'Not specified'))
        selected_stages = safe_get('SelectedStages', safe_get('typical_stage', 'Not specified'))
        ticket_type = safe_get('TicketType', 'Not specified')
        syndication_preference = safe_get('SyndicationPreference', 'Not specified')
        portfolio_examples = safe_get('portfolio_examples', 'Not specified')
        value_add = safe_get('value_add', 'Not specified')
        
        profile = f"""
    **Investor Profile:**
    - **Name**: {name} {f"({title})" if title else ""} at {company}
    - **Investment Thesis/Bio**: {bio_thesis}
    - **Focus Industries**: {format_list(investment_focus)}
    - **Investment Stages**: {format_list(selected_stages)}
    - **Check Size Range**: {check_size}
    - **Location**: {investor_location}
    - **Ticket Type**: {format_list(ticket_type)}
    - **Syndication Preference**: {syndication_preference}
    - **Portfolio Examples**: {portfolio_examples}
    - **Value Add**: {value_add}
        """.strip()
        
        return profile

    # extracting data for startup profiles --------------
    def extract_startup_profile(startup_doc: Dict[str, Any]) -> str:
        """Extract startup profile from MongoDB document."""
        
        def safe_get(key: str, default: str = "Not specified") -> str:
            val = startup_doc.get(key, default)
            if val is None or (isinstance(val, str) and val.lower() in ['nan', '', 'null']):
                return default
            return str(val)
        
        def format_list(val: Any) -> str:
            if isinstance(val, list):
                return ', '.join(str(x) for x in val if x)
            return str(val) if val else "Not specified"
        
        # Extract key information matching your schema
        startup_name = safe_get('StartupName', 'Unknown Startup')
        founder_name = safe_get('FounderName', 'Unknown Founder')
        brief_pitch = safe_get('BriefPitch', 'Not available')
        business_model = safe_get('BusinessModel', 'Not specified')
        current_stage = safe_get('CurrentStage', 'Not specified')
        location = safe_get('Location', 'Not specified')
        elevator_pitch = safe_get('ElevatorPitch', 'Not available')
        problem_statement = safe_get('ProblemStatement', 'Not available')
        solution = safe_get('Solution', 'Not available')
        competitors = safe_get('Competitors', 'Not specified')
        industry_categories = safe_get('StartupIndustryCategories', safe_get('Industry', 'Not specified'))
        website = safe_get('StartupWebsiteUrl', 'Not specified')
        
        profile = f"""
    **Startup Profile:**
    - **Company**: {startup_name}
    - **Founder**: {founder_name}
    - **Website**: {website}
    - **Industry Categories**: {format_list(industry_categories)}
    - **Current Stage**: {current_stage}
    - **Location**: {location}
    - **Brief Pitch**: {brief_pitch}
    - **Business Model**: {business_model}
    - **Problem Statement**: {problem_statement}
    - **Solution**: {solution}
    - **Elevator Pitch**: {elevator_pitch}
    - **Key Competitors**: {competitors}
        """.strip()
        
        return profile


    # --- 4. PROMPT ENGINEERING ---
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


    # --- 5. LLM API FUNCTIONS ---
    # calling the gemini api -----------------
    def call_gemini_api(prompt: str) -> Optional[str]:
        """Call Gemini API with the matching prompt."""
        try:
            model = "gemini-1.5-flash"
            
            response=Gemclient.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfigDict({    
        "temperature": 0.3,
        "top_p": 0.8,
        "top_k": 40,
        "max_output_tokens": 1024,
    })
            )                  
            if response.text:
                return response.text.strip()
            
        except Exception as e:
            print(f"❌ Gemini API error: {e}")
            return None


    # --- 6. SCORING FUNCTIONS ---
    def parse_llm_response(response_text: str) -> Optional[Dict[str, Any]]:
        """Parse and validate LLM response."""
        if not response_text:
            return None
        
        try:
            # Clean the response
            cleaned_text = response_text.strip()
            
            # Remove markdown formatting if present
            if cleaned_text.startswith("```json"):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.startswith("```"):
                cleaned_text = cleaned_text[3:]
            if cleaned_text.endswith("```"):
                cleaned_text = cleaned_text[:-3]
            
            cleaned_text = cleaned_text.strip()
            
            # Parse JSON
            scorecard = json.loads(cleaned_text)
            
            # Validate structure
            required_factors = set(SCORE_WEIGHTS.keys())
            if not required_factors.issubset(set(scorecard.keys())):
                print(f"⚠️ Missing factors in scorecard")
                return None
            
            # Validate scores
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


    # --- 7. MAIN MATCHING FUNCTION ---
    def analyze_startup_investor_match(startup_doc: Dict[str, Any], investor_doc: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        """
        Analyze a startup-investor pair from MongoDB documents.
        
        Returns:
            Tuple of (overall_score, scorecard_dict)
        """
        
        # Extract profiles
        startup_profile = extract_startup_profile(startup_doc)
        investor_profile = extract_investor_profile(investor_doc)
        
        # Create prompt
        prompt = create_matching_prompt(startup_profile, investor_profile)
        
        # Call LLM API with retries
        max_retries = 3
        for attempt in range(max_retries):
            if USE_GEMINI:
                response = call_gemini_api(prompt)
            # else:
            #     response = call_openai_api(prompt)
            
            if response:
                scorecard = parse_llm_response(response)
                if scorecard:
                    overall_score = calculate_overall_score(scorecard)
                    return overall_score, scorecard
            
            if attempt < max_retries - 1:
                print(f"🔄 Retry {attempt + 1}/{max_retries}")
                time.sleep(1)
        
        print("❌ Failed to get valid response after retries")
        return 0.0, {}


    # --- 8. MONGODB OPERATIONS ---
    # saving the startup-investor match pairs to database ----------
    def save_match_to_db(matches_collection, startup_id: str, investor_id: str,overall_score: float,scorecard: Dict[str, Any]
                        # ,investor_email:str="",investor_location:str="",investor_company:str="",investor_title:str="",
                        # startup_name: str = "", investor_name: str = ""
                        ):
        """Save match result to MongoDB matches collection."""
        
        match_document = {
            "startup_id": startup_id,
            "investor_id": investor_id,
            # "startup_name": startup_name,
            # "investor_name": investor_name,
            # "investor_company":investor_company,
            # "investor_email":investor_email,
            # "investor_location":investor_location,
            "overall_score": overall_score,
            "scorecard": scorecard,
            "created_at": datetime.utcnow(),
            "status": "completed" if overall_score > 0 else "failed"
        }
        
        try:
            # Check if match already exists
            existing_match = matches_collection.find_one({
                "startup_id": startup_id,
                "investor_id": investor_id
            })
            
            if existing_match:
                # Update existing match
                matches_collection.update_one(
                    {"_id": existing_match["_id"]},
                    {"$set": match_document}
                )
            else:
                # Insert new match
                matches_collection.insert_one(match_document)
                
            return True
            
        except Exception as e:
            print(f"❌ Error saving match to database: {e}")
            return False


    def get_all_startup_investor_pairs(startup_profile, investor_collection, limit: int |None=None ):
        """Generate all possible startup-investor pairs."""
        
        startups = startup_profile
        investors = list(investor_collection.find({}))
        
        if limit:        
            investors = investors[:limit]
        
        print(f"📊 Found {startups} startup and {len(investors)} investors")
        print(f"🎯 Will generate { len(investors)} total pairs")
        
        pairs = []

        for investor in investors:
            pairs.append([startups, investor])
        
        return pairs


    def get_unprocessed_pairs(startup_collection, investor_collection, matches_collection):
        """Get pairs that haven't been processed yet."""
        
        # Get all processed pairs
        processed_pairs = set()
        for match in matches_collection.find({}, {"startup_id": 1, "investor_id": 1}):
            processed_pairs.add((str(match["startup_id"]), str(match["investor_id"])))
        
        # Get all possible pairs
        all_pairs = get_all_startup_investor_pairs(startup_collection, investor_collection)
        
        # Filter unprocessed pairs
        unprocessed_pairs = []
        for startup, investor in all_pairs:
            startup_id = str(startup.get("_id", startup.get("id", "")))
            investor_id = str(investor.get("_id", investor.get("id", "")))
            
            if (startup_id, investor_id) not in processed_pairs:
                unprocessed_pairs.append((startup, investor))
        
        print(f"🔄 Found {len(unprocessed_pairs)} unprocessed pairs out of {len(all_pairs)} total pairs")
        return unprocessed_pairs


    # --- 9. BATCH PROCESSING FUNCTION ---
    def process_all_matches(limit_pairs: int | None, process_unprocessed_only: bool = True):
        """Process all startup-investor matches and save to MongoDB."""
        
        # Connect to database
        startup_collection, investor_collection, matches_collection, client = get_database_collections()
        
        if not all([startup_collection, investor_collection, matches_collection]):
            print("❌ Failed to connect to database collections")
            return
        
        try:
            # Get pairs to process
            if process_unprocessed_only:
                pairs_to_process = get_unprocessed_pairs(startup_collection, investor_collection, matches_collection)
            # else:
            #     pairs_to_process = get_all_startup_investor_pairs(startup_collection, investor_collection, limit_pairs)
            
            if not pairs_to_process:
                print("✅ No pairs to process!")
                return
            
            if limit_pairs:
                pairs_to_process = pairs_to_process[:limit_pairs]
            
            print(f"🚀 Processing {len(pairs_to_process)} startup-investor pairs")
            
            successful_matches = 0
            failed_matches = 0
            
            # Process each pair
            for startup_doc, investor_doc in tqdm(pairs_to_process, desc="Analyzing Matches"):
                
                startup_id = str(startup_doc.get("_id", startup_doc.get("id", "")))
                investor_id = str(investor_doc.get("_id", investor_doc.get("id", "")))
                startup_name = startup_doc.get("StartupName", "Unknown Startup")
                investor_name = investor_doc.get("Name", investor_doc.get("FirmName", "Unknown Investor"))
                
                try:
                    # Analyze the match
                    overall_score, scorecard = analyze_startup_investor_match(startup_doc, investor_doc)
                    
                    if overall_score > 0 and scorecard:
                        # Save successful match
                        if save_match_to_db(matches_collection, startup_id,  investor_id,overall_score,scorecard):
                            successful_matches += 1
                            
                            # Show sample results for first few matches
                            if successful_matches <= 3:
                                print(f"\n🎯 Sample Match: {startup_name} x {investor_name}")
                                print(f"Overall score = {overall_score}")
                                print("Explanation")
                                print(json.dumps(scorecard, indent=2))
                        else:
                            failed_matches += 1
                    else:
                        # Save failed match
                        save_match_to_db(matches_collection, startup_id, investor_id,overall_score,scorecard)
                        failed_matches += 1
                
                except Exception as e:
                    print(f"❌ Error processing {startup_name} x {investor_name}: {e}")
                    save_match_to_db(matches_collection, startup_id, investor_id,overall_score,scorecard)
                    failed_matches += 1
                
                # Rate limiting
                time.sleep(0.5)
                
                # Progress update every 20 matches
                if (successful_matches + failed_matches) % 20 == 0:
                    print(f"💾 Progress: {successful_matches} successful, {failed_matches} failed")
            
            print(f"\n✅ Processing Complete!")
            print(f"📈 Final Results: {successful_matches} successful, {failed_matches} failed")
            
            # Show statistics
            if successful_matches > 0:
                pipeline = [
                    {"$match": {"overall_score": {"$gt": 0}}},
                    {"$group": {
                        "_id": None,
                        "avg_score": {"$avg": "$overall_score"},
                        "min_score": {"$min": "$overall_score"},
                        "max_score": {"$max": "$overall_score"},
                        "count": {"$sum": 1}
                    }}
                ]
                if matches_collection is not None:
                    stats = list(matches_collection.aggregate(pipeline))
                    if stats:
                        stat = stats[0]
                        print(f"\n📊 Score Statistics:")
                        print(f"   Average: {stat['avg_score']:.1f}")
                        print(f"   Range: {stat['min_score']:.1f} - {stat['max_score']:.1f}")
                        print(f"   Total successful matches: {stat['count']}")
        
        finally:
            if client:
                pass


    # --- 10. QUERY FUNCTIONS ---
    def get_top_matches_for_startup(startup_id: str, top_k: int = 10):
        """Get top matches for a specific startup from the database."""
        
        startup_collection, investor_collection, matches_collection, client = get_database_collections()
        
        if matches_collection is not None:
            print("❌ Failed to connect to database")
            return []
        if client:
            try:
                # Query top matches
                if matches_collection is not None:
                    matches = list(matches_collection.find(
                        {"startup_id": startup_id, "overall_score": {"$gt": 0}}
                    ).sort("overall_score", -1).limit(top_k))
                
                print(f"🎯 Top {len(matches)} matches for startup {startup_id}:")
                
                for i, match in enumerate(matches, 1):
                    print(f"\n{i}. {match['investor_name']} (Score: {match['overall_score']})")
                    if 'scorecard' in match:
                        for factor, data in match['scorecard'].items():
                            print(f"   {factor}: {data['score']} - {data['justification']}")
                
                return matches
            
            finally:
                pass


    def get_top_matches_for_investor(investor_id: str, top_k: int = 10):
        """Get top matches for a specific investor from the database."""
        
        startup_collection, investor_collection, matches_collection, client = get_database_collections()
        
        if matches_collection is not None:
            print("❌ Failed to connect to database")
            return []
        
        try:
            # Query top matches
            if matches_collection is not None:
                matches = list(matches_collection.find(
                    {"investor_id": investor_id, "overall_score": {"$gt": 0}}
                ).sort("overall_score", -1).limit(top_k))
            
            print(f"🎯 Top {len(matches)} matches for investor {investor_id}:")
            
            for i, match in enumerate(matches, 1):
                print(f"\n{i}. {match['startup_name']} (Score: {match['overall_score']})")
                if 'scorecard' in match:
                    for factor, data in match['scorecard'].items():
                        print(f"   {factor}: {data['score']} - {data['justification']}")
            
            return matches
        
        finally:
            if client:
                pass


    # --- 11. DEMO FUNCTION ---
    def demo_with_mongodb():
        """Demo function using actual MongoDB data."""
        
        startup_collection, investor_collection, matches_collection, client = get_database_collections()
        
        if startup_collection is None or investor_collection is None or matches_collection is None or client is None:
            print("Failed to fetch collections")
            return
        try:
            # Get one startup and one investor for demo
            if startup_collection is not None:
                startup = startup_collection.find_one({})
            if investor_collection is not None:
                investor = investor_collection.find_one({})
            
            if not startup or not investor:
                print("❌ No startup or investor data found in database")
                return
            
            startup_name = startup.get("StartupName", "Unknown Startup")
            investor_name = investor.get("Name", investor.get("FirmName", "Unknown Investor"))
            
            print(f"🚀 Running Demo Analysis: {startup_name} x {investor_name}")
            
            overall_score, scorecard = analyze_startup_investor_match(startup, investor)
            
            print(f"\n🎯 Demo Result:")
            print(f"Overall score = {overall_score}")
            print("Explanation")
            print(json.dumps(scorecard, indent=2))
            
            # Save demo result
            startup_id = str(startup.get("_id", "demo_startup"))
            investor_id = str(investor.get("_id", "demo_investor"))
            save_match_to_db(matches_collection, startup_id,  
                            overall_score=overall_score,investor_id=investor_id,scorecard=scorecard)
            print(f"\n💾 Demo result saved to database")
        except Exception as e:
            print(f"Error {e}")
        finally:
            if client:
                pass

    def create_matches():
        startup_collection, investor_collection, matches_collection, client = get_database_collections()
        if startup_collection is None or investor_collection is None or matches_collection is None or client is None:
          
            return jsonify({"message":"Failed to fetch collections"})
        try:
            # Get one startup and one investor for demo
            Startup = startup_collection.find_one({"_id": ObjectId(User_id)})
            print(Startup)
            if investor_collection is not None:
                investors = list(investor_collection.find({}))
                print(investors)
            
            if not Startup or not investors:
                 return jsonify({"message":"❌ No startup or investor data found in database"})
                        
            startup_name = Startup.get("StartupName", "Unknown Startup")
            result = []
            for investor in investors:                
                investor_name = investor.get("Name", investor.get("Username", "Unknown Investor"))
                # print(f"🚀 Running Demo Analysis: {startup_name} x {investor_name}")
                overall_score, scorecard = analyze_startup_investor_match(Startup, investor)                     
                investor_id = str(investor.get("_id", "demo_investor"))
                inv_email=str(investor.get("CompanyEmail","Not Available"))
                inv_company=str(investor.get("FirmName","Unknown Company"))
                investor_location=str(investor.get("InvestorLocation","__"))
                investor_title=str(investor.get("InvestorTitle",""))
                save_match_to_db(matches_collection, User_id, investor_id=investor_id,overall_score=overall_score,scorecard=scorecard)                        
                result.append({"Start_Name":startup_name,
                        "Investor_Name":investor_name,
                        "Investor_Company":inv_company,
                        "Investor_Email":inv_email,
                        "Investor_Location":investor_location,
                        "Investor_Title":investor_title,
                        "Overall_Score":overall_score,
                        "Scorecard":scorecard})
            return jsonify({"Success":True,"result":result})                
        except Exception as e:
            return jsonify({"message":f"bhogoban{e}"})
        finally:
            if client:
                pass

    def create_matches_trial(isStartup:bool):
        startup_collection, investor_collection, matches_collection, client = get_database_collections()

        if startup_collection is None or investor_collection is None or matches_collection is None or client is None:          
            return jsonify({"message":"Failed to fetch collections"})

        try:
            if isStartup:
                Startup = startup_collection.find_one({"_id": ObjectId(User_id)})
                print(Startup)
                if investor_collection is not None:
                    investors = list(investor_collection.find({}))
                    print(investors)
                
                if not Startup or not investors:
                    return jsonify({"message":"❌ No startup or investor data found in database"})
                            
                startup_name = Startup.get("StartupName", "Unknown Startup")
                result = []
                for investor in investors:                
                    investor_name = investor.get("Name", investor.get("Username", "Unknown Investor"))
                    overall_score, scorecard = analyze_startup_investor_match(startup_doc= Startup,investor_doc= investor)                     
                    investor_id = str(investor.get("_id", "demo_investor"))
                    inv_email=str(investor.get("CompanyEmail","Not Available"))
                    inv_company=str(investor.get("FirmName","Unknown Company"))
                    investor_location=str(investor.get("InvestorLocation","__"))
                    investor_title=str(investor.get("InvestorTitle",""))
                    
                    save_match_to_db(matches_collection, User_id, investor_id=investor_id,overall_score=overall_score,scorecard=scorecard)                        
                    result.append({"Start_Name":startup_name,
                            "Investor_Name":investor_name,
                            "Investor_Company":inv_company,
                            "Investor_Email":inv_email,
                            "Investor_Location":investor_location,
                            "Investor_Title":investor_title,
                            "Overall_Score":overall_score,
                            "Scorecard":scorecard})
                return jsonify({"Success":True,"result":result})           
            else:
                investor = investor_collection.find_one({"_id": ObjectId(User_id)})
                print(investor)
                if startup_collection is not None:
                    startups = list(startup_collection.find({}))
                    print(startups)
                
                if not investor or not startups:
                    return jsonify({"message":"❌ No investor or investor data found in database"})
                            
                investor_name = investor.get("Username", "Unknown investor")
                result = []
                for startup in startups:                
                    overall_score, scorecard = analyze_startup_investor_match(investor_doc=investor, startup_doc=startup)                     
                    startup_id = str(startup.get("_id", "demo_startup"))
                    founder_name=str(startup.get("FounderName","Unknown Founder"))
                    startup_email=str(startup.get("CompanyEmail","Not Available"))
                    startup_company=str(startup.get("StartupName","Unknown Company"))
                    startup_location=str(startup.get("Location","__"))
                    investor_title=""
                    
                    save_match_to_db(matches_collection, startup_id, investor_id=User_id,overall_score=overall_score,scorecard=scorecard)                        
                    result.append({"Investor_Name":investor_name,
                            "Founder_Name":founder_name,
                            "Startup_Company":startup_company,
                            "Startup_Email":startup_email,
                            "Startup_Location":startup_location,
                            "Overall_Score":overall_score,
                            "Scorecard":scorecard})
                return jsonify({"Success":True,"result":result})
        except Exception as e:
            return jsonify({"message":f"bhogoban{e}"})
        finally:
            if client:
                pass
    # return create_matches()
    return create_matches_trial(isStartup)  
        # Uncomment to process all matchespairs=get_all_startup_investor_pairs(startup_profile,investor_collection)  (be careful with large datasets!)
        # process_all_matches(limit_pairs=50)  # Limit for testing
        
        # Uncomment to query specific matches
        # get_top_matches_for_startup("your_startup_id", top_k=5)