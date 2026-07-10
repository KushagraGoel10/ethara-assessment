export function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      <div>
        <h1 className="text-base font-semibold text-foreground">
          Seat Allocation & Project Mapping
        </h1>
        <p className="text-xs text-muted-foreground">Admin workspace</p>
      </div>
      <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
        <div className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          U
        </div>
        <div className="hidden text-sm sm:block">
          <p className="font-medium text-foreground">User</p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
      </div>
    </header>
  )
}
