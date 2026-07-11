"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Blocks,
  Bot,
  Building2,
  HelpCircle,
  FolderKanban,
  Grid3X3,
  LayoutDashboard,
  Layers3,
  MapPinned,
  Network,
  Users,
  Workflow,
} from "lucide-react"

import { cn } from "@/lib/utils"

const navigationItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Employees", href: "/employees", icon: Users },
  { label: "Departments", href: "/departments", icon: Building2 },
  { label: "Teams", href: "/teams", icon: Network },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Floors", href: "/floors", icon: Layers3 },
  { label: "Zones", href: "/zones", icon: MapPinned },
  { label: "Seats", href: "/seats", icon: Grid3X3 },
  { label: "Project Assignments", href: "/project-assignments", icon: Workflow },
  { label: "Seat Allocations", href: "/seat-allocations", icon: Blocks },
  { label: "AI Assistant", href: "/ai", icon: Bot },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-border bg-sidebar md:flex md:min-h-screen md:flex-col">
      <div className="flex h-[72px] items-center gap-3 px-6">
        <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
          <Grid3X3 className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-sidebar-foreground">Seat Allocation</p>
          <p className="text-xs text-muted-foreground">Project Mapping System</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-3">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive &&
                  "bg-primary/10 text-primary shadow-sm shadow-primary/5",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4">
        <Link
          href="/ai"
          className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4 text-sm transition-colors hover:bg-muted"
        >
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-background text-primary">
            <HelpCircle className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground">Need help?</p>
            <p className="text-xs text-primary">Ask AI Assistant</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
