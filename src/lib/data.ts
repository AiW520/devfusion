import "server-only";
import { prisma } from "./prisma";

export async function getTracks() {
  return prisma.track.findMany({
    include: {
      units: {
        include: { unit: true },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { difficulty: "asc" },
  });
}

export async function getTrackBySlug(slug: string) {
  return prisma.track.findUnique({
    where: { slug },
    include: {
      units: {
        include: { unit: true },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getLanguageVectors(lang?: string) {
  const where = lang ? { lang } : {};
  return prisma.languageVector.findMany({
    where,
    include: {
      units: {
        include: { unit: true },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { difficulty: "asc" },
  });
}

export async function getVectorBySlug(slug: string) {
  return prisma.languageVector.findUnique({
    where: { slug },
    include: {
      units: {
        include: { unit: true },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getLanguages() {
  const vectors = await prisma.languageVector.findMany({
    select: { lang: true },
    distinct: ["lang"],
  });
  return vectors.map((v) => v.lang);
}

export async function getLanguageStats(lang: string) {
  const vectors = await prisma.languageVector.findMany({
    where: { lang },
  });
  const totalUnits = vectors.reduce(
    (sum, v) => sum + (v as any).units?.length || 0,
    0
  );
  return {
    vectorCount: vectors.length,
    unitCount: totalUnits,
    avgDifficulty: vectors.length
      ? Math.round(
          vectors.reduce((sum, v) => sum + v.difficulty, 0) / vectors.length
        )
      : 0,
  };
}

export async function getCourseUnit(slug: string) {
  return prisma.courseUnit.findUnique({
    where: { slug },
    include: {
      trackRefs: { include: { track: true } },
      vectorRefs: { include: { vector: true } },
    },
  });
}

export async function getCourseUnitsByModuleType(
  trackSlug: string,
  moduleType: string
) {
  const track = await prisma.track.findUnique({
    where: { slug: trackSlug },
    include: {
      units: {
        where: { unit: { moduleType } },
        include: { unit: true },
        orderBy: { order: "asc" },
      },
    },
  });
  return track?.units.map((tu) => tu.unit) || [];
}

export async function getUserProgress(userId: string) {
  return prisma.courseProgress.findMany({
    where: { userId },
    include: { unit: true, weaknesses: true },
  });
}

export async function getStats() {
  const [trackCount, vectorCount, unitCount] = await Promise.all([
    prisma.track.count(),
    prisma.languageVector.count(),
    prisma.courseUnit.count(),
  ]);
  return { trackCount, vectorCount, unitCount };
}
