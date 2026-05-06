import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============ CONTENT LIBRARY ============

interface UnitSeed {
  slug: string;
  title: string;
  description: string;
  moduleType: string;
  difficulty: number;
  orderIndex: number;
  mdxContent: string;
  phases?: any;
  questions?: any;
}

const courseUnits: UnitSeed[] = [
  // ==================== LITELYNX ====================
  {
    slug: "litelynx-f1-python-core",
    title: "Python 核心精微",
    description: "类型系统、异步编程、装饰器、元编程与内存管理深度剖析",
    moduleType: "FOUNDATION",
    difficulty: 1,
    orderIndex: 1,
    mdxContent: `# Python 核心精微

## 为什么是 Python？

Python 在 2024 年 TIOBE 指数稳居第一。FastAPI 利用其类型提示实现自动文档和验证，使其成为全栈开发首选——从 Instagram 的后端到 Spotify 的数据管道，Python 无处不在。

## 类型系统深度

Python 3.12+ 的类型系统已趋成熟：

\`\`\`python
from typing import Protocol, TypeVar, Generic

T = TypeVar('T', bound='Model')

class Repository(Protocol[T]):
    async def get(self, id: str) -> T | None: ...
    async def save(self, entity: T) -> T: ...
    async def list(self, filters: dict) -> list[T]: ...

class UserRepo:
    async def get(self, id: str) -> User | None:
        return await db.query(User).filter(id=id).first()
\`\`\`

**Protocol vs ABC**：Protocol 是结构化子类型（鸭子类型），不需要显式继承，编译期检查接口一致性。

## 异步编程本质

事件循环 (Event Loop) 是单线程内的调度器：

\`\`\`python
import asyncio

async def fetch_all(urls: list[str]) -> list[dict]:
    async with aiohttp.ClientSession() as s:
        tasks = [s.get(u) for u in urls]
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        return [await r.json() if not isinstance(r, Exception) else None for r in responses]
\`\`\`

**关键理解**：asyncio 适合 IO 密集型，不适合 CPU 密集型。计算密集应用应使用 concurrent.futures.ProcessPoolExecutor。

## 装饰器与元编程

\`\`\`python
def retry(max_attempts: int = 3, backoff: float = 1.0):
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try: return await func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1: raise
                    await asyncio.sleep(backoff * (2 ** attempt))
        return wrapper
    return decorator
\`\`\`

**装饰器执行顺序**: 从内到外装饰，从外到内执行。

## 扭魔方练习

1. 修复以下代码的类型安全问题（提示：使用了 Any 遮蔽了类型）
2. 将同步的 requests 调用改为异步 aiohttp，并实现并发限制
3. 为一个 Repository 类实现重试装饰器

## 知识检查点

1. Python 的 async/await 与多线程分别适合什么场景？
2. Protocol 和 ABC 的核心区别是什么？
3. 装饰器栈的执行顺序是怎样的？为什么？`,
  },
  {
    slug: "litelynx-f2-fastapi-defense",
    title: "FastAPI 防御工事",
    description: "路由架构、依赖注入、中间件链、异常处理、性能调优",
    moduleType: "FOUNDATION",
    difficulty: 2,
    orderIndex: 2,
    mdxContent: `# FastAPI 防御工事

## 路由架构设计

好的路由结构决定了 API 的可维护性：

\`\`\`python
from fastapi import FastAPI, APIRouter

app = FastAPI(title="DevBoard Pro API", version="1.0.0")
v1 = APIRouter(prefix="/api/v1")
projects = APIRouter(prefix="/projects", tags=["projects"])

@projects.get("/", response_model=ProjectList)
async def list_projects(page: int = 1, limit: int = 20, db = Depends(get_db)):
    offset = (page - 1) * limit
    items = await db.query(Project).offset(offset).limit(limit).all()
    total = await db.query(Project).count()
    return {"items": items, "total": total, "page": page}

v1.include_router(projects)
app.include_router(v1)
\`\`\`

## 依赖注入系统

FastAPI 的 Depends 是最强大的特性之一。它支持：
- **嵌套依赖**：依赖可以有自己的依赖
- **缓存**：同一请求内相同依赖只调用一次
- **yield 依赖**：支持 setup/teardown 模式

\`\`\`python
def get_current_user(token: str = Depends(oauth2_scheme), db = Depends(get_db)):
    payload = decode_token(token)
    user = db.query(User).get(payload["sub"])
    if not user: raise HTTPException(401)
    return user
\`\`\`

## 中间件与异常处理

全局异常处理器构成 API 的防御工事：

\`\`\`python
@app.exception_handler(ValidationError)
async def validation_handler(request, exc):
    return JSONResponse({"detail": exc.errors(), "code": "VALIDATION_ERROR"}, status_code=422)

@app.middleware("http")
async def add_process_time(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    response.headers["X-Process-Time"] = f"{time.time() - start:.3f}s"
    return response
\`\`\`

## 性能优化清单

- 使用 asyncpg 代替 psycopg2（2-3x 提升）
- 启用 response_model 避免序列化未使用字段
- 对高频查询使用 lru_cache 缓存结果
- 配置 gunicorn + uvicorn workers`,
  },
  {
    slug: "litelynx-f3-react-state",
    title: "React 状态管理哲学",
    description: "组件化、Hooks 深度、React Query、状态分类与同步策略",
    moduleType: "FOUNDATION",
    difficulty: 2,
    orderIndex: 3,
    mdxContent: `# React 状态管理哲学

## 状态分类

**核心准则**：UI = f(state)。状态分四类：

| 类型 | 存放位置 | 示例 |
|------|---------|------|
| 服务端状态 | React Query | 用户列表、文章内容 |
| URL 状态 | URL params/searchParams | 搜索词、分页 |
| 客户端全局状态 | Zustand/Context | 主题、语言 |
| 局部 UI 状态 | useState | 输入框、展开/折叠 |

## React Query 深度

\`\`\`tsx
const { data, isLoading } = useQuery({
  queryKey: ["projects", page],
  queryFn: () => fetchProjects(page),
  staleTime: 30_000,          // 30s 内不重新请求
  gcTime: 5 * 60_000,         // 5min 后清理缓存
});

const mutation = useMutation({
  mutationFn: createProject,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  onError: (err) => toast.error(err.message),
});
\`\`\`

## 自定义 Hooks 模式

\`\`\`tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// 组合多个 hooks
function useProjectSearch() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  return useQuery({
    queryKey: ["projects", debouncedSearch],
    queryFn: () => searchProjects(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });
}
\`\`\`

## 组件最佳实践

1. **单一职责**：展示组件不处理数据获取
2. **组合优于继承**：用 children/render props
3. **状态上提**：共享状态放到最近的公共祖先
4. **React.memo 不是银弹**：只在昂贵渲染时使用`,
  },
  {
    slug: "litelynx-f4-postgres-redis",
    title: "PostgreSQL + Redis 数据层",
    description: "关系建模、索引策略、Redis 缓存模式、分布式锁",
    moduleType: "FOUNDATION",
    difficulty: 2,
    orderIndex: 4,
    mdxContent: `# PostgreSQL + Redis 数据层

## PostgreSQL 建模

\`\`\`sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id),
  status project_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_projects_owner_status ON projects(owner_id, status);
\`\`\`

**索引策略**：
- B-Tree：等值和范围查询（默认）
- GIN：全文搜索和数组查询
- BRIN：大表顺序数据（如日志时间戳）
- 部分索引：仅索引满足条件的行，节省空间

## Prisma ORM 查询优化

\`\`\`prisma
model Project {
  id     String   @id @default(cuid())
  title  String
  owner  User     @relation(fields: [ownerId], references: [id])
  ownerId String
  tasks  Task[]
  @@index([ownerId, status])
}
\`\`\`

使用 include 替代多次查询，利用 Prisma 的 DataLoader 避免 N+1。

## Redis 缓存模式

**Cache-Aside（旁路缓存）**：应用先查 Redis，miss 则查 DB 并回填。

\`\`\`python
async def get_project(project_id: str) -> dict | None:
    cached = await redis.get(f"project:{project_id}")
    if cached:
        return json.loads(cached)
    project = await db.query(Project).get(project_id)
    if project:
        await redis.setex(f"project:{project_id}", 300, json.dumps(project))
    return project
\`\`\`

**Write-Through**：写入时间时更新 DB 和缓存。

## Redis 分布式锁

使用 SET NX EX 实现简单分布式锁：

\`\`\`python
async def acquire_lock(key: str, ttl: int = 30) -> bool:
    token = str(uuid.uuid4())
    return await redis.set(f"lock:{key}", token, nx=True, ex=ttl)

async def release_lock(key: str, token: str):
    script = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end"
    await redis.eval(script, 1, f"lock:{key}", token)
\`\`\`

## 连接池配置

\`\`\`python
# FastAPI 中的数据库连接池
engine = create_async_engine(DATABASE_URL, pool_size=20, max_overflow=10, pool_pre_ping=True)
\`\`\`

pool_pre_ping 防止使用已被数据库端关闭的连接。`,
  },
  {
    slug: "litelynx-p1-devboard-pro",
    title: "DevBoard Pro：演进式全栈项目",
    description: "六阶段从单体到分布式，构建企业级项目管理看板",
    moduleType: "PROJECT",
    difficulty: 3,
    orderIndex: 5,
    mdxContent: `# DevBoard Pro：演进式全栈项目

## 项目概述

DevBoard Pro 是企业级项目管理看板，支持拖拽任务、实时协作和数据分析。不只是一个 Demo——它模拟真实生产环境的所有挑战。

## 核心功能矩阵

| 模块 | 功能 | 技术要点 |
|------|------|---------|
| 看板 | 拖拽列/卡片、泳道 | dnd-kit, 乐观更新 |
| 任务 | CRUD、标签、截止日 | React Query mutation |
| 协作 | 评论、@提及、通知 | WebSocket 实时推送 |
| 分析 | 燃尽图、吞吐量 | Chart.js, 数据聚合 |
| 团队 | 角色、权限 | RBAC 模型 |
`,
    phases: [
      {
        url: "",
        name: "阶段 0 - 蓝图对齐",
        description: "明确系统全貌：API 文档、数据模型、界面原型",
        tasks: [
          "用 OpenAPI 3.0 编写完整 API 规范（Swagger 可预览）",
          "绘制 ER 图：User, Board, Column, Card, Comment",
          "用 Figma 设计核心页面原型",
          "确定 Git 分支策略：main → develop → feature/*",
        ],
        deliverables: ["openapi.yaml", "er-diagram.png", "prototype-link"],
      },
      {
        url: "",
        name: "阶段 1 - 单体雏形",
        description: "FastAPI + Jinja2 快速验证核心业务",
        tasks: [
          "搭建 FastAPI 项目骨架（路由、数据库、模板）",
          "实现用户注册/登录（JWT）",
          "实现 Board CRUD + 简单前端模板",
          "编写核心模型单元测试",
        ],
        deliverables: ["完整单体应用（可运行）", "测试覆盖率 > 80%"],
      },
      {
        url: "",
        name: "阶段 2 - 前后端裂变",
        description: "React SPA + Vite + FastAPI REST，前后端分离",
        tasks: [
          "用 Vite + React + TypeScript 搭建前端",
          "实现看板拖拽（@dnd-kit）",
          "React Query 管理服务端状态",
          "处理 CORS 和 JWT 跨域认证",
        ],
        deliverables: ["前后端分离应用", "API 文档（自动生成）"],
      },
      {
        url: "",
        name: "阶段 3 - 工业骨架",
        description: "引入 PostgreSQL + Prisma + Redis 缓存 + Docker",
        tasks: [
          "SQLite → PostgreSQL 迁移 + Prisma Schema",
          "Redis 缓存热点数据（用户信息、看板数据）",
          "Docker Compose 编排：app + db + redis",
          "引入 Alembic 管理数据库迁移",
        ],
        deliverables: ["Docker Compose 一键启动", "缓存命中率 > 60%"],
      },
      {
        url: "",
        name: "阶段 4 - 生产加固",
        description: "认证增强、日志、监控、CI/CD",
        tasks: [
          "JWT refresh token + 黑名单机制",
          "结构化日志（structlog）",
          "Sentry 错误监控接入",
          "GitHub Actions CI/CD：lint → test → build → deploy",
        ],
        deliverables: ["CI/CD 流水线", "生产就绪的 Docker 镜像"],
      },
      {
        url: "",
        name: "阶段 5 - 波次攻击与优化",
        description: "性能压测、限流、降级、读写分离",
        tasks: [
          "Locust 压力测试（1000 并发用户）",
          "FastAPI rate limiting（slowapi）",
          "实现熔断降级（circuit breaker）",
          "撰写架构决策记录（ADR）",
        ],
        deliverables: ["性能报告", "ADR 文档", "优化清单"],
      },
    ],
  },
  {
    slug: "litelynx-i1-interview",
    title: "LiteLynx 面试突破",
    description: "Python + FastAPI + React + 数据库 高频面试题精讲",
    moduleType: "INTERVIEW",
    difficulty: 3,
    orderIndex: 6,
    mdxContent: `# LiteLynx 面试突破

## 面试结构

本面试题库按"先答后核"模式设计：先自己作答 → 提交后查看高分拆解 → AI 评分。

## 题目分组

共 65 题，分三组：主语言深度（25题）、集成接头点（25题）、架构决策（15题）。

以下是核心题目精选：`,
    questions: [
      {
        id: "py-001",
        group: "主语言深度",
        question: "Python 的 GIL 是什么？如何绕过其限制？",
        keywords: ["GIL", "多线程", "多进程", "C扩展"],
        bestAnswer: `GIL（全局解释器锁）是 CPython 中的互斥锁，保证同一时刻只有一个线程执行 Python 字节码。
绕过方式：
1. **多进程**（multiprocessing）：每个进程有独立 GIL
2. **C 扩展**：在 C 代码中释放 GIL（如 numpy 的数值计算）
3. **异步编程**：asyncio 单线程内协程切换
4. **其他 Python 实现**：Jython、IronPython 无 GIL
Python 3.13 引入了可选的无 GIL 模式（--disable-gil）。`,
        difficulty: 3,
      },
      {
        id: "py-002",
        group: "主语言深度",
        question: "Python 装饰器的执行顺序？多个装饰器如何工作？",
        keywords: ["装饰器", "闭包", "functools.wraps"],
        bestAnswer: `装饰器从内向外执行（靠近函数的先执行），但调用时从外向内。原理是装饰器语法糖：
@decorator_a
@decorator_b
def func(): pass
等价于 func = decorator_a(decorator_b(func))

执行顺序：先 decorator_b(func) 返回 wrapper_b，再 decorator_a(wrapper_b) 返回 wrapper_a。
调用 func() 时实际调用：decorator_a → decorator_b → 原函数。`,
        difficulty: 2,
      },
      {
        id: "int-001",
        group: "集成接头点",
        question: "FastAPI 和 React 之间如何安全传输 JWT？",
        keywords: ["JWT", "CORS", "HttpOnly", "XSS"],
        bestAnswer: `最佳实践：
1. Token 存储在 httpOnly cookie 中（防 XSS），而非 localStorage
2. Access token 有效期 15min，refresh token 7天
3. CORS 配置只允许前端域名
4. CSRF 保护：SameSite=Strict + CSRF token
5. 敏感操作要求重新认证`,
        difficulty: 3,
      },
      {
        id: "int-002",
        group: "集成接头点",
        question: "何时使用 Redis 缓存 vs 数据库直接查询？",
        keywords: ["缓存策略", "Redis", "性能", "一致性"],
        bestAnswer: `使用 Redis 缓存的场景：
- 热点数据：高频读取、低频修改（用户信息、配置）
- 会话存储：比数据库快 100x
- 计数器和排行榜：sorted set 天然支持
- 分布式锁：SET NX EX
- 限流：滑动窗口计数器

不适合的场景：
- 大对象（> 1MB）
- 需要复杂查询和事务
- 写多读少的场景`,
        difficulty: 2,
      },
      {
        id: "arch-001",
        group: "架构决策",
        question: "什么时候选择单体架构，什么时候选择微服务？",
        keywords: ["单体", "微服务", "架构演进", "康威定律"],
        bestAnswer: `选单体的理由：
- 团队 < 10 人，代码库可管理
- 产品早期，需求不确定，快速迭代
- 业务逻辑简单或高度内聚
- 微服务的管理开销 > 收益

选微服务的理由：
- 多团队独立开发部署
- 不同模块有不同的扩展需求
- 需要技术栈多样性
- 组织架构按业务线划分（康威定律）

最佳策略：从模块化单体开始，按需拆分。先有 monolith，后有 microservices。`,
        difficulty: 4,
      },
    ],
  },

  // ==================== NEONSTACK ====================
  {
    slug: "neonstack-f1-nextjs-core",
    title: "Next.js App Router 核心",
    description: "Server Components、路由系统、渲染策略、数据获取",
    moduleType: "FOUNDATION",
    difficulty: 2,
    orderIndex: 1,
    mdxContent: `# Next.js App Router 核心

## React Server Components 革命

Next.js 13+ 的 App Router 基于 RSC，默认所有组件在服务端渲染：

\`\`\`tsx
// 这是 Server Component - 可以直接访问数据库
async function ProjectList() {
  const projects = await db.project.findMany({ take: 10 });
  return (
    <ul>
      {projects.map(p => <ProjectCard key={p.id} project={p} />)}
    </ul>
  );
}
\`\`\`

**Server vs Client Component**：
- Server Component：无 JS bundle，直接访问数据源，不能使用 hooks
- Client Component：有交互（useState, useEffect 等），在浏览器水合

## 渲染策略选择

| 策略 | 适用场景 | 更新频率 |
|------|---------|---------|
| SSG | 博客、文档、营销页 | 部署时 |
| ISR | 产品列表、文章 | 按时间间隔 |
| SSR | 用户仪表盘、个性化内容 | 每次请求 |
| 流式 SSR | 大型页面，渐进式加载 | 部分优先 |

## Server Actions

不用创建 API 端点，直接在组件中调用服务端函数：

\`\`\`tsx
// app/actions.ts
"use server";
export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  await db.project.create({ data: { title, ownerId: getUserId() } });
  revalidatePath("/projects");
}
\`\`\`

## 中间件

\`\`\`tsx
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = { matcher: ["/dashboard/:path*"] };
\`\`\``,
  },
  {
    slug: "neonstack-f2-ts-pro",
    title: "TypeScript 工程化专家",
    description: "泛型高级模式、类型体操、声明文件、monorepo 配置",
    moduleType: "FOUNDATION",
    difficulty: 2,
    orderIndex: 2,
    mdxContent: `# TypeScript 工程化专家

## 泛型高级模式

\`\`\`typescript
// 条件类型 + infer
type ApiResponse<T> = T extends { data: infer D } ? D : never;
type UserData = ApiResponse<{ data: { name: string } }>; // { name: string }

// 模板字面量类型
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type ClickEvent = EventName<"click">; // "onClick"

// 映射类型 + 条件修饰符
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
\`\`\`

## 类型安全 API 设计

\`\`\`typescript
// 用 Zod 做运行时验证 + 类型推导
const ProjectSchema = z.object({
  title: z.string().min(1).max(255),
  status: z.enum(["draft", "active", "done"]),
  ownerId: z.string().uuid(),
});

type CreateProject = z.infer<typeof ProjectSchema>;
// 编译时类型 + 运行时验证 = 双重安全
\`\`\`

## 声明文件

\`\`\`typescript
// types/global.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      AUTH_SECRET: string;
    }
  }
}
export {};
\`\`\`

## Monorepo 中的 TS 配置

\`\`\`json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "paths": {
      "@shared/*": ["./packages/shared/src/*"],
      "@web/*": ["./apps/web/src/*"]
    }
  }
}
\`\`\``,
  },
  {
    slug: "neonstack-f3-prisma-mastery",
    title: "Prisma ORM 精通",
    description: "Schema 设计、高级查询、事务、迁移管理与性能调优",
    moduleType: "FOUNDATION",
    difficulty: 2,
    orderIndex: 3,
    mdxContent: `# Prisma ORM 精通

## Schema 设计原则

\`\`\`prisma
model Project {
  id        String   @id @default(cuid())
  title     String   @db.VarChar(255)
  slug      String   @unique
  status    Status   @default(DRAFT)
  owner     User     @relation(fields: [ownerId], references: [id])
  ownerId   String
  members   User[]   @relation("ProjectMembers")
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([ownerId, status])
}

enum Status { DRAFT  ACTIVE  ARCHIVED }
\`\`\`

## 高级查询技巧

\`\`\`typescript
// 嵌套写入
const project = await prisma.project.create({
  data: {
    title: "New Project",
    ownerId: userId,
    tasks: {
      create: [
        { title: "Task 1", priority: "HIGH" },
        { title: "Task 2", priority: "LOW" },
      ],
    },
  },
  include: { tasks: true },
});

// 聚合查询
const stats = await prisma.task.groupBy({
  by: ["status"],
  _count: { id: true },
  where: { projectId },
});
\`\`\`

## 事务处理

\`\`\`typescript
const [user, profile] = await prisma.$transaction([
  prisma.user.create({ data: { name, email } }),
  prisma.profile.create({ data: { userId: user.id, bio } }),
]);

// 交互式事务（需要条件判断时）
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.findUnique({ where: { id } });
  if (!user || user.balance < amount) throw new Error("Insufficient balance");
  return tx.transaction.create({ data: { userId: id, amount } });
});
\`\`\`

## 性能优化

1. **选择性字段**：\`select\` 替代 \`include\` 减少数据传输
2. **批量操作**：\`createMany\` / \`updateMany\` 替代循环
3. **连接池**：调整 connection_limit 匹配并发量
4. **查询日志**：开发时启用 log: ['query'] 分析慢查询`,
  },
  {
    slug: "neonstack-p1-neondash",
    title: "NeonDash：实时数据面板",
    description: "Next.js ISR + WebSocket 构建实时数据可视化面板",
    moduleType: "PROJECT",
    difficulty: 3,
    orderIndex: 4,
    mdxContent: `# NeonDash：实时数据面板

## 项目概述

构建企业实时数据可视化面板，展示公司核心 KPI 的实时变化。使用 Next.js ISR 混合渲染 + WebSocket 数据推送。

## 技术架构

\`\`\`
SSG 页面（5min ISR） + WebSocket 实时更新 = 秒开 + 实时
\`\`\`

- ISR 预渲染静态框架（布局、图表容器）
- WebSocket 推送实时数据点
- Chart.js 渲染图表`,
    phases: [
      {
        url: "",
        name: "阶段 0 - 数据模型与原型",
        description: "明确指标体系和数据流",
        tasks: ["定义 KPI 指标体系", "设计数据模型", "绘制原型"],
        deliverables: ["指标定义文档", "ER 图"],
      },
      {
        url: "",
        name: "阶段 1 - 静态面板 + ISR",
        description: "Next.js ISR 渲染静态面板",
        tasks: ["搭建 Next.js + Prisma", "实现 ISR 数据页面", "Chart.js 图表集成"],
        deliverables: ["ISR 面板应用"],
      },
      {
        url: "",
        name: "阶段 2 - 实时数据流",
        description: "WebSocket 实时推送",
        tasks: ["WebSocket 服务", "实时数据 Hook", "图表动态更新"],
        deliverables: ["实时面板应用"],
      },
      {
        url: "",
        name: "阶段 3 - 生产部署",
        description: "Docker + Vercel 部署",
        tasks: ["Docker Compose 编排", "Vercel 配置", "监控接入"],
        deliverables: ["生产部署配置"],
      },
    ],
  },
  {
    slug: "neonstack-i1-ts-nextjs-interview",
    title: "NeonStack 面试攻防",
    description: "TypeScript + Next.js + Prisma + 系统设计面试题",
    moduleType: "INTERVIEW",
    difficulty: 3,
    orderIndex: 5,
    mdxContent: `# NeonStack 面试攻防

涵盖 Next.js 全栈、TypeScript 深度、数据库设计和系统架构面试题。`,
    questions: [
      {
        id: "ts-001",
        group: "TypeScript 深度",
        question: "TypeScript 的 Conditional Types 如何工作？举一个实际使用场景。",
        keywords: ["Conditional Types", "infer", "类型体操"],
        bestAnswer: `Conditional Types 是 TypeScript 的类型级条件判断：T extends U ? X : Y
关键特性：
1. 分布式条件类型：当 T 是联合类型时，会分别应用到每个成员
2. infer 关键字：在条件类型中推断类型变量
实际场景：提取 Promise 的内部类型
type Awaited<T> = T extends Promise<infer U> ? U : T;`,
        difficulty: 4,
      },
      {
        id: "next-001",
        group: "Next.js 架构",
        question: "SSR 和 SSG 的性能权衡是什么？如何选择？",
        keywords: ["SSR", "SSG", "ISR", "TTFB", "CDN"],
        bestAnswer: `SSG：构建时生成 HTML，CDN 直接返回，TTFB 最优，但内容更新需重建。
SSR：请求时生成 HTML，TTFB 较高但总是最新内容。
ISR：SSG + 后台重新生成，兼顾两者优势。
选择策略：
- 内容变化频率 < 1次/天 → SSG
- 需要实时数据 → SSR
- 变化频率中等 → ISR（如 revalidate: 300）
- 混合：页面框架 SSG + 客户端请求动态数据`,
        difficulty: 3,
      },
    ],
  },

  // ==================== AI ALCHEMIST ====================
  {
    slug: "ai-alchemist-f1-langchain",
    title: "LangChain 核心抽象",
    description: "Chain、Agent、Tool、Memory 四大抽象及其实战应用",
    moduleType: "FOUNDATION",
    difficulty: 3,
    orderIndex: 1,
    mdxContent: `# LangChain 核心抽象

## 四大核心抽象

LangChain 的四个核心抽象构成了 AI 应用的基础：
- **Chain**：可组合的处理管道
- **Agent**：自主决策调用工具的智能体
- **Tool**：Agent 可调用的外部功能
- **Memory**：对话和状态的持久化

## Chain 的构建

\`\`\`python
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是 {role}，请用专业的方式回答问题。"),
    ("human", "{question}"),
])
chain = LLMChain(llm=llm, prompt=prompt)
response = chain.run(role="全栈架构师", question="如何设计高可用系统？")
\`\`\`

## RAG 管道

检索增强生成（RAG）是 LangChain 最常用的模式：

\`\`\`python
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Weaviate

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Weaviate.from_documents(docs, embeddings, client=client)

# 相似度检索
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
docs = retriever.get_relevant_documents("如何优化数据库查询？")
\`\`\``,
  },
  {
    slug: "ai-alchemist-f2-vector-db",
    title: "向量数据库与嵌入技术",
    description: "Embedding 原理、Weaviate 实战、语义搜索与聚类",
    moduleType: "FOUNDATION",
    difficulty: 3,
    orderIndex: 2,
    mdxContent: `# 向量数据库与嵌入技术

## Embedding 原理

Embedding 将文本映射到高维向量空间，语义相似的文本在空间中距离更近。

\`\`\`python
from openai import OpenAI
client = OpenAI()
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="如何优化数据库查询性能？"
)
vector = response.data[0].embedding  # 1536维向量
\`\`\`

## Weaviate 实战

\`\`\`python
import weaviate

client = weaviate.Client("http://localhost:8080")

# 创建 Schema
class_obj = {
    "class": "Document",
    "vectorizer": "none",
    "properties": [
        {"name": "content", "dataType": ["text"]},
        {"name": "source", "dataType": ["string"]},
    ],
}
client.schema.create_class(class_obj)

# 语义搜索
response = (
    client.query.get("Document", ["content", "source"])
    .with_near_vector({"vector": query_embedding})
    .with_limit(5)
    .do()
)
\`\`\`

## 混合搜索

结合语义搜索和关键词搜索，使用 reciprocal rank fusion：

- 语义搜索：捕捉同义词和概念相似性
- 关键词搜索（BM25）：精确匹配术语
- 融合：RRF 合并两种排序结果`,
  },
  {
    slug: "ai-alchemist-p1-ai-copilot",
    title: "AI CoPilot：企业知识助手",
    description: "RAG + Agent 构建企业内部知识库问答系统",
    moduleType: "PROJECT",
    difficulty: 4,
    orderIndex: 3,
    mdxContent: `# AI CoPilot：企业知识助手

## 项目概述

构建基于 RAG 的企业内部知识库问答系统，支持多种文档格式和智能检索。`,
    phases: [
      {
        url: "",
        name: "阶段 0 - 知识库设计",
        description: "文档处理管道设计",
        tasks: ["文档解析器（PDF/DOCX/MD）", "文本分块策略", "Embedding 选型"],
        deliverables: ["文档处理管道", "分块质量评估"],
      },
      {
        url: "",
        name: "阶段 1 - RAG 管道",
        description: "检索增强生成管道",
        tasks: ["向量存储（Weaviate）", "检索器实现", "LLM 生成管道"],
        deliverables: ["基础 QA 系统"],
      },
      {
        url: "",
        name: "阶段 2 - Agent 增强",
        description: "添加工具调用能力",
        tasks: ["定义工具集（搜索/计算/API）", "ReAct Agent 实现", "Memory 管理"],
        deliverables: ["Agent 增强 QA"],
      },
      {
        url: "",
        name: "阶段 3 - 生产化",
        description: "API 服务和前端",
        tasks: ["FastAPI 服务封装", "React 聊天 UI", "流式响应", "用户反馈收集"],
        deliverables: ["完整 AI 助手应用"],
      },
    ],
  },
  {
    slug: "ai-alchemist-i1-ml-interview",
    title: "AI 工程师面试锦囊",
    description: "ML 基础 + LLM 应用 + 系统工程面试题合集",
    moduleType: "INTERVIEW",
    difficulty: 4,
    orderIndex: 4,
    mdxContent: `# AI 工程师面试锦囊`,
    questions: [
      {
        id: "ml-001",
        group: "ML 基础",
        question: "Transformer 架构中 Attention 机制的计算过程？",
        keywords: ["Transformer", "Attention", "QKV", "Softmax"],
        bestAnswer: `Self-Attention 计算步骤：
1. 输入 X 通过线性变换得到 Q(Query), K(Key), V(Value)
2. 计算 Attention Score: S = Q × K^T / √d_k（缩放防止梯度消失）
3. Softmax 归一化: A = softmax(S)
4. 加权求和: Output = A × V
Multi-Head Attention 将上述过程并行执行 h 次，然后拼接结果。
复杂度：O(n²·d)，n 为序列长度，d 为隐藏维度。`,
        difficulty: 4,
      },
      {
        id: "llm-001",
        group: "LLM 应用",
        question: "RAG 和 Fine-tuning 的适用场景和成本对比？",
        keywords: ["RAG", "Fine-tuning", "成本", "实时性"],
        bestAnswer: `RAG 适用场景：
- 知识库频繁更新（不需要重新训练）
- 需要引用来源
- 成本敏感（只需 embedding 和检索基础设施）
Fine-tuning 适用场景：
- 需要学习特定的风格或格式
- 领域术语特殊，RAG 检索效果差
- 需要降低推理延迟（不需要额外检索步骤）
成本对比：RAG 初始低但有检索延迟；Fine-tuning 训练成本高但推理简单。`,
        difficulty: 3,
      },
    ],
  },

  // ==================== CLOUDFORGE (NEW TRACK) ====================
  {
    slug: "cloudforge-f1-golang-core",
    title: "Go 语言高并发核心",
    description: "Goroutine、Channel、并发模式、内存模型",
    moduleType: "FOUNDATION",
    difficulty: 3,
    orderIndex: 1,
    mdxContent: `# Go 语言高并发核心

## CSP 并发模型

Go 的并发基于 CSP（Communicating Sequential Processes）：

\`\`\`go
func fanOut(input <-chan int, workers int) []<-chan int {
    channels := make([]<-chan int, workers)
    for i := 0; i < workers; i++ {
        ch := make(chan int)
        go func(out chan int) {
            for v := range input {
                out <- v * v
            }
            close(out)
        }(ch)
        channels[i] = ch
    }
    return channels
}
\`\`\`

## Goroutine 调度

GMP 模型：G(Goroutine) → P(Processor) → M(Machine Thread)
- GOMAXPROCS 控制 P 的数量
- 阻塞系统调用时 M 和 P 分离
- work stealing 保持负载均衡

## Channel 模式

\`\`\`go
// 扇出-扇入
func fanIn(channels ...<-chan int) <-chan int {
    out := make(chan int)
    var wg sync.WaitGroup
    for _, ch := range channels {
        wg.Add(1)
        go func(c <-chan int) {
            defer wg.Done()
            for v := range c { out <- v }
        }(ch)
    }
    go func() { wg.Wait(); close(out) }()
    return out
}

// Context 取消传播
func worker(ctx context.Context, id int) error {
    select {
    case <-ctx.Done():
        return ctx.Err()
    case result := <-doWork(id):
        return nil
    }
}
\`\`\``,
  },
  {
    slug: "cloudforge-f2-docker-k8s",
    title: "Docker + Kubernetes 编排",
    description: "容器化、Pod 管理、Service 网络、Helm 部署",
    moduleType: "FOUNDATION",
    difficulty: 3,
    orderIndex: 2,
    mdxContent: `# Docker + Kubernetes 编排

## Docker 最佳实践

\`\`\`dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o server .

FROM alpine:3.19
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/server /server
USER nobody
EXPOSE 8080
CMD ["/server"]
\`\`\`

**分层优化**：先复制依赖文件再下载 → 利用 Docker 缓存

## Kubernetes 部署

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
spec:
  replicas: 3
  selector:
    matchLabels: {app: api}
  template:
    metadata:
      labels: {app: api}
    spec:
      containers:
      - name: api
        image: registry.example.com/api:v1.2.3
        ports:
        - containerPort: 8080
        resources:
          requests: {memory: "128Mi", cpu: "250m"}
          limits: {memory: "256Mi", cpu: "500m"}
        readinessProbe:
          httpGet: {path: /health, port: 8080}
          initialDelaySeconds: 5
\`\`\`

## Helm Chart 结构

\`\`\`
mychart/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
\`\`\``,
  },
  {
    slug: "cloudforge-p1-cloud-native-app",
    title: "CloudNative App：微服务实战",
    description: "Go 微服务 + gRPC + 服务网格 + 可观测性",
    moduleType: "PROJECT",
    difficulty: 4,
    orderIndex: 3,
    mdxContent: `# CloudNative App：微服务实战

构建基于 Go 的云原生微服务应用，包含用户服务、订单服务和通知服务。`,
    phases: [
      {
        url: "",
        name: "阶段 0 - 服务拆分",
        description: "DDD 限界上下文划分",
        tasks: ["事件风暴工作坊", "服务边界确定", "API 契约定义（Protobuf）"],
        deliverables: ["服务蓝图", "proto 文件"],
      },
      {
        url: "",
        name: "阶段 1 - 单服务开发",
        description: "Go + gRPC + PostgreSQL",
        tasks: ["用户服务实现", "订单服务实现", "gRPC 客户端/服务端"],
        deliverables: ["3个微服务"],
      },
      {
        url: "",
        name: "阶段 2 - 基础设施",
        description: "k8s 部署 + 服务网格",
        tasks: ["Dockerfile + k8s YAML", "Istio 注入", "Prometheus + Grafana"],
        deliverables: ["k8s 集群配置"],
      },
      {
        url: "",
        name: "阶段 3 - 生产加固",
        description: "可观测性 + CI/CD",
        tasks: ["分布式追踪（Jaeger）", "ArgoCD GitOps", "混沌工程测试"],
        deliverables: ["生产级集群"],
      },
    ],
  },

  // ==================== MOBILEFORGE (NEW TRACK) ====================
  {
    slug: "mobileforge-f1-kotlin-android",
    title: "Kotlin + Android 现代开发",
    description: "Jetpack Compose、协程、Flow、依赖注入",
    moduleType: "FOUNDATION",
    difficulty: 2,
    orderIndex: 1,
    mdxContent: `# Kotlin + Android 现代开发

## Jetpack Compose UI

\`\`\`kotlin
@Composable
fun TaskList(tasks: List<Task>, onTaskClick: (Task) -> Unit) {
    LazyColumn {
        items(tasks, key = { it.id }) { task ->
            TaskCard(
                task = task,
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onTaskClick(task) }
            )
        }
    }
}
\`\`\`

## 协程与 Flow

\`\`\`kotlin
class TaskViewModel(private val repo: TaskRepository) : ViewModel() {
    private val _tasks = MutableStateFlow<List<Task>>(emptyList())
    val tasks: StateFlow<List<Task>> = _tasks.asStateFlow()

    fun loadTasks() {
        viewModelScope.launch {
            repo.getTasks().collect { _tasks.value = it }
        }
    }
}
\`\`\`

## Hilt 依赖注入

\`\`\`kotlin
@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepo: AuthRepository
) : ViewModel() { ... }
\`\`\``,
  },
  {
    slug: "mobileforge-p1-taskapp",
    title: "TaskFlow：跨平台任务应用",
    description: "Kotlin Multiplatform + Spring Boot 构建跨平台任务管理",
    moduleType: "PROJECT",
    difficulty: 3,
    orderIndex: 2,
    mdxContent: `# TaskFlow：跨平台任务应用`,
    phases: [
      {
        url: "",
        name: "阶段 0 - 架构设计",
        tasks: ["定义共享数据模型（KMP）", "API 契约（OpenAPI）"],
        deliverables: ["共享模块设计"],
      },
      {
        url: "",
        name: "阶段 1 - Android + Spring",
        tasks: ["Compose UI 实现", "Spring Boot API", "Room 本地数据库"],
        deliverables: ["Android + 后端"],
      },
      {
        url: "",
        name: "阶段 2 - 跨平台共享",
        tasks: ["KMP 共享业务逻辑", "iOS 基础 UI"],
        deliverables: ["双平台应用"],
      },
    ],
  },

  // ==================== DATAVAULT (NEW TRACK) ====================
  {
    slug: "datavault-f1-spark-core",
    title: "Apache Spark 大数据处理",
    description: "Spark SQL、DataFrame API、流处理、性能调优",
    moduleType: "FOUNDATION",
    difficulty: 3,
    orderIndex: 1,
    mdxContent: `# Apache Spark 大数据处理

## DataFrame API

\`\`\`python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg, window

spark = SparkSession.builder.appName("ETL").getOrCreate()

df = spark.read.parquet("s3://bucket/events/")
df.filter(col("status") == "active") \
  .groupBy(window(col("timestamp"), "1 hour"), col("category")) \
  .agg(avg("value").alias("avg_value")) \
  .write.mode("append").parquet("s3://bucket/output/")
\`\`\`

## Spark SQL 优化

- **分区裁剪**：只读取需要的分区
- **谓词下推**：过滤条件尽可能早执行
- **Broadcast Join**：小表广播到所有节点
- **AQE**：自适应查询执行（Spark 3.0+）

## 流处理

\`\`\`python
stream = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "events") \
    .load()
\`\`\``,
  },
  {
    slug: "datavault-p1-data-pipeline",
    title: "DataPipeline：实时数据处理管道",
    description: "Spark Streaming + Airflow + PostgreSQL 构建数据管道",
    moduleType: "PROJECT",
    difficulty: 4,
    orderIndex: 2,
    mdxContent: `# DataPipeline：实时数据处理管道`,
    phases: [
      {
        url: "",
        name: "阶段 0 - 数据建模",
        tasks: ["数据源分析", "Star Schema 建模", "SLAs 定义"],
        deliverables: ["数据模型文档"],
      },
      {
        url: "",
        name: "阶段 1 - 批处理管道",
        tasks: ["Spark ETL Job", "Airflow DAG", "数据质量检查"],
        deliverables: ["批处理管道"],
      },
      {
        url: "",
        name: "阶段 2 - 实时管道",
        tasks: ["Kafka 接入", "Spark Structured Streaming", "实时仪表盘"],
        deliverables: ["实时管道"],
      },
    ],
  },
  // ==================== GO+ UNITS ====================
  {
    slug: "go-f1-gin-web",
    title: "Go Gin 高性能 Web 开发",
    description: "Gin 框架路由、中间件、依赖注入与 RESTful API 设计",
    moduleType: "FOUNDATION",
    difficulty: 2,
    orderIndex: 1,
    mdxContent: `# Go Gin 高性能 Web 开发

## 为什么选择 Gin？

Gin 是 Go 生态中最流行的 HTTP Web 框架，比标准库 net/http 快 40 倍。其零内存分配的路由设计使其成为高性能 API 首选。

\`\`\`go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    r.GET("/api/v1/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "status":  "ok",
            "version": "1.0.0",
        })
    })

    v1 := r.Group("/api/v1")
    {
        v1.GET("/users", listUsers)
        v1.POST("/users", createUser)
        v1.GET("/users/:id", getUser)
    }

    r.Run(":8080")
}
\`\`\`

## 中间件链

Gin 的中间件模型灵活强大：

\`\`\`go
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})
            return
        }
        c.Set("user", parseToken(token))
        c.Next()
    }
}

func LoggerMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        c.Next()
        duration := time.Since(start)
        log.Printf("%s %s %d %v", c.Request.Method, c.Request.URL, c.Writer.Status(), duration)
    }
}
\`\`\`

## 模型绑定与验证

\`\`\`go
type CreateUserRequest struct {
    Name  string \`json:"name" binding:"required,min=2,max=50"\`
    Email string \`json:"email" binding:"required,email"\`
    Age   int    \`json:"age" binding:"gte=0,lte=130"\`
}

func createUser(c *gin.Context) {
    var req CreateUserRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    // 业务逻辑...
}
\`\`\`

## 扭魔方练习

1. 实现一个限流中间件（令牌桶算法）
2. 为 CRUD API 添加统一的错误处理和响应格式
3. 实现优雅关闭（graceful shutdown）`,
  },
  {
    slug: "go-f2-grpc-micro",
    title: "Go gRPC 微服务通信",
    description: "Protobuf 定义、gRPC Server/Client、拦截器与负载均衡",
    moduleType: "FOUNDATION",
    difficulty: 3,
    orderIndex: 2,
    mdxContent: `# Go gRPC 微服务通信

## Protobuf 服务定义

\`\`\`protobuf
syntax = "proto3";
package user.v1;

service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
  rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
}

message GetUserRequest {
  string id = 1;
}

message GetUserResponse {
  User user = 1;
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
}
\`\`\`

## gRPC Server 实现

\`\`\`go
type UserServer struct {
    pb.UnimplementedUserServiceServer
    db *sql.DB
}

func (s *UserServer) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.GetUserResponse, error) {
    user, err := s.db.QueryRowContext(ctx, "SELECT id, name, email FROM users WHERE id = ?", req.Id).Scan(...)
    if err != nil {
        return nil, status.Errorf(codes.NotFound, "user not found")
    }
    return &pb.GetUserResponse{User: &pb.User{...}}, nil
}

func main() {
    lis, _ := net.Listen("tcp", ":50051")
    s := grpc.NewServer(
        grpc.UnaryInterceptor(loggingInterceptor),
    )
    pb.RegisterUserServiceServer(s, &UserServer{db: db})
    s.Serve(lis)
}
\`\`\`

## 拦截器与超时控制

- **UnaryInterceptor**：统一日志、认证、限流
- **StreamInterceptor**：流式调用拦截
- **Context Deadline**：设置超时防止雪崩

## 扭魔方练习

1. 实现 gRPC 客户端的连接池管理
2. 添加 Retry 和 Circuit Breaker 拦截器
3. 为 gRPC 服务添加健康检查端点`,
  },

  // ==================== RUST+ UNITS ====================
  {
    slug: "rust-f1-core",
    title: "Rust 所有权与类型系统",
    description: "所有权、借用、生命周期、Trait 与泛型编程核心",
    moduleType: "FOUNDATION",
    difficulty: 3,
    orderIndex: 1,
    mdxContent: `# Rust 所有权与类型系统

## 所有权机制

Rust 的所有权系统是保障内存安全的核心，无需 GC 也能避免内存泄漏：

\`\`\`rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;  // s1 移到了 s2，s1 不再有效

    // println!("{}", s1);  // 编译错误！s1 已被移动

    let s3 = s2.clone();  // 显式复制
    println!("s2: {}, s3: {}", s2, s3);  // 两者都有效
}

fn take_ownership(s: String) {  // s 获取所有权
    println!("{}", s);
}  // s 离开作用域，内存释放

fn borrow(s: &String) {  // 不可变借用
    println!("{}", s);
}  // 借用到此结束，原变量仍有效
\`\`\`

## 借用与生命周期

\`\`\`rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

struct Excerpt<'a> {
    part: &'a str,
}
\`\`\`

## Trait 系统

\`\`\`rust
trait Repository {
    type Entity;
    fn find(&self, id: &str) -> Option<Self::Entity>;
    fn save(&self, entity: Self::Entity) -> Result<Self::Entity, Error>;
}

struct UserRepo<'a> {
    pool: &'a PgPool,
}

impl<'a> Repository for UserRepo<'a> {
    type Entity = User;

    fn find(&self, id: &str) -> Option<User> {
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(id)
            .fetch_optional(self.pool)
            .await
            .ok()?
    }

    fn save(&self, user: User) -> Result<User, Error> {
        // INSERT ... RETURNING
        todo!()
    }
}
\`\`\`

## 错误处理

Rust 使用 \`Result<T, E>\` 代替异常，\`?\` 操作符简化传播：

\`\`\`rust
fn read_config(path: &str) -> Result<Config, Box<dyn Error>> {
    let content = std::fs::read_to_string(path)?;
    let config: Config = serde_json::from_str(&content)?;
    Ok(config)
}
\`\`\`

## 扭魔方练习

1. 实现一个线程安全的缓存（使用 RwLock）
2. 为自定义类型实现 Iterator trait
3. 使用 thiserror 库定义自定义错误类型`,
  },
  {
    slug: "rust-f2-actix",
    title: "Rust Actix Web 高性能服务",
    description: "Actix Web 路由、中间件、异步数据库、状态管理",
    moduleType: "FOUNDATION",
    difficulty: 3,
    orderIndex: 2,
    mdxContent: `# Rust Actix Web 高性能服务

## 为什么 Actix Web？

Actix Web 是 Techempower 基准测试中常年霸榜的 Rust Web 框架。基于 Actor 模型，单线程即可处理数十万并发。

\`\`\`rust
use actix_web::{web, App, HttpServer, HttpResponse, middleware};

async fn health() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({"status": "ok"}))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .route("/health", web::get().to(health))
            .service(
                web::scope("/api/v1")
                    .route("/users", web::get().to(list_users))
                    .route("/users", web::post().to(create_user))
                    .route("/users/{id}", web::get().to(get_user))
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
\`\`\`

## 应用状态与数据库

\`\`\`rust
use sqlx::PgPool;

struct AppState {
    db: PgPool,
    redis: redis::Client,
}

async fn get_user(
    state: web::Data<AppState>,
    path: web::Path<String>,
) -> HttpResponse {
    let id = path.into_inner();
    match sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
        .bind(&id)
        .fetch_optional(&state.db)
        .await
    {
        Ok(Some(user)) => HttpResponse::Ok().json(user),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}
\`\`\`

## 中间件与提取器

Actix 的类型安全提取器是核心特性：
- **web::Data<T>**：注入应用状态
- **web::Json<T>**：JSON 请求体自动反序列化
- **web::Path<T>**：路径参数提取
- **web::Query<T>**：查询参数提取

## 扭魔方练习

1. 实现 JWT 认证中间件
2. 使用 actix-web-httpauth 添加 Basic Auth
3. 为 API 添加请求限流（rate limiting）`,
  },
  {
    slug: "rust-f3-tauri",
    title: "Rust Tauri 桌面应用",
    description: "Tauri 架构、Rust 后端 + React 前端桌面应用开发",
    moduleType: "FOUNDATION",
    difficulty: 3,
    orderIndex: 3,
    mdxContent: `# Rust Tauri 桌面应用

## Tauri vs Electron

Tauri 使用系统原生 WebView，体积仅 Electron 的 1/10（~5MB vs ~50MB+）。

\`\`\`rust
// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn greet(name: &str) -> String {
    format!("你好, {}! 欢迎使用 DevFusion Desktop", name)
}

#[tauri::command]
async fn read_file(path: &str) -> Result<String, String> {
    std::fs::read_to_string(path).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, read_file])
        .run(tauri::generate_context!())
        .expect("启动失败");
}
\`\`\`

## Rust 后端能力

Tauri 允许你直接在 Rust 端：
- **文件系统操作**：读写本地文件
- **系统托盘**：最小化到托盘
- **原生通知**：调用 OS 通知 API
- **进程管理**：启动子进程

\`\`\`rust
use tauri::Manager;

#[tauri::command]
async fn system_info(app: tauri::AppHandle) -> String {
    let os = std::env::consts::OS;
    let arch = std::env::consts::ARCH;
    format!("{{ \\"os\\": \\"{}\\", \\"arch\\": \\"{}\\" }}", os, arch)
}
\`\`\`

## 前端通信

前端通过 \`@tauri-apps/api\` 调用 Rust 命令：

\`\`\`typescript
import { invoke } from '@tauri-apps/api/tauri';

const greeting = await invoke<string>('greet', { name: 'World' });
const content = await invoke<string>('read_file', { path: '/path/to/file' });
\`\`\`

## 扭魔方练习

1. 实现一个 Markdown 笔记编辑器（桌面应用）
2. 添加系统托盘菜单和快捷键
3. 实现自动更新功能`,
  },

  // ==================== KOTLIN+ UNITS ====================
  {
    slug: "kotlin-f1-spring",
    title: "Kotlin + Spring Boot 优雅后端",
    description: "Kotlin 协程、Spring Boot WebFlux、JPA 集成与响应式编程",
    moduleType: "FOUNDATION",
    difficulty: 2,
    orderIndex: 1,
    mdxContent: `# Kotlin + Spring Boot 优雅后端

## 为什么用 Kotlin 写 Spring？

Kotlin 的数据类、扩展函数、空安全等特性让 Spring Boot 代码量减少 40%，可读性大幅提升。

\`\`\`kotlin
@SpringBootApplication
class DevFusionApiApplication

fun main(args: Array<String>) {
    runApplication<DevFusionApiApplication>(*args)
}

@RestController
@RequestMapping("/api/v1/users")
class UserController(private val userService: UserService) {

    @GetMapping
    suspend fun listUsers(
        @RequestParam page: Int = 1,
        @RequestParam limit: Int = 20
    ): UserListResponse = userService.listUsers(page, limit)

    @GetMapping("/{id}")
    suspend fun getUser(@PathVariable id: String): UserResponse? =
        userService.findById(id)
}
\`\`\`

## Kotlin 数据类与 JPA

\`\`\`kotlin
@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    @Column(unique = true, nullable = false)
    val email: String,

    @Column(nullable = false)
    val name: String,

    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now()
)

interface UserRepository : JpaRepository<User, String> {
    fun findByEmail(email: String): User?
    suspend fun findByEmailCoroutine(email: String): User?
}
\`\`\`

## 协程与响应式

\`\`\`kotlin
@Service
class UserService(private val repo: UserRepository) {

    suspend fun findById(id: String): UserResponse? {
        return withContext(Dispatchers.IO) {
            repo.findById(id).orElse(null)?.toResponse()
        }
    }

    suspend fun listUsers(page: Int, limit: Int): UserListResponse {
        return coroutineScope {
            val users = async(Dispatchers.IO) {
                val pageable = PageRequest.of(page - 1, limit)
                repo.findAll(pageable)
            }
            users.await().let { UserListResponse(it.content.map { it.toResponse() }, it.totalElements) }
        }
    }
}
\`\`\`

## 扭魔方练习

1. 使用 WebFlux 实现 SSE（Server-Sent Events）端点
2. 添加 Spring Security + JWT 认证
3. 实现全局异常处理器`,
  },
  {
    slug: "kotlin-f2-ktor",
    title: "Kotlin Ktor 轻量服务",
    description: "Ktor 路由、插件系统、WebSocket 与轻量级微服务",
    moduleType: "FOUNDATION",
    difficulty: 2,
    orderIndex: 2,
    mdxContent: `# Kotlin Ktor 轻量服务

## Ktor vs Spring Boot

Ktor 是 JetBrains 官方出品的轻量级异步框架。启动时间不到 Spring Boot 的 1/5，内存占用极小，适合微服务和 Serverless。

\`\`\`kotlin
fun Application.module() {
    install(ContentNegotiation) { json() }
    install(CORS) { anyHost() }
    install(Authentication) {
        jwt {
            verifier(JWT.require(Algorithm.HMAC256("secret")).build())
            validate { credential ->
                if (credential.payload.getClaim("username").asString() != "") {
                    JWTPrincipal(credential.payload)
                } else null
            }
        }
    }

    routing {
        route("/api/v1") {
            authenticate {
                get("/users") { /* ... */ }
                post("/users") { /* ... */ }
            }
            get("/health") { call.respond(mapOf("status" to "ok")) }
        }
    }
}
\`\`\`

## WebSocket 支持

\`\`\`kotlin
routing {
    webSocket("/ws/chat") {
        for (frame in incoming) {
            when (frame) {
                is Frame.Text -> {
                    val text = frame.readText()
                    send(Frame.Text("Echo: $text"))
                }
            }
        }
    }
}
\`\`\`

## Exposed ORM

\`\`\`kotlin
object Users : Table() {
    val id = varchar("id", 36).primaryKey()
    val name = varchar("name", 100)
    val email = varchar("email", 255).uniqueIndex()
}

suspend fun findUser(id: String): ResultRow? {
    return dbQuery {
        Users.select { Users.id eq id }.singleOrNull()
    }
}
\`\`\`

## 扭魔方练习

1. 实现 Ktor 服务的 Docker 镜像（<50MB）
2. 添加请求重试和熔断插件
3. 实现文件上传 + 进度通知 WebSocket`,
  },

  // ==================== REUSABLE PROJECT UNITS ====================
  {
    slug: "proj-rest-api",
    title: "全栈 REST API 实战",
    description: "从零构建完整的 RESTful API 应用，涵盖 CRUD、认证授权、分页过滤与部署",
    moduleType: "PROJECT",
    difficulty: 3,
    orderIndex: 1,
    mdxContent: `# 全栈 REST API 实战

## 项目概述

从零构建一个完整的全栈 REST API 应用。通过四阶段递进式开发，掌握后端 API 设计、前端集成、认证授权和生产部署的全流程。

## 你将学到

- RESTful API 设计最佳实践（资源命名、状态码、分页）
- 用户认证与授权（JWT / Session）
- 数据库建模与 ORM 查询优化
- 前后端分离架构与集成`,
    phases: [
      { url: "", name: "阶段 0 - API 契约设计", description: "定义数据模型与 API 接口规范", tasks: ["设计数据库 ER 图与表结构", "编写 OpenAPI 3.0 接口文档", "确定认证方案（JWT / Session / OAuth）", "搭建项目骨架与目录结构"], deliverables: ["ER 图", "openapi.yaml", "项目骨架代码仓库"] },
      { url: "", name: "阶段 1 - 后端 CRUD 实现", description: "实现核心业务 API 与数据持久化", tasks: ["实现用户注册/登录 API（bcrypt + JWT）", "实现核心资源的 CRUD 端点", "添加分页、排序、过滤中间件", "编写 API 集成测试"], deliverables: ["可运行的 API 服务", "测试覆盖率 > 70%"] },
      { url: "", name: "阶段 2 - 前端集成", description: "构建前端 SPA 与后端对接", tasks: ["搭建前端项目（组件库、路由、状态管理）", "实现登录/注册页面与 Token 管理", "实现核心资源的列表/详情/创建/编辑页面", "添加错误处理与加载状态"], deliverables: ["前后端联调通过", "基础 UI 完成"] },
      { url: "", name: "阶段 3 - 生产加固与部署", description: "安全性、性能优化与部署", tasks: ["添加 CORS、Rate Limiting、安全响应头", "实现请求日志与错误监控", "编写 Dockerfile + Docker Compose", "部署到云服务器或 PaaS 平台"], deliverables: ["生产就绪的 Docker 镜像", "部署文档"] },
    ],
  },
  {
    slug: "proj-realtime-app",
    title: "实时数据应用实战",
    description: "构建基于 WebSocket/SSE 的实时应用，掌握事件驱动架构与双向通信",
    moduleType: "PROJECT",
    difficulty: 3,
    orderIndex: 2,
    mdxContent: `# 实时数据应用实战

## 项目概述

构建一个支持实时数据推送的全栈应用。掌握 WebSocket 双向通信、事件驱动架构和实时 UI 更新的核心技术。

## 你将学到

- WebSocket vs SSE vs 长轮询的选型与实现
- 发布/订阅模式在实时系统中的应用
- 前端实时状态同步（乐观更新 + 服务端推送）
- 连接管理与心跳保活机制`,
    phases: [
      { url: "", name: "阶段 0 - 实时架构设计", description: "确定通信协议与消息格式", tasks: ["分析业务场景选择 WebSocket 或 SSE", "设计消息协议（事件类型、数据格式）", "设计频道/房间模型与订阅机制", "确定认证与鉴权方案（WS 握手时验证 Token）"], deliverables: ["实时架构设计文档", "消息协议规范"] },
      { url: "", name: "阶段 1 - 后端实时服务", description: "实现 WebSocket 服务端与消息推送", tasks: ["搭建 WebSocket 服务端点", "实现频道订阅/退订管理", "实现消息广播与点对点推送", "添加心跳检测与断线重连"], deliverables: ["WebSocket 服务可运行"] },
      { url: "", name: "阶段 2 - 前端实时交互", description: "构建实时更新的前端界面", tasks: ["封装 WebSocket 连接 Hook/Service", "实现实时消息列表（自动滚动、新消息提示）", "实现在线状态指示器", "添加离线消息队列与重连恢复"], deliverables: ["实时前端应用完成"] },
      { url: "", name: "阶段 3 - 性能与扩展", description: "优化实时系统的可靠性与扩展性", tasks: ["实现消息持久化（历史消息查询）", "添加消息确认机制（ACK）", "使用 Redis Pub/Sub 支持多实例", "编写压力测试（1000 并发连接）"], deliverables: ["性能测试报告", "多实例部署方案"] },
    ],
  },
  {
    slug: "proj-admin-dashboard",
    title: "企业数据面板实战",
    description: "构建数据可视化仪表盘，掌握图表渲染、数据聚合与交互式筛选",
    moduleType: "PROJECT",
    difficulty: 3,
    orderIndex: 3,
    mdxContent: `# 企业数据面板实战

## 项目概述

构建一个交互式数据可视化仪表盘。从指标体系设计到图表渲染，掌握数据面板开发的完整技能链。

## 你将学到

- 业务指标体系设计与数据建模
- 数据聚合查询与缓存策略
- 前端图表库选型与渲染优化
- 交互式筛选、导出与响应式布局`,
    phases: [
      { url: "", name: "阶段 0 - 指标体系设计", description: "定义关键指标与数据模型", tasks: ["梳理业务需求，确定 KPI 指标体系", "设计数据仓库模型（星型/雪花型）", "确定数据刷新频率与缓存策略", "绘制仪表盘布局原型"], deliverables: ["KPI 定义文档", "数据模型 ER 图", "原型图"] },
      { url: "", name: "阶段 1 - 数据 API 开发", description: "实现聚合查询与数据服务", tasks: ["实现核心指标的聚合查询 API", "添加时间范围/维度筛选参数", "实现数据导出接口（CSV/Excel）", "添加 Redis 缓存层（热点数据）"], deliverables: ["数据 API 服务"] },
      { url: "", name: "阶段 2 - 可视化面板", description: "前端图表渲染与交互", tasks: ["集成图表库（Chart.js / ECharts / Recharts）", "实现折线图、柱状图、饼图、表格组件", "添加全局时间筛选器与联动刷新", "实现响应式布局（桌面 + 移动端）"], deliverables: ["可视化面板应用"] },
      { url: "", name: "阶段 3 - 高级功能", description: "增强交互与自动化", tasks: ["实现指标预警阈值与通知", "添加面板配置持久化（用户自定义布局）", "实现数据对比功能（同比/环比）", "编写 E2E 测试"], deliverables: ["完整数据面板产品"] },
    ],
  },
  {
    slug: "proj-microservices",
    title: "微服务架构实战",
    description: "将单体应用拆分为微服务，掌握服务发现、API 网关与消息队列",
    moduleType: "PROJECT",
    difficulty: 4,
    orderIndex: 4,
    mdxContent: `# 微服务架构实战

## 项目概述

将一个业务系统拆分为多个独立微服务。实践 DDD 限界上下文划分、服务间通信、分布式事务和可观测性等核心技术。

## 你将学到

- DDD 战略设计：限界上下文与上下文映射
- 服务间通信模式：同步（REST/gRPC）vs 异步（消息队列）
- 分布式系统挑战：事务一致性、服务发现、容错
- 可观测性三支柱：日志、指标、追踪`,
    phases: [
      { url: "", name: "阶段 0 - 服务拆分设计", description: "领域分析与服务边界确定", tasks: ["进行事件风暴工作坊，识别限界上下文", "定义服务间通信协议（gRPC / REST / 消息）", "设计 Saga 或事件最终一致性方案", "确定 API 网关路由规则"], deliverables: ["服务蓝图文档", "通信协议规范"] },
      { url: "", name: "阶段 1 - 核心服务实现", description: "实现拆分后的独立微服务", tasks: ["实现用户服务（认证、用户管理）", "实现业务核心服务（订单/内容等）", "实现通知服务（邮件/推送）", "每个服务独立的数据库与迁移脚本"], deliverables: ["至少 3 个独立微服务"] },
      { url: "", name: "阶段 2 - 基础设施集成", description: "服务发现、网关与消息系统", tasks: ["部署 API 网关（统一入口、限流、路由）", "配置服务注册与发现", "集成消息队列用于异步通信", "实现分布式链路追踪"], deliverables: ["基础设施配置代码"] },
      { url: "", name: "阶段 3 - 韧性与治理", description: "容错、监控与部署", tasks: ["实现熔断器与重试机制", "添加健康检查与优雅关闭", "配置 Prometheus 指标 + Grafana 面板", "编写 docker-compose 或 k8s 部署文件"], deliverables: ["生产级部署配置", "监控面板截图"] },
    ],
  },
  {
    slug: "proj-mobile-backend",
    title: "移动端后端实战",
    description: "为移动应用构建专业后端 API，涵盖推送通知、离线同步与移动优化",
    moduleType: "PROJECT",
    difficulty: 3,
    orderIndex: 5,
    mdxContent: `# 移动端后端实战

## 项目概述

为移动端应用（iOS/Android）构建专业的后端服务。掌握移动端特有的 API 设计、推送通知、离线数据同步和移动端安全等关键技术。

## 你将学到

- 移动端 API 设计优化（数据精简、批量接口、版本管理）
- 推送通知系统（FCM/APNs 集成）
- 离线优先策略与数据同步冲突解决
- 移动端认证（Biometric + OAuth + 设备绑定）`,
    phases: [
      { url: "", name: "阶段 0 - API 契约设计", description: "移动端专属 API 设计", tasks: ["设计移动端 API 响应格式（精简字段、嵌套预加载）", "设计分页游标（Cursor-based 适合无限滚动）", "确定 API 版本管理策略", "编写 API 文档与 Mock Server"], deliverables: ["API 规范文档", "Mock Server"] },
      { url: "", name: "阶段 1 - 核心后端实现", description: "用户系统与业务 API", tasks: ["实现手机号/邮箱注册登录 API", "实现设备绑定与多设备管理", "实现核心业务 CRUD API（优化移动端响应）", "实现文件上传（头像/附件）与 CDN 集成"], deliverables: ["可运行的后端 API"] },
      { url: "", name: "阶段 2 - 推送与实时", description: "推送通知与实时更新", tasks: ["集成 FCM/APNs 推送服务", "实现推送模板与定时推送", "实现 WebSocket 实时消息通道", "添加离线消息队列"], deliverables: ["推送服务集成完成"] },
      { url: "", name: "阶段 3 - 性能与安全", description: "移动端专属优化", tasks: ["添加 API 响应压缩（Gzip/Brotli）", "实现增量同步（只返回变更数据）", "添加接口防刷与设备指纹", "编写性能测试（模拟弱网环境）"], deliverables: ["性能优化报告", "安全审计通过"] },
    ],
  },
  {
    slug: "proj-desktop-app",
    title: "桌面应用开发实战",
    description: "构建跨平台桌面应用，掌握原生能力调用、系统集成与打包分发",
    moduleType: "PROJECT",
    difficulty: 3,
    orderIndex: 6,
    mdxContent: `# 桌面应用开发实战

## 项目概述

构建一个功能完整的跨平台桌面应用。掌握桌面应用架构、原生系统能力调用、本地数据存储和应用打包分发全流程。

## 你将学到

- 桌面应用架构模式（系统 WebView vs 原生渲染）
- 系统原生能力集成（文件系统、通知、托盘、快捷键）
- 本地数据持久化与安全存储
- 应用打包、自动更新与分发`,
    phases: [
      { url: "", name: "阶段 0 - 桌面架构设计", description: "确定技术架构与功能规划", tasks: ["对比桌面方案（Tauri / Electron / NW.js）", "设计应用窗口管理与路由", "设计本地数据存储方案（SQLite / JSON）", "规划系统能力需求（托盘/通知/快捷键）"], deliverables: ["技术选型文档", "功能规格说明"] },
      { url: "", name: "阶段 1 - 核心功能实现", description: "实现应用主要功能", tasks: ["搭建项目骨架与窗口管理", "实现核心业务功能界面", "实现本地数据库 CRUD 操作", "实现系统托盘与菜单"], deliverables: ["可运行的桌面应用"] },
      { url: "", name: "阶段 2 - 原生能力集成", description: "集成系统级功能", tasks: ["实现系统通知推送", "实现全局快捷键", "实现文件关联与拖放打开", "添加自动启动与后台运行"], deliverables: ["全功能桌面应用"] },
      { url: "", name: "阶段 3 - 打包与分发", description: "应用打包与自动更新", tasks: ["配置应用图标与安装程序", "实现自动更新检查与下载", "代码签名（macOS / Windows）", "编写用户文档与发布说明"], deliverables: ["安装包（.dmg / .exe / .deb）", "更新服务器配置"] },
    ],
  },
];

