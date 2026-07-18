import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Calculator, Menu, X } from "lucide-react";

const tabs = [
  { label: "Financial", to: "/financial" },
  { label: "Fitness & Health", to: "/fitness-and-health" },
  { label: "Math", to: "/math" },
  { label: "Other", to: "/other" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex min-w-0 items-center gap-2 text-lg font-extrabold tracking-tight text-white hover:no-underline sm:text-2xl"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-lime text-white shadow">
            <Calculator className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="truncate">
            <span className="text-white">PROFIT MARGIN</span>{" "}
            <span className="text-lime">CALCULATOR</span>
          </span>
        </Link>

        <nav className="hidden md:flex md:flex-wrap md:gap-1" aria-label="Primary">
          {tabs.map((t) => {
            const active = pathname.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to}
                className={
                  "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors " +
                  (active ? "bg-lime text-white" : "text-white hover:bg-navy-light")
                }
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white hover:bg-navy-light md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-navy-light bg-navy md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-2 py-2">
            {tabs.map((t) => {
              const active = pathname.startsWith(t.to);
              return (
                <li key={t.to}>
                  <Link
                    to={t.to}
                    onClick={() => setOpen(false)}
                    className={
                      "block rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wide " +
                      (active ? "bg-lime text-white" : "text-white hover:bg-navy-light")
                    }
                  >
                    {t.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
