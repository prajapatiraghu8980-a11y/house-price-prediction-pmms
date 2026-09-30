import { Link } from 'react-router-dom'
import './Home.css'

const featureCards = [
  { icon: '🤖', title: 'Machine Learning',    desc: 'Powered by scikit-learn Linear Regression trained on real housing data.' },
  { icon: '📈', title: 'Linear Regression',   desc: 'A proven statistical model that finds the best-fit relationship between features and price.' },
  { icon: '🔢', title: '13 Features',         desc: 'Area, bedrooms, bathrooms, amenities and more — all considered for accuracy.' },
  { icon: '⚡', title: 'Real-time Prediction', desc: 'Instant price estimates powered by a live Python/Flask API.' },
]

const stats = [
  { value: '545+', label: 'Training Samples' },
  { value: '13',   label: 'Input Features'   },
  { value: 'R²',   label: 'Accuracy Metric'  },
  { value: '100%', label: 'Python Backend'   },
]

export default function Home() {
  return (
    <main className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__blob hero__blob--1" />
          <div className="hero__blob hero__blob--2" />
        </div>
        <div className="container hero__content fade-up">
          <span className="badge">🏡 AI-Powered Property Valuation</span>
          <h1 className="hero__title">
            Predict House Prices<br />
            <span className="hero__title--accent">with Machine Learning</span>
          </h1>
          <p className="hero__desc">
            Enter your property details and get an instant price estimate using a
            Linear Regression model trained on real housing data — built as a
            B.E. Computer Engineering ML project.
          </p>
          <div className="hero__actions">
            <Link to="/predict" className="btn btn-primary btn-lg">
              🔮 Predict House Price
            </Link>
            <Link to="/performance" className="btn btn-outline btn-lg">
              📊 View Model Stats
            </Link>
          </div>
        </div>

        {/* House illustration */}
        <div className="hero__visual fade-up" style={{ animationDelay: '.15s' }}>
          <div className="house-card">
            <div className="house-card__img">🏠</div>
            <div className="house-card__body">
              <p className="house-card__label">Estimated Value</p>
              <p className="house-card__price">₹ 47,50,000</p>
              <div className="house-card__tags">
                <span>3 BHK</span><span>1200 sqft</span><span>AC</span>
              </div>
            </div>
            <div className="house-card__badge">ML Predicted ✓</div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="stats-bar section-sm">
        <div className="container">
          <div className="grid-4">
            {stats.map(s => (
              <div key={s.label} className="stat-item card">
                <span className="stat-item__value">{s.value}</span>
                <span className="stat-item__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="badge">How it works</span>
            <h2 className="section-title">Built on Solid ML Foundations</h2>
            <p className="section-sub">
              This project uses a complete scikit-learn pipeline — from data preprocessing
              to model evaluation — exposed through a REST API.
            </p>
          </div>
          <div className="grid-4" style={{ marginTop: 40 }}>
            {featureCards.map(c => (
              <div key={c.title} className="feature-card card">
                <div className="feature-card__icon">{c.icon}</div>
                <h3 className="feature-card__title">{c.title}</h3>
                <p className="feature-card__desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta section-sm">
        <div className="container">
          <div className="cta__inner card">
            <div>
              <h2 className="cta__title">Ready to predict your house price?</h2>
              <p className="cta__sub">Fill in 13 property features and get an instant ML-powered estimate.</p>
            </div>
            <Link to="/predict" className="btn btn-primary btn-lg">
              Start Prediction →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
