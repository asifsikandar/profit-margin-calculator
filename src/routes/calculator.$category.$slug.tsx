import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { CalculatorPage } from "@/lib/calc-framework";
import { getCalculator } from "@/lib/calculators";

export const Route = createFileRoute("/calculator/$category/$slug")({
  head: ({ params }) => {
    const def = getCalculator(params.category, params.slug);
    const title = def
      ? def.title
      : params.slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) + " Calculator";
    const desc = def?.description ?? `Free online ${title.toLowerCase()} on ProfitCalc.`;
    return {
      meta: [
        { title: `${title} | ProfitCalc` },
        { name: "description", content: desc },
        { property: "og:title", content: `${title} | ProfitCalc` },
        { property: "og:description", content: desc },
        { property: "og:url", content: `/calculator/${params.category}/${params.slug}` },
        ...(!def ? [{ name: "robots", content: "noindex" }] : []),
      ],
      links: [{ rel: "canonical", href: `/calculator/${params.category}/${params.slug}` }],
    };
  },
  component: CalcRoute,
});

const CATEGORY_LABEL: Record<string, string> = {
  financial: "Financial",
  "fitness-and-health": "Fitness and Health",
  math: "Math",
  other: "Other",
};

function CalcRoute() {
  const { category, slug } = Route.useParams();
  const def = getCalculator(category, slug);
  if (def) return <CalculatorPage def={def} category={category} />;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) + " Calculator";
  const catLabel = CATEGORY_LABEL[category] ?? "Calculators";
  return (
    <Layout>
      <PlaceholderPage title={title} breadcrumb={[catLabel, title]} />
    </Layout>
  );
}
