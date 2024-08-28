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

model_path = "src/models/potatoModel.h5"
if os.path.exists(model_path):
    MODEL = tf.keras.models.load_model(model_path)
else:
    raise FileNotFoundError(f"Model file not found at path: {model_path}")
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

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
  
  return {"class": CLASS_NAMES[np.argmax(prediction[0])] , "confidence": float(np.max(prediction[0]))}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8001)
    
