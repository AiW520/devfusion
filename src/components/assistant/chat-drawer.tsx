"use client";

import { useState, useRef, useEffect } from "react";
import { useUIStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  X,
  Send,
  Sparkles,
  User,
  Loader2,
  Compass,
  BookOpen,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  recommendations?: { type: "track" | "vector"; name: string; slug: string }[];
}

export function ChatDrawer() {
  const { assistantOpen, setAssistantOpen } = useUIStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "你好！我是 DevFusion 智能助手。我可以帮你：\n\n✨ 推荐适合你的学习星轨或技术向量\n📚 解答技术问题（优先引用课程内容）\n🎯 分析你的学习弱点并提供针对性练习\n\n告诉我你想做什么项目，或想学什么技术？",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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

      if (!res.ok) {
        // Fallback: show info about API key not set
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "✨ 智能助手需要配置 OpenAI API Key。\n\n请在 `.env` 文件中设置 `OPENAI_API_KEY` 后即可使用完整的 AI 功能。\n\n当前你可以：\n• 浏览星轨系统了解集成方案\n• 探索语言中枢学习技术向量\n• 查看课程内容与面试题库",
            recommendations: [
              { type: "track", name: "LiteLynx 全栈方案", slug: "lite-lynx" },
              { type: "track", name: "NeonStack SSG方案", slug: "neon-stack" },
            ],
          },
        ]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content,
          recommendations: data.recommendations,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "抱歉，助手暂时无法连接。请确保已配置 OPENAI_API_KEY 环境变量。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={assistantOpen} onOpenChange={setAssistantOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#0B0E14] border-l border-[#1E293B] p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b border-[#1E293B] shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-slate-200">
              <Sparkles className="h-5 w-5 text-[#3B82F6]" />
              DevFusion 智能助手
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAssistantOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : ""
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
                    msg.role === "user"
                      ? "bg-[#3B82F6] text-white"
                      : "bg-[#131A2B] text-slate-300 border border-[#1E293B]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.recommendations.map((rec, j) => (
                        <a
                          key={j}
                          href={`/${
                            rec.type === "track" ? "orbit" : "language-hub"
                          }/${rec.slug}`}
                          className="flex items-center gap-2 rounded-md bg-[#0B0E14] border border-[#1E293B] p-2 hover:border-[#3B82F6] transition-colors"
                        >
                          {rec.type === "track" ? (
                            <Compass className="h-4 w-4 text-[#3B82F6]" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-[#8B5CF6]" />
                          )}
                          <div>
                            <p className="text-xs font-medium text-slate-300">
                              {rec.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {rec.type === "track" ? "星轨方案" : "技术向量"}
                            </p>
                          </div>
                        </a>
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

        <div className="p-4 border-t border-[#1E293B] shrink-0">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="输入问题或项目描述..."
              className="bg-[#131A2B] border-[#1E293B] text-slate-200 placeholder:text-slate-500"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              size="icon"
              className="bg-[#3B82F6] hover:bg-[#2563EB]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
