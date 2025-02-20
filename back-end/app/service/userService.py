from app.db.repository.userRepo import UserRepository
from app.db.schemas.user import UserOutput, UserInCreate, UserInLogin, UserWithToken
from app.core.security.hashHelper import HashHelper
from app.core.security.authHandler import AuthHandler
from sqlalchemy.orm import Session
from fastapi import HTTPException

class UserService:
    def __init__(self,session : Session):
        self.__userRepository = UserRepository(session=session)
        
    def signup(self,user_details : UserInCreate) -> UserOutput:
       if self.__userRepository.user_exist_by_email(email=user_details.email):
           raise HTTPException(status_code=400, detail="Please Login")
       
       hashed_password = HashHelper.get_password_hash(plain_password=user_details.password)
       user_details.password = hashed_password
       return self.__userRepository.create_user(user_data=user_details)
    
    def login(self,login_details : UserInLogin) -> UserWithToken:
        if not self.__userRepository.user_exist_by_email(email=login_details.email):
            raise HTTPException(status_code=404, detail= "Acount with this email does not exist. Please Sign Up")
        
        user = self.__userRepository.get_user_by_email(email=login_details.email)

        if HashHelper.verify_password(plain_password=login_details.password, hashed_password=user.password):
            token = AuthHandler.sign_jwt(user_id=user.id)
            if token:
                return UserWithToken(token=token)
            else:
                raise HTTPException(status_code=500,detail="Unable to process request")

        raise HTTPException(status_code=400, detail="Please Check Your Credentials")    

    def get_user_by_id(self, user_id: int):
        print(f"🔍 Looking up user with ID: {user_id}")  # Debugging
        user = self.__userRepository.get_user_by_id(user_id=user_id)

        if user:
            print(f"✅ User Found: {user}")  # Debugging
            return user
    
        print("❌ User ID not found in database!")  # Debugging
        raise HTTPException(status_code=400, detail="User is not available")







