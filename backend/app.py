from flask import Flask,jsonify,request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from routes.singup_startup import startup_bp_signin
from routes.login_startup import startup_bp_login
from routes.login_investor import investor_bp_login
from routes.singup_investor import investor_bp_signin
from routes.userdetails_startup import userdetails_bp_startup
from routes.userdetails_investor import userdetails_bp_investor
from routes.MatchwithLLM import llm_bp_model

app = Flask(__name__)
CORS(app, 
     origins=["http://localhost:5174", "http://localhost:3000"])
bcrypt = Bcrypt(app)


app.register_blueprint(startup_bp_signin)
app.register_blueprint(startup_bp_login)
app.register_blueprint(investor_bp_login)
app.register_blueprint(investor_bp_signin)
app.register_blueprint(userdetails_bp_startup)
app.register_blueprint(userdetails_bp_investor)
app.register_blueprint(llm_bp_model)



if __name__ == '__main__':
    app.run(host='0.0.0.0',port=4040,debug=True)