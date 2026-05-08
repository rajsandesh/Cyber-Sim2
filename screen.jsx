// src/screens/Landing.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Public Hero page.
// Key features:
//   • Moving dot-grid background (CSS animation)
//   • Framer Motion staggered entrance for headline + CTA
//   • Floating 3D-ish isometric SVG illustration (Motion float loop)
//   • Glassmorphism feature cards with hover-glow
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { Navbar, GlassCard, GlowButton, MovingGrid, BreathingDot } from "./index";
import { COLORS, fadeUp } from "./theme";

const FEATURES = [
  { icon: "☁️", title: "Cloud Security",          desc: "Protect cloud infra with scalable, intelligent security solutions." },
  { icon: "🔁", title: "Incident Response",        desc: "Rapid response and seamless recovery to minimise downtime."        },
  { icon: "🔥", title: "Firewall & Network",       desc: "Intelligent firewall systems to block sophisticated threats."       },
  { icon: "🧠", title: "Threat Intelligence",      desc: "AI-driven monitoring, analysis, and anticipation of cyber attacks." },
  { icon: "💼", title: "Security Consulting",      desc: "Expert assessments, strategic road-maps, and compliance reviews."   },
  { icon: "🛡️", title: "Advanced Threat Protect", desc: "Detect, contain, and eliminate threats before impact."             },
];

const STATS = [
  ["99.9%", "Uptime SLA"],
  ["1.5K+", "Active Users"],
  ["< 5 min", "Mean Response"],
  ["15 yrs", "Experience"],
];

// Floating animation for the hero illustration
const floatVariant = {
  animate: {
    y: [0, -14, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function Landing({ onNav }) {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <MovingGrid />
      <Navbar onNav={onNav} />

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-36 pb-24 flex items-center gap-16">
        {/* Left copy */}
        <div className="flex-1 space-y-7">
          {/* Pill */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{ background: `${COLORS.cyan}15`, border: `1px solid ${COLORS.cyan}30`, color: COLORS.cyan }}>
            <BreathingDot color={COLORS.cyan} />
            Next-Gen Cyber Training Platform
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-6xl font-extrabold leading-tight">
            A New Era of
            <br />
            <span style={{
              background: `linear-gradient(90deg, ${COLORS.cyan}, #818CF8)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Cyber Security
            </span>
            <br />
            Training.
          </motion.h1>

          {/* Sub */}
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-slate-400 text-xl max-w-md leading-relaxed">
            Simulate, Defend, and Master Real-World Attacks in a safe,
            controlled environment built for modern security teams.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex gap-4">
            <GlowButton
              onClick={() => onNav("roleSelect")}
              color={COLORS.cyan}
              className="text-base px-8 py-3.5"
            >
              Get Started →
            </GlowButton>
            <GlowButton color={COLORS.textSecondary} className="text-base px-8 py-3.5">
              Watch Demo
            </GlowButton>
          </motion.div>
        </div>

        {/* Right – floating SVG illustration */}
        <motion.div
          className="flex-1 flex justify-center"
          variants={floatVariant}
          animate="animate"
        >
          <svg viewBox="0 0 440 340" className="w-full max-w-lg drop-shadow-2xl">
            <defs>
              <radialGradient id="hg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={COLORS.cyan} stopOpacity="0.25" />
                <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* glow orb */}
            <ellipse cx="220" cy="170" rx="160" ry="100" fill="url(#hg)" />
            {/* grid */}
            {[0,1,2,3,4,5].map(i => (
              <line key={`v${i}`} x1={60+i*64} y1="60" x2={60+i*64} y2="280"
                stroke={COLORS.cyan} strokeWidth="0.4" strokeOpacity="0.2" />
            ))}
            {[0,1,2,3,4].map(i => (
              <line key={`h${i}`} x1="60" y1={80+i*48} x2="380" y2={80+i*48}
                stroke={COLORS.cyan} strokeWidth="0.4" strokeOpacity="0.2" />
            ))}
            {/* edges */}
            {[
              [220,120,120,200],[220,120,320,200],
              [120,200,160,275],[320,200,280,275],[160,275,280,275],
            ].map(([x1,y1,x2,y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={COLORS.cyan} strokeWidth="1.2"
                strokeDasharray="5 4" strokeOpacity="0.5" />
            ))}
            {/* nodes */}
            {[[220,120],[120,200],[320,200],[160,275],[280,275]].map(([cx,cy], i) => (
              <g key={i} filter="url(#glow)">
                <circle cx={cx} cy={cy} r="20" fill="#0B0F1A" stroke={COLORS.cyan} strokeWidth="1.5" strokeOpacity="0.8" />
                <circle cx={cx} cy={cy} r="7" fill={COLORS.cyan} opacity="0.9" />
              </g>
            ))}
            {/* data packets */}
            {[0,1,2].map(i => (
              <circle key={i} cx="120" cy="200" r="3.5" fill={COLORS.cyan} opacity="0.85">
                <animateMotion dur={`${1.6+i*0.35}s`} repeatCount="indefinite"
                  path="M0,0 Q50,-30 100,0 Q50,30 0,0" />
              </circle>
            ))}
            <text x="220" y="50" textAnchor="middle" fill={COLORS.textMuted} fontSize="11">
              Secure Infrastructure Mesh
            </text>
          </svg>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto grid grid-cols-4 divide-x divide-white/10">
          {STATS.map(([val, label], i) => (
            <motion.div key={label} variants={fadeUp} initial="hidden" animate="visible" custom={i}
              className="py-10 text-center">
              <div className="text-3xl font-extrabold" style={{ color: COLORS.cyan }}>{val}</div>
              <div className="text-slate-500 text-sm mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12 text-white">
          Explore Our Security Capabilities
        </motion.h2>
        <div className="grid grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} variants={fadeUp} initial="hidden"
              whileInView="visible" viewport={{ once: true }} custom={i}>
              <GlassCard className="p-6 cursor-pointer group" glowColor={COLORS.cyan}>
                <ScanlineOverlay />
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 text-xs font-medium transition-all group-hover:translate-x-1"
                  style={{ color: COLORS.cyan }}>
                  Read more →
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative z-10 py-24 text-center">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-4xl font-bold mb-4">Fortify Your Digital Future</motion.h2>
        <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          className="text-slate-400 mb-8">
          Defend your data, systems, and reputation with proactive real-time protection.
        </motion.p>
        <GlowButton onClick={() => onNav("roleSelect")} color={COLORS.cyan} className="text-lg px-10 py-4">
          Start Free Trial
        </GlowButton>
      </section>
    </div>
  );
}

// Local import fix: ScanlineOverlay used in feature cards
function ScanlineOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
      background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)",
      zIndex: 1,
    }} />
  );
}