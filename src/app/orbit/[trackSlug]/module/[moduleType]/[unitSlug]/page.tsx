import { getTrackBySlug, getCourseUnit } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MdxRenderer } from "@/components/course/mdx-renderer";
import { safeJsonParse } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code,
  Trophy,
  Clock,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const moduleTypeMap: Record<string, string> = {
  foundation: "FOUNDATION",
  project: "PROJECT",
  interview: "INTERVIEW",
};

const moduleMetaMap: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
  FOUNDATION: { label: "强基模块", icon: BookOpen, color: "#3B82F6", bgColor: "#3B82F620" },
  PROJECT: { label: "实战模块", icon: Code, color: "#8B5CF6", bgColor: "#8B5CF620" },
  INTERVIEW: { label: "面试模块", icon: Trophy, color: "#10B981", bgColor: "#10B98120" },
};

export default async function OrbitUnitDetailPage({
  params,
}: {
  params: Promise<{ trackSlug: string; moduleType: string; unitSlug: string }>;
}) {
  const { trackSlug, moduleType, unitSlug } = await params;
  const track = await getTrackBySlug(trackSlug);
  if (!track) notFound();

  const dbModuleType = moduleTypeMap[moduleType];
  if (!dbModuleType) notFound();

  const unit = await getCourseUnit(unitSlug);
  if (!unit || unit.moduleType !== dbModuleType) notFound();

  // Get all units in this module for navigation
  const moduleUnits = track.units
    .filter((tu) => tu.unit.moduleType === dbModuleType)
    .sort((a, b) => a.order - b.order);

  const currentIndex = moduleUnits.findIndex((tu) => tu.unit.slug === unitSlug);
  const prevUnit = currentIndex > 0 ? moduleUnits[currentIndex - 1].unit : null;
  const nextUnit = currentIndex < moduleUnits.length - 1 ? moduleUnits[currentIndex + 1].unit : null;

  const meta = moduleMetaMap[dbModuleType];
  const ModuleIcon = meta.icon;

  // Parse JSON data for project/interview units
  const phases = unit.phases ? safeJsonParse<any>(unit.phases, null) : null;
  const questions = unit.questions ? safeJsonParse<any>(unit.questions, null) : null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        className="border-b border-[#1E293B] py-10"
        style={{ background: `linear-gradient(135deg, ${meta.bgColor}, #0B0E14)` }}
      >
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 flex-wrap">
            <Link href="/orbit" className="hover:text-[#3B82F6] transition-colors">
              星轨系统
            </Link>
            <span>/</span>
            <Link href={`/orbit/${trackSlug}`} className="hover:text-[#3B82F6] transition-colors">
              {track.name}
            </Link>
            <span>/</span>
            <Link
              href={`/orbit/${trackSlug}/module/${moduleType}`}
              className="hover:text-[#3B82F6] transition-colors"
            >
              {meta.label}
            </Link>
            <span>/</span>
            <span className="text-slate-300">{unit.title}</span>
          </div>

          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: meta.bgColor }}
            >
              <ModuleIcon className="h-5 w-5" style={{ color: meta.color }} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
              {unit.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Badge
              className="border-0 text-white"
              style={{ backgroundColor: meta.color }}
            >
              {meta.label}
            </Badge>
            <span className="flex items-center gap-1 text-slate-500">
              <TrendingUp className="h-3.5 w-3.5" />
              难度 Lv.{unit.difficulty}
            </span>
            <span className="text-slate-500">{track.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar - unit navigation */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 rounded-xl border border-[#1E293B] bg-[#131A2B] overflow-hidden">
              <div className="p-4 border-b border-[#1E293B]">
                <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" style={{ color: meta.color }} />
                  课程目录
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {moduleUnits.length} 个单元 · 第 {currentIndex + 1} 个
                </p>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {moduleUnits.map((tu, i) => {
                  const isActive = tu.unit.slug === unitSlug;
                  return (
                    <Link
                      key={tu.id}
                      href={`/orbit/${trackSlug}/module/${moduleType}/${tu.unit.slug}`}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-[#1E293B] transition-colors group ${
                        isActive
                          ? "bg-[#0B0E14] border-l-2 border-l-[#3B82F6]"
                          : "hover:bg-[#0B0E14]"
                      }`}
                      style={
                        isActive
                          ? { borderLeftColor: meta.color }
                          : undefined
                      }
                    >
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-medium mt-0.5 shrink-0 ${
                          isActive
                            ? "text-white"
                            : "text-slate-500 bg-[#1E293B] group-hover:text-slate-300"
                        }`}
                        style={isActive ? { backgroundColor: meta.color } : undefined}
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`text-sm truncate ${
                            isActive
                              ? "text-slate-100 font-medium"
                              : "text-slate-400 group-hover:text-slate-300"
                          }`}
                        >
                          {tu.unit.title}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main content area */}
          <main className="lg:col-span-3 order-1 lg:order-2 min-w-0">
            {/* Content card */}
            <div className="rounded-2xl border border-[#1E293B] bg-[#131A2B] p-6 md:p-10">
              <MdxRenderer content={unit.mdxContent} />
            </div>

            {/* Project Phases */}
            {dbModuleType === "PROJECT" && phases && (
              <div className="mt-8 rounded-2xl border border-[#8B5CF6]/30 bg-[#131A2B] p-6 md:p-10">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-6">
                  <Code className="h-5 w-5 text-[#8B5CF6]" />
                  项目阶段拆解
                </h2>
                <div className="space-y-6">
                  {phases.map((phase: any, idx: number) => (
                    <div key={idx} className="relative pl-8">
                      {/* Timeline dot & line */}
                      <div
                        className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2"
                        style={{
                          backgroundColor: "#8B5CF620",
                          borderColor: "#8B5CF6",
                        }}
                      />
                      {idx < phases.length - 1 && (
                        <div className="absolute left-[5px] top-4 w-0.5 h-[calc(100%+0.5rem)] bg-[#1E293B]" />
                      )}
                      <div>
                        <h4 className="text-base font-semibold text-slate-200">
                          Phase {idx + 1}: {phase.title || phase.name}
                        </h4>
                        {phase.url && (
                          <a
                            href={phase.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-1 text-sm text-[#3B82F6] hover:text-[#60A5FA] hover:underline transition-colors"
                          >
                            查看详情 <ArrowRight className="h-3 w-3" />
                          </a>
                        )}
                        {phase.objective && (
                          <p className="text-sm text-[#8B5CF6] mt-1">
                            目标: {phase.objective}
                          </p>
                        )}
                        {phase.tasks && Array.isArray(phase.tasks) && (
                          <ul className="mt-2 space-y-1">
                            {phase.tasks.map((task: string, ti: number) => (
                              <li key={ti} className="text-sm text-slate-400 flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#1E293B] mt-0.5 shrink-0" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        )}
                        {phase.description && (
                          <p className="text-sm text-slate-400 mt-2">{phase.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interview Q&A */}
            {dbModuleType === "INTERVIEW" && questions && (
              <div className="mt-8 rounded-2xl border border-[#10B981]/30 bg-[#131A2B] p-6 md:p-10">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-6">
                  <Trophy className="h-5 w-5 text-[#10B981]" />
                  面试题库 · 先答后核
                </h2>
                {questions.groups ? (
                  <div className="space-y-10">
                    {questions.groups.map((group: any, gi: number) => (
                      <div key={gi}>
                        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-md flex items-center justify-center text-xs"
                            style={{ backgroundColor: "#10B98120", color: "#10B981" }}
                          >
                            {gi + 1}
                          </span>
                          {group.topic || group.name}
                        </h3>
                        <div className="space-y-4">
                          {(group.questions || group.items || []).map((q: any, qi: number) => (
                            <details
                              key={qi}
                              className="group rounded-xl border border-[#1E293B] bg-[#0B0E14] overflow-hidden"
                            >
                              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1E293B]/50 transition-colors">
                                <span className="text-sm font-medium text-slate-300 pr-4">
                                  Q{qi + 1}: {q.question || q.q}
                                </span>
                                <span className="text-xs text-slate-600 shrink-0">
                                  点击查看答案
                                </span>
                              </summary>
                              <div className="px-4 pb-4 border-t border-[#1E293B] pt-4">
                                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                                  {q.answer || q.bestAnswer || q.a}
                                </p>
                                {q.difficulty && (
                                  <div className="mt-3 flex items-center gap-2">
                                    <span className="text-xs text-slate-600">难度:</span>
                                    <div className="flex gap-1">
                                      {Array.from({ length: 5 }).map((_, si) => (
                                        <div
                                          key={si}
                                          className="w-2 h-2 rounded-full"
                                          style={{
                                            backgroundColor:
                                              si < q.difficulty ? "#10B981" : "#1E293B",
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </details>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : Array.isArray(questions) ? (
                  <div className="space-y-4">
                    {questions.map((q: any, qi: number) => (
                      <details
                        key={qi}
                        className="group rounded-xl border border-[#1E293B] bg-[#0B0E14] overflow-hidden"
                      >
                        <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1E293B]/50 transition-colors">
                          <span className="text-sm font-medium text-slate-300 pr-4">
                            Q{qi + 1}: {q.question || q.q}
                          </span>
                          <span className="text-xs text-slate-600 shrink-0">点击查看答案</span>
                        </summary>
                        <div className="px-4 pb-4 border-t border-[#1E293B] pt-4">
                          <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                            {q.answer || q.bestAnswer || q.a}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                ) : null}
              </div>
            )}

            <Separator className="my-8 bg-[#1E293B]" />

            {/* Prev / Next navigation */}
            <div className="flex items-stretch gap-4">
              {prevUnit ? (
                <Link
                  href={`/orbit/${trackSlug}/module/${moduleType}/${prevUnit.slug}`}
                  className="flex-1 group rounded-xl border border-[#1E293B] bg-[#131A2B] p-4 hover:border-[#3B82F6] transition-all"
                >
                  <span className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                    <ArrowLeft className="h-3 w-3" /> 上一单元
                  </span>
                  <span className="text-sm text-slate-300 group-hover:text-white font-medium">
                    {prevUnit.title}
                  </span>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextUnit ? (
                <Link
                  href={`/orbit/${trackSlug}/module/${moduleType}/${nextUnit.slug}`}
                  className="flex-1 group rounded-xl border border-[#1E293B] bg-[#131A2B] p-4 hover:border-[#3B82F6] transition-all text-right"
                >
                  <span className="text-xs text-slate-500 flex items-center justify-end gap-1 mb-1">
                    下一单元 <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="text-sm text-slate-300 group-hover:text-white font-medium">
                    {nextUnit.title}
                  </span>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
