"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/lib/store";
import {
  Home,
  Orbit,
  BookOpen,
  Map,
  Bug,
  Trophy,
  Search,
  Bell,
  Menu,
  Sun,
  Moon,
  Zap,
} from "lucide-react";

const navLinks: { href: string; label: string; icon: any; external?: boolean }[] = [
  { href: "/", label: "首页", icon: Home },
  { href: "/orbit", label: "星轨系统", icon: Orbit },
  { href: "/language-hub", label: "语言中枢", icon: BookOpen },
  { href: "/learning-map", label: "学习地图", icon: Map },
  { href: "https://aiw520.github.io/VulnKB/", label: "代码漏洞知识库", icon: Bug, external: true },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { setCommandPaletteOpen, mode, setMode } = useUIStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1E293B] bg-[#0B0E14]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0B0E14]/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] animate-pulse" />
            <Zap className="relative h-8 w-8 p-1 text-white" />
          </div>
          <span className="text-lg font-bold text-gradient hidden sm:inline">
            DevFusion Hub
          </span>
        </Link>

        {/* Nav links - desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            const btn = (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={`gap-2 ${
                  isActive
                    ? "bg-[#131A2B] text-[#3B82F6]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#131A2B]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Button>
            );
            if (link.external) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {btn}
                </a>
              );
            }
            return (
              <Link key={link.href} href={link.href}>
                {btn}
              </Link>
            );
          })}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex gap-2 border-[#1E293B] bg-[#131A2B] hover:bg-[#1E293B]"
            onClick={() => setMode(mode === "orbit" ? "language" : "orbit")}
          >
            {mode === "orbit" ? (
              <>
                <Orbit className="h-4 w-4 text-[#3B82F6]" />
                <span className="text-xs text-slate-400">星轨探索</span>
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 text-[#8B5CF6]" />
                <span className="text-xs text-slate-400">语言中枢</span>
              </>
            )}
          </Button>

          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-slate-200"
            onClick={() => setCommandPaletteOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-slate-200 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#3B82F6] animate-pulse" />
          </Button>

          {/* User menu */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full border-0 p-0 bg-transparent hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback className="bg-[#3B82F6] text-white text-xs">
                    {session.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 border-[#1E293B] bg-[#131A2B]"
              >
                <DropdownMenuItem className="text-slate-300 hover:text-white focus:bg-[#1E293B] cursor-pointer">
                  <Link href="/profile" className="flex w-full">
                    个人主页
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 hover:text-white focus:bg-[#1E293B] cursor-pointer">
                  学习进度
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 hover:text-white focus:bg-[#1E293B] cursor-pointer">
                  我的笔记
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#1E293B]" />
                <DropdownMenuItem className="text-slate-300 hover:text-white focus:bg-[#1E293B] cursor-pointer">
                  设置
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90 text-white"
              >
                登录
              </Button>
            </Link>
          )}

          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-400"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
