import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ArrowRight, Clock } from "lucide-react";

const SITE = "https://profit-calc-suite.lovable.app";

const posts = [
  {
    slug: "profit-margin-vs-markup",
    title: "Profit Margin vs. Markup: The Difference That Costs Businesses Money",
    excerpt: "Same numbers, different formula — and mixing them up quietly kills pricing strategies. Here's how to keep them straight.",
    category: "Finance",
    read: "6 min",
    date: "Jul 10, 2026",
  },
  {
    slug: "mortgage-refinance-checklist",
    title: "When Refinancing a Mortgage Actually Saves You Money",
    excerpt: "A rate cut alone doesn't mean it's worth it. Run the break-even math before you sign anything.",
    category: "Mortgage",
    read: "8 min",
    date: "Jul 3, 2026",
  },
  {
    slug: "understanding-bmi-limitations",
    title: "BMI Isn't Everything: What the Number Does and Doesn't Tell You",
    excerpt: "Why doctors still use BMI, why athletes complain about it, and better companion metrics to consider.",
    category: "Health",
    read: "5 min",
    date: "Jun 26, 2026",
  },
  {
    slug: "leverage-in-forex-trading",
    title: "Leverage in Forex: How 50:1 Margin Really Works",
    excerpt: "Leverage amplifies both directions. A quick, honest primer before you fund your first margin account.",
    category: "Trading",
    read: "7 min",
    date: "Jun 18, 2026",
  },
  {
    slug: "compound-interest-explained",
    title: "Compound Interest: The Only Formula You Actually Need to Memorize",
    excerpt: "One equation, three variables, decades of impact. Why compounding is worth understanding early.",
    category: "Finance",
    read: "4 min",
    date: "Jun 10, 2026",
  },
  {
    slug: "budget-50-30-20-rule",
    title: "The 50/30/20 Budget Rule — Simple, Popular, and Sometimes Wrong",
    excerpt: "A framework that works for many, breaks for some. When to follow it and when to build your own.",
    category: "Personal Finance",
    read: "6 min",
    date: "Jun 2, 2026",
  },
];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Calculator Guides & Money Explainers | ProfitCalc" },
      { name: "description", content: "Plain-English guides on margin, mortgage math, trading leverage, health metrics and everyday personal finance." },
      { property: "og:title", content: "ProfitCalc Blog" },
      { property: "og:description", content: "Calculator guides and money explainers written for humans, not spreadsheets." },
      { property: "og:url", content: `${SITE}/blog` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/blog` }],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <PageShell
      eyebrow="Blog"
      title="Guides, explainers & calculator deep-dives"
      description="Short, honest reads that make the math behind our calculators actually make sense."
      breadcrumb={[{ label: "Blog" }]}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((p) => (
          <article key={p.slug} className="group flex flex-col rounded-lg border border-hairline bg-white p-5 transition-shadow hover:shadow-lift">
            <div className="mb-3 flex items-center gap-3 text-xs text-slate">
              <span className="rounded-full bg-lime-soft px-2.5 py-0.5 font-semibold text-lime-dark">{p.category}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{p.read}</span>
              <span className="text-slate/70">· {p.date}</span>
            </div>
            <h2 className="mb-2 text-lg leading-snug text-navy group-hover:text-navy-light">
              {p.title}
            </h2>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-slate">{p.excerpt}</p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-linkblue hover:no-underline"
            >
              Read article <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-slate">
        More posts coming soon. In the meantime, <Link to="/">try a calculator</Link>.
      </p>
    </PageShell>
  );
}
