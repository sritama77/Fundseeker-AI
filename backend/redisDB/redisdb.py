import redis
import os

# Use environment variable or default to 'redis' for Docker network
REDIS_HOST = os.getenv('REDIS_HOST', 'redis-server')  # Changed from 'host.docker.internal'
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))

r = redis.Redis(
    host='127.0.0.1' ,
    port=REDIS_PORT,
    # decode_responses=True
)
