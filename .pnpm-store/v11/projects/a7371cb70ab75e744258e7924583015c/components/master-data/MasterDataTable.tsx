import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export type TableColumn<T> = {
  header: string
  render: (item: T) => React.ReactNode
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
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-5">
          <p className="text-sm font-medium text-foreground">{errorMessage}</p>
        </CardContent>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-5">
          <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                {columns.map((column) => (
                  <th key={column.header} className="px-4 py-3 font-medium">
                    {column.header}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className="bg-card">
                  {columns.map((column) => (
                    <td key={column.header} className="px-4 py-3">
                      {column.render(item)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
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
