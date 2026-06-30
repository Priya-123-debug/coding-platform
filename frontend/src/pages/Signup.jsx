import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { registerUser } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const schema = z.object({
  firstname: z.string().min(3, "Name must be at least 3 characters"),
  emailid: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, loading, error } = useSelector(s => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => { if (isAuthenticated) navigate("/"); }, [isAuthenticated, navigate]);

  const onSubmit = data => dispatch(registerUser(data));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: "400px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "2.5rem" }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
            <span style={{ color: "var(--accent)" }}>&lt;</span>Code<span style={{ color: "var(--accent)" }}>/&gt;</span>
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: "0.75rem 0 0.25rem" }}>Create your account</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>Start solving problems today.</p>
        </div>

        {error && (
          <div style={{ background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.3)", borderRadius: "8px", padding: "0.65rem 0.9rem", marginBottom: "1rem", color: "var(--red)", fontSize: "0.82rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { name: "firstname", label: "Full Name", type: "text", placeholder: "Jane Smith" },
            { name: "emailid", label: "Email", type: "email", placeholder: "you@example.com" },
          ].map(f => (
            <div key={f.name}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>{f.label}</label>
              <input {...register(f.name)} type={f.type} placeholder={f.placeholder} className="input-custom" />
              {errors[f.name] && <p style={{ color: "var(--red)", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors[f.name].message}</p>}
            </div>
          ))}

          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" className="input-custom" style={{ paddingRight: "2.5rem" }} />
              <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && <p style={{ color: "var(--red)", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.7rem", fontWeight: 600, fontSize: "0.875rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "0.25rem" }}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent-2)", textDecoration: "none", fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;