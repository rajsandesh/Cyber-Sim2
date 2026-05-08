import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar, GlassCard, GlowButton, StatusBadge, MetricCard } from "./index";
import { COLORS, fadeUp } from "./theme";

const MOCK_USERS = [
  { id: 1, name: "Alice (Red-1)", role: "Red Team", status: "Active", ip: "192.168.1.45" },
  { id: 2, name: "Bob (Blue-Leader)", role: "Blue Team", status: "Active", ip: "192.168.1.12" },
  { id: 3, name: "Charlie (Red-2)", role: "Red Team", status: "Idle", ip: "192.168.1.46" },
  { id: 4, name: "Admin_Shaakaa", role: "Admin", status: "Active", ip: "127.0.0.1" },
];

const MOCK_LOGS = [
  { id: 1, time: "10:42 AM", type: "INFO", message: "User Admin_Shaakaa logged in." },
  { id: 2, time: "10:45 AM", type: "ALERT", message: "Red Team initiated network scan." },
  { id: 3, time: "10:47 AM", type: "WARNING", message: "Failed login attempt from 192.168.1.99" },
  { id: 4, time: "10:50 AM", type: "INFO", message: "Blue Team deployed firewall rules." },
  { id: 5, time: "10:52 AM", type: "INFO", message: "User Alice (Red-1) connected." },
];

export default function AdminDashboard({ onNav }) {
  const [users, setUsers] = useState(MOCK_USERS);
  const [logs, setLogs] = useState(MOCK_LOGS);

  return (
    <div className="flex min-h-screen bg-[#0B0F1A]">
      <Sidebar active="adminDash" onNav={onNav} />
      <main className="flex-1 p-8 overflow-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-white">⚙ System Dashboard</h1>
          <GlowButton color={COLORS.emerald} onClick={() => onNav("simulation")}>Live Simulation</GlowButton>
        </motion.div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <MetricCard icon="👥" label="Total Connected Users" value={users.length} delta="+2" color={COLORS.cyan} index={0} />
          <MetricCard icon="🛡️" label="Active Teams" value="2" color={COLORS.emerald} index={1} />
          <MetricCard icon="⚠️" label="Recent Alerts" value="3" delta="+1" color={COLORS.rose} index={2} />
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Connected Users */}
          <GlassCard className="col-span-12 lg:col-span-7 p-6">
            <h2 className="text-white font-semibold mb-4 text-lg">Connected Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-sm">
                    <th className="pb-3 px-2 font-medium">Name</th>
                    <th className="pb-3 px-2 font-medium">Role</th>
                    <th className="pb-3 px-2 font-medium">IP Address</th>
                    <th className="pb-3 px-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2 text-white font-medium">{u.name}</td>
                      <td className="py-3 px-2 text-slate-300">{u.role}</td>
                      <td className="py-3 px-2 text-slate-400 font-mono text-xs">{u.ip}</td>
                      <td className="py-3 px-2">
                        <StatusBadge
                          level={u.status === "Active" ? "active" : "low"}
                          label={u.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* System Logs */}
          <GlassCard className="col-span-12 lg:col-span-5 p-6 flex flex-col h-full">
            <h2 className="text-white font-semibold mb-4 text-lg">System Logs</h2>
            <div className="flex-1 bg-[#05070D] rounded-xl border border-white/5 p-4 font-mono text-xs overflow-y-auto max-h-[300px]">
              <div className="space-y-3">
                {logs.map((log) => {
                  let colorClass = "text-slate-300";
                  if (log.type === "ALERT") colorClass = "text-rose-400";
                  if (log.type === "WARNING") colorClass = "text-amber-400";
                  if (log.type === "INFO") colorClass = "text-cyan-400";
                  
                  return (
                    <div key={log.id} className="flex gap-3 items-start border-b border-white/5 pb-2 last:border-0">
                      <span className="text-slate-500 whitespace-nowrap">[{log.time}]</span>
                      <span className={`font-semibold ${colorClass}`}>[{log.type}]</span>
                      <span className="text-slate-300 break-words">{log.message}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
