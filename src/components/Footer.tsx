import { Link } from "@tanstack/react-router";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 border-t border-border bg-white" aria-label="Site footer">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <nav aria-label="Categories">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy">Calculators</h2>
            <ul className="space-y-1">
              <li><Link to="/financial">Financial</Link></li>
              <li><Link to="/fitness-and-health">Fitness &amp; Health</Link></li>
              <li><Link to="/math">Math</Link></li>
              <li><Link to="/other">Other</Link></li>
            </ul>
          </nav>
          <nav aria-label="Popular">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy">Popular</h2>
            <ul className="space-y-1">
              <li><Link to="/">Margin</Link></li>
              <li><Link to="/calculator/$category/$slug" params={{ category: "financial", slug: "mortgage" }}>Mortgage</Link></li>
              <li><Link to="/calculator/$category/$slug" params={{ category: "financial", slug: "loan" }}>Loan</Link></li>
              <li><Link to="/calculator/$category/$slug" params={{ category: "fitness-and-health", slug: "bmi" }}>BMI</Link></li>
            </ul>
          </nav>
          <nav aria-label="Company">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy">Company</h2>
            <ul className="space-y-1">
              <li><Link to="/page/$slug" params={{ slug: "about-us" }}>About us</Link></li>
              <li><Link to="/page/$slug" params={{ slug: "sitemap" }}>Sitemap</Link></li>
              <li><Link to="/search" search={{ q: "" }}>Search</Link></li>
            </ul>
          </nav>
          <nav aria-label="Legal">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy">Legal</h2>
            <ul className="space-y-1">
              <li><Link to="/page/$slug" params={{ slug: "terms-of-use" }}>Terms of use</Link></li>
              <li><Link to="/page/$slug" params={{ slug: "privacy-policy" }}>Privacy policy</Link></li>
            </ul>
          </nav>
        </div>
        <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          © {year} ProfitCalc — Free online calculators for everyone.
        </div>
      </div>
    </footer>
  );
}
