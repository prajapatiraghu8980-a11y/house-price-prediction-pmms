import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

app = Flask(__name__)
CORS(app)

# ── Exact same preprocessing as house_price.py ──────────────────────────────
data = pd.read_csv("Housing.csv")
data_2 = data.copy()

for col in ["mainroad", "guestroom", "basement", "hotwaterheating", "airconditioning", "prefarea"]:
    data_2[col] = data_2[col].map({"yes": 1, "no": 0})

data_2 = pd.get_dummies(data_2, columns=["furnishingstatus"], dtype=int, drop_first=True)

X = data_2.drop(columns=["price"])
y = data_2["price"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)

mae  = float(mean_absolute_error(y_test, predictions))
mse  = float(mean_squared_error(y_test, predictions))
rmse = float(np.sqrt(mse))
r2   = float(r2_score(y_test, predictions))
# ─────────────────────────────────────────────────────────────────────────────


@app.route("/api/metrics", methods=["GET"])
def get_metrics():
    return jsonify({
        "mae":       round(mae,  2),
        "mse":       round(mse,  2),
        "rmse":      round(rmse, 2),
        "r2":        round(r2,   4),
        "intercept": round(float(model.intercept_), 2),
        "coefficients": [
            {"feature": feat, "coefficient": round(float(coef), 4)}
            for feat, coef in zip(X.columns, model.coef_)
        ],
        "feature_order": list(X.columns)
    })


@app.route("/api/predict", methods=["POST"])
def predict():
    body = request.get_json(force=True)
    try:
        user_input = pd.DataFrame([body], columns=X.columns)
        price = float(model.predict(user_input)[0])
        return jsonify({"predicted_price": round(price, 2)})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True, port=5001)
