import { useState } from "react";
import {
  CalcForm, FieldRow, TextInput, Select, ResultPanel, KVGrid,
  parseNum, fmt$, fmtPct, pmt,
} from "@/lib/calc-ui";

/* ===================== 1. Mortgage ===================== */
export function MortgageCalculator() {
  const [price, setPrice] = useState("300000");
  const [down, setDown] = useState("60000");
  const [term, setTerm] = useState("30");
  const [rate, setRate] = useState("6.5");
  const [tax, setTax] = useState("");
  const [ins, setIns] = useState("");
  const [hoa, setHoa] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { pi: number; total: number; loan: number; interest: number; payoff: string }>(null);
  function calc() {
    setErr(null); setRes(null);
    const p = parseNum(price), d = parseNum(down) ?? 0, r = parseNum(rate), t = parseNum(term);
    if (p === null || r === null || t === null || p <= 0 || r < 0 || r > 100 || t <= 0) return setErr("Enter valid price, rate (0-100), and term.");
    if (d < 0 || d >= p) return setErr("Down payment must be less than price.");
    const loan = p - d;
    const n = t * 12;
    const pi = pmt(loan, r, n);
    const total = pi + (parseNum(tax) ?? 0) / 12 + (parseNum(ins) ?? 0) / 12 + (parseNum(hoa) ?? 0);
    const interest = pi * n - loan;
    const payoff = new Date(Date.now() + n * 30.4375 * 24 * 3600 * 1000).toLocaleDateString();
    setRes({ pi, total, loan, interest, payoff });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setPrice(""); setDown(""); setRate(""); setTerm("30"); setTax(""); setIns(""); setHoa(""); setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result">
        <KVGrid items={[
          { label: "Monthly Payment", value: fmt$(res.total) },
          { label: "Principal & Interest", value: fmt$(res.pi) },
          { label: "Loan Amount", value: fmt$(res.loan) },
          { label: "Total Interest", value: fmt$(res.interest) },
          { label: "Payoff Date", value: res.payoff },
        ]} />
      </ResultPanel>
    )}>
      <FieldRow label="Home Price ($)"><TextInput value={price} onChange={setPrice} /></FieldRow>
      <FieldRow label="Down Payment ($)"><TextInput value={down} onChange={setDown} /></FieldRow>
      <FieldRow label="Loan Term (years)">
        <Select value={term} onChange={setTerm} options={[{value:"15",label:"15"},{value:"20",label:"20"},{value:"30",label:"30"}]} />
      </FieldRow>
      <FieldRow label="Interest Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Property Tax (annual $)"><TextInput value={tax} onChange={setTax} /></FieldRow>
      <FieldRow label="Home Insurance (annual $)"><TextInput value={ins} onChange={setIns} /></FieldRow>
      <FieldRow label="HOA (monthly $)"><TextInput value={hoa} onChange={setHoa} /></FieldRow>
    </CalcForm>
  );
}

