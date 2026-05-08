import { motion } from "framer-motion";
import { Sidebar, GlassCard, GlowButton, BreathingDot } from "./index";
import { COLORS, fadeUp } from "./theme";

export default function Login({ onNav }) {
  return (
    <div className="flex min-h-screen bg-[#0B0F1A]">
      <Sidebar active="login" onNav={onNav} />
      <main className="flex-1 p-8 flex items-center justify-center">
        <GlassCard className="p-8 w-full max-w-md text-center" glowColor={COLORS.cyan}>
          <h1 className="text-2xl font-extrabold text-white mb-6">Agent Login</h1>
          <div className="space-y-4">
            <input type="text" placeholder="Agent ID" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
            <input type="password" placeholder="Passphrase" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
            <GlowButton color={COLORS.cyan} className="w-full py-3" onClick={() => onNav("adminDash")}>Authenticate</GlowButton>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
