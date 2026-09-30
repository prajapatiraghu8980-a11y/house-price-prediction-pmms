import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const links = [
  { label: 'Home',        to: '/'            },
  { label: 'Predict',     to: '/predict'     },
  { label: 'Performance', to: '/performance' },
  { label: 'About',       to: '/about'       },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const { pathname }            = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__icon">🏠</span>
          <span>HouseAI</span>
        </Link>

        <ul className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={`navbar__link ${pathname === l.to ? 'navbar__link--active' : ''}`}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/predict" className="btn btn-primary" style={{ padding: '9px 22px', fontSize: 14 }}>
              Get Prediction
            </Link>
          </li>
        </ul>

        <button className="navbar__hamburger" onClick={() => setOpen(o => !o)} aria-label="menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
