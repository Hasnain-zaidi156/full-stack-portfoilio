import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chrome from './components/Chrome';
import Home from './pages/Home';
import Resume from './pages/Resume';
import Admin from './pages/Admin';
import { SearchCtx } from './utils/search';
import './style/portfolio.css';

export default function App() {
  const [q, setQ] = useState('');
  return (
    <SearchCtx.Provider value={q.toLowerCase().trim()}>
      <a className="skip" href="#main">Skip to content</a>
      <Chrome />
      <Navbar q={q} setQ={setQ} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </SearchCtx.Provider>
  );
}
