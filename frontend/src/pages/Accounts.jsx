import { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

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
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  piggy: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9V6a2 2 0 00-2-2h-1.17a3 3 0 00-5.66 0H9a2 2 0 00-2 2v.5"/><path d="M3 11a3 3 0 003-3h12a3 3 0 013 3v3a3 3 0 01-3 3h-1l-1 3h-3l-.5-1.5H9.5L9 17H6l-1-3a3 3 0 01-2-3z"/><circle cx="16" cy="14" r="0.5" fill="currentColor"/></svg>,
  briefcase: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
  copy: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  check: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  close: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
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
  return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function authHeader() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
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
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, color: "#0f172a" }}>
          SmartBank
        </div>
      </div>
      <nav style={{ flex: 1, padding: "0 14px" }}>
        {NAV_ITEMS.map(item => (
          <a
            key={item.key}
            href={item.href}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", marginBottom: 2, borderRadius: 10,
              textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              fontWeight: item.key === active ? 600 : 500,
              color: item.key === active ? "#0f172a" : "#64748b",
              background: item.key === active ? "#f1f5f9" : "transparent",
            }}
          >
            {icons[item.icon]}
            {item.label}
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

function CreateAccountModal({ onClose, onCreated }) {
  const [type, setType] = useState("savings");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ account_type: type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not create account");
      onCreated(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, fontWeight: 600, color: "#0f172a", margin: 0 }}>
            Open a new account
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}>
            {icons.close}
          </button>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748b", margin: "0 0 22px" }}>
          Choose the type of account you'd like to open. It'll start with a zero balance.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
          {[
            { value: "savings", label: "Savings", icon: "piggy", desc: "Earn interest, ideal for everyday saving" },
            { value: "current", label: "Current", icon: "briefcase", desc: "No interest, built for frequent transactions" },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setType(opt.value)}
              style={{
                textAlign: "left",
                padding: "16px 14px",
                borderRadius: 12,
                border: `1.5px solid ${type === opt.value ? "#0f172a" : "#e2e8f0"}`,
                background: type === opt.value ? "#f8fafc" : "#fff",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <div style={{ color: type === opt.value ? "#0f172a" : "#94a3b8", marginBottom: 8 }}>{icons[opt.icon]}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 3 }}>{opt.label}</div>
              <div style={{ fontSize: 11.5, color: "#94a3b8", lineHeight: 1.4 }}>{opt.desc}</div>
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#dc2626" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, height: 46, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            style={{ flex: 1, height: 46, borderRadius: 10, border: "none", background: loading ? "#94a3b8" : "#0f172a", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountCard({ acc }) {
  const [copied, setCopied] = useState(false);

  function copyNumber() {
    navigator.clipboard.writeText(acc.account_number).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const isSavings = acc.account_type === "savings";

  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
      {/* Card-like header */}
      <div style={{
        background: isSavings ? "#0f172a" : "#1e3a5f",
        padding: "22px 22px 26px",
        color: "#fff",
        position: "relative",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              {acc.account_type} account
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, marginTop: 10 }}>
              {formatINR(acc.balance)}
            </div>
          </div>
          {acc.is_frozen && (
            <span style={{ fontSize: 10, fontWeight: 600, color: "#fff", background: "rgba(220,38,38,0.85)", padding: "4px 9px", borderRadius: 99, fontFamily: "'DM Sans', sans-serif" }}>
              FROZEN
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: "16px 22px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94a3b8" }}>Account number</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: "#0f172a", fontWeight: 500, letterSpacing: "0.03em", marginTop: 2 }}>
              {acc.account_number}
            </div>
          </div>
          <button
            onClick={copyNumber}
            style={{ display: "flex", alignItems: "center", gap: 5, background: "#f1f5f9", border: "none", borderRadius: 8, padding: "7px 11px", cursor: "pointer", color: copied ? "#16a34a" : "#64748b", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500 }}
          >
            {copied ? icons.check : icons.copy}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <a href="/transfer" style={{ flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 9, background: "#0f172a", color: "#fff", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 600 }}>
            Send money
          </a>
          <a href="/transactions" style={{ flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 9, background: "#f1f5f9", color: "#0f172a", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 600 }}>
            History
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  async function loadAccounts() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/accounts`, { headers: authHeader() });
      if (!res.ok) throw new Error("fetch failed");
      setAccounts(await res.json());
      setError("");
    } catch {
      setError("Could not reach the server. Showing demo data instead.");
      setAccounts(DEMO_ACCOUNTS);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAccounts(); }, []);

  function handleCreated(newAcc) {
    setAccounts(prev => [...prev, newAcc]);
    setShowModal(false);
  }

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance || 0), 0);

  return (
    <div style={pageStyle}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />

      <Sidebar active="accounts" />

      <main style={mainStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: "#0f172a", margin: 0 }}>
              Your accounts
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>
              {accounts.length} account{accounts.length !== 1 ? "s" : ""} · Total balance {formatINR(totalBalance)}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#0f172a", color: "#fff", border: "none", borderRadius: 10, padding: "11px 18px", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            {icons.plus} New account
          </button>
        </div>

        {error && (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#b45309" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {[1, 2].map(i => <div key={i} style={skeletonStyle} />)}
          </div>
        ) : accounts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", border: "1px dashed #e2e8f0", borderRadius: 16 }}>
            <div style={{ color: "#cbd5e1", marginBottom: 12, display: "flex", justifyContent: "center" }}>{icons.card}</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#64748b", margin: "0 0 16px" }}>
              You don't have any accounts yet.
            </p>
            <button onClick={() => setShowModal(true)} style={{ background: "#0f172a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Open your first account
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {accounts.map(acc => <AccountCard key={acc.id} acc={acc} />)}
          </div>
        )}
      </main>

      {showModal && <CreateAccountModal onClose={() => setShowModal(false)} onCreated={handleCreated} />}

      <style>{`@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }`}</style>
    </div>
  );
}

const DEMO_ACCOUNTS = [
  { id: "demo-1", account_type: "savings", account_number: "SB00012345678", balance: 234500.0, is_frozen: false },
  { id: "demo-2", account_type: "current", account_number: "SB00098765432", balance: 87200.0, is_frozen: false },
];

const pageStyle = { minHeight: "100vh", background: "#f8fafc", display: "flex", fontFamily: "'DM Sans', sans-serif" };
const sidebarStyle = { width: 230, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 };
const mainStyle = { flex: 1, padding: "32px 40px", maxWidth: 1100, minWidth: 0 };
const skeletonStyle = { background: "linear-gradient(90deg, #f1f5f9 25%, #f8fafc 37%, #f1f5f9 63%)", backgroundSize: "400% 100%", animation: "shimmer 1.4s ease infinite", borderRadius: 16, minHeight: 220 };
const overlayStyle = { position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 };
const modalStyle = { background: "#fff", borderRadius: 18, padding: "28px 28px 24px", width: "100%", maxWidth: 440 };