/* ===================== 2. Amortization ===================== */
export function AmortizationCalculator() {
  const [amount, setAmount] = useState("240000");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<null | { month: number; payment: number; principal: number; interest: number; balance: number }[]>(null);
  const [pi, setPi] = useState(0);
  const [totalInt, setTotalInt] = useState(0);
  function calc() {
    setErr(null); setRows(null);
    const a = parseNum(amount), r = parseNum(rate), t = parseNum(term);
    if (a === null || r === null || t === null || a <= 0 || r < 0 || t <= 0) return setErr("Enter valid values.");
    const n = t * 12;
    const monthly = pmt(a, r, n);
    const mr = r / 100 / 12;
    let bal = a; const out: typeof rows extends null ? never : NonNullable<typeof rows> = [];
    let ti = 0;
    for (let m = 1; m <= n; m++) {
      const interest = bal * mr;
      const principal = monthly - interest;
      bal -= principal;
      ti += interest;
      out.push({ month: m, payment: monthly, principal, interest, balance: Math.max(0, bal) });
    }
    setPi(monthly); setTotalInt(ti); setRows(out);
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setAmount(""); setRate(""); setTerm(""); setRows(null); setErr(null); }} error={err} result={rows && (
      <ResultPanel title="Result">
        <KVGrid items={[
          { label: "Monthly Payment", value: fmt$(pi) },
          { label: "Total Interest", value: fmt$(totalInt) },
        ]} />
        <div className="mt-3 max-h-96 overflow-auto rounded border border-border">
          <table className="w-full text-xs">
            <thead className="bg-graybg text-left"><tr>
              <th className="p-2">#</th><th className="p-2">Payment</th><th className="p-2">Principal</th><th className="p-2">Interest</th><th className="p-2">Balance</th>
            </tr></thead>
            <tbody>
              {rows.slice(0, 60).map((r) => (
                <tr key={r.month} className="border-t border-border">
                  <td className="p-2">{r.month}</td><td className="p-2">{fmt$(r.payment)}</td>
                  <td className="p-2">{fmt$(r.principal)}</td><td className="p-2">{fmt$(r.interest)}</td>
                  <td className="p-2">{fmt$(r.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 60 && <div className="p-2 text-xs text-muted-foreground">Showing first 60 of {rows.length} months.</div>}
        </div>
      </ResultPanel>
    )}>
      <FieldRow label="Loan Amount ($)"><TextInput value={amount} onChange={setAmount} /></FieldRow>
      <FieldRow label="Interest Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Term (years)"><TextInput value={term} onChange={setTerm} /></FieldRow>
    </CalcForm>
  );
}

/* ===================== 3. Mortgage Payoff ===================== */
export function MortgagePayoffCalculator() {
  const [bal, setBal] = useState("200000");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("25");
  const [extra, setExtra] = useState("200");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { origMonths: number; newMonths: number; saved: number; timeSaved: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const b = parseNum(bal), r = parseNum(rate), t = parseNum(term), e = parseNum(extra) ?? 0;
    if (b === null || r === null || t === null || b <= 0 || r < 0 || t <= 0) return setErr("Enter valid values.");
    const n = t * 12; const monthly = pmt(b, r, n); const mr = r / 100 / 12;
    // original
    const origInt = monthly * n - b;
    // with extra
    let bb = b, months = 0, newInt = 0;
    while (bb > 0.01 && months < 1200) {
      const interest = bb * mr;
      const principal = monthly + e - interest;
      bb -= principal; newInt += interest; months++;
      if (principal <= 0) return setErr("Payment does not cover interest.");
    }
    setRes({ origMonths: n, newMonths: months, saved: origInt - newInt, timeSaved: n - months });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setBal(""); setRate(""); setTerm(""); setExtra(""); setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result">
        <KVGrid items={[
          { label: "New Payoff (months)", value: res.newMonths },
          { label: "Original Payoff (months)", value: res.origMonths },
          { label: "Time Saved", value: `${Math.floor(res.timeSaved / 12)}y ${res.timeSaved % 12}m` },
          { label: "Interest Saved", value: fmt$(res.saved) },
        ]} />
      </ResultPanel>
    )}>
      <FieldRow label="Current Balance ($)"><TextInput value={bal} onChange={setBal} /></FieldRow>
      <FieldRow label="Interest Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Remaining Term (years)"><TextInput value={term} onChange={setTerm} /></FieldRow>
      <FieldRow label="Extra Monthly ($)"><TextInput value={extra} onChange={setExtra} /></FieldRow>
    </CalcForm>
  );
}

