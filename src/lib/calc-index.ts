import { calcHref } from "./slug";

export type CalcEntry = { name: string; category: string; categoryLabel: string; href: string };

const CATEGORY_LABEL: Record<string, string> = {
  financial: "Financial",
  "fitness-and-health": "Fitness and Health",
  math: "Math",
  other: "Other",
};

const FINANCIAL = [
  "Mortgage","Amortization","Mortgage Payoff","House Affordability","Rent","Debt-to-Income Ratio","Real Estate","Refinance","Rental Property","APR","FHA Loan","VA Mortgage","Home Equity Loan","HELOC","Down Payment","Rent vs Buy",
  "Auto Loan","Cash Back or Low Interest","Auto Lease",
  "Interest","Investment","Finance","Compound Interest","Interest Rate","Savings","Simple Interest","CD","Bond","Mutual Fund","Average Return","IRR","ROI","Payback Period","Present Value","Future Value",
  "Retirement","401K","Pension","Social Security","Annuity","Annuity Payout","Roth IRA","IRA","RMD",
  "Income Tax","Salary","Marriage Tax","Estate Tax","Take-Home-Paycheck",
  "Loan","Payment","Currency","Inflation","Sales Tax","Credit Card","Credit Cards Payoff","Debt Payoff","Debt Consolidation","Repayment","Student Loan","College Cost","VAT","Depreciation","Margin","Discount","Business Loan","Personal Loan","Boat Loan","Lease","Budget","Commission",
];

const FITNESS = [
  "BMI","Calorie","Body Fat","BMR","Ideal Weight","Pace","Army Body Fat","Lean Body Mass","Healthy Weight","Calories Burned","One Rep Max","Target Heart Rate",
  "Pregnancy","Pregnancy Weight Gain","Due Date","Ovulation","Period",
  "Macro","Carbohydrate","Protein","Fat Intake","TDEE","GFR","Body Type","Body Surface Area","BAC",
];

const MATH = [
  "Scientific","Fraction","Percentage","Random Number Generator","Percent Error","Exponent","Binary","Hex","Half-Life","Quadratic Formula","Log","Ratio","Root","Least Common Multiple","Greatest Common Factor","Factor","Rounding","Matrix","Scientific Notation","Big Number",
  "Standard Deviation","Number Sequence","Sample Size","Probability","Statistics","Mean/Median/Mode/Range","Permutation and Combination","Z-score","Confidence Interval",
  "Triangle","Volume","Slope","Area","Distance","Circle","Surface Area","Pythagorean Theorem","Right Triangle",
];

const OTHER = [
  "Age","Date","Time","Hours","Time Card","Time Zone","Time Duration","Day Counter","Day of the Week",
  "Concrete","BTU","Square Footage","Stair","Roofing","Tile","Mulch","Gravel",
  "Height","Conversion","GDP","Density","Mass","Weight","Speed","Molarity","Molecular Weight","Roman Numeral Converter",
  "Voltage Drop","Resistor","Ohms Law","Electricity",
  "IP Subnet","Password Generator","Bandwidth","Base64 Encode/Decode","URL Encode/Decode",
  "GPA","Grade","Bra Size","Shoe Size Conversion","Tip","Golf Handicap","Sleep",
  "Wind Chill","Heat Index","Dew Point",
  "Fuel Cost","Gas Mileage","Horsepower","Engine Horsepower","Mileage","Tire Size",
  "Dice Roller","Love Calculator",
];

function build(cat: string, items: string[]): CalcEntry[] {
  return items.map((name) => ({
    name,
    category: cat,
    categoryLabel: CATEGORY_LABEL[cat],
    href: calcHref(cat, name),
  }));
}

export const ALL_CALCULATORS: CalcEntry[] = [
  ...build("financial", FINANCIAL),
  ...build("fitness-and-health", FITNESS),
  ...build("math", MATH),
  ...build("other", OTHER),
];

export function searchCalculators(q: string, limit = 40): CalcEntry[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const tokens = s.split(/\s+/);
  return ALL_CALCULATORS.filter((c) => {
    const hay = (c.name + " " + c.categoryLabel).toLowerCase();
    return tokens.every((t) => hay.includes(t));
  }).slice(0, limit);
}
