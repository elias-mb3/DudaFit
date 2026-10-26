export default function Perfil({ S, onSalvar, onCancelar }) {
  const P = S.perfil || {};

  function enviar(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSalvar({
      gym: +f.get("dias"),
      start: f.get("inicio"),
      perfil: {
        nome: f.get("nome").trim(),
        menst: f.get("menst"),
        ciclo: +f.get("ciclo") || 28,
        dur: +f.get("dur") || 5,
      },
    });
  }

  return (
    <section className="card auth">
      <h2>{S.perfil ? "Meu perfil" : "Vamos conhecer você"}</h2>
      <p className="muted">Com essas respostas eu monto sua agenda e acompanho as fases do seu ciclo.</p>
      <form onSubmit={enviar}>
        <label className="note">
          Como prefere ser chamada?
          <br />
          <input type="text" name="nome" defaultValue={P.nome || ""} maxLength={40} required />
        </label>
        <label className="note">
          Quantos dias por semana pretende ir à academia? (o pilates é 2x por semana)
          <br />
          <select name="dias" defaultValue={S.gym}>
            <option value="3">3 dias</option>
            <option value="2">2 dias</option>
          </select>
        </label>
        <label className="note">
          Quando quer começar o projeto?
          <br />
          <input type="date" name="inicio" defaultValue={S.start} required />
        </label>
        <label className="note">
          Quando começa (ou começou) sua menstruação?
          <br />
          <input type="date" name="menst" defaultValue={P.menst || "2026-11-07"} />
        </label>
        <div className="grid2">
          <label className="note">
            Seu ciclo dura em média (dias)
            <br />
            <input type="number" name="ciclo" min="20" max="45" defaultValue={P.ciclo || 28} />
          </label>
          <label className="note">
            Sua menstruação dura em média (dias)
            <br />
            <input type="number" name="dur" min="2" max="10" defaultValue={P.dur || 5} />
          </label>
        </div>
        <p className="note">Não sabe a data ou o ciclo é irregular? Deixe em branco e escolha a fase manualmente em cada treino.</p>
        <div className="row">
          <button className="btn" type="submit">
            Salvar
          </button>
          {onCancelar && (
            <button className="btn ghost" type="button" onClick={onCancelar}>
              Voltar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
