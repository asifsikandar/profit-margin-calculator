import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { CategoryListingPage } from "@/components/CategoryListingPage";

export const Route = createFileRoute("/fitness-and-health")({
  head: () => ({
    meta: [
      { title: "Fitness and Health Calculators | ProfitCalc" },
      { name: "description", content: "Free calculators for BMI, calorie needs, body fat, pregnancy, macros, TDEE and more." },
      { property: "og:title", content: "Fitness and Health Calculators | ProfitCalc" },
      { property: "og:description", content: "A complete list of fitness and health calculators." },
      { property: "og:url", content: "/fitness-and-health" },
    ],
    links: [{ rel: "canonical", href: "/fitness-and-health" }],
  }),
  component: Page,
});

function Page() {
  return (
    <Layout>
      <CategoryListingPage
        categoryKey="fitness-and-health"
        categoryLabel="Fitness and Health"
        subtext="The following is a complete list of our fitness and health related calculators."
        linkListLayout="grouped-2col"
        groups={[
          { title: "Fitness", items: ["BMI","Calorie","Body Fat","BMR","Ideal Weight","Pace","Army Body Fat","Lean Body Mass","Healthy Weight","Calories Burned","One Rep Max","Target Heart Rate"] },
          { title: "Pregnancy", items: ["Pregnancy","Pregnancy Weight Gain","Due Date","Ovulation","Period"] },
          { title: "Other", items: ["Macro","Carbohydrate","Protein","Fat Intake","TDEE","GFR","Body Type","Body Surface Area","BAC"] },
        ]}
        quickLinks={["BMI","Calorie","Body Fat","BMR","Macro","Ideal Weight","Pregnancy","Pregnancy Weight Gain","Due Date","Pace"]}
      />
    </Layout>
  );
}
