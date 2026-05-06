import { getVectorBySlug, getLanguageVectors } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { safeJsonParse } from "@/lib/utils";
import { Clock, TrendingUp, BookOpen, Code, Trophy, ArrowRight, Layers, ExternalLink } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; vectorSlug: string }>;
}) {
  const { vectorSlug } = await params;
  const vector = await getVectorBySlug(vectorSlug);
  if (!vector) return { title: "未找到技术向量" };
  return { title: `${vector.name} - 语言中枢 - DevFusion Hub` };
}

export async function generateStaticParams() {
  const vectors = await getLanguageVectors();
  return vectors.map((vector) => ({
    lang: vector.lang,
    vectorSlug: vector.slug,
  }));
}

export const revalidate = 86400;

export default async function VectorDetailPage({
  params,
}: {
  params: Promise<{ lang: string; vectorSlug: string }>;
}) {
  const { lang, vectorSlug } = await params;
  const vector = await getVectorBySlug(vectorSlug);

  if (!vector) notFound();

  let techStack: string[];
  try {
    const parsed = JSON.parse(vector.techStack);
    techStack = Array.isArray(parsed) ? parsed.map((t: any) => typeof t === 'string' ? t : t.name || JSON.stringify(t)) : [];
  } catch {
    techStack = [];
  }
  const foundationUnits = (vector as any).units?.filter(
    (vu: any) => vu.unit.moduleType === "FOUNDATION"
  ) || [];
  const projectUnits = (vector as any).units?.filter(
    (vu: any) => vu.unit.moduleType === "PROJECT"
  ) || [];
  const interviewUnits = (vector as any).units?.filter(
    (vu: any) => vu.unit.moduleType === "INTERVIEW"
  ) || [];

  return (
    <div className="min-h-screen">
      <section
        className="border-b border-[#1E293B] py-16 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${vector.color}10, #0B0E14)`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-sm text-slate-500 mb-3">
            <Link href="/language-hub" className="hover:text-[#3B82F6]">
              语言中枢
            </Link>
            {" / "}
            <Link
              href={`/language-hub/${lang}`}
              className="hover:text-[#3B82F6]"
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}+
            </Link>
            {" / "}
            <span className="text-slate-400">{vector.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            {vector.name}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mb-6">
            {vector.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {techStack.map((tech: string, i: number) => (
              <Badge
                key={i}
                variant="outline"
                className="border-[#1E293B] text-slate-400"
              >
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {vector.durationWeeks} 周
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" /> Lv.{vector.difficulty}
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-[#1E293B] bg-[#131A2B] p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#8B5CF6]" />
                技术栈架构
              </h3>
              <div className="space-y-3">
                {techStack.map((tech: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#0B0E14] border border-[#1E293B]"
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ background: vector.color }}
                    />
                    <span className="text-sm text-slate-300">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="foundation" className="w-full">
              <TabsList className="bg-[#131A2B] border border-[#1E293B] p-1 rounded-xl mb-8">
                <TabsTrigger value="foundation" className="data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white text-slate-400 gap-2">
                  <BookOpen className="h-4 w-4" /> 强基 ({foundationUnits.length})
                </TabsTrigger>
                <TabsTrigger value="project" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white text-slate-400 gap-2">
                  <Code className="h-4 w-4" /> 实战 ({projectUnits.length})
                </TabsTrigger>
                <TabsTrigger value="interview" className="data-[state=active]:bg-[#10B981] data-[state=active]:text-white text-slate-400 gap-2">
                  <Trophy className="h-4 w-4" /> 面试 ({interviewUnits.length})
                </TabsTrigger>
              </TabsList>
              {(["FOUNDATION", "PROJECT", "INTERVIEW"] as const).map((type) => {
                const units =
                  type === "FOUNDATION"
                    ? foundationUnits
                    : type === "PROJECT"
                      ? projectUnits
                      : interviewUnits;
                const color =
                  type === "FOUNDATION"
                    ? "#3B82F6"
                    : type === "PROJECT"
                      ? "#8B5CF6"
                      : "#10B981";
                return (
                  <TabsContent
                    key={type}
                    value={type.toLowerCase()}
                    className="space-y-4"
                  >
                    {units.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">
                        暂无课程内容，敬请期待
                      </div>
                    ) : (
                      units.map((vu: any) => (
                        <Link
                          key={vu.id}
                          href={`/language-hub/${lang}/${vectorSlug}/module/${vu.unit.moduleType.toLowerCase()}/${vu.unit.slug}`}
                          className="block rounded-xl border border-[#1E293B] bg-[#131A2B] p-5 hover:border-[#8B5CF6] transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-base font-semibold text-slate-200">
                                {vu.unit.title}
                              </h4>
                              <p className="text-sm text-slate-500 mt-1">
                                {vu.unit.description}
                              </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-[#8B5CF6] group-hover:translate-x-1 transition-all" />
                          </div>
                        </Link>
                      ))
                    )}
                    {type === "PROJECT" && (() => {
                      const raw = (vector as any).externalProjects;
                      const projects = raw ? safeJsonParse(raw, []) : [];
                      return projects.map((p: { name: string; url: string }, i: number) => (
                        <a
                          key={i}
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-xl border border-dashed border-[#8B5CF6]/40 bg-[#8B5CF6]/5 p-5 hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-base font-semibold text-[#8B5CF6] group-hover:text-[#A78BFA]">
                                {p.name}
                              </h4>
                              <p className="text-sm text-slate-500 mt-1">
                                点击跳转到外部项目仓库或在线演示
                              </p>
                            </div>
                            <ExternalLink className="h-5 w-5 text-[#8B5CF6] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                          </div>
                        </a>
                      ));
                    })()}
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
