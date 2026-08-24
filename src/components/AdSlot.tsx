interface AdSlotProps {
  /** Layout format of the ad placeholder */
  format?: "leaderboard" | "rectangle" | "inline" | "square";
  label?: string;
  className?: string;
}

/** Fixed reserved heights so ad slots never cause layout shift. */
const SIZES: Record<string, string> = {
  leaderboard: "h-[100px] sm:h-[120px]",
  rectangle: "h-[250px]",
  inline: "h-[110px]",
  square: "h-[300px]",
};

const WIDTHS: Record<string, string> = {
  leaderboard: "max-w-5xl",
  rectangle: "max-w-3xl",
  inline: "max-w-3xl",
  square: "max-w-[300px]",
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
      className={`mx-auto flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-hairline bg-graybg/60 px-4 text-center ${SIZES[format]} ${WIDTHS[format]} ${className}`}
      style={{ contain: "layout size" }}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 text-xs text-muted-foreground/70">Your ad could be here</span>
    </aside>
  );
}
