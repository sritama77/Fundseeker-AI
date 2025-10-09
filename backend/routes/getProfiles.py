from db.db import db_main
from flask import Blueprint,request,jsonify
import json
from bson import ObjectId

get_profiles = Blueprint("getProfiles",__name__)
startup_collection = db_main["startup"]
investor_collection = db_main["investor"]
cart_collection = db_main["cart"]

@get_profiles.route("/getprofiles",methods = ["GET"])
def GetProfile():
    userid = request.args.get("userid")
    profile_collections = []

    data = cart_collection.find_one({"userid":ObjectId(userid)})
    for items in data["profilesid"]:
        profiles_investor = investor_collection.find_one({"_id":ObjectId(items)})
        if profiles_investor:
            profiles_investor["_id"] = str(profiles_investor["_id"])
            profile_collections.append(profiles_investor)
        profiles_startup = startup_collection.find_one({"_id":ObjectId(items)})
        if profiles_startup:
            profiles_startup["_id"] = str(profiles_startup["_id"])
            profile_collections.append(profiles_startup)


    return jsonify({"Profiles":profile_collections})

