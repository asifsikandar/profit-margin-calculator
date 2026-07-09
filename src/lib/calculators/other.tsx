import { useState } from "react";
import {
  CalcForm, FieldRow, TextInput, Select, ResultPanel, KVGrid,
  parseNum, fmt$, fmtPct, pmt,
} from "@/lib/calc-ui";

export function LoanCalculator() {
  const [a, setA] = useState("10000"), [r, setR] = useState("7"), [m, setM] = useState("60");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { pay: number; int: number; total: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const A = parseNum(a), R = parseNum(r), M = parseNum(m);
    if (A === null || R === null || M === null || A <= 0 || M <= 0) return setErr("Enter valid values.");
    const p = pmt(A, R, M); setRes({ pay: p, int: p * M - A, total: p * M });
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[{label:"Monthly",value:fmt$(res.pay)},{label:"Total Interest",value:fmt$(res.int)},{label:"Total",value:fmt$(res.total)}]}/></ResultPanel>
  )}>
    <FieldRow label="Amount ($)"><TextInput value={a} onChange={setA} /></FieldRow>
    <FieldRow label="Rate (%)"><TextInput value={r} onChange={setR} /></FieldRow>
    <FieldRow label="Months"><TextInput value={m} onChange={setM} /></FieldRow>
  </CalcForm>;
}

export function PaymentCalculator() {
  const [mode, setMode] = useState("payment"), [a, setA] = useState("10000"), [pay, setPay] = useState("200"), [r, setR] = useState("7"), [m, setM] = useState("60");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { out: number; int: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const R = parseNum(r), M = parseNum(m);
    if (R === null || M === null) return setErr("Enter rate and term.");
    if (mode === "payment") {
      const A = parseNum(a); if (A === null) return setErr("Enter loan amount.");
      const p = pmt(A, R, M); setRes({ out: p, int: p * M - A });
    } else {
      const P = parseNum(pay); if (P === null) return setErr("Enter payment.");
      const mr = R / 100 / 12; const factor = Math.pow(1 + mr, M);
      const maxLoan = mr === 0 ? P * M : P * (factor - 1) / (mr * factor);
      setRes({ out: maxLoan, int: P * M - maxLoan });
    }
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[{label:mode==="payment"?"Monthly Payment":"Max Loan",value:fmt$(res.out)},{label:"Total Interest",value:fmt$(res.int)}]}/></ResultPanel>
  )}>
    <FieldRow label="Solve For"><Select value={mode} onChange={setMode} options={[{value:"payment",label:"Payment"},{value:"loan",label:"Max Loan"}]}/></FieldRow>
    {mode === "payment" ? <FieldRow label="Loan ($)"><TextInput value={a} onChange={setA}/></FieldRow> : <FieldRow label="Monthly Pmt ($)"><TextInput value={pay} onChange={setPay}/></FieldRow>}
    <FieldRow label="Rate (%)"><TextInput value={r} onChange={setR}/></FieldRow>
    <FieldRow label="Months"><TextInput value={m} onChange={setM}/></FieldRow>
  </CalcForm>;
}

export function CurrencyCalculator() {
  const [amt, setAmt] = useState("100"), [rate, setRate] = useState("0.92"), [from, setFrom] = useState("USD"), [to, setTo] = useState("EUR");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<number | null>(null);
  function calc() {
    setErr(null); setRes(null);
    const A = parseNum(amt), R = parseNum(rate);
    if (A === null || R === null) return setErr("Enter valid values.");
    setRes(A * R);
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res !== null && (
    <ResultPanel title="Result"><KVGrid items={[{label:`${amt} ${from} =`,value:`${res.toFixed(2)} ${to}`}]}/></ResultPanel>
  )}>
    <FieldRow label="Amount"><TextInput value={amt} onChange={setAmt}/></FieldRow>
    <FieldRow label="From"><TextInput value={from} onChange={setFrom} inputMode="text"/></FieldRow>
    <FieldRow label="To"><TextInput value={to} onChange={setTo} inputMode="text"/></FieldRow>
    <FieldRow label="Exchange Rate (manual)"><TextInput value={rate} onChange={setRate}/></FieldRow>
  </CalcForm>;
}

