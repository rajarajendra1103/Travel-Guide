import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Compass, User } from 'lucide-react';
import './App.css';

// Lazy load pages
import Home from './pages/Home.tsx';
import Planner from './pages/Planner.tsx';
import Transport from './pages/Transport.tsx';
import Discovery from './pages/Discovery.tsx';
import Packing from './pages/Packing.tsx';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar" style={{ borderBottom: 'none', background: 'transparent', backdropFilter: 'none' }}>
          <div className="logo" style={{ color: 'white' }}>
            <div className="logo-icon" style={{ background: '#3b82f6' }}>
              <Compass size={20} color="white" />
            </div>
            <span>Travel Guide</span>
          </div>

          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Smart Search
            </NavLink>
            <NavLink to="/planner" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              AI Planner
            </NavLink>
            <NavLink to="/packing" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Packing Assistant
            </NavLink>
            <NavLink to="/transport" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Transport Guide
            </NavLink>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button className="nav-icon-btn" style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="white" />
            </button>
          </div>
        </nav>

        <main className="main-content" style={{ padding: 0 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/packing" element={<Packing />} />
            <Route path="/transport" element={<Transport />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
