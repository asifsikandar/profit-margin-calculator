import type { CalcDef, CalcResult } from "./calc-framework";
import { num, req, reqPos, reqNonNeg, fmt, money } from "./calc-framework";



// ============================================================
// FINANCIAL
// ============================================================

function pmt(principal: number, monthlyRate: number, n: number): number {
  if (monthlyRate === 0) return principal / n;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
}

const mortgage: CalcDef = {
  title: "Mortgage Calculator",
  description: "Estimate monthly mortgage payments including principal and interest.",
  fields: [
    { name: "price", label: "Home price", suffix: "$", default: "300000" },
    { name: "down", label: "Down payment", suffix: "$", default: "60000" },
    { name: "rate", label: "Interest rate", suffix: "% APR", default: "6.5" },
    { name: "years", label: "Loan term", suffix: "years", default: "30" },
  ],
  compute: (v) => {
    const price = reqPos(v.price, "Home price");
    const down = reqNonNeg(v.down, "Down payment");
    const rate = reqNonNeg(v.rate, "Interest rate");
    const years = reqPos(v.years, "Loan term");
    if (down >= price) return { error: "Down payment must be less than home price." };
    const principal = price - down;
    const n = years * 12;
    const r = rate / 100 / 12;
    const monthly = pmt(principal, r, n);
    const total = monthly * n;
    return [
      { label: "Monthly payment", value: money(monthly), emphasize: true },
      { label: "Loan amount", value: money(principal) },
      { label: "Total paid", value: money(total) },
      { label: "Total interest", value: money(total - principal) },
    ];
  },
};

const loan: CalcDef = {
  title: "Loan Calculator",
  description: "Calculate monthly payment and total cost for any fixed-rate loan.",
  fields: [
    { name: "amount", label: "Loan amount", suffix: "$", default: "10000" },
    { name: "rate", label: "Interest rate", suffix: "% APR", default: "7" },
    { name: "years", label: "Loan term", suffix: "years", default: "5" },
  ],
  compute: (v) => {
    const p = reqPos(v.amount, "Loan amount");
    const r = reqNonNeg(v.rate, "Interest rate") / 100 / 12;
    const n = reqPos(v.years, "Loan term") * 12;
    const m = pmt(p, r, n);
    return [
      { label: "Monthly payment", value: money(m), emphasize: true },
      { label: "Total interest", value: money(m * n - p) },
      { label: "Total paid", value: money(m * n) },
    ];
  },
};

const autoLoan: CalcDef = { ...loan, title: "Auto Loan Calculator", description: "Estimate the monthly payment and total interest on a car loan." };
const personalLoan: CalcDef = { ...loan, title: "Personal Loan Calculator", description: "Estimate the monthly payment and total cost of a fixed-rate personal loan." };
const businessLoan: CalcDef = { ...loan, title: "Business Loan Calculator", description: "Estimate the monthly payment and total cost of a fixed-rate business loan." };
const studentLoan: CalcDef = { ...loan, title: "Student Loan Calculator", description: "Estimate the monthly payment and total interest on a student loan in repayment." };
const boatLoan: CalcDef = { ...loan, title: "Boat Loan Calculator", description: "Estimate the monthly payment and total cost of a boat loan." };

const compoundInterest: CalcDef = {
  title: "Compound Interest Calculator",
  description: "Calculate compound growth over time.",
  fields: [
    { name: "p", label: "Principal", suffix: "$", default: "1000" },
    { name: "r", label: "Annual interest rate", suffix: "%", default: "5" },
    { name: "n", label: "Compounds per year", type: "select", default: "12",
      options: [
        { value: "1", label: "Annually" },
        { value: "2", label: "Semi-annually" },
        { value: "4", label: "Quarterly" },
        { value: "12", label: "Monthly" },
        { value: "365", label: "Daily" },
      ] },
    { name: "t", label: "Years", default: "10" },
    { name: "pmt", label: "Additional monthly contribution", suffix: "$", default: "0" },
  ],
  compute: (v) => {
    const p = reqNonNeg(v.p, "Principal");
    const r = reqNonNeg(v.r, "Rate") / 100;
    const n = reqPos(v.n, "Compounds per year");
    const t = reqPos(v.t, "Years");
    const pmtM = reqNonNeg(v.pmt, "Monthly contribution");
    const A0 = p * Math.pow(1 + r / n, n * t);
    // future value of monthly contributions using effective monthly rate from nominal
    const rm = Math.pow(1 + r / n, n / 12) - 1;
    const months = t * 12;
    const FVc = rm === 0 ? pmtM * months : pmtM * ((Math.pow(1 + rm, months) - 1) / rm);
    const total = A0 + FVc;
    const contrib = p + pmtM * months;
    return [
      { label: "Future value", value: money(total), emphasize: true },
      { label: "Total contributed", value: money(contrib) },
      { label: "Interest earned", value: money(total - contrib) },
    ];
  },
};

const simpleInterest: CalcDef = {
  title: "Simple Interest Calculator",
  fields: [
    { name: "p", label: "Principal", suffix: "$", default: "1000" },
    { name: "r", label: "Annual rate", suffix: "%", default: "5" },
    { name: "t", label: "Time", suffix: "years", default: "3" },
  ],
  compute: (v) => {
    const p = reqNonNeg(v.p, "Principal");
    const r = reqNonNeg(v.r, "Rate") / 100;
    const t = reqPos(v.t, "Time");
    const I = p * r * t;
    return [
      { label: "Interest", value: money(I), emphasize: true },
      { label: "Total amount", value: money(p + I) },
    ];
  },
  formula: "I = P × r × t",
};

const presentValue: CalcDef = {
  title: "Present Value Calculator",
  fields: [
    { name: "fv", label: "Future value", suffix: "$", default: "10000" },
    { name: "r", label: "Discount rate", suffix: "%", default: "5" },
    { name: "t", label: "Years", default: "10" },
  ],
  compute: (v) => {
    const fv = reqPos(v.fv, "Future value");
    const r = reqNonNeg(v.r, "Rate") / 100;
    const t = reqPos(v.t, "Years");
    return [{ label: "Present value", value: money(fv / Math.pow(1 + r, t)), emphasize: true }];
  },
};

const futureValue: CalcDef = {
  title: "Future Value Calculator",
  fields: [
    { name: "pv", label: "Present value", suffix: "$", default: "1000" },
    { name: "r", label: "Annual rate", suffix: "%", default: "5" },
    { name: "t", label: "Years", default: "10" },
  ],
  compute: (v) => {
    const pv = reqPos(v.pv, "Present value");
    const r = reqNonNeg(v.r, "Rate") / 100;
    const t = reqPos(v.t, "Years");
    return [{ label: "Future value", value: money(pv * Math.pow(1 + r, t)), emphasize: true }];
  },
};

const roi: CalcDef = {
  title: "ROI Calculator",
  description: "Return on investment.",
  fields: [
    { name: "initial", label: "Initial investment", suffix: "$", default: "1000" },
    { name: "final", label: "Final value", suffix: "$", default: "1500" },
    { name: "years", label: "Holding period", suffix: "years (optional)", default: "" },
  ],
  compute: (v) => {
    const i = reqPos(v.initial, "Initial");
    const f = reqPos(v.final, "Final");
    const gain = f - i;
    const roiPct = (gain / i) * 100;
    const results = [
      { label: "Net gain", value: money(gain) },
      { label: "ROI", value: fmt(roiPct) + "%", emphasize: true },
    ];
    const y = num(v.years);
    if (Number.isFinite(y) && y > 0) {
      const annualized = (Math.pow(f / i, 1 / y) - 1) * 100;
      results.push({ label: "Annualized return", value: fmt(annualized) + "%" });
    }
    return results;
  },
};

const salesTax: CalcDef = {
  title: "Sales Tax Calculator",
  fields: [
    { name: "amt", label: "Pre-tax amount", suffix: "$", default: "100" },
    { name: "rate", label: "Sales tax rate", suffix: "%", default: "7.5" },
  ],
  compute: (v) => {
    const a = reqNonNeg(v.amt, "Amount");
    const r = reqNonNeg(v.rate, "Rate") / 100;
    const tax = a * r;
    return [
      { label: "Tax", value: money(tax) },
      { label: "Total", value: money(a + tax), emphasize: true },
    ];
  },
};
const vat: CalcDef = { ...salesTax, title: "VAT Calculator", description: "Add value added tax to a net price and see the tax amount and gross total." };

const inflation: CalcDef = {
  title: "Inflation Calculator",
  fields: [
    { name: "amt", label: "Amount", suffix: "$", default: "1000" },
    { name: "rate", label: "Annual inflation rate", suffix: "%", default: "3" },
    { name: "years", label: "Years", default: "10" },
  ],
  compute: (v) => {
    const a = reqPos(v.amt, "Amount");
    const r = reqNonNeg(v.rate, "Rate") / 100;
    const t = reqPos(v.years, "Years");
    const future = a * Math.pow(1 + r, t);
    const purchasing = a / Math.pow(1 + r, t);
    return [
      { label: `Nominal value after ${t} yrs`, value: money(future) },
      { label: "Equivalent purchasing power today", value: money(purchasing), emphasize: true },
    ];
  },
};

const discount: CalcDef = {
  title: "Discount Calculator",
  fields: [
    { name: "price", label: "Original price", suffix: "$", default: "100" },
    { name: "pct", label: "Discount", suffix: "%", default: "20" },
  ],
  compute: (v) => {
    const p = reqPos(v.price, "Price");
    const d = reqNonNeg(v.pct, "Discount") / 100;
    const off = p * d;
    return [
      { label: "You save", value: money(off) },
      { label: "Final price", value: money(p - off), emphasize: true },
    ];
  },
};

const tipCalc: CalcDef = {
  title: "Tip Calculator",
  fields: [
    { name: "bill", label: "Bill amount", suffix: "$", default: "50" },
    { name: "tip", label: "Tip percent", suffix: "%", default: "18" },
    { name: "people", label: "Split between", suffix: "people", default: "1" },
  ],
  compute: (v) => {
    const b = reqPos(v.bill, "Bill");
    const t = reqNonNeg(v.tip, "Tip") / 100;
    const p = reqPos(v.people, "People");
    const tip = b * t;
    const total = b + tip;
    return [
      { label: "Tip", value: money(tip) },
      { label: "Total", value: money(total) },
      { label: "Per person", value: money(total / p), emphasize: true },
    ];
  },
};

const salary: CalcDef = {
  title: "Salary Calculator",
  description: "Convert between hourly, weekly, monthly, and annual pay.",
  fields: [
    { name: "amount", label: "Amount", suffix: "$", default: "25" },
    { name: "unit", label: "Pay frequency", type: "select", default: "hour",
      options: [
        { value: "hour", label: "Per hour" },
        { value: "week", label: "Per week" },
        { value: "biweek", label: "Bi-weekly" },
        { value: "month", label: "Per month" },
        { value: "year", label: "Per year" },
      ] },
    { name: "hpw", label: "Hours per week", default: "40" },
    { name: "wpy", label: "Weeks per year", default: "52" },
  ],
  compute: (v) => {
    const a = reqPos(v.amount, "Amount");
    const hpw = reqPos(v.hpw, "Hours per week");
    const wpy = reqPos(v.wpy, "Weeks per year");
    let annual = 0;
    switch (v.unit) {
      case "hour": annual = a * hpw * wpy; break;
      case "week": annual = a * wpy; break;
      case "biweek": annual = a * (wpy / 2); break;
      case "month": annual = a * 12; break;
      case "year": annual = a; break;
    }
    const totalHours = hpw * wpy;
    return [
      { label: "Annual", value: money(annual), emphasize: true },
      { label: "Monthly", value: money(annual / 12) },
      { label: "Bi-weekly", value: money(annual / (wpy / 2)) },
      { label: "Weekly", value: money(annual / wpy) },
      { label: "Daily (5-day)", value: money(annual / (wpy * 5)) },
      { label: "Hourly", value: money(annual / totalHours) },
    ];
  },
};

const downPayment: CalcDef = {
  title: "Down Payment Calculator",
  fields: [
    { name: "price", label: "Home price", suffix: "$", default: "300000" },
    { name: "pct", label: "Down payment", suffix: "%", default: "20" },
  ],
  compute: (v) => {
    const p = reqPos(v.price, "Price");
    const d = reqNonNeg(v.pct, "Percent") / 100;
    return [
      { label: "Down payment", value: money(p * d), emphasize: true },
      { label: "Loan needed", value: money(p * (1 - d)) },
    ];
  },
};

const savings: CalcDef = {
  title: "Savings Calculator",
  description: "Project savings growth with regular deposits.",
  fields: [
    { name: "start", label: "Starting balance", suffix: "$", default: "500" },
    { name: "monthly", label: "Monthly deposit", suffix: "$", default: "100" },
    { name: "rate", label: "APY", suffix: "%", default: "4" },
    { name: "years", label: "Years", default: "10" },
  ],
  compute: (v) => {
    const p = reqNonNeg(v.start, "Start");
    const m = reqNonNeg(v.monthly, "Deposit");
    const rY = reqNonNeg(v.rate, "APY") / 100;
    const rMo = Math.pow(1 + rY, 1 / 12) - 1;
    const t = reqPos(v.years, "Years");
    const N = t * 12;
    const fv = p * Math.pow(1 + rMo, N) + (rMo === 0 ? m * N : m * ((Math.pow(1 + rMo, N) - 1) / rMo));
    const contrib = p + m * N;
    return [
      { label: "Balance", value: money(fv), emphasize: true },
      { label: "Contributions", value: money(contrib) },
      { label: "Interest", value: money(fv - contrib) },
    ];
  },
};

const cd: CalcDef = {
  title: "CD Calculator",
  description: "Certificate of deposit maturity value.",
  fields: [
    { name: "p", label: "Deposit", suffix: "$", default: "5000" },
    { name: "apy", label: "APY", suffix: "%", default: "4.5" },
    { name: "months", label: "Term", suffix: "months", default: "12" },
  ],
  compute: (v) => {
    const p = reqPos(v.p, "Deposit");
    const r = reqNonNeg(v.apy, "APY") / 100;
    const m = reqPos(v.months, "Months");
    const fv = p * Math.pow(1 + r, m / 12);
    return [
      { label: "Maturity value", value: money(fv), emphasize: true },
      { label: "Interest earned", value: money(fv - p) },
    ];
  },
};

// ============================================================
// FITNESS & HEALTH
// ============================================================

const unitSystemField = {
  name: "units", label: "Units", type: "select" as const, default: "metric",
  options: [
    { value: "metric", label: "Metric (cm / kg)" },
    { value: "imperial", label: "Imperial (in / lb)" },
  ],
};

function heightMeters(units: string, height: number): number {
  return units === "metric" ? height / 100 : height * 0.0254;
}
function weightKg(units: string, w: number): number {
  return units === "metric" ? w : w * 0.45359237;
}

const bmi: CalcDef = {
  title: "BMI Calculator",
  description: "Body Mass Index for adults.",
  fields: [
    unitSystemField,
    { name: "height", label: "Height", suffix: "cm or in", default: "170" },
    { name: "weight", label: "Weight", suffix: "kg or lb", default: "70" },
  ],
  compute: (v) => {
    const h = heightMeters(v.units, reqPos(v.height, "Height"));
    const w = weightKg(v.units, reqPos(v.weight, "Weight"));
    const bmiV = w / (h * h);
    let cat = "Normal weight";
    if (bmiV < 18.5) cat = "Underweight";
    else if (bmiV < 25) cat = "Normal weight";
    else if (bmiV < 30) cat = "Overweight";
    else cat = "Obese";
    return [
      { label: "BMI", value: fmt(bmiV, 1), emphasize: true },
      { label: "Category", value: cat },
    ];
  },
};

