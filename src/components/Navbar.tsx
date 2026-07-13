import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function Navbar() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        borderBottom: '1px solid #333',
      }}
    >
      <div style={{ display: 'flex', gap: 16 }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/products">Productos</Link>
      </div>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </nav>
  )
}