/* ===================== 4. House Affordability ===================== */
export function HouseAffordabilityCalculator() {
  const [income, setIncome] = useState("80000");
  const [debts, setDebts] = useState("400");
  const [down, setDown] = useState("30000");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [taxRate, setTaxRate] = useState("1.2");
  const [ins, setIns] = useState("1200");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { maxHome: number; maxPay: number; maxLoan: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const inc = parseNum(income), d = parseNum(debts) ?? 0, dp = parseNum(down) ?? 0;
    const r = parseNum(rate), t = parseNum(term), tr = parseNum(taxRate) ?? 0, i = parseNum(ins) ?? 0;
    if (inc === null || r === null || t === null || inc <= 0) return setErr("Enter valid values.");
    const mIncome = inc / 12;
    const frontEnd = mIncome * 0.28;
    const backEnd = mIncome * 0.36 - d;
    const maxHousing = Math.max(0, Math.min(frontEnd, backEnd));
    // subtract monthly tax + insurance to get max P&I
    // But max home depends on tax which depends on price -> approximate iteratively
    let price = 200000;
    for (let k = 0; k < 40; k++) {
      const mTax = (price * tr / 100) / 12;
      const mIns = i / 12;
      const availPI = maxHousing - mTax - mIns;
      if (availPI <= 0) { price = 0; break; }
      const n = t * 12;
      const mr = r / 100 / 12;
      const factor = Math.pow(1 + mr, n);
      const maxLoan = mr === 0 ? availPI * n : availPI * (factor - 1) / (mr * factor);
      price = maxLoan + dp;
    }
    const finalLoan = price - dp;
    setRes({ maxHome: price, maxPay: maxHousing, maxLoan: finalLoan });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Max Home Price", value: fmt$(res.maxHome) },
        { label: "Max Loan Amount", value: fmt$(res.maxLoan) },
        { label: "Max Monthly Housing", value: fmt$(res.maxPay) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Annual Income ($)"><TextInput value={income} onChange={setIncome} /></FieldRow>
      <FieldRow label="Monthly Debts ($)"><TextInput value={debts} onChange={setDebts} /></FieldRow>
      <FieldRow label="Down Payment ($)"><TextInput value={down} onChange={setDown} /></FieldRow>
      <FieldRow label="Interest Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Term (years)"><TextInput value={term} onChange={setTerm} /></FieldRow>
      <FieldRow label="Property Tax Rate (%)"><TextInput value={taxRate} onChange={setTaxRate} /></FieldRow>
      <FieldRow label="Insurance (annual $)"><TextInput value={ins} onChange={setIns} /></FieldRow>
    </CalcForm>
  );
}

/* ===================== 5. Rent ===================== */
export function RentCalculator() {
  const [income, setIncome] = useState("60000");
  const [debts, setDebts] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { rent30: number; rent36: number; annual: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const inc = parseNum(income); const d = parseNum(debts) ?? 0;
    if (inc === null || inc <= 0) return setErr("Enter annual income.");
    const m = inc / 12;
    const rent30 = m * 0.30;
    const rent36 = m * 0.36 - d;
    setRes({ rent30, rent36, annual: rent30 * 12 });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "30% Rule (Monthly)", value: fmt$(res.rent30) },
        { label: "36% Rule minus Debts", value: fmt$(res.rent36) },
        { label: "Recommended Annual Spend", value: fmt$(res.annual) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Annual Gross Income ($)"><TextInput value={income} onChange={setIncome} /></FieldRow>
      <FieldRow label="Monthly Debts ($)"><TextInput value={debts} onChange={setDebts} /></FieldRow>
    </CalcForm>
  );
}

/* ===================== 6. DTI ===================== */
export function DebtToIncomeRatioCalculator() {
  const [income, setIncome] = useState("6000");
  const [debts, setDebts] = useState<string[]>(["1500", "300", "150", "100"]);
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { dti: number; total: number; label: string }>(null);
  function calc() {
    setErr(null); setRes(null);
    const inc = parseNum(income);
    if (inc === null || inc <= 0) return setErr("Enter gross monthly income.");
    const total = debts.reduce((s, v) => s + (parseNum(v) ?? 0), 0);
    const dti = (total / inc) * 100;
    const label = dti < 20 ? "Excellent" : dti < 36 ? "Good" : dti <= 43 ? "Risky" : "High risk";
    setRes({ dti, total, label });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "DTI Ratio", value: fmtPct(res.dti) },
        { label: "Total Monthly Debt", value: fmt$(res.total) },
        { label: "Rating", value: res.label },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Gross Monthly Income ($)"><TextInput value={income} onChange={setIncome} /></FieldRow>
      {debts.map((d, i) => (
        <FieldRow key={i} label={`Debt Payment #${i + 1} ($)`}>
          <div className="flex items-center gap-2">
            <TextInput value={d} onChange={(v) => setDebts(debts.map((x, j) => j === i ? v : x))} />
            <button type="button" className="text-xs text-linkblue" onClick={() => setDebts(debts.filter((_, j) => j !== i))}>Remove</button>
          </div>
        </FieldRow>
      ))}
      <button type="button" className="text-sm text-linkblue" onClick={() => setDebts([...debts, ""])}>+ Add debt row</button>
    </CalcForm>
  );
}

