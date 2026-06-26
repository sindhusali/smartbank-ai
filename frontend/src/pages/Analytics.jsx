import { useState, useEffect, useRef } from "react";

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
  sparkle: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>,
  trend: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  alert: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
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
  return "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
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

// Draw a bar chart on a canvas element
function BarChart({ data, labels, colors }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const pad = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const max = Math.max(...data, 1);

    ctx.clearRect(0, 0, W, H);
    ctx.font = "11px 'DM Sans', sans-serif";
    ctx.fillStyle = "#94a3b8";

    // Y axis grid lines
    [0, 0.25, 0.5, 0.75, 1].forEach(frac => {
      const y = pad.top + chartH * (1 - frac);
      ctx.strokeStyle = "#f1f5f9";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      ctx.fillText(formatINR(max * frac), 2, y + 4);
    });

    // Bars
    const barW = (chartW / data.length) * 0.6;
    const gap = chartW / data.length;
    data.forEach((val, i) => {
      const x = pad.left + i * gap + (gap - barW) / 2;
      const barH = (val / max) * chartH;
      const y = pad.top + chartH - barH;
      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, colors[i % colors.length]);
      grad.addColorStop(1, colors[i % colors.length] + "99");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 4);
      ctx.fill();
      // Label
      ctx.fillStyle = "#64748b";
      ctx.textAlign = "center";
      ctx.fillText(labels[i], x + barW / 2, H - 10);
      ctx.textAlign = "left";
    });
  }, [data, labels, colors]);

  return <canvas ref={canvasRef} width={560} height={220} style={{ width: "100%", height: "auto" }} />;
}

// Draw a donut chart on a canvas element
function DonutChart({ data, labels, colors }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2, r = Math.min(W, H) / 2 - 20, inner = r * 0.58;
    const total = data.reduce((s, v) => s + v, 0);

    ctx.clearRect(0, 0, W, H);
    let start = -Math.PI / 2;
    data.forEach((val, i) => {
      const angle = (val / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      start += angle;
    });

    // Inner white circle (donut hole)
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Center text
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 13px 'DM Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Breakdown", cx, cy - 6);
    ctx.font = "11px 'DM Sans', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`${data.length} types`, cx, cy + 12);
  }, [data, labels, colors]);

  return <canvas ref={canvasRef} width={200} height={200} style={{ width: 200, height: 200 }} />;
}

