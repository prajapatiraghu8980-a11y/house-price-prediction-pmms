import './About.css'

const features = [
  'Area (sqft)', 'Bedrooms', 'Bathrooms', 'Stories',
  'Main Road Nearby', 'Guestroom', 'Basement', 'Hot Water Heating',
  'Air Conditioning', 'Parking Spaces', 'Preferred Area',
  'Semi-Furnished', 'Unfurnished',
]

const metrics = [
  { name: 'MAE',  full: 'Mean Absolute Error',         desc: 'Average absolute difference between predicted and actual prices. Lower is better.' },
  { name: 'MSE',  full: 'Mean Squared Error',          desc: 'Average of squared differences. Penalises large errors more heavily.' },
  { name: 'RMSE', full: 'Root Mean Squared Error',     desc: 'Square root of MSE — same unit as price, easier to interpret.' },
  { name: 'R²',   full: 'Coefficient of Determination', desc: 'Proportion of variance explained by the model. Closer to 1.0 is better.' },
]

export default function About() {
  return (
    <div className="about-page">
      <div className="container" style={{ paddingTop: 100, maxWidth: 860 }}>

        <div className="predict-header fade-up">
          <span className="badge">📖 About This Project</span>
          <h1 className="section-title" style={{ marginTop: 12 }}>House Price Prediction</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
            A B.E. Computer Engineering Machine Learning project
          </p>
        </div>

        {/* What is it */}
        <div className="about-card card fade-up">
          <h2>🏠 What is House Price Prediction?</h2>
          <p>
            House Price Prediction is a supervised machine learning task where a model learns
            the relationship between property features (like area, number of rooms, amenities)
            and the selling price. Once trained, the model can estimate the price of any new
            property based on its features — without needing a human appraiser.
          </p>
          <p>
            This project uses a real housing dataset (<strong>Housing.csv</strong>) containing
            545 property records with 13 features each.
          </p>
        </div>

        {/* Linear Regression */}
        <div className="about-card card fade-up">
          <h2>📈 How Linear Regression Works</h2>
          <p>
            Linear Regression finds the best-fit straight line (or hyperplane in multiple
            dimensions) through the training data. It learns a <strong>coefficient</strong> for
            each feature and an <strong>intercept</strong>, then combines them to predict price:
          </p>
          <div className="formula-box">
            Price = Intercept + (w₁ × Area) + (w₂ × Bedrooms) + … + (w₁₃ × Unfurnished)
          </div>
          <p>
            The model is trained using <strong>scikit-learn's LinearRegression</strong> with an
            80/20 train-test split and <code>random_state=42</code> for reproducibility.
          </p>
        </div>

        {/* Features */}
        <div className="about-card card fade-up">
          <h2>🔢 The 13 Input Features</h2>
          <p>
            Binary features (yes/no) are encoded as 1/0. The furnishing status is one-hot
            encoded using <code>pd.get_dummies(drop_first=True)</code>, producing two dummy
            columns: <em>semi-furnished</em> and <em>unfurnished</em> (furnished is the baseline).
          </p>
          <div className="feature-grid">
            {features.map((f, i) => (
              <div key={f} className="feature-pill">
                <span className="feature-pill__num">{i + 1}</span>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="about-card card fade-up">
          <h2>📊 What the Evaluation Metrics Mean</h2>
          <div className="metrics-list">
            {metrics.map(m => (
              <div key={m.name} className="metric-row">
                <div className="metric-row__name">{m.name}</div>
                <div>
                  <p className="metric-row__full">{m.full}</p>
                  <p className="metric-row__desc">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="about-card card fade-up">
          <h2>🛠️ Tech Stack</h2>
          <div className="tech-grid">
            {[
              ['🐍', 'Python 3',       'Core language'],
              ['🔢', 'NumPy',          'Numerical computing'],
              ['🐼', 'Pandas',         'Data manipulation'],
              ['🤖', 'scikit-learn',   'ML model & metrics'],
              ['🌶️', 'Flask',          'REST API backend'],
              ['⚛️', 'React.js',       'Frontend UI'],
              ['⚡', 'Vite',           'Frontend build tool'],
              ['📊', 'Recharts',       'Data visualisation'],
            ].map(([icon, name, role]) => (
              <div key={name} className="tech-item card">
                <span className="tech-item__icon">{icon}</span>
                <span className="tech-item__name">{name}</span>
                <span className="tech-item__role">{role}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
