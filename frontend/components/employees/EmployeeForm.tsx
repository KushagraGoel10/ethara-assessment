"use client"

import { useState, type ReactNode } from "react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import type { Employee, EmployeePayload } from "@/types/employee"

const employeeSchema = z.object({
  employee_code: z.string().trim().min(1, "Employee code is required"),
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email"),
  designation: z.string().trim().min(1, "Designation is required"),
  department_id: z.number().int().positive("Department ID is required"),
  team_id: z.number().int().positive("Team ID is required"),
  joining_date: z.string().min(1, "Joining date is required"),
  is_new_joiner: z.boolean(),
  is_active: z.boolean(),
})

type EmployeeFormValues = z.infer<typeof employeeSchema>
type EmployeeFormErrors = Partial<Record<keyof EmployeeFormValues, string>>

type EmployeeFormProps = {
  employee?: Employee | null
  isSubmitting: boolean
  errorMessage?: string
  onCancel: () => void
  onSubmit: (employeeData: EmployeePayload) => void
}

const defaultValues: EmployeeFormValues = {
  employee_code: "",
  first_name: "",
  last_name: "",
  email: "",
  designation: "",
  department_id: 1,
  team_id: 1,
  joining_date: "",
  is_new_joiner: false,
  is_active: true,
}

export function EmployeeForm({
  employee,
  isSubmitting,
  errorMessage,
  onCancel,
  onSubmit,
}: EmployeeFormProps) {
  const [values, setValues] = useState<EmployeeFormValues>(() => getInitialValues(employee))
  const [errors, setErrors] = useState<EmployeeFormErrors>({})

  function updateValue<T extends keyof EmployeeFormValues>(
    field: T,
    value: EmployeeFormValues[T],
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsedEmployee = employeeSchema.safeParse(values)
    if (!parsedEmployee.success) {
      const nextErrors: EmployeeFormErrors = {}

      for (const issue of parsedEmployee.error.issues) {
        const field = issue.path[0] as keyof EmployeeFormValues | undefined
        if (field) {
          nextErrors[field] = issue.message
        }
      }

      setErrors(nextErrors)
      return
    }

    onSubmit(parsedEmployee.data)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Employee Code" error={errors.employee_code}>
          <input
            className="form-input"
            value={values.employee_code}
            disabled={isSubmitting}
            onChange={(event) => updateValue("employee_code", event.target.value)}
          />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <input
            className="form-input"
            type="email"
            value={values.email}
            disabled={isSubmitting}
            onChange={(event) => updateValue("email", event.target.value)}
          />
        </FormField>

        <FormField label="First Name" error={errors.first_name}>
          <input
            className="form-input"
            value={values.first_name}
            disabled={isSubmitting}
            onChange={(event) => updateValue("first_name", event.target.value)}
          />
        </FormField>

        <FormField label="Last Name" error={errors.last_name}>
          <input
            className="form-input"
            value={values.last_name}
            disabled={isSubmitting}
            onChange={(event) => updateValue("last_name", event.target.value)}
          />
        </FormField>

        <FormField label="Designation" error={errors.designation}>
          <input
            className="form-input"
            value={values.designation}
            disabled={isSubmitting}
            onChange={(event) => updateValue("designation", event.target.value)}
          />
        </FormField>

        <FormField label="Joining Date" error={errors.joining_date}>
          <input
            className="form-input"
            type="date"
            value={values.joining_date}
            disabled={isSubmitting}
            onChange={(event) => updateValue("joining_date", event.target.value)}
          />
        </FormField>

        <FormField label="Department ID" error={errors.department_id}>
          <input
            className="form-input"
            type="number"
            min="1"
            value={values.department_id}
            disabled={isSubmitting}
            onChange={(event) => updateValue("department_id", Number(event.target.value))}
          />
        </FormField>

        <FormField label="Team ID" error={errors.team_id}>
          <input
            className="form-input"
            type="number"
            min="1"
            value={values.team_id}
            disabled={isSubmitting}
            onChange={(event) => updateValue("team_id", Number(event.target.value))}
          />
        </FormField>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={values.is_new_joiner}
            disabled={isSubmitting}
            onChange={(event) => updateValue("is_new_joiner", event.target.checked)}
          />
          New joiner
        </label>
        <label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={values.is_active}
            disabled={isSubmitting}
            onChange={(event) => updateValue("is_active", event.target.checked)}
          />
          Active
        </label>
      </div>

      {errorMessage ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Employee"}
        </Button>
      </div>
    </form>
  )
}

function getInitialValues(employee?: Employee | null): EmployeeFormValues {
  if (!employee) {
    return defaultValues
  }

  return {
    employee_code: employee.employee_code,
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    designation: employee.designation,
    department_id: employee.department_id,
    team_id: employee.team_id,
    joining_date: employee.joining_date,
    is_new_joiner: employee.is_new_joiner,
    is_active: employee.is_active,
  }
}

function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="space-y-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
      {error ? <span className="block text-xs text-destructive">{error}</span> : null}
    </label>
  )
}
