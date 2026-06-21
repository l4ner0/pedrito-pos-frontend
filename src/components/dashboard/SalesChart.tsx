import type { ChartPoint } from "@/lib/mock-data";

const CHART = {
  maxVal: 1000,
  yTicks: [1000, 750, 500, 250, 0],
  vbW: 600,
  vbH: 178,
  left: 44,
  right: 580,
  top: 10,
  bottom: 148,
};

type Pt = [number, number];

function toSvgPts(data: ChartPoint[]): Pt[] {
  const { left, right, top, bottom, maxVal } = CHART;
  return data.map((d, i) => [
    left + ((right - left) / (data.length - 1)) * i,
    top + (bottom - top) * (1 - d.value / maxVal),
  ]);
}

function smoothLinePath(pts: Pt[]): string {
  const d: string[] = [`M ${pts[0][0]},${pts[0][1]}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`);
  }
  return d.join(" ");
}

interface SalesChartProps {
  data: ChartPoint[];
  title: string;
}

export function SalesChart({ data, title }: SalesChartProps) {
  const pts = toSvgPts(data);
  const { left, right, top, bottom, vbW, vbH, maxVal, yTicks } = CHART;
  const linePath = smoothLinePath(pts);
  const areaPath = `${linePath} L ${right},${bottom} L ${left},${bottom} Z`;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold">Ventas por día</h3>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
          {title}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        width="100%"
        aria-hidden="true"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A9CA6" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#4A9CA6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const y = top + (bottom - top) * (1 - tick / maxVal);
          return (
            <g key={tick}>
              <line x1={left} y1={y} x2={right} y2={y} stroke="#E2E5EA" strokeWidth="1" />
              <text
                x={left - 6}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="8"
                fill="#7A7F8A"
              >
                {tick}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#salesGrad)" />

        <path
          d={linePath}
          fill="none"
          stroke="#4A9CA6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((d, i) => (
          <text
            key={d.day}
            x={pts[i][0]}
            y={vbH - 2}
            textAnchor="middle"
            fontSize="8"
            fill="#7A7F8A"
          >
            {d.day}
          </text>
        ))}
      </svg>
    </div>
  );
}
