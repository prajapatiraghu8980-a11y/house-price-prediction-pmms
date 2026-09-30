import { useEffect, useState } from 'react'
import { fetchMetrics } from '../services/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import './Performance.css'

const COLORS = ['#4f46e5','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6',
                 '#ec4899','#14b8a6','#f97316','#6366f1','#84cc16','#0ea5e9','#a855f7']

export default function Performance() {
  const [metrics, setMetrics] = useState(null)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetchMetrics()
      .then(setMetrics)
      .catch(() => setError('Could not load metrics. Make sure the backend is running on port 5001.'))
  }, [])

  if (error) return (
    <div className="perf-page">
      <div className="container" style={{ paddingTop: 100 }}>
        <div className="api-error fade-up">⚠️ {error}</div>
      </div>
    </div>
  )

  if (!metrics) return (
    <div className="perf-page">
      <div className="container" style={{ paddingTop: 120, textAlign: 'center' }}>
        <div className="loading-ring" />
        <p style={{ marginTop: 20, color: 'var(--text-muted)' }}>Loading model metrics…</p>
      </div>
    </div>
  )

  const metricCards = [
    { label: 'MAE',      value: metrics.mae.toLocaleString('en-IN'),  desc: 'Mean Absolute Error',          color: '#4f46e5', icon: '📉' },
    { label: 'MSE',      value: metrics.mse.toLocaleString('en-IN'),  desc: 'Mean Squared Error',           color: '#06b6d4', icon: '📊' },
    { label: 'RMSE',     value: metrics.rmse.toLocaleString('en-IN'), desc: 'Root Mean Squared Error',      color: '#10b981', icon: '📐' },
    { label: 'R² Score', value: metrics.r2,                           desc: 'Coefficient of Determination', color: '#f59e0b', icon: '🎯' },
  ]

  const maxCoef = Math.max(...metrics.coefficients.map(r => Math.abs(r.coefficient)))

  return (
    <div className="perf-page">
      <div className="container" style={{ paddingTop: 100 }}>

        <div className="predict-header fade-up">
          <span className="badge">📊 Model Evaluation</span>
          <h1 className="section-title" style={{ marginTop: 12 }}>Model Performance</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
            Live metrics from the scikit-learn Linear Regression model trained on Housing.csv
          </p>
        </div>

        {/* ── Metric cards ── */}
        <div className="grid-4 fade-up" style={{ marginTop: 40 }}>
          {metricCards.map(m => (
            <div key={m.label} className="metric-card card">
              <span className="metric-card__icon">{m.icon}</span>
              <p className="metric-card__label">{m.label}</p>
              <p className="metric-card__value" style={{ color: m.color }}>{m.value}</p>
              <p className="metric-card__desc">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Intercept ── */}
        <div className="intercept-card card fade-up" style={{ marginTop: 24 }}>
          <span className="intercept-card__icon">⚓</span>
          <div>
            <p className="metric-card__label">Model Intercept</p>
            <p className="metric-card__value" style={{ color: 'var(--primary)' }}>
              {metrics.intercept.toLocaleString('en-IN')}
            </p>
            <p className="metric-card__desc">Baseline price when all feature values are zero.</p>
          </div>
        </div>

        {/* ── Coefficients bar chart ── */}
        <div className="chart-card card fade-up" style={{ marginTop: 24 }}>
          <h2 className="chart-title">📈 Feature Coefficients</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.coefficients} margin={{ top: 0, right: 8, left: 8, bottom: 90 }}>
              <XAxis dataKey="feature" angle={-40} textAnchor="end" tick={{ fontSize: 10 }} interval={0} />
              <YAxis tick={{ fontSize: 11 }} width={70} />
              <Tooltip formatter={(v) => v.toLocaleString('en-IN')} />
              <Bar dataKey="coefficient" radius={[4,4,0,0]}>
                {metrics.coefficients.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Coefficients table (scrollable on mobile) ── */}
        <div className="card fade-up" style={{ marginTop: 24, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table className="coef-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Feature</th>
                  <th>Coefficient</th>
                  <th>Impact</th>
                </tr>
              </thead>
              <tbody>
                {metrics.coefficients.map((row, i) => (
                  <tr key={row.feature}>
                    <td className="coef-table__num">{i + 1}</td>
                    <td className="coef-table__feat">{row.feature}</td>
                    <td className="coef-table__val"
                      style={{ color: row.coefficient >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {row.coefficient >= 0 ? '+' : ''}{row.coefficient.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <div className="coef-bar-wrap">
                        <div className="coef-bar"
                          style={{
                            width: `${Math.min(100, Math.abs(row.coefficient) / maxCoef * 100)}%`,
                            background: row.coefficient >= 0 ? 'var(--success)' : 'var(--danger)'
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
