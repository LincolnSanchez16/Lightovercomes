import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/layout/Footer'
import MainLayout from './components/layout/MainLayout'
import Navbar from './components/layout/Navbar'
import About from './pages/About'
import ChristianValues from './pages/ChristianValues'
import Home from './pages/Home'
import Resources from './pages/Resources'
import WitnessCards from './pages/WitnessCards'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout navbar={<Navbar />} footer={<Footer />} />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/christian-values" element={<ChristianValues />} />
        <Route path="/witness-cards" element={<WitnessCards />} />
        <Route path="/gospel-cards" element={<Navigate to="/witness-cards" replace />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App
