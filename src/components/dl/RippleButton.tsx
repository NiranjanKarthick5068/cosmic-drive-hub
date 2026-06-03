import { forwardRef, useState, type ButtonHTMLAttributes, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "lime" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "xl";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-violet text-white shadow-[var(--shadow-glow-violet)] hover:bg-violet-light active:scale-[0.97]",
  lime: "bg-lime text-base font-semibold shadow-[var(--shadow-glow-lime)] hover:bg-lime-light active:scale-[0.97]",
  ghost: "bg-surface-high/60 text-text-primary hover:bg-surface-high active:scale-[0.97]",
  outline:
    "bg-transparent border border-border text-text-primary hover:border-violet/60 active:scale-[0.97]",
  danger:
    "bg-danger text-white shadow-[var(--shadow-glow-danger)] hover:opacity-90 active:scale-[0.97]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-xl",
  md: "h-11 px-5 text-sm rounded-2xl",
  lg: "h-14 px-6 text-base rounded-2xl",
  xl: "h-16 px-8 text-lg rounded-3xl",
};

export const RippleButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", block, onClick, children, ...rest }, ref) => {
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>(
      [],
    );

    const handle = (e: MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const id = Date.now() + Math.random();
      setRipples((r) => [...r, { id, x, y, size }]);
      setTimeout(() => setRipples((r) => r.filter((it) => it.id !== id)), 650);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={handle}
        className={cn(
          "ripple-host relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          block && "w-full",
          className,
        )}
        {...rest}
      >
        {children}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="ripple-dot"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          />
        ))}
      </button>
    );
  },
);
RippleButton.displayName = "RippleButton";
