import { getLanguageVectors, getLanguageStats } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { safeJsonParse } from "@/lib/utils";
import { Clock, TrendingUp, Layers, ArrowRight } from "lucide-react";

const langNames: Record<string, string> = {
  python: "Python+",
  java: "Java+",
  typescript: "TypeScript+",
};

const langColors: Record<string, string> = {
  python: "#3B82F6",
  java: "#F59E0B",
  typescript: "#8B5CF6",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return { title: `${langNames[lang] || lang} - 语言中枢 - DevFusion Hub` };
}

export default async function LanguageDetailPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const vectors = await getLanguageVectors(lang);
  const stats = await getLanguageStats(lang);

  if (vectors.length === 0) notFound();

  const color = langColors[lang] || "#8B5CF6";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section
        className="border-b border-[#1E293B] py-16 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color}10, #0B0E14)`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-100">
                {langNames[lang] || lang}
              </h1>
              <p className="text-slate-400 mt-1">
                {stats.vectorCount} 个技术向量 · {stats.unitCount} 个课程单元
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vector grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vectors.map((vector) => {
            const techStack = safeJsonParse(vector.techStack, []);
            return (
              <Link
                key={vector.id}
                href={`/language-hub/${lang}/${vector.slug}`}
                className="group rounded-2xl border border-[#1E293B] bg-[#131A2B] p-6 hover:border-[#8B5CF6] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 mb-1">
                      {vector.name}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {vector.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-[#8B5CF6] group-hover:translate-x-1 transition-all shrink-0" />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {techStack.map((tech: string, i: number) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="border-[#1E293B] text-slate-400 text-xs"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {vector.durationWeeks} 周
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Lv.{vector.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    {(vector as any).units?.length || 0} 单元
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
