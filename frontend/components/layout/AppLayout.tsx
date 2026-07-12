import type { ReactNode } from "react"

import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"

type AppLayoutProps = {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#f8faff]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <Navbar />
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-7">{children}</main>
      </div>
    </div>
  )
}
