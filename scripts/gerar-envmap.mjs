/**
 * Gera o mapa de ambiente do visualizador 3D.
 *
 *   node scripts/gerar-envmap.mjs
 *
 * Em material PBR o online-3d-viewer zera a luz ambiente e conta com
 * `scene.environment` para iluminar (ver ShadingModel.UpdateShading). Sem mapa
 * de ambiente o tombador aparece quase preto.
 *
 * Em vez de usar as fotos que acompanham a biblioteca — de licença incerta e
 * com paisagem visível nos reflexos —, aqui saem seis faces de estúdio: um
 * degradê neutro, claro em cima e escuro embaixo. Ilumina de forma uniforme e
 * não coloca cor nenhuma no equipamento amarelo.
 *
 * As imagens ficam em public/models/envmap e só precisam ser regeradas se a
 * iluminação mudar.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const LADO = 512;
const DESTINO = path.resolve(
  import.meta.dirname,
  "..",
  "public",
  "models",
  "envmap",
);

/** Cinzas do degradê, do topo do "céu" até o "chão". */
const TOPO = [242, 244, 246];
const HORIZONTE = [176, 180, 186];
const CHAO = [60, 63, 68];

function misturar(a, b, t) {
  return a.map((canal, i) => Math.round(canal + (b[i] - canal) * t));
}

/** Face lateral: céu no alto, chão embaixo, com o horizonte no meio. */
function lateral() {
  const buffer = Buffer.alloc(LADO * LADO * 3);
  for (let y = 0; y < LADO; y++) {
    const t = y / (LADO - 1);
    const cor =
      t < 0.5 ? misturar(TOPO, HORIZONTE, t * 2) : misturar(HORIZONTE, CHAO, (t - 0.5) * 2);
    for (let x = 0; x < LADO; x++) {
      const i = (y * LADO + x) * 3;
      buffer[i] = cor[0];
      buffer[i + 1] = cor[1];
      buffer[i + 2] = cor[2];
    }
  }
  return buffer;
}

/** Face de cima e de baixo: cor cheia, com leve queda para as bordas. */
function plana(centro, borda) {
  const buffer = Buffer.alloc(LADO * LADO * 3);
  const meio = (LADO - 1) / 2;
  for (let y = 0; y < LADO; y++) {
    for (let x = 0; x < LADO; x++) {
      const dist = Math.min(
        1,
        Math.hypot(x - meio, y - meio) / (meio * Math.SQRT2),
      );
      const cor = misturar(centro, borda, dist);
      const i = (y * LADO + x) * 3;
      buffer[i] = cor[0];
      buffer[i + 1] = cor[1];
      buffer[i + 2] = cor[2];
    }
  }
  return buffer;
}

const FACES = {
  posx: lateral(),
  negx: lateral(),
  posz: lateral(),
  negz: lateral(),
  posy: plana(TOPO, HORIZONTE),
  negy: plana(CHAO, [40, 42, 46]),
};

await mkdir(DESTINO, { recursive: true });
for (const [nome, dados] of Object.entries(FACES)) {
  const arquivo = path.join(DESTINO, `${nome}.jpg`);
  const { size } = await sharp(dados, {
    raw: { width: LADO, height: LADO, channels: 3 },
  })
    .jpeg({ quality: 88 })
    .toFile(arquivo);
  console.log(`${nome}.jpg — ${(size / 1024).toFixed(1)} KB`);
}
