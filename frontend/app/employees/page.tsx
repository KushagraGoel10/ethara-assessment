"use client"

import { Plus, Search } from "lucide-react"
import { useState } from "react"

import { EmployeeModal } from "@/components/employees/EmployeeModal"
import { EmployeeTable } from "@/components/employees/EmployeeTable"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { useCreateEmployee } from "@/hooks/useCreateEmployee"
import { useEmployees } from "@/hooks/useEmployees"
import { useUpdateEmployee } from "@/hooks/useUpdateEmployee"
import type { Employee, EmployeePayload } from "@/types/employee"

export default function EmployeesPage() {
  const [search, setSearch] = useState("")
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const employeesQuery = useEmployees(search)
  const createEmployeeMutation = useCreateEmployee()
  const updateEmployeeMutation = useUpdateEmployee()

  const mutationError =
    createEmployeeMutation.error instanceof Error
      ? createEmployeeMutation.error.message
      : updateEmployeeMutation.error instanceof Error
        ? updateEmployeeMutation.error.message
        : undefined

  function openCreateModal() {
    createEmployeeMutation.reset()
    updateEmployeeMutation.reset()
    setSelectedEmployee(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  function openEditModal(employee: Employee) {
    createEmployeeMutation.reset()
    updateEmployeeMutation.reset()
    setSelectedEmployee(employee)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setSelectedEmployee(null)
  }

  function handleSubmit(employeeData: EmployeePayload) {
    if (modalMode === "create") {
      createEmployeeMutation.mutate(employeeData, {
        onSuccess: closeModal,
      })
      return
    }

    if (!selectedEmployee) {
      return
    }

    updateEmployeeMutation.mutate(
      {
        employeeId: selectedEmployee.id,
        employeeData,
      },
      {
        onSuccess: closeModal,
      },
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Employees</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage employee records and basic project mapping attributes.
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="size-4" />
            Create Employee
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="form-input pl-9"
            placeholder="Search by employee code or name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <EmployeeTable
          employees={employeesQuery.data ?? []}
          isLoading={employeesQuery.isLoading}
          isError={employeesQuery.isError}
          onEdit={openEditModal}
        />

        <EmployeeModal
          open={isModalOpen}
          mode={modalMode}
          employee={selectedEmployee}
          isSubmitting={createEmployeeMutation.isPending || updateEmployeeMutation.isPending}
          errorMessage={mutationError}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      </div>
    </AppLayout>
  )
}