const bmr: CalcDef = {
  title: "BMR Calculator",
  description: "Basal Metabolic Rate (Mifflin-St Jeor).",
  fields: [
    unitSystemField,
    { name: "sex", label: "Sex", type: "select", default: "male", options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
    { name: "age", label: "Age", suffix: "years", default: "30" },
    { name: "height", label: "Height", suffix: "cm or in", default: "170" },
    { name: "weight", label: "Weight", suffix: "kg or lb", default: "70" },
  ],
  compute: (v) => {
    const h = heightMeters(v.units, reqPos(v.height, "Height")) * 100; // cm
    const w = weightKg(v.units, reqPos(v.weight, "Weight"));
    const age = reqPos(v.age, "Age");
    const s = v.sex === "male" ? 5 : -161;
    const b = 10 * w + 6.25 * h - 5 * age + s;
    return [{ label: "BMR", value: fmt(b, 0) + " kcal/day", emphasize: true }];
  },
};

const tdee: CalcDef = {
  title: "TDEE Calculator",
  description: "Total Daily Energy Expenditure.",
  fields: [
    unitSystemField,
    { name: "sex", label: "Sex", type: "select", default: "male", options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
    { name: "age", label: "Age", suffix: "years", default: "30" },
    { name: "height", label: "Height", suffix: "cm or in", default: "170" },
    { name: "weight", label: "Weight", suffix: "kg or lb", default: "70" },
    { name: "activity", label: "Activity level", type: "select", default: "1.55",
      options: [
        { value: "1.2", label: "Sedentary" },
        { value: "1.375", label: "Lightly active" },
        { value: "1.55", label: "Moderately active" },
        { value: "1.725", label: "Very active" },
        { value: "1.9", label: "Extremely active" },
      ] },
  ],
  compute: (v) => {
    const h = heightMeters(v.units, reqPos(v.height, "Height")) * 100;
    const w = weightKg(v.units, reqPos(v.weight, "Weight"));
    const age = reqPos(v.age, "Age");
    const s = v.sex === "male" ? 5 : -161;
    const b = 10 * w + 6.25 * h - 5 * age + s;
    const act = reqPos(v.activity, "Activity");
    const t = b * act;
    return [
      { label: "TDEE", value: fmt(t, 0) + " kcal/day", emphasize: true },
      { label: "BMR", value: fmt(b, 0) + " kcal/day" },
      { label: "Maintain", value: fmt(t, 0) + " kcal" },
      { label: "Mild loss (−250)", value: fmt(t - 250, 0) + " kcal" },
      { label: "Loss (−500)", value: fmt(t - 500, 0) + " kcal" },
      { label: "Mild gain (+250)", value: fmt(t + 250, 0) + " kcal" },
    ];
  },
};

const calorie: CalcDef = { ...tdee, title: "Calorie Calculator", description: "Daily calorie needs based on activity." };

const bodyFat: CalcDef = {
  title: "Body Fat Calculator",
  description: "U.S. Navy method.",
  fields: [
    unitSystemField,
    { name: "sex", label: "Sex", type: "select", default: "male", options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
    { name: "height", label: "Height", suffix: "cm or in", default: "170" },
    { name: "neck", label: "Neck", suffix: "cm or in", default: "38" },
    { name: "waist", label: "Waist", suffix: "cm or in", default: "85" },
    { name: "hip", label: "Hip (women only)", suffix: "cm or in", default: "95" },
  ],
  compute: (v) => {
    const toCm = (n: number) => (v.units === "metric" ? n : n * 2.54);
    const h = toCm(reqPos(v.height, "Height"));
    const n = toCm(reqPos(v.neck, "Neck"));
    const w = toCm(reqPos(v.waist, "Waist"));
    let bf: number;
    if (v.sex === "male") {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      const hip = toCm(reqPos(v.hip, "Hip"));
      bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hip - n) + 0.221 * Math.log10(h)) - 450;
    }
    return [{ label: "Body fat", value: fmt(bf, 1) + "%", emphasize: true }];
  },
};

const idealWeight: CalcDef = {
  title: "Ideal Weight Calculator",
  description: "Devine formula.",
  fields: [
    unitSystemField,
    { name: "sex", label: "Sex", type: "select", default: "male", options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
    { name: "height", label: "Height", suffix: "cm or in", default: "170" },
  ],
  compute: (v) => {
    const hcm = v.units === "metric" ? reqPos(v.height, "Height") : reqPos(v.height, "Height") * 2.54;
    const inches = hcm / 2.54;
    const over60 = Math.max(0, inches - 60);
    const kg = v.sex === "male" ? 50 + 2.3 * over60 : 45.5 + 2.3 * over60;
    return [
      { label: "Ideal weight", value: fmt(kg, 1) + " kg", emphasize: true },
      { label: "In pounds", value: fmt(kg / 0.45359237, 1) + " lb" },
    ];
  },
};

const oneRepMax: CalcDef = {
  title: "One Rep Max Calculator",
  fields: [
    { name: "weight", label: "Weight lifted", default: "100" },
    { name: "reps", label: "Reps performed", default: "5" },
  ],
  compute: (v) => {
    const w = reqPos(v.weight, "Weight");
    const r = reqPos(v.reps, "Reps");
    if (r > 20) return { error: "Formula is less accurate above 20 reps." };
    const epley = w * (1 + r / 30);
    const brzycki = w * 36 / (37 - r);
    return [
      { label: "1RM (Epley)", value: fmt(epley, 1), emphasize: true },
      { label: "1RM (Brzycki)", value: fmt(brzycki, 1) },
    ];
  },
};

const targetHR: CalcDef = {
  title: "Target Heart Rate Calculator",
  fields: [
    { name: "age", label: "Age", default: "30" },
    { name: "resting", label: "Resting heart rate", suffix: "bpm (optional)", default: "" },
  ],
  compute: (v) => {
    const age = reqPos(v.age, "Age");
    const max = 220 - age;
    const rest = num(v.resting);
    if (Number.isFinite(rest) && rest > 0) {
      const zone = (pct: number) => Math.round((max - rest) * pct + rest);
      return [
        { label: "Max HR", value: `${max} bpm`, emphasize: true },
        { label: "50–60% (warmup)", value: `${zone(0.5)}–${zone(0.6)} bpm` },
        { label: "60–70% (fat burn)", value: `${zone(0.6)}–${zone(0.7)} bpm` },
        { label: "70–80% (aerobic)", value: `${zone(0.7)}–${zone(0.8)} bpm` },
        { label: "80–90% (anaerobic)", value: `${zone(0.8)}–${zone(0.9)} bpm` },
      ];
    }
    return [
      { label: "Max HR", value: `${max} bpm`, emphasize: true },
      { label: "50–85% target zone", value: `${Math.round(max * 0.5)}–${Math.round(max * 0.85)} bpm` },
    ];
  },
};

const dueDate: CalcDef = {
  title: "Due Date Calculator",
  description: "Estimated due date from last menstrual period (Naegele's rule).",
  fields: [
    { name: "lmp", label: "Last menstrual period", type: "text", placeholder: "YYYY-MM-DD" },
    { name: "cycle", label: "Cycle length", suffix: "days", default: "28" },
  ],
  compute: (v) => {
    if (!v.lmp) return { error: "Enter LMP date." };
    const d = new Date(v.lmp);
    if (isNaN(d.getTime())) return { error: "Invalid date." };
    const cyc = reqPos(v.cycle, "Cycle") - 28;
    const due = new Date(d);
    due.setDate(due.getDate() + 280 + cyc);
    return [
      { label: "Estimated due date", value: due.toDateString(), emphasize: true },
    ];
  },
};

const pace: CalcDef = {
  title: "Pace Calculator",
  fields: [
    { name: "dist", label: "Distance", default: "5" },
    { name: "unit", label: "Distance unit", type: "select", default: "km",
      options: [{ value: "km", label: "Kilometers" }, { value: "mi", label: "Miles" }] },
    { name: "time", label: "Time (hh:mm:ss)", type: "text", default: "0:25:00" },
  ],
  compute: (v) => {
    const d = reqPos(v.dist, "Distance");
    const parts = v.time.split(":").map((x) => Number(x));
    if (parts.some((n) => !Number.isFinite(n))) return { error: "Time must be hh:mm:ss." };
    let secs = 0;
    if (parts.length === 3) secs = parts[0] * 3600 + parts[1] * 60 + parts[2];
    else if (parts.length === 2) secs = parts[0] * 60 + parts[1];
    else return { error: "Time must be hh:mm:ss." };
    const paceSec = secs / d;
    const fmtT = (s: number) => {
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = Math.round(s % 60);
      return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
        : `${m}:${String(sec).padStart(2, "0")}`;
    };
    const kmToMi = 0.621371;
    const speedUnit = d / (secs / 3600);
    return [
      { label: `Pace per ${v.unit}`, value: fmtT(paceSec), emphasize: true },
      { label: "Speed", value: `${fmt(speedUnit, 2)} ${v.unit}/h` },
      { label: v.unit === "km" ? "Speed (mi/h)" : "Speed (km/h)",
        value: v.unit === "km" ? `${fmt(speedUnit * kmToMi, 2)} mi/h` : `${fmt(speedUnit / kmToMi, 2)} km/h` },
    ];
  },
};

// ============================================================
// MATH
// ============================================================

const percentage: CalcDef = {
  title: "Percentage Calculator",
  fields: [
    { name: "mode", label: "Mode", type: "select", default: "pctOf",
      options: [
        { value: "pctOf", label: "What is X% of Y?" },
        { value: "isWhat", label: "X is what % of Y?" },
        { value: "change", label: "% change from X to Y" },
      ] },
    { name: "a", label: "X", default: "20" },
    { name: "b", label: "Y", default: "150" },
  ],
  compute: (v) => {
    const a = req(v.a, "X");
    const b = req(v.b, "Y");
    switch (v.mode) {
      case "pctOf": return [{ label: `${a}% of ${b}`, value: fmt((a / 100) * b, 4), emphasize: true }];
      case "isWhat":
        if (b === 0) return { error: "Y cannot be zero." };
        return [{ label: `${a} is what % of ${b}`, value: fmt((a / b) * 100, 4) + "%", emphasize: true }];
      case "change":
        if (a === 0) return { error: "Starting value cannot be zero." };
        return [{ label: "% change", value: fmt(((b - a) / Math.abs(a)) * 100, 4) + "%", emphasize: true }];
    }
    return { error: "Unknown mode." };
  },
};

const percentError: CalcDef = {
  title: "Percent Error Calculator",
  fields: [
    { name: "obs", label: "Observed value", default: "" },
    { name: "actual", label: "Actual value", default: "" },
  ],
  compute: (v) => {
    const o = req(v.obs, "Observed");
    const a = req(v.actual, "Actual");
    if (a === 0) return { error: "Actual value cannot be zero." };
    return [{ label: "Percent error", value: fmt(Math.abs((o - a) / a) * 100, 4) + "%", emphasize: true }];
  },
};

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

const fraction: CalcDef = {
  title: "Fraction Calculator",
  description: "Add, subtract, multiply, or divide two fractions.",
  fields: [
    { name: "an", label: "Numerator 1", default: "1" },
    { name: "ad", label: "Denominator 1", default: "2" },
    { name: "op", label: "Operation", type: "select", default: "+",
      options: [{ value: "+", label: "+" }, { value: "-", label: "−" }, { value: "*", label: "×" }, { value: "/", label: "÷" }] },
    { name: "bn", label: "Numerator 2", default: "1" },
    { name: "bd", label: "Denominator 2", default: "3" },
  ],
  compute: (v) => {
    const an = Math.trunc(req(v.an, "N1"));
    const ad = Math.trunc(req(v.ad, "D1"));
    const bn = Math.trunc(req(v.bn, "N2"));
    const bd = Math.trunc(req(v.bd, "D2"));
    if (ad === 0 || bd === 0) return { error: "Denominators cannot be zero." };
    let n = 0, d = 1;
    switch (v.op) {
      case "+": n = an * bd + bn * ad; d = ad * bd; break;
      case "-": n = an * bd - bn * ad; d = ad * bd; break;
      case "*": n = an * bn; d = ad * bd; break;
      case "/":
        if (bn === 0) return { error: "Cannot divide by zero." };
        n = an * bd; d = ad * bn; break;
    }
    const g = gcd(n, d) || 1;
    n /= g; d /= g;
    if (d < 0) { n = -n; d = -d; }
    return [
      { label: "Result", value: `${n}/${d}`, emphasize: true },
      { label: "Decimal", value: fmt(n / d, 6) },
    ];
  },
};

const lcmCalc: CalcDef = {
  title: "Least Common Multiple Calculator",
  fields: [{ name: "nums", label: "Numbers (comma-separated)", type: "text", default: "12, 18, 24" }],
  compute: (v) => {
    const arr = v.nums.split(/[,\s]+/).map(Number).filter((n) => Number.isFinite(n) && n > 0).map((n) => Math.trunc(n));
    if (arr.length < 2) return { error: "Enter at least two positive integers." };
    const l = arr.reduce((a, b) => (a * b) / gcd(a, b));
    return [{ label: "LCM", value: String(l), emphasize: true }];
  },
};

const gcfCalc: CalcDef = {
  title: "Greatest Common Factor Calculator",
  fields: [{ name: "nums", label: "Numbers (comma-separated)", type: "text", default: "48, 60, 72" }],
  compute: (v) => {
    const arr = v.nums.split(/[,\s]+/).map(Number).filter((n) => Number.isFinite(n) && n > 0).map((n) => Math.trunc(n));
    if (arr.length < 2) return { error: "Enter at least two positive integers." };
    const g = arr.reduce(gcd);
    return [{ label: "GCF", value: String(g), emphasize: true }];
  },
};

const exponent: CalcDef = {
  title: "Exponent Calculator",
  fields: [
    { name: "base", label: "Base", default: "2" },
    { name: "exp", label: "Exponent", default: "10" },
  ],
  compute: (v) => [{ label: "Result", value: fmt(Math.pow(req(v.base, "Base"), req(v.exp, "Exponent")), 6), emphasize: true }],
};

const logCalc: CalcDef = {
  title: "Logarithm Calculator",
  fields: [
    { name: "x", label: "Value (x)", default: "1000" },
    { name: "base", label: "Base", default: "10" },
  ],
  compute: (v) => {
    const x = reqPos(v.x, "x");
    const b = reqPos(v.base, "Base");
    if (b === 1) return { error: "Base cannot be 1." };
    return [{ label: `log_${b}(${x})`, value: fmt(Math.log(x) / Math.log(b), 6), emphasize: true }];
  },
};

const rootCalc: CalcDef = {
  title: "Root Calculator",
  fields: [
    { name: "x", label: "Value (x)", default: "27" },
    { name: "n", label: "nth root", default: "3" },
  ],
  compute: (v) => {
    const x = req(v.x, "x");
    const n = reqPos(v.n, "n");
    if (x < 0 && Math.trunc(n) % 2 === 0) return { error: "Even root of negative number is not real." };
    const r = x < 0 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n);
    return [{ label: `${n}√${x}`, value: fmt(r, 6), emphasize: true }];
  },
};

const ratio: CalcDef = {
  title: "Ratio Calculator",
  description: "Solve A:B = C:D for the missing term.",
  fields: [
    { name: "a", label: "A", default: "3" },
    { name: "b", label: "B", default: "4" },
    { name: "c", label: "C", default: "9" },
    { name: "d", label: "D (leave blank to solve)", default: "" },
  ],
  compute: (v) => {
    const a = num(v.a), b = num(v.b), c = num(v.c), d = num(v.d);
    const known = [a, b, c, d].filter((x) => Number.isFinite(x)).length;
    if (known !== 3) return { error: "Fill exactly three of A, B, C, D." };
    let out = "";
    if (!Number.isFinite(a)) out = `A = ${fmt((b * c) / d, 6)}`;
    else if (!Number.isFinite(b)) out = `B = ${fmt((a * d) / c, 6)}`;
    else if (!Number.isFinite(c)) out = `C = ${fmt((a * d) / b, 6)}`;
    else out = `D = ${fmt((b * c) / a, 6)}`;
    return [{ label: "Solved", value: out, emphasize: true }];
  },
};

const rounding: CalcDef = {
  title: "Rounding Calculator",
  fields: [
    { name: "x", label: "Number", default: "3.14159" },
    { name: "digits", label: "Decimal places", default: "2" },
  ],
  compute: (v) => {
    const x = req(v.x, "Number");
    const d = Math.max(0, Math.trunc(req(v.digits, "Digits")));
    const mult = Math.pow(10, d);
    return [
      { label: "Rounded", value: (Math.round(x * mult) / mult).toFixed(d), emphasize: true },
      { label: "Floor", value: (Math.floor(x * mult) / mult).toFixed(d) },
      { label: "Ceiling", value: (Math.ceil(x * mult) / mult).toFixed(d) },
    ];
  },
};

const quadratic: CalcDef = {
  title: "Quadratic Formula Calculator",
  description: "Solve ax² + bx + c = 0.",
  fields: [
    { name: "a", label: "a", default: "1" },
    { name: "b", label: "b", default: "-3" },
    { name: "c", label: "c", default: "2" },
  ],
  compute: (v) => {
    const a = req(v.a, "a");
    const b = req(v.b, "b");
    const c = req(v.c, "c");
    if (a === 0) return { error: "a cannot be zero." };
    const disc = b * b - 4 * a * c;
    if (disc < 0) {
      const re = -b / (2 * a);
      const im = Math.sqrt(-disc) / (2 * a);
      return [
        { label: "x₁", value: `${fmt(re, 4)} + ${fmt(im, 4)}i`, emphasize: true },
        { label: "x₂", value: `${fmt(re, 4)} − ${fmt(im, 4)}i` },
        { label: "Discriminant", value: fmt(disc, 4) },
      ];
    }
    const s = Math.sqrt(disc);
    return [
      { label: "x₁", value: fmt((-b + s) / (2 * a), 6), emphasize: true },
      { label: "x₂", value: fmt((-b - s) / (2 * a), 6) },
      { label: "Discriminant", value: fmt(disc, 4) },
    ];
  },
};

const randomNumber: CalcDef = {
  title: "Random Number Generator",
  fields: [
    { name: "min", label: "Min", default: "1" },
    { name: "max", label: "Max", default: "100" },
    { name: "count", label: "How many", default: "1" },
    { name: "int", label: "Integers only", type: "select", default: "yes",
      options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No (decimals)" }] },
  ],
  compute: (v) => {
    const min = req(v.min, "Min");
    const max = req(v.max, "Max");
    const c = Math.min(1000, Math.max(1, Math.trunc(req(v.count, "Count"))));
    if (max <= min) return { error: "Max must be greater than Min." };
    const nums: number[] = [];
    for (let i = 0; i < c; i++) {
      const r = Math.random() * (max - min) + min;
      nums.push(v.int === "yes" ? Math.floor(r) + (Math.random() < (r - Math.floor(r)) ? 1 : 0) : r);
    }
    return [{ label: "Random", value: nums.map((n) => v.int === "yes" ? String(Math.trunc(n)) : fmt(n, 4)).join(", "), emphasize: true }];
  },
};

const binary: CalcDef = {
  title: "Binary Calculator",
  description: "Convert between decimal and binary.",
  fields: [{ name: "x", label: "Number (decimal or 0b binary)", type: "text", default: "42" }],
  compute: (v) => {
    const s = v.x.trim();
    let dec: number;
    if (/^0b[01]+$/i.test(s)) dec = parseInt(s.slice(2), 2);
    else if (/^[01]+$/.test(s) && s.length > 1 && s[0] === "0") dec = parseInt(s, 2);
    else dec = Number(s);
    if (!Number.isFinite(dec)) return { error: "Invalid input." };
    return [
      { label: "Decimal", value: String(Math.trunc(dec)), emphasize: true },
      { label: "Binary", value: Math.trunc(dec).toString(2) },
      { label: "Hex", value: "0x" + Math.trunc(dec).toString(16).toUpperCase() },
      { label: "Octal", value: "0o" + Math.trunc(dec).toString(8) },
    ];
  },
};

const hexCalc: CalcDef = {
  title: "Hex Calculator",
  fields: [{ name: "x", label: "Number (decimal or 0x hex)", type: "text", default: "FF" }],
  compute: (v) => {
    const s = v.x.trim();
    let dec: number;
    if (/^0x[0-9a-f]+$/i.test(s)) dec = parseInt(s.slice(2), 16);
    else if (/^[0-9a-f]+$/i.test(s) && /[a-f]/i.test(s)) dec = parseInt(s, 16);
    else dec = Number(s);
    if (!Number.isFinite(dec)) return { error: "Invalid input." };
    dec = Math.trunc(dec);
    return [
      { label: "Decimal", value: String(dec), emphasize: true },
      { label: "Hex", value: dec.toString(16).toUpperCase() },
      { label: "Binary", value: dec.toString(2) },
    ];
  },
};

const halfLife: CalcDef = {
  title: "Half-Life Calculator",
  description: "N(t) = N₀ · (1/2)^(t/T)",
  fields: [
    { name: "n0", label: "Initial quantity", default: "100" },
    { name: "t", label: "Elapsed time", default: "10" },
    { name: "h", label: "Half-life", default: "5" },
  ],
  compute: (v) => {
    const n0 = reqPos(v.n0, "N₀");
    const t = reqNonNeg(v.t, "t");
    const h = reqPos(v.h, "Half-life");
    const n = n0 * Math.pow(0.5, t / h);
    return [
      { label: "Remaining", value: fmt(n, 4), emphasize: true },
      { label: "Fraction remaining", value: fmt(n / n0, 6) },
    ];
  },
};

// Statistics
const meanMedianMode: CalcDef = {
  title: "Mean, Median, Mode & Range Calculator",
  fields: [{ name: "nums", label: "Numbers (comma-separated)", type: "text", default: "3, 5, 5, 7, 9, 11" }],
  compute: (v) => {
    const arr = v.nums.split(/[,\s]+/).map(Number).filter((n) => Number.isFinite(n));
    if (arr.length === 0) return { error: "Enter at least one number." };
    const sorted = [...arr].sort((a, b) => a - b);
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const counts: Record<number, number> = {};
    arr.forEach((n) => (counts[n] = (counts[n] || 0) + 1));
    const maxC = Math.max(...Object.values(counts));
    const modes = Object.entries(counts).filter(([, c]) => c === maxC && maxC > 1).map(([n]) => n);
    return [
      { label: "Mean", value: fmt(mean, 4), emphasize: true },
      { label: "Median", value: fmt(median, 4) },
      { label: "Mode", value: modes.length ? modes.join(", ") : "None" },
      { label: "Range", value: fmt(sorted[sorted.length - 1] - sorted[0], 4) },
      { label: "Count", value: String(arr.length) },
      { label: "Sum", value: fmt(arr.reduce((a, b) => a + b, 0), 4) },
    ];
  },
};

const stdDev: CalcDef = {
  title: "Standard Deviation Calculator",
  fields: [
    { name: "nums", label: "Numbers (comma-separated)", type: "text", default: "10, 12, 23, 23, 16, 23, 21, 16" },
    { name: "kind", label: "Type", type: "select", default: "sample",
      options: [{ value: "sample", label: "Sample" }, { value: "pop", label: "Population" }] },
  ],
  compute: (v) => {
    const arr = v.nums.split(/[,\s]+/).map(Number).filter((n) => Number.isFinite(n));
    if (arr.length < 2) return { error: "Enter at least two numbers." };
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const sq = arr.reduce((a, b) => a + (b - mean) ** 2, 0);
    const denom = v.kind === "sample" ? arr.length - 1 : arr.length;
    const variance = sq / denom;
    return [
      { label: "Standard deviation", value: fmt(Math.sqrt(variance), 6), emphasize: true },
      { label: "Variance", value: fmt(variance, 6) },
      { label: "Mean", value: fmt(mean, 6) },
      { label: "Count", value: String(arr.length) },
    ];
  },
};

const zScore: CalcDef = {
  title: "Z-Score Calculator",
  fields: [
    { name: "x", label: "Raw value (x)", default: "85" },
    { name: "mu", label: "Mean (μ)", default: "70" },
    { name: "sd", label: "Standard deviation (σ)", default: "10" },
  ],
  compute: (v) => {
    const x = req(v.x, "x"); const mu = req(v.mu, "μ"); const sd = reqPos(v.sd, "σ");
    return [{ label: "z-score", value: fmt((x - mu) / sd, 4), emphasize: true }];
  },
};

function factorial(n: number): number {
  let r = 1; for (let i = 2; i <= n; i++) r *= i; return r;
}

const permComb: CalcDef = {
  title: "Permutation and Combination Calculator",
  fields: [
    { name: "n", label: "n", default: "10" },
    { name: "r", label: "r", default: "3" },
  ],
  compute: (v) => {
    const n = Math.trunc(reqNonNeg(v.n, "n"));
    const r = Math.trunc(reqNonNeg(v.r, "r"));
    if (r > n) return { error: "r cannot exceed n." };
    if (n > 170) return { error: "n too large." };
    const nP = factorial(n) / factorial(n - r);
    const nC = nP / factorial(r);
    return [
      { label: "Permutations P(n,r)", value: fmt(nP, 0), emphasize: true },
      { label: "Combinations C(n,r)", value: fmt(nC, 0) },
    ];
  },
};

// Geometry
const circle: CalcDef = {
  title: "Circle Calculator",
  fields: [
    { name: "r", label: "Radius", default: "5" },
  ],
  compute: (v) => {
    const r = reqPos(v.r, "Radius");
    return [
      { label: "Area", value: fmt(Math.PI * r * r, 4), emphasize: true },
      { label: "Circumference", value: fmt(2 * Math.PI * r, 4) },
      { label: "Diameter", value: fmt(2 * r, 4) },
    ];
  },
};

const rightTriangle: CalcDef = {
  title: "Right Triangle Calculator",
  description: "Give any two of the three sides.",
  fields: [
    { name: "a", label: "Leg a", default: "3" },
    { name: "b", label: "Leg b", default: "4" },
    { name: "c", label: "Hypotenuse c (leave blank to solve)", default: "" },
  ],
  compute: (v) => {
    const a = num(v.a), b = num(v.b), c = num(v.c);
    const provided = [a, b, c].filter(Number.isFinite).length;
    if (provided !== 2) return { error: "Provide exactly two sides." };
    let A = a, B = b, C = c;
    if (!Number.isFinite(C)) C = Math.sqrt(A * A + B * B);
    else if (!Number.isFinite(A)) {
      if (C <= B) return { error: "Hypotenuse must exceed leg." };
      A = Math.sqrt(C * C - B * B);
    } else if (!Number.isFinite(B)) {
      if (C <= A) return { error: "Hypotenuse must exceed leg." };
      B = Math.sqrt(C * C - A * A);
    }
    const area = 0.5 * A * B;
    const perimeter = A + B + C;
    return [
      { label: "Leg a", value: fmt(A, 4) },
      { label: "Leg b", value: fmt(B, 4) },
      { label: "Hypotenuse c", value: fmt(C, 4), emphasize: true },
      { label: "Area", value: fmt(area, 4) },
      { label: "Perimeter", value: fmt(perimeter, 4) },
      { label: "Angle A", value: fmt((Math.atan2(A, B) * 180) / Math.PI, 2) + "°" },
      { label: "Angle B", value: fmt((Math.atan2(B, A) * 180) / Math.PI, 2) + "°" },
    ];
  },
};

const pythag: CalcDef = { ...rightTriangle, title: "Pythagorean Theorem Calculator" };

const triangle: CalcDef = {
  title: "Triangle Calculator",
  description: "Compute area and perimeter from three sides (Heron's formula).",
  fields: [
    { name: "a", label: "Side a", default: "5" },
    { name: "b", label: "Side b", default: "6" },
    { name: "c", label: "Side c", default: "7" },
  ],
  compute: (v) => {
    const a = reqPos(v.a, "a"); const b = reqPos(v.b, "b"); const c = reqPos(v.c, "c");
    if (a + b <= c || a + c <= b || b + c <= a) return { error: "Invalid triangle (triangle inequality)." };
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    return [
      { label: "Area", value: fmt(area, 4), emphasize: true },
      { label: "Perimeter", value: fmt(a + b + c, 4) },
      { label: "Semi-perimeter", value: fmt(s, 4) },
    ];
  },
};

const areaCalc: CalcDef = {
  title: "Area Calculator",
  fields: [
    { name: "shape", label: "Shape", type: "select", default: "rect",
      options: [
        { value: "rect", label: "Rectangle" },
        { value: "tri", label: "Triangle (base × height)" },
        { value: "circle", label: "Circle" },
        { value: "trap", label: "Trapezoid" },
      ] },
    { name: "a", label: "Value A", default: "5" },
    { name: "b", label: "Value B (if needed)", default: "3" },
    { name: "c", label: "Value C (trapezoid: parallel side 2)", default: "" },
  ],
  compute: (v) => {
    const a = reqPos(v.a, "A");
    switch (v.shape) {
      case "rect": {
        const b = reqPos(v.b, "B");
        return [{ label: "Area", value: fmt(a * b, 4), emphasize: true }];
      }
      case "tri": {
        const b = reqPos(v.b, "B");
        return [{ label: "Area", value: fmt(0.5 * a * b, 4), emphasize: true }];
      }
      case "circle":
        return [{ label: "Area", value: fmt(Math.PI * a * a, 4), emphasize: true }];
      case "trap": {
        const b = reqPos(v.b, "B (parallel 1)");
        const c = reqPos(v.c, "C (parallel 2)");
        return [{ label: "Area", value: fmt(0.5 * (b + c) * a, 4), emphasize: true }];
      }
    }
    return { error: "Choose a shape." };
  },
};

const volumeCalc: CalcDef = {
  title: "Volume Calculator",
  fields: [
    { name: "shape", label: "Shape", type: "select", default: "box",
      options: [
        { value: "box", label: "Rectangular box" },
        { value: "sphere", label: "Sphere" },
        { value: "cyl", label: "Cylinder" },
        { value: "cone", label: "Cone" },
      ] },
    { name: "a", label: "Dim A", default: "3" },
    { name: "b", label: "Dim B", default: "4" },
    { name: "c", label: "Dim C", default: "5" },
  ],
  compute: (v) => {
    const a = reqPos(v.a, "A");
    switch (v.shape) {
      case "box": {
        const b = reqPos(v.b, "B"); const c = reqPos(v.c, "C");
        return [{ label: "Volume", value: fmt(a * b * c, 4), emphasize: true }];
      }
      case "sphere":
        return [{ label: "Volume", value: fmt((4 / 3) * Math.PI * a ** 3, 4), emphasize: true }];
      case "cyl": {
        const h = reqPos(v.b, "Height");
        return [{ label: "Volume", value: fmt(Math.PI * a * a * h, 4), emphasize: true }];
      }
      case "cone": {
        const h = reqPos(v.b, "Height");
        return [{ label: "Volume", value: fmt((Math.PI * a * a * h) / 3, 4), emphasize: true }];
      }
    }
    return { error: "Choose a shape." };
  },
};

const slope: CalcDef = {
  title: "Slope Calculator",
  fields: [
    { name: "x1", label: "x₁", default: "1" },
    { name: "y1", label: "y₁", default: "2" },
    { name: "x2", label: "x₂", default: "4" },
    { name: "y2", label: "y₂", default: "8" },
  ],
  compute: (v) => {
    const x1 = req(v.x1, "x1"); const y1 = req(v.y1, "y1");
    const x2 = req(v.x2, "x2"); const y2 = req(v.y2, "y2");
    if (x1 === x2) return { error: "Vertical line — slope is undefined." };
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    return [
      { label: "Slope (m)", value: fmt(m, 6), emphasize: true },
      { label: "Y-intercept (b)", value: fmt(b, 6) },
      { label: "Equation", value: `y = ${fmt(m, 4)}x ${b >= 0 ? "+" : "−"} ${fmt(Math.abs(b), 4)}` },
      { label: "Distance", value: fmt(Math.hypot(x2 - x1, y2 - y1), 6) },
    ];
  },
};

const distance: CalcDef = {
  title: "Distance Calculator",
  fields: [
    { name: "x1", label: "x₁", default: "0" },
    { name: "y1", label: "y₁", default: "0" },
    { name: "x2", label: "x₂", default: "3" },
    { name: "y2", label: "y₂", default: "4" },
  ],
  compute: (v) => [{
    label: "Distance",
    value: fmt(Math.hypot(req(v.x2, "x2") - req(v.x1, "x1"), req(v.y2, "y2") - req(v.y1, "y1")), 6),
    emphasize: true,
  }],
};

// ============================================================
// OTHER
// ============================================================

const ageCalc: CalcDef = {
  title: "Age Calculator",
  fields: [
    { name: "dob", label: "Date of birth", type: "text", placeholder: "YYYY-MM-DD" },
    { name: "on", label: "Age on date (leave blank = today)", type: "text", placeholder: "YYYY-MM-DD" },
  ],
  compute: (v) => {
    if (!v.dob) return { error: "Enter date of birth." };
    const dob = new Date(v.dob);
    const to = v.on ? new Date(v.on) : new Date();
    if (isNaN(dob.getTime()) || isNaN(to.getTime())) return { error: "Invalid date." };
    if (to < dob) return { error: "Target date is before date of birth." };
    let years = to.getFullYear() - dob.getFullYear();
    let months = to.getMonth() - dob.getMonth();
    let days = to.getDate() - dob.getDate();
    if (days < 0) { months--; const prev = new Date(to.getFullYear(), to.getMonth(), 0); days += prev.getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalMs = to.getTime() - dob.getTime();
    const totalDays = Math.floor(totalMs / 86400000);
    return [
      { label: "Age", value: `${years}y ${months}m ${days}d`, emphasize: true },
      { label: "Total months", value: String(years * 12 + months) },
      { label: "Total weeks", value: String(Math.floor(totalDays / 7)) },
      { label: "Total days", value: String(totalDays) },
    ];
  },
};

const dateDiff: CalcDef = {
  title: "Date Calculator",
  description: "Days between two dates.",
  fields: [
    { name: "from", label: "Start date", type: "text", placeholder: "YYYY-MM-DD" },
    { name: "to", label: "End date", type: "text", placeholder: "YYYY-MM-DD" },
  ],
  compute: (v) => {
    const a = new Date(v.from); const b = new Date(v.to);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return { error: "Invalid date." };
    const days = Math.round((b.getTime() - a.getTime()) / 86400000);
    return [
      { label: "Days between", value: String(days), emphasize: true },
      { label: "Weeks", value: fmt(days / 7, 2) },
      { label: "Years", value: fmt(days / 365.25, 3) },
    ];
  },
};

const dayOfWeek: CalcDef = {
  title: "Day of the Week Calculator",
  fields: [{ name: "d", label: "Date", type: "text", placeholder: "YYYY-MM-DD" }],
  compute: (v) => {
    const d = new Date(v.d);
    if (isNaN(d.getTime())) return { error: "Invalid date." };
    return [{ label: "Day", value: d.toLocaleDateString(undefined, { weekday: "long" }), emphasize: true }];
  },
};

const timeDuration: CalcDef = {
  title: "Time Duration Calculator",
  fields: [
    { name: "a", label: "Start (hh:mm:ss)", type: "text", default: "9:00:00" },
    { name: "b", label: "End (hh:mm:ss)", type: "text", default: "17:30:00" },
  ],
  compute: (v) => {
    const parse = (s: string) => {
      const p = s.split(":").map(Number);
      if (p.some((x) => !Number.isFinite(x))) return NaN;
      if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2];
      if (p.length === 2) return p[0] * 3600 + p[1] * 60;
      return NaN;
    };
    const A = parse(v.a); const B = parse(v.b);
    if (!Number.isFinite(A) || !Number.isFinite(B)) return { error: "Invalid time format." };
    let d = B - A;
    if (d < 0) d += 24 * 3600;
    const h = Math.floor(d / 3600); const m = Math.floor((d % 3600) / 60); const s = d % 60;
    return [
      { label: "Duration", value: `${h}h ${m}m ${s}s`, emphasize: true },
      { label: "Total minutes", value: fmt(d / 60, 2) },
      { label: "Total hours", value: fmt(d / 3600, 4) },
    ];
  },
};

const gpaCalc: CalcDef = {
  title: "GPA Calculator",
  description: "Enter courses as: name, grade, credits (one per line). Grade may be a letter or 0–4 number.",
  fields: [
    { name: "courses", label: "Courses", type: "text",
      default: "Math, A, 3\nEnglish, B+, 3\nHistory, B, 3\nScience, A-, 4" },
  ],
  compute: (v) => {
    const scale: Record<string, number> = {
      "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "D-": 0.7, "F": 0,
    };
    let pts = 0, cr = 0;
    for (const line of v.courses.split(/\n/)) {
      const parts = line.split(",").map((s) => s.trim());
      if (parts.length < 3) continue;
      const g = parts[1].toUpperCase();
      const gp = scale[g] ?? Number(g);
      const c = Number(parts[2]);
      if (!Number.isFinite(gp) || !Number.isFinite(c) || c <= 0) continue;
      pts += gp * c; cr += c;
    }
    if (cr === 0) return { error: "Add at least one valid course." };
    return [
      { label: "GPA", value: fmt(pts / cr, 3), emphasize: true },
      { label: "Total credits", value: String(cr) },
    ];
  },
};

const gradeCalc: CalcDef = {
  title: "Grade Calculator",
  description: "Enter assignments as: name, score, weight (one per line). Weights should sum to 100.",
  fields: [
    { name: "items", label: "Assignments", type: "text",
      default: "Homework, 92, 20\nMidterm, 85, 30\nFinal, 88, 50" },
  ],
  compute: (v) => {
    let total = 0, weight = 0;
    for (const line of v.items.split(/\n/)) {
      const parts = line.split(",").map((s) => s.trim());
      if (parts.length < 3) continue;
      const s = Number(parts[1]); const w = Number(parts[2]);
      if (!Number.isFinite(s) || !Number.isFinite(w)) continue;
      total += s * w; weight += w;
    }
    if (weight === 0) return { error: "Add valid entries." };
    const g = total / weight;
    const letter = g >= 93 ? "A" : g >= 90 ? "A-" : g >= 87 ? "B+" : g >= 83 ? "B" : g >= 80 ? "B-"
      : g >= 77 ? "C+" : g >= 73 ? "C" : g >= 70 ? "C-" : g >= 67 ? "D+" : g >= 60 ? "D" : "F";
    return [
      { label: "Weighted grade", value: fmt(g, 2) + "%", emphasize: true },
      { label: "Letter", value: letter },
      { label: "Total weight", value: String(weight) },
    ];
  },
};

const fuelCost: CalcDef = {
  title: "Fuel Cost Calculator",
  fields: [
    { name: "dist", label: "Trip distance", default: "300" },
    { name: "mpg", label: "Fuel efficiency (mpg or km/L)", default: "28" },
    { name: "price", label: "Fuel price per gallon or liter", default: "3.5" },
  ],
  compute: (v) => {
    const d = reqPos(v.dist, "Distance");
    const mpg = reqPos(v.mpg, "Efficiency");
    const p = reqPos(v.price, "Price");
    const fuel = d / mpg;
    return [
      { label: "Fuel needed", value: fmt(fuel, 2), emphasize: false },
      { label: "Total cost", value: money(fuel * p), emphasize: true },
    ];
  },
};

const gasMileage: CalcDef = {
  title: "Gas Mileage Calculator",
  fields: [
    { name: "miles", label: "Miles driven", default: "300" },
    { name: "gallons", label: "Gallons used", default: "10" },
  ],
  compute: (v) => {
    const m = reqPos(v.miles, "Miles");
    const g = reqPos(v.gallons, "Gallons");
    const mpg = m / g;
    return [
      { label: "MPG", value: fmt(mpg, 2), emphasize: true },
      { label: "L/100km", value: fmt(235.215 / mpg, 2) },
      { label: "km/L", value: fmt(mpg * 0.425144, 2) },
    ];
  },
};

const passwordGen: CalcDef = {
  title: "Password Generator",
  fields: [
    { name: "len", label: "Length", default: "16" },
    { name: "upper", label: "Uppercase", type: "select", default: "yes", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }] },
    { name: "digits", label: "Digits", type: "select", default: "yes", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }] },
    { name: "sym", label: "Symbols", type: "select", default: "yes", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }] },
  ],
  compute: (v) => {
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    if (v.upper === "yes") alphabet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (v.digits === "yes") alphabet += "0123456789";
    if (v.sym === "yes") alphabet += "!@#$%^&*()-_=+[]{};:,.?/";
    const len = Math.min(128, Math.max(4, Math.trunc(reqPos(v.len, "Length"))));
    let out = "";
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const arr = new Uint32Array(len);
      crypto.getRandomValues(arr);
      for (let i = 0; i < len; i++) out += alphabet[arr[i] % alphabet.length];
    } else {
      for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return [{ label: "Password", value: out, emphasize: true }];
  },
};

