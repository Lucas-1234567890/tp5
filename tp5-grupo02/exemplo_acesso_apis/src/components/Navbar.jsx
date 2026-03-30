// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

const links = [
  { to: "/",       icon: "🏠", label: "Lista",   end: true },
  { to: "/camera", icon: "📷", label: "Câmera"             },
  { to: "/novo",   icon: "➕", label: "Novo"               },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      {links.map(({ to, icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
        >
          <span className="nav-icon">{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}