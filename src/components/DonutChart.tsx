interface DonutChartProps {
  costPct: number;
  profitPct: number;
}

export function DonutChart({ costPct, profitPct }: DonutChartProps) {
  const total = costPct + profitPct || 1;
  const cost = (costPct / total) * 100;
  const R = 60;
  const C = 2 * Math.PI * R;
  const costLen = (cost / 100) * C;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 160 160" className="h-40 w-40">
        <circle cx="80" cy="80" r={R} fill="none" stroke="#7cb342" strokeWidth="28" />
        <circle
          cx="80"
          cy="80"
          r={R}
          fill="none"
          stroke="#0a3d62"
          strokeWidth="28"
          strokeDasharray={`${costLen} ${C - costLen}`}
          transform="rotate(-90 80 80)"
        />
        <circle cx="80" cy="80" r="36" fill="#ffffff" />
      </svg>
      <ul className="text-sm">
        <li className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-navy" />
          Cost: {costPct.toFixed(2)}%
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-lime" />
          Profit margin: {profitPct.toFixed(2)}%
        </li>
      </ul>
    </div>
  );
}