export function InflationCalculator() {
  const [amt, setAmt] = useState("1000"), [start, setStart] = useState("2010"), [end, setEnd] = useState("2024"), [rate, setRate] = useState("3");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { adj: number; total: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const A = parseNum(amt), S = parseNum(start), E = parseNum(end), R = parseNum(rate);
    if (A === null || S === null || E === null || R === null) return setErr("Enter valid values.");
    const y = E - S; const adj = A * Math.pow(1 + R / 100, y);
    setRes({ adj, total: (adj / A - 1) * 100 });
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[{label:`Value in ${end}`,value:fmt$(res.adj)},{label:"Cumulative Inflation",value:fmtPct(res.total)}]}/></ResultPanel>
  )}>
    <FieldRow label="Amount ($)"><TextInput value={amt} onChange={setAmt}/></FieldRow>
    <FieldRow label="Start Year"><TextInput value={start} onChange={setStart}/></FieldRow>
    <FieldRow label="End Year"><TextInput value={end} onChange={setEnd}/></FieldRow>
    <FieldRow label="Avg Inflation (%)"><TextInput value={rate} onChange={setRate}/></FieldRow>
  </CalcForm>;
}

export function SalesTaxCalculator() {
  const [mode, setMode] = useState("before"), [price, setPrice] = useState("100"), [rate, setRate] = useState("7");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { before: number; after: number; tax: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const P = parseNum(price), R = parseNum(rate);
    if (P === null || R === null) return setErr("Enter valid values.");
    if (mode === "before") { const tax = P * R / 100; setRes({ before: P, tax, after: P + tax }); }
    else { const before = P / (1 + R / 100); setRes({ before, tax: P - before, after: P }); }
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[{label:"Before Tax",value:fmt$(res.before)},{label:"Tax",value:fmt$(res.tax)},{label:"After Tax",value:fmt$(res.after)}]}/></ResultPanel>
  )}>
    <FieldRow label="Given"><Select value={mode} onChange={setMode} options={[{value:"before",label:"Before Tax"},{value:"after",label:"After Tax"}]}/></FieldRow>
    <FieldRow label="Price ($)"><TextInput value={price} onChange={setPrice}/></FieldRow>
    <FieldRow label="Tax Rate (%)"><TextInput value={rate} onChange={setRate}/></FieldRow>
  </CalcForm>;
}

export function CreditCardCalculator() {
  const [bal, setBal] = useState("5000"), [apr, setApr] = useState("22"), [pay, setPay] = useState("200");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { months: number; int: number; total: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const B = parseNum(bal), A = parseNum(apr), P = parseNum(pay);
    if (B === null || A === null || P === null || B <= 0) return setErr("Enter valid values.");
    let b = B, months = 0, ti = 0; const mr = A / 100 / 12;
    while (b > 0.01 && months < 600) {
      const i = b * mr; if (P <= i) return setErr("Payment does not cover interest.");
      b += i - P; ti += i; months++;
    }
    setRes({ months, int: ti, total: B + ti });
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[{label:"Payoff Time",value:`${res.months} months`},{label:"Total Interest",value:fmt$(res.int)},{label:"Total Paid",value:fmt$(res.total)}]}/></ResultPanel>
  )}>
    <FieldRow label="Balance ($)"><TextInput value={bal} onChange={setBal}/></FieldRow>
    <FieldRow label="APR (%)"><TextInput value={apr} onChange={setApr}/></FieldRow>
    <FieldRow label="Monthly Payment ($)"><TextInput value={pay} onChange={setPay}/></FieldRow>
  </CalcForm>;
}

