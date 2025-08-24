from flask import Blueprint,jsonify,request
from db.db import db_main

userdetails_bp_startup = Blueprint("startupdetails",__name__)
startup_collection = db_main["startup"]

@userdetails_bp_startup.route("/userdetailsstartup",methods=["GET"])
def UserDetailsStartup():
    temp = startup_collection.find({},{"id":0})
    users = list(temp)
    return jsonify({"data":users})