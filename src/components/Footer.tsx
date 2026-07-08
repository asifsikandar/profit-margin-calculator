import { Link } from "@tanstack/react-router";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <Link to="/financial">Financial</Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/fitness-and-health">Fitness and Health</Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/math">Math</Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/other">Other</Link>
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
          <Link to="/page/about-us">About us</Link>
          <span>|</span>
          <Link to="/page/sitemap">Sitemap</Link>
          <span>|</span>
          <Link to="/page/terms-of-use">Terms of use</Link>
          <span>|</span>
          <Link to="/page/privacy-policy">Privacy policy</Link>
          <span>|</span>
          <span>© {year} ProfitCalc</span>
        </div>
      </div>
    </footer>
  );
}
