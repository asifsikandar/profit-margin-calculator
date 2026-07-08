import { Link } from "@tanstack/react-router";

export function PlaceholderPage({ title, breadcrumb }: { title: string; breadcrumb?: string[] }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {breadcrumb && (
        <nav className="mb-2 text-xs text-muted-foreground">
          <Link to="/">Home</Link>
          {breadcrumb.map((b, i) => (
            <span key={i}>
              <span className="mx-1">/</span>
              {b}
            </span>
          ))}
        </nav>
      )}
      <h1>{title}</h1>
      <div className="mt-4 rounded border border-border bg-white p-6">
        <p className="text-sm text-muted-foreground">
          This calculator is coming soon. In the meantime, browse our{" "}
          <Link to="/financial">Financial</Link>,{" "}
          <Link to="/fitness-and-health">Fitness &amp; Health</Link>,{" "}
          <Link to="/math">Math</Link>, or <Link to="/other">Other</Link> calculators.
        </p>
      </div>
    </div>
  );
}
