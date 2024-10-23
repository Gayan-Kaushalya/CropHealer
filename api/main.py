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

##############################################################################################################################################
"""
# Path to the main plant model
plant_model_path = "models/plantType.h5"
CLASS_NAMES = ['Apple', 'Banana', 'Bean', 'Coffee', 'Corn', 'Eggplant', 'Grapes', 'Pepper', 'Potato', 'Rice', 'Sugarcane', 'Tea', 'Tomato']

# Load the main model
if os.path.exists(plant_model_path):
    MODEL = tf.keras.models.load_model(plant_model_path)
else:
    raise FileNotFoundError(f"Model file not found at path: {plant_model_path}")

# Define paths for crop-specific models
potato_model_path =       "models/potatoModel.h5"
tomato_model_path =       "models/tomatoModel.h5"
pepper_model_path =       "models/pepperModel.h5"
tea_model_path =       "models/teaModel.h5"
grapes_model_path =       "models/grapeModel.h5"
bean_model_path =       "models/beanModel.h5"
banana_model_path =       "models/bananaModel.h5"
corn_model_path =       "models/cornModel.h5"
coffee_model_path =       "models/coffeeModel.h5"
eggplant_model_path =       "models/eggplantModel.h5"
sugarcane_model_path =       "models/sugarcaneModel.h5"
rice_model_path =       "models/riceModel.h5"
apple_model_path =       "models/appleModel.h5"

# Define class names for each crop-specific model
POTATO_CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]
TOMATO_CLASS_NAMES = ['Bacterial Spot', 'Early Blight', 'Late Blight', 'Tomato Leaf Mold', 'Septoria Leaf Spot', 'Two-spotted Spider Mite', 'Target Spot', 'Tomato Yellow Leaf Curl Virus', 'Tomato Mosaic Virus', 'Healthy']
PEPPER_CLASS_NAMES = ['Bacterial Spot', 'Healthy']
TEA_CLASS_NAMES = ['Anthracnose', 'Algal Leaf Spot', "Bird's Eye Spot", 'Brown Blight', 'Gray Light', 'Healthy', 'Red Leaf Spot', 'White Spot']
GRAPE_CLASS_NAMES = ['Black Measles', 'Black Rot', 'Healthy', 'Phoma Blight']
APPLE_CLASS_NAMES = ['Apple Scab', 'Black Rot', 'Cedar Apple Rust', 'Healthy']
SOYBEAN_CLASS_NAMES = ['Angular Leaf Spot', 'Bean Rust', 'Healthy']
BANANA_CLASS_NAMES = ['Cordana', 'Healthy', 'Pestalotiopsis', 'Sigatoka']
CORN_CLASS_NAMES = ['Northern Leaf Blight', 'Common Rust', 'Gray Leaf Spot', 'Healthy']
COFFEE_CLASS_NAMES = ['Coffee Leaf Miner', 'Healthy', 'Phoma Blight', 'Rust of Coffee']
SUGARCANE_CLASS_NAMES = ['Bacterial Blight', 'Healthy', 'Mosaic Virus', 'Red Rot', 'Sugarcane Common Rust', 'Yellow Leaf Virus']
RICE_CLASS_NAMES = ['Brown Spot', 'Healthy', 'Rice Hispa', 'Leaf Blast']
EGGPLANT_CLASS_NAMES = ['Healthy', 'Insect Pest Disease', 'Cercospora Leaf Spot', 'Mosaic Virus', 'Small Leaf Disease', 'White Mold', 'Bacterial Wilt']
"""


class ImageData(BaseModel):
    base64: str

def read_file_as_image(file) -> np.ndarray:
    image = np.array(Image.open(BytesIO(file)))
    return image


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