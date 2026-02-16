export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CALLBACK: '/callback',

  INVENTARIO: '/inventario',
  INVENTARIO_BATCH: '/inventario/:batchId',
  INVENTARIO_MOVEMENTS: '/inventario/movements',

  PRODUCTOS: '/productos',
  PRODUCTOS_DETAIL: '/productos/:productId',
  PRODUCTOS_CATALOG: '/productos/catalog',

  VENTAS: '/ventas',
  VENTAS_DETAIL: '/ventas/:saleId',

  COSTOS: '/costos',

  UBICACIONES: '/ubicaciones',
  UBICACIONES_MAP: '/ubicaciones/map',
  UBICACIONES_DETAIL: '/ubicaciones/:locationId',

  EMPAQUETADO: '/empaquetado',

  PRECIOS: '/precios',

  USUARIOS: '/usuarios',
  USUARIOS_PROFILE: '/usuarios/profile',

  ANALYTICS: '/analytics',

  FOTOS: '/fotos',
  FOTOS_SESSION: '/fotos/:sessionId',

  CHATBOT: '/chatbot',
} as const
