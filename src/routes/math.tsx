import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { CategoryListingPage } from "@/components/CategoryListingPage";


export const Route = createFileRoute("/math")({
  head: () => ({
    meta: [
      { title: "Math Calculators | ProfitCalc" },
      { name: "description", content: "Basic math calculator plus scientific, fraction, percentage, statistics and geometry tools." },
      { property: "og:title", content: "Math Calculators | ProfitCalc" },
      { property: "og:description", content: "Free math calculators for everyday problems and study." },
      { property: "og:url", content: "/math" },
    ],
    links: [{ rel: "canonical", href: "/math" }],
  }),
  component: Page,
});

function Page() {
  return (
    <Layout>
      <CategoryListingPage
        categoryKey="math"
        categoryLabel="Math"
        subtext="Use the basic math calculator to do simple calculations or use one of the following calculators."
        linkListLayout="flat-1col"
        ungrouped={["Scientific","Fraction","Percentage","Random Number Generator","Percent Error","Exponent","Binary","Hex","Half-Life","Quadratic Formula","Log","Ratio","Root","Least Common Multiple","Greatest Common Factor","Factor","Rounding","Matrix","Scientific Notation","Big Number"]}
        groups={[
          { title: "Statistics", items: ["Standard Deviation","Number Sequence","Sample Size","Probability","Statistics","Mean/Median/Mode/Range","Permutation and Combination","Z-score","Confidence Interval"] },
          { title: "Geometry", items: ["Triangle","Volume","Slope","Area","Distance","Circle","Surface Area","Pythagorean Theorem","Right Triangle"] },
        ]}
        quickLinks={["Scientific","Fraction","Percentage","Triangle","Volume","Standard Deviation","Random Number Generator"]}
      />
    </Layout>
  );
}
