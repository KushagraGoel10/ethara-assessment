"use client"

import { Plus, Search } from "lucide-react"
import { useMemo, useState } from "react"

import { AppLayout } from "@/components/layout/AppLayout"
import { MasterDataModal, type FormFieldConfig } from "@/components/master-data/MasterDataModal"
import { MasterDataTable, type TableColumn } from "@/components/master-data/MasterDataTable"
import { Button } from "@/components/ui/button"
import { useCreateDepartment, useDepartments, useUpdateDepartment } from "@/hooks/useDepartments"
import type { Department, DepartmentPayload } from "@/types/department"

const defaultValues: DepartmentPayload = { name: "" }
const fields: FormFieldConfig<DepartmentPayload>[] = [{ name: "name", label: "Name", type: "text" }]
const columns: TableColumn<Department>[] = [
  { header: "Name", render: (department) => department.name },
  { header: "Created", render: (department) => new Date(department.created_at).toLocaleDateString() },
]

export function DepartmentManager() {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [values, setValues] = useState<DepartmentPayload>(defaultValues)

  const departmentsQuery = useDepartments()
  const createMutation = useCreateDepartment()
  const updateMutation = useUpdateDepartment()

  const departments = useMemo(
    () =>
      (departmentsQuery.data ?? []).filter((department) =>
        department.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [departmentsQuery.data, search],
  )

  const errorMessage =
    createMutation.error instanceof Error
      ? createMutation.error.message
      : updateMutation.error instanceof Error
        ? updateMutation.error.message
        : undefined

  function openCreateModal() {
    setSelectedDepartment(null)
    setValues(defaultValues)
    createMutation.reset()
    updateMutation.reset()
    setIsOpen(true)
  }

  function openEditModal(department: Department) {
    setSelectedDepartment(department)
    setValues({ name: department.name })
    createMutation.reset()
    updateMutation.reset()
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
    setSelectedDepartment(null)
  }

  function handleSubmit() {
    if (selectedDepartment) {
      updateMutation.mutate({ id: selectedDepartment.id, payload: values }, { onSuccess: closeModal })
      return
    }

    createMutation.mutate(values, { onSuccess: closeModal })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Departments" description="Manage department master data." onCreate={openCreateModal} />
        <SearchBox value={search} onChange={setSearch} placeholder="Search departments" />
        <MasterDataTable
          items={departments}
          columns={columns}
          isLoading={departmentsQuery.isLoading}
          isError={departmentsQuery.isError}
          emptyMessage="No departments found."
          errorMessage="Unable to load departments."
          onEdit={openEditModal}
        />
        <MasterDataModal
          open={isOpen}
          title={selectedDepartment ? "Edit Department" : "Create Department"}
          description="Save department details."
          fields={fields}
          values={values}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          errorMessage={errorMessage}
          onChange={(name, value) => setValues((current) => ({ ...current, [name]: String(value) }))}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      </div>
    </AppLayout>
  )
}

function PageHeader({ title, description, onCreate }: { title: string; description: string; onCreate: () => void }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Button onClick={onCreate}>
        <Plus className="size-4" />
        Create
      </Button>
    </div>
  )
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="relative max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input className="form-input pl-9" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}
