import { useState } from 'react'
import { predictPrice } from '../services/api'
import Toggle from '../components/Toggle'
import './Predict.css'

/* ── Initial form state ── */
const INIT = {
  area: '', bedrooms: '', bathrooms: '', stories: '',
  mainroad: null, guestroom: null, basement: null,
  hotwaterheating: null, airconditioning: null,
  parking: '', prefarea: null,
  furnishing: null,   // 'semi' | 'unfurnished' | 'furnished'
}

/* ── Validation ── */
function validate(f) {
  const e = {}
  if (!f.area || isNaN(f.area) || Number(f.area) <= 0)
    e.area = 'Enter a valid positive area.'
  if (!f.bedrooms || isNaN(f.bedrooms) || Number(f.bedrooms) < 1)
    e.bedrooms = 'Enter at least 1 bedroom.'
  if (!f.bathrooms || isNaN(f.bathrooms) || Number(f.bathrooms) < 1)
    e.bathrooms = 'Enter at least 1 bathroom.'
  if (!f.stories || isNaN(f.stories) || Number(f.stories) < 1)
    e.stories = 'Enter at least 1 story.'
  if (f.mainroad === null)      e.mainroad      = 'Please select.'
  if (f.guestroom === null)     e.guestroom     = 'Please select.'
  if (f.basement === null)      e.basement      = 'Please select.'
  if (f.hotwaterheating === null) e.hotwaterheating = 'Please select.'
  if (f.airconditioning === null) e.airconditioning = 'Please select.'
  if (f.parking === '' || isNaN(f.parking) || Number(f.parking) < 0)
    e.parking = 'Enter a valid parking count (0 or more).'
  if (f.prefarea === null)      e.prefarea      = 'Please select.'
  if (f.furnishing === null)    e.furnishing    = 'Please select furnishing status.'
  return e
}

/* ── Map form → exact X.columns payload ── */
function buildPayload(f) {
  return {
    area:            Number(f.area),
    bedrooms:        Number(f.bedrooms),
    bathrooms:       Number(f.bathrooms),
    stories:         Number(f.stories),
    mainroad:        f.mainroad,
    guestroom:       f.guestroom,
    basement:        f.basement,
    hotwaterheating: f.hotwaterheating,
    airconditioning: f.airconditioning,
    parking:         Number(f.parking),
    prefarea:        f.prefarea,
    // get_dummies(drop_first=True) on furnishingstatus drops 'furnished'
    // remaining dummies: furnishingstatus_semi-furnished, furnishingstatus_unfurnished
    'furnishingstatus_semi-furnished': f.furnishing === 'semi'        ? 1 : 0,
    'furnishingstatus_unfurnished':    f.furnishing === 'unfurnished' ? 1 : 0,
  }
}

