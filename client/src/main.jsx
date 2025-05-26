import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './components/navbar.jsx' 
// import Hero from './components/hero.jsx'
// import About from './components/about.jsx'
// import Features from './components/features.jsx'
// import Contact from './components/contact.jsx'
// import BottomBar from './components/bottombar.jsx'
// import Upload from './components/upload.jsx'
import Record from './components/record.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    {/* <div id="hero" className="pt-16"><Hero /></div>
    <div id="about" className="pt-16"><About /></div>
    <div id="features" className="pt-16"><Features /></div>
    <div id="contact" className="pt-16"><Contact /></div>
    <BottomBar /> */}
    {/* <Upload /> */}
    <Record />
  </StrictMode>,
)
