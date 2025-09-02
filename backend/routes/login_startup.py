from flask import Blueprint,request,jsonify
from db.db import db_main
from redisDB.redisdb import r
import json
startup_bp_login = Blueprint("loginstartup",__name__)
startup_collection = db_main["startup"]

@startup_bp_login.route("/loginstartup",methods=["POST"])

#login fucntion
def LoginStartup():
  #body
  data = request.json

  #hitting cache
  checkCache = r.get(f"user:{data['Email']}")

  #cache hit
  if checkCache:
      if json.loads(checkCache.decode())["Password"] == data["Password"]:
          return jsonify({"message":"success","id":json.loads(checkCache.decode())["_id"]})
  
  #hitting database
  result = startup_collection.find_one({"CompanyEmail":data["Email"]})
  
  #if user found
  if result:
    result["_id"] = str(result["_id"])
    if result["Password"] == data["Password"]:
       r.set(f"user:{result['CompanyEmail']}",json.dumps(result),ex=600)
       return jsonify({"message":"success","id":result["_id"]})
  else:
    return jsonify({"message":"wrong email or pass"})  