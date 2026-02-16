import { http, HttpResponse } from 'msw'

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const mockProducts = [
  {
    id: 'prod-1',
    sku: 'SKU-001',
    name: 'Rosa Damascena',
    description: 'Premium damascus rose',
    categoryId: 'cat-1',
    categoryName: 'Flowers',
    familyId: 'fam-1',
    familyName: 'Rosaceae',
    state: 'healthy' as const,
    sizeClassification: 'large',
    imageUrl: 'https://example.com/rosa.jpg',
    customAttributes: {},
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'prod-2',
    sku: 'SKU-002',
    name: 'Lavandula Angustifolia',
    description: 'English lavender',
    categoryId: 'cat-2',
    categoryName: 'Herbs',
    familyId: 'fam-2',
    familyName: 'Lamiaceae',
    state: 'healthy' as const,
    sizeClassification: 'medium',
    customAttributes: {},
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-16T00:00:00Z',
  },
  {
    id: 'prod-3',
    sku: 'SKU-003',
    name: 'Mentha Piperita',
    description: 'Peppermint plant',
    categoryId: 'cat-2',
    categoryName: 'Herbs',
    familyId: 'fam-2',
    familyName: 'Lamiaceae',
    state: 'dormant' as const,
    sizeClassification: 'small',
    customAttributes: {},
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-17T00:00:00Z',
  },
]

const mockCategories = [
  { id: 'cat-1', name: 'Flowers', description: 'Flowering plants', productCount: 1 },
  { id: 'cat-2', name: 'Herbs', description: 'Aromatic herbs', productCount: 2 },
  { id: 'cat-3', name: 'Trees', description: 'Ornamental trees', productCount: 0 },
]

const mockFamilies = [
  { id: 'fam-1', name: 'Rosaceae', description: 'Rose family', productCount: 1 },
  { id: 'fam-2', name: 'Lamiaceae', description: 'Mint family', productCount: 2 },
]

// ---------------------------------------------------------------------------
// Stock
// ---------------------------------------------------------------------------

const mockBatches = [
  {
    id: 'batch-1',
    productId: 'prod-1',
    productName: 'Rosa Damascena',
    productSku: 'SKU-001',
    locationId: 'loc-1',
    locationName: 'Greenhouse A',
    binId: 'bin-1',
    binName: 'Shelf A1',
    quantity: 500,
    initialQuantity: 1000,
    status: 'ACTIVE' as const,
    entryDate: '2025-01-10T00:00:00Z',
    notes: 'First batch',
    customAttributes: {},
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z',
  },
  {
    id: 'batch-2',
    productId: 'prod-2',
    productName: 'Lavandula Angustifolia',
    productSku: 'SKU-002',
    locationId: 'loc-1',
    locationName: 'Greenhouse A',
    quantity: 200,
    initialQuantity: 200,
    status: 'ACTIVE' as const,
    entryDate: '2025-01-12T00:00:00Z',
    customAttributes: {},
    createdAt: '2025-01-12T00:00:00Z',
    updatedAt: '2025-01-22T00:00:00Z',
  },
  {
    id: 'batch-3',
    productId: 'prod-3',
    productName: 'Mentha Piperita',
    productSku: 'SKU-003',
    locationId: 'loc-2',
    locationName: 'Warehouse B',
    quantity: 0,
    initialQuantity: 300,
    status: 'DEPLETED' as const,
    entryDate: '2025-01-05T00:00:00Z',
    customAttributes: {},
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-25T00:00:00Z',
  },
]

