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
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  alert: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  up: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 7l-9 9M17 7H8M17 7v9"/></svg>,
  deposit: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 19V5M5 12l7 7 7-7"/></svg>,
  chevron: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  sparkle: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>,
  bank: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 22V9L12 2l9 7v13"/><path d="M9 22V12h6v10"/></svg>,
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

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
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

function TypeIcon({ type, flagged }) {
  const cfg = flagged
    ? { bg: "#fef2f2", color: "#dc2626", icon: "alert" }
    : type === "deposit"
    ? { bg: "#f0fdf4", color: "#16a34a", icon: "deposit" }
    : type === "withdrawal"
    ? { bg: "#fef9f0", color: "#d97706", icon: "up" }
    : { bg: "#f1f5f9", color: "#475569", icon: "up" };
  return (
    <div style={{ width: 38, height: 38, borderRadius: 10, background: cfg.bg, color: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {icons[cfg.icon]}
    </div>
  );
}

// Mask account number like PhonePe: SB65751367786614 → SB ••• 6614
function maskAccount(num) {
  if (!num) return "";
  return num.slice(0, 2) + " ••• " + num.slice(-4);
}

function TransactionRow({ txn, expanded, onToggle, currentUserAccounts }) {
  const isCredit = txn.type === "deposit" ||
    (txn.type === "transfer" && currentUserAccounts.includes(txn.receiver_account_number));
  const pct = txn.fraud_score ? Math.round(Number(txn.fraud_score) * 100) : 0;

  // Build the "To / From" line like PhonePe
  function getPartyLine() {
    if (txn.type === "deposit") {
      if (txn.sender_name && txn.sender_account_number) {
        return { label: "From", name: txn.sender_name, account: txn.sender_account_number };
      }
      return { label: "From", name: "Bank credit", account: null };
    }
    if (txn.type === "transfer") {
      if (isCredit) {
        return { label: "From", name: txn.sender_name || "SmartBank", account: txn.sender_account_number };
      }
      return { label: "To", name: txn.receiver_name || "Account holder", account: txn.receiver_account_number };
    }
    if (txn.type === "withdrawal") {
      return { label: "From", name: "Self", account: txn.sender_account_number };
    }
    return null;
  }

  const party = getPartyLine();

  return (
    <>
      <tr
        onClick={txn.flagged ? onToggle : undefined}
        style={{
          borderBottom: expanded ? "none" : "1px solid #f1f5f9",
          cursor: txn.flagged ? "pointer" : "default",
          background: expanded ? "#fffafa" : "transparent",
          transition: "background 0.15s",
        }}
      >
        <td style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <TypeIcon type={txn.type} flagged={txn.flagged} />
            <div>
              {/* Title */}
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#0f172a" }}>
                {txn.note || (txn.type === "deposit" ? "Deposit received" : txn.type === "withdrawal" ? "Cash withdrawal" : isCredit ? "Transfer received" : "Transfer sent")}
              </div>

              {/* Party line — like PhonePe "To: Rahul · SB ••• 6614" */}
              {party && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                    {party.label}:
                  </span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#475569" }}>
                    {party.name}
                  </span>
                  {party.account && (
                    <>
                      <span style={{ color: "#cbd5e1", fontSize: 10 }}>·</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94a3b8", letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: 3 }}>
                        {icons.bank} {maskAccount(party.account)}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Timestamp */}
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94a3b8", marginTop: 3 }}>
                {formatDate(txn.created_at)}
              </div>
            </div>
          </div>
        </td>

        <td style={{ padding: "14px 8px", textAlign: "center" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99,
            fontFamily: "'DM Sans', sans-serif",
            background: txn.type === "deposit" ? "#f0fdf4" : txn.type === "withdrawal" ? "#fef9f0" : "#f1f5f9",
            color: txn.type === "deposit" ? "#16a34a" : txn.type === "withdrawal" ? "#d97706" : "#475569",
            textTransform: "capitalize",
          }}>
            {txn.type}
          </span>
        </td>

        <td style={{ padding: "14px 8px", textAlign: "center" }}>
          {txn.flagged ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: "#fef2f2", color: "#dc2626", fontFamily: "'DM Sans', sans-serif" }}>
              {icons.alert} Flagged {pct}%
            </span>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: "#f0fdf4", color: "#16a34a", fontFamily: "'DM Sans', sans-serif" }}>
              ✓ Safe
            </span>
          )}
        </td>

        <td style={{ padding: "14px 16px", textAlign: "right" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: isCredit ? "#16a34a" : "#0f172a" }}>
            {isCredit ? "+" : "−"}{formatINR(txn.amount)}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94a3b8", marginTop: 2, textTransform: "capitalize" }}>
            {txn.status}
          </div>
        </td>

        {txn.flagged && (
          <td style={{ padding: "14px 12px", textAlign: "center" }}>
            <span style={{ color: "#94a3b8", transition: "transform 0.2s", display: "inline-block", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
              {icons.chevron}
            </span>
          </td>
        )}
        {!txn.flagged && <td style={{ padding: "14px 12px" }} />}
      </tr>

      {/* Expandable AI explanation row */}
      {expanded && txn.flagged && (
        <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#fffafa" }}>
          <td colSpan={5} style={{ padding: "0 16px 16px 68px" }}>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ color: "#dc2626" }}>{icons.sparkle}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#991b1b", letterSpacing: "0.06em" }}>AI EXPLANATION</span>
                <span style={{ marginLeft: "auto", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#dc2626" }}>Risk: {pct}%</span>
              </div>
              <div style={{ height: 4, background: "#fecaca", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "#dc2626", borderRadius: 2 }} />
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#7f1d1d", lineHeight: 1.6, margin: "0 0 10px" }}>
                This transaction was flagged with a {pct}% risk score because it matched high-risk patterns in our fraud detection model.
                {party && party.account && ` The ${party.label === "To" ? "recipient" : "sender"} account ${maskAccount(party.account)} triggered our screening rules.`}
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {pct >= 80 && <span style={reasonTag}>Unusually large amount</span>}
                {pct >= 65 && <span style={reasonTag}>Exceeds ₹1,00,000</span>}
                {pct >= 60 && <span style={reasonTag}>New recipient</span>}
                {pct >= 75 && <span style={reasonTag}>High transfer frequency</span>}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [txnRes, accRes] = await Promise.all([
          fetch(`${API}/transactions?limit=50`, { headers: authHeader() }),
          fetch(`${API}/accounts`, { headers: authHeader() }),
        ]);
        const txnData = txnRes.ok ? await txnRes.json() : [];
        const accData = accRes.ok ? await accRes.json() : [];
        setTransactions(txnData.length ? txnData : DEMO_TRANSACTIONS);
        setAccounts(accData);
        if (!txnData.length) setError("No transactions found. Showing demo data.");
      } catch {
        setTransactions(DEMO_TRANSACTIONS);
        setError("Could not reach the server. Showing demo data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // List of account numbers belonging to the current user — used to determine credit vs debit
  const myAccountNumbers = accounts.map(a => a.account_number);

  const filtered = transactions.filter(t => {
    const matchSearch = !search ||
      (t.note || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.receiver_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.sender_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.receiver_account_number || "").includes(search) ||
      (t.sender_account_number || "").includes(search) ||
      t.type.toLowerCase().includes(search.toLowerCase()) ||
      formatINR(t.amount).includes(search);
    const matchType = typeFilter === "all" || t.type === typeFilter;
    const matchStatus = statusFilter === "all" ||
      (statusFilter === "flagged" && t.flagged) ||
      (statusFilter === "safe" && !t.flagged);
    return matchSearch && matchType && matchStatus;
  });

  const totalIn = transactions
    .filter(t => t.type === "deposit" || (t.type === "transfer" && myAccountNumbers.includes(t.receiver_account_number)))
    .reduce((s, t) => s + Number(t.amount), 0);
  const totalOut = transactions
    .filter(t => t.type !== "deposit" && !(t.type === "transfer" && myAccountNumbers.includes(t.receiver_account_number)))
    .reduce((s, t) => s + Number(t.amount), 0);
  const flaggedCount = transactions.filter(t => t.flagged).length;

  return (
    <div style={pageStyle}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />
      <Sidebar active="transactions" />

      <main style={mainStyle}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: "#0f172a", margin: 0 }}>
            Transactions
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>
            {transactions.length} total · click any flagged row to see the AI explanation
          </p>
        </div>

        {error && (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#b45309" }}>
            {error}
          </div>
        )}

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
          <div style={summaryCard}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Total in</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: "#16a34a" }}>{formatINR(totalIn)}</div>
          </div>
          <div style={summaryCard}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Total out</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: "#0f172a" }}>{formatINR(totalOut)}</div>
          </div>
          <div style={summaryCard}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Flagged</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: flaggedCount > 0 ? "#dc2626" : "#0f172a" }}>{flaggedCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>{icons.search}</span>
            <input
              type="text"
              placeholder="Search by name, account number, or amount…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", height: 40, paddingLeft: 36, paddingRight: 14, fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, outline: "none", boxSizing: "border-box", color: "#0f172a" }}
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={filterSelect}>
            <option value="all">All types</option>
            <option value="deposit">Deposits</option>
            <option value="transfer">Transfers</option>
            <option value="withdrawal">Withdrawals</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={filterSelect}>
            <option value="all">All status</option>
            <option value="flagged">Flagged only</option>
            <option value="safe">Safe only</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                <th style={thStyle}>Transaction</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Type</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Risk</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Amount</th>
                <th style={{ ...thStyle, width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <tr key={i}>
                    <td colSpan={5} style={{ padding: "14px 16px" }}>
                      <div style={{ height: 48, background: "linear-gradient(90deg,#f1f5f9 25%,#f8fafc 37%,#f1f5f9 63%)", backgroundSize: "400% 100%", animation: "shimmer 1.4s ease infinite", borderRadius: 8 }} />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "40px 16px", textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#94a3b8" }}>
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map(txn => (
                  <TransactionRow
                    key={txn.id}
                    txn={txn}
                    expanded={expandedId === txn.id}
                    onToggle={() => setExpandedId(expandedId === txn.id ? null : txn.id)}
                    currentUserAccounts={myAccountNumbers}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#94a3b8", marginTop: 12, textAlign: "right" }}>
          Showing {filtered.length} of {transactions.length} transactions
        </p>
      </main>

      <style>{`@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }`}</style>
    </div>
  );
}

const DEMO_TRANSACTIONS = [
  { id: "t1", type: "transfer", amount: 124500, note: "Big transfer test", flagged: true, fraud_score: 0.92, status: "completed", sender_name: "You", sender_account_number: "SB73835591141657", receiver_name: "Test User", receiver_account_number: "SB65751367786614", created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
  { id: "t2", type: "deposit", amount: 500000, note: "Salary credit", flagged: false, fraud_score: 0.02, status: "completed", sender_name: null, sender_account_number: null, receiver_name: "You", receiver_account_number: "SB73835591141657", created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: "t3", type: "transfer", amount: 5000, note: "Test transfer", flagged: false, fraud_score: 0.08, status: "completed", sender_name: "You", sender_account_number: "SB73835591141657", receiver_name: "You", receiver_account_number: "SB32931489493143", created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
  { id: "t4", type: "transfer", amount: 110000, note: "Flag test", flagged: true, fraud_score: 0.65, status: "completed", sender_name: "You", sender_account_number: "SB73835591141657", receiver_name: "Test User", receiver_account_number: "SB65751367786614", created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
];

const reasonTag = { fontSize: 11, fontWeight: 500, color: "#991b1b", background: "#fee2e2", padding: "3px 9px", borderRadius: 99, fontFamily: "'DM Sans', sans-serif" };
const pageStyle = { minHeight: "100vh", background: "#f8fafc", display: "flex", fontFamily: "'DM Sans', sans-serif" };
const sidebarStyle = { width: 230, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 };
const mainStyle = { flex: 1, padding: "32px 40px", maxWidth: 1100, minWidth: 0 };
const summaryCard = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 20px" };
const thStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px", textAlign: "left" };
const filterSelect = { height: 40, padding: "0 12px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, outline: "none", color: "#475569", cursor: "pointer" };