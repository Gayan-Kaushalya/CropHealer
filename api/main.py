from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import os
import base64
from pydantic import BaseModel
from lime import lime_image
import matplotlib.pyplot as plt
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

plant_model_path = "models/plantType.h5"      # You may hacve to change this time to time to plantNew (10 classes) and plantType (13 classes)
CLASS_NAMES = ['Apple', 'Banana', 'Bean', 'Coffee', 'Corn', 'Eggplant', 'Grapes', 'Pepper', 'Potato', 'Rice', 'Sugarcane', 'Tea', 'Tomato'] # 13 classes
# CLASS_NAMES = ['Apple', 'Bean', 'Corn', 'Eggplant', 'Grapes', 'Pepper', 'Potato', 'Rice', 'Tea', 'Tomato']  # 10 classes

#plant_model_path = "models/plantModel.h5"
#CLASS_NAMES = ["Pepper","Potato", "Tomato"]


tomato_model_path = "models/tomatoModel.h5"
pepper_model_path = "models/pepperModel.h5"
potato_model_path = "models/potatoModel.h5"
tea_model_path = "models/teaModel.h5"               
apple_model_path = "models/appleModel.h5"
bean_model_path = "models/soybeanModel.h5"         ###################################
banana_model_path = "models/banana.h5"
corn_model_path = "models/cornModel.h5"
coffee_model_path = "models/coffee 2.h5"            ###################################
eggplant_model_path = "models/eggplantModel.h5"
grapes_model_path = "models/grapeModel.h5"            ###################################
sugarcane_model_path = "models/sugarcaneModel.h5"      
rice_model_path = "models/riceModel.h5"

if os.path.exists(plant_model_path):
    MODEL = tf.keras.models.load_model(plant_model_path)
else:
    raise FileNotFoundError(f"Model file not found at path: {plant_model_path}")

POTATO_CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]
TOMATO_CLASS_NAMES = ['Bacterial Spot',
 'Early Blight',
 'Late Blight',
 'Tomato Leaf Mold',
 'Septoria Leaf Spot',
 'Two-spotted Spider Mite',
 'Target Spot',
 'Tomato Yellow Leaf Curl Virus',
 'Tomato Mosaic Virus',
 'Healthy']
PEPPER_CLASS_NAMES = ['Bacterial Spot', 'Healthy']
TEA_CLASS_NAMES = ['Anthracnose', 'Algal Leaf Spot', "Bird's Eye Spot", 'Brown Blight', 'Gray Light', 'Healthy', 'Red Leaf Spot', 'White Spot']
GRAPE_CLASS_NAMES = ['Black Measles', 'Black Rot', 'Healthy', 'Phoma Blight']
APPLE_CLASS_NAMES = ['Apple Scab', 'Black Rot', 'Cedar Apple Rust', 'Healthy']
SOYBEAN_CLASS_NAMES = ['Mossaic Virus', 'Southern Blight', 'Sudden Death Syndrome', 'Yellow Mosaic', 'Bacterial Blight', 'Brown Spot', 'Crestamento', 'Bean Rust', 'Powdery Mildew', 'Septoria']
BANANA_CLASS_NAMES = ['Cordana', 'Healthy', 'Pestalotiopsis', 'Sigatoka']
CORN_CLASS_NAMES = ['Northern Leaf Blight', 'Common Rust', 'Gray Leaf Spot', 'Healthy']
COFFEE_CLASS_NAMES = ['Coffee Leaf Miner', 'Healthy', 'Phoma Blight', 'Rust of Coffee']
SUGARCANE_CLASS_NAMES = ['Bacterial Blight', 'Healthy', 'Mosaic Virus', 'Red Rot', 'Sugarcane Common Rust', 'Yellow Leaf Virus']
RICE_CLASS_NAMES = ['Brown Spot', 'Healthy', 'Rice Hispa', 'Leaf Blast']
EGGPLANT_CLASS_NAMES = ['Healthy', 'Bacterial Wilt', 'Cercospora Leaf Spot', 'Insect Pest Disease', 'Mosaic Virus', 'Small Leaf Disease', 'White Mold']


