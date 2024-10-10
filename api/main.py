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
from lime import lime_image
from skimage.segmentation import mark_boundaries

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Load your models here
plant_model_path = "models/plantModel.h5"
CLASS_NAMES = ["Pepper", "Potato", "Tomato"]

# Load additional models
tomato_model_path = "models/tomatoModel.h5"
pepper_model_path = "models/pepperModel.h5"
potato_model_path = "models/potatoModel.h5"
tea_model_path = "models/teaModel.h5"

if os.path.exists(plant_model_path):
    MODEL = tf.keras.models.load_model(plant_model_path)
else:
    raise FileNotFoundError(f"Model file not found at path: {plant_model_path}")

# Define your specific class names for detailed predictions
POTATO_CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]
TOMATO_CLASS_NAMES = ['Bacterial Spot', 'Early Blight', 'Late Blight', 'Leaf Mold',
                      'Septoria Leaf Spot', 'Two-spotted Spider Mite', 
                      'Target Spot', 'Tomato Yellow Leaf Curl Virus', 
                      'Tomato Mosaic Virus', 'Healthy']
PEPPER_CLASS_NAMES = ['Bacterial Spot', 'Healthy']
TEA_CLASS_NAMES = ['Anthracnose', 'Algal Leaf', 'Bird Eye Spot', 
                   'Brown Blight', 'Gray Light', 'Healthy', 
                   'Red Leaf Spot', 'White Spot']

@app.get("/ping")
async def ping():
    return "pong"

def read_file_as_image(file) -> np.ndarray:
    image = np.array(Image.open(BytesIO(file)))
    return image

class ImageData(BaseModel):
    base64: str

@app.post("/predict")
async def predict(image_data: ImageData):
    # Decode the base64 image
    image_data_bytes = base64.b64decode(image_data.base64)
    image_bytes_io = BytesIO(image_data_bytes)
    image = Image.open(image_bytes_io)
    image = read_file_as_image(image_data_bytes)

    # Resize and prepare the image for prediction
    resized_image = tf.image.resize(image, (256, 256))
    img_batch = np.expand_dims(resized_image, 0)

    # Get the initial crop prediction
    prediction = MODEL.predict(img_batch)
    crop = CLASS_NAMES[np.argmax(prediction[0])]

    # Load specific model for further classification
    if crop == "Potato":
        next_model = tf.keras.models.load_model(potato_model_path)
        prediction = next_model.predict(img_batch)
        return {
            "crop": crop, 
            "class": POTATO_CLASS_NAMES[np.argmax(prediction[0])], 
            "confidence": str(round(float(np.max(prediction[0])) * 100, 2)) + "%"
        }

    if crop == "Tomato":
        next_model = tf.keras.models.load_model(tomato_model_path)
        prediction = next_model.predict(img_batch)
        return {
            "crop": crop, 
            "class": TOMATO_CLASS_NAMES[np.argmax(prediction[0])], 
            "confidence": str(round(float(np.max(prediction[0])) * 100, 2)) + "%"
        }

    if crop == "Pepper":
        next_model = tf.keras.models.load_model(pepper_model_path)
        prediction = next_model.predict(img_batch)
        return {
            "crop": crop, 
            "class": PEPPER_CLASS_NAMES[np.argmax(prediction[0])], 
            "confidence": str(round(float(np.max(prediction[0])) * 100, 2)) + "%"
        }

    return {"crop": crop, "class": "Unknown", "confidence": "0%"}

@app.post("/explain")
async def explain(image_data: ImageData):
    # Decode the base64 image
    image_data_bytes = base64.b64decode(image_data.base64)
    image_bytes_io = BytesIO(image_data_bytes)
    original_image = Image.open(image_bytes_io)
    original_image_np = np.array(original_image)

    # Resize the image for prediction
    resized_image = tf.image.resize(original_image_np, (256, 256))
    img_batch = np.expand_dims(resized_image, 0)

    # Get prediction
    prediction = MODEL.predict(img_batch)
    crop = CLASS_NAMES[np.argmax(prediction[0])]

    # Use Lime for explanations
    explainer = lime_image.LimeImageExplainer()

    # Generate explanations
    explanation = explainer.explain_instance(
        original_image_np.astype('double'),
        MODEL.predict,
        top_labels=3,
        hide_color=0,
        num_samples=1000
    )

    # Get the explanation for the predicted label
    temp, mask = explanation.get_image_and_mask(
        np.argmax(prediction[0]), 
        positive_only=True, 
        num_features=10, 
        hide_rest=False  # Show the rest of the image but highlight the features
    )

    # Convert the original image to grayscale to emphasize the explanation
    grayscale_image = np.dot(original_image_np[..., :3], [0.2989, 0.587, 0.114])  # Convert to grayscale
    grayscale_image_rgb = np.stack([grayscale_image] * 3, axis=-1)  # Convert back to RGB format

    # Overlay the Lime explanation on the grayscaled image
    explained_image = mark_boundaries(grayscale_image_rgb, mask)

    # Convert the explained image to base64 for sending back
    pil_image = Image.fromarray((explained_image * 255).astype(np.uint8))  # Multiply by 255 to get correct pixel values
    buffered = BytesIO()
    pil_image.save(buffered, format="PNG")
    explained_image_base64 = base64.b64encode(buffered.getvalue()).decode()

    return {
        "crop": crop,
        "explanation": explained_image_base64,
        "confidence": str(round(float(np.max(prediction[0])) * 100, 2)) + "%"
    }



if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8001)
