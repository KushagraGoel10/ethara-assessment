"use client"

import { Plus, Search } from "lucide-react"
import { useMemo, useState } from "react"

import { AppLayout } from "@/components/layout/AppLayout"
import { MasterDataModal, type FormFieldConfig } from "@/components/master-data/MasterDataModal"
import { MasterDataTable, type TableColumn } from "@/components/master-data/MasterDataTable"
import { Button } from "@/components/ui/button"
import { useFloors } from "@/hooks/useFloors"
import { useCreateZone, useUpdateZone, useZones } from "@/hooks/useZones"
import type { Zone, ZonePayload } from "@/types/zone"

const defaultValues: ZonePayload = { floor_id: 0, name: "" }

export function ZoneManager() {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [values, setValues] = useState<ZonePayload>(defaultValues)

  const zonesQuery = useZones()
  const floorsQuery = useFloors()
  const createMutation = useCreateZone()
  const updateMutation = useUpdateZone()

  const floorNameById = useMemo(
    () => new Map((floorsQuery.data ?? []).map((floor) => [floor.id, floor.name])),
    [floorsQuery.data],
  )

  const fields: FormFieldConfig<ZonePayload>[] = [
    {
      name: "floor_id",
      label: "Floor",
      type: "select",
      options: (floorsQuery.data ?? []).map((floor) => ({ label: floor.name, value: floor.id })),
    },
    { name: "name", label: "Name", type: "text" },
  ]

  const columns: TableColumn<Zone>[] = [
    { header: "Name", render: (zone) => <span className="font-medium">{zone.name}</span> },
    { header: "Floor", render: (zone) => floorNameById.get(zone.floor_id) ?? zone.floor_id },
    { header: "Created", render: (zone) => new Date(zone.created_at).toLocaleDateString() },
  ]

  const zones = useMemo(
    () =>
      (zonesQuery.data ?? []).filter((zone) => {
        const term = search.toLowerCase()
        const floor = String(floorNameById.get(zone.floor_id) ?? "")
        return zone.name.toLowerCase().includes(term) || floor.toLowerCase().includes(term)
      }),
    [floorNameById, search, zonesQuery.data],
  )

  const errorMessage = createMutation.error instanceof Error ? createMutation.error.message : updateMutation.error instanceof Error ? updateMutation.error.message : undefined

  function openCreateModal() {
    setSelectedZone(null)
    setValues({ floor_id: floorsQuery.data?.[0]?.id ?? 0, name: "" })
    createMutation.reset()
    updateMutation.reset()
    setIsOpen(true)
  }

  function openEditModal(zone: Zone) {
    setSelectedZone(zone)
    setValues({ floor_id: zone.floor_id, name: zone.name })
    createMutation.reset()
    updateMutation.reset()
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
    setSelectedZone(null)
  }

  function handleSubmit() {
    if (selectedZone) {
      updateMutation.mutate({ id: selectedZone.id, payload: values }, { onSuccess: closeModal })
      return
    }
    createMutation.mutate(values, { onSuccess: closeModal })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Zones</h2>
            <p className="mt-1 text-sm text-muted-foreground">Manage zones by floor.</p>
          </div>
          <Button onClick={openCreateModal}><Plus className="size-4" />Create</Button>
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search zones" />
        <MasterDataTable items={zones} columns={columns} isLoading={zonesQuery.isLoading || floorsQuery.isLoading} isError={zonesQuery.isError || floorsQuery.isError} emptyMessage="No zones found." errorMessage="Unable to load zones." onEdit={openEditModal} />
        <MasterDataModal open={isOpen} title={selectedZone ? "Edit Zone" : "Create Zone"} description="Save zone details." fields={fields} values={values} isSubmitting={createMutation.isPending || updateMutation.isPending} errorMessage={errorMessage} onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))} onClose={closeModal} onSubmit={handleSubmit} />
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
