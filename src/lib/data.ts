import { tracks, vectors, courseUnits, stats } from "./static-data";

export async function getTracks() {
  return tracks;
}

export async function getTrackBySlug(slug: string) {
  return tracks.find((t) => t.slug === slug) || null;
}

export async function getLanguageVectors(lang?: string) {
  if (lang) {
    return vectors.filter((v) => v.lang === lang);
  }
  return vectors;
}

export async function getVectorsByLang(lang: string) {
  return vectors.filter((v) => v.lang === lang);
}

export async function getVectorBySlug(slug: string) {
  return vectors.find((v) => v.slug === slug) || null;
}

export async function getCourseUnit(slug: string) {
  return courseUnits.find((u) => u.slug === slug) || null;
}

export async function getUnitsByTrack(trackId: string) {
  return courseUnits.filter((u) => u.trackId === trackId).sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getUnitsByVector(vectorId: string) {
  return courseUnits.filter((u) => u.vectorId === vectorId).sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getStats() {
  return stats;
}

export async function getLanguages() {
  const langs = new Set(vectors.map((v) => v.lang));
  return Array.from(langs).map((lang) => ({
    id: lang,
    name: lang.charAt(0).toUpperCase() + lang.slice(1),
    slug: lang,
  }));
}

export async function getLanguageStats(lang: string) {
  const langVectors = vectors.filter((v) => v.lang === lang);
  const langUnits = courseUnits.filter((u) => {
    const vector = vectors.find((v) => v.id === u.vectorId);
    return vector && vector.lang === lang;
  });
  return {
    vectorCount: langVectors.length,
    unitCount: langUnits.length,
    totalHours: langVectors.reduce((sum, v) => sum + (v.difficulty * 20), 0),
  };
}