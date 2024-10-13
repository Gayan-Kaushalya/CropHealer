import pytest
from fastapi.testclient import TestClient
from api.main import app, ImageData
import base64

client = TestClient(app)

def test_ping():
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json() == "pong"

def test_predict_valid_image():
    # Load a sample image and convert it to base64
    with open("tests/sample_image.jpg", "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    response = client.post("/predict", json={"base64": base64_image})
    assert response.status_code == 200
    assert "crop" in response.json()
    assert "class" in response.json()
    assert "confidence" in response.json()
    assert "lime_heatmap" in response.json()

def test_predict_invalid_image():
    response = client.post("/predict", json={"base64": "invalid_base64"})
    assert response.status_code == 422  # Unprocessable Entity

if __name__ == "__main__":
    pytest.main()