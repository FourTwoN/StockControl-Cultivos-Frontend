import { describe, it, expect } from 'vitest'
import { getNavItems } from '@core/config/navigation'
import { allModuleKeys } from '@core/config/modules'

describe('getNavItems', () => {
  it('returns nav items only for enabled modules', () => {
    const items = getNavItems(['inventario', 'ventas'])
    expect(items).toHaveLength(2)
    expect(items.map((i) => i.label)).toEqual(['Inventario', 'Ventas'])
  })

  it('returns all 11 items when all modules are enabled', () => {
    const items = getNavItems([...allModuleKeys])
    expect(items).toHaveLength(11)
  })

  it('returns empty array when no modules are enabled', () => {
    const items = getNavItems([])
    expect(items).toHaveLength(0)
  })

  it('each nav item has label, path, and icon', () => {
    const items = getNavItems(['productos'])
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveProperty('label', 'Productos')
    expect(items[0]).toHaveProperty('path', '/productos')
    expect(items[0]).toHaveProperty('icon')
  })

  it('filters core modules the same way as DLC modules', () => {
    const withCore = getNavItems(['inventario'])
    const withDlc = getNavItems(['fotos'])
    const withBoth = getNavItems(['inventario', 'fotos'])

    expect(withCore).toHaveLength(1)
    expect(withDlc).toHaveLength(1)
    expect(withBoth).toHaveLength(2)
  })

  it('preserves registry order regardless of input order', () => {
    const items = getNavItems(['chatbot', 'inventario', 'analytics'])
    expect(items.map((i) => i.label)).toEqual(['Inventario', 'Analytics', 'Chatbot'])
  })

  it('ignores unknown module keys', () => {
    const items = getNavItems(['inventario', 'unknown_module', 'ventas'])
    expect(items).toHaveLength(2)
  })
})