// ============ TRACKS (6 total) ============
const tracks = [
  { slug: "lite-lynx", name: "LiteLynx", desc: "Python + FastAPI + React + PostgreSQL + Redis 轻快全栈方案，适合快速构建 SaaS 产品", cat: "web", diff: 2, weeks: 8, color: "#3B82F6", icon: "zap", projectName: "LiteLynx项目实战", projectUrl: "https://aiw520.github.io/devfusion-hub/#/LiteLynx_%E8%BD%BB%E5%BF%AB%E5%85%A8%E6%A0%88%E5%AE%8C%E6%95%B4%E9%A1%B9%E7%9B%AE%E6%8C%87%E5%8D%97", techs: ["Python", "FastAPI", "React", "PostgreSQL", "Redis", "Docker"], unitSlugs: ["litelynx-f1-python-core", "litelynx-f2-fastapi-defense", "litelynx-f3-react-state", "litelynx-f4-postgres-redis", "litelynx-p1-devboard-pro", "litelynx-i1-interview"] },
  { slug: "neon-stack", name: "NeonStack", desc: "Next.js + TypeScript + Prisma + MySQL + Redis SSG/SSR 混合渲染方案", cat: "web", diff: 3, weeks: 10, color: "#8B5CF6", icon: "sparkles", projectName: "NeonStack项目实战", projectUrl: "https://aiw520.github.io/devfusion-hub/#/NeonStack_Node%E5%85%A8%E6%A0%88%E5%AE%8C%E6%95%B4%E9%A1%B9%E7%9B%AE%E6%8C%87%E5%8D%97", techs: ["Next.js", "TypeScript", "Prisma", "MySQL", "Redis", "Tailwind"], unitSlugs: ["neonstack-f1-nextjs-core", "neonstack-f2-ts-pro", "neonstack-f3-prisma-mastery", "neonstack-p1-neondash", "neonstack-i1-ts-nextjs-interview"] },
  { slug: "ai-alchemist", name: "AI Alchemist", desc: "Python + FastAPI + LangChain + Weaviate + React AI 应用全栈方案", cat: "ai", diff: 4, weeks: 12, color: "#10B981", icon: "brain", projectName: "AI Alchemist项目实战", projectUrl: "https://aiw520.github.io/devfusion-hub/#/AI_Alchemist_AI%E5%BA%94%E7%94%A8%E5%AE%8C%E6%95%B4%E9%A1%B9%E7%9B%AE%E6%8C%87%E5%8D%97", techs: ["Python", "FastAPI", "LangChain", "Weaviate", "React", "Redis"], unitSlugs: ["ai-alchemist-f1-langchain", "ai-alchemist-f2-vector-db", "ai-alchemist-p1-ai-copilot", "ai-alchemist-i1-ml-interview"] },
  { slug: "cloud-forge", name: "CloudForge", desc: "Go + Docker + Kubernetes + PostgreSQL + Redis 云原生微服务方案", cat: "web", diff: 4, weeks: 12, color: "#00ADD8", icon: "cloud", projectName: "CloudForge项目实战", projectUrl: "https://aiw520.github.io/devfusion-hub/#/CloudForge_%E4%BA%91%E5%8E%9F%E7%94%9F%E5%AE%8C%E6%95%B4%E9%A1%B9%E7%9B%AE%E6%8C%87%E5%8D%97", techs: ["Go", "Docker", "Kubernetes", "PostgreSQL", "Redis", "gRPC"], unitSlugs: ["cloudforge-f1-golang-core", "cloudforge-f2-docker-k8s", "cloudforge-p1-cloud-native-app"] },
  { slug: "mobile-forge", name: "MobileForge", desc: "Kotlin + Spring Boot + Android 移动端全栈方案", cat: "mobile", diff: 3, weeks: 10, color: "#EC4899", icon: "smartphone", projectName: "mobile-forge项目实战", projectUrl: "https://aiw520.github.io/devfusion-hub/#/MobileForge_%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%AE%8C%E6%95%B4%E9%A1%B9%E7%9B%AE%E6%8C%87%E5%8D%97", techs: ["Kotlin", "Spring Boot", "Android", "PostgreSQL", "Redis"], unitSlugs: ["mobileforge-f1-kotlin-android", "mobileforge-p1-taskapp", "litelynx-f4-postgres-redis"] },
  { slug: "data-vault", name: "DataVault", desc: "Python + Spark + Airflow + PostgreSQL + React 数据工程方案", cat: "data", diff: 4, weeks: 12, color: "#F59E0B", icon: "database", projectName: "DataVault项目实战", projectUrl: "https://aiw520.github.io/devfusion-hub/#/DataVault_%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%8C%E6%95%B4%E9%A1%B9%E7%9B%AE%E6%8C%87%E5%8D%97", techs: ["Python", "Spark", "Airflow", "PostgreSQL", "React", "Kafka"], unitSlugs: ["datavault-f1-spark-core", "datavault-p1-data-pipeline", "ai-alchemist-f1-langchain"] },
];

