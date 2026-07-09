import { useState, type ReactNode, type ChangeEvent } from "react";
import { CalcButton, FieldRow, ResultPanel } from "@/components/ResultPanel";

export { CalcButton, FieldRow, ResultPanel };

export function parseNum(v: string, def: number | null = null): number | null {
  if (typeof v !== "string" || v.trim() === "") return def;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function fmt$(n: number): string {
  if (!Number.isFinite(n)) return "-";
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
export function fmtPct(n: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(2) + "%";
}
export function fmtNum(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export const inputCls =
  "w-full max-w-xs rounded border border-border bg-white px-2 py-1 text-sm outline-none focus:border-navy-light";
export const selectCls =
  "w-full max-w-xs rounded border border-border bg-white px-2 py-1 text-sm outline-none focus:border-navy-light";

export function TextInput({
  value,
  onChange,
  placeholder,
  inputMode = "decimal",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "decimal" | "text" | "numeric";
}) {
  return (
    <input
      inputMode={inputMode}
      placeholder={placeholder}
      className={inputCls}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      className={selectCls}
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

/** Standard fixed-payment loan monthly payment. Returns 0 if inputs invalid. */
export function pmt(principal: number, annualRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}

export function futureValue(pv: number, annualRatePct: number, years: number, monthlyContribution = 0): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (n <= 0) return pv;
  const growth = Math.pow(1 + r, n);
  const fvPv = pv * growth;
  const fvPmt = r === 0 ? monthlyContribution * n : monthlyContribution * ((growth - 1) / r);
  return fvPv + fvPmt;
}

export function useCalcState<T>(initial: T) {
  const [state, setState] = useState<T>(initial);
  function set<K extends keyof T>(key: K, value: T[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }
  function reset() { setState(initial); }
  return { state, set, reset, setState };
}

export function CalcForm({
  children,
  onCalc,
  onClear,
  error,
  result,
  title,
  description,
}: {
  children: ReactNode;
  onCalc: () => void;
  onClear: () => void;
  error: string | null;
  result: ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <section className="rounded border border-border bg-white p-4">
      {title && <h2 className="mt-0">{title}</h2>}
      {description && <p className="mb-3 text-sm text-muted-foreground">{description}</p>}
      <div className="space-y-3">{children}</div>
      <div className="mt-4 flex gap-2">
        <CalcButton onClick={onCalc}>Calculate</CalcButton>
        <CalcButton variant="secondary" onClick={onClear}>Clear</CalcButton>
      </div>
      {error && (
        <p className="mt-3 rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {result && <div className="mt-4">{result}</div>}
    </section>
  );
}

export function KVGrid({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((i) => (
        <div key={i.label}>
          <div className="text-xs uppercase text-muted-foreground">{i.label}</div>
          <div className="text-lg font-bold">{i.value}</div>
        </div>
      ))}
    </div>
  );
}
