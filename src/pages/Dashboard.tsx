import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'
import { isExpiringSoon } from '../lib/productStatus'
import { translations } from '../lib/translations'

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { language } = useLanguage()
  const t = translations[language]

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

  if (loading) return <p>{t.loadingDashboard}</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  const totalSkus = products.length

  const totalInventoryValue = products.reduce((sum, p) => sum + p.stock * p.unit_cost, 0)

  const formattedInventoryValue = totalInventoryValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const expiringSoonCount = products.filter((p) => isExpiringSoon(p.expiration_date)).length

  const chartData = Object.entries(
    products.reduce<Record<string, number>>((acc, product) => {
      const category = product.category || 'Sin categoría'
      acc[category] = (acc[category] ?? 0) + product.stock * product.unit_cost
      return acc
    }, {})
  ).map(([category, value], index) => ({
    category,
    value,
    fill: ['#967aa1', '#aaa1c8', '#d5c6e0', '#192a51'][index % 4],
  }))

  return (
    <div className="page-shell">
      <h1>{t.dashboard}</h1>

      <div className="dashboard-cards">
        <div className="kpi-card thistle">
          <p className="kpi-label">{t.activeSkus}</p>
          <h2 className="kpi-value">{totalSkus}</h2>
        </div>

        <div className="kpi-card lilac">
          <p className="kpi-label">{t.totalInventoryValue}</p>
          <h2 className="kpi-value">${formattedInventoryValue}</h2>
        </div>

        <div className="kpi-card mauve">
          <p className="kpi-label">{t.expiringSoon}</p>
          <h2 className="kpi-value">{expiringSoonCount}</h2>
        </div>
      </div>

      <div className="chart-card">
        <h2 className="chart-title">{t.inventoryByCategory}</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid stroke="#e6dbe2" vertical={false} />
              <XAxis dataKey="category" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value) => {
                  const numericValue = Number(value ?? 0)
                  return `$${numericValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                }}
              />
              {chartData.map((item) => (
                <Bar key={item.category} dataKey="value" radius={[8, 8, 0, 0]} fill={item.fill} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}