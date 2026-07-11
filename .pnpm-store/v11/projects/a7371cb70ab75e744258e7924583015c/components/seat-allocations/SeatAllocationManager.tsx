"use client"

import { Plus } from "lucide-react"
import { useMemo, useState } from "react"

import { AppLayout } from "@/components/layout/AppLayout"
import { MasterDataModal, type FormFieldConfig } from "@/components/master-data/MasterDataModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useEmployees } from "@/hooks/useEmployees"
import { useFloors } from "@/hooks/useFloors"
import { useSeats } from "@/hooks/useSeats"
import {
  useCreateSeatAllocation,
  useReleaseSeatAllocation,
  useSeatAllocations,
} from "@/hooks/useSeatAllocations"
import { useZones } from "@/hooks/useZones"
import type { SeatAllocation, SeatAllocationPayload } from "@/types/seatAllocation"

export function SeatAllocationManager() {
  const [isOpen, setIsOpen] = useState(false)
  const [releaseTarget, setReleaseTarget] = useState<SeatAllocation | null>(null)
  const [values, setValues] = useState<SeatAllocationPayload>({
    employee_id: 0,
    seat_id: 0,
  })

  const allocationsQuery = useSeatAllocations()
  const employeesQuery = useEmployees("")
  const seatsQuery = useSeats({})
  const zonesQuery = useZones()
  const floorsQuery = useFloors()
  const createMutation = useCreateSeatAllocation()
  const releaseMutation = useReleaseSeatAllocation()

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
  const seatById = useMemo(
    () => new Map((seatsQuery.data ?? []).map((seat) => [seat.id, seat])),
    [seatsQuery.data],
  )
  const zoneById = useMemo(
    () => new Map((zonesQuery.data ?? []).map((zone) => [zone.id, zone])),
    [zonesQuery.data],
  )
  const floorNameById = useMemo(
    () => new Map((floorsQuery.data ?? []).map((floor) => [floor.id, floor.name])),
    [floorsQuery.data],
  )

  const fields: FormFieldConfig<SeatAllocationPayload>[] = [
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
      name: "seat_id",
      label: "Seat",
      type: "select",
      options: (seatsQuery.data ?? []).map((seat) => ({
        label: seat.seat_number,
        value: seat.id,
      })),
    },
  ]

  const errorMessage =
    createMutation.error instanceof Error
      ? createMutation.error.message
      : releaseMutation.error instanceof Error
        ? releaseMutation.error.message
        : undefined

  const isLoading =
    allocationsQuery.isLoading ||
    employeesQuery.isLoading ||
    seatsQuery.isLoading ||
    zonesQuery.isLoading ||
    floorsQuery.isLoading
  const isError =
    allocationsQuery.isError ||
    employeesQuery.isError ||
    seatsQuery.isError ||
    zonesQuery.isError ||
    floorsQuery.isError

  function openAllocateModal() {
    setValues({
      employee_id: employeesQuery.data?.[0]?.id ?? 0,
      seat_id: seatsQuery.data?.[0]?.id ?? 0,
    })
    createMutation.reset()
    releaseMutation.reset()
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  function handleSubmit() {
    createMutation.mutate(values, { onSuccess: closeModal })
  }

  function confirmRelease() {
    if (!releaseTarget) {
      return
    }

    releaseMutation.mutate(releaseTarget.id, {
      onSuccess: () => setReleaseTarget(null),
    })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Seat Allocations</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Allocate and release seats for employees.
            </p>
          </div>
          <Button onClick={openAllocateModal}>
            <Plus className="size-4" />
            Allocate Seat
          </Button>
        </div>

        <SeatAllocationTable
          allocations={allocationsQuery.data ?? []}
          isLoading={isLoading}
          isError={isError}
          employeeNameById={employeeNameById}
          seatById={seatById}
          zoneById={zoneById}
          floorNameById={floorNameById}
          onRelease={setReleaseTarget}
        />

        {errorMessage ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}

        <MasterDataModal
          open={isOpen}
          title="Allocate Seat"
          description="Create a seat allocation for an employee."
          fields={fields}
          values={values}
          isSubmitting={createMutation.isPending}
          errorMessage={createMutation.error instanceof Error ? createMutation.error.message : undefined}
          onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />

        <ReleaseConfirmation
          allocation={releaseTarget}
          isSubmitting={releaseMutation.isPending}
          onCancel={() => setReleaseTarget(null)}
          onConfirm={confirmRelease}
        />
      </div>
    </AppLayout>
  )
}

function SeatAllocationTable({
  allocations,
  isLoading,
  isError,
  employeeNameById,
  seatById,
  zoneById,
  floorNameById,
  onRelease,
}: {
  allocations: SeatAllocation[]
  isLoading: boolean
  isError: boolean
  employeeNameById: Map<number, string>
  seatById: Map<number, { id: number; zone_id: number; seat_number: string }>
  zoneById: Map<number, { id: number; floor_id: number; name: string }>
  floorNameById: Map<number, string>
  onRelease: (allocation: SeatAllocation) => void
}) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-9 w-20" />
          </div>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm font-semibold text-foreground">Unable to load seat allocations.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check the backend server and refresh the page.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (allocations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-sm font-semibold text-foreground">No seat allocations found.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Allocate a seat to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead className="border-b border-border bg-muted/30 text-[11px] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-bold">Employee</th>
                <th className="px-4 py-3 font-bold">Seat</th>
                <th className="px-4 py-3 font-bold">Zone</th>
                <th className="px-4 py-3 font-bold">Floor</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allocations.map((allocation) => {
                const seat = seatById.get(allocation.seat_id)
                const zone = seat ? zoneById.get(seat.zone_id) : undefined
                return (
                  <tr key={allocation.id} className="bg-card transition-colors hover:bg-muted/35">
                    <td className="px-4 py-3.5">
                      {employeeNameById.get(allocation.employee_id) ?? allocation.employee_id}
                    </td>
                    <td className="px-4 py-3.5 font-medium">
                      {seat?.seat_number ?? allocation.seat_id}
                    </td>
                    <td className="px-4 py-3.5">{zone?.name ?? "-"}</td>
                    <td className="px-4 py-3.5">
                      {zone ? floorNameById.get(zone.floor_id) ?? zone.floor_id : "-"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "table-status",
                          allocation.is_active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-border bg-muted text-muted-foreground",
                        )}
                      >
                        {allocation.is_active ? "Active" : "Released"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!allocation.is_active}
                        onClick={() => onRelease(allocation)}
                      >
                        Release
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function ReleaseConfirmation({
  allocation,
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  allocation: SeatAllocation | null
  isSubmitting: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  if (!allocation) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-xl border border-border bg-background p-5 shadow-2xl shadow-slate-950/20">
        <h3 className="text-base font-bold">Release seat allocation?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This will mark the allocation as released. The record will not be deleted.
        </p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Releasing..." : "Release"}
          </Button>
        </div>
      </div>
    </div>
  )
}