const base64Calc: CalcDef = {
  title: "Base64 Encode/Decode",
  fields: [
    { name: "mode", label: "Mode", type: "select", default: "encode",
      options: [{ value: "encode", label: "Encode" }, { value: "decode", label: "Decode" }] },
    { name: "text", label: "Text", type: "text", default: "Hello, World!" },
  ],
  compute: (v) => {
    try {
      if (v.mode === "encode") return [{ label: "Encoded", value: btoa(unescape(encodeURIComponent(v.text))), emphasize: true }];
      return [{ label: "Decoded", value: decodeURIComponent(escape(atob(v.text))), emphasize: true }];
    } catch {
      return { error: "Invalid input for the selected mode." };
    }
  },
};

const urlCalc: CalcDef = {
  title: "URL Encode/Decode",
  fields: [
    { name: "mode", label: "Mode", type: "select", default: "encode",
      options: [{ value: "encode", label: "Encode" }, { value: "decode", label: "Decode" }] },
    { name: "text", label: "Text", type: "text", default: "hello world & friends" },
  ],
  compute: (v) => {
    try {
      return [{ label: v.mode === "encode" ? "Encoded" : "Decoded",
        value: v.mode === "encode" ? encodeURIComponent(v.text) : decodeURIComponent(v.text),
        emphasize: true }];
    } catch { return { error: "Invalid input." }; }
  },
};