function DebtPayoffShared({ label }: { label: string }) {
  const [debts, setDebts] = useState<{ bal: string; apr: string; min: string }[]>([
    { bal: "5000", apr: "22", min: "150" }, { bal: "3000", apr: "18", min: "100" }
  ]);
  const [extra, setExtra] = useState("200"), [strat, setStrat] = useState("avalanche");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { months: number; interest: number; order: string[] }>(null);
  function calc() {
    setErr(null); setRes(null);
    const list = debts.map(d => ({ bal: parseNum(d.bal) ?? 0, apr: parseNum(d.apr) ?? 0, min: parseNum(d.min) ?? 0 }));
    if (list.some(d => d.bal <= 0)) return setErr("Enter debts.");
    const E = parseNum(extra) ?? 0;
    let months = 0, ti = 0; const order: string[] = [];
    while (list.some(d => d.bal > 0.01) && months < 600) {
      months++;
      list.forEach(d => { if (d.bal > 0) { const i = d.bal * d.apr / 100 / 12; d.bal += i - d.min; ti += i; } });
      const targets = list.map((d, i) => ({ d, i })).filter(x => x.d.bal > 0);
      targets.sort((a, b) => strat === "avalanche" ? b.d.apr - a.d.apr : a.d.bal - b.d.bal);
      let budget = E;
      for (const t of targets) {
        if (budget <= 0) break;
        const pay = Math.min(budget, t.d.bal);
        t.d.bal -= pay; budget -= pay;
      }
      list.forEach((d, i) => { if (d.bal <= 0.01 && !order.includes(`Debt ${i + 1}`)) order.push(`Debt ${i + 1}`); });
    }
    setRes({ months, interest: ti, order });
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[
      { label: "Payoff Time", value: `${res.months} months` },
      { label: "Total Interest", value: fmt$(res.interest) },
      { label: "Order Paid Off", value: res.order.join(" → ") },
    ]}/></ResultPanel>
  )}>
    <p className="text-sm text-muted-foreground">{label}</p>
    {debts.map((d, i) => (
      <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <TextInput value={d.bal} onChange={(v) => setDebts(debts.map((x, j) => j === i ? { ...x, bal: v } : x))} placeholder="Balance"/>
        <TextInput value={d.apr} onChange={(v) => setDebts(debts.map((x, j) => j === i ? { ...x, apr: v } : x))} placeholder="APR %"/>
        <TextInput value={d.min} onChange={(v) => setDebts(debts.map((x, j) => j === i ? { ...x, min: v } : x))} placeholder="Min Pmt"/>
      </div>
    ))}
    <button type="button" className="text-sm text-linkblue" onClick={() => setDebts([...debts, { bal: "", apr: "", min: "" }])}>+ Add debt</button>
    <FieldRow label="Extra Monthly ($)"><TextInput value={extra} onChange={setExtra}/></FieldRow>
    <FieldRow label="Strategy"><Select value={strat} onChange={setStrat} options={[{value:"avalanche",label:"Avalanche (highest APR)"},{value:"snowball",label:"Snowball (lowest balance)"}]}/></FieldRow>
  </CalcForm>;
}
export function CreditCardsPayoffCalculator() { return <DebtPayoffShared label="Enter each card's balance, APR, and minimum payment." />; }
export function DebtPayoffCalculator() { return <DebtPayoffShared label="Enter each debt's balance, APR, and minimum payment." />; }

export function DebtConsolidationCalculator() {
  const [debts, setDebts] = useState<{ bal: string; apr: string }[]>([{ bal: "5000", apr: "22" }, { bal: "3000", apr: "18" }]);
  const [rate, setRate] = useState("10"), [term, setTerm] = useState("5");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { newPay: number; newInt: number; oldInt: number; savings: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const R = parseNum(rate), T = parseNum(term);
    if (R === null || T === null) return setErr("Enter rate and term.");
    const total = debts.reduce((s, d) => s + (parseNum(d.bal) ?? 0), 0);
    const oldInt = debts.reduce((s, d) => {
      const b = parseNum(d.bal) ?? 0, a = parseNum(d.apr) ?? 0; return s + b * (a / 100) * T;
    }, 0);
    const pay = pmt(total, R, T * 12);
    const newInt = pay * T * 12 - total;
    setRes({ newPay: pay, newInt, oldInt, savings: oldInt - newInt });
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[
      { label: "New Monthly Payment", value: fmt$(res.newPay) },
      { label: "New Total Interest", value: fmt$(res.newInt) },
      { label: "Old Est. Interest", value: fmt$(res.oldInt) },
      { label: "Savings", value: fmt$(res.savings) },
    ]}/></ResultPanel>
  )}>
    {debts.map((d, i) => (
      <div key={i} className="grid grid-cols-2 gap-2">
        <TextInput value={d.bal} onChange={(v) => setDebts(debts.map((x, j) => j === i ? { ...x, bal: v } : x))} placeholder="Balance"/>
        <TextInput value={d.apr} onChange={(v) => setDebts(debts.map((x, j) => j === i ? { ...x, apr: v } : x))} placeholder="APR %"/>
      </div>
    ))}
    <button type="button" className="text-sm text-linkblue" onClick={() => setDebts([...debts, { bal: "", apr: "" }])}>+ Add debt</button>
    <FieldRow label="New Rate (%)"><TextInput value={rate} onChange={setRate}/></FieldRow>
    <FieldRow label="New Term (years)"><TextInput value={term} onChange={setTerm}/></FieldRow>
  </CalcForm>;
}

