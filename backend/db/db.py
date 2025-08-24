from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URL","NULL")

client = MongoClient(
    MONGO_URI,
    tls=True,  # Use tls instead of ssl
    tlsAllowInvalidCertificates=True,  # This helps with SSL handshake issues
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000,
    socketTimeoutMS=30000,
    retryWrites=True
)

db_main = client["fundseeker"]

