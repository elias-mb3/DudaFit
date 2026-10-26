// Leva perfil e progresso do PC para o celular pelo fragmento da URL (#s=...),
// que o navegador não envia ao servidor.
const DATA = /^\d{4}-\d{2}-\d{2}$/;

const b64url = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const deB64url = (s) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)));

export function linkCelular(S, base = location.origin + location.pathname) {
  const feitos = Object.entries(S.sessoes)
    .filter(([, L]) => L.done)
    .map(([n, L]) => [+n, L.done]);
  const dados = { v: 1, gym: S.gym, start: S.start, perfil: S.perfil, feitos, pilates: S.pilates };
  return `${base}#s=${b64url(JSON.stringify(dados))}`;
}

// Valida o conteúdo vindo da URL antes de usar; retorna null se for inválido.
export function lerLink(hash) {
  const m = /^#s=([\w-]+)$/.exec(hash || "");
  if (!m) return null;
  try {
    const d = JSON.parse(deB64url(m[1]));
    const P = d.perfil || {};
    if (d.v !== 1 || ![2, 3].includes(d.gym) || !DATA.test(d.start)) return null;
    return {
      gym: d.gym,
      start: d.start,
      perfil: {
        nome: String(P.nome || "").slice(0, 40),
        menst: DATA.test(P.menst) ? P.menst : "",
        ciclo: Math.min(45, Math.max(20, +P.ciclo || 28)),
        dur: Math.min(10, Math.max(2, +P.dur || 5)),
      },
      feitos: (Array.isArray(d.feitos) ? d.feitos : []).filter(([n, dt]) => Number.isInteger(n) && n > 0 && n < 100 && DATA.test(dt)),
      pilates: (Array.isArray(d.pilates) ? d.pilates : []).filter((x) => DATA.test(x)),
    };
  } catch {
    return null;
  }
}

// Junta o que veio do PC com o que já existe no celular (não apaga registros locais).
export function aplicarLink(S, d) {
  const sessoes = structuredClone(S.sessoes);
  for (const [n, dt] of d.feitos) (sessoes[n] ||= {}).done ||= dt;
  return {
    ...S,
    gym: d.gym,
    start: d.start,
    perfil: d.perfil,
    sessoes,
    pilates: [...new Set([...S.pilates, ...d.pilates])].sort(),
  };
}
