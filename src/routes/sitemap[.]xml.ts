import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ALL_CALCULATORS } from "@/lib/calc-index";

const BASE_URL = "https://profit-calc-suite.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);
        const staticPaths = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/financial", priority: "0.8", changefreq: "weekly" },
          { path: "/fitness-and-health", priority: "0.8", changefreq: "weekly" },
          { path: "/math", priority: "0.8", changefreq: "weekly" },
          { path: "/other", priority: "0.8", changefreq: "weekly" },
          { path: "/search", priority: "0.3", changefreq: "monthly" },
          { path: "/blog", priority: "0.6", changefreq: "weekly" },
          { path: "/faq", priority: "0.5", changefreq: "monthly" },
          { path: "/contact", priority: "0.4", changefreq: "yearly" },
          { path: "/terms", priority: "0.3", changefreq: "yearly" },
          { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
        ];

        const calcPaths = ALL_CALCULATORS.map((c) => ({
          path: c.href,
          priority: "0.6",
          changefreq: "monthly" as const,
        }));

        const urls = [...staticPaths, ...calcPaths].map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            `    <lastmod>${today}</lastmod>`,
            `    <changefreq>${e.changefreq}</changefreq>`,
            `    <priority>${e.priority}</priority>`,
            `  </url>`,
          ].join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