@app.get("/ping")
async def ping():
    return "pong"


def read_file_as_image(file) -> np.ndarray:
    #print(file)
    image = np.array(Image.open(BytesIO(file)))
    return image


class ImageData(BaseModel):
    base64: str


def generate_lime_explanation(model, image):
    explainer = lime_image.LimeImageExplainer()
    
    def predict_fn(images):
        images = np.array(images)
        return model.predict(images)
    
    explanation = explainer.explain_instance(
        image, 
        predict_fn, 
        top_labels=1, 
        hide_color=0, 
        num_samples=1000
    )

    # Get the heatmap for the top prediction
    top_label = explanation.top_labels[0]
    dict_heatmap = dict(explanation.local_exp[top_label])
    heatmap = np.vectorize(dict_heatmap.get)(explanation.segments)
    
    # Create heatmap image
    plt.imshow(image)
    plt.imshow(heatmap, cmap="viridis", alpha=0.5)
    plt.axis('off')

    buf = io.BytesIO()
    
    # Save the heatmap with tight bounding box and no padding
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
    plt.close()
    buf.seek(0)

    # Encode heatmap to base64
    heatmap_base64 = base64.b64encode(buf.read()).decode('utf-8')
    return heatmap_base64



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
    
    # Initialize crop-specific model
    if crop == "Potato":
        next_model = tf.keras.models.load_model(potato_model_path)
        crop_class_names = POTATO_CLASS_NAMES
    elif crop == "Tomato":
        next_model = tf.keras.models.load_model(tomato_model_path)
        crop_class_names = TOMATO_CLASS_NAMES
    elif crop == "Pepper":
        next_model = tf.keras.models.load_model(pepper_model_path)
        crop_class_names = PEPPER_CLASS_NAMES
    elif crop == "Tea":
        next_model = tf.keras.models.load_model(tea_model_path)
        crop_class_names = TEA_CLASS_NAMES
    elif crop == "Grapes":
        next_model = tf.keras.models.load_model(grapes_model_path)
        crop_class_names = GRAPE_CLASS_NAMES
    elif crop == "Bean":
        next_model = tf.keras.models.load_model(bean_model_path)
        crop_class_names = SOYBEAN_CLASS_NAMES
    elif crop == "Eggplant":
        next_model = tf.keras.models.load_model(eggplant_model_path)
        crop_class_names = EGGPLANT_CLASS_NAMES
    elif crop == "Corn":
        next_model = tf.keras.models.load_model(corn_model_path)
        crop_class_names = CORN_CLASS_NAMES
    elif crop == "Rice":
        next_model = tf.keras.models.load_model(rice_model_path)
        crop_class_names = RICE_CLASS_NAMES
    elif crop == "Apple":
        next_model = tf.keras.models.load_model(apple_model_path)
        crop_class_names = APPLE_CLASS_NAMES
    elif crop == "Banana":
        next_model = tf.keras.models.load_model(banana_model_path)
        crop_class_names = BANANA_CLASS_NAMES
    elif crop == "Coffee":
        next_model = tf.keras.models.load_model(coffee_model_path)
        crop_class_names = COFFEE_CLASS_NAMES
    elif crop == "Sugarcane":
        next_model = tf.keras.models.load_model(sugarcane_model_path)
        crop_class_names = SUGARCANE_CLASS_NAMES
    else:
        return {"error": "Unknown crop"}

    prediction = next_model.predict(img_batch)
    predicted_class = crop_class_names[np.argmax(prediction[0])]
    confidence = str(round(float(np.max(prediction[0])) * 100, 2)) + "%"
    
    # Generate LIME heatmap
    lime_heatmap = generate_lime_explanation(next_model, resized_image.numpy().astype(np.uint8))
    
    return {
        "crop": crop,
        "class": predicted_class,
        "confidence": confidence,
        "lime_heatmap": lime_heatmap  # base64 encoded heatmap
    }


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8001)