export function RepaymentCalculator() {
  const [bal, setBal] = useState("30000"), [rate, setRate] = useState("6"), [plan, setPlan] = useState("standard");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { pay: number; interest: number; term: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const B = parseNum(bal), R = parseNum(rate);
    if (B === null || R === null || B <= 0) return setErr("Enter valid values.");
    const term = plan === "extended" ? 20 : 10;
    if (plan === "graduated") {
      // simplified: use standard 10yr but display note
      const p = pmt(B, R, 120); setRes({ pay: p, interest: p * 120 - B, term: 10 });
    } else {
      const p = pmt(B, R, term * 12); setRes({ pay: p, interest: p * term * 12 - B, term });
    }
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[
      { label: "Monthly Payment", value: fmt$(res.pay) },
      { label: "Total Interest", value: fmt$(res.interest) },
      { label: "Term (years)", value: res.term },
    ]}/></ResultPanel>
  )}>
    <FieldRow label="Balance ($)"><TextInput value={bal} onChange={setBal}/></FieldRow>
    <FieldRow label="Rate (%)"><TextInput value={rate} onChange={setRate}/></FieldRow>
    <FieldRow label="Plan"><Select value={plan} onChange={setPlan} options={[{value:"standard",label:"Standard 10yr"},{value:"extended",label:"Extended 20yr"},{value:"graduated",label:"Graduated"}]}/></FieldRow>
  </CalcForm>;
}

export function StudentLoanCalculator() {
  const [bal, setBal] = useState("30000"), [rate, setRate] = useState("6"), [term, setTerm] = useState("10"), [def, setDef] = useState("0");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { pay: number; int: number; total: number; cap: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const B = parseNum(bal), R = parseNum(rate), T = parseNum(term), D = parseNum(def) ?? 0;
    if (B === null || R === null || T === null) return setErr("Enter values.");
    const accrued = B * (R / 100 / 12) * D;
    const cap = B + accrued;
    const p = pmt(cap, R, T * 12);
    setRes({ pay: p, int: p * T * 12 - cap, total: p * T * 12, cap });
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[
      { label: "Monthly Payment", value: fmt$(res.pay) },
      { label: "Total Interest", value: fmt$(res.int) },
      { label: "Total Repayment", value: fmt$(res.total) },
      { label: "Balance After Capitalization", value: fmt$(res.cap) },
    ]}/></ResultPanel>
  )}>
    <FieldRow label="Balance ($)"><TextInput value={bal} onChange={setBal}/></FieldRow>
    <FieldRow label="Rate (%)"><TextInput value={rate} onChange={setRate}/></FieldRow>
    <FieldRow label="Term (years)"><TextInput value={term} onChange={setTerm}/></FieldRow>
    <FieldRow label="Deferment (months)"><TextInput value={def} onChange={setDef}/></FieldRow>
  </CalcForm>;
}

