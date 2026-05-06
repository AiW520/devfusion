import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { AssistantFab } from "@/components/layout/assistant-fab";
import { CommandPalette } from "@/components/assistant/command-palette";
import { ChatDrawer } from "@/components/assistant/chat-drawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevFusion Hub - 驾驭技术交响，成为架构师型全栈",
  description:
    "全球首个集成方案式全栈学习平台，以星轨和语言中枢双引擎，通过强基、实战、面试三阶火箭模型，培养能驾驭语言交响乐的架构师型人才。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#0B0E14] text-slate-100 antialiased font-sans flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <AssistantFab />
          <ChatDrawer />
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
