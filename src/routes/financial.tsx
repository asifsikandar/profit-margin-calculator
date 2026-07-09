import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { CategoryListingPage } from "@/components/CategoryListingPage";

export const Route = createFileRoute("/financial")({
  head: () => ({
    meta: [
      { title: "Financial Calculators | ProfitCalc" },
      { name: "description", content: "Free online financial calculators covering mortgage, loans, investment, retirement, tax and more." },
      { property: "og:title", content: "Financial Calculators | ProfitCalc" },
      { property: "og:description", content: "A complete collection of financial calculators for everyday money decisions." },
      { property: "og:url", content: "/financial" },
    ],
    links: [{ rel: "canonical", href: "/financial" }],
  }),
  component: FinancialPage,
});

function FinancialPage() {
  return (
    <Layout>
      <CategoryListingPage
        categoryKey="financial"
        categoryLabel="Financial"
        subtext="The following is a complete list of our financial calculators."
        linkListLayout="grouped-2col"
        groups={[
          { title: "Mortgage and Real Estate", items: ["Mortgage","Amortization","Mortgage Payoff","House Affordability","Rent","Debt-to-Income Ratio","Real Estate","Refinance","Rental Property","APR","FHA Loan","VA Mortgage","Home Equity Loan","HELOC","Down Payment","Rent vs Buy"] },
          { title: "Auto", items: ["Auto Loan","Cash Back or Low Interest","Auto Lease"] },
          { title: "Investment", items: ["Interest","Investment","Finance","Compound Interest","Interest Rate","Savings","Simple Interest","CD","Bond","Mutual Fund","Average Return","IRR","ROI","Payback Period","Present Value","Future Value"] },
          { title: "Retirement", items: ["Retirement","401K","Pension","Social Security","Annuity","Annuity Payout","Roth IRA","IRA","RMD"] },
          { title: "Tax and Salary", items: ["Income Tax","Salary","Marriage Tax","Estate Tax","Take-Home-Paycheck"] },
          { title: "Other", items: ["Loan","Payment","Currency","Inflation","Sales Tax","Credit Card","Credit Cards Payoff","Debt Payoff","Debt Consolidation","Repayment","Student Loan","College Cost","VAT","Depreciation","Margin","Discount","Business Loan","Personal Loan","Boat Loan","Lease","Budget","Commission"] },
        ]}
        quickLinks={["Mortgage","Loan","Auto Loan","Interest","Payment","Retirement","Amortization","Investment","Currency","Inflation","Finance","Mortgage Payoff","Income Tax","Compound Interest","Salary","401K","Interest Rate","Sales Tax"]}
      />
    </Layout>
  );
}
