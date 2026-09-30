export default function Toggle({ value, onChange, error }) {
  return (
    <div>
      <div className={`toggle-group ${error ? 'error-border' : ''}`}>
        <button type="button" className={`toggle-btn ${value === 1 ? 'active' : ''}`} onClick={() => onChange(1)}>Yes</button>
        <button type="button" className={`toggle-btn ${value === 0 ? 'active' : ''}`} onClick={() => onChange(0)}>No</button>
      </div>
      {error && <p className="form-error" style={{ marginTop: 4 }}>{error}</p>}
    </div>
  )
}
