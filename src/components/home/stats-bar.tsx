"use client";

import { motion } from "framer-motion";
import { Orbit, BookOpen, GraduationCap } from "lucide-react";

interface Stats {
  trackCount: number;
  vectorCount: number;
  unitCount: number;
}

export function StatsBar({ stats }: { stats: Stats }) {
  const items = [
    {
      icon: Orbit,
      value: stats.trackCount,
      label: "工业星轨",
      color: "text-[#3B82F6]",
    },
    {
      icon: BookOpen,
      value: stats.vectorCount,
      label: "集成向量",
      color: "text-[#8B5CF6]",
    },
    {
      icon: GraduationCap,
      value: stats.unitCount,
      label: "项目细胞",
      color: "text-[#10B981]",
    },
  ];

  return (
    <div className="border-b border-[#1E293B] bg-[#0B0E14] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className="text-center"
            >
              <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
              <div className="text-2xl font-bold text-slate-100">
                {item.value}+
              </div>
              <div className="text-xs text-slate-500 mt-1">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
