import { getTracks } from "@/lib/data";
import { safeJsonParse } from "@/lib/utils";
import { Orbit, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "星轨探索 - DevFusion Hub",
  description: "探索按职业需求预设的完整集成方案",
};

export default async function OrbitPage() {
  const tracks = await getTracks();

  const categories = [
    { key: "all", label: "全部", active: true },
    { key: "web", label: "Web全栈" },
    { key: "mobile", label: "移动开发" },
    { key: "ai", label: "AI/ML" },
    { key: "data", label: "数据工程" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-[#1E293B] py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Orbit className="h-8 w-8 text-[#3B82F6]" />
            <h1 className="text-4xl font-bold text-slate-100">星轨探索</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            每一条星轨都是一个经过工业验证的技术栈配方。从
            LiteLynx 的轻快全栈到 AI Alchemist 的智能应用，
            找到你的轨道，按三阶火箭模型完成蜕变。
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <div className="border-b border-[#1E293B] bg-[#0B0E14] sticky top-16 z-40">
        <div className="container mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                cat.active
                  ? "bg-[#3B82F6] text-white"
                  : "bg-[#131A2B] text-slate-400 hover:text-slate-200 border border-[#1E293B]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Track grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => {
            const techStack = safeJsonParse(track.techStack, []);
            return (
              <Link
                key={track.id}
                href={`/orbit/${track.slug}`}
                className="group rounded-2xl border border-[#1E293B] bg-[#131A2B] p-6 hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ background: track.color }}
                />
                <h3 className="text-xl font-bold text-slate-100 mb-2">
                  {track.name}
                </h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {track.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {track.durationWeeks} 周
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Lv.{track.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {techStack.map((tech: { name: string }, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-xs bg-[#0B0E14] text-slate-400 border border-[#1E293B]"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-[#1E293B] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all group-hover:w-1/3"
                    style={{
                      width: "0%",
                      background: track.color,
                    }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