export function CollegeCostCalculator() {
  const [cur, setCur] = useState("30000"), [years, setYears] = useState("10"), [infl, setInfl] = useState("5"), [yc, setYc] = useState("4");
  const [savings, setSavings] = useState("10000"), [monthly, setMonthly] = useState("300"), [ret, setRet] = useState("6");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { totalCost: number; projSav: number; diff: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const C = parseNum(cur), Y = parseNum(years), I = parseNum(infl) ?? 0, YC = parseNum(yc) ?? 4;
    const S = parseNum(savings) ?? 0, M = parseNum(monthly) ?? 0, R = parseNum(ret) ?? 0;
    if (C === null || Y === null) return setErr("Enter values.");
    let total = 0;
    for (let i = 0; i < YC; i++) total += C * Math.pow(1 + I / 100, Y + i);
    const r = R / 100 / 12, n = Y * 12, g = Math.pow(1 + r, n);
    const proj = S * g + (r === 0 ? M * n : M * ((g - 1) / r));
    setRes({ totalCost: total, projSav: proj, diff: proj - total });
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[
      { label: "Total Projected Cost", value: fmt$(res.totalCost) },
      { label: "Projected Savings", value: fmt$(res.projSav) },
      { label: res.diff >= 0 ? "Surplus" : "Shortfall", value: fmt$(Math.abs(res.diff)) },
    ]}/></ResultPanel>
  )}>
    <FieldRow label="Current Annual Cost ($)"><TextInput value={cur} onChange={setCur}/></FieldRow>
    <FieldRow label="Years Until Enrollment"><TextInput value={years} onChange={setYears}/></FieldRow>
    <FieldRow label="Cost Inflation (%)"><TextInput value={infl} onChange={setInfl}/></FieldRow>
    <FieldRow label="Years of College"><TextInput value={yc} onChange={setYc}/></FieldRow>
    <FieldRow label="Current Savings ($)"><TextInput value={savings} onChange={setSavings}/></FieldRow>
    <FieldRow label="Monthly Savings ($)"><TextInput value={monthly} onChange={setMonthly}/></FieldRow>
    <FieldRow label="Expected Return (%)"><TextInput value={ret} onChange={setRet}/></FieldRow>
  </CalcForm>;
}

export function VatCalculator() {
  const [mode, setMode] = useState("net"), [price, setPrice] = useState("100"), [rate, setRate] = useState("20");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { net: number; vat: number; gross: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const P = parseNum(price), R = parseNum(rate);
    if (P === null || R === null) return setErr("Enter values.");
    if (mode === "net") { const vat = P * R / 100; setRes({ net: P, vat, gross: P + vat }); }
    else { const net = P / (1 + R / 100); setRes({ net, vat: P - net, gross: P }); }
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[{label:"Net",value:fmt$(res.net)},{label:"VAT",value:fmt$(res.vat)},{label:"Gross",value:fmt$(res.gross)}]}/></ResultPanel>
  )}>
    <FieldRow label="Given"><Select value={mode} onChange={setMode} options={[{value:"net",label:"Net Price"},{value:"gross",label:"Gross Price"}]}/></FieldRow>
    <FieldRow label="Price ($)"><TextInput value={price} onChange={setPrice}/></FieldRow>
    <FieldRow label="VAT Rate (%)"><TextInput value={rate} onChange={setRate}/></FieldRow>
  </CalcForm>;
}

export function DepreciationCalculator() {
  const [cost, setCost] = useState("10000"), [salvage, setSalvage] = useState("1000"), [life, setLife] = useState("5"), [method, setMethod] = useState("straight");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { rows: { year: number; dep: number; book: number }[]; total: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const C = parseNum(cost), S = parseNum(salvage) ?? 0, L = parseNum(life);
    if (C === null || L === null || L <= 0) return setErr("Enter valid values.");
    const rows: { year: number; dep: number; book: number }[] = [];
    if (method === "straight") {
      const d = (C - S) / L; let book = C;
      for (let y = 1; y <= L; y++) { book -= d; rows.push({ year: y, dep: d, book: Math.max(book, S) }); }
    } else {
      let book = C; const rate = 2 / L;
      for (let y = 1; y <= L; y++) {
        let d = book * rate;
        if (book - d < S) d = book - S;
        book -= d; rows.push({ year: y, dep: d, book });
      }
    }
    setRes({ rows, total: rows.reduce((s, r) => s + r.dep, 0) });
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result">
      <div className="text-sm">Total Depreciation: <b>{fmt$(res.total)}</b></div>
      <table className="mt-3 w-full text-xs">
        <thead className="bg-graybg text-left"><tr><th className="p-2">Year</th><th className="p-2">Depreciation</th><th className="p-2">Book Value</th></tr></thead>
        <tbody>{res.rows.map(r => <tr key={r.year} className="border-t border-border"><td className="p-2">{r.year}</td><td className="p-2">{fmt$(r.dep)}</td><td className="p-2">{fmt$(r.book)}</td></tr>)}</tbody>
      </table>
    </ResultPanel>
  )}>
    <FieldRow label="Asset Cost ($)"><TextInput value={cost} onChange={setCost}/></FieldRow>
    <FieldRow label="Salvage Value ($)"><TextInput value={salvage} onChange={setSalvage}/></FieldRow>
    <FieldRow label="Useful Life (years)"><TextInput value={life} onChange={setLife}/></FieldRow>
    <FieldRow label="Method"><Select value={method} onChange={setMethod} options={[{value:"straight",label:"Straight-Line"},{value:"double",label:"Double-Declining"}]}/></FieldRow>
  </CalcForm>;
}

