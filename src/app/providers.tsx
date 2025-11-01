"use client"

import { DashboardProvider } from "@/contexts/DashboardContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return <DashboardProvider>{children}</DashboardProvider>
}

