import { describe, it, expect } from "vitest";
import {
  numeroDaSpec,
  tombadorDeSpecs,
  recomendar,
  MANOBRA_S,
  type Tombador,
} from "./calculadora";

/** Recorte do catálogo real, com as specs no formato em que são cadastradas. */
const CATALOGO: Tombador[] = [
  { slug: "t10", nome: "Tombador 10 Metros Fixo", categoria: "TOMBADOR_FIXO", capacidadeT: 45, comprimentoM: 10, cicloS: 60 },
  { slug: "t12", nome: "Tombador 12 Metros Fixo", categoria: "TOMBADOR_FIXO", capacidadeT: 55, comprimentoM: 12, cicloS: 65 },
  { slug: "t18", nome: "Tombador 18 Metros Fixo", categoria: "TOMBADOR_FIXO", capacidadeT: 70, comprimentoM: 18, cicloS: 70 },
  { slug: "t21", nome: "Tombador 21 Metros Fixo", categoria: "TOMBADOR_FIXO", capacidadeT: 80, comprimentoM: 21, cicloS: 75 },
  { slug: "t30", nome: "Tombador 30 Metros Fixo", categoria: "TOMBADOR_FIXO", capacidadeT: 100, comprimentoM: 30, cicloS: 90 },
];

describe("numeroDaSpec", () => {
  it("le capacidade em toneladas", () => {
    expect(numeroDaSpec("45 t")).toBe(45);
  });

  it("nao confunde separador de milhar com decimal", () => {
    // "10.000 mm" e dez mil milimetros, nao dez.
    expect(numeroDaSpec("10.000 mm")).toBe(10000);
    expect(numeroDaSpec("48.000 mm")).toBe(48000);
  });

  it("aceita o til de aproximacao usado nas fichas", () => {
    expect(numeroDaSpec("~60 s")).toBe(60);
  });

  it("le decimal com virgula", () => {
    expect(numeroDaSpec("2,5 m")).toBe(2.5);
  });

  it("devolve null quando nao ha numero", () => {
    expect(numeroDaSpec("Conforme projeto")).toBeNull();
  });
});

describe("tombadorDeSpecs", () => {
  const base = {
    slug: "t21",
    nome: "Tombador 21 Metros Fixo",
    categoria: "TOMBADOR_FIXO",
  };

  it("converte comprimento de milimetro para metro", () => {
    const t = tombadorDeSpecs({
      ...base,
      specs: [
        { key: "Capacidade", value: "80 t" },
        { key: "Comprimento", value: "21.000 mm" },
        { key: "Ciclo", value: "~75 s" },
      ],
    });
    expect(t).not.toBeNull();
    expect(t?.comprimentoM).toBe(21);
    expect(t?.capacidadeT).toBe(80);
    expect(t?.cicloS).toBe(75);
  });

  it("descarta produto sem as tres specs", () => {
    const t = tombadorDeSpecs({
      ...base,
      specs: [{ key: "Capacidade", value: "80 t" }],
    });
    expect(t).toBeNull();
  });
});

describe("recomendar", () => {
  const operacao = {
    produto: "soja" as const,
    veiculosPorDia: 40,
    horasPorDia: 10,
  };

  it("escolhe pelo veiculo, nao pela tonelagem diaria", () => {
    // Mesmo volume diario, veiculos diferentes: o modelo muda.
    const comCarreta = recomendar(CATALOGO, { ...operacao, veiculo: "carreta" });
    const comRodotrem = recomendar(CATALOGO, { ...operacao, veiculo: "rodotrem" });

    expect(comCarreta?.tombador.slug).toBe("t21");
    expect(comRodotrem?.tombador.slug).toBe("t30");
  });

  it("nao recomenda plataforma menor que o veiculo", () => {
    // Carreta tem 18,6 m: o tombador de 18 m nao serve, ainda que a
    // capacidade dele sobre.
    const r = recomendar(CATALOGO, { ...operacao, veiculo: "carreta" });
    expect(r!.tombador.comprimentoM).toBeGreaterThanOrEqual(18.6);
  });

  it("nao recomenda plataforma com capacidade abaixo do PBTC", () => {
    const r = recomendar(CATALOGO, { ...operacao, veiculo: "bitrem" });
    expect(r!.tombador.capacidadeT).toBeGreaterThanOrEqual(57);
  });

  it("escolhe o menor que atende, nao o maior disponivel", () => {
    const r = recomendar(CATALOGO, { ...operacao, veiculo: "caminhao" });
    // Caminhao tem 12 m e 29 t: o de 12 m resolve, o de 30 m seria desperdicio.
    expect(r?.tombador.slug).toBe("t12");
  });

  it("sinaliza quando nenhum modelo comporta o veiculo", () => {
    const soPequenos = CATALOGO.filter((t) => t.comprimentoM <= 12);
    const r = recomendar(soPequenos, { ...operacao, veiculo: "rodotrem" });
    expect(r?.acimaDoCatalogo).toBe(true);
    // Devolve o maior que existe, para a tela poder falar em projeto especial.
    expect(r?.tombador.slug).toBe("t12");
  });

  it("calcula tonelagem a partir do volume do veiculo e da densidade", () => {
    const r = recomendar(CATALOGO, { ...operacao, veiculo: "carreta" });
    // 30 m3 x 0,75 t/m3 = 22,5 t por carreta; 40 carretas = 900 t/dia.
    expect(r?.toneladasPorVeiculo).toBeCloseTo(22.5);
    expect(r?.toneladasPorDia).toBeCloseTo(900);
  });

  it("inclui o tempo de manobra na vazao", () => {
    const r = recomendar(CATALOGO, { ...operacao, veiculo: "carreta" });
    // Sem contar a manobra a vazao seria 48/h, numero que nenhuma operacao faz.
    const esperado = 3600 / (75 + MANOBRA_S);
    expect(r?.veiculosPorHora).toBeCloseTo(esperado);
    expect(r!.veiculosPorHora).toBeLessThan(3600 / 75);
  });

  it("avisa quando a jornada nao comporta a fila", () => {
    const apertado = recomendar(CATALOGO, {
      ...operacao,
      veiculo: "carreta",
      veiculosPorDia: 200,
      horasPorDia: 8,
    });
    expect(apertado?.cabeNaJornada).toBe(false);
  });

  it("devolve null sem catalogo", () => {
    expect(recomendar([], { ...operacao, veiculo: "carreta" })).toBeNull();
  });
});
