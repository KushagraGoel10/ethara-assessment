"use client"

import { Plus, Search } from "lucide-react"
import { useMemo, useState } from "react"

import { AppLayout } from "@/components/layout/AppLayout"
import { MasterDataModal, type FormFieldConfig } from "@/components/master-data/MasterDataModal"
import { MasterDataTable, type TableColumn } from "@/components/master-data/MasterDataTable"
import { Button } from "@/components/ui/button"
import { useFloors } from "@/hooks/useFloors"
import { useCreateSeat, useOccupiedSeatIds, useSeats, useUpdateSeat } from "@/hooks/useSeats"
import { useZones } from "@/hooks/useZones"
import type { Seat } from "@/types/seat"

type SeatFormValues = {
  floor_id: number
  zone_id: number
  seat_number: string
}

const defaultValues: SeatFormValues = { floor_id: 0, zone_id: 0, seat_number: "" }

export function SeatManager() {
  const [seatNumber, setSeatNumber] = useState("")
  const [floorId, setFloorId] = useState(0)
  const [zoneId, setZoneId] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const [values, setValues] = useState<SeatFormValues>(defaultValues)

  const floorsQuery = useFloors()
  const zonesQuery = useZones()
  const seatsQuery = useSeats({
    seatNumber,
    floorId: floorId || undefined,
    zoneId: zoneId || undefined,
  })
  const occupiedQuery = useOccupiedSeatIds()
  const createMutation = useCreateSeat()
  const updateMutation = useUpdateSeat()

  const floorNameById = useMemo(
    () => new Map((floorsQuery.data ?? []).map((floor) => [floor.id, floor.name])),
    [floorsQuery.data],
  )
  const zoneById = useMemo(
    () => new Map((zonesQuery.data ?? []).map((zone) => [zone.id, zone])),
    [zonesQuery.data],
  )

  const formZones = useMemo(
    () => (zonesQuery.data ?? []).filter((zone) => !values.floor_id || zone.floor_id === values.floor_id),
    [values.floor_id, zonesQuery.data],
  )

  const columns: TableColumn<Seat>[] = [
    { header: "Seat Number", render: (seat) => <span className="font-medium">{seat.seat_number}</span> },
    { header: "Zone", render: (seat) => zoneById.get(seat.zone_id)?.name ?? seat.zone_id },
    {
      header: "Floor",
      render: (seat) => {
        const zone = zoneById.get(seat.zone_id)
        return zone ? floorNameById.get(zone.floor_id) ?? zone.floor_id : "-"
      },
    },
    {
      header: "Occupied",
      render: (seat) => (occupiedQuery.data?.has(seat.id) ? "Occupied" : "Available"),
    },
  ]

  const fields: FormFieldConfig<SeatFormValues>[] = [
    {
      name: "floor_id",
      label: "Floor",
      type: "select",
      options: (floorsQuery.data ?? []).map((floor) => ({ label: floor.name, value: floor.id })),
    },
    {
      name: "zone_id",
      label: "Zone",
      type: "select",
      options: formZones.map((zone) => ({ label: zone.name, value: zone.id })),
    },
    { name: "seat_number", label: "Seat Number", type: "text" },
  ]

  const errorMessage = createMutation.error instanceof Error ? createMutation.error.message : updateMutation.error instanceof Error ? updateMutation.error.message : undefined

  function openCreateModal() {
    const firstFloorId = floorsQuery.data?.[0]?.id ?? 0
    const firstZoneId = zonesQuery.data?.find((zone) => zone.floor_id === firstFloorId)?.id ?? zonesQuery.data?.[0]?.id ?? 0
    setSelectedSeat(null)
    setValues({ floor_id: firstFloorId, zone_id: firstZoneId, seat_number: "" })
    createMutation.reset()
    updateMutation.reset()
    setIsOpen(true)
  }

  function openEditModal(seat: Seat) {
    const zone = zoneById.get(seat.zone_id)
    setSelectedSeat(seat)
    setValues({
      floor_id: zone?.floor_id ?? 0,
      zone_id: seat.zone_id,
      seat_number: seat.seat_number,
    })
    createMutation.reset()
    updateMutation.reset()
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
    setSelectedSeat(null)
  }

  function handleSubmit() {
    const payload = {
      zone_id: values.zone_id,
      seat_number: values.seat_number,
    }

    if (selectedSeat) {
      updateMutation.mutate({ id: selectedSeat.id, payload }, { onSuccess: closeModal })
      return
    }
    createMutation.mutate(payload, { onSuccess: closeModal })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Seats</h2>
            <p className="mt-1 text-sm text-muted-foreground">Manage seats by floor and zone.</p>
          </div>
          <Button onClick={openCreateModal}><Plus className="size-4" />Create</Button>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input className="form-input pl-9" placeholder="Search by seat number" value={seatNumber} onChange={(event) => setSeatNumber(event.target.value)} />
          </div>
          <select className="form-input" value={floorId} onChange={(event) => setFloorId(Number(event.target.value))}>
            <option value={0}>All floors</option>
            {(floorsQuery.data ?? []).map((floor) => <option key={floor.id} value={floor.id}>{floor.name}</option>)}
          </select>
          <select className="form-input" value={zoneId} onChange={(event) => setZoneId(Number(event.target.value))}>
            <option value={0}>All zones</option>
            {(zonesQuery.data ?? []).filter((zone) => !floorId || zone.floor_id === floorId).map((zone) => <option key={zone.id} value={zone.id}>{zone.name}</option>)}
          </select>
        </div>

        <MasterDataTable items={seatsQuery.data ?? []} columns={columns} isLoading={seatsQuery.isLoading || floorsQuery.isLoading || zonesQuery.isLoading || occupiedQuery.isLoading} isError={seatsQuery.isError || floorsQuery.isError || zonesQuery.isError || occupiedQuery.isError} emptyMessage="No seats found." errorMessage="Unable to load seats." onEdit={openEditModal} />
        <MasterDataModal open={isOpen} title={selectedSeat ? "Edit Seat" : "Create Seat"} description="Save seat details." fields={fields} values={values} isSubmitting={createMutation.isPending || updateMutation.isPending} errorMessage={errorMessage} onChange={(name, value) => {
          setValues((current) => {
            if (name === "floor_id") {
              const nextFloorId = Number(value)
              const nextZoneId = zonesQuery.data?.find((zone) => zone.floor_id === nextFloorId)?.id ?? 0
              return { ...current, floor_id: nextFloorId, zone_id: nextZoneId }
            }
            return { ...current, [name]: value }
          })
        }} onClose={closeModal} onSubmit={handleSubmit} />
      </div>
    </AppLayout>
  )
}
