import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { RocketModel } from "@/components/home/rocket-model";
import { ModeSwitchDemo } from "@/components/home/mode-switch-demo";
import { StarOrbitCanvasLazy } from "@/components/home/star-orbit-canvas-lazy";
import { getStats, getTracks } from "@/lib/data";
import { safeJsonParse } from "@/lib/utils";

export const revalidate = 86400;

export default async function HomePage() {
  const stats = await getStats();
  const tracks = await getTracks();

  return (
    <div className="min-h-screen">
      {/* 3D Star Orbit */}
      <section className="hero-section relative h-[70vh] overflow-hidden">
        <StarOrbitCanvasLazy tracks={tracks} />
        <HeroSection />
      </section>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Mode Switch Demo */}
      <section className="container mx-auto px-4 py-16">
        <ModeSwitchDemo />
      </section>

      {/* Three Stage Rocket */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-4 text-slate-100">
          三阶火箭学习法
        </h2>
        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
          从核心原理的"强基"到工业级项目的"实战"，再到面试场的"精准输出"——你走的每一步都有AI护航
        </p>
        <RocketModel />
      </section>

      {/* Featured Tracks */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-100">
          旗舰星轨方案
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tracks.map((track) => (
            <a
              key={track.id}
              href={`/orbit/${track.slug}`}
              className="group relative rounded-2xl border border-[#1E293B] bg-[#131A2B] p-6 hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ background: track.color }}
              />
              <h3 className="text-xl font-bold text-slate-100 mb-2">
                {track.name}
              </h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                {track.description}
              </p>
              <div className="flex items-center gap-2 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-4 rounded ${
                      i < track.difficulty
                        ? "bg-[#3B82F6]"
                        : "bg-[#1E293B]"
                    }`}
                  />
                ))}
                <span className="text-xs text-slate-500 ml-1">
                  Lv.{track.difficulty}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {safeJsonParse(track.techStack, []).map(
                  (tech: { name: string }, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-xs bg-[#0B0E14] text-slate-400 border border-[#1E293B]"
                    >
                      {tech.name}
                    </span>
                  )
                )}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{track.durationWeeks} 周</span>
                <span className="text-[#3B82F6] group-hover:translate-x-1 transition-transform">
                  开始探索 →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Code Quote */}
      <section className="container mx-auto px-4 py-16 text-center">
        <blockquote className="text-2xl font-mono text-slate-400 italic max-w-2xl mx-auto leading-relaxed">
          <span className="text-[#3B82F6]">const</span>{" "}
          <span className="text-[#8B5CF6]">architect</span>{" "}
          <span className="text-slate-500">=</span>{" "}
          <span className="text-[#10B981]">orbit</span>
          <span className="text-slate-300">.find</span>(
          <span className="text-[#F59E0B]">&quot;your_path&quot;</span>){" "}
          <span className="text-slate-500">??</span>{" "}
          <span className="text-[#3B82F6]">await</span>{" "}
          <span className="text-[#10B981]">nexus</span>
          <span className="text-slate-300">.forge</span>(
          <span className="text-[#F59E0B]">&quot;your_own&quot;</span>);
        </blockquote>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] py-12 px-4">
        <div className="container mx-auto text-center text-sm text-slate-500">
          <p>DevFusion Hub — 驾驭技术交响，成为架构师型全栈</p>
          <p className="mt-1">
            AI 驱动的集成学习平台 | {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
