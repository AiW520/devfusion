"use client";

import { motion } from "framer-motion";
import { Orbit, BookOpen } from "lucide-react";

export function ModeSwitchDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#131A2B] p-8 cursor-pointer group"
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-full bg-[#3B82F6] opacity-5 group-hover:opacity-10 transition-opacity" />
        <Orbit className="h-10 w-10 text-[#3B82F6] mb-4" />
        <h3 className="text-2xl font-bold text-slate-100 mb-3">星轨探索</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          按职业需求预设的完整集成方案。每条星轨都是一个经过工业验证的技术栈配方，
          包含从强基到面试的完整学习路径。LiteLynx、NeonStack、AI Alchemist
          等旗舰星轨等你探索。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Python+", "Next.js", "AI全栈", "移动开发", "数据分析"].map(
            (tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded bg-[#0B0E14] text-[#3B82F6] border border-[#1E293B]"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#131A2B] p-8 cursor-pointer group"
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-full bg-[#8B5CF6] opacity-5 group-hover:opacity-10 transition-opacity" />
        <BookOpen className="h-10 w-10 text-[#8B5CF6] mb-4" />
        <h3 className="text-2xl font-bold text-slate-100 mb-3">语言中枢</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          以主语言为根基的自由组合向量。从 Python+ 到 Java+、TypeScript+
          到 Rust+，每种语言都提供多个集成向量，助你按需搭配技术栈。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Python+", "Java+", "TypeScript+", "Go+", "Rust+"].map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded bg-[#0B0E14] text-[#8B5CF6] border border-[#1E293B]"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
