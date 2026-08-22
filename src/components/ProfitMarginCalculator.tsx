import { useState } from "react";
import { CalcButton, FieldRow, ResultPanel } from "./ResultPanel";
import { DonutChart } from "./DonutChart";
import { useCurrency } from "@/lib/currency";

type Field = "cost" | "revenue" | "margin" | "profit";

interface Result {
  cost: number;
  revenue: number;
  profit: number;
  margin: number;
  markup: number;
}

function parseNum(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function ProfitMarginCalculator() {
  const [cost, setCost] = useState("");
  const [revenue, setRevenue] = useState("");
  const [margin, setMargin] = useState("");
  const [profit, setProfit] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cur = useCurrency();
  const sym = cur.symbol.trim();

  function calc() {
    setError(null);
    setResult(null);
    const c = parseNum(cost);
    const r = parseNum(revenue);
    const m = parseNum(margin);
    const p = parseNum(profit);
    const provided: Field[] = [];
    if (c !== null) provided.push("cost");
    if (r !== null) provided.push("revenue");
    if (m !== null) provided.push("margin");
    if (p !== null) provided.push("profit");

    if (provided.length < 2) {
      setError("Please fill in any two of the four fields.");
      return;
    }

    let C: number | null = c;
    let R: number | null = r;
    let P: number | null = p;
    const M: number | null = m;

    try {
      if (C !== null && R !== null) {
        P = R - C;
      } else if (C !== null && P !== null) {
        R = C + P;
      } else if (R !== null && P !== null) {
        C = R - P;
      } else if (C !== null && M !== null) {
        if (M >= 100) throw new Error("Margin must be less than 100%.");
        R = C / (1 - M / 100);
        P = R - C;
      } else if (R !== null && M !== null) {
        P = R * (M / 100);
        C = R - P;
      } else if (P !== null && M !== null) {
        if (M <= 0 || M >= 100) throw new Error("Margin must be between 0 and 100%.");
        R = P / (M / 100);
        C = R - P;
      }

      if (C === null || R === null || P === null) {
        throw new Error("Unable to compute from the provided values.");
      }
      if (R === 0) throw new Error("Revenue cannot be zero.");
      const finalMargin = (P / R) * 100;
      const finalMarkup = C === 0 ? 0 : (P / C) * 100;
      setResult({ cost: C, revenue: R, profit: P, margin: finalMargin, markup: finalMarkup });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid input.");
    }
  }

  function clear() {
    setCost("");
    setRevenue("");
    setMargin("");
    setProfit("");
    setResult(null);
    setError(null);
  }

  const inputCls =
    "w-full sm:max-w-xs rounded-lg border border-hairline bg-white px-3 py-2 text-sm shadow-sm outline-none transition-colors focus:border-navy-light focus:ring-2 focus:ring-lime/30";

  return (
    <section className="surface-card p-5 sm:p-6">
      <h2 className="mt-0">Profit Margin Calculator</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Fill in any two fields and click Calculate to compute the others.
      </p>
      <div className="space-y-3">
        <FieldRow label={`Cost (${sym})`}>
          <input inputMode="decimal" className={inputCls} value={cost} onChange={(e) => setCost(e.target.value)} />
        </FieldRow>
        <FieldRow label={`Revenue (${sym})`}>
          <input inputMode="decimal" className={inputCls} value={revenue} onChange={(e) => setRevenue(e.target.value)} />
        </FieldRow>
        <FieldRow label="Margin (%)">
          <input inputMode="decimal" className={inputCls} value={margin} onChange={(e) => setMargin(e.target.value)} />
        </FieldRow>
        <FieldRow label={`Profit (${sym})`}>
          <input inputMode="decimal" className={inputCls} value={profit} onChange={(e) => setProfit(e.target.value)} />
        </FieldRow>
      </div>
      <div className="mt-4 flex gap-2">
        <CalcButton onClick={calc}>Calculate</CalcButton>
        <CalcButton variant="secondary" onClick={clear}>Clear</CalcButton>
      </div>

      {error && (
        <p className="mt-3 rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-4 space-y-4">
          <ResultPanel title="Result">
            <div className="grid gap-2 sm:grid-cols-3">
              <div><div className="text-xs uppercase text-muted-foreground">Margin</div><div className="text-lg font-bold">{result.margin.toFixed(2)}%</div></div>
              <div><div className="text-xs uppercase text-muted-foreground">Profit</div><div className="text-lg font-bold">{sym}{result.profit.toFixed(2)}</div></div>
              <div><div className="text-xs uppercase text-muted-foreground">Markup</div><div className="text-lg font-bold">{result.markup.toFixed(2)}%</div></div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Cost {sym}{result.cost.toFixed(2)} · Revenue {sym}{result.revenue.toFixed(2)}
            </div>
            <div className="mt-4">
              <DonutChart
                costPct={result.revenue === 0 ? 0 : (result.cost / result.revenue) * 100}
                profitPct={result.margin}
              />
            </div>
          </ResultPanel>
        </div>
      )}

      <dl className="mt-6 space-y-2 text-sm">
        <div><dt className="font-semibold">Cost</dt><dd className="text-muted-foreground">Total money spent to make or acquire the product you sell.</dd></div>
        <div><dt className="font-semibold">Revenue</dt><dd className="text-muted-foreground">Total income received from selling the product before any costs are deducted.</dd></div>
        <div><dt className="font-semibold">Profit</dt><dd className="text-muted-foreground">What is left after subtracting cost from revenue.</dd></div>
        <div><dt className="font-semibold">Margin</dt><dd className="text-muted-foreground">Profit as a percentage of revenue.</dd></div>
        <div><dt className="font-semibold">Markup</dt><dd className="text-muted-foreground">Profit as a percentage of cost.</dd></div>
      </dl>
    </section>
  );
}
