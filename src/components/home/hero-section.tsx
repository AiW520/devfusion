"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1E293B] bg-[#0B0E14]/80 backdrop-blur mb-6">
          <Zap className="h-4 w-4 text-[#3B82F6]" />
          <span className="text-xs text-slate-400">
            AI 驱动的集成方案式学习平台
          </span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-100 mb-4 leading-tight max-w-4xl"
      >
        驾驭技术交响，
        <br />
        <span className="text-gradient">成为架构师型全栈</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl"
      >
        全球首个集成方案式全栈学习平台，以"星轨"和"语言中枢"双引擎，
        通过强基、实战、面试三阶火箭模型，培养能驾驭语言交响乐的架构师型人才。
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <Link href="/orbit">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90 text-white px-8 h-12 rounded-full text-base gap-2"
          >
            探索星轨 <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/language-hub">
          <Button
            size="lg"
            variant="outline"
            className="border-[#1E293B] bg-[#131A2B]/80 backdrop-blur hover:bg-[#1E293B] text-slate-300 px-8 h-12 rounded-full text-base"
          >
            进入语言中枢
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
