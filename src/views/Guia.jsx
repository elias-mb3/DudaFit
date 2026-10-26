import { D, ESTEIRA } from "../data/programa.js";

export default function Guia() {
  return (
    <>
      <section className="card">
        <h2>Guia rápido</h2>
        <div className="grid2">
          {D.G.map(([t, x]) => (
            <div key={t}>
              <h3>{t}</h3>
              <p className="note" style={{ color: "var(--fg)" }}>
                {x}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="card">
        <h2>Esteira por fase</h2>
        {[1, 2, 3].map((f) => (
          <p key={f}>
            <span className={`chip p${f}`}>Fase {f}</span> {ESTEIRA[f]}
          </p>
        ))}
      </section>
    </>
  );
}
