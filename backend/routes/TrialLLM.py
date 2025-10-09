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
# from db.db import db_main,client
# from flask import Blueprint,request, 
# --- 1. CONFIGURATION ---
load_dotenv()


# llm_bp_model = Blueprint("llmmodel",__name__)


# @llm_bp_model.route("/modelanalysis",methods=["POST"])

# Configure APIs - you can choose which one to us
    # data = request.json
    # if data:
    #     User_id = data["UserId"]
    #     isStartup = data["isStartup"]
User_id='68ab4cd331b08380f11db0e8'
isStartup=True    
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
        client = MongoClient(MONGODB_CONFIG["connection_string"])
        db = client[MONGODB_CONFIG["database_name"]]
        
        startup_collection = db[MONGODB_CONFIG["startup_collection"]]
        investor_collection = db[MONGODB_CONFIG["investor_collection"]]
        matches_collection = db[MONGODB_CONFIG["matches_collection"]]
        
        # Test connection
        # startup_collection = db_main["startup"]
        # investor_collection = db_main["investor"]
        # matches_collection = db_main["matches"]
        client.admin.command('ping')
        # print(f"✅ Connected to MongoDB database: {MONGODB_CONFIG['database_name']}")
        
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
        model = "gemini-2.0-flash-001"
        
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
        print(response)             
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
def analyze_startup_investor_match(startup_doc: Dict[str, Any], investor_doc: Dict[str, Any],WaitTime: int=1) -> Tuple[float, Dict[str, Any]]:
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
            time.sleep(WaitTime)  # Wait before retrying
    
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

# --- 9. QUERY FUNCTIONS ---
def get_top_matches_for_startup(startup_id: str, top_k: int = 10):
    """Get top matches for a specific startup from the database."""
    
    startup_collection, investor_collection, matches_collection, client = get_database_collections()
    
    if matches_collection is None:
        # print("❌ Failed to connect to database")
        return []
    if client:
        try:
            # Query top matches
            if matches_collection is not None:
                matches = list(matches_collection.find(
                    {"startup_id": startup_id, "overall_score": {"$gt": 0}}
                ).sort("overall_score", -1).limit(top_k))
            
            investor_profiles=[]
            if investor_collection is None or startup_collection is None:
                return
            for i, match in enumerate(matches, 1):
                startup_id= match.get("startup_id")
                startup=startup_collection.find_one({"_id":startup_id})
                investor_id = match.get("investor_id")
                investor=investor_collection.find_one({"_id":investor_id})
                if investor and startup:
                    startup_name=str(startup.get("StartupName","Not Available"))
                    investor_name=str(investor.get("FirmName","Not Available"))
                    inv_email=str(investor.get("CompanyEmail","Not Available"))
                    inv_company=str(investor.get("FirmName","Unknown Company"))
                    investor_location=str(investor.get("InvestorLocation","__"))
                    investor_title=str(investor.get("InvestorTitle",""))
                    investor_website=str(investor.get("InvestorWebsite",""))
                    social_link=str(investor.get("InvestorSocialMedia",""))
                investor_profiles.append({"Startup_name":startup_name,
                        "Investor_Name":investor_name,
                        "Investor_Company":inv_company,
                        "Investor_Email":inv_email,
                        "Investor_Location":investor_location,
                        "Investor_Title":investor_title,
                        "Investor_Website":investor_website,
                        "Investor_Social_Media":social_link
                        })
            
            return investor_profiles
        
        finally:
            pass

