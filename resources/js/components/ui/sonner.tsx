import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useAppearance } from "@/hooks/use-appearance"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedAppearance } = useAppearance()

  return (
    <Sonner
      theme={resolvedAppearance as ToasterProps["theme"]}
      className="toaster group"
      richColors
      toastOptions={{
        classNames: {
          toast: "group toast pointer-events-auto relative flex w-full items-start gap-3 rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg data-[type=success]:border-emerald-200 data-[type=success]:bg-emerald-50 data-[type=success]:text-emerald-950 data-[type=info]:border-sky-200 data-[type=info]:bg-sky-50 data-[type=info]:text-sky-950 data-[type=warning]:border-amber-200 data-[type=warning]:bg-amber-50 data-[type=warning]:text-amber-950 data-[type=error]:border-rose-200 data-[type=error]:bg-rose-50 data-[type=error]:text-rose-950 dark:data-[type=success]:border-emerald-900/60 dark:data-[type=success]:bg-emerald-950/40 dark:data-[type=success]:text-emerald-50 dark:data-[type=info]:border-sky-900/60 dark:data-[type=info]:bg-sky-950/40 dark:data-[type=info]:text-sky-50 dark:data-[type=warning]:border-amber-900/60 dark:data-[type=warning]:bg-amber-950/40 dark:data-[type=warning]:text-amber-50 dark:data-[type=error]:border-rose-900/60 dark:data-[type=error]:bg-rose-950/40 dark:data-[type=error]:text-rose-50",
          title: "text-sm font-medium leading-none tracking-tight",
          description: "text-sm text-muted-foreground",
          actionButton:
            "inline-flex h-8 shrink-0 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground",
          cancelButton:
            "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground",
          closeButton:
            "absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:text-foreground",
        },
      }}
      closeButton
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
