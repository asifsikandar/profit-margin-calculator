import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { CategoryListingPage } from "@/components/CategoryListingPage";

export const Route = createFileRoute("/other")({
  head: () => ({
    meta: [
      { title: "Other Calculators | ProfitCalc" },
      { name: "description", content: "Everyday calculators for date and time, housing, units, electronics, internet, weather and more." },
      { property: "og:title", content: "Other Calculators | ProfitCalc" },
      { property: "og:description", content: "Useful everyday calculators across many topics." },
      { property: "og:url", content: "/other" },
    ],
    links: [{ rel: "canonical", href: "/other" }],
  }),
  component: Page,
});

function Page() {
  return (
    <Layout>
      <CategoryListingPage
        categoryKey="other"
        categoryLabel="Other"
        linkListLayout="grouped-2col"
        groups={[
          { title: "Date and Time", items: ["Age","Date","Time","Hours","Time Card","Time Zone","Time Duration","Day Counter","Day of the Week"] },
          { title: "Housing/Building", items: ["Concrete","BTU","Square Footage","Stair","Roofing","Tile","Mulch","Gravel"] },
          { title: "Various Measurements/Units", items: ["Height","Conversion","GDP","Density","Mass","Weight","Speed","Molarity","Molecular Weight","Roman Numeral Converter"] },
          { title: "Electronics/Circuits", items: ["Voltage Drop","Resistor","Ohms Law","Electricity"] },
          { title: "Internet", items: ["IP Subnet","Password Generator","Bandwidth","Base64 Encode/Decode","URL Encode/Decode"] },
          { title: "Everyday Utility", items: ["GPA","Grade","Bra Size","Shoe Size Conversion","Tip","Golf Handicap","Sleep"] },
          { title: "Weather", items: ["Wind Chill","Heat Index","Dew Point"] },
          { title: "Transportation", items: ["Fuel Cost","Gas Mileage","Horsepower","Engine Horsepower","Mileage","Tire Size"] },
          { title: "Entertainment/Anecdotes", items: ["Dice Roller","Love Calculator"] },
        ]}
        quickLinks={["Age","Date","Time","Hours","GPA","Grade","Height","Concrete","IP Subnet","Bra Size","Password Generator","Dice Roller","Conversion"]}
      />
    </Layout>
  );
}
