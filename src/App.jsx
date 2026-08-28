import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import ImageSlider from './components/ImageSlider'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import About from './components/About'
import AboutPage from './components/AboutPage'
import ContactPage from './components/ContactPage'
import Products from './components/Products'
import Benefits from './components/Benefits'
import WhySamaha from './components/WhySamaha'
import Faq from './components/Faq'
import Reviews from './components/Reviews'
import Banner from './components/Banner'
import Cta from './components/Cta'
import Footer from './components/Footer'

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
      <div className="site-top">
        <AnnouncementBar />
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
