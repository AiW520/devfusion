import { NextRequest } from "next/server";

const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  if (!apiKey || apiKey.startsWith("sk-your")) {
    return Response.json({
      content:
        "✨ DeepSeek API Key 尚未配置。\n\n请在 `.env` 文件中设置：\n• `DEEPSEEK_API_KEY` - 你的 DeepSeek API 密钥\n• `DEEPSEEK_MODEL` - 模型名称（如 deepseek-chat, deepseek-reasoner）\n\n🔗 获取 API Key: https://platform.deepseek.com/api_keys\n\n配置后重启开发服务器即可使用完整 AI 功能。\n\n当前你可以浏览下方推荐的星轨方案开始学习 👇",
      recommendations: [
        { type: "track", name: "LiteLynx 全栈方案", slug: "lite-lynx" },
        { type: "track", name: "NeonStack SSG方案", slug: "neon-stack" },
        { type: "track", name: "AI Alchemist AI方案", slug: "ai-alchemist" },
      ],
    });
  }

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: `你是 DevFusion Hub 的智能学习助手（基于 DeepSeek）。你是全栈架构师导师，帮助用户规划学习路径。

核心职责：
1. **推荐星轨/向量**：根据用户的项目目标或职业规划，推荐最匹配的学习方案
2. **技术问答**：解答编程、架构、面试相关问题，优先引用课程知识
3. **学习诊断**：分析用户弱点，给出针对性建议
4. **代码审查**：提供代码优化和最佳实践建议

可推荐资源：
星轨方案（完整集成方案）：
- LiteLynx：Python + FastAPI + React + PostgreSQL + Redis（轻快全栈，8周）
- NeonStack：Next.js + TypeScript + Prisma + MySQL + Redis（SSG/SSR混合，10周）
- AI Alchemist：Python + FastAPI + LangChain + Weaviate + React（AI应用全栈，12周）

技术向量（主语言切入）：
Python+: FastAPI+React, FastAPI+LangChain, Django+React, Flask+Vue, Pandas+FastAPI
Java+: Spring Boot+React, Spring Cloud微服务, Spring+Android
TypeScript+: Next.js+NestJS, Next.js+Prisma, Express+React

回复要求：
- 用中文回答，专业且鼓励
- 推荐具体星轨或向量时给出理由
- 若问题超出课程范围，标注"扩展知识"并引导回平台学习
- 代码示例要完整可运行`,
          },
          ...messages.map((m: any) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("DeepSeek API error:", err);
      return Response.json(
        {
          content: "DeepSeek API 调用失败。请检查 API Key 是否正确、账户是否有余额。",
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content =
      data.choices?.[0]?.message?.content || "AI 未生成回答，请重试。";

    // Try to detect recommendations from content for inline cards
    const recommendations: { type: string; name: string; slug: string }[] = [];
    const recPatterns = [
      { pattern: /LiteLynx/i, type: "track", name: "LiteLynx", slug: "lite-lynx" },
      { pattern: /NeonStack/i, type: "track", name: "NeonStack", slug: "neon-stack" },
      { pattern: /AI Alchemist/i, type: "track", name: "AI Alchemist", slug: "ai-alchemist" },
      { pattern: /Python \+ FastAPI \+ React/i, type: "vector", name: "Python + FastAPI + React", slug: "python-fastapi-react" },
      { pattern: /Python \+ FastAPI \+ LangChain/i, type: "vector", name: "Python + FastAPI + LangChain", slug: "python-fastapi-langchain" },
    ];
    for (const rec of recPatterns) {
      if (rec.pattern.test(content) && recommendations.length < 3) {
        if (!recommendations.find((r) => r.slug === rec.slug)) {
          recommendations.push({ type: rec.type, name: rec.name, slug: rec.slug });
        }
      }
    }

    return Response.json({ content, recommendations });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { content: "AI 服务暂时不可用。请检查网络连接和 API 配置。" },
      { status: 500 }
    );
  }
}
