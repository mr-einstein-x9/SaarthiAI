import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "verse";
}

export default function Card({
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  const base =
    "rounded-3xl border border-[var(--border)] overflow-hidden transition-all duration-300";

  const variants = {
    default: "bg-[var(--bg-glass)] backdrop-blur-xl",
    elevated:
      "bg-[var(--bg-elevated)] backdrop-blur-xl shadow-2xl shadow-black/30",
    verse:
      "bg-[var(--bg-glass)] backdrop-blur-xl border-t-2 border-t-[var(--accent-gold)]",
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
