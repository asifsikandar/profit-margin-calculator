import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { ProfitMarginCalculator } from "@/components/ProfitMarginCalculator";
import { StockMarginCalculator } from "@/components/StockMarginCalculator";
import { CurrencyMarginCalculator } from "@/components/CurrencyMarginCalculator";

const SITE = "https://profit-calc-suite.lovable.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: `${SITE}/`,
      name: "ProfitCalc",
      description: "Free profit margin, stock margin and currency exchange margin calculators.",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Financial", item: `${SITE}/financial` },
        { "@type": "ListItem", position: 3, name: "Margin Calculator", item: `${SITE}/` },
      ],
    },
    {
      "@type": "WebApplication",
      name: "Profit Margin Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Margin Calculator — Free Profit Margin & Markup Calculator | ProfitCalc" },
      { name: "description", content: "Free profit margin, stock trading margin and currency exchange margin calculators. Compute margin, markup, profit and required capital instantly." },
      { name: "keywords", content: "profit margin calculator, markup calculator, stock margin, currency exchange margin, gross margin" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "ProfitCalc" },
      { property: "og:title", content: "Margin Calculator | ProfitCalc" },
      { property: "og:description", content: "Compute profit margin, markup, stock margin and currency exchange margin in seconds." },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "ProfitCalc" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Margin Calculator | ProfitCalc" },
      { name: "twitter:description", content: "Free profit margin, stock margin and currency exchange margin calculators." },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
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
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* SEO breadcrumb — visually hidden but present in DOM */}
        <nav aria-label="Breadcrumb" className="sr-only">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/financial">Financial</Link></li>
            <li>Margin Calculator</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-6">
            <section id="profit-margin" aria-labelledby="pm-heading" className="scroll-mt-20">
              <ProfitMarginCalculator />
            </section>

            {/* Jump-to nav for the other calculators on this page */}
            <nav
              aria-label="On this page"
              className="surface-card flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-sm"
            >
              <span className="font-semibold text-navy">Jump to:</span>
              <a href="#profit-margin" className="text-linkblue">Profit Margin</a>
              <a href="#stock-margin" className="text-linkblue">Stock Trading Margin</a>
              <a href="#currency-margin" className="text-linkblue">Currency Exchange Margin</a>
            </nav>

            <section id="stock-margin" aria-labelledby="sm-heading" className="scroll-mt-20">
              <StockMarginCalculator />
            </section>
            <section id="currency-margin" aria-labelledby="cm-heading" className="scroll-mt-20">
              <CurrencyMarginCalculator />
            </section>

            <section className="surface-card p-6 sm:p-8">
              <h1 className="mt-0">Free Profit Margin, Stock Margin &amp; Currency Margin Calculators</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                ProfitCalc bundles hundreds of accurate calculators behind a fast, ad-light interface.
                Work in your own currency — US dollars, Pakistani rupees, Indian rupees and more.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to="/financial" className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light hover:no-underline hover:text-white">
                  Explore financial tools
                </Link>
                <Link to="/faq" className="rounded-lg border border-hairline bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-graybg hover:no-underline">
                  How it works
                </Link>
              </div>
            </section>


            <article className="surface-card p-6 text-sm leading-relaxed sm:p-8">
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
