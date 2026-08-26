interface Item {
  label: string;
  value: string;
}

function parseNumber(v: string): number | null {
  const cleaned = v.replace(/[^0-9.\-]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/**
 * Simple horizontal bar chart of the numeric results, purely presentational.
 */
export function ResultChart({ items }: { items: Item[] }) {
  const points = items
    .map((r) => ({ label: r.label, raw: r.value, n: parseNumber(r.value) }))
    .filter((p): p is { label: string; raw: string; n: number } => p.n !== null && p.n !== 0);

  if (points.length < 2) return null;

  const max = Math.max(...points.map((p) => Math.abs(p.n)));
  if (!Number.isFinite(max) || max === 0) return null;

  return (
    <figure className="mt-4 rounded-lg border border-hairline bg-white p-4">
      <figcaption className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Visual comparison of results
      </figcaption>
      <div className="mt-3 space-y-2.5">
        {points.map((p, i) => {
          const pct = Math.max(2, (Math.abs(p.n) / max) * 100);
          return (
            <div key={i}>
              <div className="flex items-baseline justify-between gap-3 text-xs">
                <span className="min-w-0 truncate text-muted-foreground">{p.label}</span>
                <span className="shrink-0 font-semibold text-foreground">{p.raw}</span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-graybg">
                <div
                  className={`h-full rounded-full ${p.n < 0 ? "bg-destructive" : "bg-lime"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Bars are scaled against the largest value in the result set, so you can see the relative size
        of each figure at a glance.
      </p>
    </figure>
  );
}
