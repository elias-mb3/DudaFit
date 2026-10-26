import { describe, expect, it } from "vitest";
import { cicloEst, lowStreak, pilatesNaSemana, proxima, sessoes } from "../plano.js";

describe("sessoes", () => {
  it("3x por semana gera a sequência A, B, C, A…", () => {
    const s = sessoes(3);
    expect(s).toHaveLength(20);
    expect(s.slice(0, 4).map((x) => x.t).join("")).toBe("ABCA");
    expect(s.at(-1).fase).toBe(3);
  });
  it("2x por semana gera menos sessões", () => expect(sessoes(2)).toHaveLength(13));
});

describe("proxima", () => {
  it("só avança quando o treino é concluído", () => {
    const S = { gym: 3, sessoes: { 1: { done: "2026-11-02" }, 2: { nota: 2 } } };
    expect(proxima(S).n).toBe(2);
  });
});

describe("cicloEst", () => {
  const perfil = { menst: "2026-11-07", ciclo: 28, dur: 5 };
  it("sem data não estima", () => expect(cicloEst({}, "2026-11-07")).toBe(""));
  it.each([
    ["2026-11-07", "Menstrual"],
    ["2026-11-11", "Menstrual"],
    ["2026-11-12", "Folicular"],
    ["2026-11-20", "Ovulatória"],
    ["2026-11-27", "Lútea"],
    ["2026-11-02", "Lútea"],
    ["2026-12-05", "Menstrual"],
  ])("%s → %s", (dia, f) => expect(cicloEst(perfil, dia)).toBe(f));
});

describe("pilates e alertas", () => {
  it("conta pilates da semana (segunda a domingo)", () => {
    expect(pilatesNaSemana(["2026-11-02", "2026-11-08", "2026-11-09"], "2026-11-05")).toBe(2);
  });
  it("detecta duas notas negativas seguidas", () => {
    expect(lowStreak({ gym: 3, sessoes: { 1: { nota: -1 }, 2: { nota: -2 } } })).toBe(2);
    expect(lowStreak({ gym: 3, sessoes: { 1: { nota: -1 }, 2: { nota: 2 } } })).toBe(0);
  });
});
