from flask import Blueprint,request,jsonify
from db.db import db_main

startup_bp_login = Blueprint("loginstartup",__name__)
startup_collection = db_main["startup"]

@startup_bp_login.route("/loginstartup",methods=["POST"])
def LoginStartup():
  data = request.json
  result = startup_collection.find_one({"CompanyEmail":data["Email"]})
  if result:
    if result["Password"] == data["Password"]:
       return jsonify({"message":"success","id":str(result["_id"])})
  else:
    return jsonify({"message":"wrong email or pass"})  