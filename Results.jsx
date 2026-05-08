import { motion } from "framer-motion";
import { Sidebar, GlassCard, GlowButton } from "./index";
import { COLORS, fadeUp } from "./theme";

export default function Results({ onNav }) {
  return (
    <div className="flex min-h-screen bg-[#0B0F1A]">
      <Sidebar active="results" onNav={onNav} />
      <main className="flex-1 p-8 overflow-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8 text-center mt-20">
          <h1 className="text-4xl font-extrabold text-white mb-4">Simulation Concluded</h1>
          <GlassCard className="max-w-xl mx-auto p-8" glowColor={COLORS.amber}>
             <h2 className="text-2xl text-white mb-4">Blue Team successfully defended the core.</h2>
             <GlowButton color={COLORS.cyan} onClick={() => onNav("report")}>View Full Report</GlowButton>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
}