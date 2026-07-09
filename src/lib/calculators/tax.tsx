import { useState } from "react";
import {
  CalcForm, FieldRow, TextInput, Select, ResultPanel, KVGrid,
  parseNum, fmt$, fmtPct,
} from "@/lib/calc-ui";

// Simplified 2024 federal brackets
const BRACKETS = {
  single: [[0,11600,0.10],[11600,47150,0.12],[47150,100525,0.22],[100525,191950,0.24],[191950,243725,0.32],[243725,609350,0.35],[609350,Infinity,0.37]],
  mfj:    [[0,23200,0.10],[23200,94300,0.12],[94300,201050,0.22],[201050,383900,0.24],[383900,487450,0.32],[487450,731200,0.35],[731200,Infinity,0.37]],
  hoh:    [[0,16550,0.10],[16550,63100,0.12],[63100,100500,0.22],[100500,191950,0.24],[191950,243700,0.32],[243700,609350,0.35],[609350,Infinity,0.37]],
} as const;
const STD_DED = { single: 14600, mfj: 29200, hoh: 21900 } as const;

function calcTax(taxable: number, status: keyof typeof BRACKETS) {
  let tax = 0; let marginal = 0;
  for (const [lo, hi, rate] of BRACKETS[status]) {
    if (taxable > lo) { tax += (Math.min(taxable, hi) - lo) * rate; marginal = rate; } else break;
  }
  return { tax, marginal };
}

