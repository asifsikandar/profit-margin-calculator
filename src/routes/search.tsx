import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Layout } from "@/components/Layout";
import { searchCalculators } from "@/lib/calc-index";

const schema = z.object({ q: fallback(z.string(), "").default("") });

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(schema),
  head: () => ({ meta: [{ title: "Search Calculators | ProfitCalc" }, { name: "robots", content: "noindex" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const results = searchCalculators(q);
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <nav className="mb-2 text-xs text-muted-foreground">
          <Link to="/">Home</Link> <span className="mx-1">/</span> Search
        </nav>
        <h1>Search Results</h1>
        <form className="mt-3 flex max-w-md overflow-hidden rounded border border-border bg-white">
          <input name="q" defaultValue={q} placeholder="Search" className="min-w-0 flex-1 px-3 py-2 text-sm outline-none" />
          <button className="bg-navy px-3 text-sm font-semibold text-white hover:bg-navy-light">Search</button>
        </form>
        <p className="mt-3 text-sm text-muted-foreground">
          {q ? `${results.length} result${results.length === 1 ? "" : "s"} for "${q}"` : "Enter a search term."}
        </p>
        {results.length > 0 && (
          <ul className="mt-4 grid gap-2 rounded border border-border bg-white p-4 sm:grid-cols-2">
            {results.map((r) => (
              <li key={r.category + "/" + r.name}>
                <Link to={r.href} className="text-linkblue font-medium hover:underline">
                  {r.name} Calculator
                </Link>
                <span className="ml-1 text-xs text-muted-foreground">— {r.categoryLabel}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
