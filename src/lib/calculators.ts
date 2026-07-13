import type { CalcDef } from "./calc-framework";
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

const autoLoan: CalcDef = { ...loan, title: "Auto Loan Calculator", description: "Estimate car loan monthly payments." };
const personalLoan: CalcDef = { ...loan, title: "Personal Loan Calculator" };
const businessLoan: CalcDef = { ...loan, title: "Business Loan Calculator" };
const studentLoan: CalcDef = { ...loan, title: "Student Loan Calculator" };
const boatLoan: CalcDef = { ...loan, title: "Boat Loan Calculator" };

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
const vat: CalcDef = { ...salesTax, title: "VAT Calculator" };

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
  "fitness-and-health/pregnancy-conception": dueDate,
  "fitness-and-health/conception": dueDate,
  "fitness-and-health/pace": pace,

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

  // Other
  "other/age": ageCalc,
  "other/date": dateDiff,
  "other/day-of-the-week": dayOfWeek,
  "other/time-duration": timeDuration,
  "other/hours": timeDuration,
  "other/time": timeDuration,
  "other/time-card": timeDuration,
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
};

export function getCalculator(category: string, slug: string): CalcDef | undefined {
  return CALCULATORS[`${category}/${slug}`];
}
