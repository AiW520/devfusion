"use client";

import { motion } from "framer-motion";
import { BookOpen, Code, Trophy } from "lucide-react";

const stages = [
  {
    icon: BookOpen,
    title: "强基",
    subtitle: "Foundation",
    description: "掌握核心原理与语言精微细节",
    details: [
      "概念讲解 + 动画图示",
      "扭魔方代码修复练习",
      "局部拼接实验",
      "知识检查点闯关",
    ],
    color: "#3B82F6",
  },
  {
    icon: Code,
    title: "实战",
    subtitle: "Project",
    description: "在演进式架构中建成工业级系统",
    details: [
      "蓝图对齐：API文档/原型/ER图",
      "单体雏形 → 前后端裂变",
      "工业骨架：数据库/缓存/Docker",
      "生产加固：认证/监控/CI/CD",
    ],
    color: "#8B5CF6",
  },
  {
    icon: Trophy,
    title: "面试",
    subtitle: "Interview",
    description: "将知识转化为精确可输出的面试答案",
    details: [
      "50-80道集成方案题库",
      "先答后核：提交后看高分拆解",
      "AI模拟大厂压力面试",
      "弱点拓扑图一键回链学习",
    ],
    color: "#10B981",
  },
];

export function RocketModel() {
  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#10B981] hidden lg:block" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="relative"
          >
            <div
              className="rounded-2xl border p-6 h-full"
              style={{
                borderColor: `${stage.color}30`,
                background: `linear-gradient(135deg, ${stage.color}08, #131A2B)`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${stage.color}20` }}
              >
                <stage.icon
                  className="h-6 w-6"
                  style={{ color: stage.color }}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-1">
                {stage.title}
                <span className="text-sm font-normal text-slate-500 ml-2">
                  {stage.subtitle}
                </span>
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                {stage.description}
              </p>
              <ul className="space-y-2">
                {stage.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-start gap-2 text-sm text-slate-500"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
