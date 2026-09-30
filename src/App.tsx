import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { trackPageView } from './analytics'
import ApplyPage from './pages/ApplyPage'
import LandingPage from './pages/LandingPage'
const GuidePage = lazy(() => import('./pages/GuidePage'))

export default function App() {
  const location = useLocation()
  useEffect(() => { trackPageView(location.pathname) }, [location.pathname])
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/guide" element={<Suspense fallback={<main className="page-shell p-6" role="status">가이드를 불러오고 있어요.</main>}><GuidePage /></Suspense>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
