import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'
import { getProductStatus, getStatusColor } from '../lib/productStatus'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [statusFilter, setStatusFilter] = useState('Todos')

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

  if (loading) return <p>Cargando productos...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  // Categorías únicas, calculadas a partir de los datos (no hardcodeadas)
  const categories = ['Todas', ...new Set(products.map((p) => p.category))]
  const statuses = ['Todos', 'Crítico', 'Bajo', 'Saludable', 'Exceso']

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter

    const status = getProductStatus(p.stock, p.weekly_demand)
    const matchesStatus = statusFilter === 'Todos' || status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div style={{ padding: 24 }}>
      <h1>Productos</h1>
      <Link to="/products/new">+ Nuevo producto</Link>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, marginTop: 16 }}>
        <input
          type="text"
          placeholder="Buscar por nombre o SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p>No se encontraron productos con esos filtros.</p>
      ) : (
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Costo unitario</th>
              <th>Precio</th>
              <th>Demanda semanal</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const status = getProductStatus(p.stock, p.weekly_demand)
              return (
                <tr key={p.id}>
                  <td>
                    <Link to={`/products/${p.sku}`}>{p.sku}</Link>
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.stock}</td>
                  <td>${p.unit_cost}</td>
                  <td>${p.price}</td>
                  <td>{p.weekly_demand}</td>
                  <td>
                    <span
                      style={{
                        backgroundColor: getStatusColor(status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/products/${p.sku}/edit`}>Editar</Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}