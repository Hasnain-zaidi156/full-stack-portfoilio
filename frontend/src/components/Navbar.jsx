import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../style/Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img
            src="https://i.ibb.co/tTbGDbLv/Untitled-design-1.png"
            alt="HZ"
            onError={(e) => (e.target.style.display = 'none')}
          />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>About</NavLink></li>
          <li><NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Projects</NavLink></li>
          <li><NavLink to="/skills" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Skills</NavLink></li>
          <li><NavLink to="/achievements" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Achievements &amp; Memories</NavLink></li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => `nav-cta${isActive ? ' active' : ''}`}
              onClick={closeMenu}
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}