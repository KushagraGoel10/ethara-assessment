import { Pencil } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type TableColumn<T> = {
  header: string
  render: (item: T) => ReactNode
  className?: string
}

type MasterDataTableProps<T extends { id: number }> = {
  items: T[]
  columns: TableColumn<T>[]
  isLoading: boolean
  isError: boolean
  emptyMessage: string
  errorMessage: string
  onEdit: (item: T) => void
}

export function MasterDataTable<T extends { id: number }>({
  items,
  columns,
  isLoading,
  isError,
  emptyMessage,
  errorMessage,
  onEdit,
}: MasterDataTableProps<T>) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-9 w-20" />
          </div>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm font-semibold text-foreground">{errorMessage}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check the backend server and refresh the page.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-sm font-semibold text-foreground">{emptyMessage}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a record to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.header}
                    className={cn("px-4 py-3 font-semibold tracking-wide", column.className)}
                  >
                    {column.header}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-semibold tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className="bg-card transition-colors hover:bg-muted/35">
                  {columns.map((column) => (
                    <td
                      key={column.header}
                      className={cn("px-4 py-3.5 align-middle", column.className)}
                    >
                      {column.render(item)}
                    </td>
                  ))}
                  <td className="px-4 py-3.5 text-right align-middle">
                    <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
