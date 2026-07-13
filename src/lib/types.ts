export interface Product {
  id: string
  sku: string
  name: string
  category: string
  stock: number
  unit_cost: number
  price: number
  weekly_demand: number
  expiration_date: string | null
}