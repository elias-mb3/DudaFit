const W = 640,
  H = 220,
  l = 40,
  r = 12,
  tp = 14,
  b = 30;

// pts: [[treino, valor]]; bandas: [[primeiro, último, fase]] em número de treino
export default function LineChart({ pts, n, bandas, min, max, label, zero }) {
  const x = (d) => l + ((d - 1) / (n - 1)) * (W - l - r);
  const y = (v) => tp + ((max - v) / (max - min)) * (H - tp - b);
  const ticks = [0, 1, 2, 3, 4, 5].map((i) => min + ((max - min) * i) / 5);
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img">
        {bandas.map(([a, c, f]) => (
          <rect key={a} x={x(a)} y={tp} width={x(c) - x(a)} height={H - tp - b} fill={`var(--f${f})`} opacity=".45" />
        ))}
        {ticks.map((v) => (
          <g key={v}>
            <line x1={l} x2={W - r} y1={y(v)} y2={y(v)} stroke="var(--line)" />
            <text x={l - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">
              {+v.toFixed(1)}
            </text>
          </g>
        ))}
        {bandas.map(([a]) => a).concat(n).map((d) => (
          <text key={d} x={x(d)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted)">
            treino {d}
          </text>
        ))}
        {zero && <rect x={l} y={y(5)} width={W - l - r} height={y(3) - y(5)} fill="var(--ok)" opacity=".15" />}
        {pts.length ? (
          <>
            <path d={pts.map((p, i) => (i ? "L" : "M") + x(p[0]) + " " + y(p[1])).join("")} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" />
            {pts.map((p, i) => {
              const last = i === pts.length - 1;
              return (
                <circle key={p[0]} cx={x(p[0])} cy={y(p[1])} r={last ? 5.5 : 3.5} fill={last ? "var(--deep)" : "var(--accent)"}>
                  <title>{`Treino ${p[0]}: ${p[1]}`}</title>
                </circle>
              );
            })}
          </>
        ) : (
          <text x={W / 2} y={H / 2} textAnchor="middle" fontSize="13" fill="var(--muted)">
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}
