"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboard } from "@/hooks/useDashboard"

function MetricCard({ title, value }: { title: string; value: number | string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold text-foreground">{value}</div>
      </CardContent>
    </Card>
  )
}

function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-28" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const { data, isLoading, isError } = useDashboard()

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome to the Seat Allocation & Project Mapping System.
          </p>
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <MetricCardSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {data ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Total Employees" value={data.total_employees} />
              <MetricCard title="Total Seats" value={data.total_seats} />
              <MetricCard title="Occupied Seats" value={data.occupied_seats} />
              <MetricCard title="Available Seats" value={data.available_seats} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Seat Utilization"
                value={`${data.seat_utilization_percentage}%`}
              />
              <MetricCard title="Active Projects" value={data.active_projects} />
              <MetricCard title="New Joiners" value={data.new_joiners} />
              <MetricCard
                title="New Joiners Pending Seat Allocation"
                value={data.new_joiners_without_seat_allocation}
              />
            </div>
          </>
        ) : null}
      </div>
    </AppLayout>
  )
}