// ============ LANGUAGE VECTORS ============
const vectors = [
  // Python+ vectors (7 total)
  { lang: "python", slug: "python-fastapi-react", name: "Python + FastAPI + React", desc: "高性能后端 + 现代化前端，构建全栈 SaaS 应用", diff: 2, weeks: 8, externalProjects: '[{"name":"FastAPI_React_SaaS 方案文档汇总","url":"https://aiw520.github.io/devfusion-hub/#/Python%E6%96%B9%E6%A1%88/FastAPI_React_SaaS/%E6%96%B9%E6%A1%88%E6%96%87%E6%A1%A3%E6%B1%87%E6%80%BB"}]', color: "#3B82F6", techs: ["Python", "FastAPI", "React", "PostgreSQL"], unitSlugs: ["litelynx-f1-python-core", "litelynx-f2-fastapi-defense", "litelynx-f3-react-state", "litelynx-p1-devboard-pro"] },
  { lang: "python", slug: "python-fastapi-langchain", name: "Python + FastAPI + LangChain", desc: "AI 驱动的后端服务，集成 LLM 能力", diff: 4, weeks: 10, externalProjects: '[{"name":"方案1：智能客服机器人 - 完整项目指南","url":"https://aiw520.github.io/devfusion-hub/#/Python%E6%96%B9%E6%A1%88/LangChain_AI%E5%90%8E%E7%AB%AF/%E6%96%B9%E6%A1%881_%E6%99%BA%E8%83%BD%E5%AE%A2%E6%9C%8D%E6%9C%BA%E5%99%A8%E4%BA%BA"},{"name":"方案2：文档问答系统 - 完整项目指南","url":"https://aiw520.github.io/devfusion-hub/#/Python%E6%96%B9%E6%A1%88/LangChain_AI%E5%90%8E%E7%AB%AF/%E6%96%B9%E6%A1%882_%E6%96%87%E6%A1%A3%E9%97%AE%E7%AD%94%E7%B3%BB%E7%BB%9F"},{"name":"方案3：代码生成助手 - 完整项目指南","url":"https://aiw520.github.io/devfusion-hub/#/Python%E6%96%B9%E6%A1%88/LangChain_AI%E5%90%8E%E7%AB%AF/%E6%96%B9%E6%A1%883_%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90%E5%8A%A9%E6%89%8B"}]', color: "#10B981", techs: ["Python", "FastAPI", "LangChain", "Weaviate"], unitSlugs: ["ai-alchemist-f1-langchain", "ai-alchemist-f2-vector-db", "ai-alchemist-p1-ai-copilot"] },
  { lang: "python", slug: "python-django-react", name: "Python + Django + React", desc: "Django 全栈框架的企业级应用开发", diff: 3, weeks: 10, externalProjects: '[{"name":"方案1：电商后台管理系统 - 完整项目指南","url":"https://aiw520.github.io/devfusion-hub/#/Python%E6%96%B9%E6%A1%88/Django_React%E4%BC%81%E4%B8%9A%E7%BA%A7/%E6%96%B9%E6%A1%881_%E7%94%B5%E5%95%86%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F"},{"name":"方案2：企业内部ERP系统 - 完整项目指南","url":"https://aiw520.github.io/devfusion-hub/#/Python%E6%96%B9%E6%A1%88/Django_React%E4%BC%81%E4%B8%9A%E7%BA%A7/%E6%96%B9%E6%A1%882_%E4%BC%81%E4%B8%9A%E5%86%85%E9%83%A8ERP%E7%B3%BB%E7%BB%9F"},{"name":"方案3：在线教育平台 - 完整项目指南","url":"https://aiw520.github.io/devfusion-hub/#/Python%E6%96%B9%E6%A1%88/Django_React%E4%BC%81%E4%B8%9A%E7%BA%A7/%E6%96%B9%E6%A1%883_%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0"}]', color: "#F59E0B", techs: ["Python", "Django", "React", "PostgreSQL"], unitSlugs: ["litelynx-f1-python-core", "litelynx-f3-react-state", "litelynx-f4-postgres-redis", "proj-rest-api"] },
  { lang: "python", slug: "python-flask-vue", name: "Python + Flask + Vue", desc: "轻量 Flask 微框架与渐进式 Vue 的灵活组合", diff: 1, weeks: 6, externalProjects: '[{"name":"Flask_Vue微服务 方案文档汇总","url":"https://aiw520.github.io/devfusion-hub/#/Python%E6%96%B9%E6%A1%88/Flask_Vue%E5%BE%AE%E6%9C%8D%E5%8A%A1/%E6%96%B9%E6%A1%88%E6%96%87%E6%A1%A3%E6%B1%87%E6%80%BB"}]', color: "#EC4899", techs: ["Python", "Flask", "Vue", "SQLite"], unitSlugs: ["litelynx-f1-python-core", "proj-rest-api"] },
  { lang: "python", slug: "python-pandas-react", name: "Python + Pandas + FastAPI + React", desc: "数据科学与 Web 前端融合展示方案", diff: 3, weeks: 8, externalProjects: '[{"name":"方案1：数据可视化仪表盘 - 完整项目指南","https://aiw520.github.io/devfusion-hub/#/Python%E6%96%B9%E6%A1%88/Pandas%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90/%E6%96%B9%E6%A1%881_%E6%95%B0%E6%8D%AE%E5%8F%AF%E8%A7%86%E5%8C%96%E4%BB%AA%E8%A1%A8%E7%9B%98"},{"name":"方案2：销售数据分析平台 - 完整项目指南","url":"https://aiw520.github.io/devfusion-hub/#/Python%E6%96%B9%E6%A1%88/Pandas%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90/%E6%96%B9%E6%A1%882_%E9%94%80%E5%94%AE%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%B9%B3%E5%8F%B0"}]', color: "#8B5CF6", techs: ["Python", "Pandas", "FastAPI", "React"], unitSlugs: ["litelynx-f1-python-core", "litelynx-f3-react-state", "proj-admin-dashboard"] },
  { lang: "python", slug: "python-spark-airflow", name: "Python + Spark + Airflow", desc: "大数据处理管道与调度", diff: 4, weeks: 10, externalProjects: '[{"name":"方案1：日志实时分析平台 - 完整项目指南","url":"https://aiw520.github.io/devfusion-hub/#/Python%E6%96%B9%E6%A1%88/Spark_%E5%A4%A7%E6%95%B0%E6%8D%AE/%E6%96%B9%E6%A1%881_%E6%97%A5%E5%BF%97%E5%AE%9E%E6%97%B6%E5%88%86%E6%9E%90%E5%B9%B3%E5%8F%B0"},{"name":"方案2：用户行为数据管道 - 完整项目指南","url":"https://aiw520.github.io/devfusion-hub/#/Python%E6%96%B9%E6%A1%88/Spark_%E5%A4%A7%E6%95%B0%E6%8D%AE/%E6%96%B9%E6%A1%882_%E7%94%A8%E6%88%B7%E8%A1%8C%E4%B8%BA%E6%95%B0%E6%8D%AE%E7%AE%A1%E9%81%93"}]', color: "#EF4444", techs: ["Python", "Spark", "Airflow", "PostgreSQL"], unitSlugs: ["datavault-f1-spark-core", "datavault-p1-data-pipeline"] },
  { lang: "python", slug: "python-fastapi-mongodb", name: "Python + FastAPI + MongoDB", desc: "文档数据库配合高性能 API 的灵活方案", diff: 2, weeks: 6, externalProjects: '[{"name":"FastAPI_MongoDB 方案文档汇总","url":"https://aiw520.github.io/devfusion-hub/#/Python%E6%96%B9%E6%A1%88/FastAPI_MongoDB/%E6%96%B9%E6%A1%88%E6%96%87%E6%A1%A3%E6%B1%87%E6%80%BB"}]', color: "#6366F1", techs: ["Python", "FastAPI", "MongoDB", "Redis"], unitSlugs: ["litelynx-f1-python-core", "litelynx-f2-fastapi-defense", "proj-rest-api"] },

  // Java+ vectors (5 total)
  { lang: "java", slug: "java-spring-react", name: "Java + Spring Boot + React", desc: "企业级 Java 后端与现代化 React 前端", diff: 3, weeks: 10, externalProjects: '[{"name":"Spring Boot + React - 博客平台","url":"https://aiw520.github.io/devfusion-hub/#/Java%E6%96%B9%E6%A1%88/SpringBoot_React/%E6%96%B9%E6%A1%881_%E5%8D%9A%E5%AE%A2%E5%B9%B3%E5%8F%B0"},{"name":"Spring Boot + React - 任务管理系统","url":"https://aiw520.github.io/devfusion-hub/#/Java%E6%96%B9%E6%A1%88/SpringBoot_React/%E6%96%B9%E6%A1%882_%E4%BB%BB%E5%8A%A1%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F"}]', color: "#F59E0B", techs: ["Java", "Spring Boot", "React", "PostgreSQL"], unitSlugs: ["litelynx-f3-react-state", "litelynx-f4-postgres-redis", "proj-rest-api"] },
  { lang: "java", slug: "java-spring-microservices", name: "Java + Spring Cloud 微服务", desc: "Spring Cloud 全家桶构建分布式架构", diff: 4, weeks: 12, externalProjects: '[{"name":"Spring Cloud 微服务 - 电商订单系统","url":"https://aiw520.github.io/devfusion-hub/#/Java%E6%96%B9%E6%A1%88/SpringCloud_%E5%BE%AE%E6%9C%8D%E5%8A%A1/%E6%96%B9%E6%A1%881_%E7%94%B5%E5%95%86%E8%AE%A2%E5%8D%95%E7%B3%BB%E7%BB%9F"}]', color: "#EF4444", techs: ["Java", "Spring Cloud", "Docker", "Kafka", "Redis"], unitSlugs: ["cloudforge-f2-docker-k8s", "proj-microservices"] },
  { lang: "java", slug: "java-spring-android", name: "Java + Spring + Android", desc: "后端 Spring + Android 原生应用", diff: 3, weeks: 10, externalProjects: '[{"name":"Spring + Android - 新闻资讯 App","url":"https://aiw520.github.io/devfusion-hub/#/Java%E6%96%B9%E6%A1%88/Spring_Android/%E6%96%B9%E6%A1%881_%E6%96%B0%E9%97%BB%E8%B5%84%E8%AE%AFApp"}]', color: "#3B82F6", techs: ["Java", "Spring Boot", "Android", "MySQL"], unitSlugs: ["mobileforge-f1-kotlin-android", "proj-mobile-backend"] },
  { lang: "java", slug: "java-spring-postgres", name: "Java + Spring Data JPA + PostgreSQL", desc: "JPA/Hibernate 深度集成关系型数据库", diff: 2, weeks: 6, externalProjects: '[{"name":"JPA深度集成 - 企业通讯录系统","url":"https://aiw520.github.io/devfusion-hub/#/Java%E6%96%B9%E6%A1%88/JPA%E6%B7%B1%E5%BA%A6%E9%9B%86%E6%88%90/%E6%96%B9%E6%A1%881_%E4%BC%81%E4%B8%9A%E9%80%9A%E8%AE%AF%E5%BD%95%E7%B3%BB%E7%BB%9F"},{"name":"JPA深度集成 - 在线考试系统","url":"https://aiw520.github.io/devfusion-hub/#/Java%E6%96%B9%E6%A1%88/JPA%E6%B7%B1%E5%BA%A6%E9%9B%86%E6%88%90/%E6%96%B9%E6%A1%882_%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F"}]', color: "#10B981", techs: ["Java", "Spring Data JPA", "PostgreSQL", "Flyway"], unitSlugs: ["litelynx-f4-postgres-redis", "proj-rest-api"] },
  { lang: "java", slug: "java-kafka-streams", name: "Java + Kafka Streams", desc: "实时流处理与事件驱动架构", diff: 4, weeks: 8, externalProjects: '[{"name":"Kafka Streams - 实时数据大屏","url":"https://aiw520.github.io/devfusion-hub/#/Java%E6%96%B9%E6%A1%88/KafkaStreams_%E6%B5%81%E5%A4%84%E7%90%86/%E6%96%B9%E6%A1%881_%E5%AE%9E%E6%97%B6%E6%95%B0%E6%8D%AE%E5%A4%A7%E5%B1%8F"}]', color: "#8B5CF6", techs: ["Java", "Kafka", "Spring Boot", "Redis"], unitSlugs: ["datavault-f1-spark-core", "proj-realtime-app"] },

  // TypeScript+ vectors (6 total)
  { lang: "typescript", slug: "typescript-nextjs-nest", name: "TypeScript + Next.js + NestJS", desc: "前后端统一 TypeScript 的企业级方案", diff: 3, weeks: 10, externalProjects: '[{"name":"Next.js + NestJS 企业知识库","url":"https://aiw520.github.io/devfusion-hub/#/TypeScript%E6%96%B9%E6%A1%88/Nextjs_NestJS/%E6%96%B9%E6%A1%881_%E4%BC%81%E4%B8%9A%E7%9F%A5%E8%AF%86%E5%BA%93"},{"name":"Next.js + NestJS 在线投票系统","url":"https://aiw520.github.io/devfusion-hub/#/TypeScript%E6%96%B9%E6%A1%88/Nextjs_NestJS/%E6%96%B9%E6%A1%882_%E5%9C%A8%E7%BA%BF%E6%8A%95%E7%A5%A8%E7%B3%BB%E7%BB%9F"}]', color: "#3B82F6", techs: ["TypeScript", "Next.js", "NestJS", "PostgreSQL"], unitSlugs: ["neonstack-f1-nextjs-core", "neonstack-f2-ts-pro", "proj-admin-dashboard"] },
  { lang: "typescript", slug: "typescript-nextjs-prisma", name: "TypeScript + Next.js + Prisma", desc: "Next.js 全栈配合类型安全 ORM", diff: 2, weeks: 8, externalProjects: '[{"name":"Next.js + Prisma 在线简历构建器","url":"https://aiw520.github.io/devfusion-hub/#/TypeScript%E6%96%B9%E6%A1%88/Nextjs_Prisma/%E6%96%B9%E6%A1%881_%E5%9C%A8%E7%BA%BF%E7%AE%80%E5%8E%86%E6%9E%84%E5%BB%BA%E5%99%A8"},{"name":"Next.js + Prisma SaaS 项目管理工具","url":"https://aiw520.github.io/devfusion-hub/#/TypeScript%E6%96%B9%E6%A1%88/Nextjs_Prisma/%E6%96%B9%E6%A1%882_SaaS%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7"},{"name":"Next.js + Prisma 社交分享平台","url":"https://aiw520.github.io/devfusion-hub/#/TypeScript%E6%96%B9%E6%A1%88/Nextjs_Prisma/%E6%96%B9%E6%A1%883_%E7%A4%BE%E4%BA%A4%E5%88%86%E4%BA%AB%E5%B9%B3%E5%8F%B0"}]', color: "#8B5CF6", techs: ["TypeScript", "Next.js", "Prisma", "MySQL"], unitSlugs: ["neonstack-f1-nextjs-core", "neonstack-f2-ts-pro", "neonstack-f3-prisma-mastery", "proj-admin-dashboard"] },
  { lang: "typescript", slug: "typescript-express-react", name: "TypeScript + Express + React", desc: "经典 Node.js 全栈，TypeScript 加持", diff: 1, weeks: 6, externalProjects: '[{"name":"方案一：Express + React 全栈博客平台","url":"https://aiw520.github.io/devfusion-hub/#/TypeScript%E6%96%B9%E6%A1%88/Express_React/%E6%96%B9%E6%A1%881_%E5%8D%9A%E5%AE%A2%E5%B9%B3%E5%8F%B0"},{"name":"Express + React 任务看板系统","url":"https://aiw520.github.io/devfusion-hub/#/TypeScript%E6%96%B9%E6%A1%88/Express_React/%E6%96%B9%E6%A1%882_%E4%BB%BB%E5%8A%A1%E7%9C%8B%E6%9D%BF"}]', color: "#10B981", techs: ["TypeScript", "Express", "React", "MongoDB"], unitSlugs: ["neonstack-f2-ts-pro", "litelynx-f3-react-state", "proj-rest-api"] },
  { lang: "typescript", slug: "typescript-nextjs-supabase", name: "TypeScript + Next.js + Supabase", desc: "Serverless 全栈，Supabase 替代传统后端", diff: 2, weeks: 6, externalProjects: '[{"name":"Next.js + Supabase 实时聊天应用","url":"https://aiw520.github.io/devfusion-hub/#/TypeScript%E6%96%B9%E6%A1%88/Nextjs_Supabase/%E6%96%B9%E6%A1%881_%E5%AE%9E%E6%97%B6%E8%81%8A%E5%A4%A9%E5%BA%94%E7%94%A8"},{"name":"Next.js + Supabase 待办清单应用","url":"https://aiw520.github.io/devfusion-hub/#/TypeScript%E6%96%B9%E6%A1%88/Nextjs_Supabase/%E6%96%B9%E6%A1%882_%E5%BE%85%E5%8A%9E%E6%B8%85%E5%8D%95%E5%BA%94%E7%94%A8"}]', color: "#F59E0B", techs: ["TypeScript", "Next.js", "Supabase", "Tailwind"], unitSlugs: ["neonstack-f1-nextjs-core", "neonstack-f2-ts-pro", "proj-realtime-app"] },
  { lang: "typescript", slug: "typescript-nestjs-mongodb", name: "TypeScript + NestJS + MongoDB", desc: "企业级 Node.js 后端 + 文档数据库", diff: 3, weeks: 8, externalProjects: '[{"name":"NestJS + MongoDB 日志收集系统","url":"https://aiw520.github.io/devfusion-hub/#/TypeScript%E6%96%B9%E6%A1%88/NestJS_MongoDB/%E6%96%B9%E6%A1%881_%E6%97%A5%E5%BF%97%E6%94%B6%E9%9B%86%E7%B3%BB%E7%BB%9F"},{"name":"NestJS + MongoDB 文件管理服务","url":"https://aiw520.github.io/devfusion-hub/#/TypeScript%E6%96%B9%E6%A1%88/NestJS_MongoDB/%E6%96%B9%E6%A1%882_%E6%96%87%E4%BB%B6%E7%AE%A1%E7%90%86%E6%9C%8D%E5%8A%A1"}]', color: "#EF4444", techs: ["TypeScript", "NestJS", "MongoDB", "Redis"], unitSlugs: ["neonstack-f2-ts-pro", "proj-rest-api"] },
  { lang: "typescript", slug: "typescript-t3-stack", name: "T3 Stack（Next.js + tRPC + Prisma）", desc: "端到端类型安全的全栈方案", diff: 3, weeks: 8, externalProjects: '[{"name":"T3 Stack 社交笔记应用 ⭐重点推荐","url":"https://aiw520.github.io/devfusion-hub/#/TypeScript%E6%96%B9%E6%A1%88/T3_Stack/%E6%96%B9%E6%A1%881_%E7%A4%BE%E4%BA%A4%E7%AC%94%E8%AE%B0%E5%BA%94%E7%94%A8"},{"name":"T3 Stack 在线商城","url":"https://aiw520.github.io/devfusion-hub/#/TypeScript%E6%96%B9%E6%A1%88/T3_Stack/%E6%96%B9%E6%A1%882_%E5%9C%A8%E7%BA%BF%E5%95%86%E5%9F%8E"},{"name":"T3 Stack 开发者博客平台","url":"https://aiw520.github.io/devfusion-hub/#/TypeScript%E6%96%B9%E6%A1%88/T3_Stack/%E6%96%B9%E6%A1%883_%E5%BC%80%E5%8F%91%E8%80%85%E5%8D%9A%E5%AE%A2%E5%B9%B3%E5%8F%B0"}]', color: "#6366F1", techs: ["TypeScript", "Next.js", "tRPC", "Prisma", "NextAuth"], unitSlugs: ["neonstack-f1-nextjs-core", "neonstack-f2-ts-pro", "neonstack-f3-prisma-mastery", "proj-admin-dashboard"] },

  // Go+ vectors (3 total)
  { lang: "go", slug: "go-docker-k8s", name: "Go + Docker + Kubernetes", desc: "云原生微服务三板斧，高并发基础设施", diff: 4, weeks: 12, externalProjects: '[{"name":"Docker+Kubernetes 方案一：微服务部署平台","url":"https://aiw520.github.io/devfusion-hub/#/Go%E6%96%B9%E6%A1%88/Docker_Kubernetes/%E6%96%B9%E6%A1%881_%E5%BE%AE%E6%9C%8D%E5%8A%A1%E9%83%A8%E7%BD%B2%E5%B9%B3%E5%8F%B0"},{"name":"Docker+Kubernetes 方案二：CI/CD 自动化流水线","url":"https://aiw520.github.io/devfusion-hub/#/Go%E6%96%B9%E6%A1%88/Docker_Kubernetes/%E6%96%B9%E6%A1%882_CI_CD%E8%87%AA%E5%8A%A8%E5%8C%96%E6%B5%81%E6%B0%B4%E7%BA%BF"},{"name":"Docker+Kubernetes 方案三：弹性扩缩容系统","url":"https://aiw520.github.io/devfusion-hub/#/Go%E6%96%B9%E6%A1%88/Docker_Kubernetes/%E6%96%B9%E6%A1%883_%E5%BC%B9%E6%80%A7%E6%89%A9%E7%BC%A9%E5%AE%B9%E7%B3%BB%E7%BB%9F"}]', color: "#10B981", techs: ["Go", "Docker", "Kubernetes", "PostgreSQL", "Redis", "gRPC"], unitSlugs: ["cloudforge-f1-golang-core", "cloudforge-f2-docker-k8s", "cloudforge-p1-cloud-native-app"] },
  { lang: "go", slug: "go-gin-react", name: "Go + Gin + React", desc: "高性能 Go Web API 配合现代化 React 前端", diff: 2, weeks: 8, externalProjects: '[{"name":"方案一：博客平台项目","url":"https://aiw520.github.io/devfusion-hub/#/Go%E6%96%B9%E6%A1%88/Gin_React/%E6%96%B9%E6%A1%881_%E5%8D%9A%E5%AE%A2%E5%B9%B3%E5%8F%B0"},{"name":"方案二：在线商城 API 项目","url":"https://aiw520.github.io/devfusion-hub/#/Go%E6%96%B9%E6%A1%88/Gin_React/%E6%96%B9%E6%A1%882_%E5%9C%A8%E7%BA%BF%E5%95%86%E5%9F%8EAPI"},{"name":"方案三：任务协作系统","url":"https://aiw520.github.io/devfusion-hub/#/Go%E6%96%B9%E6%A1%88/Gin_React/%E6%96%B9%E6%A1%883_%E4%BB%BB%E5%8A%A1%E5%8D%8F%E4%BD%9C%E7%B3%BB%E7%BB%9F"}]', color: "#3B82F6", techs: ["Go", "Gin", "React", "PostgreSQL"], unitSlugs: ["cloudforge-f1-golang-core", "go-f1-gin-web", "litelynx-f3-react-state", "proj-rest-api"] },
  { lang: "go", slug: "go-grpc-postgres", name: "Go + gRPC + PostgreSQL", desc: "微服务间高性能通信与数据持久化方案", diff: 3, weeks: 8, externalProjects: '[{"name":"方案一：用户中心服务","url":"https://aiw520.github.io/devfusion-hub/#/Go%E6%96%B9%E6%A1%88/gRPC_%E5%BE%AE%E6%9C%8D%E5%8A%A1/%E6%96%B9%E6%A1%881_%E7%94%A8%E6%88%B7%E4%B8%AD%E5%BF%83%E6%9C%8D%E5%8A%A1"},{"name":"方案二：订单处理服务","url":"https://aiw520.github.io/devfusion-hub/#/Go%E6%96%B9%E6%A1%88/gRPC_%E5%BE%AE%E6%9C%8D%E5%8A%A1/%E6%96%B9%E6%A1%882_%E8%AE%A2%E5%8D%95%E5%A4%84%E7%90%86%E6%9C%8D%E5%8A%A1"},{"name":"方案三：支付网关服务","url":"https://aiw520.github.io/devfusion-hub/#/Go%E6%96%B9%E6%A1%88/gRPC_%E5%BE%AE%E6%9C%8D%E5%8A%A1/%E6%96%B9%E6%A1%883_%E6%94%AF%E4%BB%98%E7%BD%91%E5%85%B3%E6%9C%8D%E5%8A%A1"}]', color: "#F59E0B", techs: ["Go", "gRPC", "PostgreSQL", "Redis"], unitSlugs: ["cloudforge-f1-golang-core", "go-f2-grpc-micro", "litelynx-f4-postgres-redis", "proj-realtime-app"] },

  // Rust+ vectors (3 total)
  { lang: "rust", slug: "rust-actix-react", name: "Rust + Actix + React", desc: "极致性能的 Rust Web 后端 + React 前端", diff: 4, weeks: 10, externalProjects: '[{"name":"方案1 - 博客平台","url":"https://aiw520.github.io/devfusion-hub/#/Rust%E6%96%B9%E6%A1%88/Actix_React/%E6%96%B9%E6%A1%881_%E5%8D%9A%E5%AE%A2%E5%B9%B3%E5%8F%B0"},{"name":"方案2 - 在线协作白板","url":"https://aiw520.github.io/devfusion-hub/#/Rust%E6%96%B9%E6%A1%88/Actix_React/%E6%96%B9%E6%A1%882_%E5%9C%A8%E7%BA%BF%E5%8D%8F%E4%BD%9C%E7%99%BD%E6%9D%BF"},{"name":"方案3 - 文件分享服务","url":"https://aiw520.github.io/devfusion-hub/#/Rust%E6%96%B9%E6%A1%88/Actix_React/%E6%96%B9%E6%A1%883_%E6%96%87%E4%BB%B6%E5%88%86%E4%BA%AB%E6%9C%8D%E5%8A%A1"}]', color: "#EF4444", techs: ["Rust", "Actix Web", "React", "PostgreSQL"], unitSlugs: ["rust-f1-core", "rust-f2-actix", "litelynx-f3-react-state", "proj-rest-api"] },
  { lang: "rust", slug: "rust-tauri-react", name: "Rust + Tauri + React", desc: "Rust 驱动的轻量级桌面应用开发", diff: 3, weeks: 8, externalProjects: '[{"name":"方案1 - Markdown 编辑器","url":"https://aiw520.github.io/devfusion-hub/#/Rust%E6%96%B9%E6%A1%88/Tauri_%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8/%E6%96%B9%E6%A1%881_Markdown%E7%BC%96%E8%BE%91%E5%99%A8"},{"name":"方案2 - 本地音乐播放器","url":"https://aiw520.github.io/devfusion-hub/#/Rust%E6%96%B9%E6%A1%88/Tauri_%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8/%E6%96%B9%E6%A1%882_%E6%9C%AC%E5%9C%B0%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8"},{"name":"方案3 - 截图工具","url":"https://aiw520.github.io/devfusion-hub/#/Rust%E6%96%B9%E6%A1%88/Tauri_%E6%A1%8C%E9%9D%A2%E5%BA%94%E7%94%A8/%E6%96%B9%E6%A1%883_%E6%88%AA%E5%9B%BE%E5%B7%A5%E5%85%B7"}]', color: "#8B5CF6", techs: ["Rust", "Tauri", "React", "TypeScript"], unitSlugs: ["rust-f1-core", "rust-f3-tauri", "litelynx-f3-react-state", "proj-desktop-app"] },
  { lang: "rust", slug: "rust-tokio-postgres", name: "Rust + Tokio + PostgreSQL", desc: "异步 Rust 服务与关系型数据库深度整合", diff: 3, weeks: 8, externalProjects: '[{"name":"方案1 - 高性能 API 网关","url":"https://aiw520.github.io/devfusion-hub/#/Rust%E6%96%B9%E6%A1%88/Tokio_%E5%BC%82%E6%AD%A5%E6%9C%8D%E5%8A%A1/%E6%96%B9%E6%A1%881_%E9%AB%98%E6%80%A7%E8%83%BDAPI%E7%BD%91%E5%85%B3"},{"name":"方案2 - 实时消息推送","url":"https://aiw520.github.io/devfusion-hub/#/Rust%E6%96%B9%E6%A1%88/Tokio_%E5%BC%82%E6%AD%A5%E6%9C%8D%E5%8A%A1/%E6%96%B9%E6%A1%882_%E5%AE%9E%E6%97%B6%E6%B6%88%E6%81%AF%E6%8E%A8%E9%80%81"},{"name":"方案3 - 爬虫数据采集","url":"https://aiw520.github.io/devfusion-hub/#/Rust%E6%96%B9%E6%A1%88/Tokio_%E5%BC%82%E6%AD%A5%E6%9C%8D%E5%8A%A1/%E6%96%B9%E6%A1%883_%E7%88%AC%E8%99%AB%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86"}]', color: "#6366F1", techs: ["Rust", "Tokio", "PostgreSQL", "Redis"], unitSlugs: ["rust-f1-core", "litelynx-f4-postgres-redis", "proj-realtime-app"] },

  // Kotlin+ vectors (3 total)
  { lang: "kotlin", slug: "kotlin-spring-react", name: "Kotlin + Spring Boot + React", desc: "现代化 JVM 后端与 React 前端的企业级方案", diff: 3, weeks: 10, externalProjects: '[{"name":"方案一：博客平台","url":"https://aiw520.github.io/devfusion-hub/#/Kotlin%E6%96%B9%E6%A1%88/SpringBoot_React/%E6%96%B9%E6%A1%881_%E5%8D%9A%E5%AE%A2%E5%B9%B3%E5%8F%B0"},{"name":"方案二：在线投票系统","url":"https://aiw520.github.io/devfusion-hub/#/Kotlin%E6%96%B9%E6%A1%88/SpringBoot_React/%E6%96%B9%E6%A1%882_%E5%9C%A8%E7%BA%BF%E6%8A%95%E7%A5%A8%E7%B3%BB%E7%BB%9F"},{"name":"方案三：电商商品管理系统","url":"https://aiw520.github.io/devfusion-hub/#/Kotlin%E6%96%B9%E6%A1%88/SpringBoot_React/%E6%96%B9%E6%A1%883_%E7%94%B5%E5%95%86%E5%95%86%E5%93%81%E7%AE%A1%E7%90%86"}]', color: "#EC4899", techs: ["Kotlin", "Spring Boot", "React", "PostgreSQL"], unitSlugs: ["kotlin-f1-spring", "litelynx-f3-react-state", "proj-rest-api"] },
  { lang: "kotlin", slug: "kotlin-android-compose", name: "Kotlin + Android + Compose", desc: "原生 Android 开发 + Spring Boot 后端", diff: 3, weeks: 10, externalProjects: '[{"name":"方案一：天气预报 App","url":"https://aiw520.github.io/devfusion-hub/#/Kotlin%E6%96%B9%E6%A1%88/Android_Compose/%E6%96%B9%E6%A1%881_%E5%A4%A9%E6%B0%94%E9%A2%84%E6%8A%A5App"},{"name":"方案二：笔记应用","url":"https://aiw520.github.io/devfusion-hub/#/Kotlin%E6%96%B9%E6%A1%88/Android_Compose/%E6%96%B9%E6%A1%882_%E7%AC%94%E8%AE%B0%E5%BA%94%E7%94%A8"},{"name":"方案三：社交动态 App","url":"https://aiw520.github.io/devfusion-hub/#/Kotlin%E6%96%B9%E6%A1%88/Android_Compose/%E6%96%B9%E6%A1%883_%E7%A4%BE%E4%BA%A4%E5%8A%A8%E6%80%81App"}]', color: "#3B82F6", techs: ["Kotlin", "Android", "Jetpack Compose", "Spring Boot"], unitSlugs: ["mobileforge-f1-kotlin-android", "kotlin-f1-spring", "proj-mobile-backend"] },
  { lang: "kotlin", slug: "kotlin-ktor-postgres", name: "Kotlin + Ktor + PostgreSQL", desc: "轻量级 Kotlin 微服务 + 关系型数据库", diff: 2, weeks: 6, externalProjects: '[{"name":"方案一：待办清单 RESTful API","url":"https://aiw520.github.io/devfusion-hub/#/Kotlin%E6%96%B9%E6%A1%88/Ktor_%E5%BE%AE%E6%9C%8D%E5%8A%A1/%E6%96%B9%E6%A1%881_%E5%BE%85%E5%8A%9E%E6%B8%85%E5%8D%95API"},{"name":"方案二：文件上传服务","url":"https://aiw520.github.io/devfusion-hub/#/Kotlin%E6%96%B9%E6%A1%88/Ktor_%E5%BE%AE%E6%9C%8D%E5%8A%A1/%E6%96%B9%E6%A1%882_%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E6%9C%8D%E5%8A%A1"},{"name":"方案三：用户认证系统","url":"https://aiw520.github.io/devfusion-hub/#/Kotlin%E6%96%B9%E6%A1%88/Ktor_%E5%BE%AE%E6%9C%8D%E5%8A%A1/%E6%96%B9%E6%A1%883_%E7%94%A8%E6%88%B7%E8%AE%A4%E8%AF%81%E7%B3%BB%E7%BB%9F"}]', color: "#10B981", techs: ["Kotlin", "Ktor", "PostgreSQL", "Exposed ORM"], unitSlugs: ["kotlin-f2-ktor", "litelynx-f4-postgres-redis", "proj-rest-api"] },
];

