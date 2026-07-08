import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/calculator/$category/$slug")({
  head: ({ params }) => {
    const title = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${title} Calculator — Coming Soon | ProfitCalc` },
        { name: "description", content: `The ${title} calculator is coming soon to ProfitCalc.` },
        { name: "robots", content: "noindex" },
        { property: "og:url", content: `/calculator/${params.category}/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/calculator/${params.category}/${params.slug}` }],
    };
  },
  component: PlaceholderCalc,
});

const CATEGORY_LABEL: Record<string, string> = {
  financial: "Financial",
  "fitness-and-health": "Fitness and Health",
  math: "Math",
  other: "Other",
};

function PlaceholderCalc() {
  const { category, slug } = Route.useParams();
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " Calculator";
  const catLabel = CATEGORY_LABEL[category] ?? "Calculators";
  return (
    <Layout>
      <PlaceholderPage title={title} breadcrumb={[catLabel, title]} />
    </Layout>
  );
}
