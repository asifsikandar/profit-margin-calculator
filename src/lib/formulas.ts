/**
 * Plain-text formula explanations shown on each calculator page.
 * Keyed by "category/slug" (same keys as the CALCULATORS registry).
 */

const LOAN_F = `Monthly payment (amortised loan):
P = L x i / (1 - (1 + i)^-n)

L = loan amount, i = annual rate / 12 / 100, n = months
Total paid = P x n      Total interest = (P x n) - L`;

const MORTGAGE_F = `Principal & interest:
P = L x i / (1 - (1 + i)^-n)

L = home price - down payment, i = monthly rate, n = years x 12
Total monthly = P + property tax/12 + insurance/12 + HOA`;

const COMPOUND_F = `Future value with compounding:
FV = PV x (1 + r/m)^(m x t)

r = annual rate (decimal), m = compounds per year, t = years
Interest earned = FV - PV`;

const RETIRE_F = `Balance at retirement:
FV = B x (1 + i)^n + C x [((1 + i)^n - 1) / i]

B = current balance, C = monthly contribution,
i = annual return / 12, n = months until retirement`;

export const FORMULAS: Record<string, string> = {
  // ---------- Financial ----------
  "financial/mortgage": MORTGAGE_F,
  "financial/loan": LOAN_F,
  "financial/auto-loan": LOAN_F,
  "financial/personal-loan": LOAN_F,
  "financial/business-loan": LOAN_F,
  "financial/student-loan": LOAN_F,
  "financial/boat-loan": LOAN_F,
  "financial/repayment": LOAN_F,
  "financial/payment": LOAN_F,
  "financial/compound-interest": COMPOUND_F,
  "financial/investment": COMPOUND_F,
  "financial/finance": COMPOUND_F,
  "financial/interest-rate": COMPOUND_F,
  "financial/simple-interest": `Simple interest:
I = P x r x t        Total = P + I

P = principal, r = annual rate (decimal), t = years`,
  "financial/interest": `Simple interest:
I = P x r x t        Total = P + I`,
  "financial/present-value": `Present value of a future amount:
PV = FV / (1 + r)^n`,
  "financial/future-value": `Future value of a present amount:
FV = PV x (1 + r)^n`,
  "financial/bond": `Bond price = present value of coupons + present value of face value:
Price = SUM[ C / (1 + y)^t ] + F / (1 + y)^n`,
  "financial/roi": `Return on investment:
ROI % = (Gain - Cost) / Cost x 100
Annualised ROI % = ((Final / Initial)^(1/years) - 1) x 100`,
  "financial/average-return": `Annualised (CAGR) return:
CAGR % = ((Final / Initial)^(1 / years) - 1) x 100`,
  "financial/sales-tax": `Sales tax:
Tax = Price x rate / 100        Total = Price + Tax`,
  "financial/vat": `Value added tax:
VAT = Net x rate / 100          Gross = Net + VAT
Net from gross = Gross / (1 + rate/100)`,
  "financial/inflation": `Inflation adjustment:
Future cost = Amount x (1 + inflation)^years
Real value = Amount / (1 + inflation)^years`,
  "financial/discount": `Discount:
Savings = Price x discount% / 100
Final price = Price - Savings`,
  "financial/salary": `Salary conversions:
Annual = Hourly x hours/week x weeks/year
Monthly = Annual / 12        Weekly = Annual / 52`,
  "financial/take-home-paycheck": `Take-home pay:
Net = Gross - taxes - deductions
Net per period = Net annual / pay periods per year`,
  "financial/down-payment": `Down payment:
Down payment = Price x percent / 100
Loan amount = Price - Down payment`,
  "financial/savings": `Savings growth with regular deposits:
FV = P x (1 + i)^n + D x [((1 + i)^n - 1) / i]`,
  "financial/cd": `Certificate of deposit:
Maturity value = P x (1 + r/m)^(m x t)
APY = (1 + r/m)^m - 1`,
  "financial/amortization": `Each month:
Interest = balance x monthly rate
Principal = payment - interest
New balance = balance - principal`,
  "financial/mortgage-payoff": `Extra payments reduce the balance faster:
Balance(next) = Balance - (Payment + Extra - Balance x i)
Months saved = original term - months until balance = 0`,
  "financial/refinance": `Refinance break-even:
New payment from P = L x i / (1 - (1 + i)^-n)
Break-even months = Closing costs / (Old payment - New payment)`,
  "financial/house-affordability": `Affordability from debt ratios:
Max housing payment = Monthly income x front-end ratio
Max total debt = Monthly income x back-end ratio
Loan = payment capacity solved back through the mortgage formula`,
  "financial/rent": `Affordable rent:
Max rent = Gross monthly income x rent-to-income ratio (typically 30%)`,
  "financial/debt-to-income-ratio": `Debt-to-income:
DTI % = Total monthly debt payments / Gross monthly income x 100`,
  "financial/real-estate": `Investment returns:
Cap rate % = Net operating income / Property value x 100
Cash-on-cash % = Annual cash flow / Cash invested x 100`,
  "financial/rental-property": `Rental analysis:
NOI = Gross rent - operating expenses (annual)
Cash flow = NOI - debt service
Cap rate % = NOI / Purchase price x 100`,
  "financial/apr": `APR includes fees in the cost of borrowing:
Solve for rate where loan amount - fees = present value of all payments.
APR > nominal rate whenever fees are charged.`,
  "financial/fha-loan": MORTGAGE_F,
  "financial/va-mortgage": MORTGAGE_F,
  "financial/home-equity-loan": LOAN_F,
  "financial/heloc": LOAN_F,
  "financial/rent-vs-buy": `Compare total cost over the holding period:
Rent cost = rent x months (grown by rent inflation)
Buy cost = down payment + payments + taxes + upkeep - equity - appreciation`,
  "financial/cash-back-or-low-interest": `Compare both offers by total cost:
Cash back: loan = price - rebate at market rate
Low interest: loan = price at promotional rate
Choose the option with the lower total of all payments.`,
  "financial/auto-lease": `Lease payment:
Depreciation = (Cap cost - Residual) / months
Finance charge = (Cap cost + Residual) x money factor
Payment = Depreciation + Finance charge (+ tax)`,
  "financial/retirement": RETIRE_F,
  "financial/401k": RETIRE_F,
  "financial/roth-ira": RETIRE_F,
  "financial/ira": RETIRE_F,
  "financial/pension": `Defined benefit pension:
Annual pension = Years of service x accrual rate x final average salary`,
  "financial/social-security": `Benefit estimate:
AIME = highest 35 years of indexed earnings / 420 months
PIA applies bend-point percentages, then adjusts for claiming age.`,
  "financial/annuity": `Future value of an annuity:
FV = PMT x [((1 + i)^n - 1) / i]`,
  "financial/annuity-payout": `Payout from a balance:
PMT = B x i / (1 - (1 + i)^-n)`,
  "financial/rmd": `Required minimum distribution:
RMD = Account balance on Dec 31 / IRS life expectancy factor for your age`,
  "financial/mutual-fund": `Growth net of fees:
FV = P x (1 + r - expense ratio)^n plus contributions compounded the same way`,
  "financial/irr": `Internal rate of return solves:
0 = SUM[ CF(t) / (1 + IRR)^t ]
Found numerically by iteration.`,
  "financial/payback-period": `Payback period:
Years = Initial investment / Annual cash inflow
(with uneven flows, count years until cumulative flow >= investment)`,
  "financial/income-tax": `Progressive tax:
Tax = SUM over brackets of (income in bracket x bracket rate)
Effective rate % = Total tax / Taxable income x 100`,
  "financial/marriage-tax": `Marriage penalty / bonus:
Difference = Tax filing jointly - (Tax single A + Tax single B)`,
  "financial/estate-tax": `Estate tax:
Taxable estate = Gross estate - deductions - exemption
Tax = Taxable estate x rate`,
  "financial/currency": `Currency conversion:
Converted = Amount x exchange rate
Reverse = Amount / exchange rate`,
  "financial/credit-card": `Card payoff:
Months = -ln(1 - balance x i / payment) / ln(1 + i)
i = APR / 12 / 100`,
  "financial/credit-cards-payoff": `Each card is paid down monthly:
Interest = balance x APR/12, Principal = payment - interest.
Extra payment goes to the highest-rate card first (avalanche).`,
  "financial/debt-payoff": `Payoff time:
Months = -ln(1 - balance x i / payment) / ln(1 + i)
Total interest = payment x months - balance`,
  "financial/debt-consolidation": `Consolidation:
New payment = L x i / (1 - (1 + i)^-n) on the combined balance
Compare total cost with the sum of the existing debts.`,
  "financial/college-cost": `Future college cost:
Cost(year) = Current cost x (1 + education inflation)^years
Savings needed compares that total with projected savings growth.`,
  "financial/depreciation": `Straight line: (Cost - Salvage) / Life
Declining balance: Book value x (factor / Life)
Sum-of-years: (Cost - Salvage) x remaining life / sum of years`,
  "financial/lease": `Lease payment:
Depreciation = (Value - Residual) / term
Finance charge = (Value + Residual) x money factor
Payment = Depreciation + Finance charge`,
  "financial/budget": `Budget balance:
Surplus = Income - (fixed costs + variable costs + savings)
50/30/20 guide: needs 50%, wants 30%, savings 20% of net income.`,
  "financial/commission": `Commission:
Commission = Sale amount x rate / 100
Net to seller = Sale amount - Commission`,

  // ---------- Fitness and Health ----------
  "fitness-and-health/bmi": `Body mass index:
BMI = weight(kg) / height(m)^2
Imperial: BMI = 703 x weight(lb) / height(in)^2`,
  "other/bmi": `BMI = weight(kg) / height(m)^2`,
  "fitness-and-health/bmr": `Mifflin-St Jeor:
Men:   BMR = 10w + 6.25h - 5a + 5
Women: BMR = 10w + 6.25h - 5a - 161
w = kg, h = cm, a = years`,
  "fitness-and-health/tdee": `Total daily energy expenditure:
TDEE = BMR x activity factor
Sedentary 1.2, light 1.375, moderate 1.55, very active 1.725, athlete 1.9`,
  "fitness-and-health/calorie": `Calorie target:
Maintenance = BMR x activity factor
Loss = maintenance - 500/day (about 0.5 kg per week)`,
  "fitness-and-health/body-fat": `US Navy method:
Men:   %fat = 495 / (1.0324 - 0.19077 log10(waist-neck) + 0.15456 log10(height)) - 450
Women: uses waist + hip - neck in the same form`,
  "fitness-and-health/ideal-weight": `Devine formula:
Men:   50 kg + 2.3 kg per inch over 5 ft
Women: 45.5 kg + 2.3 kg per inch over 5 ft`,
  "fitness-and-health/healthy-weight": `Healthy weight range from BMI 18.5-24.9:
Weight = BMI x height(m)^2`,
  "fitness-and-health/lean-body-mass": `Lean body mass:
LBM = Weight - (Weight x body fat % / 100)`,
  "fitness-and-health/one-rep-max": `Epley formula:
1RM = weight x (1 + reps / 30)`,
  "fitness-and-health/target-heart-rate": `Karvonen method:
HRmax = 220 - age
Target = ((HRmax - resting HR) x intensity%) + resting HR`,
  "fitness-and-health/due-date": `Naegele's rule:
Due date = first day of last period + 280 days`,
  "fitness-and-health/pregnancy": `Gestational age = days since last menstrual period / 7
Due date = LMP + 280 days`,
  "fitness-and-health/ovulation": `Ovulation ~14 days before the next period:
Ovulation day = LMP + cycle length - 14
Fertile window = ovulation day - 5 to ovulation day + 1`,
  "fitness-and-health/period": `Next period = LMP + cycle length
Following cycles repeat at the same interval.`,
  "fitness-and-health/pace": `Running pace:
Pace = Time / Distance
Speed = Distance / Time`,
  "fitness-and-health/army-body-fat": `US Army circumference method:
Men:   %fat = 86.010 log10(abdomen - neck) - 70.041 log10(height) + 36.76
Women: 163.205 log10(waist + hip - neck) - 97.684 log10(height) - 78.387`,
  "fitness-and-health/calories-burned": `Calories burned:
kcal = MET x weight(kg) x time(hours)`,
  "fitness-and-health/pregnancy-weight-gain": `IOM guidance by pre-pregnancy BMI:
Underweight 12.5-18 kg, normal 11.5-16 kg,
overweight 7-11.5 kg, obese 5-9 kg over the full term.`,
  "fitness-and-health/macro": `Macros from calories:
Protein g = calories x protein% / 4
Carbs g   = calories x carb% / 4
Fat g     = calories x fat% / 9`,
  "fitness-and-health/carbohydrate": `Carbohydrate need:
Grams = Calories x carb% / 4  (4 kcal per gram)`,
  "fitness-and-health/protein": `Protein need:
Grams = weight(kg) x factor (0.8 sedentary to 2.0 athlete)`,
  "fitness-and-health/fat-intake": `Fat need:
Grams = Calories x fat% / 9  (9 kcal per gram)`,
  "fitness-and-health/gfr": `CKD-EPI / MDRD estimate:
eGFR = 175 x (Scr)^-1.154 x (age)^-0.203 x 0.742 (female) x 1.212 (black)`,
  "fitness-and-health/body-type": `Somatotype from frame:
Wrist and shoulder-to-waist ratios classify ectomorph,
mesomorph or endomorph.`,
  "fitness-and-health/body-surface-area": `Du Bois formula:
BSA = 0.007184 x height(cm)^0.725 x weight(kg)^0.425`,
  "fitness-and-health/bac": `Widmark formula:
BAC% = (alcohol grams / (weight g x r)) x 100 - 0.015 x hours
r = 0.68 men, 0.55 women`,

  // ---------- Math ----------
  "math/percentage": `Percentage:
X% of Y = X/100 x Y
X is what % of Y = X / Y x 100
Change % = (New - Old) / Old x 100`,
  "math/percent-error": `Percent error:
Error % = |Measured - Actual| / |Actual| x 100`,
  "math/fraction": `Fractions:
a/b + c/d = (ad + cb) / bd
a/b x c/d = ac / bd, then divide by the GCD to simplify.`,
  "math/least-common-multiple": `LCM(a, b) = a x b / GCD(a, b)`,
  "math/greatest-common-factor": `GCD by Euclid: GCD(a, b) = GCD(b, a mod b) until b = 0`,
  "math/exponent": `Exponent: a^n = a x a x ... (n times)
a^-n = 1 / a^n, a^0 = 1`,
  "math/log": `Logarithm: log_b(x) = ln(x) / ln(b)
b^y = x  <=>  y = log_b(x)`,
  "math/root": `nth root: x^(1/n)
Square root of x = x^0.5`,
  "math/ratio": `Ratio proportion: a : b = c : d  =>  a x d = b x c
Missing term d = b x c / a`,
  "math/rounding": `Round half up:
Rounded = floor(x x 10^d + 0.5) / 10^d, d = decimal places`,
  "math/quadratic-formula": `For ax^2 + bx + c = 0:
x = (-b +/- sqrt(b^2 - 4ac)) / 2a
Discriminant b^2 - 4ac: >0 two roots, =0 one, <0 complex`,
  "math/random-number-generator": `Uniform integer in [min, max]:
n = floor(random() x (max - min + 1)) + min`,
  "math/binary": `Base conversion:
Decimal -> binary by repeated division by 2 (collect remainders)
Binary -> decimal = SUM[ digit x 2^position ]`,
  "math/hex": `Hex to decimal = SUM[ digit x 16^position ]
Decimal to hex by repeated division by 16.`,
  "math/half-life": `Radioactive decay:
N = N0 x (1/2)^(t / half-life)
Mean lifetime = half-life / ln(2)`,
  "math/mean-median-mode-range": `Mean = SUM x / n
Median = middle value of the sorted set
Mode = most frequent value
Range = max - min`,
  "math/statistics": `Mean = SUM x / n; Variance = SUM (x - mean)^2 / n
Standard deviation = sqrt(variance)`,
  "math/standard-deviation": `Population: sigma = sqrt( SUM (x - mean)^2 / n )
Sample:     s = sqrt( SUM (x - mean)^2 / (n - 1) )`,
  "math/z-score": `Z-score:
z = (x - mean) / standard deviation`,
  "math/permutation-and-combination": `Permutations: nPr = n! / (n - r)!
Combinations: nCr = n! / (r! (n - r)!)`,
  "math/probability": `P(A) = favourable outcomes / total outcomes
P(A and B) = P(A) x P(B) for independent events
P(A or B) = P(A) + P(B) - P(A and B)`,
  "math/circle": `Circle:
Circumference = 2 pi r        Area = pi r^2
Diameter = 2r`,
  "math/right-triangle": `Right triangle:
a^2 + b^2 = c^2       Area = a x b / 2
Angles: sin A = a/c, cos A = b/c, tan A = a/b`,
  "math/pythagorean-theorem": `Pythagorean theorem:
c = sqrt(a^2 + b^2)   and   a = sqrt(c^2 - b^2)`,
  "math/triangle": `Triangle:
Area = base x height / 2
Heron: s = (a+b+c)/2, Area = sqrt(s(s-a)(s-b)(s-c))`,
  "math/area": `Common areas:
Rectangle = l x w, Triangle = b x h / 2,
Circle = pi r^2, Trapezoid = (a + b) / 2 x h`,
  "math/volume": `Common volumes:
Box = l x w x h, Cylinder = pi r^2 h,
Sphere = 4/3 pi r^3, Cone = 1/3 pi r^2 h`,
  "math/surface-area": `Surface areas:
Box = 2(lw + lh + wh), Cylinder = 2 pi r (r + h),
Sphere = 4 pi r^2`,
  "math/slope": `Slope between two points:
m = (y2 - y1) / (x2 - x1)
Line: y = mx + b, with b = y1 - m x1`,
  "math/distance": `Distance between two points:
d = sqrt((x2 - x1)^2 + (y2 - y1)^2)`,
  "math/scientific": `Standard order of operations (PEMDAS):
parentheses, exponents, multiply/divide, add/subtract.`,
  "math/factor": `Factors of n are all integers d where n mod d = 0.
Prime factorisation divides out primes until the quotient is 1.`,
  "math/matrix": `Matrix operations:
Addition adds matching entries.
Multiplication: C(i,j) = SUM_k A(i,k) x B(k,j)
2x2 determinant = ad - bc`,
  "math/scientific-notation": `Scientific notation:
n = m x 10^e with 1 <= |m| < 10`,
  "math/big-number": `Arbitrary precision arithmetic performs digit-by-digit
addition, subtraction and multiplication without floating point rounding.`,
  "math/number-sequence": `Arithmetic: a(n) = a1 + (n - 1)d, sum = n(a1 + an)/2
Geometric: a(n) = a1 x r^(n-1), sum = a1(1 - r^n)/(1 - r)`,
  "math/sample-size": `Sample size:
n = z^2 x p(1 - p) / e^2
Finite population: n_adj = n / (1 + (n - 1)/N)`,
  "math/confidence-interval": `Confidence interval:
CI = mean +/- z x (s / sqrt(n))
z = 1.645 (90%), 1.96 (95%), 2.576 (99%)`,

  // ---------- Other ----------
  "other/age": `Age = difference in years, months and days between the
birth date and the target date, carrying months and days as needed.`,
  "other/date": `Date difference = end date - start date, in days;
weeks = days / 7, years = days / 365.25`,
  "other/day-of-the-week": `Zeller's congruence returns the weekday index
from the day, month and year.`,
  "other/time-duration": `Duration = end time - start time
Convert to total minutes, then hours = minutes / 60`,
  "other/hours": `Total hours = SUM(end - start) - breaks`,
  "other/time": `Add or subtract times by converting everything to seconds,
then formatting back to hh:mm:ss.`,
  "other/time-card": `Daily hours = clock out - clock in - unpaid break
Pay = total hours x rate (+ overtime x 1.5 beyond 40 h)`,
  "other/time-zone": `Converted time = source time + (target UTC offset - source UTC offset)`,
  "other/day-counter": `Days between = end - start (optionally excluding weekends
and counting only whole business days).`,
  "other/gpa": `GPA = SUM(grade points x credits) / SUM(credits)
A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0`,
  "other/grade": `Weighted grade = SUM(score x weight) / SUM(weight)`,
  "other/fuel-cost": `Fuel cost:
Cost = Distance / Fuel economy x Price per unit`,
  "other/gas-mileage": `Fuel economy:
MPG = miles driven / gallons used
L/100km = litres used / km driven x 100`,
  "other/mileage": `Mileage = distance travelled / fuel consumed`,
  "other/password-generator": `Passwords are drawn uniformly at random from the
selected character set. Entropy (bits) = length x log2(character set size).`,
  "other/base64-encode-decode": `Base64 maps every 3 bytes (24 bits) to 4 characters
of 6 bits each, padding with "=" as needed.`,
  "other/url-encode-decode": `Percent encoding replaces unsafe characters with
%XX, where XX is the hexadecimal byte value.`,
  "other/roman-numeral-converter": `Roman numerals: I=1, V=5, X=10, L=50, C=100, D=500, M=1000
A smaller value before a larger one is subtracted (IV = 4).`,
  "other/dice-roller": `Each die is a uniform random integer from 1 to the number of faces;
the result is the sum of all dice plus any modifier.`,
  "other/love-calculator": `A light-hearted score derived from the letters of both names.
For entertainment only - no scientific basis.`,
  "other/wind-chill": `Wind chill (metric):
WC = 13.12 + 0.6215T - 11.37V^0.16 + 0.3965 T V^0.16
T = air temp (C), V = wind speed (km/h)`,
  "other/heat-index": `Heat index uses the Rothfusz regression of temperature (F)
and relative humidity to give the apparent temperature.`,
  "other/dew-point": `Magnus formula:
g = ln(RH/100) + 17.62T / (243.12 + T)
Dew point = 243.12 g / (17.62 - g)`,
  "other/ohms-law": `Ohm's law:
V = I x R      P = V x I = I^2 R = V^2 / R`,
  "other/speed": `Speed = distance / time
Distance = speed x time      Time = distance / speed`,
  "other/conversion": `Unit conversion multiplies by the ratio between units:
Result = Value x (from-unit in base) / (to-unit in base)`,
  "other/tip": `Tip:
Tip = Bill x tip% / 100
Total = Bill + Tip;  per person = Total / people`,
  "other/sleep": `Sleep cycles run about 90 minutes:
Wake time = bedtime + 90 min x cycles + ~15 min to fall asleep`,
  "other/concrete": `Concrete volume:
Cubic yards = length(ft) x width(ft) x thickness(ft) / 27
Bags = volume / yield per bag (add ~10% waste)`,
  "other/btu": `Heating/cooling load:
BTU/hr = Area(sq ft) x 20 (adjusted for climate, insulation and ceiling height)`,
  "other/square-footage": `Square footage:
Area = length(ft) x width(ft)
Total cost = Area x price per sq ft`,
  "other/stair": `Stairs:
Number of risers = total rise / target riser height (rounded)
Riser = total rise / risers, Tread = total run / (risers - 1)`,
  "other/roofing": `Roofing:
Roof area = footprint area x pitch multiplier
Squares = area / 100 (add ~10% waste)`,
  "other/tile": `Tiles needed:
Tiles = Floor area / Tile area, plus waste %`,
  "other/mulch": `Mulch:
Cubic yards = area(sq ft) x depth(in) / 324
Bags = cubic yards x 27 / bag size (cu ft)`,
  "other/gravel": `Gravel:
Cubic yards = length(ft) x width(ft) x depth(ft) / 27
Tons = cubic yards x density (about 1.4 tons per cu yd)`,
  "other/height": `Height conversion:
cm = feet x 30.48 + inches x 2.54
Child prediction: (father + mother +/- 13 cm) / 2`,
  "other/gdp": `GDP (expenditure): GDP = C + I + G + (X - M)
Per capita = GDP / population
Growth % = (GDP2 - GDP1) / GDP1 x 100`,
  "other/molarity": `Molarity:
M = moles of solute / litres of solution
moles = mass(g) / molar mass(g/mol)`,
  "other/molecular-weight": `Molecular weight = SUM(atomic weight x atom count)
for every element in the formula.`,
  "other/voltage-drop": `Voltage drop:
Vdrop = 2 x L x I x R / 1000 (single phase, R = ohms per 1000 ft)
Drop % = Vdrop / Vsource x 100`,
  "other/resistor": `Resistor colour code:
R = (band1 band2) x 10^band3, with the 4th band the tolerance.
Series: Rt = R1 + R2;  Parallel: 1/Rt = 1/R1 + 1/R2`,
  "other/electricity": `Energy cost:
kWh = Watts x hours / 1000
Cost = kWh x price per kWh`,
  "other/ip-subnet": `Subnetting:
Hosts = 2^(32 - prefix) - 2
Network = IP AND mask, Broadcast = network OR inverted mask`,
  "other/bandwidth": `Transfer time:
Time = File size (bits) / Bandwidth (bits per second)
1 byte = 8 bits; 1 MB = 1024 KB`,
  "other/bra-size": `Bra size:
Band = underbust measurement rounded to the nearest even number
Cup = bust - band (1 inch difference = A, 2 = B, 3 = C, ...)`,
  "other/shoe-size-conversion": `Shoe sizes convert through foot length:
US = (foot length in cm x 1.5) - 22 approx; EU = cm x 1.5 + 2`,
  "other/golf-handicap": `Handicap index:
Differential = (Score - Course rating) x 113 / Slope rating
Index = average of the best differentials x 0.96`,
  "other/horsepower": `Horsepower:
HP = Torque(lb-ft) x RPM / 5252
1 HP = 745.7 watts`,
  "other/engine-horsepower": `Trap-speed estimate:
HP = weight(lb) x (trap speed / 234)^3`,
  "other/tire-size": `Tire dimensions from 225/45R17:
Sidewall = width x aspect / 100
Diameter = rim(in) x 25.4 + 2 x sidewall (mm)`,
};

export function getFormula(category: string, slug: string): string | undefined {
  return FORMULAS[`${category}/${slug}`];
}
