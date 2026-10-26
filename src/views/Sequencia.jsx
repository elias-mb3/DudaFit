import { useState } from "react";
import SessaoPanel from "../components/SessaoPanel.jsx";
import { fmt, proxima, sessoes } from "../lib/plano.js";

export default function Sequencia({ S, salvar, toast }) {
  const [sel, setSel] = useState(null);
  const lista = sessoes(S.gym),
    prox = proxima(S)?.n;
  const s = lista.find((x) => x.n === sel);
  return (
    <>
      <section className="card">
        <div className="row">
          <span className="chip p1">Fase 1</span>
          <span className="chip p2">Fase 2</span>
          <span className="chip p3">Fase 3</span>
        </div>
        <p className="note">Os treinos seguem em ordem. Toque em um para ver ou corrigir o registro.</p>
        <div className="cal">
          {lista.map((x) => {
            const L = S.sessoes[x.n];
            const cls = ["day", "p" + x.fase, x.n === prox && "today", x.n === sel && "sel"].filter(Boolean).join(" ");
            return (
              <button key={x.n} className={cls} onClick={() => setSel(x.n)}>
                <b>{x.n}</b>
                <span>Treino {x.t}</span>
                <span>{L?.done ? fmt(L.done) : x.n === prox ? "próximo" : ""}</span>
                {L?.done && <i className="dot" aria-label="concluído" />}
              </button>
            );
          })}
        </div>
      </section>
      {s && <SessaoPanel key={s.n} s={s} total={lista.length} S={S} salvar={salvar} toast={toast} />}
    </>
  );
}
