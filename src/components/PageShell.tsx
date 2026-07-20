import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Layout } from "./Layout";

interface PageShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; to?: string }[];
  children: ReactNode;
}

export function PageShell({ eyebrow, title, description, breadcrumb, children }: PageShellProps) {
  return (
    <Layout>
      <section className="bg-hero-gradient text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          {breadcrumb && breadcrumb.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-white/60">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link to="/" className="text-white/60 hover:text-white">Home</Link></li>
                {breadcrumb.map((b, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span aria-hidden>/</span>
                    {b.to ? <a href={b.to} className="text-white/60 hover:text-white">{b.label}</a> : <span className="text-white">{b.label}</span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && (
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-lime">{eyebrow}</p>
          )}
          <h1 className="text-white" style={{ color: "white" }}>{title}</h1>
          {description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{description}</p>
          )}
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <div className="surface-card p-6 sm:p-10">{children}</div>
      </div>
    </Layout>
  );
}
