import type { ReactNode } from "react";

export function ResultPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded border border-border">
      <div className="bg-lime px-3 py-2 text-sm font-bold uppercase tracking-wide text-white">
        {title}
      </div>
      <div className="bg-white p-4 text-sm">{children}</div>
    </div>
  );
}

export function CalcButton({
  onClick,
  children,
  variant = "primary",
  type = "button",
}: {
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center gap-1 rounded px-4 py-2 text-sm font-semibold transition-colors";
  const cls =
    variant === "primary"
      ? "bg-lime text-white hover:bg-lime-dark"
      : "bg-graybg text-foreground border border-border hover:bg-border";
  return (
    <button type={type} onClick={onClick} className={`${base} ${cls}`}>
      {children}
      {variant === "primary" && <span aria-hidden>›</span>}
    </button>
  );
}

export function FieldRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:items-center sm:gap-3">
      <label className="min-w-0 text-sm leading-snug text-foreground">{label}</label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
