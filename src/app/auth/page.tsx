"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("请填写邮箱和密码");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });
      if (result?.error) {
        toast.error("邮箱或密码错误");
      } else {
        toast.success("登录成功！");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("登录失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      toast.error("请填写所有字段");
      return;
    }
    if (regPassword.length < 6) {
      toast.error("密码至少6位");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "注册失败");
        return;
      }
      toast.success("注册成功！正在自动登录...");
      // Auto-login after register
      const signInResult = await signIn("credentials", {
        email: regEmail,
        password: regPassword,
        redirect: false,
      });
      if (signInResult?.error) {
        toast.error("自动登录失败，请手动登录");
        setTab("login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("注册失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <Card className="w-full max-w-md border-[#1E293B] bg-[#131A2B]">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-2xl text-slate-100">
            欢迎来到 DevFusion Hub
          </CardTitle>
          <p className="text-sm text-slate-500 mt-2">
            开始你的架构师之旅
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "login" | "register")}
          >
            <TabsList className="w-full bg-[#0B0E14] border border-[#1E293B] rounded-xl mb-6">
              <TabsTrigger
                value="login"
                className="flex-1 data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white text-slate-400"
              >
                登录
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="flex-1 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white text-slate-400"
              >
                注册
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type="email"
                    placeholder="邮箱地址"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10 bg-[#0B0E14] border-[#1E293B] text-slate-200 placeholder:text-slate-500 h-11 rounded-xl"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="密码"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10 pr-10 bg-[#0B0E14] border-[#1E293B] text-slate-200 placeholder:text-slate-500 h-11 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90 text-white"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "登录"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type="text"
                    placeholder="用户名"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="pl-10 bg-[#0B0E14] border-[#1E293B] text-slate-200 placeholder:text-slate-500 h-11 rounded-xl"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type="email"
                    placeholder="邮箱地址"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="pl-10 bg-[#0B0E14] border-[#1E293B] text-slate-200 placeholder:text-slate-500 h-11 rounded-xl"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="密码（至少6位）"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="pl-10 pr-10 bg-[#0B0E14] border-[#1E293B] text-slate-200 placeholder:text-slate-500 h-11 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:opacity-90 text-white"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "创建账号"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-slate-600 text-center pt-4">
            {tab === "register"
              ? "注册即表示同意 DevFusion Hub 的服务条款和隐私政策"
              : "登录后即可访问所有学习资源和AI助手"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
