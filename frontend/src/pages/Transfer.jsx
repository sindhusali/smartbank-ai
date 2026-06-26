import { useState, useEffect } from "react";

const API = "process.env.REACT_APP_API_URL || "http://localhost:5000/api"";

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
  arrowDown: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>,
  alert: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  check: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  sparkle: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>,
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

// Demo fraud check — replace with a real call to your ML service / backend later.
// Flags large amounts and "new-looking" recipient account numbers as a demo heuristic.

function FraudWarningModal({ result, amount, onCancel, onProceed, loading }) {
  const pct = Math.round(result.risk_score * 100);
  return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, maxWidth: 460 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", color: "#dc2626" }}>
            {icons.alert}
          </div>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, fontWeight: 600, color: "#0f172a", textAlign: "center", margin: "0 0 6px" }}>
          High-risk transaction detected
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748b", textAlign: "center", margin: "0 0 20px" }}>
          We'd like you to confirm this transfer of {formatINR(amount)} before proceeding.
        </p>

        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#991b1b", fontWeight: 600 }}>RISK SCORE</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#dc2626", fontWeight: 700 }}>{pct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "#fecaca", overflow: "hidden", marginBottom: 12 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "#dc2626", borderRadius: 3 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ color: "#dc2626" }}>{icons.sparkle}</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 600, color: "#991b1b" }}>AI EXPLANATION</span>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#7f1d1d", lineHeight: 1.6, margin: 0 }}>
  {result.ai_explanation || `This transaction was flagged because ${result.reasons.join('; ')}.`}
