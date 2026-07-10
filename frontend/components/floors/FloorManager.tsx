"use client"

import { Plus, Search } from "lucide-react"
import { useMemo, useState } from "react"

import { AppLayout } from "@/components/layout/AppLayout"
import { MasterDataModal, type FormFieldConfig } from "@/components/master-data/MasterDataModal"
import { MasterDataTable, type TableColumn } from "@/components/master-data/MasterDataTable"
import { Button } from "@/components/ui/button"
import { useCreateFloor, useFloors, useUpdateFloor } from "@/hooks/useFloors"
import type { Floor, FloorPayload } from "@/types/floor"

const defaultValues: FloorPayload = { name: "" }
const fields: FormFieldConfig<FloorPayload>[] = [{ name: "name", label: "Name", type: "text" }]
const columns: TableColumn<Floor>[] = [
  { header: "Name", render: (floor) => floor.name },
  { header: "Created", render: (floor) => new Date(floor.created_at).toLocaleDateString() },
]

export function FloorManager() {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null)
  const [values, setValues] = useState<FloorPayload>(defaultValues)

  const floorsQuery = useFloors()
  const createMutation = useCreateFloor()
  const updateMutation = useUpdateFloor()

  const floors = useMemo(
    () => (floorsQuery.data ?? []).filter((floor) => floor.name.toLowerCase().includes(search.toLowerCase())),
    [floorsQuery.data, search],
  )
  const errorMessage = createMutation.error instanceof Error ? createMutation.error.message : updateMutation.error instanceof Error ? updateMutation.error.message : undefined

  function openCreateModal() {
    setSelectedFloor(null)
    setValues(defaultValues)
    createMutation.reset()
    updateMutation.reset()
    setIsOpen(true)
  }

  function openEditModal(floor: Floor) {
    setSelectedFloor(floor)
    setValues({ name: floor.name })
    createMutation.reset()
    updateMutation.reset()
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
    setSelectedFloor(null)
  }

  function handleSubmit() {
    if (selectedFloor) {
      updateMutation.mutate({ id: selectedFloor.id, payload: values }, { onSuccess: closeModal })
      return
    }
    createMutation.mutate(values, { onSuccess: closeModal })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Floors</h2>
            <p className="mt-1 text-sm text-muted-foreground">Manage floor master data.</p>
          </div>
          <Button onClick={openCreateModal}><Plus className="size-4" />Create</Button>
        </div>
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input className="form-input pl-9" placeholder="Search floors" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <MasterDataTable items={floors} columns={columns} isLoading={floorsQuery.isLoading} isError={floorsQuery.isError} emptyMessage="No floors found." errorMessage="Unable to load floors." onEdit={openEditModal} />
        <MasterDataModal open={isOpen} title={selectedFloor ? "Edit Floor" : "Create Floor"} description="Save floor details." fields={fields} values={values} isSubmitting={createMutation.isPending || updateMutation.isPending} errorMessage={errorMessage} onChange={(name, value) => setValues((current) => ({ ...current, [name]: String(value) }))} onClose={closeModal} onSubmit={handleSubmit} />
      </div>
    </AppLayout>
  )
}
