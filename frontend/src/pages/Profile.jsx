import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

function Shield() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path d="M16 3L5 7.5V15c0 6.2 4.7 11.9 11 13.4C22.3 26.9 27 21.2 27 15V7.5L16 3z" fill="#0f172a" stroke="#0f172a" strokeWidth="1" />
      <path d="M12 16l2.5 2.5L20 12" stroke="#e2f0fb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const icons = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V9.5z"/></svg>,
  card: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  swap: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4"/></svg>,
  list: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  chart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  logout: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  lock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  download: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  shield: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  eye: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
};

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "home", href: "/dashboard" },
  { key: "accounts", label: "Accounts", icon: "card", href: "/accounts" },
  { key: "transfer", label: "Transfer", icon: "swap", href: "/transfer" },
  { key: "transactions", label: "Transactions", icon: "list", href: "/transactions" },
  { key: "analytics", label: "Analytics", icon: "chart", href: "/analytics" },
  { key: "profile", label: "Profile", icon: "user", href: "/profile" },
];

function formatINR(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function authHeader() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" };
}

function Sidebar({ active }) {
  function handleLogout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  }
  return (
    <aside style={sidebarStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "28px 24px 32px" }}>
        <Shield />
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, color: "#0f172a" }}>SmartBank</div>
      </div>
      <nav style={{ flex: 1, padding: "0 14px" }}>
        {NAV_ITEMS.map(item => (
          <a key={item.key} href={item.href} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", marginBottom: 2, borderRadius: 10,
            textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            fontWeight: item.key === active ? 600 : 500,
            color: item.key === active ? "#0f172a" : "#64748b",
            background: item.key === active ? "#f1f5f9" : "transparent",
          }}>
            {icons[item.icon]} {item.label}
          </a>
        ))}
      </nav>
      <div style={{ padding: 14, borderTop: "1px solid #f1f5f9" }}>
        <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 14px", background: "none", border: "none", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#94a3b8", cursor: "pointer", textAlign: "left" }}>
          {icons.logout} Sign out
        </button>
      </div>
    </aside>
  );
}

function InputField({ label, id, type = "text", value, onChange, error, placeholder, autoComplete, disabled }) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div style={{ marginBottom: 18 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: error ? "#dc2626" : "#64748b", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
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
          disabled={disabled}
          style={{
            width: "100%", height: 46, padding: isPass ? "0 44px 0 14px" : "0 14px",
            fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            background: disabled ? "#f8fafc" : (error ? "#fff5f5" : "#f8fafc"),
            border: `1.5px solid ${error ? "#fca5a5" : "#e2e8f0"}`,
            borderRadius: 10, outline: "none", color: disabled ? "#94a3b8" : "#0f172a",
            boxSizing: "border-box", cursor: disabled ? "not-allowed" : "text",
          }}
          onFocus={e => { if (!disabled) { e.target.style.borderColor = "#0f172a"; e.target.style.background = "#fff"; } }}
          onBlur={e => { e.target.style.borderColor = error ? "#fca5a5" : "#e2e8f0"; e.target.style.background = disabled ? "#f8fafc" : (error ? "#fff5f5" : "#f8fafc"); }}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex", alignItems: "center" }}>
            {show ? icons.eyeOff : icons.eye}
          </button>
        )}
      </div>
      {error && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#dc2626", fontFamily: "'DM Sans', sans-serif" }}>{error}</p>}
    </div>
  );
}

