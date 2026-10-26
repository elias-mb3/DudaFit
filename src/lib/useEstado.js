import { useCallback, useState } from "react";
import { aplicarLink, lerLink } from "./compartilhar.js";

const LS = "dudafit";
const VAZIO = { gym: 3, start: "2026-11-02", sessoes: {}, pilates: [], medidas: [] };

function ler() {
  let S = VAZIO;
  try {
    S = { ...VAZIO, ...JSON.parse(localStorage.getItem(LS) || "null") };
  } catch {}
  // Aberto pelo QR code do PC: aplica as configurações e limpa a URL.
  const d = lerLink(location.hash);
  if (d) {
    S = aplicarLink(S, d);
    history.replaceState(null, "", location.pathname);
    try {
      localStorage.setItem(LS, JSON.stringify(S));
    } catch {}
  }
  return S;
}

// Estado do app, salvo só no navegador deste aparelho.
export function useEstado() {
  const [S, setS] = useState(ler);
  const salvar = useCallback((fn) => {
    setS((prev) => {
      const next = fn(structuredClone(prev));
      try {
        localStorage.setItem(LS, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);
  return { S, salvar };
}