export { ProfitMarginCalculator as MarginCalculator } from "@/components/ProfitMarginCalculator";

export function DiscountCalculator() {
  const [price, setPrice] = useState("100"), [pct, setPct] = useState("20"), [amt, setAmt] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { disc: number; pct: number; final: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const P = parseNum(price); if (P === null || P <= 0) return setErr("Enter price.");
    const AA = parseNum(amt); const PP = parseNum(pct);
    let disc = 0, dpct = 0;
    if (AA !== null) { disc = AA; dpct = (AA / P) * 100; }
    else if (PP !== null) { dpct = PP; disc = P * PP / 100; }
    else return setErr("Enter % or amount.");
    setRes({ disc, pct: dpct, final: P - disc });
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[{label:"Discount",value:fmt$(res.disc)},{label:"Discount %",value:fmtPct(res.pct)},{label:"Final Price",value:fmt$(res.final)}]}/></ResultPanel>
  )}>
    <FieldRow label="Original Price ($)"><TextInput value={price} onChange={setPrice}/></FieldRow>
    <FieldRow label="Discount %"><TextInput value={pct} onChange={setPct}/></FieldRow>
    <FieldRow label="OR Discount Amount ($)"><TextInput value={amt} onChange={setAmt}/></FieldRow>
  </CalcForm>;
}

function SimpleLoan({ label }: { label: string }) {
  const [a, setA] = useState("50000"), [d, setD] = useState("5000"), [r, setR] = useState("7"), [t, setT] = useState("5");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { pay: number; int: number; total: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const A = parseNum(a), D = parseNum(d) ?? 0, R = parseNum(r), T = parseNum(t);
    if (A === null || R === null || T === null) return setErr("Enter values.");
    const loan = A - D; const n = T * 12; const p = pmt(loan, R, n);
    setRes({ pay: p, int: p * n - loan, total: p * n + D });
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[{label:"Monthly",value:fmt$(res.pay)},{label:"Total Interest",value:fmt$(res.int)},{label:"Total Cost",value:fmt$(res.total)}]}/></ResultPanel>
  )}>
    <p className="text-sm text-muted-foreground">{label}</p>
    <FieldRow label="Price ($)"><TextInput value={a} onChange={setA}/></FieldRow>
    <FieldRow label="Down Payment ($)"><TextInput value={d} onChange={setD}/></FieldRow>
    <FieldRow label="Rate (%)"><TextInput value={r} onChange={setR}/></FieldRow>
    <FieldRow label="Term (years)"><TextInput value={t} onChange={setT}/></FieldRow>
  </CalcForm>;
}
export function BusinessLoanCalculator() { return <SimpleLoan label="Business loan with amortization."/>; }
export function PersonalLoanCalculator() { return <SimpleLoan label="Personal loan."/>; }
export function BoatLoanCalculator() { return <SimpleLoan label="Boat loan."/>; }

export function LeaseCalculator() {
  const [val, setVal] = useState("30000"), [res_, setResV] = useState("50"), [term, setTerm] = useState("36"), [rate, setRate] = useState("6"), [down, setDown] = useState("0");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { pay: number; total: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const V = parseNum(val), Rp = parseNum(res_), T = parseNum(term), R = parseNum(rate), D = parseNum(down) ?? 0;
    if (V === null || Rp === null || T === null || R === null) return setErr("Enter values.");
    const cap = V - D; const residual = V * (Rp / 100); const mf = R / 2400;
    const dep = (cap - residual) / T; const fin = (cap + residual) * mf;
    setRes({ pay: dep + fin, total: (dep + fin) * T + D });
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[{label:"Monthly Lease",value:fmt$(res.pay)},{label:"Total Lease Cost",value:fmt$(res.total)}]}/></ResultPanel>
  )}>
    <FieldRow label="Asset Value ($)"><TextInput value={val} onChange={setVal}/></FieldRow>
    <FieldRow label="Residual (%)"><TextInput value={res_} onChange={setResV}/></FieldRow>
    <FieldRow label="Term (months)"><TextInput value={term} onChange={setTerm}/></FieldRow>
    <FieldRow label="Rate (%)"><TextInput value={rate} onChange={setRate}/></FieldRow>
    <FieldRow label="Down Payment ($)"><TextInput value={down} onChange={setDown}/></FieldRow>
  </CalcForm>;
}

