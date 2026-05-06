import { getVectorBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Code,
  Trophy,
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const moduleTypeMap: Record<string, string> = {
  foundation: "FOUNDATION",
  project: "PROJECT",
  interview: "INTERVIEW",
};

const moduleMeta: Record<string, { label: string; icon: any; color: string }> = {
  foundation: { label: "强基模块", icon: BookOpen, color: "#3B82F6" },
  project: { label: "实战模块", icon: Code, color: "#8B5CF6" },
  interview: { label: "面试模块", icon: Trophy, color: "#10B981" },
};

export default async function VectorModulePage({
  params,
}: {
  params: Promise<{ lang: string; vectorSlug: string; moduleType: string }>;
}) {
  const { lang, vectorSlug, moduleType } = await params;
  const vector = await getVectorBySlug(vectorSlug);
  if (!vector) notFound();

  const dbModuleType = moduleTypeMap[moduleType];
  if (!dbModuleType) notFound();

  const moduleUnits = (vector as any).units?.filter(
    (vu: any) => vu.unit.moduleType === dbModuleType
  ) || [];

  const meta = moduleMeta[moduleType];
  const Icon = meta.icon;

  return (
    <div className="min-h-screen">
      <div
        className="border-b border-[#1E293B] py-12"
        style={{ background: `linear-gradient(135deg, ${meta.color}10, #0B0E14)` }}
      >
        <div className="container mx-auto px-4">
          <Link
            href={`/language-hub/${lang}/${vectorSlug}`}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#8B5CF6] mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回 {vector.name}
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <Icon className="h-8 w-8" style={{ color: meta.color }} />
            <h1 className="text-3xl font-bold text-slate-100">{meta.label}</h1>
          </div>
          <p className="text-slate-400">
            {vector.name} · {moduleUnits.length} 个课程单元
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-[#1E293B] bg-[#131A2B] overflow-hidden">
              <div className="p-4 border-b border-[#1E293B]">
                <h3 className="text-sm font-semibold text-slate-300">课程单元</h3>
              </div>
              <ScrollArea className="h-[60vh]">
                <div className="p-2">
                  {moduleUnits.map((vu: any, i: number) => (
                    <a
                      key={vu.id}
                      href={`#unit-${vu.unit.slug}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        i === 0
                          ? "bg-[#0B0E14] text-[#8B5CF6] border border-[#1E293B]"
                          : "text-slate-400 hover:text-slate-200 hover:bg-[#0B0E14]"
                      }`}
                    >
                      <span className="text-xs opacity-60">{i + 1}</span>
                      <span className="truncate">{vu.unit.title}</span>
                    </a>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            {moduleUnits.map((vu: any, i: number) => (
              <Card
                key={vu.id}
                id={`unit-${vu.unit.slug}`}
                className="border-[#1E293B] bg-[#131A2B] scroll-mt-24"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-slate-100">{vu.unit.title}</h2>
                      <p className="text-sm text-slate-500">{vu.unit.description}</p>
                    </div>
                  </div>

                  <Separator className="bg-[#1E293B] mb-4" />

                  <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap line-clamp-[12] font-mono bg-[#0B0E14] rounded-lg p-4 border border-[#1E293B]">
                    {vu.unit.mdxContent.substring(0, 500)}
                    {vu.unit.mdxContent.length > 500 && "..."}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      {dbModuleType === "FOUNDATION" && (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                          包含知识检查点
                        </>
                      )}
                      {dbModuleType === "PROJECT" && (
                        <>
                          <Code className="h-4 w-4 text-[#8B5CF6]" />
                          含代码快照与检验清单
                        </>
                      )}
                      {dbModuleType === "INTERVIEW" && (
                        <>
                          <Lightbulb className="h-4 w-4 text-[#F59E0B]" />
                          先答后核模式
                        </>
                      )}
                    </div>
                    <Link
                        href={`/language-hub/${lang}/${vectorSlug}/module/${moduleType}/${vu.unit.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-all"
                        style={{ backgroundColor: meta.color }}
                      >
                        开始学习 <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
