"use client";

import { Suspense, lazy, useEffect, useState } from "react";

const StarOrbitCanvasComponent = lazy(() =>
  import("./star-orbit-canvas").then((m) => ({ default: m.StarOrbitCanvas }))
);

interface Track {
  id: string;
  name: string;
  slug: string;
  color: string;
  techStack: string;
}

export function StarOrbitCanvasLazy({ tracks }: { tracks: Track[] }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    const section = document.querySelector("section.hero-section");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  if (!isVisible) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E14] to-transparent" />
    );
  }

  return (
    <Suspense fallback={<div className="absolute inset-0" />}>
      <StarOrbitCanvasComponent tracks={tracks} />
    </Suspense>
  );
}