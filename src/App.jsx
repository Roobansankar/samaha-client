import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { ProductsProvider } from './context/ProductsContext'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import MobileTabBar from './components/MobileTabBar'
import ImageSlider from './components/ImageSlider'
import About from './components/About'
import Products from './components/Products'
import OilRange from './components/OilRange'
import Benefits from './components/Benefits'
import WhySamaha from './components/WhySamaha'
import Faq from './components/Faq'
import Reviews from './components/Reviews'
import LifeGallery from './components/LifeGallery'
import Banner from './components/Banner'
import Cta from './components/Cta'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import RouteSeo from './components/RouteSeo'
import AboutPage from './components/AboutPage'
import ContactPage from './components/ContactPage'
import ShopPage from './components/ShopPage'
import ShopSlug from './components/ShopSlug'
import HealthBenefitsPage from './components/HealthBenefitsPage'
import CartPage from './components/CartPage'
import WhyUsPage from './components/WhyUsPage'
import BlogPage from './components/BlogPage'
import AccountPage from './components/AccountPage'
import ProfilePage from './components/ProfilePage'
import AuthCallback from './components/AuthCallback'
import CheckoutPage from './components/CheckoutPage'
import CheckoutSuccessPage from './components/CheckoutSuccessPage'
import PolicyPage from './components/PolicyPage'
import NotFound from './components/NotFound'
import { initCart } from './lib/cart'
import { initAnalytics } from './lib/analytics'

// Pure scroll-animation polish — doesn't gate any visible content, so it's
// safe to pull out of the critical-path bundle.
const GsapScroll = lazy(() => import('./components/GsapScroll'))

// Only the admin backend is code-split. It's a large, distinct app that
// almost no visitor ever loads, so it's worth the chunk. The storefront
// pages above are small and sit right in the main nav — splitting those
// too just added a loading-spinner flash to routine navigation for very
// little size benefit, so they stay in the main bundle.
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))
const AdminOrders = lazy(() => import('./components/admin/AdminOrders'))
const AdminOrderView = lazy(() => import('./components/admin/AdminOrderView'))
const AdminCustomers = lazy(() => import('./components/admin/AdminCustomers'))
const AdminReviews = lazy(() => import('./components/admin/AdminReviews'))
const AdminBanners = lazy(() => import('./components/admin/AdminBanners'))
const AdminCategories = lazy(() => import('./components/admin/AdminCategories'))
const AdminProducts = lazy(() => import('./components/admin/AdminProducts'))
const AdminProductForm = lazy(() => import('./components/admin/AdminProductForm'))
const AdminProductView = lazy(() => import('./components/admin/AdminProductView'))
const AdminProductsTrash = lazy(() => import('./components/admin/AdminProductsTrash'))
const AdminSettings = lazy(() => import('./components/admin/AdminSettings'))
const AdminStaff = lazy(() => import('./components/admin/AdminStaff'))
const AdminMessages = lazy(() => import('./components/admin/AdminMessages'))
const AdminSubscribers = lazy(() => import('./components/admin/AdminSubscribers'))
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'))

// Shown only while a route's own chunk is still loading — a slow network
// or a dev-server hiccup used to leave this blank, which made the footer
// jump up right under the navbar and look like the page had broken.
function RouteFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center bg-paper">
      <Loader2 size={24} className="animate-spin text-olive-700/40" />
    </div>
  )
}

function Home() {
  return (
    <>
      <ImageSlider />
      <main>
        
        <Products />
        <OilRange />
        <About />
        <Benefits />
        <WhySamaha />
        <Banner />
        <Faq />
        <Reviews />
        <LifeGallery />
        <Cta />
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ProductsProvider>
        <AppContent />
      </ProductsProvider>
    </BrowserRouter>
  )
}

function AppContent() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    initCart()
    initAnalytics()
  }, [])

  return (
    <>
      <ScrollToTop />
      <RouteSeo />
      <Suspense fallback={null}>
        <GsapScroll />
      </Suspense>
      <Toaster position="top-center" toastOptions={{ duration: 3000, style: { fontSize: '0.85rem', borderRadius: '12px', padding: '12px 16px' } }} />
      {!isAdmin && (
        <div className="site-top">
          <AnnouncementBar />
          <Navbar />
        </div>
      )}
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:slug" element={<ShopSlug />} />
        <Route path="/health-benefits" element={<HealthBenefitsPage />} />
        <Route path="/whyus" element={<WhyUsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/profile" element={<ProfilePage view="dashboard" />} />
        <Route path="/profile/orders" element={<ProfilePage view="orders" />} />
        <Route path="/profile/addresses" element={<ProfilePage view="addresses" />} />
        <Route path="/profile/account" element={<ProfilePage view="account" />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Policy pages */}
        <Route path="/privacy-policy" element={<PolicyPage slug="privacy-policy" />} />
        <Route path="/terms-and-conditions" element={<PolicyPage slug="terms-and-conditions" />} />
        <Route path="/refund-policy" element={<PolicyPage slug="refund-policy" />} />
        <Route path="/shipping-policy" element={<PolicyPage slug="shipping-policy" />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderView />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/trash" element={<AdminProductsTrash />} />
          <Route path="products/:id" element={<AdminProductView />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
      {!isAdmin && (
        <>
          {/* keeps the tab bar from covering the last of the page */}
          <div className="h-[54px] min-[901px]:hidden" aria-hidden="true" />
          <MobileTabBar />
        </>
      )}
    </>
  )
}
