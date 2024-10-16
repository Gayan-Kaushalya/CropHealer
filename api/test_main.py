import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import base64
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from api.main import app, ImageData
from PIL import Image
from io import BytesIO

client = TestClient(app)

def test_ping():
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json() == "pong"

@patch("api.main.MODEL.predict")
@patch("api.main.tf.keras.models.load_model")
@patch("api.main.generate_lime_explanation")
def test_predict(mock_generate_lime_explanation, mock_load_model, mock_model_predict):
    # Mock the initial model prediction to return a specific crop
    mock_model_predict.return_value = [[0.1, 0.9, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]]
    
    # Mock the crop-specific model prediction
    mock_crop_model = mock_load_model.return_value
    mock_crop_model.predict.return_value = [[0.2, 0.8, 0.0]]
    
    # Mock the lime explanation
    mock_generate_lime_explanation.return_value = "mocked_lime_heatmap"
    
    # Sample base64 image (a small red dot image)
    sample_image = Image.new("RGB", (1, 1), color = (255, 0, 0))
    buffered = BytesIO()
    sample_image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    response = client.post("/predict", json={"base64": img_str})
    
    assert response.status_code == 200
    response_json = response.json()
    
    assert "crop" in response_json
    assert "class" in response_json
    assert "confidence" in response_json
    assert "lime_heatmap" in response_json

    assert response_json["crop"] == "Banana"  # Based on the mock prediction
    assert response_json["class"] == "Healthy"  # Based on the mock crop-specific prediction
    assert response_json["lime_heatmap"] == "mocked_lime_heatmap"  # Based on the mock lime explanation
