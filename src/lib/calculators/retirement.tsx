import { useState } from "react";
import {
  CalcForm, FieldRow, TextInput, Select, ResultPanel, KVGrid,
  parseNum, fmt$, fmtPct, pmt, futureValue,
} from "@/lib/calc-ui";

export function RetirementCalculator() {
  const [age, setAge] = useState("35"), [ret, setRet] = useState("65"), [cur, setCur] = useState("50000");
  const [m, setM] = useState("500"), [r, setR] = useState("7"), [need, setNeed] = useState("5000"), [life, setLife] = useState("90");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { fv: number; sustainable: number; diff: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const A = parseNum(age), R = parseNum(ret), C = parseNum(cur) ?? 0, M = parseNum(m) ?? 0;
    const Rt = parseNum(r), N = parseNum(need) ?? 0, L = parseNum(life);
    if (A === null || R === null || Rt === null || L === null || R <= A) return setErr("Check ages.");
    const fv = futureValue(C, Rt, R - A, M);
    const years = L - R; const mr = Rt / 100 / 12; const nP = years * 12;
    const sustainable = mr === 0 ? fv / nP : (fv * mr * Math.pow(1 + mr, nP)) / (Math.pow(1 + mr, nP) - 1);
    setRes({ fv, sustainable, diff: sustainable - N });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Savings at Retirement", value: fmt$(res.fv) },
        { label: "Sustainable Monthly Income", value: fmt$(res.sustainable) },
        { label: "vs Desired", value: (res.diff >= 0 ? "+" : "") + fmt$(res.diff) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Current Age"><TextInput value={age} onChange={setAge} /></FieldRow>
      <FieldRow label="Retirement Age"><TextInput value={ret} onChange={setRet} /></FieldRow>
      <FieldRow label="Current Savings ($)"><TextInput value={cur} onChange={setCur} /></FieldRow>
      <FieldRow label="Monthly Contribution ($)"><TextInput value={m} onChange={setM} /></FieldRow>
      <FieldRow label="Expected Return (%)"><TextInput value={r} onChange={setR} /></FieldRow>
      <FieldRow label="Desired Monthly Income ($)"><TextInput value={need} onChange={setNeed} /></FieldRow>
      <FieldRow label="Life Expectancy"><TextInput value={life} onChange={setLife} /></FieldRow>
    </CalcForm>
  );
}

export function K401Calculator() {
  const [age, setAge] = useState("30"), [ret, setRet] = useState("65"), [bal, setBal] = useState("20000");
  const [sal, setSal] = useState("60000"), [emp, setEmp] = useState("6"), [match, setMatch] = useState("50"), [limit, setLimit] = useState("6");
  const [r, setR] = useState("7"), [inc, setInc] = useState("2");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { fv: number; emp: number; er: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const A = parseNum(age), R = parseNum(ret), B = parseNum(bal) ?? 0, S0 = parseNum(sal);
    const E = parseNum(emp) ?? 0, MP = parseNum(match) ?? 0, LP = parseNum(limit) ?? 0, RT = parseNum(r) ?? 0, INC = parseNum(inc) ?? 0;
    if (A === null || R === null || S0 === null) return setErr("Enter valid values.");
    let bal2 = B, S = S0, totE = 0, totER = 0;
    for (let y = A; y < R; y++) {
      const ec = S * E / 100;
      const er = S * Math.min(E, LP) / 100 * (MP / 100);
      bal2 = (bal2 + ec + er) * (1 + RT / 100);
      totE += ec; totER += er;
      S *= 1 + INC / 100;
    }
    setRes({ fv: bal2, emp: totE, er: totER });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "401k at Retirement", value: fmt$(res.fv) },
        { label: "Total Employee Contributions", value: fmt$(res.emp) },
        { label: "Total Employer Match", value: fmt$(res.er) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Current Age"><TextInput value={age} onChange={setAge} /></FieldRow>
      <FieldRow label="Retirement Age"><TextInput value={ret} onChange={setRet} /></FieldRow>
      <FieldRow label="Current Balance ($)"><TextInput value={bal} onChange={setBal} /></FieldRow>
      <FieldRow label="Annual Salary ($)"><TextInput value={sal} onChange={setSal} /></FieldRow>
      <FieldRow label="Employee Contribution (%)"><TextInput value={emp} onChange={setEmp} /></FieldRow>
      <FieldRow label="Employer Match (%)"><TextInput value={match} onChange={setMatch} /></FieldRow>
      <FieldRow label="Match Limit (%)"><TextInput value={limit} onChange={setLimit} /></FieldRow>
      <FieldRow label="Return (%)"><TextInput value={r} onChange={setR} /></FieldRow>
      <FieldRow label="Salary Increase (%/yr)"><TextInput value={inc} onChange={setInc} /></FieldRow>
    </CalcForm>
  );
}

export function PensionCalculator() {
  const [yrs, setYrs] = useState("25"), [sal, setSal] = useState("80000"), [mult, setMult] = useState("1.75");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { annual: number; monthly: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const Y = parseNum(yrs), S = parseNum(sal), M = parseNum(mult);
    if (Y === null || S === null || M === null) return setErr("Enter valid values.");
    const a = Y * (M / 100) * S; setRes({ annual: a, monthly: a / 12 });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Annual Pension", value: fmt$(res.annual) },
        { label: "Monthly Pension", value: fmt$(res.monthly) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Years of Service"><TextInput value={yrs} onChange={setYrs} /></FieldRow>
      <FieldRow label="Final Avg Salary ($)"><TextInput value={sal} onChange={setSal} /></FieldRow>
      <FieldRow label="Multiplier (%/yr)"><TextInput value={mult} onChange={setMult} /></FieldRow>
    </CalcForm>
  );
}

export function SocialSecurityCalculator() {
  const [fra, setFra] = useState("67"), [benefit, setBenefit] = useState("2000"), [claim, setClaim] = useState("62");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { adjusted: number; a62: number; aFra: number; a70: number }>(null);
  function adj(fraAge: number, claimAge: number, base: number) {
    const months = (claimAge - fraAge) * 12;
    if (months < 0) {
      const m = -months;
      const first36 = Math.min(36, m);
      const beyond = Math.max(0, m - 36);
      const red = first36 * (5 / 9) / 100 + beyond * (5 / 12) / 100;
      return base * (1 - red);
    } else return base * (1 + months * (2 / 3) / 100);
  }
  function calc() {
    setErr(null); setRes(null);
    const F = parseNum(fra), B = parseNum(benefit), C = parseNum(claim);
    if (F === null || B === null || C === null) return setErr("Enter valid values.");
    setRes({ adjusted: adj(F, C, B), a62: adj(F, 62, B), aFra: B, a70: adj(F, 70, B) });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: `At Age ${claim}`, value: fmt$(res.adjusted) },
        { label: "At 62", value: fmt$(res.a62) },
        { label: `At FRA (${fra})`, value: fmt$(res.aFra) },
        { label: "At 70", value: fmt$(res.a70) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Full Retirement Age"><TextInput value={fra} onChange={setFra} /></FieldRow>
      <FieldRow label="Benefit at FRA ($/mo)"><TextInput value={benefit} onChange={setBenefit} /></FieldRow>
      <FieldRow label="Planned Claim Age"><TextInput value={claim} onChange={setClaim} /></FieldRow>
    </CalcForm>
  );
}

export function AnnuityCalculator() {
  const [pmtV, setPmtV] = useState("500"), [rate, setRate] = useState("5"), [n, setN] = useState("20"), [freq, setFreq] = useState("12"), [type, setType] = useState("ordinary");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { fv: number; total: number; interest: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const P = parseNum(pmtV), R = parseNum(rate), N = parseNum(n), F = parseNum(freq);
    if (P === null || R === null || N === null || F === null) return setErr("Enter valid values.");
    const r = R / 100 / F; const periods = N * F;
    const g = Math.pow(1 + r, periods);
    let fv = r === 0 ? P * periods : P * ((g - 1) / r);
    if (type === "due") fv *= (1 + r);
    setRes({ fv, total: P * periods, interest: fv - P * periods });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Future Value", value: fmt$(res.fv) },
        { label: "Total Payments", value: fmt$(res.total) },
        { label: "Interest Earned", value: fmt$(res.interest) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Payment/Period ($)"><TextInput value={pmtV} onChange={setPmtV} /></FieldRow>
      <FieldRow label="Rate (%/yr)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Years"><TextInput value={n} onChange={setN} /></FieldRow>
      <FieldRow label="Payments/Year"><Select value={freq} onChange={setFreq} options={[{value:"12",label:"Monthly"},{value:"1",label:"Annual"}]} /></FieldRow>
      <FieldRow label="Type"><Select value={type} onChange={setType} options={[{value:"ordinary",label:"Ordinary"},{value:"due",label:"Annuity Due"}]} /></FieldRow>
    </CalcForm>
  );
}

export function AnnuityPayoutCalculator() {
  const [prin, setPrin] = useState("500000"), [rate, setRate] = useState("5"), [years, setYears] = useState("20");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { monthly: number; annual: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const P = parseNum(prin), R = parseNum(rate), Y = parseNum(years);
    if (P === null || R === null || Y === null) return setErr("Enter valid values.");
    const p = pmt(P, R, Y * 12); setRes({ monthly: p, annual: p * 12 });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Monthly Payout", value: fmt$(res.monthly) },
        { label: "Annual Payout", value: fmt$(res.annual) },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Starting Principal ($)"><TextInput value={prin} onChange={setPrin} /></FieldRow>
      <FieldRow label="Rate (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      <FieldRow label="Payout Period (years)"><TextInput value={years} onChange={setYears} /></FieldRow>
    </CalcForm>
  );
}

function IraShared({ isRoth }: { isRoth: boolean }) {
  const [age, setAge] = useState("30"), [ret, setRet] = useState("65"), [bal, setBal] = useState("10000");
  const [contrib, setContrib] = useState("7000"), [rate, setRate] = useState("7"), [tax, setTax] = useState("22");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { fv: number; contrib: number; savings: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const A = parseNum(age), R = parseNum(ret), B = parseNum(bal) ?? 0, C = parseNum(contrib) ?? 0, Rt = parseNum(rate), T = parseNum(tax) ?? 0;
    if (A === null || R === null || Rt === null || R <= A) return setErr("Check ages.");
    const yrs = R - A;
    const fv = futureValue(B, Rt, yrs, C / 12);
    setRes({ fv, contrib: C * yrs, savings: isRoth ? 0 : C * (T / 100) * yrs });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Balance at Retirement", value: fmt$(res.fv) },
        { label: "Total Contributions", value: fmt$(res.contrib) },
        ...(isRoth ? [] : [{ label: "Est. Tax Savings", value: fmt$(res.savings) }]),
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Current Age"><TextInput value={age} onChange={setAge} /></FieldRow>
      <FieldRow label="Retirement Age"><TextInput value={ret} onChange={setRet} /></FieldRow>
      <FieldRow label="Current Balance ($)"><TextInput value={bal} onChange={setBal} /></FieldRow>
      <FieldRow label="Annual Contribution ($)"><TextInput value={contrib} onChange={setContrib} /></FieldRow>
      <FieldRow label="Return (%)"><TextInput value={rate} onChange={setRate} /></FieldRow>
      {!isRoth && <FieldRow label="Tax Rate (%)"><TextInput value={tax} onChange={setTax} /></FieldRow>}
    </CalcForm>
  );
}
export function RothIraCalculator() { return <IraShared isRoth={true} />; }
export function IraCalculator() { return <IraShared isRoth={false} />; }

const RMD_TABLE: Record<number, number> = {
  72:27.4,73:26.5,74:25.5,75:24.6,76:23.7,77:22.9,78:22.0,79:21.1,80:20.2,81:19.4,82:18.5,83:17.7,84:16.8,85:16.0,86:15.2,87:14.4,88:13.7,89:12.9,90:12.2,91:11.5,92:10.8,93:10.1,94:9.5,95:8.9,96:8.4,97:7.8,98:7.3,99:6.8,100:6.4,
};
export function RmdCalculator() {
  const [bal, setBal] = useState("500000"), [age, setAge] = useState("75");
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<null | { rmd: number; factor: number }>(null);
  function calc() {
    setErr(null); setRes(null);
    const B = parseNum(bal), A = parseNum(age);
    if (B === null || A === null) return setErr("Enter values.");
    const factor = RMD_TABLE[Math.round(A)] ?? RMD_TABLE[100];
    setRes({ rmd: B / factor, factor });
  }
  return (
    <CalcForm onCalc={calc} onClear={() => { setRes(null); setErr(null); }} error={err} result={res && (
      <ResultPanel title="Result"><KVGrid items={[
        { label: "Required Minimum Distribution", value: fmt$(res.rmd) },
        { label: "IRS Life Expectancy Factor", value: res.factor },
      ]} /></ResultPanel>
    )}>
      <FieldRow label="Prior Year-End Balance ($)"><TextInput value={bal} onChange={setBal} /></FieldRow>
      <FieldRow label="Current Age"><TextInput value={age} onChange={setAge} /></FieldRow>
    </CalcForm>
  );
}
