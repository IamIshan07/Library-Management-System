import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", index: "01" },
  { to: "/books", label: "Books", index: "02" },
  { to: "/members", label: "Members", index: "03" },
  { to: "/issues", label: "Issue / Return", index: "04" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">Stackroom</div>
        <div className="brand-sub">Library Catalog System</div>
      </div>
      <ul className="nav-list">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                "nav-item" + (isActive ? " active" : "")
              }
            >
              <span className="nav-index">{link.index}</span>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
