import { useState } from "react";
import {
  CalcForm, FieldRow, TextInput, Select, ResultPanel, KVGrid,
  parseNum, fmt$, fmtPct, futureValue,
} from "@/lib/calc-ui";

const COMP_OPTS = [
  { value: "1", label: "Annually" },
  { value: "2", label: "Semi-Annually" },
  { value: "4", label: "Quarterly" },
  { value: "12", label: "Monthly" },
  { value: "365", label: "Daily" },
];

export function InterestCalculator() {
  const [p, setP] = useState("10000");
  const [r, setR] = useState("5");
  const [t, setT] = useState("10");
  const [n, setN] = useState("12");
  const [type, setType] = useState("compound");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { interest: number; total: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const P = parseNum(p), R = parseNum(r), T = parseNum(t), N = parseNum(n);
    if (P === null || R === null || T === null) return setErr("Enter valid values.");
    if (type === "simple") { const I = P * (R / 100) * T; setRes({ interest: I, total: P + I }); }
    else { const A = P * Math.pow(1 + (R / 100) / (N ?? 12), (N ?? 12) * T); setRes({ interest: A - P, total: A }); }
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Interest Earned", value: fmt$(res.interest) },
        { label: "Final Balance", value: fmt$(res.total) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Principal ($)"><TextInput value={p} onChange={setP} /></FieldRow>
      <FieldRow label="Rate (%)"><TextInput value={r} onChange={setR} /></FieldRow>
      <FieldRow label="Time (years)"><TextInput value={t} onChange={setT} /></FieldRow>
      <FieldRow label="Compounding"><Select value={n} onChange={setN} options={COMP_OPTS} /></FieldRow>
      <FieldRow label="Type"><Select value={type} onChange={setType} options={[{value:"simple",label:"Simple"},{value:"compound",label:"Compound"}]} /></FieldRow>
    </CalcForm>
  );
}

export function InvestmentCalculator() {
  const [init, setInit] = useState("10000");
  const [monthly, setMonthly] = useState("500");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("20");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { fv: number; contrib: number; growth: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const i = parseNum(init) ?? 0, m = parseNum(monthly) ?? 0, r = parseNum(rate), y = parseNum(years);
    if (r === null || y === null) return setErr("Enter valid rate & years.");
    const fv = futureValue(i, r, y, m);
    const contrib = i + m * 12 * y;
    setRes({ fv, contrib, growth: fv - contrib });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Final Balance", value: fmt$(res.fv) },
        { label: "Total Contributions", value: fmt$(res.contrib) },
        { label: "Total Growth", value: fmt$(res.growth) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Initial ($)"><TextInput value={init} onChange={setInit} /></FieldRow>
      <FieldRow label="Monthly ($)"><TextInput value={monthly} onChange={setMonthly} /></FieldRow>
      <FieldRow label="Annual Return (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Years"><TextInput value={years} onChange={setYears} /></FieldRow>
    </CalcForm>
  );
}

export function FinanceCalculator() {
  const [pv, setPv] = useState("1000");
  const [fv, setFv] = useState("");
  const [pmt, setPmt] = useState("100");
  const [n, setN] = useState("10");
  const [iy, setIy] = useState("5");
  const [solve, setSolve] = useState("fv");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<number | null>(null);
  function calc() {
    setErr(null); setRes(null);
    const PV = parseNum(pv), FV = parseNum(fv), PMT = parseNum(pmt), N = parseNum(n), R = parseNum(iy);
    const r = (R ?? 0) / 100;
    try {
      if (solve === "fv" && PV !== null && PMT !== null && N !== null && R !== null) {
        const g = Math.pow(1 + r, N);
        setRes(-(PV * g + PMT * ((g - 1) / (r || 1))));
      } else if (solve === "pv" && FV !== null && PMT !== null && N !== null && R !== null) {
        const g = Math.pow(1 + r, N);
        setRes(-(FV + PMT * ((g - 1) / (r || 1))) / g);
      } else if (solve === "pmt" && PV !== null && FV !== null && N !== null && R !== null) {
        const g = Math.pow(1 + r, N);
        setRes(-(FV + PV * g) * (r || 1) / (g - 1));
      } else if (solve === "n" && PV !== null && FV !== null && PMT !== null && R !== null) {
        // FV = -PV*(1+r)^n - PMT*((1+r)^n-1)/r → solve iteratively
        let lo = 0, hi = 1000;
        for (let k = 0; k < 60; k++) {
          const mid = (lo + hi) / 2;
          const g = Math.pow(1 + r, mid);
          const v = -PV * g - PMT * ((g - 1) / (r || 1));
          if (v < FV) hi = mid; else lo = mid;
        }
        setRes((lo + hi) / 2);
      } else if (solve === "i" && PV !== null && FV !== null && PMT !== null && N !== null) {
        let lo = -0.99, hi = 5;
        for (let k = 0; k < 80; k++) {
          const mid = (lo + hi) / 2;
          const g = Math.pow(1 + mid, N);
          const v = -PV * g - PMT * ((g - 1) / (mid || 1e-9));
          if (v < FV) lo = mid; else hi = mid;
        }
        setRes(((lo + hi) / 2) * 100);
      } else setErr("Fill all fields except the one being solved.");
    } catch { setErr("Invalid inputs."); }
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res !== null && (
      <ResultPanel title="Result"><KVGrid items={[{ label: `Solved ${solve.toUpperCase()}`, value: solve === "i" ? fmtPct(res) : (solve === "n" ? res.toFixed(2) + " periods" : fmt$(res)) }]} /></ResultPanel>
    )}>
      <FieldRow label="Solve For"><Select value={solve} onChange={setSolve} options={[
        {value:"fv",label:"Future Value"},{value:"pv",label:"Present Value"},{value:"pmt",label:"Payment"},{value:"n",label:"# Periods"},{value:"i",label:"Interest Rate"}
      ]} /></FieldRow>
      <FieldRow label="Present Value"><TextInput value={pv} onChange={setPv} /></FieldRow>
      <FieldRow label="Future Value"><TextInput value={fv} onChange={setFv} /></FieldRow>
      <FieldRow label="Payment"><TextInput value={pmt} onChange={setPmt} /></FieldRow>
      <FieldRow label="Periods"><TextInput value={n} onChange={setN} /></FieldRow>
      <FieldRow label="Rate (%/period)"><TextInput value={iy} onChange={setIy} /></FieldRow>
    </CalcForm>
  );
}

export function CompoundInterestCalculator() {
  const [p, setP] = useState("10000");
  const [r, setR] = useState("5");
  const [n, setN] = useState("12");
  const [t, setT] = useState("10");
  const [dep, setDep] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { final: number; prin: number; interest: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const P = parseNum(p), R = parseNum(r), N = parseNum(n), T = parseNum(t), D = parseNum(dep) ?? 0;
    if (P === null || R === null || N === null || T === null) return setErr("Enter valid values.");
    const rp = R / 100 / N;
    const nt = N * T;
    const g = Math.pow(1 + rp, nt);
    const A = P * g + (rp === 0 ? D * nt : D * ((g - 1) / rp));
    const prin = P + D * nt;
    setRes({ final: A, prin, interest: A - prin });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Final Amount", value: fmt$(res.final) },
        { label: "Total Principal", value: fmt$(res.prin) },
        { label: "Interest Earned", value: fmt$(res.interest) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Principal ($)"><TextInput value={p} onChange={setP} /></FieldRow>
      <FieldRow label="Annual Rate (%)"><TextInput value={r} onChange={setR} /></FieldRow>
      <FieldRow label="Compounds/Year"><Select value={n} onChange={setN} options={COMP_OPTS} /></FieldRow>
      <FieldRow label="Years"><TextInput value={t} onChange={setT} /></FieldRow>
      <FieldRow label="Periodic Deposit ($/period)"><TextInput value={dep} onChange={setDep} /></FieldRow>
    </CalcForm>
  );
}

export function InterestRateCalculator() {
  const [pv, setPv] = useState("10000");
  const [fv, setFv] = useState("20000");
  const [n, setN] = useState("10");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<number | null>(null);
  function calc() {
    setErr(null); setRes(null);
    const PV = parseNum(pv), FV = parseNum(fv), N = parseNum(n);
    if (PV === null || FV === null || N === null || PV <= 0 || N <= 0) return setErr("Enter valid values.");
    setRes((Math.pow(FV / PV, 1 / N) - 1) * 100);
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res !== null && (
      <ResultPanel title="Result"><KVGrid items={[{ label: "Implied Rate", value: fmtPct(res) }]} /></ResultPanel>
    )}>
      <FieldRow label="Present Value ($)"><TextInput value={pv} onChange={setPv} /></FieldRow>
      <FieldRow label="Future Value ($)"><TextInput value={fv} onChange={setFv} /></FieldRow>
      <FieldRow label="Years"><TextInput value={n} onChange={setN} /></FieldRow>
    </CalcForm>
  );
}

export function SavingsCalculator() { return <InvestmentCalculator />; }

export function SimpleInterestCalculator() {
  const [p, setP] = useState("10000");
  const [r, setR] = useState("5");
  const [t, setT] = useState("10");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { interest: number; total: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const P = parseNum(p), R = parseNum(r), T = parseNum(t);
    if (P === null || R === null || T === null) return setErr("Enter valid values.");
    const I = P * R / 100 * T; setRes({ interest: I, total: P + I });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Interest", value: fmt$(res.interest) },
        { label: "Total", value: fmt$(res.total) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Principal ($)"><TextInput value={p} onChange={setP} /></FieldRow>
      <FieldRow label="Rate (%)"><TextInput value={r} onChange={setR} /></FieldRow>
      <FieldRow label="Time (years)"><TextInput value={t} onChange={setT} /></FieldRow>
    </CalcForm>
  );
}

export function CdCalculator() {
  const [dep, setDep] = useState("10000");
  const [apy, setApy] = useState("4.5");
  const [months, setMonths] = useState("24");
  const [n, setN] = useState("12");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { total: number; interest: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const D = parseNum(dep), R = parseNum(apy), M = parseNum(months), N = parseNum(n);
    if (D === null || R === null || M === null || N === null) return setErr("Enter valid values.");
    const t = M / 12;
    const A = D * Math.pow(1 + (R / 100) / N, N * t);
    setRes({ total: A, interest: A - D });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Maturity Value", value: fmt$(res.total) },
        { label: "Interest Earned", value: fmt$(res.interest) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Deposit ($)"><TextInput value={dep} onChange={setDep} /></FieldRow>
      <FieldRow label="APY (%)"><TextInput value={apy} onChange={setApy} /></FieldRow>
      <FieldRow label="Term (months)"><TextInput value={months} onChange={setMonths} /></FieldRow>
      <FieldRow label="Compounding"><Select value={n} onChange={setN} options={COMP_OPTS} /></FieldRow>
    </CalcForm>
  );
}

export function BondCalculator() {
  const [face, setFace] = useState("1000");
  const [coupon, setCoupon] = useState("5");
  const [years, setYears] = useState("10");
  const [market, setMarket] = useState("6");
  const [freq, setFreq] = useState("2");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { price: number; totalCoupons: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const F = parseNum(face), C = parseNum(coupon), Y = parseNum(years), M = parseNum(market), N = parseNum(freq);
    if (F === null || C === null || Y === null || M === null || N === null) return setErr("Enter valid values.");
    const periods = Y * N;
    const cpn = F * (C / 100) / N;
    const r = (M / 100) / N;
    let price = 0;
    for (let t = 1; t <= periods; t++) price += cpn / Math.pow(1 + r, t);
    price += F / Math.pow(1 + r, periods);
    setRes({ price, totalCoupons: cpn * periods });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Bond Price", value: fmt$(res.price) },
        { label: "Total Coupon Payments", value: fmt$(res.totalCoupons) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Face Value ($)"><TextInput value={face} onChange={setFace} /></FieldRow>
      <FieldRow label="Coupon Rate (%)"><TextInput value={coupon} onChange={setCoupon} /></FieldRow>
      <FieldRow label="Years to Maturity"><TextInput value={years} onChange={setYears} /></FieldRow>
      <FieldRow label="Market Rate (%)"><TextInput value={market} onChange={setMarket} /></FieldRow>
      <FieldRow label="Payments/Year"><Select value={freq} onChange={setFreq} options={[{value:"1",label:"Annual"},{value:"2",label:"Semi-Annual"}]} /></FieldRow>
    </CalcForm>
  );
}

export function MutualFundCalculator() {
  const [init, setInit] = useState("10000");
  const [monthly, setMonthly] = useState("500");
  const [ret, setRet] = useState("8");
  const [er, setEr] = useState("0.5");
  const [years, setYears] = useState("20");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { fv: number; contrib: number; fees: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const I = parseNum(init) ?? 0, M = parseNum(monthly) ?? 0, R = parseNum(ret), E = parseNum(er) ?? 0, Y = parseNum(years);
    if (R === null || Y === null) return setErr("Enter valid values.");
    const net = R - E;
    const fv = futureValue(I, net, Y, M);
    const contrib = I + M * 12 * Y;
    const gross = futureValue(I, R, Y, M);
    setRes({ fv, contrib, fees: gross - fv });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Projected Value", value: fmt$(res.fv) },
        { label: "Total Contributions", value: fmt$(res.contrib) },
        { label: "Fees Paid (est.)", value: fmt$(res.fees) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Initial ($)"><TextInput value={init} onChange={setInit} /></FieldRow>
      <FieldRow label="Monthly ($)"><TextInput value={monthly} onChange={setMonthly} /></FieldRow>
      <FieldRow label="Expected Return (%)"><TextInput value={ret} onChange={setRet} /></FieldRow>
      <FieldRow label="Expense Ratio (%)"><TextInput value={er} onChange={setEr} /></FieldRow>
      <FieldRow label="Years"><TextInput value={years} onChange={setYears} /></FieldRow>
    </CalcForm>
  );
}

export function AverageReturnCalculator() {
  const [rows, setRows] = useState<string[]>(["10", "8", "-5", "15", "12"]);
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { arith: number; geom: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const vals = rows.map(v => parseNum(v)).filter((v): v is number => v !== null);
    if (vals.length < 1) return setErr("Add at least one year.");
    const arith = vals.reduce((s, v) => s + v, 0) / vals.length;
    const prod = vals.reduce((p, v) => p * (1 + v / 100), 1);
    const geom = (Math.pow(prod, 1 / vals.length) - 1) * 100;
    setRes({ arith, geom });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Arithmetic Avg", value: fmtPct(res.arith) },
        { label: "Geometric (CAGR)", value: fmtPct(res.geom) },
      ]} /></ResultPanel>
    )}>
      {rows.map((v, i) => (
        <FieldRow key={i} label={`Year ${i + 1} Return (%)`}>
          <div className="flex items-center gap-2">
            <TextInput value={v} onChange={(x) => setRows(rows.map((y, j) => j === i ? x : y))} />
            <button type="button" className="text-xs text-linkblue" onClick={() => setRows(rows.filter((_, j) => j !== i))}>Remove</button>
          </div>
        </FieldRow>
      ))}
      <button type="button" className="text-sm text-linkblue" onClick={() => setRows([...rows, ""])}>+ Add year</button>
    </CalcForm>
  );
}

export function IrrCalculator() {
  const [init, setInit] = useState("10000");
  const [flows, setFlows] = useState<string[]>(["2500", "3000", "3500", "4000"]);
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<number | null>(null);
  function calc() {
    setErr(null); setRes(null);
    const I = parseNum(init);
    if (I === null) return setErr("Enter initial investment.");
    const cf = [-I, ...flows.map(v => parseNum(v) ?? 0)];
    // bisection
    let lo = -0.999, hi = 10;
    for (let k = 0; k < 200; k++) {
      const mid = (lo + hi) / 2;
      const npv = cf.reduce((s, c, t) => s + c / Math.pow(1 + mid, t), 0);
      if (npv > 0) lo = mid; else hi = mid;
    }
    setRes(((lo + hi) / 2) * 100);
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res !== null && (
      <ResultPanel title="Result"><KVGrid items={[{ label: "IRR", value: fmtPct(res) }]} /></ResultPanel>
    )}>
      <FieldRow label="Initial Investment ($)"><TextInput value={init} onChange={setInit} /></FieldRow>
      {flows.map((v, i) => (
        <FieldRow key={i} label={`Year ${i + 1} Cash Flow ($)`}>
          <div className="flex items-center gap-2">
            <TextInput value={v} onChange={(x) => setFlows(flows.map((y, j) => j === i ? x : y))} />
            <button type="button" className="text-xs text-linkblue" onClick={() => setFlows(flows.filter((_, j) => j !== i))}>Remove</button>
          </div>
        </FieldRow>
      ))}
      <button type="button" className="text-sm text-linkblue" onClick={() => setFlows([...flows, ""])}>+ Add cash flow</button>
    </CalcForm>
  );
}

