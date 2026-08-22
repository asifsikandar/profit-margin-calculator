import { useState, useEffect, useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { CalcButton, FieldRow, ResultPanel } from "@/components/ResultPanel";
import { useCurrency, currencySymbol } from "@/lib/currency";
import { AdSlot } from "@/components/AdSlot";
import { getFormula } from "@/lib/formulas";


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
  slug,
}: {
  def: CalcDef;
  category: string;
  slug?: string;
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
    "w-full sm:max-w-[240px] rounded-md border border-hairline bg-white px-2.5 py-1.5 text-sm shadow-sm outline-none transition-colors focus:border-navy-light focus:ring-2 focus:ring-lime/30";
  const catLabel = CATEGORY_LABEL[category] ?? "Calculators";
  const catPath = CATEGORY_PATH[category] ?? "/";
  const formula = def.formula ?? (slug ? getFormula(category, slug) : undefined);

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-5 sm:py-6">
        <nav aria-label="Breadcrumb" className="sr-only">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><Link to={catPath}>{catLabel}</Link></li>
            <li>{def.title}</li>
          </ol>
        </nav>

        <section className="surface-card p-4 sm:p-5">
          <h2 className="mt-0 text-lg sm:text-xl">{def.title}</h2>

          <div className="space-y-3">
            {def.fields.map((f) => (
              <FieldRow key={f.name} label={f.label + (f.suffix ? ` (${f.suffix === "$" ? currency.symbol.trim() : f.suffix})` : "")}>
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
          <div className="mt-4 flex flex-wrap gap-2">
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
                <div className="grid gap-3 sm:grid-cols-2">
                  {results.map((r, i) => (
                    <div key={i} className="min-w-0">
                      <div className="text-xs uppercase text-muted-foreground">{r.label}</div>
                      <div className={`break-words ${r.emphasize ? "text-xl font-bold" : "text-base font-semibold"}`}>
                        {r.value}
                      </div>
                    </div>
                  ))}
                </div>
              </ResultPanel>
            </div>
          )}
        </section>

        <div className="mt-6">
          <AdSlot format="inline" />
        </div>

        <section className="mt-6 surface-card p-5 sm:p-6">
          <h1>{def.title}</h1>
          {def.description && (
            <p className="mt-2 text-[15px] leading-7 text-muted-foreground">{def.description}</p>
          )}
        </section>

        {formula && (
          <section className="mt-6 surface-card p-5 text-sm leading-relaxed sm:p-6">
            <h3 className="mt-0">Formula and how it works</h3>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-graybg p-4 font-mono text-xs leading-relaxed text-foreground">
{formula}
            </pre>
            <p className="mt-3 text-xs text-muted-foreground">
              Enter your own values above and the calculator applies exactly this formula.
            </p>
          </section>
        )}

        {def.notes && (
          <section className="mt-6 surface-card p-5 text-sm leading-relaxed sm:p-6">
            {def.notes}
          </section>
        )}

        <div className="mt-6">
          <AdSlot format="rectangle" />
        </div>
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
  return currencySymbol() + fmt(n, 2);
}
