import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'
import { getProductStatus, getStatusColor } from '../lib/productStatus'
import { getStatusLabel, translations } from '../lib/translations'

const PAGE_SIZE = 5

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [page, setPage] = useState(1)
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

  useEffect(() => {
    setPage(1)
  }, [search, categoryFilter, statusFilter])

  if (loading) return <p>{t.loadingProducts}</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  const categories = ['Todas', ...new Set(products.map((p) => p.category))]
  const statusOptions = [
    { value: 'Todos', label: t.all },
    { value: 'Crítico', label: getStatusLabel('Crítico', language) },
    { value: 'Bajo', label: getStatusLabel('Bajo', language) },
    { value: 'Saludable', label: getStatusLabel('Saludable', language) },
    { value: 'Exceso', label: getStatusLabel('Exceso', language) },
  ]

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())

      const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter

      const status = getProductStatus(p.stock, p.weekly_demand)
      const matchesStatus = statusFilter === 'Todos' || status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, search, categoryFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(`${t.deleteConfirm} "${product.name}"?`)
    if (!confirmed) return

    const { error } = await supabase.from('products').delete().eq('sku', product.sku)

    if (error) {
      setError(t.deleteError)
      return
    }

    setProducts((prev) => prev.filter((item) => item.sku !== product.sku))
    setError(null)
  }

  return (
    <div className="page-shell">
      <h1>{t.products}</h1>
      <Link className="new-product-btn" to="/products/new">{t.newProductButton}</Link>

      <div className="product-actions">
        <input
          className="search-input"
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-group">
          <label className="filter-label" htmlFor="category-filter">
            {t.filterByCategory}
          </label>
          <select
            id="category-filter"
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'Todas' ? t.all : c}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="status-filter">
            {t.filterByStatus}
          </label>
          <select
            id="status-filter"
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="empty-state">{t.noProducts}</p>
      ) : (
        <>
          <table className="products-table">
            <thead>
              <tr>
                <th>{t.sku}</th>
                <th>{t.name}</th>
                <th>{t.category}</th>
                <th>{t.stock}</th>
                <th>{t.unitCost}</th>
                <th>{t.price}</th>
                <th>{t.weeklyDemand}</th>
                <th>{t.status}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((p) => {
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
                        {getStatusLabel(status, language)}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link className="table-action-link" to={`/products/${p.sku}/edit`}>
                          {t.edit}
                        </Link>
                        <button
                          className="table-action-btn"
                          type="button"
                          onClick={() => handleDelete(p)}
                        >
                          {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="pagination-button"
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage === 1}
            >
              {t.previous}
            </button>
            <span className="pagination-info">
              {t.page} {safePage} {t.of} {totalPages}
            </span>
            <button
              className="pagination-button"
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safePage === totalPages}
            >
              {t.next}
            </button>
          </div>
        </>
      )}
    </div>
  )
}