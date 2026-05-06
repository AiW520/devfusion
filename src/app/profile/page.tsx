import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  Target,
  BookOpen,
  AlertTriangle,
  Flame,
} from "lucide-react";

export const metadata = {
  title: "个人主页 - DevFusion Hub",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  const user = session.user;

  // Demo data for profile
  const learningDays = 28;
  const completedUnits = 12;
  const totalUnits = 36;
  const weaknesses = [
    { concept: "事件循环 (Event Loop)", severity: 3 },
    { concept: "Prisma N+1 查询优化", severity: 4 },
    { concept: "JWT Token 刷新策略", severity: 2 },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile header */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#131A2B] p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white text-2xl">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-100">
                {user.name || "学习者"}
              </h1>
              <p className="text-slate-500 mt-1">
                踏上架构师之路的第 {learningDays} 天
              </p>
            </div>
            <div className="flex items-center gap-3 text-center">
              <div>
                <div className="text-3xl font-bold text-[#3B82F6]">
                  {completedUnits}
                </div>
                <div className="text-xs text-slate-500 mt-1">已完成</div>
              </div>
              <div className="w-px h-10 bg-[#1E293B]" />
              <div>
                <div className="text-3xl font-bold text-[#8B5CF6]">
                  {learningDays}
                </div>
                <div className="text-xs text-slate-500 mt-1">学习天数</div>
              </div>
              <div className="w-px h-10 bg-[#1E293B]" />
              <div>
                <div className="text-3xl font-bold text-[#10B981]">
                  {totalUnits - completedUnits}
                </div>
                <div className="text-xs text-slate-500 mt-1">待完成</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress */}
            <Card className="border-[#1E293B] bg-[#131A2B]">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#3B82F6]" />
                  学习进度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">总体进度</span>
                      <span className="text-slate-300">
                        {completedUnits}/{totalUnits}
                      </span>
                    </div>
                    <Progress
                      value={(completedUnits / totalUnits) * 100}
                      className="h-2 bg-[#1E293B] [&>div]:bg-gradient-to-r [&>div]:from-[#3B82F6] [&>div]:to-[#8B5CF6]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center pt-4">
                    <div className="rounded-lg bg-[#0B0E14] p-3">
                      <div className="text-lg font-bold text-[#3B82F6]">
                        {Math.floor(completedUnits * 0.4)}
                      </div>
                      <div className="text-xs text-slate-500">强基完成</div>
                    </div>
                    <div className="rounded-lg bg-[#0B0E14] p-3">
                      <div className="text-lg font-bold text-[#8B5CF6]">
                        {Math.floor(completedUnits * 0.35)}
                      </div>
                      <div className="text-xs text-slate-500">实战完成</div>
                    </div>
                    <div className="rounded-lg bg-[#0B0E14] p-3">
                      <div className="text-lg font-bold text-[#10B981]">
                        {Math.floor(completedUnits * 0.25)}
                      </div>
                      <div className="text-xs text-slate-500">面试完成</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weakness topology */}
            <Card className="border-[#1E293B] bg-[#131A2B]">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                  弱点拓扑图
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weaknesses.map((w, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-[#0B0E14] border border-[#1E293B] p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            w.severity >= 4
                              ? "bg-[#EF4444]"
                              : w.severity >= 3
                                ? "bg-[#F59E0B]"
                                : "bg-[#3B82F6]"
                          }`}
                        />
                        <span className="text-sm text-slate-300">
                          {w.concept}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <div
                              key={j}
                              className={`h-1.5 w-2 rounded ${
                                j < w.severity
                                  ? "bg-[#EF4444]"
                                  : "bg-[#1E293B]"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500">严重度</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Streak */}
            <Card className="border-[#1E293B] bg-[#131A2B]">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-[#F59E0B]" />
                  学习热力
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#F59E0B]">
                    {learningDays}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    连续学习天数
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current plans */}
            <Card className="border-[#1E293B] bg-[#131A2B]">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#3B82F6]" />
                  学习计划
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-[#0B0E14] border border-[#1E293B] p-3">
                  <div className="text-sm font-medium text-slate-200">
                    LiteLynx 轻快全栈
                  </div>
                  <Progress
                    value={45}
                    className="h-1.5 mt-2 bg-[#1E293B] [&>div]:bg-[#3B82F6]"
                  />
                </div>
                <div className="rounded-lg bg-[#0B0E14] border border-[#1E293B] p-3">
                  <div className="text-sm font-medium text-slate-200">
                    Python + FastAPI + React
                  </div>
                  <Progress
                    value={30}
                    className="h-1.5 mt-2 bg-[#1E293B] [&>div]:bg-[#8B5CF6]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recent notes */}
            <Card className="border-[#1E293B] bg-[#131A2B]">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#10B981]" />
                  最近笔记
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-slate-400 p-2 rounded bg-[#0B0E14]">
                  "FastAPI 的依赖注入本质是参数化装饰器工厂..."
                </div>
                <div className="text-sm text-slate-400 p-2 rounded bg-[#0B0E14]">
                  "React Query 的状态同步比 Redux 更适合服务端状态..."
                </div>
                <div className="text-xs text-slate-500 text-center pt-2">
                  查看全部 8 条笔记 →
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
