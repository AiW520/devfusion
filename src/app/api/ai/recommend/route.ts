import { NextRequest } from "next/server";
import { getTracks, getLanguageVectors } from "@/lib/data";
import { safeJsonParse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  // Simple keyword matching as fallback when AI is unavailable
  const tracks = await getTracks();
  const vectors = await getLanguageVectors();

  const allItems = [
    ...tracks.map((t) => {
      const techStack = safeJsonParse(t.techStack, []);
      return {
        type: "track" as const,
        slug: t.slug,
        name: t.name,
        desc: t.description,
        tags: techStack.map((x: any) =>
          typeof x === "string" ? x : x.name
        ),
      };
    }),
    ...vectors.map((v) => {
      const techStack = safeJsonParse(v.techStack, []);
      return {
        type: "vector" as const,
        slug: v.slug,
        name: v.name,
        desc: v.description,
        tags: techStack,
      };
    }),
  ];

  const queryLower = query.toLowerCase();
  const scored = allItems.map((item) => {
    let score = 0;
    for (const tag of item.tags) {
      if (queryLower.includes(tag.toLowerCase())) score += 2;
    }
    for (const word of queryLower.split(/\s+/)) {
      if (item.desc.toLowerCase().includes(word)) score += 1;
      if (item.name.toLowerCase().includes(word)) score += 1;
    }
    return { ...item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 3).filter((s) => s.score > 0);

  if (top.length === 0) {
    return Response.json({
      recommendations: allItems.slice(0, 2).map((item) => ({
        ...item,
        reason: `推荐探索方案`,
      })),
    });
  }

  return Response.json({
    recommendations: top.map((item) => ({
      ...item,
      reason: `匹配关键词，推荐指数: ${item.score}`,
    })),
  });
}