// ============ SEED EXECUTION ============
async function main() {
  console.log("🌌 Seeding DevFusion Hub...");

  // Clean
  await prisma.weakness.deleteMany();
  await prisma.courseProgress.deleteMany();
  await prisma.note.deleteMany();
  await prisma.assistantConversation.deleteMany();
  await prisma.trackUnitRef.deleteMany();
  await prisma.vectorUnitRef.deleteMany();
  await prisma.learningPlan.deleteMany();
  await prisma.courseUnit.deleteMany();
  await prisma.track.deleteMany();
  await prisma.languageVector.deleteMany();

  // Create course units
  const createdUnits: Record<string, string> = {};
  for (const u of courseUnits) {
    const created = await prisma.courseUnit.create({
      data: {
        slug: u.slug,
        title: u.title,
        description: u.description,
        moduleType: u.moduleType,
        difficulty: u.difficulty,
        orderIndex: u.orderIndex,
        mdxContent: u.mdxContent,
        phases: u.phases ? JSON.stringify(u.phases) : null,
        questions: u.questions ? JSON.stringify(u.questions) : null,
      },
    });
    createdUnits[u.slug] = created.id;
  }
  console.log(`✅ ${Object.keys(createdUnits).length} course units created`);

  // Create tracks
  for (const t of tracks) {
    const track = await prisma.track.create({
      data: {
        slug: t.slug, name: t.name, description: t.desc,
        category: t.cat, difficulty: t.diff, durationWeeks: t.weeks,
        color: t.color, icon: t.icon,
        externalProjects: (t as any).externalProjects || null,
        techStack: JSON.stringify(t.techs.map((name) => ({ name, icon: name.toLowerCase() }))),
      },
    });
    for (let i = 0; i < t.unitSlugs.length; i++) {
      const uid = createdUnits[t.unitSlugs[i]];
      if (uid) {
        await prisma.trackUnitRef.create({
          data: { trackId: track.id, unitId: uid, order: i + 1 },
        });
      }
    }
  }
  console.log(`✅ ${tracks.length} tracks created`);

  // Create vectors
  for (const v of vectors) {
    const vector = await prisma.languageVector.create({
      data: {
        lang: v.lang, slug: v.slug, name: v.name, description: v.desc,
        difficulty: v.diff, durationWeeks: v.weeks, color: v.color,
        externalProjects: (v as any).externalProjects || null,
        techStack: JSON.stringify(v.techs),
      },
    });
    for (let i = 0; i < v.unitSlugs.length; i++) {
      const uid = createdUnits[v.unitSlugs[i]];
      if (uid) {
        await prisma.vectorUnitRef.create({
          data: { vectorId: vector.id, unitId: uid, order: i + 1 },
        });
      }
    }
  }
  console.log(`✅ ${vectors.length} vectors created`);
  console.log("🚀 DevFusion Hub seed complete!");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
