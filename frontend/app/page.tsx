"use client"

import {
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  Sofa,
  UserCheck,
  Users,
} from "lucide-react"
import type { ElementType } from "react"

import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboard } from "@/hooks/useDashboard"
import { cn } from "@/lib/utils"

type MetricCardProps = {
  title: string
  value: number | string
  description: string
  icon: ElementType
  tone: "indigo" | "emerald" | "blue" | "amber" | "rose" | "violet"
}

const metricToneStyles = {
  indigo: "border-indigo-200 bg-indigo-50/60 text-indigo-600",
  emerald: "border-emerald-200 bg-emerald-50/70 text-emerald-600",
  blue: "border-blue-200 bg-blue-50/70 text-blue-600",
  amber: "border-amber-200 bg-amber-50/70 text-amber-600",
  rose: "border-rose-200 bg-rose-50/70 text-rose-600",
  violet: "border-violet-200 bg-violet-50/70 text-violet-600",
}

function MetricCard({ title, value, description, icon: Icon, tone }: MetricCardProps) {
  return (
    <Card className={cn("border", metricToneStyles[tone])}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-background/75">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Skeleton className="size-11 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const { data, isLoading, isError } = useDashboard()

  return (
    <AppLayout>
      <div className="min-w-0 space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back, Admin! Here&apos;s what&apos;s happening in your workspace.
            </p>
          </div>
          <div className="flex h-10 w-fit shrink-0 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground shadow-sm">
            <CalendarDays className="size-4" />
            <span>Current workspace snapshot</span>
          </div>
        </div>

        {isError ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm font-semibold text-foreground">
                Unable to load dashboard data.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Check the backend server and refresh the page.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {isLoading ? (
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
            {Array.from({ length: 7 }).map((_, index) => (
              <MetricCardSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {data ? (
          <>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
              <MetricCard
                title="Total Employees"
                value={data.total_employees}
                description="People in workspace"
                icon={Users}
                tone="indigo"
              />
              <MetricCard
                title="Total Seats"
                value={data.total_seats}
                description="Configured seats"
                icon={Sofa}
                tone="emerald"
              />
              <MetricCard
                title="Occupied Seats"
                value={data.occupied_seats}
                description={`${data.seat_utilization_percentage}% utilization`}
                icon={Sofa}
                tone="blue"
              />
              <MetricCard
                title="Available Seats"
                value={data.available_seats}
                description={`${100 - data.seat_utilization_percentage}% available`}
                icon={ClipboardList}
                tone="amber"
              />
              <MetricCard
                title="Active Projects"
                value={data.active_projects}
                description="Currently assignable"
                icon={BriefcaseBusiness}
                tone="rose"
              />
              <MetricCard
                title="New Joiners"
                value={data.new_joiners}
                description="Marked as new"
                icon={UserCheck}
                tone="violet"
              />
              <MetricCard
                title="Pending Allocations"
                value={data.new_joiners_without_seat_allocation}
                description="Require attention"
                icon={ClipboardList}
                tone="blue"
              />
            </div>

            <div className="grid min-w-0 gap-4 xl:grid-cols-2 2xl:grid-cols-[1fr_1.35fr_1fr]">
              <Card className="min-w-0">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-foreground">Seat Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex min-w-0 flex-col items-center gap-6 sm:flex-row">
                    <div
                      className="grid size-40 shrink-0 place-items-center rounded-full"
                      style={{
                        background: `conic-gradient(#635bff ${
                          data.seat_utilization_percentage * 3.6
                        }deg, #edf0f7 0deg)`,
                      }}
                    >
                      <div className="grid size-28 place-items-center rounded-full bg-card text-center">
                        <div>
                          <p className="text-2xl font-bold">
                            {data.seat_utilization_percentage}%
                          </p>
                          <p className="text-xs font-semibold text-muted-foreground">Utilized</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full min-w-0 space-y-4 text-sm">
                      <LegendRow
                        color="bg-primary"
                        label="Utilized Seats"
                        value={`${data.occupied_seats} (${data.seat_utilization_percentage}%)`}
                      />
                      <LegendRow
                        color="bg-muted"
                        label="Available Seats"
                        value={`${data.available_seats} (${
                          100 - data.seat_utilization_percentage
                        }%)`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="min-w-0">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-foreground">Team Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarOverview
                    items={data.utilization_by_team.map((item) => ({
                      label: item.team,
                      value: item.employees,
                    }))}
                  />
                </CardContent>
              </Card>

              <Card className="min-w-0 xl:col-span-2 2xl:col-span-1">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold text-foreground">Recent Activity</CardTitle>
                  <span className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
                    View all
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-dashed border-border p-6 text-center">
                    <p className="text-sm font-semibold text-foreground">Activity feed coming soon.</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      No activity endpoint is available yet.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="min-w-0">
              <CardHeader>
                <CardTitle className="text-base font-bold text-foreground">Project Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <BarOverview
                  items={data.utilization_by_project.map((item) => ({
                    label: item.project,
                    value: item.employees,
                  }))}
                />
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </AppLayout>
  )
}

function LegendRow({
  color,
  label,
  value,
}: {
  color: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className={cn("size-3 rounded-full", color)} />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-bold text-foreground">{value}</span>
    </div>
  )
}

function BarOverview({ items }: { items: { label: string; value: number }[] }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1)

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center">
        <p className="text-sm font-semibold text-foreground">No data available.</p>
      </div>
    )
  }

  return (
    <div className="min-w-0 overflow-x-auto">
      <div className="flex h-44 min-w-max items-end gap-4">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex w-20 shrink-0 flex-col items-center gap-2">
          <div className="flex h-32 w-full items-end justify-center border-b border-border">
            <div
              className="w-6 rounded-t-md bg-primary/40"
              style={{ height: `${Math.max((item.value / maxValue) * 100, 8)}%` }}
              title={`${item.label}: ${item.value}`}
            />
          </div>
          <p className="max-w-24 truncate text-center text-xs text-muted-foreground">
            {item.label}
          </p>
        </div>
      ))}
      </div>
    </div>
  )
}
