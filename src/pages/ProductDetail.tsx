import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'
import { getProductStatus, getStatusColor, getCoverageDays, getDaysUntilExpiration, isExpiringSoon } from '../lib/productStatus'
import { getStatusLabel, translations } from '../lib/translations'

export default function ProductDetail() {
  const { sku } = useParams<{ sku: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { language } = useLanguage()
  const t = translations[language]

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

  if (loading) return <p>{t.loadingProduct}</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>
  if (!product) return <p>{t.productNotFound}</p>

  const status = getProductStatus(product.stock, product.weekly_demand)
  const coverage = getCoverageDays(product.stock, product.weekly_demand)
  const daysUntilExpiration = getDaysUntilExpiration(product.expiration_date)
  const expiringAlert = isExpiringSoon(product.expiration_date)

  return (
    <div style={{ padding: 24 }}>
      <Link to="/products">{t.backToProducts}</Link>
      <h1>{product.name}</h1>

      <span
        style={{
          backgroundColor: getStatusColor(status),
          color: 'white',
          padding: '4px 10px',
          borderRadius: 4,
        }}
      >
        {getStatusLabel(status, language)}
      </span>

      {expiringAlert && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          {t.expiringAlertPrefix} {daysUntilExpiration} {t.days}
        </p>
      )}

      <table cellPadding={8}>
        <tbody>
          <tr><td><strong>{t.sku}</strong></td><td>{product.sku}</td></tr>
          <tr><td><strong>{t.category}</strong></td><td>{product.category}</td></tr>
          <tr><td><strong>{t.stock}</strong></td><td>{product.stock}</td></tr>
          <tr><td><strong>{t.unitCost}</strong></td><td>${product.unit_cost}</td></tr>
          <tr><td><strong>{t.price}</strong></td><td>${product.price}</td></tr>
          <tr><td><strong>{t.weeklyDemand}</strong></td><td>{product.weekly_demand}</td></tr>
          <tr>
            <td><strong>{t.coverage}</strong></td>
            <td>{coverage === Infinity ? 'N/A' : `${coverage.toFixed(1)} ${t.days}`}</td>
          </tr>
          <tr><td><strong>{t.expirationDate}</strong></td><td>{product.expiration_date ?? 'N/A'}</td></tr>
        </tbody>
      </table>
    </div>
  )
}