</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, height: 46, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Cancel transfer
          </button>
          <button onClick={onProceed} disabled={loading} style={{ flex: 1, height: 46, borderRadius: 10, border: "none", background: loading ? "#94a3b8" : "#dc2626", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Processing…" : "Proceed anyway"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ amount, onClose }) {
  return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, maxWidth: 400, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0fdf4", border: "1.5px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", color: "#16a34a" }}>
          {icons.check}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: "#0f172a", margin: "0 0 8px" }}>
          Transfer complete
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#64748b", margin: "0 0 24px" }}>
          {formatINR(amount)} has been sent successfully.
        </p>
        <button onClick={onClose} style={{ width: "100%", height: 48, borderRadius: 10, border: "none", background: "#0f172a", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Done
        </button>
      </div>
    </div>
  );
}

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [fraudResult, setFraudResult] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/accounts`, {
  headers: {
    ...authHeader(),
    'Cache-Control': 'no-cache',
  }
});
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAccounts(data);
        if (data.length) setFromAccount(data[0].id);
      } catch {
        setAccounts(DEMO_ACCOUNTS);
        setFromAccount(DEMO_ACCOUNTS[0].id);
      } finally {
        setLoadingAccounts(false);
      }
    }
    load();
  }, []);

  const selectedAccount = accounts.find(a => a.id === fromAccount);

  function validate() {
    const errs = {};
    if (!fromAccount) errs.fromAccount = "Select an account to send from";
    if (!toAccount.trim()) errs.toAccount = "Enter a recipient account number";
    else if (toAccount.trim().length < 6) errs.toAccount = "Account number looks too short";
    const amt = Number(amount);
    if (!amount || amt <= 0) errs.amount = "Enter a valid amount";
    else if (selectedAccount && amt > Number(selectedAccount.balance)) errs.amount = "Amount exceeds available balance";
    return errs;
  }

 async function executeTransfer() {
  setSubmitting(true);
  setServerError("");
  try {
    const res = await fetch(`${API}/transactions/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({
        from_account_id: fromAccount,
        to_account_number: toAccount,
        amount: Number(amount),
        note,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Transfer failed");
    }

    // If backend flagged it, show the fraud warning modal
  if (data.flagged) {
  setFraudResult({
    risk_score: data.risk_score,
    flagged: true,
    reasons: data.reasons,
    ai_explanation: data.ai_explanation,
  });
  setSubmitting(false);
  return;
}
    setFraudResult(null);
    setShowSuccess(true);
  } catch (err) {
    setServerError(err.message);
  } finally {
    setSubmitting(false);
  }
}

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

   
      executeTransfer();
    
  }

  function resetForm() {
    setToAccount("");
    setAmount("");
    setNote("");
    setShowSuccess(false);
  }

  return (
    <div style={pageStyle}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />

      <Sidebar active="transfer" />

      <main style={mainStyle}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: "#0f172a", margin: 0 }}>
            Send money
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>
            Transfers are screened automatically for unusual activity
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
          <form onSubmit={handleSubmit} style={panelStyle}>
            <label style={labelStyle}>From account</label>
            <select
              value={fromAccount}
              onChange={e => setFromAccount(e.target.value)}
              disabled={loadingAccounts}
              style={selectStyle(errors.fromAccount)}
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.account_type === "savings" ? "Savings" : "Current"} •••• {String(acc.account_number).slice(-4)} — {formatINR(acc.balance)}
                </option>
              ))}
            </select>
            {errors.fromAccount && <p style={errorTextStyle}>{errors.fromAccount}</p>}

            <div style={{ display: "flex", justifyContent: "center", margin: "18px 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                {icons.arrowDown}
              </div>
            </div>

            <label style={labelStyle}>To account number</label>
            <input
              type="text"
              value={toAccount}
              onChange={e => setToAccount(e.target.value)}
              placeholder="e.g. SB00098765432"
              style={inputStyle(errors.toAccount)}
            />
            {errors.toAccount && <p style={errorTextStyle}>{errors.toAccount}</p>}

            <label style={{ ...labelStyle, marginTop: 18 }}>Amount</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#64748b" }}>₹</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                style={{ ...inputStyle(errors.amount), paddingLeft: 28 }}
              />
            </div>
            {errors.amount && <p style={errorTextStyle}>{errors.amount}</p>}
            {selectedAccount && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#94a3b8", margin: "5px 0 0" }}>
                Available balance: {formatINR(selectedAccount.balance)}
              </p>
            )}

            <label style={{ ...labelStyle, marginTop: 18 }}>Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="What's this for?"
              style={inputStyle()}
            />

            {serverError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginTop: 18, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#dc2626" }}>
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || loadingAccounts}
              style={{ width: "100%", height: 50, marginTop: 24, borderRadius: 10, border: "none", background: submitting ? "#94a3b8" : "#0f172a", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer" }}
            >
              {submitting ? "Processing…" : "Review & send"}
            </button>
          </form>

          <div style={{ ...panelStyle, background: "#f8fafc", border: "1px dashed #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ color: "#0f172a" }}>{icons.sparkle}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>How fraud screening works</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
              Every transfer is scored in real time based on amount, recipient history, and recent activity. Transfers scoring above 70% risk are paused for your confirmation, with a plain-English explanation of why.
            </p>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                Try sending ₹60,000+ to see the fraud check in action.
              </p>
            </div>
          </div>
        </div>
      </main>

      {fraudResult && (
        <FraudWarningModal
          result={fraudResult}
          amount={amount}
          loading={submitting}
          onCancel={() => setFraudResult(null)}
          onProceed={executeTransfer}
        />
      )}

      {showSuccess && <SuccessModal amount={amount} onClose={resetForm} />}
    </div>
  );
}

const DEMO_ACCOUNTS = [
  { id: "demo-1", account_type: "savings", account_number: "SB00012345678", balance: 234500.0 },
  { id: "demo-2", account_type: "current", account_number: "SB00098765432", balance: 87200.0 },
];

const labelStyle = { display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b", marginBottom: 7 };
const errorTextStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#dc2626", margin: "5px 0 0" };

function inputStyle(error) {
  return {
    width: "100%", height: 48, padding: "0 14px", fontSize: 15, fontFamily: "'DM Sans', sans-serif",
    background: error ? "#fff5f5" : "#f8fafc", border: `1.5px solid ${error ? "#fca5a5" : "#e2e8f0"}`,
    borderRadius: 10, outline: "none", color: "#0f172a", boxSizing: "border-box",
  };
}
function selectStyle(error) {
  return { ...inputStyle(error), cursor: "pointer" };
}

const pageStyle = { minHeight: "100vh", background: "#f8fafc", display: "flex", fontFamily: "'DM Sans', sans-serif" };
const sidebarStyle = { width: 230, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 };
const mainStyle = { flex: 1, padding: "32px 40px", maxWidth: 1000, minWidth: 0 };
const panelStyle = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "26px 28px" };
const overlayStyle = { position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 };
const modalStyle = { background: "#fff", borderRadius: 18, padding: "28px 28px 24px", width: "100%", maxWidth: 440 };