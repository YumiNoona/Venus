import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ReactNode } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md border border-[color:var(--border)] bg-[#15161a] px-4 py-2 text-sm font-medium text-[color:var(--text-primary)] transition-all duration-150 ease-subtle hover:border-[color:var(--accent)] hover:bg-[#191b20] hover:text-[color:var(--text-primary)] hover:shadow-subtle hover:scale-[1.02] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "",
        ghost:
          "border-transparent bg-transparent hover:bg-[#15161a] hover:border-[color:var(--border)]",
        soft:
          "border-transparent bg-[color:var(--accent-soft)] text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-black"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-5 text-sm"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-panel relative overflow-hidden transition-all duration-150 ease-subtle hover:border-[color:var(--accent-soft)] hover:shadow-subtle",
        className
      )}
      {...props}
    />
  );
}

export function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      className="w-full rounded-md border border-[color:var(--border)] bg-[#09090b] px-3 py-2 text-sm text-[color:var(--text-primary)] outline-none ring-0 transition-colors duration-150 ease-subtle placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--accent)]"
      {...props}
    />
  );
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      className="w-full rounded-md border border-[color:var(--border)] bg-[#09090b] px-3 py-2 text-sm text-[color:var(--text-primary)] outline-none ring-0 transition-colors duration-150 ease-subtle placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--accent)]"
      {...props}
    />
  );
}

export function Label({
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className="mb-1 inline-block text-xs font-medium uppercase tracking-wide text-[color:var(--text-secondary)]"
      {...props}
    >
      {children}
    </label>
  );
}

export function Badge({
  children
}: {
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[#15161a] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[color:var(--text-secondary)]">
      {children}
    </span>
  );
}

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({
  children
}: {
  children: ReactNode;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out" />
      <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 origin-center animate-in fade-in-0 zoom-in-95 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-subtle duration-150 ease-subtle">
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

