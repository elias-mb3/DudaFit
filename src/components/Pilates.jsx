import { PILATES_SEMANA, fmt, hojeIso, pilatesNaSemana } from "../lib/plano.js";

export default function Pilates({ S, salvar, toast }) {
  const hoje = hojeIso(),
    feitos = pilatesNaSemana(S.pilates),
    fezHoje = S.pilates.includes(hoje);
  return (
    <section className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2>Pilates da semana</h2>
        <span className="chip" style={{ background: "var(--soft)" }}>
          {feitos} de {PILATES_SEMANA}
        </span>
      </div>
      <p className="muted">
        {feitos >= PILATES_SEMANA ? "Pilates da semana completo!" : "Duas aulas por semana, no dia que for melhor para você."}
        {S.pilates.length > 0 && ` Última aula: ${fmt(S.pilates.at(-1))}.`}
      </p>
      <div className="row">
        <button
          className="btn ghost"
          onClick={() => {
            salvar((s) => ({ ...s, pilates: fezHoje ? s.pilates.filter((d) => d !== hoje) : [...s.pilates, hoje].sort() }));
            toast(fezHoje ? "Aula removida" : "Pilates registrado!");
          }}
        >
          {fezHoje ? "Desfazer pilates de hoje" : "Fiz pilates hoje"}
        </button>
      </div>
    </section>
  );
}
