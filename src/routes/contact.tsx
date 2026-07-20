import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Mail, MessageSquare, Clock } from "lucide-react";

const SITE = "https://profit-calc-suite.lovable.app";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | ProfitCalc" },
      { name: "description", content: "Questions, bug reports, calculator requests or partnership inquiries — reach the ProfitCalc team." },
      { property: "og:title", content: "Contact ProfitCalc" },
      { property: "og:description", content: "Get in touch with the ProfitCalc team." },
      { property: "og:url", content: `${SITE}/contact` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/contact` }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "General", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  return (
    <PageShell
      eyebrow="Contact"
      title="Get in touch"
      description="We reply to every message. Bug reports and calculator requests are especially welcome."
      breadcrumb={[{ label: "Contact" }]}
    >
      <div className="grid gap-8 md:grid-cols-[1fr,1.4fr]">
        <aside className="space-y-4">
          <ContactBlock icon={<Mail className="h-4 w-4" />} title="Email" body="hello@profitcalc.app" />
          <ContactBlock icon={<MessageSquare className="h-4 w-4" />} title="Support" body="support@profitcalc.app" />
          <ContactBlock icon={<Clock className="h-4 w-4" />} title="Response time" body="Usually within 24 hours, Mon–Fri." />
          <div className="rounded-lg border border-hairline bg-graybg p-4 text-xs text-slate">
            <strong className="mb-1 block text-navy">Note:</strong>
            ProfitCalc does not provide personalized financial, medical or legal advice. Please consult a licensed professional for individual guidance.
          </div>
        </aside>

        {sent ? (
          <div className="rounded-lg border border-lime bg-lime-soft p-6 text-sm">
            <h2 className="mt-0 text-navy">Message received</h2>
            <p className="text-slate">Thanks, {form.name}. We'll reply to {form.email} shortly.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Row>
              <Field label="Your name">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Email">
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
              </Field>
            </Row>
            <Field label="Topic">
              <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className={inputCls}>
                <option>General</option>
                <option>Bug report</option>
                <option>Calculator request</option>
                <option>Partnership</option>
                <option>Press</option>
              </select>
            </Field>
            <Field label="Message">
              <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputCls} />
            </Field>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-light"
            >
              Send message
            </button>
          </form>
        )}
      </div>
    </PageShell>
  );
}

const inputCls = "w-full rounded-md border border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy">{label}</span>
      {children}
    </label>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function ContactBlock({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-hairline bg-white p-4">
      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-lime-soft text-lime-dark">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-navy">{title}</p>
        <p className="text-sm text-slate">{body}</p>
      </div>
    </div>
  );
}
