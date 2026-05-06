"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delay={200}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#131A2B",
                color: "#E2E8F0",
                border: "1px solid #1E293B",
                borderRadius: "12px",
              },
            }}
          />
        </TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