const romanCalc: CalcDef = {
  title: "Roman Numeral Converter",
  fields: [{ name: "x", label: "Number or Roman numeral", type: "text", default: "MMXXIV" }],
  compute: (v) => {
    const s = v.x.trim();
    if (/^\d+$/.test(s)) {
      let n = Number(s);
      if (n < 1 || n > 3999) return { error: "Range 1–3999." };
      const map: Array<[number, string]> = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
      let out = "";
      for (const [val, sym] of map) while (n >= val) { out += sym; n -= val; }
      return [{ label: "Roman", value: out, emphasize: true }];
    }
    const R: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    const upper = s.toUpperCase();
    if (!/^[IVXLCDM]+$/.test(upper)) return { error: "Invalid input." };
    let total = 0;
    for (let i = 0; i < upper.length; i++) {
      const v1 = R[upper[i]]; const v2 = R[upper[i + 1]];
      if (v2 && v1 < v2) { total += v2 - v1; i++; } else total += v1;
    }
    return [{ label: "Decimal", value: String(total), emphasize: true }];
  },
};

const diceRoll: CalcDef = {
  title: "Dice Roller",
  fields: [
    { name: "sides", label: "Sides per die", default: "6" },
    { name: "count", label: "Number of dice", default: "2" },
  ],
  compute: (v) => {
    const s = Math.trunc(reqPos(v.sides, "Sides"));
    const c = Math.min(100, Math.trunc(reqPos(v.count, "Count")));
    const rolls: number[] = [];
    for (let i = 0; i < c; i++) rolls.push(1 + Math.floor(Math.random() * s));
    return [
      { label: "Rolls", value: rolls.join(", ") },
      { label: "Total", value: String(rolls.reduce((a, b) => a + b, 0)), emphasize: true },
    ];
  },
};

const loveCalc: CalcDef = {
  title: "Love Calculator",
  description: "Just for fun — a deterministic score based on the two names.",
  fields: [
    { name: "a", label: "Name 1", type: "text", default: "Alex" },
    { name: "b", label: "Name 2", type: "text", default: "Jordan" },
  ],
  compute: (v) => {
    const s = (v.a + "+" + v.b).toLowerCase();
    let hash = 0;
    for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    const pct = hash % 101;
    return [{ label: "Love score", value: pct + "%", emphasize: true }];
  },
};

const windChill: CalcDef = {
  title: "Wind Chill Calculator",
  fields: [
    { name: "t", label: "Temperature (°F)", default: "20" },
    { name: "v", label: "Wind speed (mph)", default: "15" },
  ],
  compute: (v) => {
    const T = req(v.t, "Temperature");
    const V = reqPos(v.v, "Wind speed");
    if (T > 50) return { error: "Wind chill only valid at ≤ 50°F." };
    if (V < 3) return { error: "Wind chill formula requires wind ≥ 3 mph." };
    const wc = 35.74 + 0.6215 * T - 35.75 * Math.pow(V, 0.16) + 0.4275 * T * Math.pow(V, 0.16);
    return [{ label: "Wind chill", value: fmt(wc, 1) + " °F", emphasize: true }];
  },
};

const heatIndex: CalcDef = {
  title: "Heat Index Calculator",
  fields: [
    { name: "t", label: "Temperature (°F)", default: "90" },
    { name: "rh", label: "Relative humidity (%)", default: "60" },
  ],
  compute: (v) => {
    const T = req(v.t, "Temperature");
    const R = req(v.rh, "Humidity");
    if (T < 80) return { error: "Heat index applies at ≥ 80°F." };
    const HI = -42.379 + 2.04901523 * T + 10.14333127 * R - 0.22475541 * T * R
      - 6.83783e-3 * T * T - 5.481717e-2 * R * R + 1.22874e-3 * T * T * R
      + 8.5282e-4 * T * R * R - 1.99e-6 * T * T * R * R;
    return [{ label: "Heat index", value: fmt(HI, 1) + " °F", emphasize: true }];
  },
};

const dewPoint: CalcDef = {
  title: "Dew Point Calculator",
  fields: [
    { name: "t", label: "Temperature (°C)", default: "25" },
    { name: "rh", label: "Relative humidity (%)", default: "60" },
  ],
  compute: (v) => {
    const T = req(v.t, "Temperature");
    const R = reqPos(v.rh, "Humidity");
    const a = 17.625, b = 243.04;
    const alpha = Math.log(R / 100) + (a * T) / (b + T);
    const dp = (b * alpha) / (a - alpha);
    return [{ label: "Dew point", value: fmt(dp, 1) + " °C", emphasize: true }];
  },
};

const ohmsLaw: CalcDef = {
  title: "Ohm's Law Calculator",
  description: "Fill any two of V, I, R.",
  fields: [
    { name: "V", label: "Voltage (V)", default: "" },
    { name: "I", label: "Current (A)", default: "" },
    { name: "R", label: "Resistance (Ω)", default: "" },
  ],
  compute: (v) => {
    let V = num(v.V), I = num(v.I), R = num(v.R);
    const provided = [V, I, R].filter(Number.isFinite).length;
    if (provided < 2) return { error: "Enter any two of V, I, R." };
    if (!Number.isFinite(V)) V = I * R;
    else if (!Number.isFinite(I)) I = V / R;
    else if (!Number.isFinite(R)) R = V / I;
    const P = V * I;
    return [
      { label: "Voltage V", value: fmt(V, 4) + " V" },
      { label: "Current I", value: fmt(I, 4) + " A" },
      { label: "Resistance R", value: fmt(R, 4) + " Ω" },
      { label: "Power P", value: fmt(P, 4) + " W", emphasize: true },
    ];
  },
};

const speed: CalcDef = {
  title: "Speed Calculator",
  description: "Fill any two of distance, time, speed.",
  fields: [
    { name: "d", label: "Distance", default: "" },
    { name: "t", label: "Time (hours)", default: "" },
    { name: "s", label: "Speed (per hour)", default: "" },
  ],
  compute: (v) => {
    let d = num(v.d), t = num(v.t), s = num(v.s);
    if ([d, t, s].filter(Number.isFinite).length < 2) return { error: "Enter any two values." };
    if (!Number.isFinite(d)) d = s * t;
    else if (!Number.isFinite(t)) t = d / s;
    else if (!Number.isFinite(s)) s = d / t;
    return [
      { label: "Distance", value: fmt(d, 4) },
      { label: "Time", value: fmt(t, 4) + " h" },
      { label: "Speed", value: fmt(s, 4) + " /h", emphasize: true },
    ];
  },
};

const conversion: CalcDef = {
  title: "Unit Conversion Calculator",
  fields: [
    { name: "value", label: "Value", default: "10" },
    { name: "from", label: "From", type: "select", default: "m",
      options: [
        { value: "m", label: "Meters" },
        { value: "km", label: "Kilometers" },
        { value: "cm", label: "Centimeters" },
        { value: "mm", label: "Millimeters" },
        { value: "in", label: "Inches" },
        { value: "ft", label: "Feet" },
        { value: "yd", label: "Yards" },
        { value: "mi", label: "Miles" },
      ] },
    { name: "to", label: "To", type: "select", default: "ft",
      options: [
        { value: "m", label: "Meters" },
        { value: "km", label: "Kilometers" },
        { value: "cm", label: "Centimeters" },
        { value: "mm", label: "Millimeters" },
        { value: "in", label: "Inches" },
        { value: "ft", label: "Feet" },
        { value: "yd", label: "Yards" },
        { value: "mi", label: "Miles" },
      ] },
  ],
  compute: (v) => {
    const toM: Record<string, number> = { m: 1, km: 1000, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 };
    const x = req(v.value, "Value");
    const inM = x * toM[v.from];
    return [{ label: `${x} ${v.from} =`, value: fmt(inM / toM[v.to], 6) + " " + v.to, emphasize: true }];
  },
};

const bmiOther = bmi;
const sleepCalc: CalcDef = {
  title: "Sleep Calculator",
  description: "Suggest bedtimes to wake at a target time (90-min cycles).",
  fields: [
    { name: "wake", label: "Wake time (hh:mm)", type: "text", default: "07:00" },
  ],
  compute: (v) => {
    const p = v.wake.split(":").map(Number);
    if (p.length !== 2 || p.some((n) => !Number.isFinite(n))) return { error: "Format: hh:mm." };
    const base = new Date();
    base.setHours(p[0], p[1], 0, 0);
    const results: CalcDef["compute"] extends unknown ? { label: string; value: string; emphasize?: boolean }[] : never = [];
    for (const cycles of [6, 5, 4, 3]) {
      const t = new Date(base.getTime() - (cycles * 90 + 15) * 60000);
      results.push({ label: `${cycles} cycles (${cycles * 1.5}h)`, value: t.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }), emphasize: cycles === 5 });
    }
    return results;
  },
};

// ============================================================
// ADDITIONAL FINANCIAL — MORTGAGE / REAL ESTATE
// ============================================================

const amortization: CalcDef = {
  title: "Amortization Calculator",
  description: "See monthly payment, total interest and payoff timeline for a fixed-rate loan.",
  fields: [
    { name: "amount", label: "Loan amount", suffix: "$", default: "250000" },
    { name: "rate", label: "Interest rate", suffix: "% APR", default: "6.5" },
    { name: "years", label: "Loan term", suffix: "years", default: "30" },
  ],
  compute: (v) => {
    const P = reqPos(v.amount, "Loan amount");
    const r = reqNonNeg(v.rate, "Interest rate") / 100 / 12;
    const n = reqPos(v.years, "Loan term") * 12;
    const m = pmt(P, r, n);
    let bal = P, totalInt = 0, firstYearInt = 0, firstYearPrin = 0;
    for (let i = 1; i <= n; i++) {
      const ii = bal * r;
      const pp = m - ii;
      bal -= pp;
      totalInt += ii;
      if (i <= 12) { firstYearInt += ii; firstYearPrin += pp; }
    }
    return [
      { label: "Monthly payment", value: money(m), emphasize: true },
      { label: "Total interest", value: money(totalInt) },
      { label: "Total paid", value: money(m * n) },
      { label: "Year 1 interest", value: money(firstYearInt) },
      { label: "Year 1 principal", value: money(firstYearPrin) },
    ];
  },
};

const mortgagePayoff: CalcDef = {
  title: "Mortgage Payoff Calculator",
  description: "See how extra monthly payments shorten your mortgage and reduce interest.",
  fields: [
    { name: "bal", label: "Current balance", suffix: "$", default: "200000" },
    { name: "rate", label: "Interest rate", suffix: "% APR", default: "6" },
    { name: "years", label: "Years remaining", default: "25" },
    { name: "extra", label: "Extra monthly payment", suffix: "$", default: "200" },
  ],
  compute: (v) => {
    const P = reqPos(v.bal, "Balance");
    const r = reqNonNeg(v.rate, "Rate") / 100 / 12;
    const n = reqPos(v.years, "Years") * 12;
    const base = pmt(P, r, n);
    const extra = reqNonNeg(v.extra, "Extra payment");
    let bal = P, months = 0, interest = 0;
    while (bal > 0.01 && months < 100 * 12) {
      const ii = bal * r;
      let pay = base + extra;
      if (pay > bal + ii) pay = bal + ii;
      bal = bal + ii - pay;
      interest += ii;
      months++;
    }
    return [
      { label: "New payoff time", value: `${Math.floor(months / 12)} y ${months % 12} m`, emphasize: true },
      { label: "Months saved", value: String(n - months) },
      { label: "Interest paid", value: money(interest) },
      { label: "Interest saved", value: money(base * n - P - interest) },
    ];
  },
};

const refinance: CalcDef = {
  title: "Refinance Calculator",
  description: "Compare your current mortgage payment to a refinanced loan.",
  fields: [
    { name: "bal", label: "Current balance", suffix: "$", default: "200000" },
    { name: "oldRate", label: "Current rate", suffix: "% APR", default: "7" },
    { name: "oldYears", label: "Years left", default: "25" },
    { name: "newRate", label: "New rate", suffix: "% APR", default: "5.5" },
    { name: "newYears", label: "New term", suffix: "years", default: "30" },
    { name: "cost", label: "Closing costs", suffix: "$", default: "4000" },
  ],
  compute: (v) => {
    const P = reqPos(v.bal, "Balance");
    const oldM = pmt(P, reqNonNeg(v.oldRate, "Old rate") / 1200, reqPos(v.oldYears, "Years left") * 12);
    const newM = pmt(P, reqNonNeg(v.newRate, "New rate") / 1200, reqPos(v.newYears, "New term") * 12);
    const save = oldM - newM;
    const cost = reqNonNeg(v.cost, "Closing costs");
    return [
      { label: "New payment", value: money(newM), emphasize: true },
      { label: "Old payment", value: money(oldM) },
      { label: "Monthly savings", value: money(save) },
      { label: "Break-even", value: save > 0 ? `${Math.ceil(cost / save)} months` : "—" },
    ];
  },
};

const houseAffordability: CalcDef = {
  title: "House Affordability Calculator",
  description: "Estimate home price you can afford using the 28/36 rule.",
  fields: [
    { name: "income", label: "Annual gross income", suffix: "$", default: "80000" },
    { name: "debts", label: "Monthly debt payments", suffix: "$", default: "400" },
    { name: "down", label: "Down payment", suffix: "$", default: "40000" },
    { name: "rate", label: "Interest rate", suffix: "% APR", default: "6.5" },
    { name: "years", label: "Loan term", suffix: "years", default: "30" },
    { name: "tax", label: "Property tax rate", suffix: "% / year", default: "1.2" },
    { name: "ins", label: "Homeowners insurance", suffix: "$ / year", default: "1200" },
  ],
  compute: (v) => {
    const inc = reqPos(v.income, "Income");
    const d = reqNonNeg(v.debts, "Debts");
    const dn = reqNonNeg(v.down, "Down payment");
    const r = reqNonNeg(v.rate, "Rate") / 1200;
    const n = reqPos(v.years, "Term") * 12;
    const tax = reqNonNeg(v.tax, "Tax") / 100 / 12;
    const ins = reqNonNeg(v.ins, "Insurance") / 12;
    const monthlyIncome = inc / 12;
    const maxHousing = Math.min(monthlyIncome * 0.28, monthlyIncome * 0.36 - d);
    if (maxHousing <= 0) return { error: "Debts exceed 36% of income." };
    // maxHousing = mortgagePmt + tax*price + ins; solve for price.
    // mortgagePmt = (price - dn) * r / (1 - (1+r)^-n)
    const factor = r === 0 ? 1 / n : r / (1 - Math.pow(1 + r, -n));
    // maxHousing = (price - dn)*factor + tax*price + ins
    const price = (maxHousing - ins + dn * factor) / (factor + tax);
    const loan = Math.max(0, price - dn);
    return [
      { label: "Max home price", value: money(price), emphasize: true },
      { label: "Max loan", value: money(loan) },
      { label: "Max monthly housing", value: money(maxHousing) },
    ];
  },
};

const rentCalc: CalcDef = {
  title: "Rent Calculator",
  description: "Recommended rent budget based on the 30% rule.",
  fields: [
    { name: "income", label: "Annual gross income", suffix: "$", default: "60000" },
    { name: "pct", label: "Percent of income for rent", suffix: "%", default: "30" },
  ],
  compute: (v) => {
    const inc = reqPos(v.income, "Income");
    const p = reqPos(v.pct, "Percent") / 100;
    return [
      { label: "Recommended monthly rent", value: money((inc / 12) * p), emphasize: true },
      { label: "Annual rent budget", value: money(inc * p) },
    ];
  },
};

const dti: CalcDef = {
  title: "Debt-to-Income Ratio Calculator",
  fields: [
    { name: "income", label: "Monthly gross income", suffix: "$", default: "5000" },
    { name: "debt", label: "Total monthly debt payments", suffix: "$", default: "1500" },
  ],
  compute: (v) => {
    const i = reqPos(v.income, "Income");
    const d = reqNonNeg(v.debt, "Debt");
    const r = (d / i) * 100;
    return [
      { label: "DTI", value: fmt(r, 2) + "%", emphasize: true },
      { label: "Category", value: r < 36 ? "Healthy" : r < 43 ? "Manageable" : "High" },
    ];
  },
};

