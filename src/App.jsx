import { useRef, useState } from "react";
import CelularQR from "./components/CelularQR.jsx";
import Perfil from "./components/Perfil.jsx";
import { useEstado } from "./lib/useEstado.js";
import Guia from "./views/Guia.jsx";
import Hoje from "./views/Hoje.jsx";
import Progresso from "./views/Progresso.jsx";
import Sequencia from "./views/Sequencia.jsx";

const ABAS = [
  ["hoje", "Treino do dia", Hoje],
  ["seq", "Sequência", Sequencia],
  ["prog", "Progresso", Progresso],
  ["guia", "Guia", Guia],
];

export default function App() {
  const [aba, setAba] = useState("hoje");
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [qr, setQr] = useState(false);
  const [msg, setMsg] = useState("");
  const tt = useRef();
  const { S, salvar } = useEstado();

  const toast = (m) => {
    setMsg(m);
    clearTimeout(tt.current);
    tt.current = setTimeout(() => setMsg(""), 2200);
  };

  let corpo;
  if (!S.perfil || editandoPerfil)
    corpo = (
      <Perfil
        S={S}
        onCancelar={S.perfil ? () => setEditandoPerfil(false) : null}
        onSalvar={(v) => {
          salvar((s) => ({ ...s, ...v }));
          setEditandoPerfil(false);
          toast("Perfil salvo");
        }}
      />
    );
  else if (qr) corpo = <CelularQR S={S} onFechar={() => setQr(false)} toast={toast} />;
  const app = !corpo;
  const View = ABAS.find((a) => a[0] === aba)[2];

  return (
    <>
      <div className="wrap">
        <header className="top">
          <div>
            <div className="eyebrow">Força · Pilates · Esteira</div>
            <h1>
              Meu projeto <em>45 dias</em>
            </h1>
          </div>
          {app && (
            <div className="settings">
              <button className="link" onClick={() => setEditandoPerfil(true)}>
                Meu perfil
              </button>
              <button className="link" onClick={() => setQr(true)}>
                Abrir no celular
              </button>
              <div className="seg">
                {[[3, "3x academia"], [2, "2x academia"]].map(([o, t]) => (
                  <button key={o} className={S.gym === o ? "on" : ""} onClick={() => salvar((s) => ({ ...s, gym: o }))}>
                    {t}
                  </button>
                ))}
              </div>
              <label className="note">
                Início <input type="date" value={S.start} onChange={(e) => e.target.value && salvar((s) => ({ ...s, start: e.target.value }))} />
              </label>
            </div>
          )}
        </header>
        {app && (
          <nav className="tabs">
            {ABAS.map(([k, t]) => (
              <button key={k} className={aba === k ? "on" : ""} onClick={() => setAba(k)}>
                {t}
              </button>
            ))}
          </nav>
        )}
        <main style={{ display: "grid", gap: 18 }}>{corpo || <View S={S} salvar={salvar} toast={toast} />}</main>
        <p className="note">Seus registros ficam salvos só neste navegador.</p>
      </div>
      {msg && <div className="toast">{msg}</div>}
    </>
  );
}
