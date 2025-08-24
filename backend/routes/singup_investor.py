from flask import Blueprint,request,jsonify
from db.db import db_main


investor_bp_signin = Blueprint("singupinvestor",__name__)
investor_collection = db_main["investor"]

@investor_bp_signin.route("/signupinvestor",methods = ["POST"])
def SigninInvestor():
    data = request.json
    result = investor_collection.insert_one(data)
    return jsonify({
        "message": "success", 
        "id": str(result.inserted_id)
    })