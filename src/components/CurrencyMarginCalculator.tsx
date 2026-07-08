import { useState } from "react";
import { CalcButton, FieldRow, ResultPanel } from "./ResultPanel";

const RATIOS = ["1:1", "5:1", "10:1", "20:1", "25:1", "30:1", "40:1", "50:1"] as const;

export function CurrencyMarginCalculator() {
  const [rate, setRate] = useState("");
  const [ratio, setRatio] = useState<string>("10:1");
  const [units, setUnits] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function calc() {
    setError(null);
    setResult(null);
    const r = Number(rate);
    const u = Number(units);
    if (!Number.isFinite(r) || !Number.isFinite(u) || rate === "" || units === "") {
      setError("Please enter valid numbers for exchange rate and units.");
      return;
    }
    if (r <= 0 || u <= 0) {
      setError("Exchange rate and units must be greater than zero.");
      return;
    }
    const left = Number(ratio.split(":")[0]);
    setResult((r * u) / left);
  }

  function clear() {
    setRate(""); setUnits(""); setRatio("10:1"); setResult(null); setError(null);
  }

  const cls = "w-full max-w-xs rounded border border-border bg-white px-2 py-1 text-sm outline-none focus:border-navy-light";

  return (
    <section className="rounded border border-border bg-white p-4">
      <h2 className="mt-0">Currency Exchange Margin Calculator</h2>
      <div className="space-y-3">
        <FieldRow label="Exchange rate"><input inputMode="decimal" className={cls} value={rate} onChange={(e) => setRate(e.target.value)} /></FieldRow>
        <FieldRow label="Margin ratio">
          <select className={cls} value={ratio} onChange={(e) => setRatio(e.target.value)}>
            {RATIOS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </FieldRow>
        <FieldRow label="Units"><input inputMode="decimal" className={cls} value={units} onChange={(e) => setUnits(e.target.value)} /></FieldRow>
      </div>
      <div className="mt-4 flex gap-2">
        <CalcButton onClick={calc}>Calculate</CalcButton>
        <CalcButton variant="secondary" onClick={clear}>Clear</CalcButton>
      </div>
      {error && <p className="mt-3 rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      {result !== null && (
        <div className="mt-4">
          <ResultPanel title="Amount Required">
            <div className="text-xl font-bold">
              {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </div>
          </ResultPanel>
        </div>
      )}
      <dl className="mt-6 space-y-2 text-sm">
        <div><dt className="font-semibold">Exchange rate</dt><dd className="text-muted-foreground">Price of one unit of the currency you are buying, in your account currency.</dd></div>
        <div><dt className="font-semibold">Margin ratio</dt><dd className="text-muted-foreground">Leverage offered by your broker, expressed as ratio (e.g. 10:1 means 10x leverage).</dd></div>
        <div><dt className="font-semibold">Units</dt><dd className="text-muted-foreground">Number of units of the currency you wish to trade.</dd></div>
      </dl>
    </section>
  );
}
