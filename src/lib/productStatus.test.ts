import { describe, expect, it } from 'vitest'
import { getCoverageDays, getProductStatus, isExpiringSoon } from './productStatus'

describe('getProductStatus', () => {
  it('devuelve Crítico cuando el stock es menor que la demanda semanal', () => {
    expect(getProductStatus(4, 10)).toBe('Crítico')
  })

  it('devuelve Bajo cuando el stock es menor que el doble de la demanda semanal', () => {
    expect(getProductStatus(12, 10)).toBe('Bajo')
  })

  it('devuelve Saludable cuando el stock está en un rango intermedio', () => {
    expect(getProductStatus(25, 10)).toBe('Saludable')
  })

  it('devuelve Exceso cuando el stock supera el cuádruple de la demanda semanal', () => {
    expect(getProductStatus(50, 10)).toBe('Exceso')
  })

  it('devuelve Saludable cuando weekly_demand es 0', () => {
    expect(getProductStatus(3, 0)).toBe('Saludable')
  })
})

describe('getCoverageDays', () => {
  it('calcula la cobertura en días con stock y demanda normales', () => {
    expect(getCoverageDays(35, 10)).toBe(24.5)
  })

  it('devuelve Infinity cuando weekly_demand es 0', () => {
    expect(getCoverageDays(10, 0)).toBe(Infinity)
  })
})

describe('isExpiringSoon', () => {
  it('devuelve true cuando la fecha de vencimiento está a menos de 90 días', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    expect(isExpiringSoon(futureDate.toISOString())).toBe(true)
  })

  it('devuelve false cuando la fecha de vencimiento está lejos', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 180)
    expect(isExpiringSoon(futureDate.toISOString())).toBe(false)
  })

  it('devuelve false cuando expiration_date es null', () => {
    expect(isExpiringSoon(null)).toBe(false)
  })
})
