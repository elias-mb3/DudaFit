import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { linkCelular } from "../lib/compartilhar.js";

export default function CelularQR({ S, onFechar, toast }) {
  const link = linkCelular(S);
  const [img, setImg] = useState("");

  useEffect(() => {
    QRCode.toDataURL(link, { margin: 1, width: 260, color: { dark: "#3F2E37", light: "#FFFFFF" } }).then(setImg);
  }, [link]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      toast("Link copiado");
    } catch {
      toast("Não foi possível copiar");
    }
  }

  return (
    <section className="card auth">
      <h2>Abrir no celular</h2>
      <p className="muted">Aponte a câmera do celular para o código. O site abre com seu perfil e os treinos já feitos.</p>
      {img && <img src={img} width="260" height="260" alt="QR code com o link para o celular" style={{ justifySelf: "center", borderRadius: 12 }} />}
      <p className="note">Concluiu treinos no PC? Gere um novo código para atualizar o celular. Dica: no celular, use "Adicionar à tela inicial".</p>
      <div className="row">
        <button className="btn ghost" onClick={copiar}>
          Copiar link
        </button>
        <button className="btn" onClick={onFechar}>
          Voltar
        </button>
      </div>
    </section>
  );
}
