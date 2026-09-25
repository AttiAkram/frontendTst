import { Suspense, lazy } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
const Account = lazy(() => import('./pages/Account').then((m) => ({ default: m.Account })))
const Cart = lazy(() => import('./pages/Cart').then((m) => ({ default: m.Cart })))
const Checkout = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.Checkout })))
const Compare = lazy(() => import('./pages/Compare').then((m) => ({ default: m.Compare })))
import { Home } from './pages/Home'
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })))
const Product = lazy(() => import('./pages/Product').then((m) => ({ default: m.Product })))
const Shop = lazy(() => import('./pages/Shop').then((m) => ({ default: m.Shop })))
const Wishlist = lazy(() => import('./pages/Wishlist').then((m) => ({ default: m.Wishlist })))
import { Btn } from './components/ui'

function NotFound() {
  return (
    <div className="container empty">
      <p className="dot-title">404.</p>
      <p className="muted">Questa pagina non esiste. Niente di più.</p>
      <Btn to="/">Home</Btn>
    </div>
  )
}

// HashRouter so the demo works on any static host (GitHub Pages, file preview) without rewrites.
export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Suspense fallback={<div className="container empty"><span className="spinner" /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/p/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </Layout>
    </HashRouter>
  )
}
