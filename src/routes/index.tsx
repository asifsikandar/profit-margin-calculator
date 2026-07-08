import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { ProfitMarginCalculator } from "@/components/ProfitMarginCalculator";
import { StockMarginCalculator } from "@/components/StockMarginCalculator";
import { CurrencyMarginCalculator } from "@/components/CurrencyMarginCalculator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Margin Calculator — Free Profit Margin & Markup Calculator | ProfitCalc" },
      { name: "description", content: "Free profit margin, stock trading margin and currency exchange margin calculators. Compute margin, markup, profit and required capital instantly." },
      { property: "og:title", content: "Margin Calculator | ProfitCalc" },
      { property: "og:description", content: "Compute profit margin, markup, stock margin and currency exchange margin in seconds." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const FINANCIAL_QUICK = [
  "Mortgage","Loan","Auto Loan","Interest","Payment","Retirement","Amortization","Investment",
  "Currency","Inflation","Finance","Mortgage Payoff","Income Tax","Compound Interest","Salary",
  "401K","Interest Rate","Sales Tax",
];

function Index() {
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <nav className="mb-2 text-xs text-muted-foreground">
          <Link to="/">Home</Link>
          <span className="mx-1">/</span>
          <Link to="/financial">Financial</Link>
          <span className="mx-1">/</span> Margin Calculator
        </nav>
        <h1>Margin Calculator</h1>
        <div className="mt-3 rounded border-l-4 border-navy-light bg-white px-3 py-2 text-sm">
          Modify the values and click the Calculate button to use.
        </div>

        <div className="mt-5 flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-6">
            <ProfitMarginCalculator />
            <StockMarginCalculator />
            <CurrencyMarginCalculator />

            <article className="rounded border border-border bg-white p-4 text-sm leading-relaxed">
              <h2 className="mt-0">Understanding Margin</h2>
              <p>Margin is a general term used in business and finance to describe the gap between two related numbers — most often the difference between what something costs and what it sells for. Depending on the context, margin can describe profitability, capital requirements for leveraged trading, or the spread a broker keeps on a foreign-exchange transaction.</p>

              <h3>Profit margin explained</h3>
              <p>Profit margin measures how much of every dollar of revenue is kept as profit. It is calculated by dividing profit by revenue and expressing the result as a percentage. A higher margin generally signals a healthier, more efficient business, though acceptable margins vary widely between industries. Margin is not the same as markup: markup expresses profit relative to cost, while margin expresses profit relative to revenue.</p>

              <h3>Margin trading explained</h3>
              <p>In investing, buying on margin means borrowing part of the purchase price of an asset from a broker. The trader deposits a percentage of the total value — the margin requirement — as collateral, and the broker lends the rest. Leverage amplifies both gains and losses, which is why margin trading is considered a higher-risk strategy suited to experienced participants.</p>

              <h3>Currency exchange margin explained</h3>
              <p>Retail foreign-exchange brokers typically offer leverage expressed as a ratio such as 10:1 or 50:1. A 50:1 account lets a trader control 50 units of currency for every 1 unit posted as margin. Larger leverage ratios reduce the up-front capital required but increase exposure to adverse price moves.</p>

              <h3>Margin call explained</h3>
              <p>When the value of a leveraged position falls far enough that the collateral in the account drops below the required threshold, the broker issues a margin call. The trader must either deposit additional funds or close positions to restore the required equity. Failure to respond promptly usually results in the broker liquidating positions automatically to protect its loan.</p>
            </article>
          </div>

          <Sidebar
            categoryKey="financial"
            categoryLabel="Financial"
            quickLinks={FINANCIAL_QUICK}
          />
        </div>
      </div>
    </Layout>
  );
}
