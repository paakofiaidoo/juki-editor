import * as React from "react"
import * as FormPrimitive from "@radix-ui/react-form"

import { cn } from "@/lib/utils"

export interface FormProps extends React.ComponentPropsWithoutRef<typeof FormPrimitive.Root> {}

const Form = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Root>,
  FormProps
>(({ className, ...props }, ref) => (
  <FormPrimitive.Root
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Form.displayName = FormPrimitive.Root.displayName

const FormField = FormPrimitive.Field

const FormItem = FormPrimitive.Item

const FormLabel = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Label>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Label
    ref={ref}
    className={cn("text-sm font-medium", className)}
    {...props}
  />
))
FormLabel.displayName = FormPrimitive.Label.displayName

const FormMessage = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Message>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Message>
>(({ className, children, ...props }, ref) => (
  <FormPrimitive.Message
    ref={ref}
    className={cn("text-sm text-red-600", className)}
    {...props}
  >
    {children}
  </FormPrimitive.Message>
))
FormMessage.displayName = FormPrimitive.Message.displayName

const FormControl = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Control>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Control>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Control
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
FormControl.displayName = FormPrimitive.Control.displayName

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
}