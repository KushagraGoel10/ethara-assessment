"use client"

import { X } from "lucide-react"

import { EmployeeForm } from "@/components/employees/EmployeeForm"
import { Button } from "@/components/ui/button"
import type { Employee, EmployeePayload } from "@/types/employee"

type EmployeeModalProps = {
  open: boolean
  mode: "create" | "edit"
  employee?: Employee | null
  isSubmitting: boolean
  errorMessage?: string
  onClose: () => void
  onSubmit: (employeeData: EmployeePayload) => void
}

export function EmployeeModal({
  open,
  mode,
  employee,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: EmployeeModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-border bg-background shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold">
              {mode === "create" ? "Create Employee" : "Edit Employee"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {mode === "create" ? "Add a new employee record." : "Update employee details."}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
        <div className="p-5">
          <EmployeeForm
            employee={employee}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            onCancel={onClose}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  )
}
