import { Link } from "@tanstack/react-router";
import { Calculator, Mail, Github, Twitter } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-navy-deeper text-white/80" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 text-white hover:no-underline">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-gradient">
                <Calculator className="h-4 w-4 text-navy-deeper" strokeWidth={2.5} />
              </span>
              <span className="text-sm font-bold tracking-tight">ProfitCalc</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-white/60">
              Free, accurate online calculators for finance, health, math and everyday tasks.
            </p>
            <div className="mt-4 flex gap-2">
              <a href="mailto:hello@profitcalc.app" aria-label="Email" className="rounded-md p-2 text-white/60 ring-1 ring-white/10 hover:bg-white/5 hover:text-white">
                <Mail className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="rounded-md p-2 text-white/60 ring-1 ring-white/10 hover:bg-white/5 hover:text-white">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="GitHub" className="rounded-md p-2 text-white/60 ring-1 ring-white/10 hover:bg-white/5 hover:text-white">
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          <nav aria-label="Categories">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-lime">Calculators</h2>
            <ul className="space-y-2 text-sm">
              <li><Link to="/financial" className="text-white/70 hover:text-white">Financial</Link></li>
              <li><Link to="/fitness-and-health" className="text-white/70 hover:text-white">Fitness &amp; Health</Link></li>
              <li><Link to="/math" className="text-white/70 hover:text-white">Math</Link></li>
              <li><Link to="/other" className="text-white/70 hover:text-white">Other</Link></li>
            </ul>
          </nav>

          <nav aria-label="Popular">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-lime">Popular</h2>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-white/70 hover:text-white">Profit Margin</Link></li>
              <li><Link to="/calculator/$category/$slug" params={{ category: "financial", slug: "mortgage" }} className="text-white/70 hover:text-white">Mortgage</Link></li>
              <li><Link to="/calculator/$category/$slug" params={{ category: "financial", slug: "loan" }} className="text-white/70 hover:text-white">Loan</Link></li>
              <li><Link to="/calculator/$category/$slug" params={{ category: "fitness-and-health", slug: "bmi" }} className="text-white/70 hover:text-white">BMI</Link></li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-lime">Company</h2>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog" className="text-white/70 hover:text-white">Blog</Link></li>
              <li><Link to="/faq" className="text-white/70 hover:text-white">FAQ</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-white">Contact</Link></li>
              <li><Link to="/search" search={{ q: "" }} className="text-white/70 hover:text-white">Search</Link></li>
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-lime">Legal</h2>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="text-white/70 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-white/70 hover:text-white">Terms of Use</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {year} ProfitCalc. All rights reserved.</p>
          <p>Built for speed. No signups, no fluff.</p>
        </div>
      </div>
    </footer>
  );
}
