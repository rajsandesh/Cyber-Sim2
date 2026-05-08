// src/screens/Simulation.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Live "Battlefield" split-view monitor.
// Key features:
//   • Framer Motion AnimatePresence for log entries "popping" in
//   • Left: scrolling JSON-like attack payloads (Rose)
//   • Right: firewall block logs (Cyan)
//   • Center vertical "VS" pulse divider
//   • Top "Network Health" bar that drops as attacks increase
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar, GlassCard, GlowButton, BreathingDot } from "./index";
import { COLORS, fadeUp } from "./theme";

// ── Mock event generators ─────────────────────────────────────────────────────
let attackIdx = 0;
const ATTACK_PAYLOADS = [
  `{ "type": "PHISHING",   "target": "/api/login",      "payload": "evil@corp.io" }`,
  `{ "type": "SQLI",       "target": "/api/search",     "payload": "' OR 1=1 --"  }`,
  `{ "type": "XSS",        "target": "/profile",        "payload": "<script>alert(1)</script>" }`,
  `{ "type": "DDOS",       "target": "192.168.1.1:443", "pps": 84000               }`,
  `{ "type": "BRUTE",      "target": "ssh:22",          "attempts": 240            }`,
  `{ "type": "MALWARE",    "target": "endpoint-04",     "hash": "3a9f2d..."        }`,
  `{ "type": "EXFIL",      "target": "db-server",       "bytes": 10240             }`,
];

let defIdx = 0;
const DEFENSE_LOGS = [
  "[FW]   DROP  tcp 185.23.0.14:44312 → :443  (DDoS threshold)",
  "[IDS]  ALERT SQL injection pattern matched in request body",
  "[WAF]  BLOCK XSS vector sanitised — request rejected",
  "[FW]   DROP  icmp flood from 10.0.0.99 — rate limited",
  "[AV]   QUARANTINE Cobalt-Strike beacon in memory heap",
  "[IDS]  ALERT Brute force on SSH — account locked",
  "[DLP]  BLOCK Outbound data transfer exceeds policy (10 KB)",
];

function nextAttack() { return ATTACK_PAYLOADS[attackIdx++ % ATTACK_PAYLOADS.length]; }
function nextDefense() { return DEFENSE_LOGS[defIdx++ % DEFENSE_LOGS.length]; }

// ── Network Health Bar ────────────────────────────────────────────────────────
function HealthBar({ health }) {
  const color = health > 60 ? COLORS.emerald : health > 30 ? COLORS.amber : COLORS.rose;
  return (
    <div className="flex items-center gap-3 w-full max-w-lg">
      <span className="text-xs text-slate-400 w-24 flex-shrink-0">Network Health</span>
      <div className="flex-1 h-2.5 rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${health}%`, backgroundColor: color }}
          transition={{ duration: 0.6 }}
          style={{ boxShadow: `0 0 10px ${color}88` }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>{health}%</span>
    </div>
  );
}

export default function Simulation({ onNav }) {
  const [attackLogs, setAttackLogs] = useState([]);
  const [defenseLogs, setDefenseLogs] = useState([]);
  const [health, setHealth]   = useState(100);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);

  const attackRef  = useRef(null);
  const defenseRef = useRef(null);

  // ── Tick: add new log lines every 1.4 s ─────────────────────────────────────
  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => {
      setAttackLogs((l) => [...l.slice(-30), nextAttack()]);
      setTimeout(() => setDefenseLogs((l) => [...l.slice(-30), nextDefense()]), 500);
      setHealth((h) => Math.max(10, h - Math.floor(Math.random() * 5)));
      setElapsed((e) => e + 1);
    }, 1400);
    return () => clearInterval(tick);
  }, [running]);

  // Auto-scroll
  useEffect(() => {
    if (attackRef.current)  attackRef.current.scrollTop  = attackRef.current.scrollHeight;
    if (defenseRef.current) defenseRef.current.scrollTop = defenseRef.current.scrollHeight;
  }, [attackLogs, defenseLogs]);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="flex min-h-screen bg-[#0B0F1A]">
      <Sidebar active="simulation" onNav={onNav} />

      <main className="flex-1 p-8 overflow-auto flex flex-col gap-5">
        {/* ── Status Bar ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: `${COLORS.emerald}18`, border: `1px solid ${COLORS.emerald}40` }}>
              <BreathingDot color={COLORS.emerald} />
              <span className="text-emerald-300 font-bold tracking-widest text-sm">ACTIVE SIMULATION</span>
            </div>
            <span className="text-slate-500 font-mono text-sm">{mins}:{secs}</span>
          </div>
          <HealthBar health={health} />
          <div className="flex gap-3">
            <GlowButton color={COLORS.amber} onClick={() => setRunning((r) => !r)}>
              {running ? "⏸ Pause" : "▶ Resume"}
            </GlowButton>
            <GlowButton color={COLORS.cyan} onClick={() => onNav("results")}>
              End Sim →
            </GlowButton>
          </div>
        </motion.div>

        {/* ── Split View ── */}
        <div className="flex gap-0 flex-1 min-h-[480px] rounded-2xl overflow-hidden border border-white/10">
          {/* Red Panel */}
          <div className="flex-1 flex flex-col"
            style={{ background: "rgba(244,63,94,0.04)" }}>
            <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
              <span className="text-rose-400 font-bold text-sm">⚔ Red Team — Attack Payloads</span>
              <BreathingDot color={COLORS.rose} />
            </div>
            <div ref={attackRef}
              className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1.5"
              style={{ scrollbarWidth: "none" }}>
              <AnimatePresence initial={false}>
                {attackLogs.map((line, i) => (
                  <motion.div key={`${i}-${line}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ color: COLORS.rose, opacity: 0.85 }}>
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* VS Divider */}
          <div className="w-12 flex flex-col items-center justify-center bg-white/[0.02] border-x border-white/10 relative">
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-white z-10"
              style={{ background: "#0B0F1A", border: "2px solid rgba(255,255,255,0.2)" }}
              animate={{ boxShadow: ["0 0 6px #fff2", "0 0 16px #fff4", "0 0 6px #fff2"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              VS
            </motion.div>
            {/* vertical line */}
            <div className="absolute inset-x-0 top-0 bottom-0 flex justify-center">
              <div className="w-px h-full"
                style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent)" }} />
            </div>
          </div>

          {/* Blue Panel */}
          <div className="flex-1 flex flex-col"
            style={{ background: "rgba(34,211,238,0.04)" }}>
            <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
              <span className="font-bold text-sm" style={{ color: COLORS.cyan }}>⬡ Blue Team — Firewall Logs</span>
              <BreathingDot color={COLORS.cyan} />
            </div>
            <div ref={defenseRef}
              className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1.5"
              style={{ scrollbarWidth: "none" }}>
              <AnimatePresence initial={false}>
                {defenseLogs.map((line, i) => (
                  <motion.div key={`${i}-${line}`}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ color: COLORS.cyan, opacity: 0.85 }}>
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Stats Strip ── */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Attacks Fired",   val: attackLogs.length,            color: COLORS.rose    },
            { label: "Blocks Active",   val: defenseLogs.length,           color: COLORS.cyan    },
            { label: "Health Loss",     val: `${100 - health}%`,           color: COLORS.amber   },
            { label: "Time Elapsed",    val: `${mins}:${secs}`,            color: COLORS.emerald },
          ].map((s) => (
            <GlassCard key={s.label} className="p-4 text-center">
              <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.val}</div>
              <div className="text-slate-500 text-xs mt-1">{s.label}</div>
            </GlassCard>
          ))}
        </div>
      </main>
    </div>
  );
}