"use client"

import { Plus } from "lucide-react"
import { useMemo, useState } from "react"

import { AppLayout } from "@/components/layout/AppLayout"
import { MasterDataModal, type FormFieldConfig } from "@/components/master-data/MasterDataModal"
import { MasterDataTable, type TableColumn } from "@/components/master-data/MasterDataTable"
import { Button } from "@/components/ui/button"
import { useEmployees } from "@/hooks/useEmployees"
import {
  useCreateProjectAssignment,
  useProjectAssignments,
  useUpdateProjectAssignment,
} from "@/hooks/useProjectAssignments"
import { useProjects } from "@/hooks/useProjects"
import type {
  ProjectAssignment,
  ProjectAssignmentPayload,
  ProjectAssignmentUpdatePayload,
} from "@/types/projectAssignment"

type AssignmentFormValues = ProjectAssignmentPayload & {
  is_active: boolean
}

const defaultValues: AssignmentFormValues = {
  employee_id: 0,
  project_id: 0,
  is_active: true,
}

export function ProjectAssignmentManager() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<ProjectAssignment | null>(null)
  const [values, setValues] = useState<AssignmentFormValues>(defaultValues)

  const assignmentsQuery = useProjectAssignments()
  const employeesQuery = useEmployees("")
  const projectsQuery = useProjects()
  const createMutation = useCreateProjectAssignment()
  const updateMutation = useUpdateProjectAssignment()

  const employeeNameById = useMemo(
    () =>
      new Map(
        (employeesQuery.data ?? []).map((employee) => [
          employee.id,
          `${employee.first_name} ${employee.last_name}`,
        ]),
      ),
    [employeesQuery.data],
  )
  const projectNameById = useMemo(
    () => new Map((projectsQuery.data ?? []).map((project) => [project.id, project.name])),
    [projectsQuery.data],
  )

  const fields: FormFieldConfig<AssignmentFormValues>[] = [
    {
      name: "employee_id",
      label: "Employee",
      type: "select",
      options: (employeesQuery.data ?? []).map((employee) => ({
        label: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    },
    {
      name: "project_id",
      label: "Project",
      type: "select",
      options: (projectsQuery.data ?? []).map((project) => ({
        label: project.name,
        value: project.id,
      })),
    },
    { name: "is_active", label: "Active", type: "checkbox" },
  ]

  const columns: TableColumn<ProjectAssignment>[] = [
    {
      header: "Employee",
      render: (assignment) => employeeNameById.get(assignment.employee_id) ?? assignment.employee_id,
    },
    {
      header: "Project",
      render: (assignment) => projectNameById.get(assignment.project_id) ?? assignment.project_id,
    },
    {
      header: "Status",
      render: (assignment) => (
        <span
          className={
            assignment.is_active
              ? "table-status border-emerald-200 bg-emerald-50 text-emerald-700"
              : "table-status border-border bg-muted text-muted-foreground"
          }
        >
          {assignment.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Assigned Date",
      render: (assignment) => new Date(assignment.assigned_at).toLocaleDateString(),
    },
  ]

  const errorMessage =
    createMutation.error instanceof Error
      ? createMutation.error.message
      : updateMutation.error instanceof Error
        ? updateMutation.error.message
        : undefined

  function openCreateModal() {
    setSelectedAssignment(null)
    setValues({
      employee_id: employeesQuery.data?.[0]?.id ?? 0,
      project_id: projectsQuery.data?.[0]?.id ?? 0,
      is_active: true,
    })
    createMutation.reset()
    updateMutation.reset()
    setIsOpen(true)
  }

  function openEditModal(assignment: ProjectAssignment) {
    setSelectedAssignment(assignment)
    setValues({
      employee_id: assignment.employee_id,
      project_id: assignment.project_id,
      is_active: assignment.is_active,
    })
    createMutation.reset()
    updateMutation.reset()
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
    setSelectedAssignment(null)
  }

  function handleSubmit() {
    if (selectedAssignment) {
      const payload: ProjectAssignmentUpdatePayload = {
        project_id: values.project_id,
        is_active: values.is_active,
      }
      updateMutation.mutate({ id: selectedAssignment.id, payload }, { onSuccess: closeModal })
      return
    }

    createMutation.mutate(
      {
        employee_id: values.employee_id,
        project_id: values.project_id,
      },
      { onSuccess: closeModal },
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Project Assignments</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Assign employees to active projects and manage assignment status.
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="size-4" />
            Create Assignment
          </Button>
        </div>

        <MasterDataTable
          items={assignmentsQuery.data ?? []}
          columns={columns}
          isLoading={assignmentsQuery.isLoading || employeesQuery.isLoading || projectsQuery.isLoading}
          isError={assignmentsQuery.isError || employeesQuery.isError || projectsQuery.isError}
          emptyMessage="No project assignments found."
          errorMessage="Unable to load project assignments."
          onEdit={openEditModal}
        />

        <MasterDataModal
          open={isOpen}
          title={selectedAssignment ? "Update Assignment" : "Create Assignment"}
          description="Save project assignment details."
          fields={selectedAssignment ? fields.filter((field) => field.name !== "employee_id") : fields}
          values={values}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          errorMessage={errorMessage}
          onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      </div>
    </AppLayout>
  )
}
