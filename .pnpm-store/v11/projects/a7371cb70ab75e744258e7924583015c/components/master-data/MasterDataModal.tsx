"use client"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"

export type FormFieldOption = {
  label: string
  value: number | string
}

export type FormFieldConfig<T extends object> = {
  name: keyof T
  label: string
  type: "text" | "number" | "textarea" | "checkbox" | "select"
  options?: FormFieldOption[]
}

type MasterDataModalProps<T extends object> = {
  open: boolean
  title: string
  description: string
  fields: FormFieldConfig<T>[]
  values: T
  isSubmitting: boolean
  errorMessage?: string
  onChange: (name: keyof T, value: string | number | boolean) => void
  onClose: () => void
  onSubmit: () => void
}

export function MasterDataModal<T extends object>({
  open,
  title,
  description,
  fields,
  values,
  isSubmitting,
  errorMessage,
  onChange,
  onClose,
  onSubmit,
}: MasterDataModalProps<T>) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-background shadow-xl shadow-black/10">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog">
            <X className="size-4" />
          </Button>
        </div>

        <form
          className="space-y-4 p-5"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => {
              const value = values[field.name] as string | number | boolean

              if (field.type === "checkbox") {
                return (
                  <label
                    key={String(field.name)}
                    className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(event) => onChange(field.name, event.target.checked)}
                    />
                    {field.label}
                  </label>
                )
              }

              if (field.type === "textarea") {
                return (
                  <label key={String(field.name)} className="space-y-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">{field.label}</span>
                    <textarea
                      className="form-input min-h-24 py-2"
                      value={String(value)}
                      disabled={isSubmitting}
                      onChange={(event) => onChange(field.name, event.target.value)}
                    />
                  </label>
                )
              }

              if (field.type === "select") {
                return (
                  <label key={String(field.name)} className="space-y-1.5 text-sm">
                    <span className="font-medium text-foreground">{field.label}</span>
                    <select
                      className="form-input"
                      value={String(value)}
                      disabled={isSubmitting}
                      onChange={(event) => onChange(field.name, Number(event.target.value))}
                    >
                      <option value="">Select</option>
                      {(field.options ?? []).map((option) => (
                        <option key={String(option.value)} value={String(option.value)}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )
              }

              return (
                <label key={String(field.name)} className="space-y-1.5 text-sm">
                  <span className="font-medium text-foreground">{field.label}</span>
                  <input
                    className="form-input"
                    type={field.type}
                    value={String(value)}
                    disabled={isSubmitting}
                    onChange={(event) =>
                      onChange(
                        field.name,
                        field.type === "number" ? Number(event.target.value) : event.target.value,
                      )
                    }
                  />
                </label>
              )
            })}
          </div>

          {errorMessage ? (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
