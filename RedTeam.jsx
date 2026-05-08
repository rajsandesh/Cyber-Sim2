// src/screens/RedTeam.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Red Team "Command Center"
// Key features:
//   • 3×2 glass attack-module grid with Lucide-style icons
//   • Mocked WebSocket feed → terminal window (Courier, rose text)
//   • Recharts AreaChart showing live success-rate trend with glow stroke
// Install: npm install recharts lucide-react
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Sidebar, GlassCard, GlowButton, StatusBadge, ScanlineOverlay } from "./index";
import { COLORS, fadeUp, scaleIn } from "./theme";

// ── Attack modules ────────────────────────────────────────────────────────────
const ATTACKS = [
  { id: "phishing",  icon: "🎣", label: "Phishing",     color: COLORS.amber   },
  { id: "malware",   icon: "🦠", label: "Malware",      color: COLORS.rose    },
  { id: "ddos",      icon: "💥", label: "DDoS",         color: COLORS.purple  },
  { id: "sqli",      icon: "💉", label: "SQL Injection", color: COLORS.cyan    },
  { id: "xss",       icon: "📜", label: "XSS",          color: COLORS.emerald },
  { id: "brute",     icon: "🔓", label: "Brute Force",  color: COLORS.indigo  },
];

// ── Mock WebSocket log lines ──────────────────────────────────────────────────
const LOG_TEMPLATES = (attack) => [
  `[INIT]    Module "${attack}" loaded`,
  `[SCAN]    Probing target 192.168.1.0/24...`,
  `[PROBE]   Open ports detected: 22, 80, 443, 3306`,
  `[EXEC]    Injecting payload...`,
  `[STATUS]  Response: 200 OK — probing deeper`,
  `[HIT]     Vulnerability found in /api/auth endpoint`,
  `[EXFIL]   Attempting data extraction...`,
  `[SUCCESS] Payload delivered — awaiting callback`,
];

// ── Custom Recharts Tooltip ───────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0B0F1A] border border-white/10 rounded-xl px-4 py-2.5 text-xs backdrop-blur-md">
      <p className="text-slate-400 mb-1">{label}</p>
      <p style={{ color: COLORS.rose }} className="font-bold">{payload[0].value}% success</p>
    </div>
  );
}

// ── Seed chart data ───────────────────────────────────────────────────────────
function genChartData() {
  return Array.from({ length: 15 }, (_, i) => ({
    t: `T-${14 - i}`,
    v: Math.floor(20 + Math.random() * 65),
  }));
}

export default function RedTeam({ onNav }) {
  const [active, setActive]       = useState(null);
  const [logs, setLogs]           = useState(["[SYS]   Command console initialised", "[SYS]   Awaiting attack vector..."]);
  const [chartData, setChartData] = useState(genChartData());
  const [launching, setLaunching] = useState(false);
  const logRef = useRef(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  // Mock WS: add new line every 2 s when an attack is running
  useEffect(() => {
    if (!launching) return;
    let idx = 0;
    const lines = LOG_TEMPLATES(active);
    const interval = setInterval(() => {
      if (idx >= lines.length) { clearInterval(interval); setLaunching(false); return; }
      setLogs((l) => [...l.slice(-20), lines[idx++]]);
      // Update chart
      setChartData((d) => [
        ...d.slice(1),
        { t: "Live", v: Math.floor(30 + Math.random() * 60) },
      ]);
    }, 900);
    return () => clearInterval(interval);
  }, [launching]);

  const launch = () => {
    if (!active || launching) return;
    setLaunching(true);
    setLogs((l) => [...l, `[USER]  Launching "${active}" attack...`]);
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F1A]">
      <Sidebar active="redTeam" onNav={onNav} />

      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <span style={{ color: COLORS.rose }}>⚔</span> Red Team Command Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">Select an attack vector and launch a simulated strike</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-5">
          {/* ── Attack Module Grid ── */}
          <div className="col-span-2">
            <GlassCard className="p-6">
              <ScanlineOverlay />
              <h2 className="text-white font-semibold mb-4">Attack Vectors</h2>
              <div className="grid grid-cols-3 gap-3">
                {ATTACKS.map((a, i) => (
                  <motion.button
                    key={a.id}
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    onClick={() => setActive(a.id === active ? null : a.id)}
                    className="relative p-5 rounded-xl text-center transition-all"
                    style={{
                      background: active === a.id ? `${a.color}18` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${active === a.id ? a.color : "rgba(255,255,255,0.08)"}`,
                    }}
                    whileHover={{ scale: 1.04, boxShadow: `0 0 18px ${a.color}44` }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className={`text-3xl mb-2 ${active === a.id ? "animate-bounce" : ""}`}>
                      {a.icon}
                    </div>
                    <div className="text-xs font-semibold" style={{ color: a.color }}>{a.label}</div>
                    {active === a.id && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse"
                        style={{ background: a.color }} />
                    )}
                  </motion.button>
                ))}
              </div>

              <GlowButton
                onClick={launch}
                disabled={!active || launching}
                color={COLORS.rose}
                className="mt-5 w-full py-3 text-base font-bold"
              >
                {launching ? "⟳  Attack in Progress..." : "🚀  Launch Attack"}
              </GlowButton>
            </GlassCard>
          </div>

          {/* ── Target Status ── */}
          <GlassCard className="p-6" glowColor={COLORS.rose}>
            <h2 className="text-white font-semibold mb-4">Target Status</h2>
            <div className="space-y-2">
              {[
                { name: "Web Server",   status: "online"  },
                { name: "Database",     status: launching ? "breached" : "online" },
                { name: "Auth Service", status: "online"  },
                { name: "API Gateway",  status: "online"  },
                { name: "DNS Server",   status: launching ? "probing" : "online" },
              ].map((s) => (
                <div key={s.name}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-slate-300 text-sm">{s.name}</span>
                  <StatusBadge
                    level={s.status === "breached" ? "high" : s.status === "probing" ? "medium" : "active"}
                    label={s.status}
                  />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* ── Terminal Log ── */}
        <GlassCard className="mt-5 p-5" glowColor={COLORS.rose}>
          <ScanlineOverlay />
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold font-mono text-sm">▶ Live Attack Feed</h2>
            <span className="text-xs text-slate-500 font-mono">WebSocket / MOCK</span>
          </div>
          <div
            ref={logRef}
            className="h-36 overflow-y-auto space-y-0.5 font-mono text-xs leading-relaxed"
            style={{ scrollbarWidth: "none" }}
          >
            <AnimatePresence initial={false}>
              {logs.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: line.includes("[HIT]") || line.includes("[SUCCESS]")
                      ? COLORS.rose
                      : line.includes("[USER]")
                      ? COLORS.amber
                      : COLORS.textSecondary,
                  }}
                >
                  {line}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* ── Success Rate Chart ── */}
        <GlassCard className="mt-5 p-6">
          <h2 className="text-white font-semibold mb-4">Attack Success Rate Trend</h2>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={COLORS.rose} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={COLORS.rose} stopOpacity={0}    />
                </linearGradient>
                <filter id="lineGlow">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="t" tick={{ fill: COLORS.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: COLORS.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone" dataKey="v"
                stroke={COLORS.rose} strokeWidth={2.5}
                fill="url(#roseGrad)"
                filter="url(#lineGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </main>
    </div>
  );
}