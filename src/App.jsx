import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Hero from './pages/Hero'
import About from './pages/About'
import HowToPlay from './pages/HowToPlay'
import Projects from './pages/Projects'
import Vote from './pages/Vote'
import RSVP from './pages/RSVP'
import Partners from './pages/Partners'
import PhotoWall from './pages/PhotoWall'
import Judges from './pages/Judges'

function AppInner() {
  const location = useLocation()
  const hideFooter = location.pathname === '/judges'

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/rsvp" element={<RSVP />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/photos" element={<PhotoWall />} />
        <Route path="/judges" element={<Judges />} />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}

export default App
