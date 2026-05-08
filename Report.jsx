import { motion } from "framer-motion";
import { Sidebar, GlassCard, GlowButton } from "./index";
import { COLORS, fadeUp } from "./theme";

export default function Report({ onNav }) {
  return (
    <div className="flex min-h-screen bg-[#0B0F1A]">
      <Sidebar active="report" onNav={onNav} />
      <main className="flex-1 p-8 overflow-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <h1 className="text-2xl font-extrabold text-white mb-4">⊟ Post-Action Report</h1>
          <GlassCard className="p-8">
             <p className="text-slate-400">Exporting capabilities will be added here.</p>
             <div className="mt-8">
               <GlowButton color={COLORS.emerald} onClick={() => onNav("landing")}>Return to Home</GlowButton>
             </div>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
}