const realEstate: CalcDef = {
  title: "Real Estate Calculator",
  description: "Estimate monthly cost of homeownership (PITI).",
  fields: [
    { name: "price", label: "Home price", suffix: "$", default: "350000" },
    { name: "down", label: "Down payment", suffix: "$", default: "70000" },
    { name: "rate", label: "Interest rate", suffix: "% APR", default: "6.5" },
    { name: "years", label: "Loan term", suffix: "years", default: "30" },
    { name: "tax", label: "Property tax", suffix: "% / year", default: "1.2" },
    { name: "ins", label: "Insurance", suffix: "$ / year", default: "1200" },
    { name: "hoa", label: "HOA / other", suffix: "$ / month", default: "0" },
  ],
  compute: (v) => {
    const price = reqPos(v.price, "Price");
    const P = price - reqNonNeg(v.down, "Down");
    const m = pmt(P, reqNonNeg(v.rate, "Rate") / 1200, reqPos(v.years, "Term") * 12);
    const tax = (reqNonNeg(v.tax, "Tax") / 100) * price / 12;
    const ins = reqNonNeg(v.ins, "Insurance") / 12;
    const hoa = reqNonNeg(v.hoa, "HOA");
    const total = m + tax + ins + hoa;
    return [
      { label: "Total monthly", value: money(total), emphasize: true },
      { label: "Principal & interest", value: money(m) },
      { label: "Property tax", value: money(tax) },
      { label: "Insurance", value: money(ins) },
      { label: "HOA / other", value: money(hoa) },
    ];
  },
};

const rentalProperty: CalcDef = {
  title: "Rental Property Calculator",
  description: "Estimate cash flow and cap rate for a rental investment.",
  fields: [
    { name: "price", label: "Purchase price", suffix: "$", default: "250000" },
    { name: "down", label: "Down payment", suffix: "$", default: "50000" },
    { name: "rate", label: "Interest rate", suffix: "%", default: "7" },
    { name: "years", label: "Loan term", default: "30" },
    { name: "rent", label: "Monthly rent", suffix: "$", default: "2200" },
    { name: "expenses", label: "Monthly expenses (tax, ins, maint.)", suffix: "$", default: "500" },
    { name: "vacancy", label: "Vacancy rate", suffix: "%", default: "5" },
  ],
  compute: (v) => {
    const price = reqPos(v.price, "Price");
    const down = reqNonNeg(v.down, "Down");
    const m = pmt(price - down, reqNonNeg(v.rate, "Rate") / 1200, reqPos(v.years, "Term") * 12);
    const rent = reqPos(v.rent, "Rent");
    const eff = rent * (1 - reqNonNeg(v.vacancy, "Vacancy") / 100);
    const exp = reqNonNeg(v.expenses, "Expenses");
    const cash = eff - exp - m;
    const noi = (eff - exp) * 12;
    return [
      { label: "Monthly cash flow", value: money(cash), emphasize: true },
      { label: "Annual NOI", value: money(noi) },
      { label: "Cap rate", value: fmt((noi / price) * 100, 2) + "%" },
      { label: "Cash-on-cash return", value: fmt((cash * 12 / down) * 100, 2) + "%" },
    ];
  },
};

const apr: CalcDef = {
  title: "APR Calculator",
  description: "Compute effective APR from a loan with upfront fees.",
  fields: [
    { name: "amount", label: "Loan amount", suffix: "$", default: "200000" },
    { name: "rate", label: "Nominal rate", suffix: "%", default: "6" },
    { name: "years", label: "Term", suffix: "years", default: "30" },
    { name: "fees", label: "Upfront fees", suffix: "$", default: "3000" },
  ],
  compute: (v) => {
    const P = reqPos(v.amount, "Amount");
    const r = reqNonNeg(v.rate, "Rate") / 1200;
    const n = reqPos(v.years, "Years") * 12;
    const fees = reqNonNeg(v.fees, "Fees");
    const m = pmt(P, r, n);
    const net = P - fees;
    // solve for i: m = net * i / (1 - (1+i)^-n)
    let lo = 0, hi = 1, i = r;
    for (let k = 0; k < 60; k++) {
      i = (lo + hi) / 2;
      const test = i === 0 ? net / n : (net * i) / (1 - Math.pow(1 + i, -n));
      if (test > m) hi = i; else lo = i;
    }
    return [
      { label: "APR", value: fmt(i * 12 * 100, 4) + "%", emphasize: true },
      { label: "Monthly payment", value: money(m) },
    ];
  },
};

const fhaLoan: CalcDef = { ...mortgage, title: "FHA Loan Calculator", description: "Estimate FHA mortgage payment (P&I only)." };
const vaMortgage: CalcDef = { ...mortgage, title: "VA Mortgage Calculator", description: "Estimate VA loan monthly payment (P&I)." };
const homeEquityLoan: CalcDef = { ...loan, title: "Home Equity Loan Calculator" };
const heloc: CalcDef = { ...loan, title: "HELOC Calculator", description: "Estimate HELOC interest-only or amortizing payment." };

const rentVsBuy: CalcDef = {
  title: "Rent vs Buy Calculator",
  description: "Rough monthly comparison of renting vs buying.",
  fields: [
    { name: "rent", label: "Monthly rent", suffix: "$", default: "2000" },
    { name: "price", label: "Home price", suffix: "$", default: "350000" },
    { name: "down", label: "Down payment", suffix: "$", default: "70000" },
    { name: "rate", label: "Mortgage rate", suffix: "%", default: "6.5" },
    { name: "years", label: "Loan term", default: "30" },
    { name: "own", label: "Ownership costs (tax+ins+maint)", suffix: "$ / month", default: "600" },
  ],
  compute: (v) => {
    const m = pmt(reqPos(v.price, "Price") - reqNonNeg(v.down, "Down"),
      reqNonNeg(v.rate, "Rate") / 1200, reqPos(v.years, "Term") * 12);
    const own = m + reqNonNeg(v.own, "Ownership");
    const rent = reqPos(v.rent, "Rent");
    return [
      { label: "Monthly rent", value: money(rent) },
      { label: "Monthly ownership", value: money(own) },
      { label: "Difference", value: money(own - rent), emphasize: true },
      { label: "Recommendation", value: own < rent ? "Buying costs less monthly" : "Renting costs less monthly" },
    ];
  },
};

// ============================================================
// AUTO
// ============================================================

const cashBackVsLow: CalcDef = {
  title: "Cash Back or Low Interest Calculator",
  description: "Compare a cash-back rebate vs low-interest financing on a car.",
  fields: [
    { name: "price", label: "Vehicle price", suffix: "$", default: "30000" },
    { name: "years", label: "Loan term", suffix: "years", default: "5" },
    { name: "cashBack", label: "Cash back offer", suffix: "$", default: "2000" },
    { name: "normalRate", label: "Standard rate", suffix: "%", default: "7" },
    { name: "lowRate", label: "Promotional low rate", suffix: "%", default: "1.9" },
  ],
  compute: (v) => {
    const n = reqPos(v.years, "Years") * 12;
    const price = reqPos(v.price, "Price");
    const cb = reqNonNeg(v.cashBack, "Cash back");
    const A = pmt(price - cb, reqNonNeg(v.normalRate, "Std rate") / 1200, n);
    const B = pmt(price, reqNonNeg(v.lowRate, "Low rate") / 1200, n);
    return [
      { label: "Cash-back payment", value: money(A) },
      { label: "Low-rate payment", value: money(B) },
      { label: "Total (cash back)", value: money(A * n) },
      { label: "Total (low rate)", value: money(B * n) },
      { label: "Better choice", value: A * n < B * n ? "Take cash back" : "Take low rate", emphasize: true },
    ];
  },
};

const autoLease: CalcDef = {
  title: "Auto Lease Calculator",
  description: "Estimate monthly car lease payment.",
  fields: [
    { name: "price", label: "Negotiated price (cap cost)", suffix: "$", default: "30000" },
    { name: "residual", label: "Residual value", suffix: "$", default: "18000" },
    { name: "months", label: "Lease term", suffix: "months", default: "36" },
    { name: "mf", label: "Money factor", default: "0.0025" },
    { name: "tax", label: "Sales tax", suffix: "%", default: "7" },
  ],
  compute: (v) => {
    const cap = reqPos(v.price, "Price");
    const res = reqNonNeg(v.residual, "Residual");
    const n = reqPos(v.months, "Months");
    const mf = reqNonNeg(v.mf, "Money factor");
    const dep = (cap - res) / n;
    const fin = (cap + res) * mf;
    const base = dep + fin;
    const tax = base * reqNonNeg(v.tax, "Tax") / 100;
    return [
      { label: "Monthly lease payment", value: money(base + tax), emphasize: true },
      { label: "Depreciation", value: money(dep) },
      { label: "Finance charge", value: money(fin) },
      { label: "Tax", value: money(tax) },
    ];
  },
};

// ============================================================
// RETIREMENT / INVESTMENT
// ============================================================

const retirement: CalcDef = {
  title: "Retirement Calculator",
  description: "Project retirement savings from current balance and monthly contributions.",
  fields: [
    { name: "cur", label: "Current savings", suffix: "$", default: "50000" },
    { name: "contrib", label: "Monthly contribution", suffix: "$", default: "500" },
    { name: "rate", label: "Annual return", suffix: "%", default: "7" },
    { name: "years", label: "Years to retirement", default: "30" },
  ],
  compute: (v) => {
    const P = reqNonNeg(v.cur, "Current");
    const c = reqNonNeg(v.contrib, "Contribution");
    const r = reqNonNeg(v.rate, "Return") / 100 / 12;
    const n = reqPos(v.years, "Years") * 12;
    const fvP = P * Math.pow(1 + r, n);
    const fvC = r === 0 ? c * n : c * ((Math.pow(1 + r, n) - 1) / r);
    return [
      { label: "Retirement balance", value: money(fvP + fvC), emphasize: true },
      { label: "Total contributions", value: money(P + c * n) },
      { label: "Interest earned", value: money(fvP + fvC - P - c * n) },
    ];
  },
};

const k401: CalcDef = { ...retirement, title: "401K Calculator", description: "Project 401(k) balance at retirement." };
const rothIRA: CalcDef = { ...retirement, title: "Roth IRA Calculator" };
const ira: CalcDef = { ...retirement, title: "IRA Calculator" };
const pension: CalcDef = {
  title: "Pension Calculator",
  description: "Estimate annual pension using: years × final salary × multiplier.",
  fields: [
    { name: "salary", label: "Final average salary", suffix: "$", default: "70000" },
    { name: "years", label: "Years of service", default: "25" },
    { name: "mult", label: "Multiplier", suffix: "% / year", default: "2" },
  ],
  compute: (v) => {
    const s = reqPos(v.salary, "Salary");
    const y = reqPos(v.years, "Years");
    const m = reqPos(v.mult, "Multiplier") / 100;
    const annual = s * y * m;
    return [
      { label: "Annual pension", value: money(annual), emphasize: true },
      { label: "Monthly pension", value: money(annual / 12) },
    ];
  },
};

const socialSecurity: CalcDef = {
  title: "Social Security Calculator",
  description: "Rough Social Security estimate based on average indexed earnings.",
  fields: [
    { name: "aime", label: "Average monthly indexed earnings (AIME)", suffix: "$", default: "6000" },
  ],
  compute: (v) => {
    const a = reqPos(v.aime, "AIME");
    // 2024 bend points
    const b1 = 1174, b2 = 7078;
    let pia = 0;
    pia += 0.9 * Math.min(a, b1);
    if (a > b1) pia += 0.32 * (Math.min(a, b2) - b1);
    if (a > b2) pia += 0.15 * (a - b2);
    return [
      { label: "Estimated monthly benefit (PIA)", value: money(pia), emphasize: true },
      { label: "Annual benefit", value: money(pia * 12) },
    ];
  },
};

const annuity: CalcDef = {
  title: "Annuity Calculator",
  description: "Future value of a series of periodic contributions.",
  fields: [
    { name: "pmt", label: "Periodic contribution", suffix: "$", default: "1000" },
    { name: "rate", label: "Annual rate", suffix: "%", default: "5" },
    { name: "years", label: "Years", default: "20" },
    { name: "n", label: "Contributions per year", default: "12" },
  ],
  compute: (v) => {
    const c = reqPos(v.pmt, "Contribution");
    const r = reqNonNeg(v.rate, "Rate") / 100 / reqPos(v.n, "Freq");
    const N = reqPos(v.years, "Years") * reqPos(v.n, "Freq");
    const fv = r === 0 ? c * N : c * ((Math.pow(1 + r, N) - 1) / r);
    return [
      { label: "Future value", value: money(fv), emphasize: true },
      { label: "Total contributed", value: money(c * N) },
      { label: "Interest earned", value: money(fv - c * N) },
    ];
  },
};

const annuityPayout: CalcDef = {
  title: "Annuity Payout Calculator",
  description: "Monthly payout from a lump-sum annuity over a fixed period.",
  fields: [
    { name: "pv", label: "Starting balance", suffix: "$", default: "500000" },
    { name: "rate", label: "Annual rate", suffix: "%", default: "5" },
    { name: "years", label: "Payout years", default: "20" },
  ],
  compute: (v) => {
    const pv = reqPos(v.pv, "Balance");
    const r = reqNonNeg(v.rate, "Rate") / 1200;
    const n = reqPos(v.years, "Years") * 12;
    const p = r === 0 ? pv / n : (pv * r) / (1 - Math.pow(1 + r, -n));
    return [
      { label: "Monthly payout", value: money(p), emphasize: true },
      { label: "Total received", value: money(p * n) },
    ];
  },
};

const rmd: CalcDef = {
  title: "RMD Calculator",
  description: "Required Minimum Distribution using IRS Uniform Lifetime Table.",
  fields: [
    { name: "bal", label: "Account balance (12/31 prior year)", suffix: "$", default: "500000" },
    { name: "age", label: "Age this year", default: "75" },
  ],
  compute: (v) => {
    const b = reqPos(v.bal, "Balance");
    const age = Math.floor(reqPos(v.age, "Age"));
    // 2022+ Uniform Lifetime table (partial)
    const table: Record<number, number> = {
      72:27.4,73:26.5,74:25.5,75:24.6,76:23.7,77:22.9,78:22.0,79:21.1,80:20.2,
      81:19.4,82:18.5,83:17.7,84:16.8,85:16.0,86:15.2,87:14.4,88:13.7,89:12.9,90:12.2,
      91:11.5,92:10.8,93:10.1,94:9.5,95:8.9,96:8.4,97:7.8,98:7.3,99:6.8,100:6.4,
    };
    const f = table[Math.min(100, Math.max(72, age))];
    if (!f) return { error: "Age must be 72 or older." };
    return [
      { label: "RMD this year", value: money(b / f), emphasize: true },
      { label: "Distribution period", value: fmt(f, 1) + " years" },
    ];
  },
};

const mutualFund: CalcDef = { ...compoundInterest, title: "Mutual Fund Calculator", description: "Project mutual fund growth with monthly contributions." };

const irrCalc: CalcDef = {
  title: "IRR Calculator",
  description: "Internal rate of return for cash flows separated by commas (year 0 first).",
  fields: [
    { name: "flows", label: "Cash flows (comma-separated)", type: "text", default: "-1000, 200, 300, 400, 500" },
  ],
  compute: (v) => {
    const arr = v.flows.split(",").map((x) => Number(x.trim()));
    if (arr.length < 2 || arr.some((x) => !Number.isFinite(x))) return { error: "Enter at least 2 numeric flows." };
    const npv = (r: number) => arr.reduce((s, c, i) => s + c / Math.pow(1 + r, i), 0);
    let lo = -0.9, hi = 10;
    for (let k = 0; k < 100; k++) {
      const mid = (lo + hi) / 2;
      if (npv(mid) > 0) lo = mid; else hi = mid;
    }
    return [{ label: "IRR", value: fmt((lo + hi) / 2 * 100, 4) + "%", emphasize: true }];
  },
};

const paybackPeriod: CalcDef = {
  title: "Payback Period Calculator",
  fields: [
    { name: "cost", label: "Initial investment", suffix: "$", default: "10000" },
    { name: "flow", label: "Annual cash flow", suffix: "$", default: "2500" },
  ],
  compute: (v) => {
    const c = reqPos(v.cost, "Cost");
    const f = reqPos(v.flow, "Flow");
    return [{ label: "Payback period", value: fmt(c / f, 2) + " years", emphasize: true }];
  },
};

// ============================================================
// TAX / SALARY
// ============================================================

function usFedTax2024(taxable: number, filing: "single" | "mfj"): number {
  const brackets = filing === "mfj"
    ? [[0,0.10],[23200,0.12],[94300,0.22],[201050,0.24],[383900,0.32],[487450,0.35],[731200,0.37]] as const
    : [[0,0.10],[11600,0.12],[47150,0.22],[100525,0.24],[191950,0.32],[243725,0.35],[609350,0.37]] as const;
  let tax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const [lo, rate] = brackets[i];
    const hi = i + 1 < brackets.length ? brackets[i + 1][0] : Infinity;
    if (taxable > lo) tax += (Math.min(taxable, hi) - lo) * rate;
    else break;
  }
  return Math.max(0, tax);
}

const incomeTax: CalcDef = {
  title: "Income Tax Calculator",
  description: "Estimate US federal income tax (2024 brackets).",
  fields: [
    { name: "income", label: "Taxable income", suffix: "$", default: "75000" },
    { name: "filing", label: "Filing status", type: "select", default: "single",
      options: [{ value: "single", label: "Single" }, { value: "mfj", label: "Married filing jointly" }] },
  ],
  compute: (v) => {
    const inc = reqNonNeg(v.income, "Income");
    const t = usFedTax2024(inc, v.filing as "single" | "mfj");
    return [
      { label: "Federal tax", value: money(t), emphasize: true },
      { label: "Effective rate", value: fmt((t / Math.max(1, inc)) * 100, 2) + "%" },
      { label: "After-tax income", value: money(inc - t) },
    ];
  },
};

const marriageTax: CalcDef = {
  title: "Marriage Tax Calculator",
  description: "Compare taxes filed separately as single vs jointly.",
  fields: [
    { name: "a", label: "Spouse A income", suffix: "$", default: "70000" },
    { name: "b", label: "Spouse B income", suffix: "$", default: "50000" },
  ],
  compute: (v) => {
    const a = reqNonNeg(v.a, "A");
    const b = reqNonNeg(v.b, "B");
    const sep = usFedTax2024(a, "single") + usFedTax2024(b, "single");
    const mfj = usFedTax2024(a + b, "mfj");
    return [
      { label: "As two singles", value: money(sep) },
      { label: "Married filing jointly", value: money(mfj) },
      { label: mfj > sep ? "Marriage penalty" : "Marriage bonus", value: money(Math.abs(mfj - sep)), emphasize: true },
    ];
  },
};

