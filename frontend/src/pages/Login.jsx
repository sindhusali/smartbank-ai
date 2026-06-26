import { useState } from "react";

const API = "process.env.REACT_APP_API_URL || "http://localhost:5000/api"";

// Same shield mark as Register, for visual consistency
function Shield() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 3L5 7.5V15c0 6.2 4.7 11.9 11 13.4C22.3 26.9 27 21.2 27 15V7.5L16 3z"
        fill="#0f172a"
        stroke="#0f172a"
        strokeWidth="1"
      />
      <path
        d="M12 16l2.5 2.5L20 12"
        stroke="#e2f0fb"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InputField({ label, id, type = "text", value, onChange, error, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: error ? "#dc2626" : "#64748b",
          marginBottom: 6,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={isPass && show ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            width: "100%",
            height: 48,
            padding: isPass ? "0 44px 0 14px" : "0 14px",
            fontSize: 15,
            fontFamily: "'DM Sans', sans-serif",
            background: error ? "#fff5f5" : "#f8fafc",
            border: `1.5px solid ${error ? "#fca5a5" : "#e2e8f0"}`,
            borderRadius: 10,
            outline: "none",
            color: "#0f172a",
            boxSizing: "border-box",
            transition: "border-color 0.15s, background 0.15s",
          }}
          onFocus={e => {
            e.target.style.borderColor = "#0f172a";
            e.target.style.background = "#fff";
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? "#fca5a5" : "#e2e8f0";
            e.target.style.background = error ? "#fff5f5" : "#f8fafc";
          }}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              padding: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            {show ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p style={{ margin: "5px 0 0", fontSize: 12, color: "#dc2626", fontFamily: "'DM Sans', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  function validate() {
    const errs = {};
    if (!form.email.includes("@")) errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setServerError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid email or password");

      // Persist token — sessionStorage if "remember me" is off
      const storage = remember ? localStorage : sessionStorage;
storage.setItem("token", data.token);
storage.setItem("user", JSON.stringify(data.user));

window.location.href = "/dashboard";
    } catch (err) {
      setAttempts(a => a + 1);
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const isLocked = attempts >= 5;

  return (
    <div style={pageStyle}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />

      <div style={cardStyle}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <Shield />
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#0f172a", lineHeight: 1.2 }}>
              SmartBank
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Intelligent Banking
            </div>
          </div>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: "#0f172a", margin: "0 0 6px" }}>
          Welcome back
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#64748b", margin: "0 0 32px" }}>
          New to SmartBank?{" "}
          <a href="/register" style={{ color: "#0f172a", fontWeight: 600, textDecoration: "none" }}>
            Create an account
          </a>
        </p>

        {/* Server error / lockout warning */}
        {serverError && !isLocked && (
          <div style={alertStyle("#fef2f2", "#fecaca")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#dc2626" }}>
              {serverError}
              {attempts >= 3 && ` (attempt ${attempts} of 5)`}
            </span>
          </div>
        )}

        {isLocked && (
          <div style={alertStyle("#fffbeb", "#fde68a")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#b45309" }}>
              Too many failed attempts. Account temporarily locked — try again in 15 minutes or reset your password.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <fieldset disabled={isLocked} style={{ border: "none", padding: 0, margin: 0 }}>
            <InputField
              label="Email address"
              id="email"
              type="email"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
              placeholder="arjun@example.com"
              autoComplete="email"
            />
            <InputField
              label="Password"
              id="password"
              type="password"
              value={form.password}
              onChange={set("password")}
              error={errors.password}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            {/* Remember me + forgot password */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#475569" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: "#0f172a", cursor: "pointer" }}
                />
                Keep me signed in
              </label>
              <a href="/forgot-password" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#0f172a", fontWeight: 600, textDecoration: "none" }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              style={{
                width: "100%",
                height: 50,
                background: (loading || isLocked) ? "#94a3b8" : "#0f172a",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: (loading || isLocked) ? "not-allowed" : "pointer",
                letterSpacing: "0.02em",
                transition: "background 0.2s, transform 0.1s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
              onMouseDown={e => { if (!loading && !isLocked) e.currentTarget.style.transform = "scale(0.98)"; }}
              onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Signing in…
                </>
              ) : "Sign in"}
            </button>
          </fieldset>
        </form>

        {/* Security note */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 24,
          paddingTop: 20,
          borderTop: "1px solid #f1f5f9",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94a3b8" }}>
            256-bit encryption · We never ask for your password by email or phone
          </span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function alertStyle(bg, border) {
  return {
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 10,
    padding: "12px 14px",
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    gap: 10,
  };
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f8fafc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px 16px",
  fontFamily: "'DM Sans', sans-serif",
};

const cardStyle = {
  background: "#ffffff",
  borderRadius: 20,
  border: "1px solid #e2e8f0",
  padding: "40px 40px 32px",
  width: "100%",
  maxWidth: 440,
};
