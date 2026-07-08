import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { calcHref } from "@/lib/slug";

type CategoryKey = "financial" | "fitness-and-health" | "math" | "other";

export interface Group {
  title: string;
  items: string[];
}

interface CategoryListingPageProps {
  categoryKey: CategoryKey;
  categoryLabel: string;
  subtext?: string;
  linkListLayout: "grouped-2col" | "flat-1col";
  groups: Group[];
  ungrouped?: string[];
  quickLinks: string[];
  centerWidget?: ReactNode;
}

function CalcLink({ category, name }: { category: CategoryKey; name: string }) {
  return (
    <Link
      to={calcHref(category, name)}
      className="text-linkblue font-medium hover:underline"
    >
      {name} Calculator
    </Link>
  );
}

export function CategoryListingPage({
  categoryKey,
  categoryLabel,
  subtext,
  linkListLayout,
  groups,
  ungrouped,
  quickLinks,
  centerWidget,
}: CategoryListingPageProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="mb-2 text-xs text-muted-foreground">
        <Link to="/">Home</Link> <span className="mx-1">/</span> {categoryLabel}
      </nav>
      <h1>{categoryLabel} Calculators</h1>
      {subtext && <p className="mt-1 text-sm text-muted-foreground">{subtext}</p>}

      <div className="mt-5 flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 rounded border border-border bg-white p-4">
          {centerWidget && <div className="mb-6">{centerWidget}</div>}

          {linkListLayout === "grouped-2col" ? (
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {groups.map((g) => (
                <div key={g.title}>
                  <h3 className="mt-0">{g.title}</h3>
                  <ul className="space-y-1 text-[15px]">
                    {g.items.map((name) => (
                      <li key={name}>
                        <CalcLink category={categoryKey} name={name} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {ungrouped && ungrouped.length > 0 && (
                <ul className="grid grid-cols-1 gap-y-1 text-[15px] sm:grid-cols-2">
                  {ungrouped.map((name) => (
                    <li key={name}>
                      <CalcLink category={categoryKey} name={name} />
                    </li>
                  ))}
                </ul>
              )}
              {groups.map((g) => (
                <div key={g.title}>
                  <h3 className="mt-0">{g.title}</h3>
                  <ul className="grid grid-cols-1 gap-y-1 text-[15px] sm:grid-cols-2">
                    {g.items.map((name) => (
                      <li key={name}>
                        <CalcLink category={categoryKey} name={name} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <Sidebar
          categoryKey={categoryKey}
          categoryLabel={categoryLabel}
          quickLinks={quickLinks}
        />
      </div>
    </div>
  );
}
