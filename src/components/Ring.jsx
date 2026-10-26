export default function Ring({ p }) {
  const r = 34,
    c = 2 * Math.PI * r,
    pct = Math.round(p * 100);
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" role="img" aria-label={`${pct}% concluído`}>
      <circle cx="44" cy="44" r={r} fill="none" stroke="var(--soft)" strokeWidth="8" />
      <circle cx="44" cy="44" r={r} fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${c * p} ${c}`} transform="rotate(-90 44 44)" />
      <text x="44" y="49" textAnchor="middle" fontFamily="Fraunces,Georgia,serif" fontSize="18" fill="var(--deep)">
        {pct}%
      </text>
    </svg>
  );
}
