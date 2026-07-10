"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Blocks,
  Bot,
  Building2,
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
    <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar md:block">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground">Seat Allocation</p>
          <p className="text-xs text-muted-foreground">Project Mapping System</p>
        </div>
      </div>
      <nav className="space-y-1 p-3">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
