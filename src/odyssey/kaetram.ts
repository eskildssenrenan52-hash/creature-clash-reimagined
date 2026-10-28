// Sprites trazidos do primeiro jogo (Kaetram, MPL-2.0): herói, skins, armas e criaturas usadas como pets.
// O catálogo (url, tamanho do quadro, deslocamento e animações) fica em kaetram-sprites.json.
// As imagens carregam sob demanda; enquanto não chegam, quem chama desenha o visual antigo.
import SHEETS from "./kaetram-sprites.json";

export interface KSheet { url: string; w?: number; h?: number; ox?: number; oy?: number; anims?: Record<string, [number, number]>; idle?: number }
export const K_SHEETS = SHEETS as unknown as Record<string, KSheet>;

const cache = new Map<string, HTMLImageElement | null>();
export function kImage(key: string): HTMLImageElement | null {
  const hit = cache.get(key);
  if (hit !== undefined) return hit && hit.complete && hit.naturalWidth ? hit : null;
  const def = K_SHEETS[key];
  if (!def || typeof Image === "undefined") { cache.set(key, null); return null; }
  const img = new Image();
  img.src = def.url;
  cache.set(key, img);
  return null;
}
export const kHas = (key: string) => key in K_SHEETS;

/** Direções do jogo 2: 0 baixo, 1 esquerda, 2 direita, 3 cima. */
export const K_DIR = ["down", "right", "right", "up"] as const;

/**
 * Desenha um quadro de uma folha Kaetram com os pés em (x, y) — mesma convenção de drawChar.
 * Retorna false se a imagem ainda não carregou.
 */
export function drawK(c: CanvasRenderingContext2D, key: string, anim: string, frame: number, x: number, y: number, flip = false, alpha = 1, scale = 1): boolean {
  const def = K_SHEETS[key]; const img = kImage(key);
  if (!def || !img || !def.anims) return false;
  const a = def.anims[anim] ?? def.anims[anim.replace("bow_", "")] ?? def.anims[anim.replace(/^(atk|walk)_/, "idle_")] ?? def.anims["idle_down"] ?? Object.values(def.anims)[0];
  if (!a) return false;
  const w = def.w ?? 32, h = def.h ?? 32, ox = def.ox ?? -16, oy = def.oy ?? -16;
  const f = ((Math.floor(frame) % a[0]) + a[0]) % a[0];
  // Kaetram desenha a partir do canto do tile de 16 px; os pés ficam na base desse tile.
  const tx = x - 8 * scale, ty = y - 16 * scale;
  c.save();
  if (alpha < 1) c.globalAlpha *= alpha;
  if (flip) { c.translate(Math.round(x), 0); c.scale(-1, 1); c.drawImage(img, f * w, a[1] * h, w, h, Math.round(-8 * scale + ox * scale), Math.round(ty + oy * scale), w * scale, h * scale); }
  else c.drawImage(img, f * w, a[1] * h, w, h, Math.round(tx + ox * scale), Math.round(ty + oy * scale), w * scale, h * scale);
  c.restore();
  return true;
}

/** Ícone 16×16 de inventário de um item Kaetram. */
export function drawKIcon(c: CanvasRenderingContext2D, sprite: string, x: number, y: number, size: number): boolean {
  const img = kImage(`items/${sprite}`);
  if (!img) return false;
  c.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, y, size, size);
  return true;
}
