import { Route, Routes } from 'react-router-dom';
import { AppContext, useApp } from './hooks/useApp';
import { css } from './lib/css';
import { pathFor } from './lib/routes';
import Nav from './components/Nav';
import NavEditorial from './components/NavEditorial';
import DesignToggle from './components/DesignToggle';
import MobileMenu from './components/MobileMenu';
import Footer from './components/Footer';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';

export default function App() {
  const app = useApp();
  // The original parsed the hash leniently (unknown hashes land on Home);
  // `pathFor` hands React Router the canonical path for that result.
  const location = pathFor(app.route);
  return (
    <AppContext.Provider value={app}>
      <div style={css("--cream:#F1EBE1;--paper:#FAF6EF;--ink:#2E2A24;--soft:#5B5247;--muted:#6F6151;--line:#DED1BF;--ph1:#E7DDCC;--ph2:#EEE6D7;background:var(--cream);color:var(--ink);font-family:'EB Garamond',Georgia,serif;min-height:100vh;")}>

        <a href="#main" className="skip-link">Skip to content</a>

        {app.design === 'editorial' && app.width > 680 ? <NavEditorial /> : <Nav />}
        <MobileMenu />

        <Routes location={location}>
          <Route path="/work/*" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>

        <Footer />
        <DesignToggle />
      </div>
    </AppContext.Provider>
  );
}
