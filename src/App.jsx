import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/layout/Footer'
import MainLayout from './components/layout/MainLayout'
import Navbar from './components/layout/Navbar'
import About from './pages/About'
import AttributesOfGod from './pages/AttributesOfGod'
import ChristianValues from './pages/ChristianValues'
import Exchange from './pages/Exchange'
import Home from './pages/Home'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Resources from './pages/Resources'
import Store from './pages/Store'
import TermsOfService from './pages/TermsOfService'
import WitnessCards from './pages/WitnessCards'
import WitnessVideos from './pages/WitnessVideos'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout navbar={<Navbar />} footer={<Footer />} />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/christian-values" element={<ChristianValues />} />
        <Route path="/attributes-of-god" element={<AttributesOfGod />} />
        <Route path="/daily-encounters-with-god" element={<Navigate to="/attributes-of-god" replace />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/lies-of-the-enemy-for-gods-truth" element={<Navigate to="/exchange" replace />} />
        <Route path="/store" element={<Store />} />
        <Route path="/shop" element={<Navigate to="/store" replace />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/tos" element={<Navigate to="/terms" replace />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
        <Route path="/witness" element={<WitnessVideos />} />
        <Route path="/witness-videos" element={<Navigate to="/witness" replace />} />
        <Route path="/witness-card-videos" element={<Navigate to="/witness-cards" replace />} />
        <Route path="/visitor-center" element={<Navigate to="/witness-cards" replace />} />
        <Route path="/qr" element={<Navigate to="/witness-cards" replace />} />
        <Route path="/witness-cards" element={<WitnessVideos />} />
        <Route path="/witness-card-library" element={<WitnessCards />} />
        <Route path="/gospel-cards" element={<Navigate to="/witness-cards" replace />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App
