import { describe, it, expect } from 'vitest'
import {
  moduleRegistry,
  allModuleKeys,
  getEnabledModules,
  getFirstEnabledPath,
  ModuleType,
} from '@core/config/modules'

describe('moduleRegistry', () => {
  it('contains 13 modules total', () => {
    expect(moduleRegistry).toHaveLength(13)
  })

  it('has 11 core modules', () => {
    const coreModules = moduleRegistry.filter((m) => m.type === ModuleType.CORE)
    expect(coreModules).toHaveLength(11)
  })

  it('has 2 DLC modules', () => {
    const dlcModules = moduleRegistry.filter((m) => m.type === ModuleType.DLC)
    expect(dlcModules).toHaveLength(2)
    expect(dlcModules.map((m) => m.key)).toEqual(['fotos', 'chatbot'])
  })

  it('has unique keys for every module', () => {
    const keys = moduleRegistry.map((m) => m.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('has unique paths for every module', () => {
    const paths = moduleRegistry.map((m) => m.path)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('all paths start with /', () => {
    for (const m of moduleRegistry) {
      expect(m.path).toMatch(/^\//)
    }
  })
})

describe('allModuleKeys', () => {
  it('contains all 13 keys', () => {
    expect(allModuleKeys).toHaveLength(13)
  })

  it('includes mapa as first key', () => {
    expect(allModuleKeys[0]).toBe('mapa')
  })

  it('includes DLC keys', () => {
    expect(allModuleKeys).toContain('fotos')
    expect(allModuleKeys).toContain('chatbot')
  })
})

describe('getEnabledModules', () => {
  it('returns only modules matching enabledModules list', () => {
    const result = getEnabledModules(['inventario', 'ventas'])
    expect(result).toHaveLength(2)
    expect(result.map((m) => m.key)).toEqual(['inventario', 'ventas'])
  })

  it('returns empty array when no modules are enabled', () => {
    const result = getEnabledModules([])
    expect(result).toHaveLength(0)
  })

  it('ignores unknown module keys', () => {
    const result = getEnabledModules(['inventario', 'nonexistent'])
    expect(result).toHaveLength(1)
    expect(result[0].key).toBe('inventario')
  })

  it('preserves registry order regardless of input order', () => {
    const result = getEnabledModules(['chatbot', 'inventario', 'fotos'])
    expect(result.map((m) => m.key)).toEqual(['inventario', 'fotos', 'chatbot'])
  })

  it('returns all modules when all keys provided', () => {
    const result = getEnabledModules([...allModuleKeys])
    expect(result).toHaveLength(13)
  })

  it('filters core modules the same way as DLC modules', () => {
    const coreOnly = getEnabledModules(['inventario', 'productos'])
    const dlcOnly = getEnabledModules(['fotos', 'chatbot'])
    const mixed = getEnabledModules(['inventario', 'fotos'])

    expect(coreOnly).toHaveLength(2)
    expect(dlcOnly).toHaveLength(2)
    expect(mixed).toHaveLength(2)
  })
})

describe('getFirstEnabledPath', () => {
  it('returns path of first enabled module in registry order', () => {
    const result = getFirstEnabledPath(['ventas', 'inventario'])
    expect(result).toBe('/inventario')
  })

  it('returns DLC path if only DLC modules are enabled', () => {
    const result = getFirstEnabledPath(['chatbot', 'fotos'])
    expect(result).toBe('/fotos')
  })

  it('returns /inventario as fallback when no modules are enabled', () => {
    const result = getFirstEnabledPath([])
    expect(result).toBe('/inventario')
  })

  it('returns single module path when only one is enabled', () => {
    const result = getFirstEnabledPath(['analytics'])
    expect(result).toBe('/analytics')
  })
})
