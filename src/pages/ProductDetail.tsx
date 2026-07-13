import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'
import { getProductStatus, getStatusColor, getCoverageDays, getDaysUntilExpiration, isExpiringSoon } from '../lib/productStatus'

export default function ProductDetail() {
  const { sku } = useParams<{ sku: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setProduct(data as Product)
      }
      setLoading(false)
    }

    fetchProduct()
  }, [sku])

  if (loading) return <p>Cargando producto...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>
  if (!product) return <p>Producto no encontrado.</p>

  const status = getProductStatus(product.stock, product.weekly_demand)
  const coverage = getCoverageDays(product.stock, product.weekly_demand)

  // Alerta de vencimiento: menos de 90 días desde hoy
  const daysUntilExpiration = getDaysUntilExpiration(product.expiration_date)
  const expiringAlert = isExpiringSoon(product.expiration_date)

  return (
    <div style={{ padding: 24 }}>
      <Link to="/products">← Volver a productos</Link>
      <h1>{product.name}</h1>

      <span
        style={{
          backgroundColor: getStatusColor(status),
          color: 'white',
          padding: '4px 10px',
          borderRadius: 4,
        }}
      >
        {status}
      </span>

      {expiringAlert && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          ⚠️ Este producto vence en {daysUntilExpiration} días
        </p>
      )}

      <table cellPadding={8}>
        <tbody>
          <tr><td><strong>SKU</strong></td><td>{product.sku}</td></tr>
          <tr><td><strong>Categoría</strong></td><td>{product.category}</td></tr>
          <tr><td><strong>Stock</strong></td><td>{product.stock}</td></tr>
          <tr><td><strong>Costo unitario</strong></td><td>${product.unit_cost}</td></tr>
          <tr><td><strong>Precio</strong></td><td>${product.price}</td></tr>
          <tr><td><strong>Demanda semanal</strong></td><td>{product.weekly_demand}</td></tr>
          <tr>
            <td><strong>Cobertura</strong></td>
            <td>{coverage === Infinity ? 'N/A' : `${coverage.toFixed(1)} días`}</td>
          </tr>
          <tr><td><strong>Fecha de vencimiento</strong></td><td>{product.expiration_date ?? 'N/A'}</td></tr>
        </tbody>
      </table>
    </div>
  )
}