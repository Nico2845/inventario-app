export type ProductStatus = 'Crítico' | 'Bajo' | 'Saludable' | 'Exceso'

export function getProductStatus(stock: number, weeklyDemand: number): ProductStatus {
  if (weeklyDemand === 0) return 'Saludable'

  if (stock < weeklyDemand) return 'Crítico'
  if (stock < 2 * weeklyDemand) return 'Bajo'
  if (stock < 4 * weeklyDemand) return 'Saludable'
  return 'Exceso'
}

export function getStatusColor(status: ProductStatus): string {
  switch (status) {
    case 'Crítico': return '#ef4444'   // rojo
    case 'Bajo': return '#f97316'      // naranja
    case 'Saludable': return '#22c55e' // verde
    case 'Exceso': return '#6b7280'    // gris/azulado
  }
}//Tiene solo la presentacion, separacion de responsabilidades

export function getCoverageDays(stock: number, weeklyDemand: number): number {
  if (weeklyDemand === 0) return Infinity
  return (stock / weeklyDemand) * 7
} //Tiene solo la logica de negocio

export function getDaysUntilExpiration(expirationDate: string | null): number | null {
  if (!expirationDate) return null

  const today = new Date()
  const expDate = new Date(expirationDate)
  const diffMs = expDate.getTime() - today.getTime()

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export function isExpiringSoon(expirationDate: string | null): boolean {
  const days = getDaysUntilExpiration(expirationDate)
  if (days === null) return false
  return days < 90
}