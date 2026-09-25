import { type ReactNode, Suspense, lazy } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Btn } from './components/ui'
import { FLOWS, NODES, type NodeId, pathOf } from './nav/map'
import { Guarded } from './nav/PageNav'
import { Home } from './pages/Home'

const page = <K extends string>(load: () => Promise<Record<K, () => ReactNode>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })))

const Account = page(() => import('./pages/Account'), 'Account')
const Cart = page(() => import('./pages/Cart'), 'Cart')
const Checkout = page(() => import('./pages/Checkout'), 'Checkout')
const Compare = page(() => import('./pages/Compare'), 'Compare')
const Login = page(() => import('./pages/Login'), 'Login')
const Order = page(() => import('./pages/Order'), 'Order')
const Product = page(() => import('./pages/Product'), 'Product')
const Shop = page(() => import('./pages/Shop'), 'Shop')
const SiteMap = page(() => import('./pages/SiteMap'), 'SiteMap')
const Wishlist = page(() => import('./pages/Wishlist'), 'Wishlist')

type FlowStep = (typeof FLOWS)['checkout']['steps'][number]

/**
 * One page per node of the navigation map. The Record type makes TypeScript fail
 * if a node in nav/map.ts has no page (or a page has no node).
 * Flow steps share one component so their in-progress state survives Back/Forward.
 */
const PAGES: Record<Exclude<NodeId, FlowStep>, ReactNode> = {
  home: <Home />,
  shop: <Shop />,
  product: <Product />,
  compare: <Compare />,
  wishlist: <Wishlist />,
  cart: <Cart />,
  order: <Order />,
  login: <Login />,
  account: <Account />,
  map: <SiteMap />,
}

function NotFound() {
  return (
    <div className="container empty">
      <p className="dot-title">404.</p>
      <p className="muted">Questa pagina non è sulla mappa.</p>
      <div className="row-8">
        <Btn to="/">Home</Btn>
        <Btn to="/mappa">Mappa del sito</Btn>
      </div>
    </div>
  )
}

// HashRouter so the demo works on any static host (GitHub Pages, Vercel, file preview) without rewrites.
export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Suspense fallback={<div className="container empty"><span className="spinner" /></div>}>
          <Routes>
            {(Object.keys(PAGES) as (keyof typeof PAGES)[]).map((id) => (
              <Route key={id} path={NODES[id].path} element={<Guarded id={id}>{PAGES[id]}</Guarded>} />
            ))}
            {/* Flow: one route, the step is in the URL (/checkout/indirizzo …). Every step shares the flow's guard. */}
            <Route path="/checkout/:step" element={<Guarded id={FLOWS.checkout.steps[0]}><Checkout /></Guarded>} />
            <Route path="/checkout" element={<Navigate to={pathOf(FLOWS.checkout.steps[0])} replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </HashRouter>
  )
}