/* ── Result card ── */
function ResultCard({ result, form, onReset }) {
  const furnishLabel = form.furnishing === 'semi' ? 'Semi-Furnished'
    : form.furnishing === 'unfurnished' ? 'Unfurnished' : 'Furnished'

  return (
    <div className="result-card card fade-up">
      <div className="result-card__header">
        <span className="result-card__icon">🏠</span>
        <p className="result-card__label">Estimated House Price</p>
        <p className="result-card__price">
          ₹ {Number(result.predicted_price).toLocaleString('en-IN')}
        </p>
      </div>

      <div className="result-card__summary">
        <h3>Input Summary</h3>
        <div className="grid-3" style={{ marginTop: 16 }}>
          {[
            ['Area',        `${form.area} sqft`],
            ['Bedrooms',    form.bedrooms],
            ['Bathrooms',   form.bathrooms],
            ['Stories',     form.stories],
            ['Parking',     form.parking],
            ['Furnishing',  furnishLabel],
            ['Main Road',   form.mainroad   ? 'Yes' : 'No'],
            ['Guestroom',   form.guestroom  ? 'Yes' : 'No'],
            ['Basement',    form.basement   ? 'Yes' : 'No'],
            ['Hot Water',   form.hotwaterheating ? 'Yes' : 'No'],
            ['AC',          form.airconditioning ? 'Yes' : 'No'],
            ['Pref. Area',  form.prefarea   ? 'Yes' : 'No'],
          ].map(([k, v]) => (
            <div key={k} className="summary-item">
              <span className="summary-item__key">{k}</span>
              <span className="summary-item__val">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-outline" style={{ marginTop: 28, width: '100%' }} onClick={onReset}>
        🔄 Predict Again
      </button>
    </div>
  )
}

/* ── Main page ── */
export default function Predict() {
  const [form,    setForm]    = useState(INIT)
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [apiErr,  setApiErr]  = useState('')

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true); setApiErr('')
    try {
      const data = await predictPrice(buildPayload(form))
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (err) {
      setApiErr(err.response?.data?.error || err.message || 'Network error. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => { setForm(INIT); setResult(null); setErrors({}); setApiErr('') }

  if (result) return (
    <div className="predict-page">
      <div className="container" style={{ maxWidth: 720, paddingTop: 100 }}>
        <ResultCard result={result} form={form} onReset={handleReset} />
      </div>
    </div>
  )

  return (
    <div className="predict-page">
      <div className="container" style={{ maxWidth: 860, paddingTop: 100 }}>
        <div className="predict-header fade-up">
          <span className="badge">🔮 ML Prediction</span>
          <h1 className="section-title" style={{ marginTop: 12 }}>House Price Prediction</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
            Fill in all 13 property features. The Python model will calculate the price.
          </p>
        </div>

        {apiErr && (
          <div className="api-error fade-up">
            ⚠️ {apiErr}
          </div>
        )}

        <form className="predict-form card fade-up" onSubmit={handleSubmit} noValidate>

          {/* ── Section 1: Basic ── */}
          <div className="form-section">
            <h2 className="form-section__title">📐 Basic Details</h2>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Area (sqft)</label>
                <input className={`form-input ${errors.area ? 'error' : ''}`} type="number" min="1"
                  placeholder="e.g. 1200" value={form.area} onChange={e => set('area', e.target.value)} />
                {errors.area && <p className="form-error">{errors.area}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Bedrooms</label>
                <input className={`form-input ${errors.bedrooms ? 'error' : ''}`} type="number" min="1"
                  placeholder="e.g. 3" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} />
                {errors.bedrooms && <p className="form-error">{errors.bedrooms}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <input className={`form-input ${errors.bathrooms ? 'error' : ''}`} type="number" min="1"
                  placeholder="e.g. 2" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} />
                {errors.bathrooms && <p className="form-error">{errors.bathrooms}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Stories</label>
                <input className={`form-input ${errors.stories ? 'error' : ''}`} type="number" min="1"
                  placeholder="e.g. 2" value={form.stories} onChange={e => set('stories', e.target.value)} />
                {errors.stories && <p className="form-error">{errors.stories}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Parking Spaces</label>
                <input className={`form-input ${errors.parking ? 'error' : ''}`} type="number" min="0"
                  placeholder="e.g. 1" value={form.parking} onChange={e => set('parking', e.target.value)} />
                {errors.parking && <p className="form-error">{errors.parking}</p>}
              </div>
            </div>
          </div>

          {/* ── Section 2: Amenities ── */}
          <div className="form-section">
            <h2 className="form-section__title">🏡 Amenities</h2>
            <div className="grid-2">
              {[
                ['mainroad',       'Main Road Nearby'],
                ['guestroom',      'Guestroom'],
                ['basement',       'Basement'],
                ['hotwaterheating','Hot Water Heating'],
                ['airconditioning','Air Conditioning'],
                ['prefarea',       'Preferred Area'],
              ].map(([key, label]) => (
                <div className="form-group" key={key}>
                  <label className="form-label">{label}</label>
                  <Toggle value={form[key]} onChange={v => set(key, v)} error={errors[key]} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 3: Furnishing ── */}
          <div className="form-section">
            <h2 className="form-section__title">🛋️ Furnishing Status</h2>
            <div className="form-group">
              <label className="form-label">Select Furnishing</label>
              <div className="furnish-group">
                {[
                  { val: 'furnished',    label: '✨ Furnished'      },
                  { val: 'semi',         label: '🪑 Semi-Furnished' },
                  { val: 'unfurnished',  label: '📦 Unfurnished'    },
                ].map(opt => (
                  <button key={opt.val} type="button"
                    className={`furnish-btn ${form.furnishing === opt.val ? 'furnish-btn--active' : ''}`}
                    onClick={() => set('furnishing', opt.val)}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.furnishing && <p className="form-error" style={{ marginTop: 6 }}>{errors.furnishing}</p>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? <><span className="spinner" /> Predicting...</> : '🔮 Predict House Price'}
          </button>
        </form>
      </div>
    </div>
  )
}
