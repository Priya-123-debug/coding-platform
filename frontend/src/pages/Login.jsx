import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { loginuser } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const schema = z.object({
  emailid: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, loading, error, user } = useSelector(s => s.auth);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated && user) navigate(user?.role === "admin" ? "/admin" : "/");
  }, [isAuthenticated, navigate, user]);

  const onSubmit = data => dispatch(loginuser(data));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>

      {/* Left panel */}
      <div className="auth-left" style={{
        flex: "0 0 360px", height: "500px", background: "var(--bg-secondary)",
        border: "1px solid var(--border)", borderRadius: "16px 0 0 16px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2.5rem",
      }}>
        <div style={{ fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.03em", textAlign: "center", lineHeight: 1.2 }}>
          <span style={{ color: "var(--accent)" }}>&lt;</span>Code<span style={{ color: "var(--accent)" }}>/&gt;</span><br />
          <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--text-secondary)" }}>Platform</span>
        </div>
        <p style={{ color: "var(--text-secondary)", textAlign: "center", fontSize: "0.875rem", marginTop: "1.5rem", lineHeight: 1.6 }}>
          Solve curated problems, run code instantly, and track your growth.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
          {["C++", "Python", "Java", "JS"].map(l => (
            <span key={l} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0.3rem 0.7rem", fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div style={{
        flex: "0 0 360px", background: "var(--bg-card)", border: "1px solid var(--border)",
        borderLeft: "none", borderRadius: "0 16px 16px 0", padding: "2.5rem",
      }} className="auth-right">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>Welcome back</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.75rem" }}>Log in to continue solving.</p>

        {error && (
          <div style={{ background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.3)", borderRadius: "8px", padding: "0.65rem 0.9rem", marginBottom: "1rem", color: "var(--red)", fontSize: "0.82rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Email</label>
            <input {...register("emailid")} type="email" placeholder="you@example.com" className="input-custom" />
            {errors.emailid && <p style={{ color: "var(--red)", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.emailid.message}</p>}
          </div>

          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className="input-custom" style={{ paddingRight: "2.5rem" }} />
              <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && <p style={{ color: "var(--red)", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.7rem", fontWeight: 600, fontSize: "0.875rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "0.25rem" }}>
            {loading ? "Logging in…" : "Log in"}
          </button>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="button" onClick={() => { setValue("emailid","supriyak.ug23.ec@nitp.ac.in"); setValue("password","12345678"); }} style={{ flex: 1, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0.45rem", fontSize: "0.75rem", color: "var(--text-secondary)", cursor: "pointer" }}>
              Fill Admin
            </button>
            <button type="button" onClick={() => { setValue("emailid","test@test.com"); setValue("password","12345678"); }} style={{ flex: 1, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0.45rem", fontSize: "0.75rem", color: "var(--text-secondary)", cursor: "pointer" }}>
              Fill User
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
          No account? <Link to="/signup" style={{ color: "var(--accent-2)", textDecoration: "none", fontWeight: 600 }}>Sign up free</Link>
        </p>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .auth-left { display: none !important; }
          .auth-right { border-radius: 16px !important; border-left: 1px solid var(--border) !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;