export interface Track {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  techStack: string;
  estimatedHours: number;
  difficulty: number;
  level: string;
  durationWeeks: number;
  category: string;
}

export interface LanguageVector {
  id: string;
  name: string;
  slug: string;
  lang: string;
  description: string;
  techStack: string;
  difficulty: number;
  color: string;
  durationWeeks: number;
}

export interface CourseUnit {
  id: string;
  slug: string;
  title: string;
  description: string;
  moduleType: string;
  difficulty: number;
  orderIndex: number;
  mdxContent: string;
  phases?: any;
  questions?: any;
  trackId?: string;
  vectorId?: string;
}

export const tracks: Track[] = [
  {
    id: "1",
    name: "LiteLynx",
    slug: "litelynx",
    description: "Python + FastAPI + React 全栈之旅",
    color: "#06B6D4",
    techStack: '[{"name":"Python"},{"name":"FastAPI"},{"name":"React"},{"name":"PostgreSQL"},{"name":"Redis"}]',
    estimatedHours: 80,
    difficulty: 2,
    level: "Lv.1-2",
    durationWeeks: 10,
    category: "web",
  },
  {
    id: "2",
    name: "NeonStack",
    slug: "neonstack",
    description: "TypeScript + Next.js 企业级全栈",
    color: "#8B5CF6",
    techStack: '[{"name":"TypeScript"},{"name":"Next.js"},{"name":"Prisma"},{"name":"Tailwind"},{"name":"Vercel"}]',
    estimatedHours: 100,
    difficulty: 3,
    level: "Lv.2-3",
    durationWeeks: 12,
    category: "web",
  },
  {
    id: "3",
    name: "AI Alchemist",
    slug: "ai-alchemist",
    description: "LLM 应用开发与 RAG 工程",
    color: "#F59E0B",
    techStack: '[{"name":"LangChain"},{"name":"OpenAI"},{"name":"Weaviate"},{"name":"Python"},{"name":"FastAPI"}]',
    estimatedHours: 60,
    difficulty: 4,
    level: "Lv.3-4",
    durationWeeks: 8,
    category: "ai",
  },
  {
    id: "4",
    name: "CloudForge",
    slug: "cloudforge",
    description: "Go + Kubernetes 云原生实战",
    color: "#3B82F6",
    techStack: '[{"name":"Go"},{"name":"gRPC"},{"name":"Kubernetes"},{"name":"Docker"},{"name":"Prometheus"}]',
    estimatedHours: 90,
    difficulty: 4,
    level: "Lv.3-4",
    durationWeeks: 10,
    category: "cloud",
  },
  {
    id: "5",
    name: "MobileForge",
    slug: "mobileforge",
    description: "Kotlin Multiplatform 跨平台开发",
    color: "#22C55E",
    techStack: '[{"name":"Kotlin"},{"name":"Jetpack Compose"},{"name":"Spring Boot"},{"name":"Room"},{"name":"KMP"}]',
    estimatedHours: 70,
    difficulty: 3,
    level: "Lv.2-3",
    durationWeeks: 9,
    category: "mobile",
  },
  {
    id: "6",
    name: "DataVault",
    slug: "datavault",
    description: "Spark + Airflow 大数据处理",
    color: "#EC4899",
    techStack: '[{"name":"Apache Spark"},{"name":"Airflow"},{"name":"Kafka"},{"name":"PostgreSQL"},{"name":"Python"}]',
    estimatedHours: 80,
    difficulty: 4,
    level: "Lv.3-4",
    durationWeeks: 10,
    category: "data",
  },
];

export const vectors: LanguageVector[] = [
  {
    id: "v1",
    name: "Go+",
    slug: "go-plus",
    lang: "go",
    description: "Go 语言高级特性与微服务架构",
    techStack: '["Go", "gRPC", "Gin", "Docker"]',
    difficulty: 3,
    color: "#3B82F6",
    durationWeeks: 8,
  },
  {
    id: "v2",
    name: "Rust+",
    slug: "rust-plus",
    lang: "rust",
    description: "Rust 系统级编程与高性能服务",
    techStack: '["Rust", "Actix Web", "Tauri", "SQLx"]',
    difficulty: 4,
    color: "#F59E0B",
    durationWeeks: 10,
  },
  {
    id: "v3",
    name: "Python Core",
    slug: "python-core",
    lang: "python",
    description: "Python 深度进阶与设计模式",
    techStack: '["Python", "FastAPI", "Pydantic", "Asyncio"]',
    difficulty: 2,
    color: "#06B6D4",
    durationWeeks: 6,
  },
  {
    id: "v4",
    name: "TypeScript Pro",
    slug: "typescript-pro",
    lang: "typescript",
    description: "TypeScript 类型体操与工程实践",
    techStack: '["TypeScript", "Zod", "React", "Node.js"]',
    difficulty: 3,
    color: "#8B5CF6",
    durationWeeks: 8,
  },
];

