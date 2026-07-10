import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Employee } from "@/types/employee"

type EmployeeTableProps = {
  employees: Employee[]
  isLoading: boolean
  isError: boolean
  onEdit: (employee: Employee) => void
}

export function EmployeeTable({
  employees,
  isLoading,
  isError,
  onEdit,
}: EmployeeTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-5 w-40" />
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
          <p className="text-sm font-semibold text-foreground">Unable to load employees.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check the backend server and refresh the page.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (employees.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-sm font-semibold text-foreground">No employees found.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create an employee to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold tracking-wide">Code</th>
                <th className="px-4 py-3 font-semibold tracking-wide">Name</th>
                <th className="px-4 py-3 font-semibold tracking-wide">Email</th>
                <th className="px-4 py-3 font-semibold tracking-wide">Designation</th>
                <th className="px-4 py-3 font-semibold tracking-wide">Department</th>
                <th className="px-4 py-3 font-semibold tracking-wide">Team</th>
                <th className="px-4 py-3 font-semibold tracking-wide">Status</th>
                <th className="px-4 py-3 text-right font-semibold tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.map((employee) => (
                <tr key={employee.id} className="bg-card transition-colors hover:bg-muted/35">
                  <td className="px-4 py-3.5 font-medium">{employee.employee_code}</td>
                  <td className="px-4 py-3.5">
                    {employee.first_name} {employee.last_name}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{employee.email}</td>
                  <td className="px-4 py-3.5">{employee.designation}</td>
                  <td className="px-4 py-3.5">{employee.department_id}</td>
                  <td className="px-4 py-3.5">{employee.team_id}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "table-status",
                        employee.is_active
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-border bg-muted text-muted-foreground",
                      )}
                    >
                      {employee.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Button variant="outline" size="sm" onClick={() => onEdit(employee)}>
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
