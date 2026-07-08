import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/page/$slug")({
  head: ({ params }) => {
    const title = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${title} | ProfitCalc` },
        { name: "description", content: `${title} — ProfitCalc.` },
        { name: "robots", content: "noindex" },
        { property: "og:url", content: `/page/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/page/${params.slug}` }],
    };
  },
  component: PagePlaceholder,
});

function PagePlaceholder() {
  const { slug } = Route.useParams();
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  return (
    <Layout>
      <PlaceholderPage title={title} breadcrumb={[title]} />
    </Layout>
  );
}
