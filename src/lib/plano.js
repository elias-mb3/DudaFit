import { D } from "../data/programa.js";

export const DIAS = 45;
export const PILATES_SEMANA = 2;

export const parse = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const iso = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
export const hojeIso = () => iso(new Date());
export const fmt = (s) => parse(s).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
export const fase = (d) => (d <= 14 ? 1 : d <= 28 ? 2 : 3);

export function diaDoProjeto(start, dataIso = hojeIso()) {
  return Math.round((parse(dataIso) - parse(start)) / 864e5) + 1;
}

// Sequência de treinos de academia (A, B, C, A, ...). O dia previsto só define a fase;
// se ela pular um dia, o mesmo treino continua sendo o próximo.
export function sessoes(gym) {
  const offs = gym === 2 ? [1, 3] : [0, 2, 4];
  const out = [];
  for (let w = 0; w * 7 < DIAS; w++)
    for (const o of offs) {
      const dia = w * 7 + o + 1;
      if (dia <= DIAS) out.push({ n: out.length + 1, t: "ABC"[out.length % 3], dia, fase: fase(dia) });
    }
  return out;
}

export function proxima(S) {
  return sessoes(S.gym).find((s) => !S.sessoes[s.n]?.done) || null;
}

// core_rep vem como "8–10 por lado / 20–30 s": isometria usa só o tempo, o resto só as repetições.
function coreAlvo(coreRep, e) {
  const [reps, tempo] = coreRep.split("/").map((x) => x.replace("por lado", "").trim());
  return (e.iso ? tempo : reps) + (e.lado ? " por lado" : "");
}

export function exList(gym, t, f) {
  const P = D.fases[f];
  return D.ex[t].map((e) => {
    const n = f === 3 ? e.f3 : e.n;
    return {
      n,
      base: e.n,
      s: e.core ? (f === 1 ? "2" : "3") : gym === 2 && f > 1 ? "4" : P.s.split(" ")[0],
      r: e.core ? coreAlvo(P.core_rep, e) : P.rep,
      rir: P.rir,
      omni: P.omni,
      desc: e.core ? "45 s" : P.desc,
      reg: e.reg,
      prog: e.prog,
      tip: e.tip,
      v: D.V[n],
    };
  });
}

// Fase estimada a partir do início da menstruação informado e da duração média do ciclo.
export function cicloEst(perfil, dataIso) {
  if (!perfil?.menst) return "";
  const L = perfil.ciclo || 28,
    m = perfil.dur || 5,
    ov = L - 14;
  const cd = ((Math.round((parse(dataIso) - parse(perfil.menst)) / 864e5) % L) + L) % L + 1;
  return cd <= m ? "Menstrual" : cd < ov ? "Folicular" : cd <= ov + 2 ? "Ovulatória" : "Lútea";
}

// Pilates feitos na semana (segunda a domingo) da data informada.
export function pilatesNaSemana(datas, dataIso = hojeIso()) {
  const d = parse(dataIso),
    seg = new Date(d);
  seg.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  const dom = new Date(seg);
  dom.setDate(seg.getDate() + 6);
  return datas.filter((x) => x >= iso(seg) && x <= iso(dom)).length;
}

export function lowStreak(S) {
  const ns = sessoes(S.gym)
    .map((s) => [s.n, S.sessoes[s.n]?.nota])
    .filter(([, v]) => typeof v === "number");
  for (let i = 1; i < ns.length; i++) if (ns[i][1] < 0 && ns[i - 1][1] < 0) return ns[i][0];
  return 0;
}
