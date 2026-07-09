import { Link, useRouterState } from "@tanstack/react-router";

const tabs = [
  { label: "FINANCIAL", to: "/financial" },
  { label: "FITNESS & HEALTH", to: "/fitness-and-health" },
  { label: "MATH", to: "/math" },
  { label: "OTHER", to: "/other" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow">
      <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-white hover:no-underline">
          <span className="text-white">Profit</span>
          <span className="text-lime">Calc</span>
          <span className="text-white/70 text-lg font-semibold">.net</span>
        </Link>
        <nav className="flex flex-wrap gap-1">
          {tabs.map((t) => {
            const active = pathname.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to}
                className={
                  "rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors " +
                  (active
                    ? "bg-lime text-white"
                    : "text-white hover:bg-navy-light")
                }
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
