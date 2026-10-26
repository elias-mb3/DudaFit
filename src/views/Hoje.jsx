import Pilates from "../components/Pilates.jsx";
import Ring from "../components/Ring.jsx";
import SessaoPanel from "../components/SessaoPanel.jsx";
import { lowStreak, parse, proxima, sessoes } from "../lib/plano.js";

export default function Hoje({ S, salvar, toast }) {
  const lista = sessoes(S.gym),
    total = lista.length,
    done = lista.filter((s) => S.sessoes[s.n]?.done).length,
    prox = proxima(S),
    ls = lowStreak(S);
  const comeca = parse(S.start) > new Date();
  return (
    <>
      <section className="card hero">
        <Ring p={done / total} />
        <div>
          <div className="eyebrow">
            {S.perfil?.nome ? `Oi, ${S.perfil.nome}! ` : ""}Sua jornada
          </div>
          <h2>
            {done} de {total} treinos concluídos
          </h2>
          <p className="muted">
            {comeca
              ? `Seu projeto começa em ${parse(S.start).toLocaleDateString("pt-BR")}.`
              : "Não deu para treinar um dia? Tudo bem: o treino espera por você e a sequência continua de onde parou."}
          </p>
        </div>
      </section>
      {ls > 0 && (
        <div className="alert">
          Duas sessões seguidas terminaram abaixo de 0 na Escala de Sentimentos (até o treino {ls}). Nos próximos treinos, faça 1 série a menos por exercício.
        </div>
      )}
      {prox ? (
        <SessaoPanel key={prox.n} s={prox} total={total} S={S} salvar={salvar} toast={toast} />
      ) : (
        <section className="card">
          <h2>Projeto concluído! 🎉</h2>
          <p className="muted">Veja sua evolução na aba Progresso.</p>
        </section>
      )}
      <Pilates S={S} salvar={salvar} toast={toast} />
    </>
  );
}