export function BudgetCalculator() {
  const [income, setIncome] = useState("5000");
  const [rows, setRows] = useState<{ name: string; amt: string }[]>([
    { name: "Housing", amt: "1500" }, { name: "Transportation", amt: "400" },
    { name: "Food", amt: "600" }, { name: "Utilities", amt: "200" },
    { name: "Insurance", amt: "300" }, { name: "Entertainment", amt: "200" },
    { name: "Savings", amt: "500" }, { name: "Other", amt: "300" },
  ]);
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { total: number; remaining: number; breakdown: { name: string; amt: number; pct: number }[] }>(null);
  function calc() {
    setErr(null); setRes(null);
    const I = parseNum(income);
    if (I === null || I <= 0) return setErr("Enter income.");
    const total = rows.reduce((s, r) => s + (parseNum(r.amt) ?? 0), 0);
    const breakdown = rows.map(r => ({ name: r.name, amt: parseNum(r.amt) ?? 0, pct: I > 0 ? ((parseNum(r.amt) ?? 0) / I) * 100 : 0 }));
    setRes({ total, remaining: I - total, breakdown });
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result">
      <KVGrid items={[
        { label: "Total Expenses", value: fmt$(res.total) },
        { label: res.remaining >= 0 ? "Surplus" : "Deficit", value: fmt$(Math.abs(res.remaining)) },
      ]}/>
      <table className="mt-3 w-full text-xs">
        <thead className="bg-graybg text-left"><tr><th className="p-2">Category</th><th className="p-2">Amount</th><th className="p-2">% Income</th></tr></thead>
        <tbody>{res.breakdown.map(r => <tr key={r.name} className="border-t border-border"><td className="p-2">{r.name}</td><td className="p-2">{fmt$(r.amt)}</td><td className="p-2">{fmtPct(r.pct)}</td></tr>)}</tbody>
      </table>
    </ResultPanel>
  )}>
    <FieldRow label="Monthly Income ($)"><TextInput value={income} onChange={setIncome}/></FieldRow>
    {rows.map((r, i) => (
      <FieldRow key={i} label={r.name}>
        <div className="flex items-center gap-2">
          <TextInput value={r.amt} onChange={(v) => setRows(rows.map((x, j) => j === i ? { ...x, amt: v } : x))}/>
          <button type="button" className="text-xs text-linkblue" onClick={() => setRows(rows.filter((_, j) => j !== i))}>Remove</button>
        </div>
      </FieldRow>
    ))}
    <button type="button" className="text-sm text-linkblue" onClick={() => { const name = prompt("Category name?"); if (name) setRows([...rows, { name, amt: "" }]); }}>+ Add category</button>
  </CalcForm>;
}

export function CommissionCalculator() {
  const [sale, setSale] = useState("10000"), [rate, setRate] = useState("10"), [base, setBase] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { comm: number; total: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const S = parseNum(sale), R = parseNum(rate), B = parseNum(base) ?? 0;
    if (S === null || R === null) return setErr("Enter values.");
    const c = S * R / 100; setRes({ comm: c, total: c + B });
  }
  return <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
    <ResultPanel title="Result"><KVGrid items={[{label:"Commission",value:fmt$(res.comm)},{label:"Total Pay",value:fmt$(res.total)}]}/></ResultPanel>
  )}>
    <FieldRow label="Sale Amount ($)"><TextInput value={sale} onChange={setSale}/></FieldRow>
    <FieldRow label="Commission Rate (%)"><TextInput value={rate} onChange={setRate}/></FieldRow>
    <FieldRow label="Base Salary ($)"><TextInput value={base} onChange={setBase}/></FieldRow>
  </CalcForm>;
}
