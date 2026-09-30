import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt


def get_float_input(prompt):
    while True:
        try:
            val = float(input(prompt))
            if not np.isfinite(val):
                print("Please enter a valid finite number.")
                continue
            return val
        except ValueError:
            print("Invalid input. Please enter a number.")


data = pd.read_csv("Housing.csv")
print(data.head())

data_2 = data.copy()
for col in ["mainroad", "guestroom", "basement", "hotwaterheating", "airconditioning", "prefarea"]:
    data_2[col] = data_2[col].map({"yes": 1, "no": 0})

data_2 = pd.get_dummies(data_2, columns=["furnishingstatus"], dtype=int, drop_first=True)
print(data_2.head())

# Train model using all features
X = data_2.drop(columns=["price"])
y = data_2["price"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
mse = mean_squared_error(y_test, predictions)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, predictions)

print("MEAN ABSOLUTE ERROR  :", round(mae, 2))
print("MEAN SQUARED ERROR   :", round(mse, 2))
print("ROOT MEAN SQUARED ERROR:", round(rmse, 2))
print("R2-SCORE             :", round(r2, 2))

# Predict user input
area          = get_float_input("ENTER YOUR HOUSE AREA: ")
bedrooms      = get_float_input("ENTER NUMBER OF BEDROOMS: ")
bathrooms     = get_float_input("ENTER NUMBER OF BATHROOMS: ")
stories       = get_float_input("ENTER NUMBER OF STORIES: ")
mainroad      = get_float_input("IS MAIN ROAD NEARBY? (YES=1, NO=0): ")
guestroom     = get_float_input("DOES YOUR HOUSE HAVE A GUESTROOM? (YES=1, NO=0): ")
basement      = get_float_input("DOES YOUR HOUSE HAVE A BASEMENT? (YES=1, NO=0): ")
hotwaterheating = get_float_input("DOES YOUR HOUSE HAVE HOT WATER HEATING? (YES=1, NO=0): ")
airconditioning = get_float_input("DOES YOUR HOUSE HAVE AIR CONDITIONING? (YES=1, NO=0): ")
parking       = get_float_input("NUMBER OF PARKING SPACES: ")
prefarea      = get_float_input("IS YOUR HOUSE IN A PREFERRED AREA? (YES=1, NO=0): ")
semi_furnished = get_float_input("IS YOUR HOUSE SEMI-FURNISHED? (YES=1, NO=0): ")
unfurnished   = get_float_input("IS YOUR HOUSE UNFURNISHED? (YES=1, NO=0): ")

user_input = pd.DataFrame([[area, bedrooms, bathrooms, stories, mainroad, guestroom,
                             basement, hotwaterheating, airconditioning, parking,
                             prefarea, semi_furnished, unfurnished]],
                           columns=X.columns)

new_prediction = model.predict(user_input)

print("YOUR HOUSE PRICE     :", round(new_prediction[0], 2))
print("INTERCEPT            :", round(model.intercept_, 2))

coef = pd.DataFrame({"FEATURE": X.columns, "COEFFICIENT": model.coef_})
print(coef)
