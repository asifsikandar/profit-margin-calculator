import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const SITE = "https://profit-calc-suite.lovable.app";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | ProfitCalc" },
      { name: "description", content: "How ProfitCalc handles data, cookies and analytics — written in plain language." },
      { property: "og:title", content: "Privacy Policy | ProfitCalc" },
      { property: "og:description", content: "Our privacy practices, in plain English." },
      { property: "og:url", content: `${SITE}/privacy-policy` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/privacy-policy` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      description="This page is maintained by the ProfitCalc team to answer common privacy questions about our calculators."
      breadcrumb={[{ label: "Privacy Policy" }]}
    >
      <article className="prose-sm space-y-4 text-sm leading-relaxed text-slate">
        <p><strong className="text-navy">Last updated:</strong> July 20, 2026</p>

        <h2>Overview</h2>
        <p>ProfitCalc ("we", "us") provides free online calculators. This policy explains what information we collect when you visit our site, how we use it, and the choices you have.</p>

        <h2>Information calculators do not collect</h2>
        <p>The values you enter into a calculator (amounts, weights, dates, rates, etc.) are processed entirely in your browser. We do not transmit those inputs to our servers and we do not store them.</p>

        <h2>Information we may collect</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li><strong>Basic request logs</strong> such as IP address, user agent and referring page. These are retained for a short period to help detect abuse and diagnose errors.</li>
          <li><strong>Aggregate analytics</strong> such as page-view counts and popular calculators. We use privacy-respecting analytics and do not build individual user profiles.</li>
          <li><strong>Voluntary contact information</strong> you provide when you email us or submit the contact form.</li>
        </ul>

        <h2>Cookies</h2>
        <p>We use only cookies required for basic site functionality. We do not set advertising or cross-site tracking cookies.</p>

        <h2>Third-party services</h2>
        <p>Our site is hosted on infrastructure provided by trusted vendors that may process technical request data on our behalf. These vendors are contractually restricted from using that data for their own purposes.</p>

        <h2>Children</h2>
        <p>ProfitCalc is a general-audience site and is not directed at children under 13. We do not knowingly collect personal information from children.</p>

        <h2>Your rights</h2>
        <p>Depending on where you live, you may have the right to access, correct or delete personal information we hold about you. To exercise those rights, contact us using the details below.</p>

        <h2>Changes</h2>
        <p>We may update this policy from time to time. Material changes will be highlighted at the top of the page.</p>

        <h2>Contact</h2>
        <p>Questions about this policy? Email <a href="mailto:privacy@profitcalc.app">privacy@profitcalc.app</a>.</p>
      </article>
    </PageShell>
  );
}
