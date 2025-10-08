from db.db import db_main
from flask import Blueprint,request,jsonify
import json
from bson import ObjectId

add_profile = Blueprint("AddProfile",__name__)
cart_collection = db_main["cart"]

@add_profile.route("/addprofile",methods=["POST"])

#addtocart fucntion

def AddToCart():
        #body
        data = request.json

        IsUser = cart_collection.find_one({"userid":ObjectId(data["_id"])})
        if IsUser:
            if IsUser["userid"] == ObjectId(data["_id"]):
                if data["CurrentProfileId"] in IsUser["profilesid"]:
                    return jsonify({"exists": True})
                cart_collection.update_one({"userid":ObjectId(data["_id"])},{
                    "$push":{"profilesid":data["CurrentProfileId"]}
                })
                return jsonify({"updated":True})
        cart_collection.insert_one({
            "userid":ObjectId(data["_id"]),
            "profilesid":[data["CurrentProfileId"]]
        })
        
        return jsonify({"message":"true"})