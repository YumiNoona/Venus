import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ReactNode } from "react";
import { X } from "lucide-react";

/* ─── Button ─────────────────────────────────────────────── */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-all duration-150 ease-subtle disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-[color:var(--border)] bg-[#15161a] text-[color:var(--text-primary)] hover:border-[color:var(--accent)] hover:bg-[#191b20] hover:shadow-[0_0_0_1px_var(--accent-soft),0_4px_20px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98]",
        accent:
          "border-[color:var(--accent)] bg-gradient-to-br from-[color:var(--accent)] to-[#a07d4a] text-[#0b0b0c] font-semibold hover:shadow-[0_0_20px_rgba(201,164,108,0.2),0_4px_20px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98]",
        ghost:
          "border-transparent bg-transparent text-[color:var(--text-secondary)] hover:bg-[#15161a] hover:border-[color:var(--border)] hover:text-[color:var(--text-primary)]",
        soft:
          "border-transparent bg-[color:var(--accent-soft)] text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-black hover:scale-[1.02] active:scale-[0.98]",
        danger:
          "border-transparent bg-[color:var(--danger-soft)] text-[color:var(--danger)] hover:bg-[color:var(--danger)] hover:text-white hover:scale-[1.02] active:scale-[0.98]"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-[13px]",
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

/* ─── Card ───────────────────────────────────────────────── */

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-panel relative overflow-hidden transition-all duration-200 ease-subtle hover:border-[color:var(--border-hover)]",
        className
      )}
      {...props}
    />
  );
}

/* ─── Input ──────────────────────────────────────────────── */

export function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      className="input-field"
      {...props}
    />
  );
}

/* ─── Textarea ───────────────────────────────────────────── */

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      className="input-field resize-none"
      {...props}
    />
  );
}

/* ─── Label ──────────────────────────────────────────────── */

export function Label({
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className="mb-1.5 inline-block text-xs font-medium text-[color:var(--text-secondary)]"
      {...props}
    >
      {children}
    </label>
  );
}

/* ─── Badge ──────────────────────────────────────────────── */

export function Badge({
  children,
  variant = "default"
}: {
  children: ReactNode;
  variant?: "default" | "success" | "accent";
}) {
  return (
    <span
      className={cn("badge", {
        "badge-default": variant === "default",
        "badge-success": variant === "success",
        "badge-accent": variant === "accent"
      })}
    >
      {children}
    </span>
  );
}

/* ─── Dialog ─────────────────────────────────────────────── */

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({
  children
}: {
  children: ReactNode;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out duration-200" />
      <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 origin-center animate-in fade-in-0 zoom-in-[0.98] rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] duration-200 ease-subtle">
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-[color:var(--text-secondary)] transition-colors hover:bg-[#15161a] hover:text-[color:var(--text-primary)]">
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/* ─── Separator ──────────────────────────────────────────── */

export function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-px w-full bg-[color:var(--border)]", className)}
    />
  );
}
