from flask import Blueprint,request,jsonify
from db.db import db_main

startup_bp_signin = Blueprint("startupsign",__name__)
startup_collection = db_main["startup"]


@startup_bp_signin.route("/signupstartup",methods = ["POST"] )
def SignupStartup():
    data = request.json
    
    Companyemailis = startup_collection.find_one({"CompanyEmail":data["CompanyEmail"]})
   
    if Companyemailis:
        return jsonify({"message":"User exists"})

    result =  startup_collection.insert_one(data)
    return jsonify({"message":"success","_id":str(result.inserted_id)})