def get_top_matches_for_investor(investor_id: str, top_k: int = 10):
    """Get top matches for a specific investor from the database."""
    
    startup_collection, investor_collection, matches_collection, client = get_database_collections()
    
    if matches_collection is None:
        # print("❌ Failed to connect to database")
        return []
    if client:
        try:
            # Query top matches
            if matches_collection is not None:
                matches = list(matches_collection.find(
                    {"startup_id": investor_id, "overall_score": {"$gt": 0}}
                ).sort("overall_score", -1).limit(top_k))
            
            startup_profiles=[]
            if investor_collection is None or startup_collection is None:
                return
            for i, match in enumerate(matches, 1):
                startup_id= match.get("startup_id")
                startup=startup_collection.find_one({"_id":startup_id})
                investor_id = match.get("investor_id")
                investor=investor_collection.find_one({"_id":investor_id})
                if investor and startup:
                    startup_name=str(startup.get("StartupName","Not Available"))
                    investor_name=str(investor.get("FirmName","Not Available"))
                    inv_email=str(investor.get("CompanyEmail","Not Available"))
                    inv_company=str(investor.get("FirmName","Unknown Company"))
                    investor_location=str(investor.get("InvestorLocation","__"))
                    investor_title=str(investor.get("InvestorTitle",""))
                    investor_website=str(investor.get("InvestorWebsite",""))
                    social_link=str(investor.get("InvestorSocialMedia",""))
                startup_profiles.append({"Startup_name":startup_name,
                        "Investor_Name":investor_name,
                        "Investor_Company":inv_company,
                        "Investor_Email":inv_email,
                        "Investor_Location":investor_location,
                        "Investor_Title":investor_title,
                        "Investor_Website":investor_website,
                        "Investor_Social_Media":social_link
                        })
            
            return startup_profiles
        
        finally:
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
        
        return  ({"message":"Failed to fetch collections"})
    try:
        # Get one startup and one investor for demo
        Startup = startup_collection.find_one({"_id": ObjectId(User_id)})
        print(Startup)
        if investor_collection is not None:
            investors = list(investor_collection.find({}))
            print(investors)
        
        if not Startup or not investors:
                return  ({"message":"❌ No startup or investor data found in database"})
                    
        startup_name = Startup.get("StartupName", "Unknown Startup")
        result = []
        for investor in investors:                
            investor_name = investor.get("Name", investor.get("Username", "Unknown Investor"))
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
        return  ({"Success":True,"result":result})                
    except Exception as e:
        return  ({"message":f"bhogoban{e}"})
    finally:
        if client:
            pass

def create_matches_trial(isStartup:bool):
    startup_collection, investor_collection, matches_collection, client = get_database_collections()

    if startup_collection is None or investor_collection is None or matches_collection is None or client is None:          
        return  ({"message":"Failed to fetch collections"})

    try:
        if isStartup:
            Startup = startup_collection.find_one({"_id": ObjectId(User_id)})
            # print(Startup)
            if investor_collection is not None:
                investors = list(investor_collection.find({}))
                # print(investors)
            
            if not Startup or not investors:
                return ({"message":"❌ No startup or investor data found in database"})
                        
            startup_name = Startup.get("StartupName", "Unknown Startup")
            result = []
            for investor in investors:                
                investor_name = investor.get("Name", investor.get("Username", "Unknown Investor"))
                overall_score, scorecard = analyze_startup_investor_match(startup_doc= Startup,investor_doc= investor,WaitTime= 4)                     
                investor_id = str(investor.get("_id", "demo_investor"))
                inv_email=str(investor.get("CompanyEmail","Not Available"))
                inv_company=str(investor.get("FirmName","Unknown Company"))
                investor_location=str(investor.get("InvestorLocation","__"))
                investor_title=str(investor.get("InvestorTitle",""))
                
                save_match_to_db(matches_collection, User_id, investor_id=investor_id,overall_score=overall_score,scorecard=scorecard)                        
                time.sleep(4)  # Rate limiting        
        else:
            investor = investor_collection.find_one({"_id": ObjectId(User_id)})
            # print(investor)
            if startup_collection is not None:
                startups = list(startup_collection.find({}))
                # print(startups)
            
            if not investor or not startups:
                return ({"message":"❌ No investor or investor data found in database"})
                        
            investor_name = investor.get("Username", "Unknown investor")
            result = []
            for startup in startups:                
                overall_score, scorecard = analyze_startup_investor_match(investor_doc=investor, startup_doc=startup,WaitTime= 4)                     
                startup_id = str(startup.get("_id", "demo_startup"))
                founder_name=str(startup.get("FounderName","Unknown Founder"))
                startup_email=str(startup.get("CompanyEmail","Not Available"))
                startup_company=str(startup.get("StartupName","Unknown Company"))
                startup_location=str(startup.get("Location","__"))
                investor_title=""
                
                save_match_to_db(matches_collection, startup_id, investor_id=User_id,overall_score=overall_score,scorecard=scorecard)                        
                time.sleep(4)  # Rate limiting  
    except Exception as e:
        return ({"message":f"bhogoban{e}"})
    finally:
        if client:
            pass

def main(isStartup:bool):
    create_matches_trial(isStartup)
    if isStartup:
        result=get_top_matches_for_startup(User_id,5)
    else:
        result=get_top_matches_for_investor(User_id,5)

    return ({"Sucess":True,"result":result})

if __name__ == "__main__":
    main(True)