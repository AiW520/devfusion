import { getTrackBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Code,
  Trophy,
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

const moduleTypeMap: Record<string, string> = {
  foundation: "FOUNDATION",
  project: "PROJECT",
  interview: "INTERVIEW",
};

const moduleLabelMap: Record<string, { label: string; icon: any; color: string }> = {
  foundation: { label: "强基模块", icon: BookOpen, color: "#3B82F6" },
  project: { label: "实战模块", icon: Code, color: "#8B5CF6" },
  interview: { label: "面试模块", icon: Trophy, color: "#10B981" },
};

export default async function OrbitModulePage({
  params,
}: {
  params: Promise<{ trackSlug: string; moduleType: string }>;
}) {
  const { trackSlug, moduleType } = await params;
  const track = await getTrackBySlug(trackSlug);
  if (!track) notFound();

  const dbModuleType = moduleTypeMap[moduleType];
  if (!dbModuleType) notFound();

  const moduleUnits = track.units.filter(
    (tu) => tu.unit.moduleType === dbModuleType
  );

  const moduleMeta = moduleLabelMap[moduleType];
  const ModuleIcon = moduleMeta.icon;

  return (
    <div className="min-h-screen">
      {/* Module header */}
      <div
        className="border-b border-[#1E293B] py-12"
        style={{
          background: `linear-gradient(135deg, ${moduleMeta.color}10, #0B0E14)`,
        }}
      >
        <div className="container mx-auto px-4">
          <Link
            href={`/orbit/${trackSlug}`}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#3B82F6] mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回 {track.name}
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <ModuleIcon
              className="h-8 w-8"
              style={{ color: moduleMeta.color }}
            />
            <h1 className="text-3xl font-bold text-slate-100">
              {moduleMeta.label}
            </h1>
          </div>
          <p className="text-slate-400">
            {track.name} · {moduleUnits.length} 个课程单元
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - unit navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-[#1E293B] bg-[#131A2B] overflow-hidden">
              <div className="p-4 border-b border-[#1E293B]">
                <h3 className="text-sm font-semibold text-slate-300">
                  课程单元
                </h3>
              </div>
              <ScrollArea className="h-[60vh]">
                <div className="p-2">
                  {moduleUnits.map((tu, i) => (
                    <a
                      key={tu.id}
                      href={`#unit-${tu.unit.slug}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        i === 0
                          ? "bg-[#0B0E14] text-[#3B82F6] border border-[#1E293B]"
                          : "text-slate-400 hover:text-slate-200 hover:bg-[#0B0E14]"
                      }`}
                    >
                      <span className="text-xs opacity-60">{i + 1}</span>
                      <span className="truncate">{tu.unit.title}</span>
                    </a>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-8">
            {moduleUnits.map((tu, i) => (
              <Card
                key={tu.id}
                id={`unit-${tu.unit.slug}`}
                className="border-[#1E293B] bg-[#131A2B] scroll-mt-24"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{
                        backgroundColor: `${moduleMeta.color}20`,
                        color: moduleMeta.color,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-slate-100">
                        {tu.unit.title}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {tu.unit.description}
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-[#1E293B] mb-4" />

                  {/* Content preview */}
                  <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap line-clamp-[12] font-mono bg-[#0B0E14] rounded-lg p-4 border border-[#1E293B]">
                    {tu.unit.mdxContent.substring(0, 500)}
                    {tu.unit.mdxContent.length > 500 && "..."}
                  </div>

                  {/* Module-specific actions */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    {dbModuleType === "FOUNDATION" && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                        包含知识检查点
                      </div>
                    )}
                    {dbModuleType === "PROJECT" && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Code className="h-4 w-4 text-[#8B5CF6]" />
                        含代码快照与检验清单
                      </div>
                    )}
                    {dbModuleType === "INTERVIEW" && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Lightbulb className="h-4 w-4 text-[#F59E0B]" />
                        先答后核模式
                      </div>
                    )}
                    <Link
                        href={`/orbit/${trackSlug}/module/${moduleType}/${tu.unit.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-all"
                        style={{ backgroundColor: moduleMeta.color }}
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
