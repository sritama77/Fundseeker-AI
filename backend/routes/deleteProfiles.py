from db.db import db_main
from flask import Blueprint,request,jsonify
import json
from bson import ObjectId

delete_profile = Blueprint("DeleteProfile",__name__)
cart_collection = db_main["cart"]

@delete_profile.route("/deleteprofile",methods=["POST"])


#userid,deleteid
def DeleteProfile():

    data = request.json
    
    cart_collection.update_one(
        {"userid":ObjectId(data["userid"])},
        {"$pull":{"profilesid":data["deleteid"]}}
    )
    
    return jsonify({"updated":True})
    