export function IncomeTaxCalculator() {
  const [gross, setGross] = useState("75000"), [status, setStatus] = useState<"single"|"mfj"|"hoh">("single"), [ded, setDed] = useState("0");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { tax: number; eff: number; marg: number; after: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const G = parseNum(gross), D = parseNum(ded) ?? 0;
    if (G === null || G < 0) return setErr("Enter gross income.");
    const taxable = Math.max(0, G - STD_DED[status] - D);
    const { tax, marginal } = calcTax(taxable, status);
    setRes({ tax, eff: G > 0 ? (tax / G) * 100 : 0, marg: marginal * 100, after: G - tax });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Federal Tax Owed", value: fmt$(res.tax) },
        { label: "Effective Rate", value: fmtPct(res.eff) },
        { label: "Marginal Bracket", value: fmtPct(res.marg) },
        { label: "After-Tax Income", value: fmt$(res.after) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Annual Gross ($)"><TextInput value={gross} onChange={setGross} /></FieldRow>
      <FieldRow label="Filing Status"><Select value={status} onChange={(v)=>setStatus(v as "single"|"mfj"|"hoh")} options={[{value:"single",label:"Single"},{value:"mfj",label:"Married Filing Jointly"},{value:"hoh",label:"Head of Household"}]} /></FieldRow>
      <FieldRow label="Additional Deductions ($)"><TextInput value={ded} onChange={setDed} /></FieldRow>
    </CalcForm>
  );
}

export function SalaryCalculator() {
  const [amt, setAmt] = useState("60000"), [type, setType] = useState("annual"), [hpw, setHpw] = useState("40"), [wpy, setWpy] = useState("52");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { hourly: number; daily: number; weekly: number; biweekly: number; monthly: number; annual: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const A = parseNum(amt), H = parseNum(hpw) ?? 40, W = parseNum(wpy) ?? 52;
    if (A === null || A < 0) return setErr("Enter pay amount.");
    let annual = 0;
    if (type === "hourly") annual = A * H * W;
    else if (type === "daily") annual = A * 5 * W;
    else if (type === "weekly") annual = A * W;
    else if (type === "biweekly") annual = A * (W / 2);
    else if (type === "monthly") annual = A * 12;
    else annual = A;
    setRes({ hourly: annual / (H * W), daily: annual / (5 * W), weekly: annual / W, biweekly: annual / (W / 2), monthly: annual / 12, annual });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Hourly", value: fmt$(res.hourly) },
        { label: "Daily", value: fmt$(res.daily) },
        { label: "Weekly", value: fmt$(res.weekly) },
        { label: "Bi-Weekly", value: fmt$(res.biweekly) },
        { label: "Monthly", value: fmt$(res.monthly) },
        { label: "Annual", value: fmt$(res.annual) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Pay Amount ($)"><TextInput value={amt} onChange={setAmt} /></FieldRow>
      <FieldRow label="Pay Type"><Select value={type} onChange={setType} options={[
        {value:"hourly",label:"Hourly"},{value:"daily",label:"Daily"},{value:"weekly",label:"Weekly"},
        {value:"biweekly",label:"Bi-weekly"},{value:"monthly",label:"Monthly"},{value:"annual",label:"Annual"},
      ]} /></FieldRow>
      <FieldRow label="Hours/Week"><TextInput value={hpw} onChange={setHpw} /></FieldRow>
      <FieldRow label="Weeks/Year"><TextInput value={wpy} onChange={setWpy} /></FieldRow>
    </CalcForm>
  );
}

export function MarriageTaxCalculator() {
  const [i1, setI1] = useState("70000"), [i2, setI2] = useState("50000"), [ded, setDed] = useState("0");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { single: number; mfj: number; diff: number; label: string }>(null);
  function calc() {
    setErr(null); setRes(null);
    const A = parseNum(i1), B = parseNum(i2), D = parseNum(ded) ?? 0;
    if (A === null || B === null) return setErr("Enter both incomes.");
    const s1 = calcTax(Math.max(0, A - STD_DED.single), "single").tax;
    const s2 = calcTax(Math.max(0, B - STD_DED.single), "single").tax;
    const singleTotal = s1 + s2;
    const mfjTotal = calcTax(Math.max(0, A + B - STD_DED.mfj - D), "mfj").tax;
    setRes({ single: singleTotal, mfj: mfjTotal, diff: Math.abs(singleTotal - mfjTotal), label: mfjTotal < singleTotal ? "Marriage Bonus" : "Marriage Penalty" });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Tax as Two Singles", value: fmt$(res.single) },
        { label: "Tax as MFJ", value: fmt$(res.mfj) },
        { label: res.label, value: fmt$(res.diff) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Spouse 1 Income ($)"><TextInput value={i1} onChange={setI1} /></FieldRow>
      <FieldRow label="Spouse 2 Income ($)"><TextInput value={i2} onChange={setI2} /></FieldRow>
      <FieldRow label="Deductions ($)"><TextInput value={ded} onChange={setDed} /></FieldRow>
    </CalcForm>
  );
}

export function EstateTaxCalculator() {
  const [val, setVal] = useState("15000000"), [ex, setEx] = useState("13610000"), [se, setSe] = useState("0");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { taxable: number; tax: number; free: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const V = parseNum(val), E = parseNum(ex) ?? 0, S = parseNum(se) ?? 0;
    if (V === null || V < 0) return setErr("Enter estate value.");
    const taxable = Math.max(0, V - E - S);
    // Progressive federal estate brackets simplified — top 40%. Use a simple 40% for taxable portion (approximation).
    const tax = taxable * 0.40;
    setRes({ taxable, tax, free: V - taxable });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Taxable Estate", value: fmt$(res.taxable) },
        { label: "Est. Federal Estate Tax", value: fmt$(res.tax) },
        { label: "Passes Tax-Free", value: fmt$(res.free) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Estate Value ($)"><TextInput value={val} onChange={setVal} /></FieldRow>
      <FieldRow label="Federal Exemption ($)"><TextInput value={ex} onChange={setEx} /></FieldRow>
      <FieldRow label="State Exemption ($)"><TextInput value={se} onChange={setSe} /></FieldRow>
    </CalcForm>
  );
}

export function TakeHomePaycheckCalculator() {
  const [gross, setGross] = useState("2500"), [freq, setFreq] = useState("26"), [status, setStatus] = useState<"single"|"mfj"|"hoh">("single");
  const [pre, setPre] = useState("100"), [state, setState] = useState("5");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { net: number; fed: number; fica: number; stTax: number; preTax: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const G = parseNum(gross), F = parseNum(freq) ?? 26, P = parseNum(pre) ?? 0, S = parseNum(state) ?? 0;
    if (G === null || G < 0) return setErr("Enter gross pay.");
    const taxable = G - P;
    const annualTaxable = taxable * F;
    const fedAnnual = calcTax(Math.max(0, annualTaxable - STD_DED[status]), status).tax;
    const fed = fedAnnual / F;
    const fica = taxable * 0.0765;
    const stTax = taxable * (S / 100);
    setRes({ net: taxable - fed - fica - stTax, fed, fica, stTax, preTax: P });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Take-Home Pay", value: fmt$(res.net) },
        { label: "Federal Tax", value: fmt$(res.fed) },
        { label: "FICA (7.65%)", value: fmt$(res.fica) },
        { label: "State Tax", value: fmt$(res.stTax) },
        { label: "Pre-Tax Deductions", value: fmt$(res.preTax) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Gross Per Period ($)"><TextInput value={gross} onChange={setGross} /></FieldRow>
      <FieldRow label="Pay Frequency"><Select value={freq} onChange={setFreq} options={[
        {value:"52",label:"Weekly"},{value:"26",label:"Bi-weekly"},{value:"24",label:"Semi-monthly"},{value:"12",label:"Monthly"},
      ]} /></FieldRow>
      <FieldRow label="Filing Status"><Select value={status} onChange={(v)=>setStatus(v as "single"|"mfj"|"hoh")} options={[{value:"single",label:"Single"},{value:"mfj",label:"MFJ"},{value:"hoh",label:"HoH"}]} /></FieldRow>
      <FieldRow label="Pre-Tax Deductions ($)"><TextInput value={pre} onChange={setPre} /></FieldRow>
      <FieldRow label="State Tax (%)"><TextInput value={state} onChange={setState} /></FieldRow>
    </CalcForm>
  );
}
