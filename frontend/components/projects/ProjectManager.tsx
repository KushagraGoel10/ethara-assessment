"use client"

import { Plus, Search } from "lucide-react"
import { useMemo, useState } from "react"

import { AppLayout } from "@/components/layout/AppLayout"
import { MasterDataModal, type FormFieldConfig } from "@/components/master-data/MasterDataModal"
import { MasterDataTable, type TableColumn } from "@/components/master-data/MasterDataTable"
import { Button } from "@/components/ui/button"
import { useCreateProject, useProjects, useUpdateProject } from "@/hooks/useProjects"
import type { Project, ProjectPayload } from "@/types/project"

const defaultValues: ProjectPayload = {
  name: "",
  code: "",
  description: "",
  is_active: true,
}

const fields: FormFieldConfig<ProjectPayload>[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "code", label: "Code", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "is_active", label: "Active", type: "checkbox" },
]

const columns: TableColumn<Project>[] = [
  { header: "Code", render: (project) => <span className="font-medium">{project.code}</span> },
  { header: "Name", render: (project) => project.name },
  { header: "Description", render: (project) => project.description },
  { header: "Status", render: (project) => (project.is_active ? "Active" : "Inactive") },
]

export function ProjectManager() {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [values, setValues] = useState<ProjectPayload>(defaultValues)

  const projectsQuery = useProjects()
  const createMutation = useCreateProject()
  const updateMutation = useUpdateProject()

  const projects = useMemo(
    () =>
      (projectsQuery.data ?? []).filter((project) => {
        const term = search.toLowerCase()
        return project.name.toLowerCase().includes(term) || project.code.toLowerCase().includes(term)
      }),
    [projectsQuery.data, search],
  )

  const errorMessage =
    createMutation.error instanceof Error
      ? createMutation.error.message
      : updateMutation.error instanceof Error
        ? updateMutation.error.message
        : undefined

  function openCreateModal() {
    setSelectedProject(null)
    setValues(defaultValues)
    createMutation.reset()
    updateMutation.reset()
    setIsOpen(true)
  }

  function openEditModal(project: Project) {
    setSelectedProject(project)
    setValues({
      name: project.name,
      code: project.code,
      description: project.description,
      is_active: project.is_active,
    })
    createMutation.reset()
    updateMutation.reset()
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
    setSelectedProject(null)
  }

  function handleSubmit() {
    if (selectedProject) {
      updateMutation.mutate({ id: selectedProject.id, payload: values }, { onSuccess: closeModal })
      return
    }

    createMutation.mutate(values, { onSuccess: closeModal })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
            <p className="mt-1 text-sm text-muted-foreground">Manage project master data.</p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="size-4" />
            Create
          </Button>
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects by name or code" />
        <MasterDataTable items={projects} columns={columns} isLoading={projectsQuery.isLoading} isError={projectsQuery.isError} emptyMessage="No projects found." errorMessage="Unable to load projects." onEdit={openEditModal} />
        <MasterDataModal open={isOpen} title={selectedProject ? "Edit Project" : "Create Project"} description="Save project details." fields={fields} values={values} isSubmitting={createMutation.isPending || updateMutation.isPending} errorMessage={errorMessage} onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))} onClose={closeModal} onSubmit={handleSubmit} />
      </div>
    </AppLayout>
  )
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="relative max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input className="form-input pl-9" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}