export function RoiCalculator() {
  const [init, setInit] = useState("10000");
  const [final, setFinal] = useState("15000");
  const [years, setYears] = useState("5");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { roi: number; ann: number; profit: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const I = parseNum(init), F = parseNum(final), Y = parseNum(years);
    if (I === null || F === null || I <= 0) return setErr("Enter valid values.");
    const roi = ((F - I) / I) * 100;
    const ann = Y && Y > 0 ? (Math.pow(1 + roi / 100, 1 / Y) - 1) * 100 : NaN;
    setRes({ roi, ann, profit: F - I });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Net Profit", value: fmt$(res.profit) },
        { label: "Total ROI", value: fmtPct(res.roi) },
        { label: "Annualized ROI", value: Number.isFinite(res.ann) ? fmtPct(res.ann) : "—" },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Initial ($)"><TextInput value={init} onChange={setInit} /></FieldRow>
      <FieldRow label="Final Value ($)"><TextInput value={final} onChange={setFinal} /></FieldRow>
      <FieldRow label="Years (optional)"><TextInput value={years} onChange={setYears} /></FieldRow>
    </CalcForm>
  );
}

export function PaybackPeriodCalculator() {
  const [init, setInit] = useState("50000");
  const [flows, setFlows] = useState<string[]>(["12000", "15000", "18000", "20000"]);
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<number | null>(null);
  function calc() {
    setErr(null); setRes(null);
    const I = parseNum(init);
    if (I === null) return setErr("Enter initial investment.");
    let cum = 0;
    const fvals = flows.map(v => parseNum(v) ?? 0);
    for (let i = 0; i < fvals.length; i++) {
      if (cum + fvals[i] >= I) { setRes(i + (I - cum) / fvals[i]); return; }
      cum += fvals[i];
    }
    setErr("Cash flows never reach the initial investment.");
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res !== null && (
      <ResultPanel title="Result"><KVGrid items={[{ label: "Payback Period", value: res.toFixed(2) + " years" }]} /></ResultPanel>
    )}>
      <FieldRow label="Initial Investment ($)"><TextInput value={init} onChange={setInit} /></FieldRow>
      {flows.map((v, i) => (
        <FieldRow key={i} label={`Year ${i + 1} ($)`}>
          <div className="flex items-center gap-2">
            <TextInput value={v} onChange={(x) => setFlows(flows.map((y, j) => j === i ? x : y))} />
            <button type="button" className="text-xs text-linkblue" onClick={() => setFlows(flows.filter((_, j) => j !== i))}>Remove</button>
          </div>
        </FieldRow>
      ))}
      <button type="button" className="text-sm text-linkblue" onClick={() => setFlows([...flows, ""])}>+ Add year</button>
    </CalcForm>
  );
}