const estateTax: CalcDef = {
  title: "Estate Tax Calculator",
  description: "US federal estate tax (2024, $13.61M exemption, 40% rate above).",
  fields: [
    { name: "estate", label: "Gross estate", suffix: "$", default: "15000000" },
  ],
  compute: (v) => {
    const e = reqNonNeg(v.estate, "Estate");
    const exempt = 13610000;
    const taxable = Math.max(0, e - exempt);
    return [
      { label: "Taxable estate", value: money(taxable) },
      { label: "Estimated estate tax", value: money(taxable * 0.4), emphasize: true },
    ];
  },
};

// ============================================================
// OTHER FINANCIAL
// ============================================================

const paymentCalc: CalcDef = { ...loan, title: "Payment Calculator" };

const currencyCalc: CalcDef = {
  title: "Currency Calculator",
  description: "Convert between currencies with a manual exchange rate.",
  fields: [
    { name: "amount", label: "Amount", default: "100" },
    { name: "rate", label: "Exchange rate (to → from)", default: "1.08" },
  ],
  compute: (v) => {
    const a = req(v.amount, "Amount");
    const r = reqPos(v.rate, "Rate");
    return [
      { label: "Converted amount", value: fmt(a * r, 4), emphasize: true },
      { label: "Reverse", value: fmt(a / r, 4) },
    ];
  },
};

const creditCard: CalcDef = {
  title: "Credit Card Calculator",
  description: "Time and interest to pay off a credit card at a fixed monthly payment.",
  fields: [
    { name: "bal", label: "Balance", suffix: "$", default: "5000" },
    { name: "apr", label: "APR", suffix: "%", default: "22" },
    { name: "pmt", label: "Monthly payment", suffix: "$", default: "200" },
  ],
  compute: (v) => {
    const B = reqPos(v.bal, "Balance");
    const r = reqNonNeg(v.apr, "APR") / 1200;
    const p = reqPos(v.pmt, "Payment");
    if (p <= B * r) return { error: "Payment too low to cover interest." };
    let bal = B, months = 0, interest = 0;
    while (bal > 0.01 && months < 1200) {
      const ii = bal * r; interest += ii;
      const pay = Math.min(p, bal + ii);
      bal = bal + ii - pay; months++;
    }
    return [
      { label: "Payoff time", value: `${Math.floor(months / 12)} y ${months % 12} m`, emphasize: true },
      { label: "Total interest", value: money(interest) },
      { label: "Total paid", value: money(B + interest) },
    ];
  },
};

const creditCardsPayoff: CalcDef = { ...creditCard, title: "Credit Cards Payoff Calculator" };
const debtPayoff: CalcDef = { ...creditCard, title: "Debt Payoff Calculator" };

const debtConsolidation: CalcDef = {
  title: "Debt Consolidation Calculator",
  description: "Compare current debts vs a single consolidation loan.",
  fields: [
    { name: "totalBal", label: "Total balance", suffix: "$", default: "20000" },
    { name: "curPmt", label: "Current monthly payments", suffix: "$", default: "700" },
    { name: "newRate", label: "Consolidation rate", suffix: "%", default: "9" },
    { name: "years", label: "New term", suffix: "years", default: "5" },
  ],
  compute: (v) => {
    const P = reqPos(v.totalBal, "Balance");
    const r = reqNonNeg(v.newRate, "Rate") / 1200;
    const n = reqPos(v.years, "Term") * 12;
    const m = pmt(P, r, n);
    return [
      { label: "New monthly payment", value: money(m), emphasize: true },
      { label: "Current monthly", value: money(reqPos(v.curPmt, "Cur")) },
      { label: "Total to pay off", value: money(m * n) },
    ];
  },
};

const collegeCost: CalcDef = {
  title: "College Cost Calculator",
  description: "Project total cost of a college degree with tuition inflation.",
  fields: [
    { name: "cost", label: "Annual cost today", suffix: "$", default: "25000" },
    { name: "years", label: "Years", default: "4" },
    { name: "start", label: "Years until start", default: "1" },
    { name: "infl", label: "Tuition inflation", suffix: "%", default: "5" },
  ],
  compute: (v) => {
    const c = reqPos(v.cost, "Cost");
    const y = reqPos(v.years, "Years");
    const s = reqNonNeg(v.start, "Start");
    const r = reqNonNeg(v.infl, "Infl") / 100;
    let total = 0;
    for (let i = 0; i < y; i++) total += c * Math.pow(1 + r, s + i);
    return [{ label: "Total projected cost", value: money(total), emphasize: true }];
  },
};

const depreciation: CalcDef = {
  title: "Depreciation Calculator",
  description: "Straight-line and double-declining depreciation.",
  fields: [
    { name: "cost", label: "Asset cost", suffix: "$", default: "10000" },
    { name: "salvage", label: "Salvage value", suffix: "$", default: "1000" },
    { name: "life", label: "Useful life", suffix: "years", default: "5" },
  ],
  compute: (v) => {
    const c = reqPos(v.cost, "Cost");
    const s = reqNonNeg(v.salvage, "Salvage");
    const n = reqPos(v.life, "Life");
    const sl = (c - s) / n;
    const dd = (2 / n) * c;
    return [
      { label: "Straight-line / year", value: money(sl), emphasize: true },
      { label: "Double-declining Yr 1", value: money(dd) },
      { label: "Total depreciable", value: money(c - s) },
    ];
  },
};

const leaseCalc: CalcDef = { ...autoLease, title: "Lease Calculator" };

const budget: CalcDef = {
  title: "Budget Calculator",
  description: "50/30/20 budget split from monthly take-home income.",
  fields: [
    { name: "income", label: "Monthly take-home", suffix: "$", default: "5000" },
  ],
  compute: (v) => {
    const i = reqPos(v.income, "Income");
    return [
      { label: "Needs (50%)", value: money(i * 0.5), emphasize: true },
      { label: "Wants (30%)", value: money(i * 0.3) },
      { label: "Savings/debt (20%)", value: money(i * 0.2) },
    ];
  },
};

const commission: CalcDef = {
  title: "Commission Calculator",
  fields: [
    { name: "sales", label: "Total sales", suffix: "$", default: "50000" },
    { name: "rate", label: "Commission rate", suffix: "%", default: "8" },
  ],
  compute: (v) => {
    const s = reqPos(v.sales, "Sales");
    const r = reqPos(v.rate, "Rate") / 100;
    return [
      { label: "Commission", value: money(s * r), emphasize: true },
      { label: "Net after commission", value: money(s - s * r) },
    ];
  },
};

// ============================================================
// FITNESS
// ============================================================

