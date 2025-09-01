from flask import Blueprint,jsonify,request
from db.db import db_main
from bson import ObjectId
userdetails_bp_startup = Blueprint("startupdetails",__name__)
startup_collection = db_main["startup"]

@userdetails_bp_startup.route("/userdetailsstartup",methods=["POST"])
def UserDetailsStartup():
    data = request.json
    user = startup_collection.find_one({"_id":ObjectId(data["token"])})
    if user:
        user["_id"] = str(user["_id"])
        return jsonify({"message":user})

    else:
        return jsonify({"message":"user not found"})    