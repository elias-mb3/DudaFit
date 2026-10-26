import { useCallback, useState } from "react";

const LS = "dudafit";
const VAZIO = { gym: 3, start: "2026-11-02", sessoes: {}, pilates: [], medidas: [] };

function ler() {
  try {
    return { ...VAZIO, ...JSON.parse(localStorage.getItem(LS) || "null") };
  } catch {
    return VAZIO;
  }
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
