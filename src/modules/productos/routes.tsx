import { Routes, Route } from 'react-router'
import { ProductsPage } from './pages/ProductsPage.tsx'
import { ProductDetailPage } from './pages/ProductDetailPage.tsx'
import { CatalogPage } from './pages/CatalogPage.tsx'

export default function ModuleRoutes() {
  return (
    <Routes>
      <Route index element={<ProductsPage />} />
      <Route path="catalog" element={<CatalogPage />} />
      <Route path=":productId" element={<ProductDetailPage />} />
    </Routes>
  )
}
