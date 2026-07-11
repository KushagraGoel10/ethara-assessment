"use client"

import { Bell, ChevronDown, Home, Search } from "lucide-react"
import { usePathname } from "next/navigation"

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/employees": "Employees",
  "/departments": "Departments",
  "/teams": "Teams",
  "/projects": "Projects",
  "/floors": "Floors",
  "/zones": "Zones",
  "/seats": "Seats",
  "/project-assignments": "Project Assignments",
  "/seat-allocations": "Seat Allocations",
  "/ai": "AI Assistant",
}

export function Navbar() {
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? "Dashboard"

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-border bg-background/95 px-4 md:px-7">
      <div className="flex items-center gap-3">
        <Home className="size-4 text-muted-foreground" />
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden h-10 w-[320px] items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground shadow-sm xl:flex">
          <Search className="size-4" />
          <span className="flex-1">Search anything...</span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            Ctrl + K
          </kbd>
        </div>

        <button
          type="button"
          className="relative grid size-10 place-items-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
        </button>

        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <div className="grid size-9 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
            UA
          </div>
          <div className="hidden text-sm sm:block">
            <p className="font-semibold text-foreground">User Admin</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
        </div>
      </div>
    </header>
  )
}
