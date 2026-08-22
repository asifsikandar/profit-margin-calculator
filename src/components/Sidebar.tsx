import { AdSlot } from "@/components/AdSlot";


type CategoryKey = "financial" | "fitness-and-health" | "math" | "other";

interface SidebarProps {
  categoryKey: CategoryKey;
  categoryLabel: string;
  quickLinks: string[];
}

export function Sidebar({ categoryKey, categoryLabel, quickLinks }: SidebarProps) {
  return (
    <aside className="w-full space-y-4 lg:w-64 lg:shrink-0">
      <AdSlot format="inline" className="max-w-full" />
    </aside>
  );
}
