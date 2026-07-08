import { useState } from "react";
import { CalcButton, FieldRow, ResultPanel } from "./ResultPanel";

export function StockMarginCalculator() {
  const [price, setPrice] = useState("");
  const [shares, setShares] = useState("");
  const [req, setReq] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function calc() {
    setError(null);
    setResult(null);
    const p = Number(price);
    const s = Number(shares);
    const r = Number(req);
    if (!Number.isFinite(p) || !Number.isFinite(s) || !Number.isFinite(r) || price === "" || shares === "" || req === "") {
      setError("Please enter valid numbers in all three fields.");
      return;
    }
    if (p < 0 || s < 0 || r < 0) {
      setError("Values cannot be negative.");
      return;
    }
    setResult(p * s * (r / 100));
  }

  function clear() {
    setPrice(""); setShares(""); setReq(""); setResult(null); setError(null);
  }

  const cls = "w-full max-w-xs rounded border border-border bg-white px-2 py-1 text-sm outline-none focus:border-navy-light";

  return (
    <section className="rounded border border-border bg-white p-4">
      <h2 className="mt-0">Stock Trading Margin Calculator</h2>
      <div className="space-y-3">
        <FieldRow label="Stock price ($)"><input inputMode="decimal" className={cls} value={price} onChange={(e) => setPrice(e.target.value)} /></FieldRow>
        <FieldRow label="Number of shares"><input inputMode="numeric" className={cls} value={shares} onChange={(e) => setShares(e.target.value)} /></FieldRow>
        <FieldRow label="Margin requirement (%)"><input inputMode="decimal" className={cls} value={req} onChange={(e) => setReq(e.target.value)} /></FieldRow>
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
              ${result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </ResultPanel>
        </div>
      )}
      <dl className="mt-6 space-y-2 text-sm">
        <div><dt className="font-semibold">Stock price</dt><dd className="text-muted-foreground">Current market price of one share.</dd></div>
        <div><dt className="font-semibold">Number of shares</dt><dd className="text-muted-foreground">How many shares you want to buy on margin.</dd></div>
        <div><dt className="font-semibold">Margin requirement</dt><dd className="text-muted-foreground">Percentage of the total position that must be posted as collateral.</dd></div>
      </dl>
    </section>
  );
}
