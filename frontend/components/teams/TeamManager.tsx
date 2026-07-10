"use client"

import { Plus, Search } from "lucide-react"
import { useMemo, useState } from "react"

import { AppLayout } from "@/components/layout/AppLayout"
import { MasterDataModal, type FormFieldConfig } from "@/components/master-data/MasterDataModal"
import { MasterDataTable, type TableColumn } from "@/components/master-data/MasterDataTable"
import { Button } from "@/components/ui/button"
import { useDepartments } from "@/hooks/useDepartments"
import { useCreateTeam, useTeams, useUpdateTeam } from "@/hooks/useTeams"
import type { Team, TeamPayload } from "@/types/team"

const defaultValues: TeamPayload = { department_id: 0, name: "" }

export function TeamManager() {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [values, setValues] = useState<TeamPayload>(defaultValues)

  const teamsQuery = useTeams()
  const departmentsQuery = useDepartments()
  const createMutation = useCreateTeam()
  const updateMutation = useUpdateTeam()

  const departmentNameById = useMemo(
    () => new Map((departmentsQuery.data ?? []).map((department) => [department.id, department.name])),
    [departmentsQuery.data],
  )

  const fields: FormFieldConfig<TeamPayload>[] = [
    {
      name: "department_id",
      label: "Department",
      type: "select",
      options: (departmentsQuery.data ?? []).map((department) => ({ label: department.name, value: department.id })),
    },
    { name: "name", label: "Name", type: "text" },
  ]

  const columns: TableColumn<Team>[] = [
    { header: "Name", render: (team) => <span className="font-medium">{team.name}</span> },
    { header: "Department", render: (team) => departmentNameById.get(team.department_id) ?? team.department_id },
    { header: "Created", render: (team) => new Date(team.created_at).toLocaleDateString() },
  ]

  const teams = useMemo(
    () =>
      (teamsQuery.data ?? []).filter((team) => {
        const term = search.toLowerCase()
        const department = String(departmentNameById.get(team.department_id) ?? "")
        return team.name.toLowerCase().includes(term) || department.toLowerCase().includes(term)
      }),
    [departmentNameById, search, teamsQuery.data],
  )

  const errorMessage = createMutation.error instanceof Error ? createMutation.error.message : updateMutation.error instanceof Error ? updateMutation.error.message : undefined

  function openCreateModal() {
    setSelectedTeam(null)
    setValues({ department_id: departmentsQuery.data?.[0]?.id ?? 0, name: "" })
    createMutation.reset()
    updateMutation.reset()
    setIsOpen(true)
  }

  function openEditModal(team: Team) {
    setSelectedTeam(team)
    setValues({ department_id: team.department_id, name: team.name })
    createMutation.reset()
    updateMutation.reset()
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
    setSelectedTeam(null)
  }

  function handleSubmit() {
    if (selectedTeam) {
      updateMutation.mutate({ id: selectedTeam.id, payload: values }, { onSuccess: closeModal })
      return
    }
    createMutation.mutate(values, { onSuccess: closeModal })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Teams</h2>
            <p className="mt-1 text-sm text-muted-foreground">Manage teams by department.</p>
          </div>
          <Button onClick={openCreateModal}><Plus className="size-4" />Create</Button>
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search teams" />
        <MasterDataTable items={teams} columns={columns} isLoading={teamsQuery.isLoading || departmentsQuery.isLoading} isError={teamsQuery.isError || departmentsQuery.isError} emptyMessage="No teams found." errorMessage="Unable to load teams." onEdit={openEditModal} />
        <MasterDataModal open={isOpen} title={selectedTeam ? "Edit Team" : "Create Team"} description="Save team details." fields={fields} values={values} isSubmitting={createMutation.isPending || updateMutation.isPending} errorMessage={errorMessage} onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))} onClose={closeModal} onSubmit={handleSubmit} />
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
