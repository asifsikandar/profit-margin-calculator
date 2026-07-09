import { useState } from "react";
import {
  CalcForm, FieldRow, TextInput, ResultPanel, KVGrid,
  parseNum, fmt$, pmt,
} from "@/lib/calc-ui";

/* Auto Loan */
export function AutoLoanCalculator() {
  const [price, setPrice] = useState("30000");
  const [down, setDown] = useState("5000");
  const [trade, setTrade] = useState("0");
  const [tax, setTax] = useState("7");
  const [months, setMonths] = useState("60");
  const [rate, setRate] = useState("7");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { pay: number; loan: number; interest: number; total: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const p = parseNum(price), d = parseNum(down) ?? 0, tr = parseNum(trade) ?? 0, t = parseNum(tax) ?? 0, m = parseNum(months), r = parseNum(rate);
    if (p === null || m === null || r === null || p <= 0 || m <= 0) return setErr("Enter valid values.");
    const loan = p - d - tr + p * (t / 100);
    const pay = pmt(loan, r, m);
    setRes({ pay, loan, interest: pay * m - loan, total: pay * m + d + tr });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Monthly Payment", value: fmt$(res.pay) },
        { label: "Loan Amount", value: fmt$(res.loan) },
        { label: "Total Interest", value: fmt$(res.interest) },
        { label: "Total Cost", value: fmt$(res.total) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Vehicle Price ($)"><TextInput value={price} onChange={setPrice} /></FieldRow>
      <FieldRow label="Down Payment ($)"><TextInput value={down} onChange={setDown} /></FieldRow>
      <FieldRow label="Trade-in Value ($)"><TextInput value={trade} onChange={setTrade} /></FieldRow>
      <FieldRow label="Sales Tax (%)"><TextInput value={tax} onChange={setTax} /></FieldRow>
      <FieldRow label="Term (months)"><TextInput value={months} onChange={setMonths} /></FieldRow>
      <FieldRow label="Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
    </CalcForm>
  );
}

/* Cash Back or Low Interest */
export function CashBackOrLowInterestCalculator() {
  const [price, setPrice] = useState("30000");
  const [cash, setCash] = useState("2000");
  const [low, setLow] = useState("2.9");
  const [std, setStd] = useState("6.9");
  const [months, setMonths] = useState("60");
  const [down, setDown] = useState("3000");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { payA: number; totA: number; payB: number; totB: number; better: string; save: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const p = parseNum(price), cb = parseNum(cash) ?? 0, l = parseNum(low), s = parseNum(std), m = parseNum(months), d = parseNum(down) ?? 0;
    if (p === null || l === null || s === null || m === null) return setErr("Enter valid values.");
    const loanA = p - cb - d; const payA = pmt(loanA, s, m); const totA = payA * m;
    const loanB = p - d; const payB = pmt(loanB, l, m); const totB = payB * m;
    setRes({ payA, totA, payB, totB, better: totA < totB ? "Cash Back" : "Low Interest", save: Math.abs(totA - totB) });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Cash Back Monthly", value: fmt$(res.payA) },
        { label: "Cash Back Total", value: fmt$(res.totA) },
        { label: "Low Interest Monthly", value: fmt$(res.payB) },
        { label: "Low Interest Total", value: fmt$(res.totB) },
        { label: "Better Option", value: res.better },
        { label: "You Save", value: fmt$(res.save) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Vehicle Price ($)"><TextInput value={price} onChange={setPrice} /></FieldRow>
      <FieldRow label="Cash Back Offer ($)"><TextInput value={cash} onChange={setCash} /></FieldRow>
      <FieldRow label="Low Rate (%)"><TextInput value={low} onChange={setLow} /></FieldRow>
      <FieldRow label="Standard Rate (%)"><TextInput value={std} onChange={setStd} /></FieldRow>
      <FieldRow label="Term (months)"><TextInput value={months} onChange={setMonths} /></FieldRow>
      <FieldRow label="Down Payment ($)"><TextInput value={down} onChange={setDown} /></FieldRow>
    </CalcForm>
  );
}

/* Auto Lease */
export function AutoLeaseCalculator() {
  const [price, setPrice] = useState("35000");
  const [down, setDown] = useState("2000");
  const [residualPct, setResidualPct] = useState("60");
  const [rate, setRate] = useState("6");
  const [months, setMonths] = useState("36");
  const [tax, setTax] = useState("7");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { pay: number; total: number; dep: number; fin: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const p = parseNum(price), d = parseNum(down) ?? 0, rp = parseNum(residualPct), r = parseNum(rate), m = parseNum(months), t = parseNum(tax) ?? 0;
    if (p === null || rp === null || r === null || m === null) return setErr("Enter valid values.");
    const netCap = p - d;
    const residual = p * (rp / 100);
    const mf = r / 2400;
    const dep = (netCap - residual) / m;
    const fin = (netCap + residual) * mf;
    const pre = dep + fin;
    const pay = pre * (1 + t / 100);
    setRes({ pay, total: pay * m + d, dep, fin });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Monthly Payment", value: fmt$(res.pay) },
        { label: "Depreciation Fee", value: fmt$(res.dep) },
        { label: "Finance Fee", value: fmt$(res.fin) },
        { label: "Total Lease Cost", value: fmt$(res.total) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Vehicle Price ($)"><TextInput value={price} onChange={setPrice} /></FieldRow>
      <FieldRow label="Down Payment ($)"><TextInput value={down} onChange={setDown} /></FieldRow>
      <FieldRow label="Residual (%)"><TextInput value={residualPct} onChange={setResidualPct} /></FieldRow>
      <FieldRow label="Annual Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Term (months)"><TextInput value={months} onChange={setMonths} /></FieldRow>
      <FieldRow label="Sales Tax (%)"><TextInput value={tax} onChange={setTax} /></FieldRow>
    </CalcForm>
  );
}
