from flask import Blueprint,jsonify,request
from db.db import db_main

userdetails_bp_investor = Blueprint("investordetails",__name__)
startup_collection = db_main["investor"]

@userdetails_bp_investor.route("/userdetailsinvestor",methods=["GET"])
def UserDetailsInvestor():
    temp = startup_collection.find({},{"_id":0})
    users = list(temp)
    return jsonify({"data":users})
