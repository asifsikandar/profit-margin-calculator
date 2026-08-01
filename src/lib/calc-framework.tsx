import { useState, useEffect, useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { CalcButton, FieldRow, ResultPanel } from "@/components/ResultPanel";
import { useCurrency, currencySymbol } from "@/lib/currency";


export type FieldType = "number" | "text" | "select";

export interface CalcField {
  name: string;
  label: string;
  type?: FieldType;
  default?: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  suffix?: string;
  help?: string;
}

export interface CalcResult {
  label: string;
  value: string;
  emphasize?: boolean;
}

export interface CalcDef {
  title: string;
  description?: string;
  fields: CalcField[];
  compute: (inputs: Record<string, string>) => CalcResult[] | { error: string };
  notes?: ReactNode;
  formula?: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  financial: "Financial",
  "fitness-and-health": "Fitness and Health",
  math: "Math",
  other: "Other",
};

const CATEGORY_PATH: Record<string, "/financial" | "/fitness-and-health" | "/math" | "/other"> = {
  financial: "/financial",
  "fitness-and-health": "/fitness-and-health",
  math: "/math",
  other: "/other",
};

export function CalculatorPage({
  def,
  category,
}: {
  def: CalcDef;
  category: string;
}) {
  const initial: Record<string, string> = {};
  def.fields.forEach((f) => (initial[f.name] = f.default ?? ""));
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [results, setResults] = useState<CalcResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currency = useCurrency();
  const runRef = useRef<() => void>(() => {});

  // Re-format results when the user switches currency.
  useEffect(() => {
    if (results) runRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency.code]);

  function set(name: string, v: string) {
    setValues((s) => ({ ...s, [name]: v }));
  }


  function run() {
    setError(null);
    setResults(null);
    try {
      const out = def.compute(values);
      if ("error" in out) setError(out.error);
      else setResults(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation failed.");
    }
  }
  runRef.current = run;


  function clear() {
    setValues(initial);
    setResults(null);
    setError(null);
  }

  const inputCls =
    "w-full max-w-xs rounded border border-border bg-white px-2 py-1 text-sm outline-none focus:border-navy-light";
  const catLabel = CATEGORY_LABEL[category] ?? "Calculators";
  const catPath = CATEGORY_PATH[category] ?? "/";

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <nav aria-label="Breadcrumb" className="sr-only">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><Link to={catPath}>{catLabel}</Link></li>
            <li>{def.title}</li>
          </ol>
        </nav>

        <section className="rounded border border-border bg-white p-4">
          <h2 className="mt-0">{def.title}</h2>

          <div className="space-y-3">
            {def.fields.map((f) => (
              <FieldRow key={f.name} label={f.label + (f.suffix ? ` (${f.suffix})` : "")}>
                {f.type === "select" ? (
                  <select
                    className={inputCls}
                    value={values[f.name] ?? ""}
                    onChange={(e) => set(f.name, e.target.value)}
                  >
                    {(f.options ?? []).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type === "number" ? "text" : f.type ?? "text"}
                    inputMode={f.type === "number" ? "decimal" : undefined}
                    className={inputCls}
                    placeholder={f.placeholder}
                    value={values[f.name] ?? ""}
                    onChange={(e) => set(f.name, e.target.value)}
                  />
                )}
                {f.help && <div className="text-xs text-muted-foreground">{f.help}</div>}
              </FieldRow>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <CalcButton onClick={run}>Calculate</CalcButton>
            <CalcButton variant="secondary" onClick={clear}>
              Clear
            </CalcButton>
          </div>

          {error && (
            <p className="mt-3 rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {results && results.length > 0 && (
            <div className="mt-4">
              <ResultPanel title="Result">
                <div className="grid gap-2 sm:grid-cols-2">
                  {results.map((r, i) => (
                    <div key={i}>
                      <div className="text-xs uppercase text-muted-foreground">{r.label}</div>
                      <div className={r.emphasize ? "text-xl font-bold" : "text-base font-semibold"}>
                        {r.value}
                      </div>
                    </div>
                  ))}
                </div>
              </ResultPanel>
            </div>
          )}
        </section>

        <section className="mt-4 rounded border border-border bg-white p-4">
          <h1>{def.title}</h1>
          {def.description && (
            <p className="mt-1 text-sm text-muted-foreground">{def.description}</p>
          )}
        </section>


        {def.formula && (
          <section className="mt-4 rounded border border-border bg-white p-4 text-sm">
            <h3 className="mt-0">Formula</h3>
            <pre className="whitespace-pre-wrap font-mono text-xs">{def.formula}</pre>
          </section>
        )}

        {def.notes && (
          <section className="mt-4 rounded border border-border bg-white p-4 text-sm">
            {def.notes}
          </section>
        )}
      </div>
    </Layout>
  );
}

// Helpers
export function num(v: string | undefined): number {
  if (v === undefined || v.trim() === "") return NaN;
  return Number(v);
}

export function req(v: string | undefined, label: string): number {
  const n = num(v);
  if (!Number.isFinite(n)) throw new Error(`Please enter a valid number for ${label}.`);
  return n;
}

export function reqPos(v: string | undefined, label: string): number {
  const n = req(v, label);
  if (n <= 0) throw new Error(`${label} must be greater than zero.`);
  return n;
}

export function reqNonNeg(v: string | undefined, label: string): number {
  const n = req(v, label);
  if (n < 0) throw new Error(`${label} cannot be negative.`);
  return n;
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function money(n: number): string {
  return "$" + fmt(n, 2);
}
