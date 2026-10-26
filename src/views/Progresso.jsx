import { useState } from "react";
import LineChart from "../components/LineChart.jsx";
import { D } from "../data/programa.js";
import { PILATES_SEMANA, parse, pilatesNaSemana, proxima, sessoes } from "../lib/plano.js";

const TODOS = [...new Set(Object.values(D.ex).flat().map((e) => e.n))];

export default function Progresso({ S, salvar, toast }) {
  const lista = sessoes(S.gym),
    n = lista.length,
    reg = lista.map((x) => [x.n, S.sessoes[x.n] || {}]);
  const done = reg.filter(([, L]) => L.done).length;
  const bandas = [1, 2, 3].map((f) => {
    const fs = lista.filter((x) => x.fase === f);
    return [fs[0].n, Math.min(fs.at(-1).n + 1, n), f];
  });
  const notas = reg.filter(([, L]) => typeof L.nota === "number").map(([k, L]) => [k, L.nota]);
  const avg = notas.length ? notas.reduce((s, p) => s + p[1], 0) / notas.length : null;

  const usados = [...new Set(reg.flatMap(([, L]) => Object.keys(L.cargas || {})))];
  const [escolhido, setEx] = useState(null);
  const ex = escolhido || usados[0] || TODOS[0];
  const kg = reg.filter(([, L]) => L.cargas?.[ex] != null).map(([k, L]) => [k, L.cargas[ex]]);
  const kmax = Math.max(10, ...kg.map((p) => p[1])) * 1.15;
  const first = kg[0]?.[1],
    last = kg.at(-1)?.[1];
  const M = S.medidas.slice().sort((a, b) => (a.data < b.data ? -1 : 1));

  function addMedida(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const n = (k) => (f.get(k) === "" ? null : +f.get(k));
    const m = { data: f.get("data"), peso: n("peso"), cintura: n("cintura"), quadril: n("quadril") };
    salvar((s) => ({ ...s, medidas: [...s.medidas.filter((x) => x.data !== m.data), m] }));
    e.currentTarget.reset();
    toast("Medida salva");
  }

  return (
    <>
      <section className="stats">
        <div className="stat">
          <div className="eyebrow">Treinos</div>
          <b>{done}</b>
          <span className="muted"> / {n}</span>
        </div>
        <div className="stat">
          <div className="eyebrow">Pilates na semana</div>
          <b>{pilatesNaSemana(S.pilates)}</b>
          <span className="muted"> / {PILATES_SEMANA}</span>
        </div>
        <div className="stat">
          <div className="eyebrow">Sentimento médio</div>
          <b>{avg == null ? "—" : (avg > 0 ? "+" : "") + avg.toFixed(1)}</b>
        </div>
        <div className="stat">
          <div className="eyebrow">Fase atual</div>
          <b>{proxima(S)?.fase ?? 3}</b>
          <span className="muted"> de 3</span>
        </div>
      </section>
      <section className="card">
        <h2>Escala de Sentimentos</h2>
        <p className="note">A faixa verde é a meta (+3 a +5). As cores de fundo marcam as fases do programa.</p>
        <LineChart pts={notas} n={n} bandas={bandas} min={-5} max={5} zero label="Registre como se sentiu ao fim de cada treino" />
      </section>
      <section className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>Evolução de cargas</h2>
          <select aria-label="Exercício" value={ex} onChange={(e) => setEx(e.target.value)}>
            {TODOS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
        {kg.length > 1 && (
          <p className="muted">
            De <b>{first} kg</b> para <b>{last} kg</b> ({last - first >= 0 ? "+" : ""}
            {(last - first).toFixed(1)} kg).
          </p>
        )}
        <LineChart pts={kg} n={n} bandas={bandas} min={0} max={Math.ceil(kmax)} label="Anote a carga (kg) nos treinos para ver a curva" />
      </section>
      <section className="card">
        <h2>Medidas</h2>
        <p className="note">
          Meça a cada 2 semanas, de manhã e de preferência na mesma fase do ciclo. A balança oscila com água e glicogênio; cintura, fotos e cargas contam a história completa.
        </p>
        <form className="row" onSubmit={addMedida}>
          <input name="data" type="date" required aria-label="Data" />
          <input name="peso" type="number" step="0.1" placeholder="Peso kg" style={{ width: 100 }} />
          <input name="cintura" type="number" step="0.5" placeholder="Cintura cm" style={{ width: 110 }} />
          <input name="quadril" type="number" step="0.5" placeholder="Quadril cm" style={{ width: 110 }} />
          <button className="btn ghost">Adicionar</button>
        </form>
        {M.length ? (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Peso</th>
                  <th>Cintura</th>
                  <th>Quadril</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {M.map((m) => (
                  <tr key={m.data}>
                    <td>{parse(m.data).toLocaleDateString("pt-BR")}</td>
                    <td>{m.peso ?? "—"}</td>
                    <td>{m.cintura ?? "—"}</td>
                    <td>{m.quadril ?? "—"}</td>
                    <td>
                      <button className="seg" style={{ border: 0, cursor: "pointer" }} aria-label="Remover" onClick={() => salvar((s) => ({ ...s, medidas: s.medidas.filter((x) => x.data !== m.data) }))}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">Nenhuma medida ainda. Comece no dia 1 para ter seu ponto de partida.</p>
        )}
      </section>
    </>
  );
}
