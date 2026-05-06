import { getTracks, getLanguages } from "@/lib/data";
import Link from "next/link";
import { Orbit, BookOpen, Sparkles } from "lucide-react";

export const metadata = {
  title: "学习地图 - DevFusion Hub",
  description: "全局学习路径图，查看所有星轨和语言中枢",
};

export default async function LearningMapPage() {
  const tracks = await getTracks();
  const languages = await getLanguages();

  return (
    <div className="min-h-screen">
      <section className="border-b border-[#1E293B] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            学习地图
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            从星轨探索到语言中枢，全景展示 DevFusion Hub 的学习路径图。
            选择一条轨道，开始你的架构师之旅。
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Orbit paths */}
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <Orbit className="h-6 w-6 text-[#3B82F6]" />
              星轨探索路径
            </h2>
            <div className="space-y-4">
              {tracks.map((track, i) => (
                <Link
                  key={track.id}
                  href={`/orbit/${track.slug}`}
                  className="block rounded-xl border border-[#1E293B] bg-[#131A2B] p-5 hover:border-[#3B82F6] transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0B0E14] border border-[#1E293B] flex items-center justify-center text-lg font-bold text-[#3B82F6]">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-200 group-hover:text-white">
                        {track.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {track.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                        <span>{track.durationWeeks} 周</span>
                        <span>·</span>
                        <span>Lv.{track.difficulty}</span>
                        <span>·</span>
                        <span>{track.units.length} 个单元</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Language paths */}
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-[#8B5CF6]" />
              语言中枢入口
            </h2>
            <div className="space-y-4">
              {languages.map((lang, i) => (
                <Link
                  key={lang}
                  href={`/language-hub/${lang}`}
                  className="block rounded-xl border border-[#1E293B] bg-[#131A2B] p-5 hover:border-[#8B5CF6] transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0B0E14] border border-[#1E293B] flex items-center justify-center text-lg font-bold text-[#8B5CF6]">
                      {lang.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-200 group-hover:text-white">
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}+
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        探索 {lang} 生态的技术向量组合
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendation CTA */}
      <section className="container mx-auto px-4 py-12">
        <div className="rounded-2xl border border-[#1E293B] bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10 p-8 text-center">
          <Sparkles className="h-8 w-8 text-[#3B82F6] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            不确定从哪里开始？
          </h2>
          <p className="text-slate-400 mb-6">
            告诉 AI 助手你想做的项目或职业目标，自动匹配最佳星轨方案
          </p>
          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-4 w-4" /> AI 智能推荐
          </Link>
        </div>
      </section>
    </div>
  );
}
