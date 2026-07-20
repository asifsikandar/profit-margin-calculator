import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ChevronDown } from "lucide-react";

const SITE = "https://profit-calc-suite.lovable.app";

const faqs = [
  { q: "Is ProfitCalc really free?", a: "Yes. Every calculator is free to use, with no signup, no paywall and no metered limits." },
  { q: "Do you store the numbers I type into calculators?", a: "No. Calculations happen entirely in your browser. We don't transmit or store the values you enter." },
  { q: "How accurate are the formulas?", a: "We use the standard published formulas for each domain (e.g. amortization, BMI, compound interest). We test outputs against reference examples, but calculators are educational tools — not a substitute for professional advice." },
  { q: "Can I embed a ProfitCalc calculator on my site?", a: "Not yet, but it's on the roadmap. If you'd like early access, reach out via the contact page." },
  { q: "Which currency does the profit margin calculator use?", a: "The calculator is currency-agnostic. Enter values in whatever currency you use — the ratios and percentages are identical." },
  { q: "Why does the stock margin calculator ask for leverage?", a: "Leverage (e.g. 4:1) determines how much capital you need to post to control a given position size. Different brokers and asset classes use different maximum ratios." },
  { q: "How do I request a new calculator?", a: "Send us a note via the contact page. Real user requests jump the queue." },
  { q: "Do you offer an API?", a: "Not currently. If you have a specific use case, we'd love to hear about it." },
  { q: "Can I use ProfitCalc offline?", a: "Once a page is loaded, most calculators work without an internet connection since the math runs in your browser." },
  { q: "Do you show ads?", a: "We may show privacy-respecting ads in the future to keep the site free. Today, no ads are served." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions | ProfitCalc" },
      { name: "description", content: "Answers to the most common questions about ProfitCalc — accuracy, privacy, embedding, and how to request new calculators." },
      { property: "og:title", content: "ProfitCalc FAQ" },
      { property: "og:description", content: "Common questions about our free online calculators." },
      { property: "og:url", content: `${SITE}/faq` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/faq` }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(f => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    }],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PageShell
      eyebrow="Help center"
      title="Frequently asked questions"
      description="Everything you might want to know about ProfitCalc — and how we keep it fast, free and private."
      breadcrumb={[{ label: "FAQ" }]}
    >
      <div className="divide-y divide-hairline">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-base font-semibold text-navy">{f.q}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-slate transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && <p className="pb-5 pr-8 text-sm leading-relaxed text-slate">{f.a}</p>}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
