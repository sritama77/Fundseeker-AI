from flask import Blueprint,request,jsonify
from db.db import db_main
from redisDB.redisdb import r
import json

investor_bp_login = Blueprint("logininvestor",__name__)
investor_collection = db_main["investor"]


@investor_bp_login.route("/logininvestor",methods=["POST"])

#login fucntion
def LoginInvestor():
    #body
    data = request.json
    
    #hitting cache
    cacheCheck = r.get(f"user:{data['Email']}")

    #hit cache
    if cacheCheck:
        if json.loads(cacheCheck.decode())["Password"] == data["Password"]:
            return jsonify({"message":"success","id":json.loads(cacheCheck.decode())["_id"]})


    result = investor_collection.find_one({"CompanyEmail":data["Email"]})
    if result:
        result["_id"] = str(result["_id"])
        if result["Password"] == data["Password"]:
            r.set(f"user:{result['CompanyEmail']}",json.dumps(result),ex=600)
            return jsonify({"message":"success","id":result["_id"]})
    else:
        return jsonify({"message":"wrong email or pass"})  