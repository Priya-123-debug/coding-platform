import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../Navbar";
import { LayoutList, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";

const navItems = [
  { to: "/admin", label: "All Problems", icon: <LayoutList size={16} />, end: true },
  { to: "/admin/create", label: "Create Problem", icon: <PlusCircle size={16} /> },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar */}
        <aside style={{ width: collapsed ? "52px" : "200px", flexShrink: 0, background: "var(--bg-secondary)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", transition: "width 0.2s ease", overflow: "hidden" }}>
          <button onClick={() => setCollapsed(p => !p)} style={{ alignSelf: "flex-end", margin: "0.75rem 0.6rem 0.5rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0.3rem", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {!collapsed && (
            <p style={{ padding: "0 0.9rem", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Admin</p>
          )}

          <nav style={{ padding: "0 0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} end={item.end}
                style={({ isActive }) => ({
                  display: "flex", alignItems: "center", gap: "0.6rem",
                  padding: "0.55rem 0.65rem", borderRadius: "8px", textDecoration: "none",
                  fontWeight: 500, fontSize: "0.85rem",
                  background: isActive ? "rgba(247,129,102,0.12)" : "transparent",
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  whiteSpace: "nowrap", overflow: "hidden",
                })}
              >
                {item.icon}
                {!collapsed && item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto", padding: "1.75rem" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;