function generatePDF(user, accounts, transactions) {
  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance || 0), 0);
  const html = `
    <html>
    <head>
      <title>SmartBank Statement</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #0f172a; }
        h1 { font-size: 22px; margin-bottom: 4px; }
        .sub { color: #64748b; font-size: 13px; margin-bottom: 32px; }
        .section { margin-bottom: 28px; }
        .section-title { font-size: 13px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
        .row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
        .row:last-child { border-bottom: none; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: bold; }
        .badge-red { background: #fef2f2; color: #dc2626; }
        .badge-green { background: #f0fdf4; color: #16a34a; }
        .total { font-size: 20px; font-weight: bold; margin: 8px 0; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { text-align: left; color: #64748b; font-size: 11px; padding: 8px 6px; border-bottom: 1px solid #e2e8f0; }
        td { padding: 10px 6px; border-bottom: 1px solid #f1f5f9; }
        .footer { margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <h1>SmartBank AI</h1>
      <div class="sub">Account Statement · Generated ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
      <div class="section">
        <div class="section-title">Account holder</div>
        <div class="row"><span>Name</span><span>${user?.name || "Account Holder"}</span></div>
        <div class="row"><span>Email</span><span>${user?.email || "—"}</span></div>
        <div class="row"><span>Total balance</span><span class="total">${formatINR(totalBalance)}</span></div>
      </div>
      <div class="section">
        <div class="section-title">Accounts</div>
        ${accounts.map(a => `<div class="row"><span>${a.account_type === "savings" ? "Savings" : "Current"} · ${a.account_number}</span><span>${formatINR(a.balance)}</span></div>`).join("")}
      </div>
      <div class="section">
        <div class="section-title">Recent transactions</div>
        <table>
          <thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Risk</th><th style="text-align:right">Amount</th></tr></thead>
          <tbody>
            ${transactions.slice(0, 20).map(t => `
              <tr>
                <td>${new Date(t.created_at).toLocaleDateString("en-IN")}</td>
                <td>${t.note || t.type}</td>
                <td style="text-transform:capitalize">${t.type}</td>
                <td>${t.flagged ? `<span class="badge badge-red">Flagged ${Math.round((t.fraud_score || 0) * 100)}%</span>` : `<span class="badge badge-green">Safe</span>`}</td>
                <td style="text-align:right;font-weight:bold;color:${t.type === "deposit" ? "#16a34a" : "#0f172a"}">${t.type === "deposit" ? "+" : "−"}${formatINR(t.amount)}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="footer">This statement was generated by SmartBank AI · Confidential · For personal use only</div>
    </body>
    </html>
  `;
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState("");
  const [savingPass, setSavingPass] = useState(false);

  useEffect(() => {
    async function load() {
      const storedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");
      setUser(storedUser);
      if (storedUser) { setName(storedUser.name || ""); setEmail(storedUser.email || ""); }
      try {
        const [accRes, txnRes] = await Promise.all([
          fetch(`${API}/accounts`, { headers: authHeader() }),
          fetch(`${API}/transactions?limit=20`, { headers: authHeader() }),
        ]);
        if (accRes.ok) setAccounts(await accRes.json());
        if (txnRes.ok) setTransactions(await txnRes.json());
      } catch {
        setAccounts(DEMO_ACCOUNTS);
        setTransactions(DEMO_TRANSACTIONS);
      }
    }
    load();
  }, []);

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!name.trim()) { setProfileError("Name cannot be empty"); return; }
    setSavingProfile(true);
    setProfileError("");
    setProfileSuccess(false);
    try {
      const res = await fetch(`${API}/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) throw new Error("Could not update profile");
      const updated = { ...user, name, email };
      const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      const updated = { ...user, name, email };
      const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPass.length < 8) { setPassError("New password must be at least 8 characters"); return; }
    if (newPass !== confirmPass) { setPassError("Passwords do not match"); return; }
    setSavingPass(true);
    setPassError("");
    setPassSuccess(false);
    try {
      const res = await fetch(`${API}/auth/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Could not change password");
      }
      setPassSuccess(true);
      setCurrentPass(""); setNewPass(""); setConfirmPass("");
      setTimeout(() => setPassSuccess(false), 3000);
    } catch (err) {
      setPassError(err.message);
    } finally {
      setSavingPass(false);
    }
  }

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance || 0), 0);
  const initials = (user?.name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={pageStyle}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />
      <Sidebar active="profile" />
      <main style={mainStyle}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: "#0f172a", margin: 0 }}>Profile</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Manage your account details and security settings</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={panelStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#fff", flexShrink: 0 }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: "#0f172a" }}>{user?.name || "Account Holder"}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#94a3b8", marginTop: 2 }}>{user?.email || "—"}</div>
                  <span style={{ display: "inline-block", marginTop: 5, fontSize: 11, fontWeight: 600, color: "#0f172a", background: "#f1f5f9", padding: "2px 9px", borderRadius: 99, fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>
                    {user?.role || "customer"}
                  </span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>Accounts</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#0f172a" }}>{accounts.length}</div>
                </div>
                <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>Total balance</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{formatINR(totalBalance)}</div>
                </div>
              </div>
            </div>

            <div style={panelStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <span style={{ color: "#0f172a" }}>{icons.edit}</span>
                <h2 style={sectionTitle}>Personal details</h2>
              </div>
              <form onSubmit={handleSaveProfile}>
                <InputField label="Full name" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" autoComplete="name" />
                <InputField label="Email address" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" autoComplete="email" />
                {profileError && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#dc2626", margin: "0 0 14px" }}>{profileError}</p>}
                {profileSuccess && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>
                    <span style={{ color: "#16a34a" }}>{icons.check}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#16a34a" }}>Profile updated successfully</span>
                  </div>
                )}
                <button type="submit" disabled={savingProfile} style={primaryBtn(savingProfile)}>
                  {savingProfile ? "Saving…" : "Save changes"}
                </button>
              </form>
            </div>

            <div style={panelStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ color: "#0f172a" }}>{icons.download}</span>
                <h2 style={sectionTitle}>Bank statement</h2>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748b", margin: "0 0 16px", lineHeight: 1.6 }}>
                Download a PDF statement showing your accounts, balances, and last 20 transactions.
              </p>
              <button
                onClick={() => generatePDF(user, accounts.length ? accounts : DEMO_ACCOUNTS, transactions.length ? transactions : DEMO_TRANSACTIONS)}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9", color: "#0f172a", border: "none", borderRadius: 10, padding: "11px 18px", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                {icons.download} Download PDF statement
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={panelStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <span style={{ color: "#0f172a" }}>{icons.lock}</span>
                <h2 style={sectionTitle}>Change password</h2>
              </div>
              <form onSubmit={handleChangePassword}>
                <InputField label="Current password" id="currentPass" type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="Enter current password" autoComplete="current-password" />
                <InputField label="New password" id="newPass" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min 8 characters" autoComplete="new-password" />
                <InputField label="Confirm new password" id="confirmPass" type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Repeat new password" autoComplete="new-password" />
                {passError && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#dc2626", margin: "0 0 14px" }}>{passError}</p>}
                {passSuccess && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>
                    <span style={{ color: "#16a34a" }}>{icons.check}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#16a34a" }}>Password changed successfully</span>
                  </div>
                )}
                <button type="submit" disabled={savingPass} style={primaryBtn(savingPass)}>
                  {savingPass ? "Updating…" : "Update password"}
                </button>
              </form>
            </div>

            <div style={{ ...panelStyle, background: "#f8fafc", border: "1px dashed #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ color: "#0f172a" }}>{icons.shield}</span>
                <h2 style={sectionTitle}>Security</h2>
              </div>
              {[
                { label: "Password encryption", value: "bcrypt (salt: 10)", ok: true },
                { label: "Session token", value: "JWT · expires in 7 days", ok: true },
                { label: "Data transfer", value: "HTTPS encrypted", ok: true },
                { label: "Fraud detection", value: "Active on all transfers", ok: true },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748b" }}>{item.label}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: item.ok ? "#16a34a" : "#dc2626" }}>
                    {item.ok && <span style={{ color: "#16a34a" }}>{icons.check}</span>}
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ ...panelStyle, border: "1px solid #fecaca" }}>
              <h2 style={{ ...sectionTitle, color: "#dc2626", marginBottom: 8 }}>Danger zone</h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748b", margin: "0 0 14px", lineHeight: 1.6 }}>
                Signing out will clear your session. Your data remains safe in the database.
              </p>
              <button
                onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = "/login"; }}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                {icons.logout} Sign out of all sessions
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const DEMO_ACCOUNTS = [
  { id: "d1", account_type: "savings", account_number: "SB73835591141657", balance: 500000 },
  { id: "d2", account_type: "current", account_number: "SB32931489493143", balance: 100000 },
];
const DEMO_TRANSACTIONS = [
  { id: "t1", type: "transfer", amount: 110000, note: "Flag test", flagged: true, fraud_score: 0.65, status: "completed", created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: "t2", type: "deposit", amount: 500000, note: "Salary", flagged: false, fraud_score: 0.02, status: "completed", created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
];

function primaryBtn(disabled) {
  return { width: "100%", height: 46, borderRadius: 10, border: "none", background: disabled ? "#94a3b8" : "#0f172a", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer" };
}

const pageStyle = { minHeight: "100vh", background: "#f8fafc", display: "flex", fontFamily: "'DM Sans', sans-serif" };
const sidebarStyle = { width: 230, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 };
const mainStyle = { flex: 1, padding: "32px 40px", maxWidth: 1100, minWidth: 0 };
const panelStyle = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px" };
const sectionTitle = { fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 };