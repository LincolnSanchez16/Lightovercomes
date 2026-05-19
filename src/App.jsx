import { Route, Routes } from 'react-router-dom'
import Footer from './components/layout/Footer'
import MainLayout from './components/layout/MainLayout'
import Navbar from './components/layout/Navbar'
import About from './pages/About'
import ChristianValues from './pages/ChristianValues'
import GospelCards from './pages/GospelCards'
import Home from './pages/Home'
import Resources from './pages/Resources'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout navbar={<Navbar />} footer={<Footer />} />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/christian-values" element={<ChristianValues />} />
        <Route path="/gospel-cards" element={<GospelCards />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App
