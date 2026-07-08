import { Link } from "@tanstack/react-router";
import { calcHref } from "@/lib/slug";

type CategoryKey = "financial" | "fitness-and-health" | "math" | "other";

interface SidebarProps {
  categoryKey: CategoryKey;
  categoryLabel: string;
  quickLinks: string[];
}

export function Sidebar({ categoryKey, categoryLabel, quickLinks }: SidebarProps) {
  return (
    <aside className="w-full space-y-4 lg:w-64 lg:shrink-0">
      {/* Search */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex overflow-hidden rounded border border-border bg-white"
      >
        <input
          type="search"
          aria-label="Search calculators"
          placeholder="Search"
          className="min-w-0 flex-1 px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          className="bg-navy px-3 text-sm font-semibold text-white hover:bg-navy-light"
        >
          Search
        </button>
      </form>

      {/* Quick-link card */}
      <div className="overflow-hidden rounded border border-border bg-white">
        <div className="bg-navy px-3 py-2 text-sm font-bold uppercase tracking-wide text-white">
          {categoryLabel}
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1 p-3 text-sm">
          {quickLinks.map((name) => (
            <li key={name}>
              <Link to={calcHref(categoryKey, name)} className="text-linkblue">
                {name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-3 py-2 text-xs">
          <Link to={`/${categoryKey}`} className="font-semibold text-linkblue">
            More {categoryLabel} Calculators »
          </Link>
        </div>
      </div>

      {/* Bottom category row */}
      <div className="rounded border border-border bg-white p-3 text-xs">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <Link to="/financial">Financial</Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/fitness-and-health">Fitness and Health</Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/math">Math</Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/other">Other</Link>
        </div>
      </div>
    </aside>
  );
}
