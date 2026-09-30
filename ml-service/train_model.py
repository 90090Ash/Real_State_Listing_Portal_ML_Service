import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# 1. Create a dummy/sample dataset (or load from CSV/Database)
data = {
    'bedrooms': [1, 2, 3, 3, 4, 2, 4, 5, 3, 2],
    'bathrooms': [1, 1.5, 2, 2.5, 3, 1, 3.5, 4, 2, 2],
    'sqft': [650, 950, 1400, 1800, 2400, 850, 2800, 3500, 1600, 1100],
    'age': [10, 5, 12, 2, 1, 20, 3, 0, 8, 15],
    'distance_to_city_center_km': [2.5, 5.0, 8.2, 3.1, 12.0, 1.2, 15.0, 18.0, 6.5, 4.0],
    'school_rating': [8.5, 7.0, 9.0, 8.8, 9.5, 6.5, 9.2, 9.8, 8.0, 7.5],
    'walk_score': [90, 75, 60, 85, 40, 95, 35, 30, 70, 80],
    'latitude': [40.7521, 40.7488, 40.7850, 40.7128, 40.8000, 40.7300, 40.8200, 40.8500, 40.7600, 40.7400],
    'longitude': [-73.9812, -73.9851, -73.9682, -74.0060, -73.9500, -73.9900, -73.9300, -73.9100, -73.9700, -73.9800],
    'price': [2800000, 4500000, 6800000, 8200000, 1100000, 380000, 1250000, 1600000, 750000, 510000]
}

df = pd.DataFrame(data)

# 2. Features and Target
X = df[['bedrooms', 'bathrooms', 'sqft', 'age', 'distance_to_city_center_km', 'school_rating', 'walk_score', 'latitude', 'longitude']]
y = df['price']

# 3. Train Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42, test_size=0.2)

# 4. Train Random Forest Model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# 5. Save Model File
joblib.dump(model, 'property_price_model.pkl')
print("✅ ML Model trained and saved as property_price_model.pkl")