interface AdSlotProps {
  /** Layout format of the ad placeholder */
  format?: "leaderboard" | "rectangle" | "inline";
  label?: string;
  className?: string;
}

const SIZES: Record<string, string> = {
  leaderboard: "min-h-[90px] sm:min-h-[110px]",
  rectangle: "min-h-[250px]",
  inline: "min-h-[100px]",
};

/**
 * Reserved advertising space. Replace the inner markup with your ad network
 * snippet (e.g. AdSense <ins> tag) when you are ready to monetise.
 */
export function AdSlot({ format = "leaderboard", label = "Advertisement", className = "" }: AdSlotProps) {
  return (
    <aside
      aria-label={label}
      data-ad-slot={format}
      className={`flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-hairline bg-graybg/60 px-4 py-4 text-center ${SIZES[format]} ${className}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 text-xs text-muted-foreground/70">Your ad could be here</span>
    </aside>
  );
}
