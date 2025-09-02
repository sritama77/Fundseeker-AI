from flask import Blueprint,jsonify,request
from db.db import db_main
from bson import ObjectId
from redisDB.redisdb import r
import json

userdetails_bp_investor = Blueprint("investordetails",__name__)
startup_collection = db_main["investor"]

#fetch user details function
@userdetails_bp_investor.route("/userdetailsinvestor",methods=["POST"])
def UserDetailsInvestor():

    #body
    data = request.json
       
    #hit cache
    for key in r.scan_iter("user:*"):
        res = json.loads(r.get(key).decode())

        #if userfound 
        if res["_id"] == data["token"]:
            return jsonify({"message":res})

    #find user in database
    user = startup_collection.find_one({"_id":ObjectId(data["token"])})
    if user:
        user["_id"] = str(user["_id"])
        return jsonify({"message":user})

    else:
        return jsonify({"message":"user not found"})    
