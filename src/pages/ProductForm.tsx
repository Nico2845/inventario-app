import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface ProductFormProps {
  mode: 'create' | 'edit'
}

interface FormData {
  sku: string
  name: string
  category: string
  stock: string
  unit_cost: string
  price: string
  weekly_demand: string
  expiration_date: string
}

const emptyForm: FormData = {
  sku: '',
  name: '',
  category: '',
  stock: '',
  unit_cost: '',
  price: '',
  weekly_demand: '',
  expiration_date: '',
}

export default function ProductForm({ mode }: ProductFormProps) {
  const { sku } = useParams<{ sku: string }>()
  const navigate = useNavigate()

  const [form, setForm] = useState<FormData>(emptyForm)
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Si estamos editando, cargamos los datos existentes del producto
  useEffect(() => {
    if (mode !== 'edit') return

    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .single()

      if (error) {
        setError(error.message)
      } else if (data) {
        setForm({
          sku: data.sku,
          name: data.name,
          category: data.category,
          stock: String(data.stock),
          unit_cost: String(data.unit_cost),
          price: String(data.price),
          weekly_demand: String(data.weekly_demand),
          expiration_date: data.expiration_date ?? '',
        })
      }
      setLoading(false)
    }

    fetchProduct()
  }, [mode, sku])

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate(): string | null {
    if (!form.sku || !form.name || !form.category) {
      return 'Todos los campos de texto son obligatorios.'
    }

    const numericFields: [keyof FormData, string][] = [
      ['stock', form.stock],
      ['unit_cost', form.unit_cost],
      ['price', form.price],
      ['weekly_demand', form.weekly_demand],
    ]

    for (const [field, value] of numericFields) {
      if (value === '') return `El campo ${field} es obligatorio.`
      if (Number(value) < 0) return `El campo ${field} no puede ser negativo.`
    }

    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)

    const payload = {
      sku: form.sku,
      name: form.name,
      category: form.category,
      stock: Number(form.stock),
      unit_cost: Number(form.unit_cost),
      price: Number(form.price),
      weekly_demand: Number(form.weekly_demand),
      expiration_date: form.expiration_date || null,
    }

    const { error } =
      mode === 'create'
        ? await supabase.from('products').insert(payload)
        : await supabase.from('products').update(payload).eq('sku', sku)

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate('/products')
  }

  if (loading) return <p>Cargando...</p>

  return (
    <div className="form-page">
      <div className="form-card form-card-wide">
        <h1 className="form-title">{mode === 'create' ? 'Nuevo producto' : 'Editar producto'}</h1>
        <p className="form-subtitle">
          {mode === 'create'
            ? 'Completa los datos del producto para registrarlo'
            : 'Actualiza la información del producto'}
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>SKU</label>
            <input
              className="form-input"
              value={form.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              disabled={mode === 'edit'}
            />
          </div>

          <div className="form-field">
            <label>Nombre</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Categoría</label>
            <input
              className="form-input"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Stock</label>
            <input
              className="form-input"
              type="number"
              value={form.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Costo unitario</label>
            <input
              className="form-input"
              type="number"
              step="0.01"
              value={form.unit_cost}
              onChange={(e) => handleChange('unit_cost', e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Precio</label>
            <input
              className="form-input"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Demanda semanal</label>
            <input
              className="form-input"
              type="number"
              value={form.weekly_demand}
              onChange={(e) => handleChange('weekly_demand', e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Fecha de vencimiento</label>
            <input
              className="form-input"
              type="date"
              value={form.expiration_date}
              onChange={(e) => handleChange('expiration_date', e.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button className="form-button" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}