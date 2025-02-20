import jwt
from decouple import config
import time

JWT_SECRET = config("JWT_SECRET")
JWT_ALGORITHM = config("JWT_ALGORITHM")

class AuthHandler(object):
    
    @staticmethod   
    def sign_jwt(user_id : int) -> str:
        payload = {
            "user_id": user_id,
            "expires": time.time() + 86400
        }

        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return token        
    
    @staticmethod
    def decode_jwt(token: str) -> dict:
        try:
            print(f"🔍 Decoding Token: {token}")  # Debugging
            decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            print(f"✅ Decoded Token: {decoded_token}")  # Debugging
            if "expires" in decoded_token and decoded_token["expires"] >= time.time():
                return decoded_token
            print("⚠️ Token is expired!")  # Debugging
            return None
        except Exception as e:
            print(f"❌ JWT Decode Error: {e}")  # Debugging
            return None

