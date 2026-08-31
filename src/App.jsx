import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
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
import LoginPage from './components/LoginPage'
import Products from './components/Products'
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

function Home() {
  return (
    <>
      <ImageSlider />
      <main>
        
        <Products />
        <About />
        <TrustBar />
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
      <ScrollToTop />
      <ScrollReveal />
      <div className="site-top">
        <AnnouncementBar />
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:slug" element={<ProductPage />} />
        <Route path="/health-benefits" element={<HealthBenefitsPage />} />
        <Route path="/whyus" element={<WhyUsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/account" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
