import { getTrackBySlug, getTracks, getUnitsByTrack } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { safeJsonParse } from "@/lib/utils";
import {
  Clock,
  TrendingUp,
  BookOpen,
  Code,
  Trophy,
  ArrowRight,
  Layers,
  ExternalLink,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackSlug: string }>;
}) {
  const { trackSlug } = await params;
  const track = await getTrackBySlug(trackSlug);
  if (!track) return { title: "未找到星轨" };
  return { title: `${track.name} - 星轨详情 - DevFusion Hub` };
}

export async function generateStaticParams() {
  const tracks = await getTracks();
  return tracks.map((track) => ({
    trackSlug: track.slug,
  }));
}

export const revalidate = 86400;

export default async function TrackDetailPage({
  params,
}: {
  params: Promise<{ trackSlug: string }>;
}) {
  const { trackSlug } = await params;
  const track = await getTrackBySlug(trackSlug);

  if (!track) notFound();

  const techStack = safeJsonParse(track.techStack, []);
  const units = await getUnitsByTrack(track.id);
  const foundationUnits = units.filter((u) => u.moduleType === "FOUNDATION");
  const projectUnits = units.filter((u) => u.moduleType === "PROJECT");
  const interviewUnits = units.filter((u) => u.moduleType === "INTERVIEW");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="border-b border-[#1E293B] py-16 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${track.color}10, #0B0E14)`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30">
              {track.category === "ai"
                ? "AI/ML"
                : track.category === "web"
                  ? "Web全栈"
                  : track.category}
            </Badge>
            <span className="text-sm text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {track.durationWeeks} 周
            </span>
            <span className="text-sm text-slate-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Lv.{track.difficulty}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            {track.name}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mb-6">
            {track.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech: { name: string }, i: number) => (
              <Badge
                key={i}
                variant="outline"
                className="border-[#1E293B] text-slate-400"
              >
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Architecture Diagram */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-[#1E293B] bg-[#131A2B] p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#3B82F6]" />
                技术栈架构
              </h3>
              <div className="space-y-3">
                {techStack.map((tech: { name: string }, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#0B0E14] border border-[#1E293B]"
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ background: track.color }}
                    />
                    <span className="text-sm text-slate-300">{tech.name}</span>
                    <div className="ml-auto text-xs text-slate-500">
                      Layer {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Course Tree */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="foundation" className="w-full">
              <TabsList className="bg-[#131A2B] border border-[#1E293B] p-1 rounded-xl mb-8 w-full justify-start">
                <TabsTrigger
                  value="foundation"
                  className="data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white text-slate-400 gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  强基 ({foundationUnits.length})
                </TabsTrigger>
                <TabsTrigger
                  value="project"
                  className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white text-slate-400 gap-2"
                >
                  <Code className="h-4 w-4" />
                  实战 ({projectUnits.length})
                </TabsTrigger>
                <TabsTrigger
                  value="interview"
                  className="data-[state=active]:bg-[#10B981] data-[state=active]:text-white text-slate-400 gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  面试 ({interviewUnits.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="foundation" className="space-y-4">
                {foundationUnits.map((unit) => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    trackSlug={track.slug}
                    color="#3B82F6"
                  />
                ))}
              </TabsContent>

              <TabsContent value="project" className="space-y-4">
                {projectUnits.map((unit) => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    trackSlug={track.slug}
                    color="#8B5CF6"
                  />
                ))}
                {(() => {
                  const raw = (track as any).externalProjects;
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

              <TabsContent value="interview" className="space-y-4">
                {interviewUnits.map((unit) => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    trackSlug={track.slug}
                    color="#10B981"
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function UnitCard({
  unit,
  trackSlug,
  color,
}: {
  unit: any;
  trackSlug: string;
  color: string;
}) {
  return (
    <Link
      href={`/orbit/${trackSlug}/module/${unit.moduleType.toLowerCase()}/${unit.slug}`}
      className="block rounded-xl border border-[#1E293B] bg-[#131A2B] p-5 hover:border-[#3B82F6] transition-all group"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-base font-semibold text-slate-200 group-hover:text-white">
            {unit.title}
          </h4>
          <p className="text-sm text-slate-500 mt-1">{unit.description}</p>
        </div>
        <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-[#3B82F6] group-hover:translate-x-1 transition-all" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1 h-1 bg-[#1E293B] rounded-full">
          <div
            className="h-1 rounded-full"
            style={{ width: `${(unit.difficulty / 5) * 100}%`, background: color }}
          />
        </div>
        <span className="text-xs text-slate-500">难度 {unit.difficulty}/5</span>
      </div>
    </Link>
  );
}
