import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

// Same shield mark used in Login/Register for visual consistency
function Shield() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 3L5 7.5V15c0 6.2 4.7 11.9 11 13.4C22.3 26.9 27 21.2 27 15V7.5L16 3z"
        fill="#0f172a"
        stroke="#0f172a"
        strokeWidth="1"
      />
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
  bell: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  alert: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  up: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 7l-9 9M17 7H8M17 7v9"/></svg>,
  down: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 17L8 8M17 17H8M17 17V8"/></svg>,
  logout: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  eyeOff: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  eye: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
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

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hideBalance, setHideBalance] = useState(false);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");
      setUser(storedUser);

      try {
        const [accRes, txnRes] = await Promise.all([
          fetch(`${API}/accounts`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/transactions?limit=5`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (accRes.ok) setAccounts(await accRes.json());
        if (txnRes.ok) setTransactions(await txnRes.json());
      } catch {
        setError("Could not reach the server. Showing demo data instead.");
        setAccounts(DEMO_ACCOUNTS);
        setTransactions(DEMO_TRANSACTIONS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  }

  const displayAccounts = accounts.length ? accounts : (loading ? [] : DEMO_ACCOUNTS);
  const displayTxns = transactions.length ? transactions : (loading ? [] : DEMO_TRANSACTIONS);
  const totalBalance = displayAccounts.reduce((s, a) => s + Number(a.balance || 0), 0);
  const flaggedTxn = displayTxns.find(t => t.flagged);

  return (
    <div style={pageStyle}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "28px 24px 32px" }}>
          <Shield />
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, color: "#0f172a", lineHeight: 1.2 }}>
              SmartBank
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "0 14px" }}>
          {NAV_ITEMS.map(item => (
            <a
              key={item.key}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                marginBottom: 2,
                borderRadius: 10,
                textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: item.key === "dashboard" ? 600 : 500,
                color: item.key === "dashboard" ? "#0f172a" : "#64748b",
                background: item.key === "dashboard" ? "#f1f5f9" : "transparent",
              }}
            >
              {icons[item.icon]}
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ padding: 14, borderTop: "1px solid #f1f5f9" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "11px 14px",
              background: "none",
              border: "none",
              borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "#94a3b8",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {icons.logout} Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={mainStyle}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: "#0f172a", margin: 0 }}>
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <button style={iconBtnStyle} aria-label="Notifications">
            {icons.bell}
          </button>
        </div>

        {error && (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#b45309" }}>
            {error}
          </div>
        )}

        {/* Fraud alert banner */}
        {flaggedTxn && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
          }}>
            <div style={{ color: "#dc2626", flexShrink: 0, marginTop: 1 }}>{icons.alert}</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#991b1b", marginBottom: 3 }}>
                Suspicious transaction detected
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#b91c1c", margin: 0, lineHeight: 1.5 }}>
                A transfer of {formatINR(flaggedTxn.amount)} on {new Date(flaggedTxn.created_at).toLocaleDateString("en-IN")} was flagged with a risk score of {Math.round((flaggedTxn.fraud_score || 0.9) * 100)}%. Review it before it's finalized.
              </p>
            </div>
            <a href="/transactions" style={{ flexShrink: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#dc2626", textDecoration: "none", whiteSpace: "nowrap", marginTop: 1 }}>
              Review →
            </a>
          </div>
        )}

        {/* Account cards */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={sectionTitleStyle}>Your accounts</h2>
          <button onClick={() => setHideBalance(h => !h)} style={ghostBtnStyle}>
            {hideBalance ? icons.eye : icons.eyeOff}
            {hideBalance ? "Show balances" : "Hide balances"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 32 }}>
          {/* Total balance card — dark, anchor card */}
          <div style={{
            background: "#0f172a",
            borderRadius: 16,
            padding: "22px 24px",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 140,
          }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Total balance
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 600, margin: "8px 0" }}>
              {hideBalance ? "₹ • • • • • •" : formatINR(totalBalance)}
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#64748b" }}>
              Across {displayAccounts.length} account{displayAccounts.length !== 1 ? "s" : ""}
            </div>
          </div>

          {loading
            ? [1, 2].map(i => <div key={i} style={skeletonCardStyle} />)
            : displayAccounts.map(acc => (
              <div key={acc.id} style={accountCardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#94a3b8", textTransform: "capitalize" }}>
                      {acc.account_type} account
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#cbd5e1", marginTop: 2, letterSpacing: "0.04em" }}>
                      •••• {String(acc.account_number).slice(-4)}
                    </div>
                  </div>
                  {acc.is_frozen && (
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#b45309", background: "#fffbeb", padding: "3px 8px", borderRadius: 99, fontFamily: "'DM Sans', sans-serif" }}>
                      FROZEN
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, color: "#0f172a", margin: "16px 0 4px" }}>
                  {hideBalance ? "₹ • • • •" : formatINR(acc.balance)}
                </div>
              </div>
            ))}
        </div>

        {/* Two column: transactions + quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, alignItems: "start" }}>
          {/* Recent transactions */}
          <div style={panelStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={sectionTitleStyle}>Recent transactions</h2>
              <a href="/transactions" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#0f172a", textDecoration: "none" }}>
                View all
              </a>
            </div>

            {loading ? (
              [1, 2, 3].map(i => <div key={i} style={{ ...skeletonCardStyle, height: 56, marginBottom: 8 }} />)
            ) : displayTxns.length === 0 ? (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#94a3b8", padding: "20px 0", textAlign: "center" }}>
                No transactions yet — make your first transfer to see it here.
              </p>
            ) : (
              displayTxns.map((t, i) => (
                <div
                  key={t.id || i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "13px 0",
                    borderBottom: i < displayTxns.length - 1 ? "1px solid #f1f5f9" : "none",
                  }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: t.flagged ? "#fef2f2" : (t.type === "deposit" ? "#f0fdf4" : "#f1f5f9"),
                    color: t.flagged ? "#dc2626" : (t.type === "deposit" ? "#16a34a" : "#475569"),
                  }}>
                    {t.flagged ? icons.alert : (t.type === "deposit" ? icons.down : icons.up)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#0f172a" }}>
                      {t.note || (t.type === "deposit" ? "Deposit received" : t.type === "withdrawal" ? "Cash withdrawal" : "Transfer sent")}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#94a3b8" }}>
                      {timeAgo(t.created_at)} {t.flagged && "· flagged for review"}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                    color: t.type === "deposit" ? "#16a34a" : "#0f172a",
                    flexShrink: 0,
                  }}>
                    {t.type === "deposit" ? "+" : "−"}{formatINR(t.amount)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick actions */}
          <div style={panelStyle}>
            <h2 style={{ ...sectionTitleStyle, marginBottom: 16 }}>Quick actions</h2>
            <a href="/transfer" style={quickActionStyle("#0f172a", "#fff")}>
              {icons.swap} Send money
            </a>
            <a href="/accounts" style={quickActionStyle("#f1f5f9", "#0f172a")}>
              {icons.card} Open new account
            </a>
            <a href="/analytics" style={quickActionStyle("#f1f5f9", "#0f172a")}>
              {icons.chart} View spending insights
            </a>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
}

function quickActionStyle(bg, color) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "13px 16px",
    borderRadius: 10,
    background: bg,
    color,
    textDecoration: "none",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 10,
  };
}

const DEMO_ACCOUNTS = [
  { id: "demo-1", account_type: "savings", account_number: "SB00012345678", balance: 234500.0, is_frozen: false },
  { id: "demo-2", account_type: "current", account_number: "SB00098765432", balance: 87200.0, is_frozen: false },
];

const DEMO_TRANSACTIONS = [
  { id: "t1", type: "transfer", amount: 124500, note: "Transfer to Axis Bank ••4821", flagged: true, fraud_score: 0.92, created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
  { id: "t2", type: "deposit", amount: 50000, note: "Salary credit", flagged: false, created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: "t3", type: "withdrawal", amount: 5000, note: "ATM withdrawal", flagged: false, created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
  { id: "t4", type: "transfer", amount: 1200, note: "Transfer to Priya S.", flagged: false, created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
];

const pageStyle = {
  minHeight: "100vh",
  background: "#f8fafc",
  display: "flex",
  fontFamily: "'DM Sans', sans-serif",
};

const sidebarStyle = {
  width: 230,
  background: "#fff",
  borderRight: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  position: "sticky",
  top: 0,
  height: "100vh",
  flexShrink: 0,
};

const mainStyle = {
  flex: 1,
  padding: "32px 40px",
  maxWidth: 1100,
  minWidth: 0,
};

const sectionTitleStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 15,
  fontWeight: 600,
  color: "#0f172a",
  margin: 0,
};

const accountCardStyle = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: "20px 22px",
  minHeight: 140,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const skeletonCardStyle = {
  background: "linear-gradient(90deg, #f1f5f9 25%, #f8fafc 37%, #f1f5f9 63%)",
  backgroundSize: "400% 100%",
  animation: "shimmer 1.4s ease infinite",
  borderRadius: 16,
  minHeight: 140,
};

const panelStyle = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: "22px 24px",
};

const iconBtnStyle = {
  width: 40,
  height: 40,
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#fff",
  color: "#475569",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const ghostBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: "none",
  border: "none",
  color: "#64748b",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  padding: "4px 6px",
};