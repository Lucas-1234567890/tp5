// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "🏠 Lista", end: true },
  { to: "/novo", label: "➕ Novo" },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      {links.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}