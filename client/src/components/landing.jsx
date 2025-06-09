import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Hero from '../components/hero';
// import About from '../components/About';
import Features from '../components/features';
import Contact from '../components/contact';
import Bottombar from '../components/bottombar';

export default function Landing() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const timer = setTimeout(() => {
        const section = document.getElementById(location.state.scrollTo);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
          // clear scrollTo after scrolling
          navigate(location.pathname, { replace: true, state: {} });
        }
      }, 100); // Delay to ensure DOM is rendered
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  return (
    <>
      <div id="hero" className="pt-16"><Hero /></div>
      {/* <div id="about" className="pt-16"><About /></div> */}
      <div id="features" className="pt-16"><Features /></div>
      <div id="contact" className="pt-16"><Contact /></div>
      <Bottombar />
    </>
  );
}
