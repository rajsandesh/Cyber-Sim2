// src/screens/RoleSelection.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Uses Cytoscape.js to render an interactive node graph.
// Hovering/clicking a role node pulses it and updates the info card below.
// Install:  npm install cytoscape
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import { motion, AnimatePresence } from "framer-motion";
import { MovingGrid, GlassCard, GlowButton } from "./index";
import { COLORS, fadeUp, scaleIn } from "./theme";

// ── Role metadata ─────────────────────────────────────────────────────────────
const ROLES = {
  admin: {
    label: "System Admin",
    color: COLORS.emerald,
    icon: "⚙️",
    dest: "adminDash",
    desc: "Manage users, configure scenarios, oversee all running simulations, and generate post-exercise reports.",
    skills: ["User Management", "Scenario Config", "Log Analysis", "Report Export"],
  },
  red: {
    label: "Attacker (Red Team)",
    color: COLORS.rose,
    icon: "⚔️",
    dest: "redTeam",
    desc: "Launch simulated cyber-attacks, probe vulnerabilities, and attempt to breach blue-team defences.",
    skills: ["Phishing", "DDoS", "SQL Injection", "Malware Deployment"],
  },
  blue: {
    label: "Defender (Blue Team)",
    color: COLORS.cyan,
    icon: "🛡️",
    dest: "blueTeam",
    desc: "Monitor real-time threats, activate defence tools, and protect the simulated infrastructure.",
    skills: ["Firewall Config", "IDS/IPS", "Threat Hunting", "Incident Response"],
  },
};

// Cytoscape stylesheet
const buildStyle = () => [
  {
    selector: "node",
    style: {
      "background-color": "#1E293B",
      "border-width": 2,
      "border-color": "#475569",
      label: "data(label)",
      color: "#F1F5F9",
      "font-size": "11px",
      "text-valign": "bottom",
      "text-margin-y": 8,
      "text-outline-color": "#0B0F1A",
      "text-outline-width": 2,
      width: 52,
      height: 52,
    },
  },
  {
    selector: 'node[id="core"]',
    style: {
      "background-color": "#6366F155",
      "border-color": "#6366F1",
      "border-width": 3,
      width: 40,
      height: 40,
    },
  },
  {
    selector: 'node[id="admin"]',
    style: { "border-color": COLORS.emerald, "background-color": `${COLORS.emerald}22` },
  },
  {
    selector: 'node[id="red"]',
    style: { "border-color": COLORS.rose, "background-color": `${COLORS.rose}22` },
  },
  {
    selector: 'node[id="blue"]',
    style: { "border-color": COLORS.cyan, "background-color": `${COLORS.cyan}22` },
  },
  {
    selector: "node.pulsing",
    style: {
      "border-width": 5,
      "overlay-opacity": 0.15,
    },
  },
  {
    selector: "edge",
    style: {
      width: 1.5,
      "line-color": "#334155",
      "line-style": "dashed",
      "line-dash-pattern": [6, 4],
      "target-arrow-shape": "none",
    },
  },
];

export default function RoleSelection({ onNav }) {
  const cyRef = useRef(null);
  const cyInstance = useRef(null);
  const [selected, setSelected] = useState(null);

  // ── Mount Cytoscape ─────────────────────────────────────────────────────────
  useEffect(() => {
    cyInstance.current = cytoscape({
      container: cyRef.current,
      elements: [
        // nodes
        { data: { id: "core",  label: "CyberSim" } },
        { data: { id: "admin", label: "Admin"    } },
        { data: { id: "red",   label: "Red Team" } },
        { data: { id: "blue",  label: "Blue Team"} },
        // edges
        { data: { source: "core", target: "admin" } },
        { data: { source: "core", target: "red"   } },
        { data: { source: "core", target: "blue"  } },
      ],
      layout: {
        name: "preset",
        positions: {
          core:  { x: 200, y: 140 },
          admin: { x: 200, y: 30  },
          red:   { x: 90,  y: 240 },
          blue:  { x: 310, y: 240 },
        },
      },
      style: buildStyle(),
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false,
    });

    const cy = cyInstance.current;

    cy.on("tap mouseover", "node:not([id='core'])", (e) => {
      const id = e.target.id();
      cy.nodes().removeClass("pulsing");
      e.target.addClass("pulsing");
      setSelected(id);
    });

    return () => cy.destroy();
  }, []);

  const role = selected ? ROLES[selected] : null;

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center px-8 overflow-hidden">
      <MovingGrid />

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-10 z-10">
        <h1 className="text-4xl font-extrabold mb-2">
          Select Your <span style={{ color: COLORS.cyan }}>Role</span>
        </h1>
        <p className="text-slate-400">Click a node to choose how you participate in the simulation.</p>
      </motion.div>

      {/* ── Cytoscape Canvas ── */}
      <motion.div variants={scaleIn} initial="hidden" animate="visible"
        className="z-10 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-md"
        style={{ width: 420, height: 310 }}>
        <div ref={cyRef} style={{ width: "100%", height: "100%" }} />
      </motion.div>

      {/* ── Dynamic Info Card ── */}
      <div className="z-10 mt-6 w-full max-w-md min-h-[180px]">
        <AnimatePresence mode="wait">
          {role ? (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-6" glowColor={role.color}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{role.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{role.label}</h3>
                    <p className="text-slate-400 text-sm">{role.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {role.skills.map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-lg"
                      style={{ background: `${role.color}20`, color: role.color, border: `1px solid ${role.color}30` }}>
                      {s}
                    </span>
                  ))}
                </div>
                <GlowButton
                  onClick={() => onNav(role.dest)}
                  color={role.color}
                  className="w-full py-3 text-base font-bold"
                >
                  Initialize Session →
                </GlowButton>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-slate-500 text-sm pt-6">
              ↑ Hover or tap a node above
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <button onClick={() => onNav("landing")}
        className="z-10 mt-6 text-slate-600 hover:text-slate-400 text-sm transition-colors">
        ← Back to Home
      </button>
    </div>
  );
}