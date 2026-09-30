from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load trained model
model = joblib.load('property_price_model.pkl')

# 📌 Root Route for Health Check
@app.route('/', methods=['GET'])
def home():
    return jsonify({'status': 'online', 'message': 'ML Prediction Microservice is running!'})

# 📌 Prediction Endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = np.array([[
            data.get('bedrooms', 2),
            data.get('bathrooms', 2),
            data.get('sqft', 1200),
            data.get('age', 5),
            data.get('distance_to_city_center_km', 5.0),
            data.get('school_rating', 8.0),
            data.get('walk_score', 75),
            data.get('latitude', 40.7128),
            data.get('longitude', -74.0060)
        ]])

        predicted_price = model.predict(features)[0]
        return jsonify({'success': True, 'predicted_price': round(predicted_price, 2)})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)