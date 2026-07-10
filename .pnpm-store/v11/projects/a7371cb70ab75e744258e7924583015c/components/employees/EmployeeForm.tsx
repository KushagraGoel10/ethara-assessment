"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import type { Employee, EmployeePayload } from "@/types/employee"

const employeeSchema = z.object({
  employee_code: z.string().min(1, "Employee code is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Enter a valid email"),
  designation: z.string().min(1, "Designation is required"),
  department_id: z.number().int().positive("Department ID is required"),
  team_id: z.number().int().positive("Team ID is required"),
  joining_date: z.string().min(1, "Joining date is required"),
  is_new_joiner: z.boolean(),
  is_active: z.boolean(),
})

type EmployeeFormValues = z.infer<typeof employeeSchema>

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  })

  useEffect(() => {
    if (employee) {
      reset({
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
      })
      return
    }

    reset(defaultValues)
  }, [employee, reset])

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Employee Code" error={errors.employee_code?.message}>
          <input className="form-input" {...register("employee_code")} />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <input className="form-input" type="email" {...register("email")} />
        </FormField>

        <FormField label="First Name" error={errors.first_name?.message}>
          <input className="form-input" {...register("first_name")} />
        </FormField>

        <FormField label="Last Name" error={errors.last_name?.message}>
          <input className="form-input" {...register("last_name")} />
        </FormField>

        <FormField label="Designation" error={errors.designation?.message}>
          <input className="form-input" {...register("designation")} />
        </FormField>

        <FormField label="Joining Date" error={errors.joining_date?.message}>
          <input className="form-input" type="date" {...register("joining_date")} />
        </FormField>

        <FormField label="Department ID" error={errors.department_id?.message}>
          <input
            className="form-input"
            type="number"
            min="1"
            {...register("department_id", { valueAsNumber: true })}
          />
        </FormField>

        <FormField label="Team ID" error={errors.team_id?.message}>
          <input
            className="form-input"
            type="number"
            min="1"
            {...register("team_id", { valueAsNumber: true })}
          />
        </FormField>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("is_new_joiner")} />
          New joiner
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("is_active")} />
          Active
        </label>
      </div>

      {errorMessage ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex justify-end gap-2">
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

function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="space-y-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
      {error ? <span className="block text-xs text-destructive">{error}</span> : null}
    </label>
  )
}
