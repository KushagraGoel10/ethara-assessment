"use client"

import { CheckCircle2, Info, X, XCircle } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

type ToastVariant = "success" | "error" | "info"

type ToastInput = {
  title: string
  description?: string
  variant?: ToastVariant
}

type ToastItem = ToastInput & {
  id: number
  variant: ToastVariant
}

type ToastContextValue = {
  toast: (toast: ToastInput) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const variantStyles: Record<ToastVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  error: "border-destructive/25 bg-destructive/10 text-foreground",
  info: "border-border bg-card text-card-foreground",
}

const variantIcons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    (toastInput: ToastInput) => {
      const id = Date.now() + Math.random()
      const nextToast: ToastItem = {
        id,
        variant: toastInput.variant ?? "info",
        title: toastInput.title,
        description: toastInput.description,
      }

      setToasts((currentToasts) => [...currentToasts, nextToast].slice(-4))
      window.setTimeout(() => dismiss(id), 3500)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toastItem) => {
          const Icon = variantIcons[toastItem.variant]

          return (
            <div
              key={toastItem.id}
              className={cn(
                "rounded-lg border p-4 shadow-lg shadow-black/5",
                "animate-in fade-in slide-in-from-top-2 duration-200",
                variantStyles[toastItem.variant],
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 size-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{toastItem.title}</p>
                  {toastItem.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {toastItem.description}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground"
                  onClick={() => dismiss(toastItem.id)}
                  aria-label="Dismiss notification"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }

  return context
}
