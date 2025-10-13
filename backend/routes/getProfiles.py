from db.db import db_main
from flask import Blueprint, request, jsonify
import json
from bson import ObjectId

get_profiles = Blueprint("getProfiles", __name__)
startup_collection = db_main["startup"]
investor_collection = db_main["investor"]
cart_collection = db_main["cart"]

@get_profiles.route("/getprofiles", methods=["GET"])
def GetProfile():
    userid = request.args.get("userid")
    
    # Validate input
    if not userid:
        return jsonify({"error": "userid is required"}), 400
    
    profile_collections = []

    # Get cart data with null check
    data = cart_collection.find_one({"userid": ObjectId(userid)})
    
    # ✅ ADD THIS CHECK
    if not data or "profilesid" not in data:
        return jsonify({"Profiles": []}), 200  # Return empty list for new users
    
    for items in data["profilesid"]:
        # Check investor collection
        profiles_investor = investor_collection.find_one({"_id": ObjectId(items)})
        if profiles_investor:
            profiles_investor["_id"] = str(profiles_investor["_id"])
            profile_collections.append(profiles_investor)
        
        # Check startup collection (only if not found in investor)
        else:
            profiles_startup = startup_collection.find_one({"_id": ObjectId(items)})
            if profiles_startup:
                profiles_startup["_id"] = str(profiles_startup["_id"])
                profile_collections.append(profiles_startup)

    return jsonify({"Profiles": profile_collections}), 200