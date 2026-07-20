import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const SITE = "https://profit-calc-suite.lovable.app";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use | ProfitCalc" },
      { name: "description", content: "The terms that govern your use of the ProfitCalc website and calculators." },
      { property: "og:title", content: "Terms of Use | ProfitCalc" },
      { property: "og:description", content: "The terms that govern your use of ProfitCalc." },
      { property: "og:url", content: `${SITE}/terms` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/terms` }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Use"
      description="By using ProfitCalc, you agree to the terms below. Please read them carefully."
      breadcrumb={[{ label: "Terms of Use" }]}
    >
      <article className="prose-sm space-y-4 text-sm leading-relaxed text-slate">
        <p><strong className="text-navy">Last updated:</strong> July 20, 2026</p>

        <h2>Acceptance</h2>
        <p>By accessing or using ProfitCalc, you agree to be bound by these Terms of Use. If you do not agree, please do not use the site.</p>

        <h2>Educational purpose only</h2>
        <p>Our calculators and articles are provided for general informational and educational purposes. They are not intended as, and should not be relied on as, financial, investment, medical, legal or tax advice. Always consult a qualified professional for guidance tailored to your circumstances.</p>

        <h2>Accuracy</h2>
        <p>We strive to keep formulas correct and current, but we make no warranty that outputs are accurate, complete or fit for any particular purpose. You are solely responsible for verifying results before acting on them.</p>

        <h2>Acceptable use</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Do not attempt to disrupt or reverse-engineer the site.</li>
          <li>Do not scrape the site at rates that harm availability for others.</li>
          <li>Do not use the site to violate any applicable law or regulation.</li>
        </ul>

        <h2>Intellectual property</h2>
        <p>All original code, design and content on this site is owned by ProfitCalc or licensed to us. You may share links freely; substantial reproduction requires prior written permission.</p>

        <h2>Third-party links</h2>
        <p>We may link to third-party sites for convenience. We do not endorse those sites and are not responsible for their content or practices.</p>

        <h2>Disclaimer of warranties</h2>
        <p>The site is provided "as is" and "as available" without warranties of any kind, whether express or implied, to the fullest extent permitted by law.</p>

        <h2>Limitation of liability</h2>
        <p>To the maximum extent permitted by law, ProfitCalc and its contributors will not be liable for any indirect, incidental, special, consequential or punitive damages arising from your use of, or inability to use, the site.</p>

        <h2>Changes</h2>
        <p>We may revise these terms at any time by posting an updated version on this page. Continued use of the site after changes constitutes acceptance.</p>

        <h2>Contact</h2>
        <p>Questions about these terms? Email <a href="mailto:legal@profitcalc.app">legal@profitcalc.app</a>.</p>
      </article>
    </PageShell>
  );
}
