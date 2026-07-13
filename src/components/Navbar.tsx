import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function Navbar() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link className="nav-link dashboard" to="/dashboard">
          <span className="nav-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M7 14l3-3 2 2 5-6" />
            </svg>
          </span>
          <span>Dashboard</span>
        </Link>
        <Link className="nav-link products" to="/products">
          <span className="nav-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7h18" />
              <path d="M4 7l1 10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2l1-10" />
              <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            </svg>
          </span>
          <span>Productos</span>
        </Link>
      </div>
      <button className="nav-logout" type="button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </nav>
  )
}