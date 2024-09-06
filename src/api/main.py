from fastapi import FastAPI, File, UploadFile, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from tensorflow import keras
import os
import base64
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

plant_model_path = "src/models/plantModel.h5"
tomato_model_path = "src/models/tomatoModel.h5"
pepper_model_path = "src/models/pepperModel.h5"
potato_model_path = "src/models/potatoModel.h5"

if os.path.exists(plant_model_path):
    MODEL = tf.keras.models.load_model(plant_model_path)
else:
    raise FileNotFoundError(f"Model file not found at path: {plant_model_path}")

CLASS_NAMES = ["Pepper","Potato", "Tomato"]
POTATO_CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]
TOMATO_CLASS_NAMES = ['Bacterial_spot',
 'Early_blight',
 'Late_blight',
 'Leaf_Mold',
 'Septoria_leaf_spot',
 'Spider_mites Two-spotted_spider_mite',
 'Target_Spot',
 'Tomato_Yellow_Leaf_Curl_Virus',
 'Tomato_mosaic_virus',
 'healthy']
PEPPER_CLASS_NAMES = ['Bacterial_spot', 'Healthy']


@app.get("/ping")
async def ping():
    return "pong"


def read_file_as_image(file) -> np.ndarray:
    #print(file)
    image = np.array(Image.open(BytesIO(file)))
    return image


class ImageData(BaseModel):
    base64: str

@app.post("/predict")
async def predict(image_data:ImageData):
    #print(image_data.base64)
    image_data_bytes = base64.b64decode(image_data.base64)
    image_bytes_io = BytesIO(image_data_bytes)
    image = Image.open(image_bytes_io)
    image = read_file_as_image(image_data_bytes)
    img_batch = np.expand_dims(image, 0)
    prediction = MODEL.predict(img_batch)
    
    crop = CLASS_NAMES[np.argmax(prediction[0])]
    
    if crop == "Potato":
        next_model = tf.keras.models.load_model(potato_model_path)
        prediction = next_model.predict(img_batch)
        return {"crop": crop, "class": POTATO_CLASS_NAMES[np.argmax(prediction[0])], "confidence": float(np.max(prediction[0]))}
    
    if crop == "Tomato":
        next_model = tf.keras.models.load_model(tomato_model_path)
        prediction = next_model.predict(img_batch)
        return {"crop": crop, "class": TOMATO_CLASS_NAMES[np.argmax(prediction[0])], "confidence": float(np.max(prediction[0]))}
    
    if crop == "Pepper":
        next_model = tf.keras.models.load_model(pepper_model_path)
        prediction = next_model.predict(img_batch)
        return {"crop": crop, "class": PEPPER_CLASS_NAMES[np.argmax(prediction[0])], "confidence": float(np.max(prediction[0]))}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8001)