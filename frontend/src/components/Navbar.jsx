import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand">
          Samuel G-R.
        </NavLink>
        <nav className="navbar-links">
          <NavLink to="/" end className={linkClass}>Accueil</NavLink>
          <NavLink to="/projets" className={linkClass}>Projets</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
