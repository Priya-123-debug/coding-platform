import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../store/authSlice";
import { User, LogOut, BarChart2, ChevronDown } from "lucide-react";

const Navbar = ({ filter, setfilter, isUser }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    setOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* TOP BAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(13,17,23,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1.25rem", height: "58px",
      }}>
        <NavLink to="/" style={{ textDecoration: "none", fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          <span style={{ color: "var(--accent)" }}>&lt;</span>Code<span style={{ color: "var(--accent)" }}>/&gt;</span>
        </NavLink>

        <div style={{ position: "relative" }}>
          <button onClick={() => setOpen(p => !p)} style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "8px", padding: "0.4rem 0.75rem",
            cursor: "pointer", color: "var(--text-primary)",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 700, color: "#fff",
            }}>
              {(user?.firstname?.[0] || user?.email?.[0] || "U").toUpperCase()}
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>{user?.firstname || "User"}</span>
            <ChevronDown size={14} color="var(--text-secondary)" />
          </button>

          {open && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
              <div style={{
                position: "absolute", right: 0, top: "calc(100% + 8px)", zIndex: 50,
                background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px",
                minWidth: "200px", padding: "0.5rem", boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}>
                <div style={{ padding: "0.5rem 0.75rem 0.75rem", borderBottom: "1px solid var(--border)", marginBottom: "0.25rem" }}>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>{user?.firstname || "User"}</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", margin: "2px 0 0", wordBreak: "break-all" }}>{user?.email}</p>
                </div>
                {[
                  { label: "Profile", icon: <User size={14} />, path: "/profile" },
                  { label: "Submissions", icon: <BarChart2 size={14} />, path: "/submissions" },
                ].map(item => (
                  <button key={item.label} onClick={() => { navigate(item.path); setOpen(false); }} style={{
                    width: "100%", background: "none", border: "none", textAlign: "left",
                    padding: "0.5rem 0.75rem", borderRadius: "6px", cursor: "pointer",
                    color: "var(--text-primary)", fontSize: "0.85rem",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
                <button onClick={handleLogout} style={{
                  width: "100%", background: "none", border: "none", textAlign: "left",
                  padding: "0.5rem 0.75rem", borderRadius: "6px", cursor: "pointer",
                  color: "var(--red)", fontSize: "0.85rem",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  marginTop: "0.25rem", borderTop: "1px solid var(--border)",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(248,81,73,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* FILTER BAR */}
      {isUser && user?.role !== "admin" && filter && setfilter && (
        <div style={{
          background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)",
          padding: "0.65rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap",
        }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 500 }}>Filter:</span>

          {[
            { key: "status", options: [["all","All Problems"],["solved","Solved"]] },
            { key: "difficulty", options: [["all","All Difficulties"],["easy","Easy"],["medium","Medium"],["hard","Hard"]] },
            { key: "tag", options: [["all","All Tags"],["array","Array"],["LinkedList","Linked List"],["graph","Graph"],["dp","DP"]] },
          ].map(({ key, options }) => (
            <select key={key} value={filter[key]} onChange={e => setfilter({ ...filter, [key]: e.target.value })}
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: "6px", padding: "0.35rem 0.75rem", fontSize: "0.82rem", cursor: "pointer", outline: "none" }}>
              {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}

          {(filter.difficulty !== "all" || filter.tag !== "all" || filter.status !== "all") && (
            <button onClick={() => setfilter({ difficulty: "all", tag: "all", status: "all" })}
              style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "0.78rem", cursor: "pointer", textDecoration: "underline" }}>
              Clear
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;