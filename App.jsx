// src/App.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Root component. Manages global screen/route state and renders the active
// screen. In a real project replace this with React Router v6.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Landing from './screen';
import RoleSelection from './RoleSelection';
import Login from './Logins';
import AdminDashboard from './AdminDashboard';
import RedTeam from './RedTeam';
import BlueTeam from './Blueteam';
import Simulation from './Simulation';
import Results from './Results';
import Report from './Report';

// Page-level fade + slide transition
const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const SCREENS = {
  landing: Landing,
  roleSelect: RoleSelection,
  login: Login,
  adminDash: AdminDashboard,
  redTeam: RedTeam,
  blueTeam: BlueTeam,
  simulation: Simulation,
  results: Results,
  report: Report,
};

export default function App() {
  const [screen, setScreen] = useState('landing');
  const ActiveScreen = SCREENS[screen] ?? Landing;

  return (
    // Global background – Deep Space
    <div className="min-h-screen bg-[#0B0F1A] font-sans antialiased">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <ActiveScreen onNav={setScreen} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