/* ===================== 7. Real Estate ===================== */
export function RealEstateCalculator() {
  const [price, setPrice] = useState("300000");
  const [down, setDown] = useState("60000");
  const [closing, setClosing] = useState("6000");
  const [rentInc, setRentInc] = useState("30000");
  const [opEx, setOpEx] = useState("8000");
  const [appr, setAppr] = useState("3");
  const [years, setYears] = useState("10");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { cap: number; cash: number; fv: number; roi: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const p = parseNum(price), d = parseNum(down) ?? 0, c = parseNum(closing) ?? 0;
    const ri = parseNum(rentInc) ?? 0, oe = parseNum(opEx) ?? 0, ap = parseNum(appr) ?? 0, y = parseNum(years);
    if (p === null || y === null || p <= 0 || y <= 0) return setErr("Enter price and holding period.");
    const cash = d + c;
    const noi = ri - oe;
    const cap = (noi / p) * 100;
    const fv = p * Math.pow(1 + ap / 100, y);
    const roi = cash > 0 ? ((fv - p + noi * y) / cash) * 100 : 0;
    setRes({ cap, cash, fv, roi });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Cap Rate", value: fmtPct(res.cap) },
        { label: "Total Cash Invested", value: fmt$(res.cash) },
        { label: "Projected Value", value: fmt$(res.fv) },
        { label: "Total ROI", value: fmtPct(res.roi) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Purchase Price ($)"><TextInput value={price} onChange={setPrice} /></FieldRow>
      <FieldRow label="Down Payment ($)"><TextInput value={down} onChange={setDown} /></FieldRow>
      <FieldRow label="Closing Costs ($)"><TextInput value={closing} onChange={setClosing} /></FieldRow>
      <FieldRow label="Annual Rental Income ($)"><TextInput value={rentInc} onChange={setRentInc} /></FieldRow>
      <FieldRow label="Annual Operating Expenses ($)"><TextInput value={opEx} onChange={setOpEx} /></FieldRow>
      <FieldRow label="Appreciation Rate (%)"><TextInput value={appr} onChange={setAppr} /></FieldRow>
      <FieldRow label="Holding Period (years)"><TextInput value={years} onChange={setYears} /></FieldRow>
    </CalcForm>
  );
}

/* ===================== 8. Refinance ===================== */
export function RefinanceCalculator() {
  const [bal, setBal] = useState("250000");
  const [curPay, setCurPay] = useState("1800");
  const [curRate, setCurRate] = useState("7");
  const [newTerm, setNewTerm] = useState("20");
  const [newRate, setNewRate] = useState("6");
  const [points, setPoints] = useState("2");
  const [fees, setFees] = useState("1500");
  const [cashOut, setCashOut] = useState("0");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { newPay: number; savings: number; upfront: number; breakeven: number; newInt: number; }>(null);
  function calc() {
    setErr(null); setRes(null);
    const b = parseNum(bal), cp = parseNum(curPay), nt = parseNum(newTerm), nr = parseNum(newRate);
    const pts = parseNum(points) ?? 0, f = parseNum(fees) ?? 0, co = parseNum(cashOut) ?? 0;
    if (b === null || cp === null || nt === null || nr === null || b <= 0 || nt <= 0) return setErr("Enter valid values.");
    const newLoan = b + co;
    const ptsCost = newLoan * (pts / 100);
    const upfront = ptsCost + f;
    const n = nt * 12;
    const newPay = pmt(newLoan, nr, n);
    const savings = cp - newPay;
    const breakeven = savings > 0 ? upfront / savings : NaN;
    const newInt = newPay * n - newLoan;
    setRes({ newPay, savings, upfront, breakeven, newInt });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "New Monthly Payment", value: fmt$(res.newPay) },
        { label: "Monthly Savings", value: fmt$(res.savings) },
        { label: "Upfront Cost", value: fmt$(res.upfront) },
        { label: "Break-even (months)", value: Number.isFinite(res.breakeven) ? res.breakeven.toFixed(1) : "—" },
        { label: "Total Interest (new loan)", value: fmt$(res.newInt) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Remaining Balance ($)"><TextInput value={bal} onChange={setBal} /></FieldRow>
      <FieldRow label="Current Monthly Payment ($)"><TextInput value={curPay} onChange={setCurPay} /></FieldRow>
      <FieldRow label="Current Rate (%)"><TextInput value={curRate} onChange={setCurRate} /></FieldRow>
      <FieldRow label="New Term (years)"><TextInput value={newTerm} onChange={setNewTerm} /></FieldRow>
      <FieldRow label="New Rate (%)"><TextInput value={newRate} onChange={setNewRate} /></FieldRow>
      <FieldRow label="Points"><TextInput value={points} onChange={setPoints} /></FieldRow>
      <FieldRow label="Costs & Fees ($)"><TextInput value={fees} onChange={setFees} /></FieldRow>
      <FieldRow label="Cash Out ($)"><TextInput value={cashOut} onChange={setCashOut} /></FieldRow>
    </CalcForm>
  );
}

/* ===================== 9. Rental Property ===================== */
export function RentalPropertyCalculator() {
  const [price, setPrice] = useState("300000");
  const [down, setDown] = useState("60000");
  const [rent, setRent] = useState("2500");
  const [exp, setExp] = useState("700");
  const [mort, setMort] = useState("1516");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { mcf: number; acf: number; cap: number; coc: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const p = parseNum(price), d = parseNum(down), r = parseNum(rent), e = parseNum(exp) ?? 0, m = parseNum(mort) ?? 0;
    if (p === null || d === null || r === null || p <= 0) return setErr("Enter valid values.");
    const mcf = r - e - m;
    const acf = mcf * 12;
    const cap = ((r - e) * 12 / p) * 100;
    const coc = d > 0 ? (acf / d) * 100 : 0;
    setRes({ mcf, acf, cap, coc });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Monthly Cash Flow", value: fmt$(res.mcf) },
        { label: "Annual Cash Flow", value: fmt$(res.acf) },
        { label: "Cap Rate", value: fmtPct(res.cap) },
        { label: "Cash-on-Cash Return", value: fmtPct(res.coc) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Purchase Price ($)"><TextInput value={price} onChange={setPrice} /></FieldRow>
      <FieldRow label="Down Payment ($)"><TextInput value={down} onChange={setDown} /></FieldRow>
      <FieldRow label="Monthly Rent ($)"><TextInput value={rent} onChange={setRent} /></FieldRow>
      <FieldRow label="Monthly Expenses ($)"><TextInput value={exp} onChange={setExp} /></FieldRow>
      <FieldRow label="Monthly Mortgage ($)"><TextInput value={mort} onChange={setMort} /></FieldRow>
    </CalcForm>
  );
}

/* ===================== 10. APR ===================== */
export function AprCalculator() {
  const [amount, setAmount] = useState("200000");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [fees, setFees] = useState("4000");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { apr: number; pay: number; nominal: number; fees: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const a = parseNum(amount), r = parseNum(rate), t = parseNum(term), f = parseNum(fees) ?? 0;
    if (a === null || r === null || t === null || a <= 0) return setErr("Enter valid values.");
    const n = t * 12;
    const payment = pmt(a, r, n);
    const netProceeds = a - f;
    // Solve for rate: payment * ((1+i)^n - 1) / (i(1+i)^n) = netProceeds  (bisection)
    let lo = 0, hi = 1;
    for (let k = 0; k < 80; k++) {
      const i = (lo + hi) / 2;
      const factor = Math.pow(1 + i, n);
      const pv = i === 0 ? payment * n : payment * (factor - 1) / (i * factor);
      if (pv > netProceeds) lo = i; else hi = i;
    }
    const apr = ((lo + hi) / 2) * 12 * 100;
    setRes({ apr, pay: payment, nominal: r, fees: f });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Nominal Rate", value: fmtPct(res.nominal) },
        { label: "Effective APR", value: fmtPct(res.apr) },
        { label: "Monthly Payment", value: fmt$(res.pay) },
        { label: "Fees Included", value: fmt$(res.fees) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Loan Amount ($)"><TextInput value={amount} onChange={setAmount} /></FieldRow>
      <FieldRow label="Nominal Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Term (years)"><TextInput value={term} onChange={setTerm} /></FieldRow>
      <FieldRow label="Fees / Points / Closing ($)"><TextInput value={fees} onChange={setFees} /></FieldRow>
    </CalcForm>
  );
}

/* ===================== 11. FHA Loan ===================== */
export function FhaLoanCalculator() {
  const [price, setPrice] = useState("300000");
  const [downPct, setDownPct] = useState("3.5");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { pi: number; mip: number; totalPay: number; upfrontMip: number; totalLoan: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const p = parseNum(price), dp = parseNum(downPct), r = parseNum(rate), t = parseNum(term);
    if (p === null || dp === null || r === null || t === null || dp < 3.5) return setErr("Down payment must be at least 3.5%.");
    const loan = p * (1 - dp / 100);
    const upfrontMip = loan * 0.0175;
    const totalLoan = loan + upfrontMip;
    const annualMip = totalLoan * 0.0055;
    const n = t * 12;
    const pi = pmt(totalLoan, r, n);
    const mip = annualMip / 12;
    setRes({ pi, mip, totalPay: pi + mip, upfrontMip, totalLoan });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Total Monthly Payment", value: fmt$(res.totalPay) },
        { label: "Principal & Interest", value: fmt$(res.pi) },
        { label: "Monthly MIP", value: fmt$(res.mip) },
        { label: "Upfront MIP", value: fmt$(res.upfrontMip) },
        { label: "Total Loan Amount", value: fmt$(res.totalLoan) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Home Price ($)"><TextInput value={price} onChange={setPrice} /></FieldRow>
      <FieldRow label="Down Payment (%)"><TextInput value={downPct} onChange={setDownPct} /></FieldRow>
      <FieldRow label="Interest Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Term (years)"><TextInput value={term} onChange={setTerm} /></FieldRow>
    </CalcForm>
  );
}

/* ===================== 12. VA Mortgage ===================== */
export function VaMortgageCalculator() {
  const [price, setPrice] = useState("350000");
  const [down, setDown] = useState("0");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [funding, setFunding] = useState("2.15");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { pi: number; fee: number; totalLoan: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const p = parseNum(price), d = parseNum(down) ?? 0, r = parseNum(rate), t = parseNum(term), f = parseNum(funding) ?? 0;
    if (p === null || r === null || t === null || p <= 0) return setErr("Enter valid values.");
    const base = p - d;
    const fee = base * (f / 100);
    const totalLoan = base + fee;
    const pi = pmt(totalLoan, r, t * 12);
    setRes({ pi, fee, totalLoan });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result">
        <KVGrid items={[
          { label: "Monthly Payment", value: fmt$(res.pi) },
          { label: "Funding Fee", value: fmt$(res.fee) },
          { label: "Total Loan Amount", value: fmt$(res.totalLoan) },
        ]} />
        <div className="mt-3 text-xs text-lime">✓ No PMI required for VA loans.</div>
      </ResultPanel>
    )}>
      <FieldRow label="Home Price ($)"><TextInput value={price} onChange={setPrice} /></FieldRow>
      <FieldRow label="Down Payment ($)"><TextInput value={down} onChange={setDown} /></FieldRow>
      <FieldRow label="Interest Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Term (years)"><TextInput value={term} onChange={setTerm} /></FieldRow>
      <FieldRow label="VA Funding Fee (%)"><TextInput value={funding} onChange={setFunding} /></FieldRow>
    </CalcForm>
  );
}

/* ===================== 13. Home Equity Loan ===================== */
export function HomeEquityLoanCalculator() {
  const [value, setValue] = useState("500000");
  const [bal, setBal] = useState("250000");
  const [want, setWant] = useState("50000");
  const [rate, setRate] = useState("8");
  const [term, setTerm] = useState("10");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { equity: number; maxLoan: number; pay: number; interest: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const v = parseNum(value), b = parseNum(bal) ?? 0, w = parseNum(want), r = parseNum(rate), t = parseNum(term);
    if (v === null || w === null || r === null || t === null) return setErr("Enter valid values.");
    const equity = v - b;
    const maxLoan = Math.max(0, v * 0.85 - b);
    const n = t * 12;
    const pay = pmt(w, r, n);
    setRes({ equity, maxLoan, pay, interest: pay * n - w });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Available Equity", value: fmt$(res.equity) },
        { label: "Max Loan (85% CLTV)", value: fmt$(res.maxLoan) },
        { label: "Monthly Payment", value: fmt$(res.pay) },
        { label: "Total Interest", value: fmt$(res.interest) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Home Value ($)"><TextInput value={value} onChange={setValue} /></FieldRow>
      <FieldRow label="Existing Mortgage ($)"><TextInput value={bal} onChange={setBal} /></FieldRow>
      <FieldRow label="Desired Loan ($)"><TextInput value={want} onChange={setWant} /></FieldRow>
      <FieldRow label="Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Term (years)"><TextInput value={term} onChange={setTerm} /></FieldRow>
    </CalcForm>
  );
}

/* ===================== 14. HELOC ===================== */
export function HelocCalculator() {
  const [value, setValue] = useState("500000");
  const [bal, setBal] = useState("250000");
  const [draw, setDraw] = useState("10");
  const [repay, setRepay] = useState("20");
  const [rate, setRate] = useState("8");
  const [amount, setAmount] = useState("50000");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { line: number; ioPay: number; repayPay: number; totalInt: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const v = parseNum(value), b = parseNum(bal) ?? 0, d = parseNum(draw), rp = parseNum(repay), r = parseNum(rate), a = parseNum(amount);
    if (v === null || d === null || rp === null || r === null || a === null) return setErr("Enter valid values.");
    const line = Math.max(0, v * 0.85 - b);
    const ioPay = a * (r / 100 / 12);
    const repayPay = pmt(a, r, rp * 12);
    const totalInt = ioPay * d * 12 + (repayPay * rp * 12 - a);
    setRes({ line, ioPay, repayPay, totalInt });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Available Credit Line", value: fmt$(res.line) },
        { label: "Draw Period (Interest-Only)", value: fmt$(res.ioPay) + "/mo" },
        { label: "Repayment Period", value: fmt$(res.repayPay) + "/mo" },
        { label: "Total Interest Both Phases", value: fmt$(res.totalInt) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Home Value ($)"><TextInput value={value} onChange={setValue} /></FieldRow>
      <FieldRow label="Existing Mortgage ($)"><TextInput value={bal} onChange={setBal} /></FieldRow>
      <FieldRow label="Draw Period (yrs)"><TextInput value={draw} onChange={setDraw} /></FieldRow>
      <FieldRow label="Repayment Period (yrs)"><TextInput value={repay} onChange={setRepay} /></FieldRow>
      <FieldRow label="Interest Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Amount to Draw ($)"><TextInput value={amount} onChange={setAmount} /></FieldRow>
    </CalcForm>
  );
}

/* ===================== 15. Down Payment ===================== */
export function DownPaymentCalculator() {
  const [price, setPrice] = useState("300000");
  const [pct, setPct] = useState("20");
  const [amt, setAmt] = useState("");
  const [savings, setSavings] = useState("");
  const [monthly, setMonthly] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { dp: number; dpPct: number; loan: number; months?: number; pmiNote: boolean }>(null);
  function calc() {
    setErr(null); setRes(null);
    const p = parseNum(price);
    if (p === null || p <= 0) return setErr("Enter home price.");
    const pn = parseNum(pct), an = parseNum(amt);
    let dp = 0, dpPct = 0;
    if (an !== null) { dp = an; dpPct = (dp / p) * 100; }
    else if (pn !== null) { dpPct = pn; dp = p * pn / 100; }
    else return setErr("Enter a % or amount.");
    const loan = p - dp;
    const s = parseNum(savings) ?? 0, m = parseNum(monthly);
    let months: number | undefined;
    if (m !== null && m > 0 && dp > s) months = Math.ceil((dp - s) / m);
    setRes({ dp, dpPct, loan, months, pmiNote: dpPct < 20 });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result">
        <KVGrid items={[
          { label: "Down Payment", value: fmt$(res.dp) },
          { label: "Down Payment %", value: fmtPct(res.dpPct) },
          { label: "Loan Amount", value: fmt$(res.loan) },
          ...(res.months !== undefined ? [{ label: "Months to Save", value: `${res.months} (${(res.months/12).toFixed(1)} yrs)` }] : []),
        ]} />
        {res.pmiNote && <div className="mt-3 text-xs text-destructive">⚠ PMI likely required (down payment &lt; 20%).</div>}
      </ResultPanel>
    )}>
      <FieldRow label="Home Price ($)"><TextInput value={price} onChange={setPrice} /></FieldRow>
      <FieldRow label="Down Payment %"><TextInput value={pct} onChange={setPct} /></FieldRow>
      <FieldRow label="OR Down Payment ($)"><TextInput value={amt} onChange={setAmt} /></FieldRow>
      <FieldRow label="Current Savings ($)"><TextInput value={savings} onChange={setSavings} /></FieldRow>
      <FieldRow label="Monthly Savings ($)"><TextInput value={monthly} onChange={setMonthly} /></FieldRow>
    </CalcForm>
  );
}

/* ===================== 16. Rent vs Buy ===================== */
export function RentVsBuyCalculator() {
  const [price, setPrice] = useState("300000");
  const [down, setDown] = useState("60000");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [rent, setRent] = useState("2000");
  const [appr, setAppr] = useState("3");
  const [rentInc, setRentInc] = useState("3");
  const [horizon, setHorizon] = useState("7");
  const [expensesPct, setExpensesPct] = useState("2");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { buyCost: number; rentCost: number; better: string; diff: number; table: { year: number; buy: number; rent: number }[] }>(null);
  function calc() {
    setErr(null); setRes(null);
    const p = parseNum(price), d = parseNum(down), r = parseNum(rate), t = parseNum(term);
    const rt = parseNum(rent), ap = parseNum(appr) ?? 0, ri = parseNum(rentInc) ?? 0, h = parseNum(horizon), ex = parseNum(expensesPct) ?? 0;
    if (p === null || d === null || r === null || t === null || rt === null || h === null) return setErr("Enter valid values.");
    const loan = p - d;
    const n = t * 12;
    const mortMonthly = pmt(loan, r, n);
    let bal = loan, buyCosts = d, rentTotal = 0;
    const mr = r / 100 / 12;
    const table: { year: number; buy: number; rent: number }[] = [];
    let curRent = rt;
    for (let y = 1; y <= h; y++) {
      for (let m = 0; m < 12; m++) {
        const int = bal * mr; const prin = mortMonthly - int; bal -= prin;
        buyCosts += mortMonthly;
      }
      const yearlyHome = p * Math.pow(1 + ap / 100, y);
      buyCosts += yearlyHome * (ex / 100);
      for (let m = 0; m < 12; m++) rentTotal += curRent;
      curRent *= 1 + ri / 100;
      table.push({ year: y, buy: buyCosts, rent: rentTotal });
    }
    const finalHome = p * Math.pow(1 + ap / 100, h);
    const equity = finalHome - bal;
    const buyNet = buyCosts - equity;
    const diff = Math.abs(buyNet - rentTotal);
    setRes({ buyCost: buyNet, rentCost: rentTotal, better: buyNet < rentTotal ? "Buying" : "Renting", diff, table });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result">
        <KVGrid items={[
          { label: "Buy Net Cost", value: fmt$(res.buyCost) },
          { label: "Rent Total Cost", value: fmt$(res.rentCost) },
          { label: "Cheaper Option", value: res.better },
          { label: "Difference", value: fmt$(res.diff) },
        ]} />
        <div className="mt-3 max-h-64 overflow-auto rounded border border-border">
          <table className="w-full text-xs">
            <thead className="bg-graybg text-left"><tr><th className="p-2">Year</th><th className="p-2">Buy Cost</th><th className="p-2">Rent Cost</th></tr></thead>
            <tbody>{res.table.map(r => <tr key={r.year} className="border-t border-border"><td className="p-2">{r.year}</td><td className="p-2">{fmt$(r.buy)}</td><td className="p-2">{fmt$(r.rent)}</td></tr>)}</tbody>
          </table>
        </div>
      </ResultPanel>
    )}>
      <FieldRow label="Home Price ($)"><TextInput value={price} onChange={setPrice} /></FieldRow>
      <FieldRow label="Down Payment ($)"><TextInput value={down} onChange={setDown} /></FieldRow>
      <FieldRow label="Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Term (yrs)"><TextInput value={term} onChange={setTerm} /></FieldRow>
      <FieldRow label="Monthly Rent ($)"><TextInput value={rent} onChange={setRent} /></FieldRow>
      <FieldRow label="Home Appreciation (%)"><TextInput value={appr} onChange={setAppr} /></FieldRow>
      <FieldRow label="Rent Increase (%)"><TextInput value={rentInc} onChange={setRentInc} /></FieldRow>
      <FieldRow label="Time Horizon (yrs)"><TextInput value={horizon} onChange={setHorizon} /></FieldRow>
      <FieldRow label="Tax/Ins/Maint (%/yr)"><TextInput value={expensesPct} onChange={setExpensesPct} /></FieldRow>
    </CalcForm>
  );
}
