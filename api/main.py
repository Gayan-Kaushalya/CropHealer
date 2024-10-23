from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import os
import base64
from pydantic import BaseModel, EmailStr, Field
from lime import lime_image
import matplotlib.pyplot as plt
import io
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional, Any
import logging
from passlib.context import CryptContext
from dotenv import load_dotenv
from gradio_client import Client

predict_client = Client("GayanKK/CropHealer")
lime_client = Client("GayanKK/Lime")

load_dotenv()

app = FastAPI()

logging.basicConfig(level=logging.INFO)

# Replace with your connection string
db_url = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(db_url)
db = client.get_database("CropHealer")
users_collection = db.get_collection("users")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Models
class Report(BaseModel):
    email: EmailStr
    date: str
    predPlant: str
    predDisease: str
    pred_prob: str
    actPlant: Optional[str] = None
    actDisease: Optional[str] = None  
    details: Optional[str] = None

# Pydantic model for the User
class User(BaseModel):
    email: EmailStr = Field(..., unique=True)
    password: str
    reports: Optional[List[Report]] = []

class UserResponse(BaseModel):
    id: str
    email: EmailStr


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ImageData(BaseModel):
    base64: str

def read_file_as_image(file) -> np.ndarray:
    image = np.array(Image.open(BytesIO(file)))
    return image

@app.get("/ping")
async def ping():
    return "pong"


@app.post("/register/")
async def signup(user: User):
    
    logging.info("Received signup request")
    
    existing_user = await users_collection.find_one({"email": user.email})
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_password = hash_password(user.password)
    user_doc = {"email": user.email, "password": hashed_password}
    await users_collection.insert_one(user_doc)
    
    return UserResponse(
        id=str(user_doc["_id"]), 
        email=user.email
    )

@app.post("/login/", response_model=UserResponse)
async def login(user: User):
    # Find the user in the database
    db_user = await users_collection.find_one({"email": user.email})

    # Check if user exists and verify password
    if not db_user or not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    logging.info(f"User logged in: {user.email}")

    # Return user data excluding the password
    return UserResponse(
        id=str(db_user["_id"]),
        email=db_user["email"],
    )


@app.post("/predict")
async def predict(image_data: ImageData):
    try:
        result = predict_client.predict(base64_string=image_data.base64, api_name="/predict")
        global plant
        plant = result['plant']
        return result
    except Exception as e:
        logging.error("Error during prediction: %s", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/lime")
async def lime(image_data: ImageData):
    try:
        result = lime_client.predict(
		plant=plant,
		image_code=image_data.base64,
		api_name="/predict"
        )
        return {"lime_heatmap": result}
    except Exception as e:
        logging.error("Error during prediction: %s", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

    
@app.post("/report")
async def report(report: Report):
    logging.info(report.model_dump_json())

    # Find user by ID
    user = await users_collection.find_one({"email": report.email})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Add report to the user's report lista
    report_dict = report.model_dump()
    
    await users_collection.update_one(
        {"email": report.email}, 
        {"$push": {"reports": report_dict}}  # Push new report to reports array
    )
    
    return {"message": "Report submitted successfully"}

@app.get("/getreports")
async def get_reports(email: str):
    logging.info(f"Fetching reports for {email}")
    user = await users_collection.find_one({"email": email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reports = user.get("reports", [])
    return {"user": user['email'], "reports": reports}  # Optionally return the email for clarity

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8001)