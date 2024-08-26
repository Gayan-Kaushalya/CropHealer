from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

@app.get("/ping")
async def ping():
    return "pong"


def read_file_as_image(file) -> np.ndarray:
    image = np.array(Image.open(BytesIO(file)))
    return image


@app.post("/predict")
async def predict(file : UploadFile = File(...)):
  #  bytes = await file.read()
    image = read_file_as_image(await file.read())
    return image

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