// Derive analytics data from raw transactions
function deriveAnalytics(transactions) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { label: d.toLocaleString("en-IN", { month: "short" }), month: d.getMonth(), year: d.getFullYear() };
  });

  const monthlyIn = months.map(m =>
    transactions.filter(t => {
      const d = new Date(t.created_at);
      return t.type === "deposit" && d.getMonth() === m.month && d.getFullYear() === m.year;
    }).reduce((s, t) => s + Number(t.amount), 0)
  );

  const monthlyOut = months.map(m =>
    transactions.filter(t => {
      const d = new Date(t.created_at);
      return t.type !== "deposit" && d.getMonth() === m.month && d.getFullYear() === m.year;
    }).reduce((s, t) => s + Number(t.amount), 0)
  );

  const totalIn = transactions.filter(t => t.type === "deposit").reduce((s, t) => s + Number(t.amount), 0);
  const totalOut = transactions.filter(t => t.type !== "deposit").reduce((s, t) => s + Number(t.amount), 0);
  const flagged = transactions.filter(t => t.flagged).length;

  // Type breakdown
  const typeBreakdown = [
    { label: "Transfers", value: transactions.filter(t => t.type === "transfer").reduce((s, t) => s + Number(t.amount), 0) },
    { label: "Deposits", value: totalIn },
    { label: "Withdrawals", value: transactions.filter(t => t.type === "withdrawal").reduce((s, t) => s + Number(t.amount), 0) },
  ].filter(t => t.value > 0);

  return { months: months.map(m => m.label), monthlyIn, monthlyOut, totalIn, totalOut, flagged, typeBreakdown };
}

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/transactions?limit=100`, { headers: authHeader() });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setTransactions(data.length ? data : DEMO_TRANSACTIONS);
      } catch {
        setTransactions(DEMO_TRANSACTIONS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = deriveAnalytics(transactions);

  async function generateInsight() {
    setLoadingInsight(true);
    setAiInsight("");
    // Simulated AI insight — replace with real Claude API call once you have the key set up
    await new Promise(r => setTimeout(r, 1200));
    const totalTxns = transactions.length;
    const flaggedPct = stats.flagged > 0 ? Math.round((stats.flagged / totalTxns) * 100) : 0;
    const netFlow = stats.totalIn - stats.totalOut;
    setAiInsight(
      `You have made ${totalTxns} transactions with a net cash flow of ${formatINR(netFlow)}. ` +
      `${stats.flagged > 0 ? `${stats.flagged} transaction${stats.flagged > 1 ? "s were" : " was"} flagged for review (${flaggedPct}% of total). ` : "No transactions were flagged — your account activity looks normal. "}` +
      `Your total inflow was ${formatINR(stats.totalIn)} and total outflow was ${formatINR(stats.totalOut)}. ` +
      `${netFlow >= 0 ? "Your account is in a healthy positive flow." : "Your spending exceeds income this period — consider reviewing your transfer activity."}`
    );
    setLoadingInsight(false);
  }

  const CHART_COLORS = ["#0f172a", "#378ADD", "#1D9E75", "#EF9F27", "#E24B4A", "#8B5CF6"];

  return (
    <div style={pageStyle}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />
      <Sidebar active="analytics" />

      <main style={mainStyle}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: "#0f172a", margin: 0 }}>
            Analytics
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>
            Based on your last {transactions.length} transactions
          </p>
        </div>

        {/* Summary stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Total inflow", value: formatINR(stats.totalIn), color: "#16a34a" },
            { label: "Total outflow", value: formatINR(stats.totalOut), color: "#0f172a" },
            { label: "Net flow", value: formatINR(stats.totalIn - stats.totalOut), color: stats.totalIn >= stats.totalOut ? "#16a34a" : "#dc2626" },
            { label: "Flagged transactions", value: stats.flagged, color: stats.flagged > 0 ? "#dc2626" : "#16a34a" },
          ].map(s => (
            <div key={s.label} style={statCard}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* AI Insight panel */}
        <div style={{ background: "#f8fafc", border: "1px dashed #e2e8f0", borderRadius: 14, padding: "18px 20px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: aiInsight ? 12 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#0f172a" }}>{icons.sparkle}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>AI spending insight</span>
            </div>
            <button
              onClick={generateInsight}
              disabled={loadingInsight}
              style={{ background: loadingInsight ? "#94a3b8" : "#0f172a", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, cursor: loadingInsight ? "not-allowed" : "pointer" }}
            >
              {loadingInsight ? "Analysing…" : "Analyse my spending"}
            </button>
          </div>
          {aiInsight && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0 }}>
              {aiInsight}
            </p>
          )}
          {!aiInsight && !loadingInsight && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#94a3b8", margin: "8px 0 0", lineHeight: 1.6 }}>
              Click the button to get a plain-English summary of your spending patterns, flagged activity, and cash flow health.
            </p>
          )}
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[1, 2].map(i => <div key={i} style={{ background: "linear-gradient(90deg,#f1f5f9 25%,#f8fafc 37%,#f1f5f9 63%)", backgroundSize: "400% 100%", animation: "shimmer 1.4s ease infinite", borderRadius: 16, height: 280 }} />)}
          </div>
        ) : (
          <>
            {/* Income vs Expense bar chart */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div style={panelStyle}>
                <h3 style={panelTitle}>Monthly inflow</h3>
                <p style={panelSub}>Last 6 months</p>
                <BarChart
                  data={stats.monthlyIn}
                  labels={stats.months}
                  colors={["#1D9E75"]}
                />
              </div>
              <div style={panelStyle}>
                <h3 style={panelTitle}>Monthly outflow</h3>
                <p style={panelSub}>Last 6 months</p>
                <BarChart
                  data={stats.monthlyOut}
                  labels={stats.months}
                  colors={["#0f172a"]}
                />
              </div>
            </div>

            {/* Transaction type donut + breakdown list */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ ...panelStyle, display: "flex", gap: 24, alignItems: "center" }}>
                <DonutChart
                  data={stats.typeBreakdown.map(t => t.value)}
                  labels={stats.typeBreakdown.map(t => t.label)}
                  colors={CHART_COLORS}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ ...panelTitle, marginBottom: 14 }}>By type</h3>
                  {stats.typeBreakdown.map((t, i) => {
                    const total = stats.typeBreakdown.reduce((s, x) => s + x.value, 0);
                    const pct = total > 0 ? Math.round((t.value / total) * 100) : 0;
                    return (
                      <div key={t.label} style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: CHART_COLORS[i], display: "inline-block" }} />
                            {t.label}
                          </span>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{pct}%</span>
                        </div>
                        <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: CHART_COLORS[i], borderRadius: 2 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fraud stats */}
              <div style={panelStyle}>
                <h3 style={panelTitle}>Fraud activity</h3>
                <p style={panelSub}>All time</p>
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1, background: "#fef2f2", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#991b1b", fontWeight: 600, marginBottom: 4 }}>FLAGGED</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: "#dc2626" }}>{stats.flagged}</div>
                  </div>
                  <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#166534", fontWeight: 600, marginBottom: 4 }}>SAFE</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: "#16a34a" }}>{transactions.length - stats.flagged}</div>
                  </div>
                </div>
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#64748b" }}>Fraud rate</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#0f172a" }}>
                      {transactions.length > 0 ? Math.round((stats.flagged / transactions.length) * 100) : 0}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${transactions.length > 0 ? (stats.flagged / transactions.length) * 100 : 0}%`, background: "#dc2626", borderRadius: 3 }} />
                  </div>
                  {stats.flagged > 0 && (
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#dc2626", margin: "10px 0 0", display: "flex", alignItems: "center", gap: 5 }}>
                      {icons.alert} {stats.flagged} transaction{stats.flagged > 1 ? "s need" : " needs"} your review
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <style>{`@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }`}</style>
    </div>
  );
}

const DEMO_TRANSACTIONS = [
  { id: "t1", type: "transfer", amount: 124500, flagged: true, fraud_score: 0.92, status: "completed", created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
  { id: "t2", type: "deposit", amount: 50000, flagged: false, fraud_score: 0.02, status: "completed", created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: "t3", type: "withdrawal", amount: 5000, flagged: false, fraud_score: 0.05, status: "completed", created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
  { id: "t4", type: "transfer", amount: 1200, flagged: false, fraud_score: 0.08, status: "completed", created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: "t5", type: "deposit", amount: 100000, flagged: false, fraud_score: 0.03, status: "completed", created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
];

const pageStyle = { minHeight: "100vh", background: "#f8fafc", display: "flex", fontFamily: "'DM Sans', sans-serif" };
const sidebarStyle = { width: 230, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 };
const mainStyle = { flex: 1, padding: "32px 40px", maxWidth: 1100, minWidth: 0 };
const statCard = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 20px" };
const panelStyle = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px" };
const panelTitle = { fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 2px" };
const panelSub = { fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#94a3b8", margin: "0 0 16px" };