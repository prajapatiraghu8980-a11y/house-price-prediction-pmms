# 🏠 House Price Prediction — Full Stack ML Project

A B.E. Computer Engineering project combining a **scikit-learn Linear Regression** model
with a **React.js** frontend and a **Flask** REST API.

---

## 📁 Project Structure

```
House price prediction PMMS/
│
├── house_price.py          ← Original standalone ML script (UNCHANGED)
├── Housing.csv             ← Dataset
│
├── backend/
│   ├── app.py              ← Flask API (wraps the same ML logic)
│   └── Housing.csv         ← Copy of dataset for the API
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   ├── Navbar.jsx / Navbar.css
        │   └── Toggle.jsx
        ├── pages/
        │   ├── Home.jsx / Home.css
        │   ├── Predict.jsx / Predict.css
        │   ├── Performance.jsx / Performance.css
        │   └── About.jsx / About.css
        └── services/
            └── api.js
```

---

## ⚙️ Setup Instructions

### 1. Python Backend

**Install dependencies:**
```bash
pip install flask flask-cors numpy pandas scikit-learn
```

**Start the backend:**
```bash
cd backend
python app.py
```
Backend runs at → `http://localhost:5001`

---

### 2. React Frontend

**Install Node.js first (if not installed):**
- Download from https://nodejs.org (LTS version recommended)
- Or via Homebrew: `brew install node`

**Install frontend dependencies:**
```bash
cd frontend
npm install
```

**Start the frontend:**
```bash
npm run dev
```
Frontend runs at → `http://localhost:5173`

---

## 🔗 How React Communicates with Python

```
React (port 5173)
    │
    │  POST /api/predict   { area, bedrooms, ... }
    │  GET  /api/metrics
    ▼
Vite Dev Proxy  →  Flask (port 5001)
    │
    ▼
scikit-learn LinearRegression.predict()
    │
    ▼
{ predicted_price: 4750000 }  →  React Result Card
```

The Vite proxy in `vite.config.js` forwards all `/api/*` requests to `http://localhost:5001`,
so no CORS issues during development. Flask also has `flask-cors` enabled for production use.

---

## 🌐 API Endpoints

| Method | Endpoint       | Description                              |
|--------|----------------|------------------------------------------|
| GET    | /api/metrics   | Returns MAE, MSE, RMSE, R², intercept, coefficients |
| POST   | /api/predict   | Accepts 13 features, returns predicted price |

### POST /api/predict — Request Body
```json
{
  "area": 1200,
  "bedrooms": 3,
  "bathrooms": 2,
  "stories": 2,
  "mainroad": 1,
  "guestroom": 0,
  "basement": 0,
  "hotwaterheating": 0,
  "airconditioning": 1,
  "parking": 1,
  "prefarea": 0,
  "furnishingstatus_semi-furnished": 0,
  "furnishingstatus_unfurnished": 0
}
```

### POST /api/predict — Response
```json
{ "predicted_price": 4750000.0 }
```

---

## 🖥️ Pages

| Route         | Page              | Description                          |
|---------------|-------------------|--------------------------------------|
| /             | Home              | Dashboard with hero, stats, features |
| /predict      | Prediction Form   | 13-feature form + result card        |
| /performance  | Model Performance | MAE, MSE, RMSE, R², coefficients     |
| /about        | About             | Project explanation                  |

---

## ⚠️ Important Notes

- The original `house_price.py` is **NOT modified** — it remains a standalone script.
- The backend `app.py` uses the **exact same preprocessing** as `house_price.py`.
- Feature order sent from React matches `X.columns` exactly.
- `furnishingstatus` is one-hot encoded with `drop_first=True`, producing:
  - `furnishingstatus_semi-furnished`
  - `furnishingstatus_unfurnished`
  - (Furnished = both are 0, the dropped baseline)
