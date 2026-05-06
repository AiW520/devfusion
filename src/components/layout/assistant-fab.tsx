"use client";

import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/store";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";

export function AssistantFab() {
  const { toggleAssistant, assistantOpen } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        toggleAssistant();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleAssistant]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleAssistant}
        size="lg"
        className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${
          assistantOpen
            ? "bg-[#1E293B] scale-90"
            : "bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] pulse-ring hover:scale-110"
        }`}
      >
        <Sparkles
          className={`h-6 w-6 text-white transition-transform ${
            assistantOpen ? "rotate-90" : ""
          }`}
        />
      </Button>
    </div>
  );
}
