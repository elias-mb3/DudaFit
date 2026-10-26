import { describe, expect, it } from "vitest";
import { aplicarLink, lerLink, linkCelular } from "../compartilhar.js";

const PC = {
  gym: 3,
  start: "2026-11-02",
  perfil: { nome: "Duda", menst: "2026-11-07", ciclo: 28, dur: 5 },
  sessoes: { 1: { done: "2026-11-02", cargas: { x: 10 } }, 2: { nota: 3 } },
  pilates: ["2026-11-03"],
  medidas: [],
};

describe("link do celular", () => {
  it("ida e volta preserva perfil e treinos feitos, sem cargas", () => {
    const hash = linkCelular(PC, "https://x/").slice("https://x/".length);
    const d = lerLink(hash);
    expect(d.perfil).toEqual(PC.perfil);
    expect(d.feitos).toEqual([[1, "2026-11-02"]]);
    expect(hash).not.toContain("cargas");
  });
  it("rejeita conteúdo inválido", () => {
    expect(lerLink("#s=lixo")).toBeNull();
    expect(lerLink("#outra")).toBeNull();
    const ruim = btoa(JSON.stringify({ v: 1, gym: 9, start: "x" }));
    expect(lerLink("#s=" + ruim.replace(/=+$/, ""))).toBeNull();
  });
  it("mescla sem apagar registros do celular", () => {
    const cel = { ...PC, sessoes: { 3: { done: "2026-11-06" } }, pilates: ["2026-11-05"] };
    const S = aplicarLink(cel, lerLink(linkCelular(PC, "").slice(0)));
    expect(Object.keys(S.sessoes)).toEqual(["1", "3"]);
    expect(S.pilates).toEqual(["2026-11-03", "2026-11-05"]);
  });
});
