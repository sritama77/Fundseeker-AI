from flask import Blueprint,request,jsonify
from db.db import db_main


investor_bp_login = Blueprint("logininvestor",__name__)
investor_collection = db_main["investor"]


@investor_bp_login.route("/logininvestor",methods=["POST"])
def LoginInvestor():
    data = request.json
    result = investor_collection.find_one({"CompanyEmail":data["Email"]})
    if result:
        if result["Password"] == data["Password"]:
            return jsonify({"message":"success","id":str(result["_id"])})
    else:
        return jsonify({"message":"wrong email or pass"})  