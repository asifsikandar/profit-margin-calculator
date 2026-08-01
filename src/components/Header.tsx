import { useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Calculator, Menu, X, Search } from "lucide-react";
import { CurrencySelect } from "@/lib/currency";

const tabs = [
  { label: "Financial", to: "/financial" },
  { label: "Fitness & Health", to: "/fitness-and-health" },
  { label: "Math", to: "/math" },
  { label: "Other", to: "/other" },
] as const;

const secondary = [
  { label: "Blog", to: "/blog" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    setOpen(false);
    navigate({ to: "/search", search: { q: query } });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-hero-gradient text-white backdrop-blur supports-[backdrop-filter]:bg-hero-gradient">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="group flex min-w-0 items-center gap-2.5 text-white hover:no-underline"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-gradient shadow-md ring-1 ring-white/20 transition-transform group-hover:scale-105">
            <Calculator className="h-4 w-4 text-navy-deeper" aria-hidden="true" strokeWidth={2.5} />
          </span>
          <span className="truncate">
            <span className="block text-[9px] font-medium uppercase tracking-[0.18em] text-lime">ProfitCalc</span>
            <span className="block text-[13px] font-bold leading-tight tracking-tight text-white sm:text-sm">
              Profit Margin Calculator
            </span>
          </span>
        </Link>

        <nav className="ml-3 hidden lg:flex lg:items-center lg:gap-1" aria-label="Primary">
          {tabs.map((t) => {
            const active = pathname.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to}
                className={
                  "rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-all " +
                  (active
                    ? "bg-lime text-navy-deeper shadow"
                    : "text-white/85 hover:bg-white/10 hover:text-white")
                }
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
        <form onSubmit={submitSearch} role="search">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search calculators…"
              aria-label="Search calculators"
              className="w-48 rounded-full border border-white/15 bg-white/10 py-1.5 pl-9 pr-3 text-sm text-white placeholder:text-white/60 outline-none transition-colors focus:border-lime focus:bg-white/15 lg:w-64"
            />
          </div>
        </form>
        <CurrencySelect />
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-white ring-1 ring-white/15 hover:bg-white/10 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-white/10 bg-navy-deeper lg:hidden"
        >
          <div className="mx-auto max-w-7xl px-4 py-3">
            <form onSubmit={submitSearch} role="search" className="mb-3 md:hidden">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search calculators…"
                  aria-label="Search calculators"
                  className="w-full rounded-full border border-white/15 bg-white/10 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/60 outline-none focus:border-lime"
                />
              </div>
            </form>
            <div className="mb-3 md:hidden"><CurrencySelect /></div>
            <ul className="grid gap-1">
              {[...tabs, ...secondary].map((t) => {
                const active = pathname === t.to || pathname.startsWith(t.to + "/");
                return (
                  <li key={t.to}>
                    <Link
                      to={t.to}
                      onClick={() => setOpen(false)}
                      className={
                        "block rounded-lg px-3 py-2.5 text-sm font-semibold " +
                        (active ? "bg-lime text-navy-deeper" : "text-white/90 hover:bg-white/10")
                      }
                    >
                      {t.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
}
