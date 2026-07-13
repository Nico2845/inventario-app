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

 const expiringSoonCount = products.filter((p) => isExpiringSoon(p.expiration_date)).length

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
        <div style={{ border: '1px solid #333', borderRadius: 8, padding: 20, minWidth: 200 }}>
          <p style={{ margin: 0, opacity: 0.7 }}>Total de SKUs activos</p>
          <h2 style={{ margin: '8px 0 0' }}>{totalSkus}</h2>
        </div>

        <div style={{ border: '1px solid #333', borderRadius: 8, padding: 20, minWidth: 200 }}>
          <p style={{ margin: 0, opacity: 0.7 }}>Valor total del inventario</p>
          <h2 style={{ margin: '8px 0 0' }}>${totalInventoryValue.toFixed(2)}</h2>
        </div>

        <div style={{ border: '1px solid #333', borderRadius: 8, padding: 20, minWidth: 200 }}>
          <p style={{ margin: 0, opacity: 0.7 }}>SKUs próximos a vencer</p>
          <h2 style={{ margin: '8px 0 0' }}>{expiringSoonCount}</h2>
        </div>
      </div>
    </div>
  )
}