export function PresentValueCalculator() {
  const [fv, setFv] = useState("10000");
  const [rate, setRate] = useState("5");
  const [n, setN] = useState("10");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<number | null>(null);
  function calc() {
    setErr(null); setRes(null);
    const F = parseNum(fv), R = parseNum(rate), N = parseNum(n);
    if (F === null || R === null || N === null) return setErr("Enter valid values.");
    setRes(F / Math.pow(1 + R / 100, N));
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res !== null && (
      <ResultPanel title="Result"><KVGrid items={[{ label: "Present Value", value: fmt$(res) }]} /></ResultPanel>
    )}>
      <FieldRow label="Future Value ($)"><TextInput value={fv} onChange={setFv} /></FieldRow>
      <FieldRow label="Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Years"><TextInput value={n} onChange={setN} /></FieldRow>
    </CalcForm>
  );
}

export function FutureValueCalculator() {
  const [pv, setPv] = useState("10000");
  const [rate, setRate] = useState("5");
  const [n, setN] = useState("10");
  const [contrib, setContrib] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<number | null>(null);
  function calc() {
    setErr(null); setRes(null);
    const P = parseNum(pv), R = parseNum(rate), N = parseNum(n), C = parseNum(contrib) ?? 0;
    if (P === null || R === null || N === null) return setErr("Enter valid values.");
    const r = R / 100, g = Math.pow(1 + r, N);
    const fv = P * g + (r === 0 ? C * N : C * ((g - 1) / r));
    setRes(fv);
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res !== null && (
      <ResultPanel title="Result"><KVGrid items={[{ label: "Future Value", value: fmt$(res) }]} /></ResultPanel>
    )}>
      <FieldRow label="Present Value ($)"><TextInput value={pv} onChange={setPv} /></FieldRow>
      <FieldRow label="Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Years"><TextInput value={n} onChange={setN} /></FieldRow>
      <FieldRow label="Annual Contribution ($)"><TextInput value={contrib} onChange={setContrib} /></FieldRow>
    </CalcForm>
  );
}
