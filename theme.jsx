// src/theme.js
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all design tokens.
// Import these wherever you need raw hex values (Recharts, Cytoscape, etc.).
// Tailwind classes are the preferred method for regular HTML/JSX styling.
// ─────────────────────────────────────────────────────────────────────────────

export const COLORS = {
  // Primary palette
  deepSpace: '#0B0F1A',
  surface: '#111827', // slate-900 equivalent
  surfaceAlt: '#1E293B', // slate-800
  border: 'rgba(255,255,255,0.08)',

  // Accent
  cyan: '#22D3EE',
  rose: '#F43F5E',
  emerald: '#10B981',
  indigo: '#6366F1',
  amber: '#F59E0B',
  purple: '#A855F7',

  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#475569',
};

// Reusable Tailwind class strings (kept here so one edit updates everywhere)
export const GLASS =
  'bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl';

export const GLOW_CYAN = '0 0 20px rgba(34,211,238,0.35)';
export const GLOW_ROSE = '0 0 20px rgba(244,63,94,0.35)';
export const GLOW_EMERALD = '0 0 20px rgba(16,185,129,0.35)';

// Framer Motion – reusable variant sets
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' },
  }),
};
