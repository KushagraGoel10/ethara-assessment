import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
          <p className="text-sm font-medium text-foreground">Unable to load employees.</p>
        </CardContent>
      </Card>
    )
  }

  if (employees.length === 0) {
    return (
      <Card>
        <CardContent className="p-5">
          <p className="text-sm font-medium text-foreground">No employees found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Designation</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Team</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.map((employee) => (
                <tr key={employee.id} className="bg-card">
                  <td className="px-4 py-3 font-medium">{employee.employee_code}</td>
                  <td className="px-4 py-3">
                    {employee.first_name} {employee.last_name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{employee.email}</td>
                  <td className="px-4 py-3">{employee.designation}</td>
                  <td className="px-4 py-3">{employee.department_id}</td>
                  <td className="px-4 py-3">{employee.team_id}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                      {employee.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
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
