import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './assets/fonts/fonts.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
// import Navbar from './components/navbar.jsx' 
// import Hero from './components/hero.jsx'
// import About from './components/about.jsx'
// import Features from './components/features.jsx'
// import Contact from './components/contact.jsx'
// import BottomBar from './components/bottombar.jsx'
// import Upload from './components/upload.jsx'
// import Record from './components/record.jsx'
// import Download from './components/download.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
