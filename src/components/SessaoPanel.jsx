import { CICLO, ESTEIRA, MOB } from "../data/programa.js";
import { cicloEst, exList, fmt, hojeIso } from "../lib/plano.js";

const FASES_CICLO = ["Menstrual", "Folicular", "Ovulatória", "Lútea", "Não sei"];

export default function SessaoPanel({ s, total, S, salvar, toast }) {
  const L = S.sessoes[s.n] || {},
    data = L.done || hojeIso(),
    est = cicloEst(S.perfil, data),
    ci = L.ciclo || est,
    xs = exList(S.gym, s.t, s.fase);

  const editar = (fn) =>
    salvar((st) => {
      fn((st.sessoes[s.n] ||= {}));
      return st;
    });

  return (
    <section className="card">
      <div className="row">
        <span className={`chip p${s.fase}`}>Fase {s.fase}</span>
        <span className="muted">
          Treino {s.n} de {total}
        </span>
        {est && (
          <span className="chip" style={{ background: "var(--soft)" }}>
            Ciclo · {est}
            {L.ciclo && L.ciclo !== est ? "" : " (estimada)"}
          </span>
        )}
        {L.done && (
          <span className="chip" style={{ background: "var(--soft)" }}>
            ✓ feito em {fmt(L.done)}
          </span>
        )}
      </div>

      <h2>Academia · Treino {s.t}</h2>
      <details>
        <summary className="vid">Aquecimento (10–15 min)</summary>
        <ol className="note">
          {MOB.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ol>
      </details>
      <p className="note">Antes do esforço: solte o ar e contraia levemente o assoalho pélvico. Não prenda a respiração. Pare com {xs[0].rir} repetições sobrando.</p>
      <div>
        {xs.map((e) => (
          <div className="ex" key={e.base}>
            <div style={{ minWidth: 0 }}>
              <h3>{e.n}</h3>
              <div className="meta">
                {e.s} séries · {e.r} · RIR {e.rir} · OMNI {e.omni} · descanso {e.desc}
              </div>
            </div>
            <div className="kg">
              <input
                key={`${s.n}-${e.base}`}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                placeholder="kg"
                aria-label="Carga em kg"
                defaultValue={L.cargas?.[e.base] ?? ""}
                onChange={(ev) =>
                  editar((l) => {
                    l.cargas ||= {};
                    if (ev.target.value === "") delete l.cargas[e.base];
                    else l.cargas[e.base] = +ev.target.value;
                  })
                }
              />
              <span className="note">kg</span>
            </div>
            <details>
              <summary>Técnica, regressão e progressão</summary>
              <p>{e.tip}</p>
              <p>
                <b>Mais fácil:</b> {e.reg}
                <br />
                <b>Mais difícil:</b> {e.prog}
              </p>
            </details>
            <a className="vid" href={e.v[1]} target="_blank" rel="noopener noreferrer">
              ▶ Ver vídeo · {e.v[0]}
            </a>
          </div>
        ))}
      </div>
      <p className="note">
        <b>Esteira:</b> {ESTEIRA[s.fase]}
      </p>

      <div className="grid2">
        <label className="note">
          Fase do ciclo
          <br />
          <select value={ci || ""} onChange={(e) => editar((l) => (l.ciclo = e.target.value))}>
            <option value="">—</option>
            {FASES_CICLO.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <p className="note">{CICLO[ci] || ""}</p>
      </div>
      <div>
        <div className="eyebrow">Como você terminou? (−5 a +5)</div>
        <div className="feel">
          {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((n) => (
            <button key={n} className={L.nota === n ? "on" : ""} onClick={() => editar((l) => (l.nota = n))}>
              {n > 0 ? "+" + n : n}
            </button>
          ))}
        </div>
        <p className="note">Meta: +3 a +5.</p>
      </div>
      <label className="note">
        Anotações
        <br />
        <textarea key={s.n} rows="2" style={{ width: "100%" }} defaultValue={L.obs || ""} onBlur={(e) => editar((l) => (l.obs = e.target.value))} />
      </label>
      <div className="row">
        <button
          className="btn"
          onClick={() => {
            editar((l) => (l.done = l.done ? undefined : hojeIso()));
            toast(L.done ? "Marcação removida" : "Treino registrado. Mandou bem!");
          }}
        >
          {L.done ? "Desmarcar" : "Marcar como concluído"}
        </button>
      </div>
    </section>
  );
}
