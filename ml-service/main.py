from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import uvicorn  # <--- Added import

app = FastAPI(title="Real Estate ML Engine")

# Load trained ML model
model = joblib.load('property_price_model.pkl')

class PropertyFeatures(BaseModel):
    sqft: float
    bedrooms: int
    bathrooms: int
    age: int
    distance_to_city_center_km: float
    school_rating: float
    walk_score: int

@app.get("/")
def home():
    return {"message": "Real Estate Data Science API is Running"}

@app.post("/predict-price")
def predict_price(features: PropertyFeatures):
    input_data = np.array([[
        features.sqft,
        features.bedrooms,
        features.bathrooms,
        features.age,
        features.distance_to_city_center_km,
        features.school_rating,
        features.walk_score
    ]])
    
    predicted_price = float(model.predict(input_data)[0])
    
    return {
        "estimated_valuation": round(predicted_price, 2),
        "valuation_range": {
            "low": round(predicted_price * 0.95, 2),
            "high": round(predicted_price * 1.05, 2)
        }
    }

# <--- Add this at the bottom
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)