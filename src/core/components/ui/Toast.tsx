import { forwardRef, createContext, useCallback, useContext, useState } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

// --- Toast Variants ---

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-lg border p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border-border bg-surface text-text-primary',
        success: 'border-success/30 bg-success/10 text-success',
        destructive: 'border-destructive/30 bg-destructive/10 text-destructive',
        warning: 'border-warning/30 bg-warning/10 text-warning',
        info: 'border-primary/30 bg-primary/10 text-primary',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

// --- Toast Primitives ---

const RadixToastProvider = ToastPrimitive.Provider

const ToastViewport = forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = 'ToastViewport'

const ToastRoot = forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
))
ToastRoot.displayName = 'ToastRoot'

const ToastClose = forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-muted opacity-0 transition-opacity hover:text-text-primary focus:opacity-100 focus:outline-none group-hover:opacity-100',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
))
ToastClose.displayName = 'ToastClose'

const ToastTitle = forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn('text-sm font-semibold', className)} {...props} />
))
ToastTitle.displayName = 'ToastTitle'

const ToastDescription = forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
))
ToastDescription.displayName = 'ToastDescription'

export {
  RadixToastProvider,
  ToastViewport,
  ToastRoot,
  ToastClose,
  ToastTitle,
  ToastDescription,
  toastVariants,
}

// --- Types ---

type ToastType = 'success' | 'error' | 'warning' | 'info'

type ToastVariant = 'default' | 'success' | 'destructive' | 'warning' | 'info'

const TYPE_TO_VARIANT: Readonly<Record<ToastType, ToastVariant>> = {
  success: 'success',
  error: 'destructive',
  warning: 'warning',
  info: 'info',
}

const TYPE_ICONS: Readonly<Record<ToastType, React.ReactNode>> = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
}

interface ToastData {
  readonly id: string
  readonly type: ToastType
  readonly message: string
  readonly duration: number
}

// --- Context & Hook (backwards compatible) ---

interface ToastContextValue {
  readonly success: (message: string, duration?: number) => void
  readonly error: (message: string, duration?: number) => void
  readonly warning: (message: string, duration?: number) => void
  readonly info: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let toastCounter = 0
const DEFAULT_DURATION = 5000

export function ToastProvider({ children }: { readonly children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<readonly ToastData[]>([])

  const addToast = useCallback((type: ToastType, message: string, duration?: number) => {
    const id = `toast-${++toastCounter}`
    const toast: ToastData = { id, type, message, duration: duration ?? DEFAULT_DURATION }
    setToasts((prev) => [...prev, toast])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const contextValue: ToastContextValue = {
    success: useCallback(
      (message: string, duration?: number) => addToast('success', message, duration),
      [addToast],
    ),
    error: useCallback(
      (message: string, duration?: number) => addToast('error', message, duration),
      [addToast],
    ),
    warning: useCallback(
      (message: string, duration?: number) => addToast('warning', message, duration),
      [addToast],
    ),
    info: useCallback(
      (message: string, duration?: number) => addToast('info', message, duration),
      [addToast],
    ),
  }

  return (
    <ToastContext.Provider value={contextValue}>
      <RadixToastProvider>
        {children}
        {toasts.map((t) => (
          <ToastRoot
            key={t.id}
            variant={TYPE_TO_VARIANT[t.type]}
            duration={t.duration}
            onOpenChange={(open) => {
              if (!open) dismiss(t.id)
            }}
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0">{TYPE_ICONS[t.type]}</span>
              <ToastDescription>{t.message}</ToastDescription>
            </div>
            <ToastClose />
          </ToastRoot>
        ))}
        <ToastViewport />
      </RadixToastProvider>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

// Legacy export kept for backwards compatibility with barrel import
export const useToastStore = undefined
