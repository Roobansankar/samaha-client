import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import About from './components/About'
import Products from './components/Products'
import Benefits from './components/Benefits'
import WhySamaha from './components/WhySamaha'
import Faq from './components/Faq'
import Reviews from './components/Reviews'
import Banner from './components/Banner'
import Cta from './components/Cta'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <div className="site-top">
        <AnnouncementBar />
        <Navbar />
      </div>
      <main>
        <Hero />
        <TrustBar />
        <About />
        <Products />
        <Benefits />
        <WhySamaha />
        <Faq />
        <Reviews />
        <Banner />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
