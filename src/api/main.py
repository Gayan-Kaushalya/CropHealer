from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from tensorflow import keras
import os

app = FastAPI()

plant_model_path = "src/models/plantModel.h5"
tomato_model_path = "src/models/tomatoModel.h5"
pepper_model_path = "src/models/pepperModel.h5"
potato_model_path = "src/models/potatoModel.h5"

if os.path.exists(plant_model_path):
    MODEL = tf.keras.models.load_model(potato_model_path)
else:
    raise FileNotFoundError(f"Model file not found at path: {potato_model_path}")

CLASS_NAMES = ["Potato", "Tomato", "Pepper"]
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
    image = np.array(Image.open(BytesIO(file)))
    return image


@app.post("/predict")

async def predict(file : UploadFile = File(...)):
    
    # bytes = await file.read()
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    prediction = MODEL.predict(img_batch)
    
    #first_prediction_class = CLASS_NAMES[np.argmax(prediction[0])]
    #first_prediction_confidence = np.max(prediction[0])
    crop = CLASS_NAMES[np.argmax(prediction[0])]
    
    if crop == "Potato":
        next_model = tf.keras.models.load_model(potato_model_path)
        prediction = next_model.predict(img_batch)
        
        predicted_class = POTATO_CLASS_NAMES[np.argmax(prediction[0])]
        predicted_class_confidence = np.max(prediction[0])
        
        second_prediction_class = POTATO_CLASS_NAMES[np.argsort(prediction[0])[-2]]
        second_prediction_confidence = np.sort(prediction[0])[-2]
        
        return {"class": POTATO_CLASS_NAMES[np.argmax(prediction[0])] , "confidence": float(np.max(prediction[0])), "second_prediction_class": second_prediction_class, "second_prediction_confidence": float(second_prediction_confidence)}
    
    if crop == "Tomato":
        next_model = tf.keras.models.load_model(tomato_model_path)
        prediction = next_model.predict(img_batch)
        return {"class": TOMATO_CLASS_NAMES[np.argmax(prediction[0])] , "confidence": float(np.max(prediction[0]))}
    
    if crop == "Pepper":
        next_model = tf.keras.models.load_model(pepper_model_path)
        prediction = next_model.predict(img_batch)
        return {"crop": crop, "class": PEPPER_CLASS_NAMES[np.argmax(prediction[0])] , "confidence": float(np.max(prediction[0]))}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8001)
    