const mockMovements = [
  {
    id: 'mov-1',
    batchId: 'batch-1',
    type: 'ENTRADA' as const,
    quantity: 1000,
    destinationBinId: 'bin-1',
    destinationBinName: 'Shelf A1',
    performedBy: 'user-1',
    notes: 'Initial stock entry',
    createdAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 'mov-2',
    batchId: 'batch-1',
    type: 'VENTA' as const,
    quantity: 500,
    sourceBinId: 'bin-1',
    sourceBinName: 'Shelf A1',
    performedBy: 'user-1',
    createdAt: '2025-01-20T00:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// Sales
// ---------------------------------------------------------------------------

const mockSales = [
  {
    id: 'sale-1',
    saleNumber: 'VTA-001',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Rosa Damascena',
        productSku: 'SKU-001',
        quantity: 50,
        unitPrice: 3.5,
        discount: 0,
        subtotal: 175,
      },
    ],
    totalAmount: 175,
    currency: 'USD',
    status: 'CONFIRMED' as const,
    customerName: 'Garden Center ABC',
    createdBy: 'user-1',
    createdAt: '2025-01-20T00:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

const mockUsers = [
  {
    id: 'user-1',
    email: 'admin@demeter.ai',
    name: 'Admin User',
    picture: 'https://example.com/avatar.jpg',
    role: 'ADMIN' as const,
    isActive: true,
    lastLoginAt: '2025-01-25T10:00:00Z',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    email: 'worker@demeter.ai',
    name: 'Worker User',
    role: 'WORKER' as const,
    isActive: true,
    createdAt: '2025-01-05T00:00:00Z',
  },
]

const mockCurrentUser = {
  id: 'user-1',
  email: 'admin@demeter.ai',
  name: 'Admin User',
  picture: 'https://example.com/avatar.jpg',
  role: 'ADMIN' as const,
  isActive: true,
  lastLoginAt: '2025-01-25T10:00:00Z',
  createdAt: '2025-01-01T00:00:00Z',
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

const mockDashboard = {
  totalStock: 700,
  totalStockChange: 5.2,
  totalSales: 15,
  totalSalesChange: 12.0,
  totalRevenue: 4500,
  totalRevenueChange: 8.3,
  activeWarehouses: 3,
}

const mockKPIs = [
  {
    id: 'kpi-1',
    label: 'Stock Turnover',
    value: 4.5,
    previousValue: 3.8,
    unit: 'x',
    trend: 'up' as const,
  },
  {
    id: 'kpi-2',
    label: 'Average Sale Value',
    value: 300,
    previousValue: 280,
    unit: 'USD',
    trend: 'up' as const,
  },
  {
    id: 'kpi-3',
    label: 'Mortality Rate',
    value: 2.1,
    previousValue: 2.5,
    unit: '%',
    trend: 'down' as const,
  },
]

// ---------------------------------------------------------------------------
// Tenant
// ---------------------------------------------------------------------------

const mockTenantConfig = {
  id: 'tenant-1',
  name: 'Demeter Demo',
  industry: 'CULTIVOS' as const,
  theme: {
    primary: '#2E7D32',
    secondary: '#66BB6A',
    accent: '#FFC107',
    background: '#FAFAFA',
    logoUrl: 'https://example.com/logo.png',
    appName: 'Demeter AI',
  },
  enabledModules: ['inventario', 'productos', 'ventas', 'analytics', 'usuarios'],
  settings: {},
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pagedResponse<T>(content: T[], page = 0, size = 20) {
  return {
    content,
    totalElements: content.length,
    totalPages: Math.ceil(content.length / size),
    page,
    size,
  }
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

export const handlers = [
  // ---- Products ----
  http.get('/api/v1/products', () => {
    return HttpResponse.json(pagedResponse(mockProducts))
  }),

  http.get('/api/v1/products/:id', ({ params }) => {
    const product = mockProducts.find((p) => p.id === params.id)
    if (!product) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(product)
  }),

  http.post('/api/v1/products', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const created = {
      id: 'prod-new',
      sku: body.sku ?? 'SKU-NEW',
      name: body.name ?? 'New Product',
      description: body.description ?? '',
      categoryId: body.categoryId ?? 'cat-1',
      categoryName: 'Flowers',
      familyId: body.familyId ?? 'fam-1',
      familyName: 'Rosaceae',
      state: 'healthy' as const,
      sizeClassification: body.sizeClassification ?? 'medium',
      customAttributes: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(created, { status: 201 })
  }),

  http.get('/api/v1/categories', () => {
    return HttpResponse.json(mockCategories)
  }),

  http.get('/api/v1/families', () => {
    return HttpResponse.json(mockFamilies)
  }),

  // ---- Stock ----
  http.get('/api/v1/stock/batches', () => {
    return HttpResponse.json(pagedResponse(mockBatches))
  }),

  http.get('/api/v1/stock/batches/:id', ({ params }) => {
    const batch = mockBatches.find((b) => b.id === params.id)
    if (!batch) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(batch)
  }),

  http.post('/api/v1/stock/movements', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const movement = {
      id: 'mov-new',
      batchId: body.batchId ?? 'batch-1',
      type: body.type ?? 'ENTRADA',
      quantity: body.quantity ?? 100,
      performedBy: 'user-1',
      notes: body.notes ?? '',
      createdAt: new Date().toISOString(),
    }
    return HttpResponse.json(movement, { status: 201 })
  }),

  http.get('/api/v1/stock/movements', () => {
    return HttpResponse.json(pagedResponse(mockMovements))
  }),

  // ---- Sales ----
  http.get('/api/v1/sales', () => {
    return HttpResponse.json(pagedResponse(mockSales))
  }),

  http.post('/api/v1/sales', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const sale = {
      id: 'sale-new',
      saleNumber: 'VTA-NEW',
      items: body.items ?? [],
      totalAmount: body.totalAmount ?? 0,
      currency: body.currency ?? 'USD',
      status: 'PENDING' as const,
      customerName: body.customerName ?? '',
      createdBy: 'user-1',
      createdAt: new Date().toISOString(),
    }
    return HttpResponse.json(sale, { status: 201 })
  }),

  // ---- Users ----
  http.get('/api/v1/users', () => {
    return HttpResponse.json(pagedResponse(mockUsers))
  }),

  http.get('/api/v1/users/me', () => {
    return HttpResponse.json(mockCurrentUser)
  }),

  // ---- Analytics ----
  http.get('/api/v1/analytics/dashboard', () => {
    return HttpResponse.json(mockDashboard)
  }),

  http.get('/api/v1/analytics/kpis', () => {
    return HttpResponse.json(mockKPIs)
  }),

  // ---- Tenant ----
  http.get('/api/v1/tenants/:id/config', () => {
    return HttpResponse.json(mockTenantConfig)
  }),
]
