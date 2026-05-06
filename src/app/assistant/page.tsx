"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Sparkles,
  User,
  Loader2,
  ArrowLeft,
  Compass,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  recommendations?: { type: string; name: string; slug: string }[];
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "欢迎来到全屏助手模式！这里可以进行深度技术问答和面试模拟。\n\n💡 试试这些：\n• \"推荐一个适合做实时协作工具的方案\"\n• \"开始 Python 全栈模拟面试\"\n• \"分析我的弱点并生成今日热身赛\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content, recommendations: data.recommendations },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "抱歉，助手暂时无法连接。" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Top bar */}
      <div className="border-b border-[#1E293B] p-4 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-slate-400">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Sparkles className="h-5 w-5 text-[#3B82F6]" />
        <h1 className="text-lg font-semibold text-slate-200">DevFusion 智能助手</h1>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 md:px-20" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-6 py-8">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={`rounded-2xl px-5 py-3 max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-[#3B82F6] text-white rounded-br-md"
                    : "bg-[#131A2B] text-slate-300 border border-[#1E293B] rounded-bl-md"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                {msg.recommendations && (
                  <div className="mt-4 space-y-2">
                    {msg.recommendations.map((rec, j) => (
                      <Link
                        key={j}
                        href={`/${rec.type === "track" ? "orbit" : "language-hub"}/${rec.slug}`}
                        className="flex items-center gap-3 rounded-xl bg-[#0B0E14] border border-[#1E293B] p-3 hover:border-[#3B82F6] transition-colors"
                      >
                        {rec.type === "track" ? (
                          <Compass className="h-5 w-5 text-[#3B82F6]" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-[#8B5CF6]" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-200">{rec.name}</p>
                          <p className="text-xs text-slate-500">
                            {rec.type === "track" ? "星轨方案" : "技术向量"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-[#1E293B] flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">AI 正在思考...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-[#1E293B] p-4 md:px-20">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="输入问题、项目描述或面试请求..."
            className="bg-[#131A2B] border-[#1E293B] text-slate-200 placeholder:text-slate-500 h-12 rounded-xl"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            size="icon"
            className="h-12 w-12 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90 rounded-xl"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-slate-600 text-center mt-2">
          配置 OPENAI_API_KEY 后可使用完整 AI 功能
        </p>
      </div>
    </div>
  );
}
