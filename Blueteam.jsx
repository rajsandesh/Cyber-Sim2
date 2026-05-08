// src/screens/BlueTeam.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Blue Team "Defense Hub"
// Key features:
//   • Recharts RadialBarChart half-donut as "System Integrity" gauge
//   • Breathing urgency badges on live threats
//   • Defense toggle panel with "Shield Deployed" toast notification
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";
import { Sidebar, GlassCard, GlowButton, StatusBadge, BreathingDot } from "./index";
import { COLORS, fadeUp } from "./theme";

// ── Defense tool list ─────────────────────────────────────────────────────────
const TOOLS = [
  { id: "firewall",  label: "Firewall",            icon: "🔥", color: COLORS.cyan   },
  { id: "ids",       label: "IDS / IPS",           icon: "👁", color: COLORS.amber  },
  { id: "malware",   label: "Anti-Malware",        icon: "🦠", color: COLORS.emerald},
  { id: "endpoint",  label: "Endpoint Protection", icon: "🔒", color: COLORS.indigo },
];

// ── Live threats feed ─────────────────────────────────────────────────────────
const THREATS = [
  { id: 1, msg: "DDoS surge on port 443",                level: "high",   src: "185.23.0.14"   },
  { id: 2, msg: "SQL injection in /api/login",           level: "high",   src: "10.0.0.99"     },
  { id: 3, msg: "Unusual outbound traffic spike",        level: "medium", src: "172.16.4.55"   },
  { id: 4, msg: "Malware signature in memory (Cobalt)", level: "high",   src: "Internal"      },
  { id: 5, msg: "Failed SSH auth × 240 attempts",       level: "medium", src: "45.77.204.100" },
];

// ── Half-donut gauge data ─────────────────────────────────────────────────────
function IntegrityGauge({ score }) {
  const data = [
    { value: score,       fill: COLORS.emerald },
    { value: 100 - score, fill: "rgba(255,255,255,0.05)" },
  ];
  return (
    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width={180} height={100}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="100%"
            startAngle={180} endAngle={0}
            innerRadius={55} outerRadius={80}
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 text-center">
        <div className="text-3xl font-extrabold" style={{ color: COLORS.emerald }}>{score}%</div>
        <div className="text-slate-500 text-xs">Integrity</div>
      </div>
    </div>
  );
}

// ── Toast Notification ────────────────────────────────────────────────────────
function Toast({ message, color, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
      style={{ background: `${color}22`, border: `1px solid ${color}55`, color }}
    >
      ✓ {message}
    </motion.div>
  );
}

export default function BlueTeam({ onNav }) {
  const [defenses, setDefenses] = useState({ firewall: true, ids: false, malware: true, endpoint: false });
  const [toast, setToast]       = useState(null);

  const activeCount = Object.values(defenses).filter(Boolean).length;
  const score       = Math.round(25 * activeCount);   // 0–100

  const toggle = (id) => {
    const next = !defenses[id];
    setDefenses((d) => ({ ...d, [id]: next }));
    const tool = TOOLS.find((t) => t.id === id);
    setToast({
      msg:   next ? `${tool.label} — Shield Deployed ✓` : `${tool.label} — Deactivated`,
      color: next ? COLORS.emerald : COLORS.rose,
    });
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F1A]">
      <Sidebar active="blueTeam" onNav={onNav} />

      <main className="flex-1 p-8 overflow-auto relative">
        {/* Toast */}
        <AnimatePresence>
          {toast && <Toast key={toast.msg} message={toast.msg} color={toast.color} onDone={() => setToast(null)} />}
        </AnimatePresence>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <span style={{ color: COLORS.cyan }}>⬡</span> Blue Team Defense Hub
          </h1>
          <p className="text-slate-500 text-sm mt-1">Monitor threats and activate your defensive measures</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-5">
          {/* ── Column 1: Integrity + Toggle Panel ── */}
          <div className="flex flex-col gap-5">
            {/* Gauge */}
            <GlassCard className="p-6 flex flex-col items-center" glowColor={COLORS.emerald}>
              <h2 className="text-white font-semibold mb-4 self-start">System Integrity</h2>
              <IntegrityGauge score={score} />
              <p className="text-slate-500 text-xs mt-3 text-center">
                {activeCount} of {TOOLS.length} defenses active
              </p>
            </GlassCard>

            {/* Toggle Panel */}
            <GlassCard className="p-5">
              <h2 className="text-white font-semibold mb-4">Defense Toggles</h2>
              <div className="space-y-3">
                {TOOLS.map((t) => (
                  <div key={t.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{t.icon}</span>
                      <span className="text-slate-300 text-sm">{t.label}</span>
                    </div>
                    {/* Toggle switch */}
                    <button
                      onClick={() => toggle(t.id)}
                      className="w-12 h-6 rounded-full relative transition-colors duration-300"
                      style={{
                        background: defenses[t.id] ? `${t.color}80` : "rgba(255,255,255,0.1)",
                        border: `1px solid ${defenses[t.id] ? t.color : "rgba(255,255,255,0.15)"}`,
                      }}
                    >
                      <motion.span
                        layout
                        className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
                        animate={{ left: defenses[t.id] ? "calc(100% - 1.375rem)" : "0.125rem" }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* ── Column 2+3: Active Threats Feed ── */}
          <div className="col-span-2">
            <GlassCard className="p-6 h-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-semibold">Active Threat Feed</h2>
                <span className="flex items-center gap-2 text-xs text-slate-400">
                  <BreathingDot color={COLORS.rose} /> Live
                </span>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {THREATS.map((th, i) => (
                    <motion.div
                      key={th.id}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="flex items-center justify-between p-4 rounded-xl"
                      style={{
                        background: th.level === "high"
                          ? "rgba(244,63,94,0.07)"
                          : "rgba(245,158,11,0.07)",
                        border: `1px solid ${th.level === "high" ? COLORS.rose : COLORS.amber}30`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {/* Breathing urgency indicator */}
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{
                            background: th.level === "high" ? COLORS.rose : COLORS.amber,
                            animation: "breathe 1.8s ease-in-out infinite",
                            boxShadow: `0 0 8px ${th.level === "high" ? COLORS.rose : COLORS.amber}`,
                          }}
                        />
                        <div>
                          <p className="text-slate-200 text-sm">{th.msg}</p>
                          <p className="text-slate-500 text-xs mt-0.5">Source: {th.src}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge level={th.level} label={th.level.toUpperCase()} />
                        <GlowButton
                          color={COLORS.emerald}
                          className="text-xs px-3 py-1.5"
                          onClick={() => setToast({ msg: "Threat neutralised", color: COLORS.emerald })}
                        >
                          Block
                        </GlowButton>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Score summary */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Threats Blocked",  val: "14", color: COLORS.emerald },
                  { label: "Under Analysis",   val: "3",  color: COLORS.amber   },
                  { label: "Critical Alerts",  val: "2",  color: COLORS.rose    },
                ].map((m) => (
                  <div key={m.label} className="text-center p-3 rounded-xl"
                    style={{ background: `${m.color}10`, border: `1px solid ${m.color}25` }}>
                    <div className="text-2xl font-extrabold" style={{ color: m.color }}>{m.val}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}