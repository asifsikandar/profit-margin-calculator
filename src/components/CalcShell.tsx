import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { FINANCIAL_QUICK } from "@/lib/financialQuickLinks";

interface CalcShellProps {
  title: string;
  category: "financial";
  categoryLabel?: string;
  breadcrumb?: string[];
  intro?: string;
  children: ReactNode;
  definitions?: { term: string; def: string }[];
  extra?: ReactNode;
}

export function CalcShell({
  title,
  category,
  categoryLabel = "Financial",
  intro,
  children,
  definitions,
  extra,
}: CalcShellProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="mb-2 text-xs text-muted-foreground">
        <Link to="/">Home</Link> <span className="mx-1">/</span>{" "}
        <Link to={`/${category}`}>{categoryLabel}</Link>{" "}
        <span className="mx-1">/</span> {title}
      </nav>
      <h1>{title}</h1>
      {intro && (
        <div className="mt-3 rounded border-l-4 border-navy-light bg-white px-3 py-2 text-sm">
          {intro}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          {children}
          {definitions && definitions.length > 0 && (
            <section className="rounded border border-border bg-white p-4">
              <h2 className="mt-0">Definitions</h2>
              <dl className="space-y-2 text-sm">
                {definitions.map((d) => (
                  <div key={d.term}>
                    <dt className="font-semibold">{d.term}</dt>
                    <dd className="text-muted-foreground">{d.def}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          {extra}
        </div>
        <Sidebar
          categoryKey={category}
          categoryLabel={categoryLabel}
          quickLinks={FINANCIAL_QUICK}
        />
      </div>
    </div>
  );
}
