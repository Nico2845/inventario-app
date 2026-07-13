import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'
import { isExpiringSoon } from '../lib/productStatus' 

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase.from('products').select('*')

      if (error) {
        setError(error.message)
      } else {
        setProducts(data as Product[])
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  if (loading) return <p>Cargando dashboard...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  const totalSkus = products.length

  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.stock * p.unit_cost,
    0
  )

  const formattedInventoryValue = totalInventoryValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const expiringSoonCount = products.filter((p) => isExpiringSoon(p.expiration_date)).length

  return (
    <div className="page-shell">
      <h1>Dashboard</h1>

      <div className="dashboard-cards">
        <div className="kpi-card thistle">
          <p className="kpi-label">Total de SKUs activos</p>
          <h2 className="kpi-value">{totalSkus}</h2>
        </div>

        <div className="kpi-card lilac">
          <p className="kpi-label">Valor total del inventario</p>
          <h2 className="kpi-value">${formattedInventoryValue}</h2>
        </div>

        <div className="kpi-card mauve">
          <p className="kpi-label">SKUs próximos a vencer</p>
          <h2 className="kpi-value">{expiringSoonCount}</h2>
        </div>
      </div>
    </div>
  )
}