export const courseUnits: CourseUnit[] = [
  {
    id: "u1",
    slug: "litelynx-f1-python-core",
    title: "Python 核心精微",
    description: "类型系统、异步编程、装饰器、元编程与内存管理深度剖析",
    moduleType: "FOUNDATION",
    difficulty: 1,
    orderIndex: 1,
    trackId: "1",
    mdxContent: `# Python 核心精微

## 为什么是 Python？

Python 在 2024 年 TIOBE 指数稳居第一。FastAPI 利用其类型提示实现自动文档和验证，使其成为全栈开发首选。

## 类型系统深度

\`\`\`python
from typing import Protocol, TypeVar, Generic

T = TypeVar('T', bound='Model')

class Repository(Protocol[T]):
    async def get(self, id: str) -> T | None: ...
    async def save(self, entity: T) -> T: ...
\`\`\`

## 异步编程本质

事件循环是单线程内的调度器，asyncio 适合 IO 密集型任务。`,
  },
  {
    id: "u2",
    slug: "litelynx-f2-fastapi-defense",
    title: "FastAPI 防御工事",
    description: "路由架构、依赖注入、中间件链、异常处理、性能调优",
    moduleType: "FOUNDATION",
    difficulty: 2,
    orderIndex: 2,
    trackId: "1",
    mdxContent: `# FastAPI 防御工事

## 路由架构设计

好的路由结构决定了 API 的可维护性。

## 依赖注入系统

FastAPI 的 Depends 支持嵌套依赖、缓存和 yield 模式。`,
  },
  {
    id: "u3",
    slug: "neonstack-f1-nextjs-core",
    title: "Next.js App Router 核心",
    description: "Server Components、路由系统、渲染策略、数据获取",
    moduleType: "FOUNDATION",
    difficulty: 2,
    orderIndex: 1,
    trackId: "2",
    mdxContent: `# Next.js App Router 核心

## React Server Components

Next.js 13+ 的 App Router 基于 RSC，默认所有组件在服务端渲染。

\`\`\`tsx
async function ProjectList() {
  const projects = await db.project.findMany();
  return <ul>{projects.map(p => <li>{p.title}</li>)}</ul>;
}
\`\`\``,
  },
  {
    id: "u4",
    slug: "neonstack-f2-ts-pro",
    title: "TypeScript 工程化专家",
    description: "泛型高级模式、类型体操、声明文件、monorepo 配置",
    moduleType: "FOUNDATION",
    difficulty: 2,
    orderIndex: 2,
    trackId: "2",
    mdxContent: `# TypeScript 工程化专家

## 泛型高级模式

\`\`\`typescript
type ApiResponse<T> = T extends { data: infer D } ? D : never;
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
\`\`\``,
  },
  {
    id: "u5",
    slug: "ai-alchemist-f1-langchain",
    title: "LangChain 核心抽象",
    description: "Chain、Agent、Tool、Memory 四大抽象及其实战应用",
    moduleType: "FOUNDATION",
    difficulty: 3,
    orderIndex: 1,
    trackId: "3",
    mdxContent: `# LangChain 核心抽象

## 四大核心抽象

- Chain：可组合的处理管道
- Agent：自主决策调用工具的智能体
- Tool：Agent 可调用的外部功能
- Memory：对话和状态的持久化`,
  },
  {
    id: "u6",
    slug: "ai-alchemist-f2-vector-db",
    title: "向量数据库与嵌入技术",
    description: "Embedding 原理、Weaviate 实战、语义搜索与聚类",
    moduleType: "FOUNDATION",
    difficulty: 3,
    orderIndex: 2,
    trackId: "3",
    mdxContent: `# 向量数据库与嵌入技术

## Embedding 原理

Embedding 将文本映射到高维向量空间，语义相似的文本在空间中距离更近。`,
  },
  {
    id: "u7",
    slug: "go-f1-gin-web",
    title: "Go Gin 高性能 Web 开发",
    description: "Gin 框架路由、中间件、依赖注入与 RESTful API 设计",
    moduleType: "FOUNDATION",
    difficulty: 2,
    orderIndex: 1,
    vectorId: "v1",
    mdxContent: `# Go Gin 高性能 Web 开发

## 为什么选择 Gin？

Gin 是 Go 生态中最流行的 HTTP Web 框架，比标准库快 40 倍。`,
  },
  {
    id: "u8",
    slug: "go-f2-grpc-micro",
    title: "Go gRPC 微服务通信",
    description: "Protobuf 定义、gRPC Server/Client、拦截器与负载均衡",
    moduleType: "FOUNDATION",
    difficulty: 3,
    orderIndex: 2,
    vectorId: "v1",
    mdxContent: `# Go gRPC 微服务通信

## Protobuf 服务定义

\`\`\`protobuf
service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
}
\`\`\``,
  },
  {
    id: "u9",
    slug: "rust-f1-core",
    title: "Rust 所有权与类型系统",
    description: "所有权、借用、生命周期、Trait 与泛型编程核心",
    moduleType: "FOUNDATION",
    difficulty: 3,
    orderIndex: 1,
    vectorId: "v2",
    mdxContent: `# Rust 所有权与类型系统

## 所有权机制

Rust 的所有权系统是保障内存安全的核心，无需 GC 也能避免内存泄漏。`,
  },
  {
    id: "u10",
    slug: "rust-f2-actix",
    title: "Rust Actix Web 高性能服务",
    description: "Actix Web 路由、中间件、异步数据库、状态管理",
    moduleType: "FOUNDATION",
    difficulty: 3,
    orderIndex: 2,
    vectorId: "v2",
    mdxContent: `# Rust Actix Web 高性能服务

## 为什么 Actix Web？

Actix Web 是 Techempower 基准测试中常年霸榜的 Rust Web 框架。`,
  },
  {
    id: "u11",
    slug: "litelynx-p1-devboard-pro",
    title: "DevBoard Pro：演进式全栈项目",
    description: "六阶段从单体到分布式，构建企业级项目管理看板",
    moduleType: "PROJECT",
    difficulty: 3,
    orderIndex: 5,
    trackId: "1",
    phases: [
      { name: "阶段 0 - 蓝图对齐", description: "明确系统全貌", tasks: ["API 规范", "ER 图", "原型设计"] },
      { name: "阶段 1 - 单体雏形", description: "FastAPI + Jinja2", tasks: ["项目骨架", "用户认证", "CRUD"] },
      { name: "阶段 2 - 前后端裂变", description: "React SPA", tasks: ["Vite + React", "拖拽功能", "状态管理"] },
    ],
    mdxContent: `# DevBoard Pro：演进式全栈项目

企业级项目管理看板，支持拖拽任务、实时协作和数据分析。`,
  },
  {
    id: "u12",
    slug: "litelynx-i1-interview",
    title: "LiteLynx 面试突破",
    description: "Python + FastAPI + React + 数据库 高频面试题精讲",
    moduleType: "INTERVIEW",
    difficulty: 3,
    orderIndex: 6,
    trackId: "1",
    questions: [
      {
        id: "py-001",
        group: "主语言深度",
        question: "Python 的 GIL 是什么？如何绕过其限制？",
        keywords: ["GIL", "多线程", "多进程"],
        bestAnswer: "GIL（全局解释器锁）是 CPython 中的互斥锁，保证同一时刻只有一个线程执行 Python 字节码。绕过方式：多进程、C扩展、异步编程。",
        difficulty: 3,
      },
      {
        id: "int-001",
        group: "集成接头点",
        question: "FastAPI 和 React 之间如何安全传输 JWT？",
        keywords: ["JWT", "CORS", "HttpOnly"],
        bestAnswer: "最佳实践：Token 存储在 httpOnly cookie 中，Access token 有效期 15min，CSRF 保护。",
        difficulty: 3,
      },
    ],
    mdxContent: `# LiteLynx 面试突破

本面试题库按"先答后核"模式设计：先自己作答 → 提交后查看高分拆解 → AI 评分。`,
  },
];

export const stats = {
  trackCount: tracks.length,
  vectorCount: vectors.length,
  unitCount: courseUnits.length,
  totalTracks: tracks.length,
  totalUnits: courseUnits.length,
  totalHours: tracks.reduce((sum, t) => sum + t.estimatedHours, 0),
  activeUsers: 12580,
};
