"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useUIStore } from "@/lib/store";
import {
  Orbit,
  BookOpen,
  Home,
  User,
  Sparkles,
  Search,
  Map,
} from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, setAssistantOpen } =
    useUIStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setCommandPaletteOpen]);

  const runCommand = (command: () => void) => {
    setCommandPaletteOpen(false);
    command();
  };

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
    >
      <CommandInput
        placeholder="搜索课程、星轨、技术向量..."
        className="text-slate-200 placeholder:text-slate-500"
      />
      <CommandList>
        <CommandEmpty className="text-slate-500 py-6">
          未找到结果，试试 AI 助手？
        </CommandEmpty>
        <CommandGroup heading="导航" className="text-slate-400">
            <CommandItem
              className="text-slate-300 hover:bg-[#1E293B]"
              onSelect={() => runCommand(() => router.push("/"))}
            >
              <Home className="mr-2 h-4 w-4" />
              首页
            </CommandItem>
            <CommandItem
              className="text-slate-300 hover:bg-[#1E293B]"
              onSelect={() => runCommand(() => router.push("/orbit"))}
            >
              <Orbit className="mr-2 h-4 w-4" />
              星轨系统
            </CommandItem>
            <CommandItem
              className="text-slate-300 hover:bg-[#1E293B]"
              onSelect={() => runCommand(() => router.push("/language-hub"))}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              语言中枢
            </CommandItem>
            <CommandItem
              className="text-slate-300 hover:bg-[#1E293B]"
              onSelect={() => runCommand(() => router.push("/learning-map"))}
            >
              <Map className="mr-2 h-4 w-4" />
              学习地图
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="快捷操作" className="text-slate-400">
            <CommandItem
              className="text-slate-300 hover:bg-[#1E293B]"
              onSelect={() =>
                runCommand(() => {
                  setAssistantOpen(true);
                })
              }
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI 智能助手
            </CommandItem>
            <CommandItem
              className="text-slate-300 hover:bg-[#1E293B]"
              onSelect={() => runCommand(() => router.push("/profile"))}
            >
              <User className="mr-2 h-4 w-4" />
              个人主页
            </CommandItem>
            <CommandItem
              className="text-slate-300 hover:bg-[#1E293B]"
              onSelect={() => runCommand(() => router.push("/assistant"))}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              全屏 AI 对话
            </CommandItem>
          </CommandGroup>
        </CommandList>
    </CommandDialog>
  );
}
