import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navbar } from './Navbar'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) return <p>Cargando...</p>
  if (!session) return <Navigate to="/login" replace />

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}