const armyBodyFat: CalcDef = {
  title: "Army Body Fat Calculator",
  description: "US Army body-fat estimate (circumference method, inches).",
  fields: [
    { name: "sex", label: "Sex", type: "select", default: "male",
      options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
    { name: "height", label: "Height", suffix: "in", default: "70" },
    { name: "neck", label: "Neck", suffix: "in", default: "16" },
    { name: "waist", label: "Waist", suffix: "in", default: "34" },
    { name: "hip", label: "Hip (female only)", suffix: "in", default: "38" },
  ],
  compute: (v) => {
    const h = reqPos(v.height, "Height");
    const neck = reqPos(v.neck, "Neck");
    const waist = reqPos(v.waist, "Waist");
    let bf: number;
    if (v.sex === "male") {
      bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(h) + 36.76;
    } else {
      const hip = reqPos(v.hip, "Hip");
      bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(h) - 78.387;
    }
    return [{ label: "Body fat", value: fmt(bf, 1) + "%", emphasize: true }];
  },
};

const caloriesBurned: CalcDef = {
  title: "Calories Burned Calculator",
  description: "Calories burned = MET × weight(kg) × time(hr).",
  fields: [
    { name: "weight", label: "Weight", suffix: "kg", default: "70" },
    { name: "met", label: "Activity MET", type: "select", default: "8",
      options: [
        { value: "3", label: "Walking (3 MET)" },
        { value: "5", label: "Cycling casual (5 MET)" },
        { value: "8", label: "Running 5 mph (8 MET)" },
        { value: "10", label: "Swimming (10 MET)" },
        { value: "12", label: "Running 7.5 mph (12 MET)" },
      ] },
    { name: "min", label: "Duration", suffix: "min", default: "30" },
  ],
  compute: (v) => {
    const w = reqPos(v.weight, "Weight");
    const met = reqPos(v.met, "MET");
    const t = reqPos(v.min, "Duration") / 60;
    return [{ label: "Calories burned", value: fmt(met * w * t, 0) + " kcal", emphasize: true }];
  },
};

// ============================================================
// PREGNANCY
// ============================================================

const pregnancyWeightGain: CalcDef = {
  title: "Pregnancy Weight Gain Calculator",
  description: "Recommended weight gain based on pre-pregnancy BMI (IOM).",
  fields: [
    { name: "wt", label: "Pre-pregnancy weight", suffix: "kg", default: "60" },
    { name: "ht", label: "Height", suffix: "cm", default: "165" },
    { name: "twin", label: "Multiples?", type: "select", default: "no",
      options: [{ value: "no", label: "Singleton" }, { value: "yes", label: "Twins" }] },
  ],
  compute: (v) => {
    const w = reqPos(v.wt, "Weight");
    const h = reqPos(v.ht, "Height") / 100;
    const bmi = w / (h * h);
    let lo = 0, hi = 0, cat = "";
    if (bmi < 18.5) { lo = 12.5; hi = 18; cat = "Underweight"; }
    else if (bmi < 25) { lo = 11.5; hi = 16; cat = "Normal"; }
    else if (bmi < 30) { lo = 7; hi = 11.5; cat = "Overweight"; }
    else { lo = 5; hi = 9; cat = "Obese"; }
    if (v.twin === "yes") { lo *= 1.5; hi *= 1.5; }
    return [
      { label: "Pre-pregnancy BMI", value: fmt(bmi, 1) + " (" + cat + ")" },
      { label: "Recommended gain", value: `${fmt(lo, 1)}–${fmt(hi, 1)} kg`, emphasize: true },
    ];
  },
};

const periodCalc: CalcDef = {
  title: "Period Calculator",
  description: "Predict next period dates from last period and cycle length.",
  fields: [
    { name: "last", label: "Last period start (YYYY-MM-DD)", type: "text", default: new Date().toISOString().slice(0, 10) },
    { name: "cycle", label: "Cycle length", suffix: "days", default: "28" },
  ],
  compute: (v) => {
    const d = new Date(v.last);
    if (isNaN(d.getTime())) return { error: "Invalid date." };
    const cy = reqPos(v.cycle, "Cycle");
    const results = [] as CalcResult[];
    for (let i = 1; i <= 3; i++) {
      const next = new Date(d.getTime() + i * cy * 86400000);
      results.push({ label: `Period ${i}`, value: next.toDateString(), emphasize: i === 1 });
    }
    return results;
  },
};

// ============================================================
// FITNESS OTHER
// ============================================================

const macro: CalcDef = {
  title: "Macro Calculator",
  description: "Split daily calories into protein / carbs / fat.",
  fields: [
    { name: "cal", label: "Daily calories", default: "2000" },
    { name: "p", label: "Protein %", default: "30" },
    { name: "c", label: "Carbs %", default: "40" },
    { name: "f", label: "Fat %", default: "30" },
  ],
  compute: (v) => {
    const cal = reqPos(v.cal, "Calories");
    const p = reqNonNeg(v.p, "Protein");
    const c = reqNonNeg(v.c, "Carbs");
    const f = reqNonNeg(v.f, "Fat");
    if (Math.abs(p + c + f - 100) > 0.01) return { error: "Percentages must sum to 100." };
    return [
      { label: "Protein", value: fmt((cal * p / 100) / 4, 0) + " g", emphasize: true },
      { label: "Carbs", value: fmt((cal * c / 100) / 4, 0) + " g" },
      { label: "Fat", value: fmt((cal * f / 100) / 9, 0) + " g" },
    ];
  },
};

const carbCalc: CalcDef = {
  title: "Carbohydrate Calculator",
  fields: [
    { name: "cal", label: "Daily calories", default: "2000" },
    { name: "pct", label: "Carb %", default: "50" },
  ],
  compute: (v) => {
    const cal = reqPos(v.cal, "Cal"); const p = reqPos(v.pct, "Pct") / 100;
    return [{ label: "Carbs per day", value: fmt((cal * p) / 4, 0) + " g", emphasize: true }];
  },
};

const proteinCalc: CalcDef = {
  title: "Protein Calculator",
  fields: [
    { name: "wt", label: "Body weight", suffix: "kg", default: "70" },
    { name: "level", label: "Activity", type: "select", default: "1.4",
      options: [
        { value: "0.8", label: "Sedentary (0.8 g/kg)" },
        { value: "1.2", label: "Active (1.2 g/kg)" },
        { value: "1.4", label: "Endurance (1.4 g/kg)" },
        { value: "1.8", label: "Strength (1.8 g/kg)" },
        { value: "2.2", label: "Bodybuilding (2.2 g/kg)" },
      ] },
  ],
  compute: (v) => {
    const w = reqPos(v.wt, "Weight"); const l = reqPos(v.level, "Level");
    return [{ label: "Daily protein", value: fmt(w * l, 0) + " g", emphasize: true }];
  },
};

const fatIntake: CalcDef = {
  title: "Fat Intake Calculator",
  fields: [
    { name: "cal", label: "Daily calories", default: "2000" },
    { name: "pct", label: "Fat %", default: "30" },
  ],
  compute: (v) => {
    const cal = reqPos(v.cal, "Cal"); const p = reqPos(v.pct, "Pct") / 100;
    return [{ label: "Fat per day", value: fmt((cal * p) / 9, 0) + " g", emphasize: true }];
  },
};

const gfr: CalcDef = {
  title: "GFR Calculator",
  description: "Estimated glomerular filtration rate (CKD-EPI 2021).",
  fields: [
    { name: "cr", label: "Serum creatinine", suffix: "mg/dL", default: "1.0" },
    { name: "age", label: "Age", suffix: "years", default: "40" },
    { name: "sex", label: "Sex", type: "select", default: "male",
      options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
  ],
  compute: (v) => {
    const cr = reqPos(v.cr, "Creatinine");
    const age = reqPos(v.age, "Age");
    const female = v.sex === "female";
    const k = female ? 0.7 : 0.9;
    const a = female ? -0.241 : -0.302;
    const min = Math.min(cr / k, 1);
    const max = Math.max(cr / k, 1);
    const gfrVal = 142 * Math.pow(min, a) * Math.pow(max, -1.200) * Math.pow(0.9938, age) * (female ? 1.012 : 1);
    return [{ label: "eGFR", value: fmt(gfrVal, 1) + " mL/min/1.73m²", emphasize: true }];
  },
};

const bodyType: CalcDef = {
  title: "Body Type Calculator",
  description: "Estimate somatotype from wrist circumference (Grant's method).",
  fields: [
    { name: "sex", label: "Sex", type: "select", default: "male",
      options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
    { name: "ht", label: "Height", suffix: "in", default: "70" },
    { name: "wrist", label: "Wrist circumference", suffix: "in", default: "7" },
  ],
  compute: (v) => {
    const h = reqPos(v.ht, "Height");
    const w = reqPos(v.wrist, "Wrist");
    const r = h / w;
    let t: string;
    if (v.sex === "male") t = r > 10.4 ? "Ectomorph" : r > 9.6 ? "Mesomorph" : "Endomorph";
    else t = r > 11.0 ? "Ectomorph" : r > 10.1 ? "Mesomorph" : "Endomorph";
    return [
      { label: "Height/wrist ratio", value: fmt(r, 2) },
      { label: "Body type", value: t, emphasize: true },
    ];
  },
};

const bodySurfaceArea: CalcDef = {
  title: "Body Surface Area Calculator",
  description: "BSA using DuBois and Mosteller formulas.",
  fields: [
    { name: "wt", label: "Weight", suffix: "kg", default: "70" },
    { name: "ht", label: "Height", suffix: "cm", default: "170" },
  ],
  compute: (v) => {
    const w = reqPos(v.wt, "Weight"); const h = reqPos(v.ht, "Height");
    const du = 0.007184 * Math.pow(w, 0.425) * Math.pow(h, 0.725);
    const mo = Math.sqrt((w * h) / 3600);
    return [
      { label: "BSA (Mosteller)", value: fmt(mo, 2) + " m²", emphasize: true },
      { label: "BSA (DuBois)", value: fmt(du, 2) + " m²" },
    ];
  },
};

const bac: CalcDef = {
  title: "BAC Calculator",
  description: "Widmark estimate of blood alcohol content.",
  fields: [
    { name: "wt", label: "Body weight", suffix: "kg", default: "70" },
    { name: "sex", label: "Sex", type: "select", default: "male",
      options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
    { name: "drinks", label: "Standard drinks (14 g alcohol each)", default: "2" },
    { name: "hours", label: "Hours since first drink", default: "1" },
  ],
  compute: (v) => {
    const w = reqPos(v.wt, "Weight") * 1000; // grams
    const r = v.sex === "male" ? 0.68 : 0.55;
    const alcohol = reqPos(v.drinks, "Drinks") * 14;
    const hrs = reqNonNeg(v.hours, "Hours");
    const bac = Math.max(0, (alcohol / (w * r)) * 100 - 0.015 * hrs);
    return [
      { label: "BAC", value: fmt(bac, 3) + "%", emphasize: true },
      { label: "Status", value: bac >= 0.08 ? "Legally intoxicated" : bac >= 0.02 ? "Impaired" : "Under legal limit" },
    ];
  },
};

// ============================================================
// MATH — new
// ============================================================

const scientific: CalcDef = {
  title: "Scientific Calculator",
  description: "Evaluate a math expression (supports +, -, *, /, ^, sin, cos, tan, log, ln, sqrt, pi, e).",
  fields: [
    { name: "expr", label: "Expression", type: "text", default: "sqrt(2) * sin(pi/4) + log(100)" },
  ],
  compute: (v) => {
    try {
      let s = v.expr.toLowerCase();
      s = s.replace(/\bpi\b/g, "Math.PI").replace(/\be\b/g, "Math.E")
           .replace(/\bln\(/g, "Math.log(").replace(/\blog\(/g, "Math.log10(")
           .replace(/\bsin\(/g, "Math.sin(").replace(/\bcos\(/g, "Math.cos(")
           .replace(/\btan\(/g, "Math.tan(").replace(/\bsqrt\(/g, "Math.sqrt(")
           .replace(/\babs\(/g, "Math.abs(").replace(/\bexp\(/g, "Math.exp(")
           .replace(/\^/g, "**");
      if (!/^[-+*/().,\d\s\w]+$/.test(s.replace(/Math\.[A-Za-z0-9]+/g, ""))) return { error: "Invalid characters." };
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const result = Function(`"use strict"; return (${s})`)();
      if (!Number.isFinite(result)) return { error: "Result is not finite." };
      return [{ label: "Result", value: fmt(result, 6), emphasize: true }];
    } catch {
      return { error: "Invalid expression." };
    }
  },
};

const factorCalc: CalcDef = {
  title: "Factor Calculator",
  description: "List all factors and prime factorization of an integer.",
  fields: [{ name: "n", label: "Number", default: "360" }],
  compute: (v) => {
    const n = Math.floor(reqPos(v.n, "Number"));
    if (n > 10_000_000) return { error: "Enter a smaller number." };
    const factors: number[] = [];
    for (let i = 1; i * i <= n; i++) {
      if (n % i === 0) { factors.push(i); if (i !== n / i) factors.push(n / i); }
    }
    factors.sort((a, b) => a - b);
    const primes: number[] = [];
    let m = n;
    for (let i = 2; i * i <= m; i++) while (m % i === 0) { primes.push(i); m /= i; }
    if (m > 1) primes.push(m);
    return [
      { label: "Factors", value: factors.join(", ") },
      { label: "Prime factorization", value: primes.join(" × "), emphasize: true },
    ];
  },
};

const matrixCalc: CalcDef = {
  title: "Matrix Calculator",
  description: "2×2 matrix determinant and inverse. Enter values a,b,c,d for [[a,b],[c,d]].",
  fields: [
    { name: "a", label: "a", default: "1" },
    { name: "b", label: "b", default: "2" },
    { name: "c", label: "c", default: "3" },
    { name: "d", label: "d", default: "4" },
  ],
  compute: (v) => {
    const a = req(v.a, "a"), b = req(v.b, "b"), c = req(v.c, "c"), d = req(v.d, "d");
    const det = a * d - b * c;
    if (det === 0) return [{ label: "Determinant", value: "0 (singular, no inverse)", emphasize: true }];
    return [
      { label: "Determinant", value: fmt(det, 4), emphasize: true },
      { label: "Inverse row 1", value: `[${fmt(d / det, 4)}, ${fmt(-b / det, 4)}]` },
      { label: "Inverse row 2", value: `[${fmt(-c / det, 4)}, ${fmt(a / det, 4)}]` },
    ];
  },
};

const scientificNotation: CalcDef = {
  title: "Scientific Notation Calculator",
  fields: [{ name: "n", label: "Number", type: "text", default: "0.000452" }],
  compute: (v) => {
    const n = req(v.n, "Number");
    if (n === 0) return [{ label: "Scientific notation", value: "0", emphasize: true }];
    const exp = Math.floor(Math.log10(Math.abs(n)));
    const mant = n / Math.pow(10, exp);
    return [
      { label: "Scientific notation", value: `${fmt(mant, 6)} × 10^${exp}`, emphasize: true },
      { label: "E-notation", value: n.toExponential(6) },
    ];
  },
};

const bigNumber: CalcDef = {
  title: "Big Number Calculator",
  description: "Add, subtract, multiply, or divide two large integers using BigInt.",
  fields: [
    { name: "a", label: "A", type: "text", default: "123456789012345678901234567890" },
    { name: "op", label: "Operation", type: "select", default: "+",
      options: [{ value: "+", label: "+" }, { value: "-", label: "-" }, { value: "*", label: "×" }, { value: "/", label: "÷" }] },
    { name: "b", label: "B", type: "text", default: "987654321098765432109876543210" },
  ],
  compute: (v) => {
    try {
      const a = BigInt(v.a.trim()); const b = BigInt(v.b.trim());
      let r: bigint;
      switch (v.op) {
        case "+": r = a + b; break;
        case "-": r = a - b; break;
        case "*": r = a * b; break;
        case "/": if (b === 0n) return { error: "Divide by zero." }; r = a / b; break;
        default: return { error: "Bad op." };
      }
      return [{ label: "Result", value: r.toString(), emphasize: true }];
    } catch { return { error: "Enter valid integers." }; }
  },
};

// ============================================================
// STATISTICS — new
// ============================================================

const numberSequence: CalcDef = {
  title: "Number Sequence Calculator",
  description: "Generate arithmetic or geometric sequences and their sums.",
  fields: [
    { name: "type", label: "Type", type: "select", default: "arith",
      options: [{ value: "arith", label: "Arithmetic" }, { value: "geo", label: "Geometric" }] },
    { name: "a", label: "First term", default: "1" },
    { name: "d", label: "Common difference / ratio", default: "2" },
    { name: "n", label: "Number of terms", default: "10" },
  ],
  compute: (v) => {
    const a = req(v.a, "a"); const d = req(v.d, "d"); const n = Math.floor(reqPos(v.n, "n"));
    if (n > 500) return { error: "Max 500 terms." };
    const seq: number[] = [];
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const term = v.type === "arith" ? a + i * d : a * Math.pow(d, i);
      seq.push(term); sum += term;
    }
    return [
      { label: "Sequence", value: seq.slice(0, 20).map((x) => fmt(x, 2)).join(", ") + (n > 20 ? "…" : "") },
      { label: "Sum", value: fmt(sum, 4), emphasize: true },
      { label: "Last term", value: fmt(seq[n - 1], 4) },
    ];
  },
};

const sampleSize: CalcDef = {
  title: "Sample Size Calculator",
  description: "Required sample size for a proportion (Cochran's formula).",
  fields: [
    { name: "conf", label: "Confidence level", type: "select", default: "1.96",
      options: [{ value: "1.645", label: "90%" }, { value: "1.96", label: "95%" }, { value: "2.576", label: "99%" }] },
    { name: "p", label: "Expected proportion", default: "0.5" },
    { name: "e", label: "Margin of error", default: "0.05" },
    { name: "N", label: "Population size (0 = infinite)", default: "0" },
  ],
  compute: (v) => {
    const z = reqPos(v.conf, "Z");
    const p = reqPos(v.p, "p");
    const e = reqPos(v.e, "e");
    const N = reqNonNeg(v.N, "N");
    const n0 = (z * z * p * (1 - p)) / (e * e);
    const n = N > 0 ? n0 / (1 + (n0 - 1) / N) : n0;
    return [{ label: "Required sample size", value: String(Math.ceil(n)), emphasize: true }];
  },
};

const confidenceInterval: CalcDef = {
  title: "Confidence Interval Calculator",
  description: "CI for a sample mean (normal approximation).",
  fields: [
    { name: "mean", label: "Sample mean", default: "50" },
    { name: "sd", label: "Sample standard deviation", default: "10" },
    { name: "n", label: "Sample size", default: "30" },
    { name: "conf", label: "Confidence level", type: "select", default: "1.96",
      options: [{ value: "1.645", label: "90%" }, { value: "1.96", label: "95%" }, { value: "2.576", label: "99%" }] },
  ],
  compute: (v) => {
    const m = req(v.mean, "Mean");
    const sd = reqPos(v.sd, "SD");
    const n = reqPos(v.n, "n");
    const z = reqPos(v.conf, "Z");
    const me = z * sd / Math.sqrt(n);
    return [
      { label: "Margin of error", value: fmt(me, 4) },
      { label: "Confidence interval", value: `${fmt(m - me, 4)} — ${fmt(m + me, 4)}`, emphasize: true },
    ];
  },
};

// ============================================================
// OTHER — DATE / TIME
// ============================================================

const timeZone: CalcDef = {
  title: "Time Zone Calculator",
  description: "Convert a time between UTC offsets.",
  fields: [
    { name: "time", label: "Time (HH:MM 24h)", type: "text", default: "14:30" },
    { name: "from", label: "From UTC offset", default: "-5" },
    { name: "to", label: "To UTC offset", default: "1" },
  ],
  compute: (v) => {
    const [h, m] = v.time.split(":").map(Number);
    if (![h, m].every(Number.isFinite)) return { error: "Time must be HH:MM." };
    const from = req(v.from, "From");
    const to = req(v.to, "To");
    let mins = h * 60 + m + (to - from) * 60;
    mins = ((mins % 1440) + 1440) % 1440;
    const hh = Math.floor(mins / 60), mm = mins % 60;
    return [{ label: `Time at UTC${to >= 0 ? "+" : ""}${to}`, value: `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`, emphasize: true }];
  },
};

const dayCounter: CalcDef = {
  title: "Day Counter Calculator",
  description: "Days between two dates, with option to exclude weekends.",
  fields: [
    { name: "from", label: "From (YYYY-MM-DD)", type: "text", default: "2025-01-01" },
    { name: "to", label: "To (YYYY-MM-DD)", type: "text", default: "2025-12-31" },
    { name: "mode", label: "Count", type: "select", default: "all",
      options: [{ value: "all", label: "All days" }, { value: "week", label: "Weekdays only" }] },
  ],
  compute: (v) => {
    const a = new Date(v.from); const b = new Date(v.to);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return { error: "Invalid date." };
    const days = Math.round((b.getTime() - a.getTime()) / 86400000);
    if (v.mode === "all") return [{ label: "Days", value: String(days), emphasize: true }];
    let count = 0;
    const d = new Date(a);
    while (d <= b) { const w = d.getDay(); if (w !== 0 && w !== 6) count++; d.setDate(d.getDate() + 1); }
    return [
      { label: "Total days", value: String(days) },
      { label: "Weekdays", value: String(count), emphasize: true },
    ];
  },
};

// ============================================================
// OTHER — HOUSING / BUILDING
// ============================================================

const concrete: CalcDef = {
  title: "Concrete Calculator",
  description: "Concrete needed for a rectangular slab.",
  fields: [
    { name: "L", label: "Length", suffix: "ft", default: "10" },
    { name: "W", label: "Width", suffix: "ft", default: "10" },
    { name: "T", label: "Thickness", suffix: "in", default: "4" },
  ],
  compute: (v) => {
    const L = reqPos(v.L, "Length"); const W = reqPos(v.W, "Width"); const T = reqPos(v.T, "Thickness") / 12;
    const cf = L * W * T; const cy = cf / 27;
    return [
      { label: "Cubic yards", value: fmt(cy, 2) + " yd³", emphasize: true },
      { label: "Cubic feet", value: fmt(cf, 2) + " ft³" },
      { label: "Cubic meters", value: fmt(cf * 0.0283168, 2) + " m³" },
    ];
  },
};

const btu: CalcDef = {
  title: "BTU Calculator",
  description: "Approximate BTU needed to heat/cool a room.",
  fields: [
    { name: "sqft", label: "Room area", suffix: "ft²", default: "300" },
    { name: "insul", label: "Insulation / climate", type: "select", default: "25",
      options: [
        { value: "20", label: "Well insulated / mild" },
        { value: "25", label: "Average" },
        { value: "30", label: "Poor / hot climate" },
      ] },
  ],
  compute: (v) => {
    const s = reqPos(v.sqft, "Area"); const f = reqPos(v.insul, "Factor");
    return [{ label: "Recommended BTU", value: fmt(s * f, 0) + " BTU/hr", emphasize: true }];
  },
};

const squareFootage: CalcDef = {
  title: "Square Footage Calculator",
  fields: [
    { name: "L", label: "Length", suffix: "ft", default: "20" },
    { name: "W", label: "Width", suffix: "ft", default: "15" },
  ],
  compute: (v) => {
    const a = reqPos(v.L, "L") * reqPos(v.W, "W");
    return [
      { label: "Square feet", value: fmt(a, 2) + " ft²", emphasize: true },
      { label: "Square meters", value: fmt(a * 0.092903, 2) + " m²" },
      { label: "Square yards", value: fmt(a / 9, 2) + " yd²" },
    ];
  },
};

const stair: CalcDef = {
  title: "Stair Calculator",
  description: "Compute rise/run for a staircase.",
  fields: [
    { name: "H", label: "Total rise", suffix: "in", default: "108" },
    { name: "R", label: "Target riser height", suffix: "in", default: "7.5" },
    { name: "T", label: "Tread depth", suffix: "in", default: "10" },
  ],
  compute: (v) => {
    const H = reqPos(v.H, "Rise"); const R = reqPos(v.R, "Riser"); const T = reqPos(v.T, "Tread");
    const steps = Math.round(H / R);
    const actualRise = H / steps;
    const run = (steps - 1) * T;
    return [
      { label: "Number of steps", value: String(steps), emphasize: true },
      { label: "Actual riser height", value: fmt(actualRise, 2) + " in" },
      { label: "Total run", value: fmt(run, 2) + " in" },
      { label: "Stringer length", value: fmt(Math.sqrt(H * H + run * run), 2) + " in" },
    ];
  },
};

const roofing: CalcDef = {
  title: "Roofing Calculator",
  description: "Roof area with pitch factor.",
  fields: [
    { name: "L", label: "Building length", suffix: "ft", default: "40" },
    { name: "W", label: "Building width", suffix: "ft", default: "30" },
    { name: "pitch", label: "Pitch (rise per 12 in)", default: "6" },
  ],
  compute: (v) => {
    const L = reqPos(v.L, "L"); const W = reqPos(v.W, "W"); const p = reqNonNeg(v.pitch, "Pitch");
    const factor = Math.sqrt(1 + (p / 12) ** 2);
    const flat = L * W;
    const area = flat * factor;
    return [
      { label: "Roof area", value: fmt(area, 0) + " ft²", emphasize: true },
      { label: "Squares (100 ft²)", value: fmt(area / 100, 2) },
    ];
  },
};

const tile: CalcDef = {
  title: "Tile Calculator",
  fields: [
    { name: "area", label: "Total floor area", suffix: "ft²", default: "150" },
    { name: "tw", label: "Tile width", suffix: "in", default: "12" },
    { name: "th", label: "Tile height", suffix: "in", default: "12" },
    { name: "waste", label: "Waste factor", suffix: "%", default: "10" },
  ],
  compute: (v) => {
    const a = reqPos(v.area, "Area");
    const tw = reqPos(v.tw, "TW") / 12; const th = reqPos(v.th, "TH") / 12;
    const per = tw * th;
    const tiles = Math.ceil((a * (1 + reqNonNeg(v.waste, "Waste") / 100)) / per);
    return [{ label: "Tiles needed", value: String(tiles), emphasize: true }];
  },
};

const mulch: CalcDef = {
  title: "Mulch Calculator",
  fields: [
    { name: "L", label: "Length", suffix: "ft", default: "20" },
    { name: "W", label: "Width", suffix: "ft", default: "10" },
    { name: "D", label: "Depth", suffix: "in", default: "3" },
  ],
  compute: (v) => {
    const cf = reqPos(v.L, "L") * reqPos(v.W, "W") * (reqPos(v.D, "D") / 12);
    return [
      { label: "Cubic yards", value: fmt(cf / 27, 2) + " yd³", emphasize: true },
      { label: "Cubic feet", value: fmt(cf, 2) + " ft³" },
      { label: "2 ft³ bags", value: String(Math.ceil(cf / 2)) },
    ];
  },
};

const gravel: CalcDef = { ...mulch, title: "Gravel Calculator" };

// ============================================================
// OTHER — MEASUREMENTS
// ============================================================

const heightCalc: CalcDef = {
  title: "Height Calculator",
  description: "Convert height between ft/in and cm.",
  fields: [
    { name: "ft", label: "Feet", default: "5" },
    { name: "in", label: "Inches", default: "10" },
  ],
  compute: (v) => {
    const f = reqNonNeg(v.ft, "Feet"); const i = reqNonNeg(v.in, "Inches");
    const totalIn = f * 12 + i;
    const cm = totalIn * 2.54;
    return [
      { label: "Total inches", value: fmt(totalIn, 2) + " in" },
      { label: "Centimeters", value: fmt(cm, 2) + " cm", emphasize: true },
      { label: "Meters", value: fmt(cm / 100, 3) + " m" },
    ];
  },
};

const gdpCalc: CalcDef = {
  title: "GDP Calculator",
  description: "GDP by expenditure: C + I + G + (X − M).",
  fields: [
    { name: "C", label: "Consumption", suffix: "$B", default: "12000" },
    { name: "I", label: "Investment", suffix: "$B", default: "3500" },
    { name: "G", label: "Government spending", suffix: "$B", default: "4000" },
    { name: "X", label: "Exports", suffix: "$B", default: "2500" },
    { name: "M", label: "Imports", suffix: "$B", default: "3000" },
  ],
  compute: (v) => {
    const gdp = req(v.C, "C") + req(v.I, "I") + req(v.G, "G") + req(v.X, "X") - req(v.M, "M");
    return [{ label: "GDP", value: "$" + fmt(gdp, 2) + " B", emphasize: true }];
  },
};

const molarity: CalcDef = {
  title: "Molarity Calculator",
  description: "Molarity = moles / liters.",
  fields: [
    { name: "moles", label: "Moles of solute", default: "0.5" },
    { name: "vol", label: "Solution volume", suffix: "L", default: "2" },
  ],
  compute: (v) => {
    const M = reqPos(v.moles, "Moles") / reqPos(v.vol, "Volume");
    return [{ label: "Molarity", value: fmt(M, 4) + " M", emphasize: true }];
  },
};

const molecularWeight: CalcDef = {
  title: "Molecular Weight Calculator",
  description: "Parse a chemical formula (e.g. H2O, C6H12O6) and compute molecular weight.",
  fields: [{ name: "f", label: "Formula", type: "text", default: "C6H12O6" }],
  compute: (v) => {
    const weights: Record<string, number> = { H:1.008,He:4.0026,Li:6.94,Be:9.0122,B:10.81,C:12.011,N:14.007,O:15.999,F:18.998,Ne:20.180,Na:22.990,Mg:24.305,Al:26.982,Si:28.085,P:30.974,S:32.06,Cl:35.45,K:39.098,Ar:39.948,Ca:40.078,Fe:55.845,Cu:63.546,Zn:65.38,Br:79.904,Ag:107.868,I:126.904,Au:196.967,Hg:200.59,Pb:207.2 };
    const re = /([A-Z][a-z]?)(\d*)/g;
    let total = 0; let m: RegExpExecArray | null; let matched = "";
    while ((m = re.exec(v.f)) !== null) {
      if (!m[1]) continue;
      const w = weights[m[1]];
      if (w === undefined) return { error: `Unknown element ${m[1]}` };
      const count = m[2] ? parseInt(m[2], 10) : 1;
      total += w * count; matched += m[0];
    }
    if (!matched) return { error: "Enter a formula like H2O." };
    return [{ label: "Molecular weight", value: fmt(total, 4) + " g/mol", emphasize: true }];
  },
};

// ============================================================
// OTHER — ELECTRONICS
// ============================================================

const voltageDrop: CalcDef = {
  title: "Voltage Drop Calculator",
  description: "V = 2 × L × I × R / 1000 (single-phase, copper).",
  fields: [
    { name: "L", label: "One-way length", suffix: "ft", default: "100" },
    { name: "I", label: "Current", suffix: "A", default: "15" },
    { name: "R", label: "Resistance per 1000 ft", suffix: "Ω", default: "1.588" },
    { name: "V", label: "Source voltage", suffix: "V", default: "120" },
  ],
  compute: (v) => {
    const L = reqPos(v.L, "L"); const I = reqPos(v.I, "I"); const R = reqPos(v.R, "R"); const V = reqPos(v.V, "V");
    const drop = (2 * L * I * R) / 1000;
    return [
      { label: "Voltage drop", value: fmt(drop, 3) + " V", emphasize: true },
      { label: "% drop", value: fmt((drop / V) * 100, 2) + "%" },
      { label: "Voltage at load", value: fmt(V - drop, 2) + " V" },
    ];
  },
};

const resistor: CalcDef = {
  title: "Resistor Calculator",
  description: "Decode a 4-band resistor color code.",
  fields: [
    { name: "b1", label: "Band 1", type: "select", default: "1", options: colorOpts() },
    { name: "b2", label: "Band 2", type: "select", default: "0", options: colorOpts() },
    { name: "mult", label: "Multiplier", type: "select", default: "2", options: colorOpts() },
    { name: "tol", label: "Tolerance", type: "select", default: "5",
      options: [{ value: "1", label: "Brown ±1%" }, { value: "2", label: "Red ±2%" }, { value: "5", label: "Gold ±5%" }, { value: "10", label: "Silver ±10%" }] },
  ],
  compute: (v) => {
    const digits = parseInt(String(v.b1), 10) * 10 + parseInt(String(v.b2), 10);
    const val = digits * Math.pow(10, parseInt(String(v.mult), 10));
    return [
      { label: "Resistance", value: formatResistance(val), emphasize: true },
      { label: "Tolerance", value: "±" + v.tol + "%" },
    ];
  },
};

const electricity: CalcDef = {
  title: "Electricity Calculator",
  description: "Estimate monthly electricity cost.",
  fields: [
    { name: "W", label: "Power", suffix: "W", default: "500" },
    { name: "hrs", label: "Hours per day", default: "5" },
    { name: "rate", label: "Rate", suffix: "$/kWh", default: "0.15" },
  ],
  compute: (v) => {
    const W = reqPos(v.W, "W"); const h = reqPos(v.hrs, "Hours"); const r = reqPos(v.rate, "Rate");
    const kwh = (W / 1000) * h;
    return [
      { label: "Daily kWh", value: fmt(kwh, 3) + " kWh" },
      { label: "Monthly cost (30d)", value: money(kwh * 30 * r), emphasize: true },
      { label: "Annual cost", value: money(kwh * 365 * r) },
    ];
  },
};

// ============================================================
// OTHER — INTERNET
// ============================================================

const ipSubnet: CalcDef = {
  title: "IP Subnet Calculator",
  description: "IPv4 subnet from address and CIDR mask.",
  fields: [
    { name: "ip", label: "IP address", type: "text", default: "192.168.1.10" },
    { name: "cidr", label: "CIDR", default: "24" },
  ],
  compute: (v) => {
    const parts = v.ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255))
      return { error: "Invalid IPv4 address." };
    const c = Math.floor(reqPos(v.cidr, "CIDR"));
    if (c < 0 || c > 32) return { error: "CIDR must be 0-32." };
    const ipInt = (parts[0] << 24 | parts[1] << 16 | parts[2] << 8 | parts[3]) >>> 0;
    const mask = c === 0 ? 0 : (0xFFFFFFFF << (32 - c)) >>> 0;
    const net = (ipInt & mask) >>> 0;
    const bcast = (net | (~mask >>> 0)) >>> 0;
    const total = c === 32 ? 1 : Math.pow(2, 32 - c);
    const usable = c >= 31 ? total : total - 2;
    const toIp = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
    return [
      { label: "Network", value: toIp(net), emphasize: true },
      { label: "Broadcast", value: toIp(bcast) },
      { label: "Subnet mask", value: toIp(mask) },
      { label: "Total addresses", value: String(total) },
      { label: "Usable hosts", value: String(usable) },
      { label: "First usable", value: c >= 31 ? "—" : toIp(net + 1) },
      { label: "Last usable", value: c >= 31 ? "—" : toIp(bcast - 1) },
    ];
  },
};

const bandwidth: CalcDef = {
  title: "Bandwidth Calculator",
  description: "Time to transfer a file at a given bandwidth.",
  fields: [
    { name: "size", label: "File size", default: "10" },
    { name: "sizeUnit", label: "File unit", type: "select", default: "GB",
      options: [{ value: "MB", label: "MB" }, { value: "GB", label: "GB" }, { value: "TB", label: "TB" }] },
    { name: "bw", label: "Bandwidth", default: "100" },
    { name: "bwUnit", label: "Bandwidth unit", type: "select", default: "Mbps",
      options: [{ value: "Mbps", label: "Mbps" }, { value: "Gbps", label: "Gbps" }] },
  ],
  compute: (v) => {
    const sizeMul: Record<string, number> = { MB: 1, GB: 1024, TB: 1024 * 1024 };
    const bwMul: Record<string, number> = { Mbps: 1, Gbps: 1000 };
    const mb = reqPos(v.size, "Size") * sizeMul[v.sizeUnit]; // MB
    const mbps = reqPos(v.bw, "BW") * bwMul[v.bwUnit];
    const sec = (mb * 8) / mbps;
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.round(sec % 60);
    return [
      { label: "Transfer time", value: `${h}h ${m}m ${s}s`, emphasize: true },
      { label: "Seconds", value: fmt(sec, 1) },
    ];
  },
};

// ============================================================
// OTHER — EVERYDAY UTILITY
// ============================================================

const braSize: CalcDef = {
  title: "Bra Size Calculator",
  description: "US bra size from band and bust (inches).",
  fields: [
    { name: "band", label: "Under-bust measurement", suffix: "in", default: "31" },
    { name: "bust", label: "Bust measurement", suffix: "in", default: "36" },
  ],
  compute: (v) => {
    const band = reqPos(v.band, "Band");
    const bust = reqPos(v.bust, "Bust");
    let bandSize = Math.round(band);
    if (bandSize % 2 !== 0) bandSize += 1;
    const diff = Math.round(bust - bandSize);
    const cups = ["AA","A","B","C","D","DD","DDD","G","H"];
    const cup = diff <= 0 ? "AA" : cups[Math.min(diff, cups.length - 1)];
    return [{ label: "Bra size", value: `${bandSize}${cup}`, emphasize: true }];
  },
};

const shoeSize: CalcDef = {
  title: "Shoe Size Conversion Calculator",
  description: "Convert US men's shoe size to UK / EU / cm.",
  fields: [
    { name: "us", label: "US men's size", default: "10" },
  ],
  compute: (v) => {
    const us = reqPos(v.us, "US");
    const uk = us - 0.5;
    const eu = Math.round((us + 33) * 10) / 10;
    const cm = 24.6 + (us - 8) * 0.847;
    return [
      { label: "UK", value: fmt(uk, 1), emphasize: true },
      { label: "EU", value: fmt(eu, 1) },
      { label: "Foot length", value: fmt(cm, 1) + " cm" },
    ];
  },
};

const golfHandicap: CalcDef = {
  title: "Golf Handicap Calculator",
  description: "Handicap index from a single round: (Score − Rating) × 113 / Slope.",
  fields: [
    { name: "score", label: "Adjusted gross score", default: "92" },
    { name: "rating", label: "Course rating", default: "72.1" },
    { name: "slope", label: "Slope rating", default: "125" },
  ],
  compute: (v) => {
    const s = reqPos(v.score, "Score");
    const r = reqPos(v.rating, "Rating");
    const sl = reqPos(v.slope, "Slope");
    const diff = (s - r) * 113 / sl;
    return [{ label: "Handicap differential", value: fmt(diff, 1), emphasize: true }];
  },
};

// ============================================================
// OTHER — TRANSPORTATION
// ============================================================

const horsepower: CalcDef = {
  title: "Horsepower Calculator",
  description: "HP from torque and RPM (imperial).",
  fields: [
    { name: "T", label: "Torque", suffix: "lb-ft", default: "300" },
    { name: "N", label: "Engine RPM", default: "5000" },
  ],
  compute: (v) => {
    const T = reqPos(v.T, "T"); const N = reqPos(v.N, "N");
    const hp = (T * N) / 5252;
    return [
      { label: "Horsepower", value: fmt(hp, 2) + " hp", emphasize: true },
      { label: "Kilowatts", value: fmt(hp * 0.7457, 2) + " kW" },
    ];
  },
};

const tireSize: CalcDef = {
  title: "Tire Size Calculator",
  description: "Compute overall diameter, circumference and revs/mile for a tire (e.g. 225/50R17).",
  fields: [
    { name: "W", label: "Section width", suffix: "mm", default: "225" },
    { name: "A", label: "Aspect ratio", suffix: "%", default: "50" },
    { name: "R", label: "Wheel diameter", suffix: "in", default: "17" },
  ],
  compute: (v) => {
    const W = reqPos(v.W, "Width");
    const A = reqPos(v.A, "Aspect");
    const R = reqPos(v.R, "Wheel");
    const sidewallIn = (W * (A / 100)) / 25.4;
    const dIn = R + 2 * sidewallIn;
    const circ = Math.PI * dIn;
    return [
      { label: "Overall diameter", value: fmt(dIn, 2) + " in (" + fmt(dIn * 25.4, 1) + " mm)", emphasize: true },
      { label: "Circumference", value: fmt(circ, 2) + " in" },
      { label: "Revolutions per mile", value: fmt(63360 / circ, 0) },
    ];
  },
};

function colorOpts() {
  return [
    { value: "0", label: "Black (0)" }, { value: "1", label: "Brown (1)" },
    { value: "2", label: "Red (2)" }, { value: "3", label: "Orange (3)" },
    { value: "4", label: "Yellow (4)" }, { value: "5", label: "Green (5)" },
    { value: "6", label: "Blue (6)" }, { value: "7", label: "Violet (7)" },
    { value: "8", label: "Gray (8)" }, { value: "9", label: "White (9)" },
  ];
}
function formatResistance(v: number): string {
  if (v >= 1e6) return fmt(v / 1e6, 3) + " MΩ";
  if (v >= 1e3) return fmt(v / 1e3, 3) + " kΩ";
  return fmt(v, 3) + " Ω";
}




// ============================================================
// REGISTRY (map both alias slugs)
// ============================================================

export const CALCULATORS: Record<string, CalcDef> = {
  // Financial
  "financial/mortgage": mortgage,
  "financial/loan": loan,
  "financial/auto-loan": autoLoan,
  "financial/personal-loan": personalLoan,
  "financial/business-loan": businessLoan,
  "financial/student-loan": studentLoan,
  "financial/boat-loan": boatLoan,
  "financial/compound-interest": compoundInterest,
  "financial/simple-interest": simpleInterest,
  "financial/interest": simpleInterest,
  "financial/interest-rate": compoundInterest,
  "financial/present-value": presentValue,
  "financial/future-value": futureValue,
  "financial/roi": roi,
  "financial/sales-tax": salesTax,
  "financial/vat": vat,
  "financial/inflation": inflation,
  "financial/discount": discount,
  "financial/salary": salary,
  "financial/take-home-paycheck": salary,
  "financial/down-payment": downPayment,
  "financial/savings": savings,
  "financial/cd": cd,
  "financial/investment": compoundInterest,
  "financial/finance": compoundInterest,
  "financial/average-return": roi,
  "financial/amortization": amortization,
  "financial/mortgage-payoff": mortgagePayoff,
  "financial/refinance": refinance,
  "financial/house-affordability": houseAffordability,
  "financial/rent": rentCalc,
  "financial/debt-to-income-ratio": dti,
  "financial/real-estate": realEstate,
  "financial/rental-property": rentalProperty,
  "financial/apr": apr,
  "financial/fha-loan": fhaLoan,
  "financial/va-mortgage": vaMortgage,
  "financial/home-equity-loan": homeEquityLoan,
  "financial/heloc": heloc,
  "financial/rent-vs-buy": rentVsBuy,
  "financial/cash-back-or-low-interest": cashBackVsLow,
  "financial/auto-lease": autoLease,
  "financial/retirement": retirement,
  "financial/401k": k401,
  "financial/pension": pension,
  "financial/social-security": socialSecurity,
  "financial/annuity": annuity,
  "financial/annuity-payout": annuityPayout,
  "financial/roth-ira": rothIRA,
  "financial/ira": ira,
  "financial/rmd": rmd,
  "financial/mutual-fund": mutualFund,
  "financial/irr": irrCalc,
  "financial/payback-period": paybackPeriod,
  "financial/bond": presentValue,
  "financial/income-tax": incomeTax,
  "financial/marriage-tax": marriageTax,
  "financial/estate-tax": estateTax,
  "financial/payment": paymentCalc,
  "financial/currency": currencyCalc,
  "financial/credit-card": creditCard,
  "financial/credit-cards-payoff": creditCardsPayoff,
  "financial/debt-payoff": debtPayoff,
  "financial/debt-consolidation": debtConsolidation,
  "financial/repayment": loan,
  "financial/college-cost": collegeCost,
  "financial/depreciation": depreciation,
  "financial/lease": leaseCalc,
  "financial/budget": budget,
  "financial/commission": commission,

  // Fitness
  "fitness-and-health/bmi": bmi,
  "fitness-and-health/bmr": bmr,
  "fitness-and-health/tdee": tdee,
  "fitness-and-health/calorie": calorie,
  "fitness-and-health/body-fat": bodyFat,
  "fitness-and-health/ideal-weight": idealWeight,
  "fitness-and-health/healthy-weight": idealWeight,
  "fitness-and-health/lean-body-mass": idealWeight,
  "fitness-and-health/one-rep-max": oneRepMax,
  "fitness-and-health/target-heart-rate": targetHR,
  "fitness-and-health/due-date": dueDate,
  "fitness-and-health/pregnancy": dueDate,
  "fitness-and-health/ovulation": dueDate,
  "fitness-and-health/pace": pace,
  "fitness-and-health/army-body-fat": armyBodyFat,
  "fitness-and-health/calories-burned": caloriesBurned,
  "fitness-and-health/pregnancy-weight-gain": pregnancyWeightGain,
  "fitness-and-health/period": periodCalc,
  "fitness-and-health/macro": macro,
  "fitness-and-health/carbohydrate": carbCalc,
  "fitness-and-health/protein": proteinCalc,
  "fitness-and-health/fat-intake": fatIntake,
  "fitness-and-health/gfr": gfr,
  "fitness-and-health/body-type": bodyType,
  "fitness-and-health/body-surface-area": bodySurfaceArea,
  "fitness-and-health/bac": bac,

  // Math
  "math/percentage": percentage,
  "math/percent-error": percentError,
  "math/fraction": fraction,
  "math/least-common-multiple": lcmCalc,
  "math/greatest-common-factor": gcfCalc,
  "math/exponent": exponent,
  "math/log": logCalc,
  "math/root": rootCalc,
  "math/ratio": ratio,
  "math/rounding": rounding,
  "math/quadratic-formula": quadratic,
  "math/random-number-generator": randomNumber,
  "math/binary": binary,
  "math/hex": hexCalc,
  "math/half-life": halfLife,
  "math/mean-median-mode-range": meanMedianMode,
  "math/statistics": meanMedianMode,
  "math/standard-deviation": stdDev,
  "math/z-score": zScore,
  "math/permutation-and-combination": permComb,
  "math/probability": permComb,
  "math/circle": circle,
  "math/right-triangle": rightTriangle,
  "math/pythagorean-theorem": pythag,
  "math/triangle": triangle,
  "math/area": areaCalc,
  "math/volume": volumeCalc,
  "math/surface-area": areaCalc,
  "math/slope": slope,
  "math/distance": distance,
  "math/scientific": scientific,
  "math/factor": factorCalc,
  "math/matrix": matrixCalc,
  "math/scientific-notation": scientificNotation,
  "math/big-number": bigNumber,
  "math/number-sequence": numberSequence,
  "math/sample-size": sampleSize,
  "math/confidence-interval": confidenceInterval,

  // Other
  "other/age": ageCalc,
  "other/date": dateDiff,
  "other/day-of-the-week": dayOfWeek,
  "other/time-duration": timeDuration,
  "other/hours": timeDuration,
  "other/time": timeDuration,
  "other/time-card": timeDuration,
  "other/time-zone": timeZone,
  "other/day-counter": dayCounter,
  "other/gpa": gpaCalc,
  "other/grade": gradeCalc,
  "other/fuel-cost": fuelCost,
  "other/gas-mileage": gasMileage,
  "other/mileage": gasMileage,
  "other/password-generator": passwordGen,
  "other/base64-encode-decode": base64Calc,
  "other/url-encode-decode": urlCalc,
  "other/roman-numeral-converter": romanCalc,
  "other/dice-roller": diceRoll,
  "other/love-calculator": loveCalc,
  "other/wind-chill": windChill,
  "other/heat-index": heatIndex,
  "other/dew-point": dewPoint,
  "other/ohms-law": ohmsLaw,
  "other/speed": speed,
  "other/conversion": conversion,
  "other/tip": tipCalc,
  "other/bmi": bmiOther,
  "other/sleep": sleepCalc,
  "other/concrete": concrete,
  "other/btu": btu,
  "other/square-footage": squareFootage,
  "other/stair": stair,
  "other/roofing": roofing,
  "other/tile": tile,
  "other/mulch": mulch,
  "other/gravel": gravel,
  "other/height": heightCalc,
  "other/gdp": gdpCalc,
  "other/molarity": molarity,
  "other/molecular-weight": molecularWeight,
  "other/voltage-drop": voltageDrop,
  "other/resistor": resistor,
  "other/electricity": electricity,
  "other/ip-subnet": ipSubnet,
  "other/bandwidth": bandwidth,
  "other/bra-size": braSize,
  "other/shoe-size-conversion": shoeSize,
  "other/golf-handicap": golfHandicap,
  "other/horsepower": horsepower,
  "other/engine-horsepower": horsepower,
  "other/tire-size": tireSize,
};


export function getCalculator(category: string, slug: string): CalcDef | undefined {
  return CALCULATORS[`${category}/${slug}`];
}
