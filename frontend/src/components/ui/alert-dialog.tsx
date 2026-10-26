"use client"

import * as React from "react"
import { AlertDialog } from "@base-ui/react/alert-dialog"
import { cn } from "cn"
import { X } from "lucide-react"

const AlertDialogRoot = AlertDialog.Root
const AlertDialogTrigger = AlertDialog.Trigger
const AlertDialogPortal = AlertDialog.Portal
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialog.Backdrop>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <AlertDialog.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80",
      className
    )}
    {...props}
  />
))
AlertDialogOverlay.displayName = "AlertDialogOverlay"

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialog.Popup>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Popup>
>(({ className, children, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialog.Popup
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
      <AlertDialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </AlertDialog.Close>
    </AlertDialog.Popup>
  </AlertDialogPortal>
))
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-4", className)}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialog.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Title>
>(({ className, ...props }, ref) => (
  <AlertDialog.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialog.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Description>
>(({ className, ...props }, ref) => (
  <AlertDialog.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialog.Close>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Close>
>(({ className, ...props }, ref) => (
  <AlertDialog.Close
    ref={ref}
    className={cn(
      "inline-flex h-8 items-center justify-center rounded-md bg-destructive px-3 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialog.Close>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Close>
>(({ className, ...props }, ref) => (
  <AlertDialog.Close
    ref={ref}
    className={cn(
      "inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialogRoot as AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}