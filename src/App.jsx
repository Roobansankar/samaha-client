import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import MobileTabBar from './components/MobileTabBar'
import ImageSlider from './components/ImageSlider'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import About from './components/About'
import AboutPage from './components/AboutPage'
import ContactPage from './components/ContactPage'
import ShopPage from './components/ShopPage'
import ProductPage from './components/ProductPage'
import HealthBenefitsPage from './components/HealthBenefitsPage'
import CartPage from './components/CartPage'
import WhyUsPage from './components/WhyUsPage'
import BlogPage from './components/BlogPage'
import AccountPage from './components/AccountPage'
import ProfilePage from './components/ProfilePage'
import AuthCallback from './components/AuthCallback'
import CheckoutPage from './components/CheckoutPage'
import CheckoutSuccessPage from './components/CheckoutSuccessPage'
import Products from './components/Products'
import OilRange from './components/OilRange'
import Benefits from './components/Benefits'
import WhySamaha from './components/WhySamaha'
import Faq from './components/Faq'
import Reviews from './components/Reviews'
import Banner from './components/Banner'
import Cta from './components/Cta'
import Footer from './components/Footer'
import NotFound from './components/NotFound'
import ScrollToTop from './components/ScrollToTop'
import ScrollReveal from './components/ScrollReveal'
import { initCart } from './lib/cart'

// Admin imports
import AdminLayout from './components/admin/AdminLayout'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminOrders from './components/admin/AdminOrders'
import AdminCustomers from './components/admin/AdminCustomers'
import AdminProducts from './components/admin/AdminProducts'
import AdminSettings from './components/admin/AdminSettings'
import AdminStaff from './components/admin/AdminStaff'
import AdminMessages from './components/admin/AdminMessages'
import AdminSubscribers from './components/admin/AdminSubscribers'
import ProtectedRoute from './components/admin/ProtectedRoute'

function Home() {
  return (
    <>
      <ImageSlider />
      <main>
        
        <Products />
        <OilRange />
        <TrustBar />
        <About />
        <Benefits />
        <WhySamaha />
        <Banner />
        <Faq />
        <Reviews />
        
        <Cta />
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

function AppContent() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    initCart()
  }, [])

  return (
    <>
      <ScrollToTop />
      <ScrollReveal />
      <Toaster position="top-center" toastOptions={{ duration: 3000, style: { fontSize: '0.85rem', borderRadius: '12px', padding: '12px 16px' } }} />
      {!isAdmin && (
        <div className="site-top">
          <AnnouncementBar />
          <Navbar />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:slug" element={<ProductPage />} />
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
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <Footer />}
      {!isAdmin && (
        <>
          {/* keeps the tab bar from covering the last of the page */}
          <div className="h-[62px] min-[901px]:hidden" aria-hidden="true" />
          <MobileTabBar />
        </>
      )}
    </>
  )
}
