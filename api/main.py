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

#plant_model_path = "models/plantNew.h5"
#CLASS_NAMES = ["Tea", "Grapes", "Bean", "Eggplant", "Pepper", "Corn", "Rice", "Potato", "Apple", "Tomato"]

plant_model_path = "models/plantModel.h5"
CLASS_NAMES = ["Pepper","Potato", "Tomato"]


tomato_model_path = "models/tomatoModel.h5"
pepper_model_path = "models/pepperModel.h5"
potato_model_path = "models/potatoModel.h5"
tea_model_path = "models/teaModel.h5"

if os.path.exists(plant_model_path):
    MODEL = tf.keras.models.load_model(plant_model_path)
else:
    raise FileNotFoundError(f"Model file not found at path: {plant_model_path}")


POTATO_CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]
TOMATO_CLASS_NAMES = ['Bacterial Spot',
 'Early Blight',
 'Late Blight',
 'Leaf Mold',
 'Septoria Leaf Spot',
 'Two-spotted Spider Mite',
 'Target Spot',
 'Tomato Yellow Leaf Curl Virus',
 'Tomato Mosaic Virus',
 'Healthy']
PEPPER_CLASS_NAMES = ['Bacterial Spot', 'Healthy']
TEA_CLASS_NAMES = ['Anthracnose', 'Algal Leaf', 'Bird Eye Spot', 'Brown Blight', 'Gray Light', 'Healthy', 'Red Leaf Spot', 'White Spot']


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
    
    resized_image = tf.image.resize(image, (256, 256))

    
    img_batch = np.expand_dims(resized_image, 0)
    prediction = MODEL.predict(img_batch)
    
    crop = CLASS_NAMES[np.argmax(prediction[0])]
    
    if crop == "Potato":
        next_model = tf.keras.models.load_model(potato_model_path)
        prediction = next_model.predict(img_batch)
        return {"crop": crop, "class": POTATO_CLASS_NAMES[np.argmax(prediction[0])], "confidence": str(round(float(np.max(prediction[0]))*100, 2))+"%"}
    
    if crop == "Tomato":
        next_model = tf.keras.models.load_model(tomato_model_path)
        prediction = next_model.predict(img_batch)
        return {"crop": crop, "class": TOMATO_CLASS_NAMES[np.argmax(prediction[0])], "confidence": str(round(float(np.max(prediction[0]))*100, 2))+"%"}
    
    if crop == "Pepper":
        next_model = tf.keras.models.load_model(pepper_model_path)
        prediction = next_model.predict(img_batch)
        return {"crop": crop, "class": PEPPER_CLASS_NAMES[np.argmax(prediction[0])], "confidence": str(round(float(np.max(prediction[0]))*100, 2))+"%"}
    
    if crop == "Tea":
        return {"crop": crop, "class": "Tea", "confidence": "100%"}
    
    if crop == "Grapes":
        return {"crop": crop, "class": "Grapes", "confidence": "100%"}
    
    if crop == "Bean":
        return {"crop": crop, "class": "Bean", "confidence": "100%"}
    
    if crop == "Eggplant":
        return {"crop": crop, "class": "Eggplant", "confidence": "100%"}
    
    if crop == "Corn":
        return {"crop": crop, "class": "Corn", "confidence": "100%"}
    
    if crop == "Rice":
        return {"crop": crop, "class": "Rice", "confidence": "100%"}
    
    if crop == "Apple":
        return {"crop": crop, "class": "Apple", "confidence": "100%"}
    

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8001)