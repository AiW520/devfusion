import { getLanguages, getLanguageStats } from "@/lib/data";
import Link from "next/link";
import {
  SiPython,
  SiTypescript,
  SiRust,
  SiGo,
  SiKotlin,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

const languageMeta: Record<
  string,
  { name: string; icon: React.ComponentType<any>; color: string; desc: string }
> = {
  python: {
    name: "Python+",
    icon: SiPython,
    color: "#3B82F6",
    desc: "从数据科学到AI应用，Python 生态的无限可能",
  },
  java: {
    name: "Java+",
    icon: FaJava,
    color: "#F59E0B",
    desc: "企业级应用的基石，Spring 生态的深度整合",
  },
  typescript: {
    name: "TypeScript+",
    icon: SiTypescript,
    color: "#8B5CF6",
    desc: "前后端统一的类型安全全栈体验",
  },
  go: {
    name: "Go+",
    icon: SiGo,
    color: "#10B981",
    desc: "高并发云原生服务的首选语言",
  },
  rust: {
    name: "Rust+",
    icon: SiRust,
    color: "#EF4444",
    desc: "系统级性能与内存安全的极致追求",
  },
  kotlin: {
    name: "Kotlin+",
    icon: SiKotlin,
    color: "#EC4899",
    desc: "现代 Android 与后端开发的优雅之选",
  },
};

export const metadata = {
  title: "语言中枢 - DevFusion Hub",
  description: "以主语言为根基，自由组合的集成向量",
};

export default async function LanguageHubPage() {
  const languages = await getLanguages();

  const allLanguages = await Promise.all(
    languages.map(async (lang) => ({
      lang,
      stats: await getLanguageStats(lang.slug),
    }))
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-[#1E293B] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            语言中枢
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            以你的主语言为根基，自由组合集成向量。每种语言都提供多条经过验证的技术组合路径，
            让你在熟悉的语法环境下拓展全栈能力。
          </p>
        </div>
      </section>

      {/* Language Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((lang) => {
            const meta = languageMeta[lang.slug] || {
              name: lang.name,
              icon: SiPython,
              color: "#64748B",
              desc: "探索技术向量",
            };
            const langStats = allLanguages.find((l) => l.lang.slug === lang.slug);
            const Icon = meta.icon;

            return (
              <Link
                key={lang.slug}
                href={`/language-hub/${lang.slug}`}
                className="group rounded-2xl border border-[#1E293B] bg-[#131A2B] p-6 hover:border-[#8B5CF6] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{
                      backgroundColor: `${meta.color}15`,
                      color: meta.color,
                    }}
                  >
                    <Icon />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">
                      {meta.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {langStats?.stats?.vectorCount || 0} 个技术向量
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-4">{meta.desc}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {langStats?.stats?.unitCount || 0} 个课程单元
                  </span>
                  <span
                    className="text-[#8B5CF6] group-hover:translate-x-1 transition-transform"
                  >
                    查看向量 →
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Coming soon cards */}
          {["go", "rust", "kotlin"]
            .filter((l) => !languages.some((lang) => lang.slug === l))
            .map((lang) => {
              const meta = languageMeta[lang];
              const Icon = meta.icon;
              return (
                <div
                  key={lang}
                  className="rounded-2xl border border-dashed border-[#1E293B] bg-[#131A2B]/50 p-6 opacity-60"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl bg-[#0B0E14] text-slate-600">
                      <Icon />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-500">
                        {meta.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">即将上线</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{meta.desc}</p>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}
