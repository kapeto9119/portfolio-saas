"use client";

import * as React from "react";
import {
  useFormContext,
  Controller,
  FieldValues,
  FieldPath,
  ControllerProps,
  FormProvider,
  UseFormReturn,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                            Form Context Wrapper                            */
/* -------------------------------------------------------------------------- */

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  children: React.ReactNode;
}

/**
 * This Form component is now a context provider only.
 * It does not render a <form> element.
 */
const Form = <T extends FieldValues>({ form, children }: FormProps<T>) => {
  return <FormProvider {...form}>{children}</FormProvider>;
};

/* -------------------------------------------------------------------------- */
/*                         FormField and Context                              */
/* -------------------------------------------------------------------------- */

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                         Form Label Component                               */
/* -------------------------------------------------------------------------- */

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label ref={ref} className={cn("text-sm font-medium", className)} {...props} />
  );
});
FormLabel.displayName = "FormLabel";

/* -------------------------------------------------------------------------- */
/*                         Form Control Component                             */
/* -------------------------------------------------------------------------- */

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(className)} {...props} />;
});
FormControl.displayName = "FormControl";

/* -------------------------------------------------------------------------- */
/*                         Form Message Component                             */
/* -------------------------------------------------------------------------- */

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { name } = React.useContext(FormFieldContext);
  const formContext = useFormContext();
  const error = name && formContext && formContext.formState ? formContext.formState.errors[name] : null;
  const body = error ? String(error.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p ref={ref} className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

/* -------------------------------------------------------------------------- */
/*                         Form Item Component                                */
/* -------------------------------------------------------------------------- */

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  );
});
FormItem.displayName = "FormItem";

/* -------------------------------------------------------------------------- */
/*                         Form Description Component                         */
/* -------------------------------------------------------------------------- */

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
});
FormDescription.displayName = "FormDescription";

/* -------------------------------------------------------------------------- */
/*                                 Exports                                    */
/* -------------------------------------------------------------------------- */

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};