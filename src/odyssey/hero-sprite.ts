// Protagonista com os sprites do primeiro jogo: corpo base, skins prontas e arma equipada em camadas.
import type { ItemDef, WeaponKind } from "./data";
import { drawK, kImage, K_DIR } from "./kaetram";

export interface HeroSkin { id: string; name: string; desc: string; sheet: string; minLevel: number }
/** Índice salvo em Look.kskin. O último item volta ao herói desenhado em pixels (personalizável). */
export const HERO_SKINS: HeroSkin[] = [
  { id: "base", name: "Aventureiro", desc: "O herói clássico do primeiro jogo.", sheet: "player/base", minLevel: 1 },
  { id: "danbo", name: "Danbo", desc: "Robô de papelão, firme e leal.", sheet: "player/skin/danbo", minLevel: 1 },
  { id: "danboblue", name: "Danbo Azul", desc: "Pintado com tinta do mar.", sheet: "player/skin/danboblue", minLevel: 2 },
  { id: "danbogreen", name: "Danbo Verde", desc: "Camuflado para a mata.", sheet: "player/skin/danbogreen", minLevel: 3 },
  { id: "danbored", name: "Danbo Rubro", desc: "Pronto para a forja.", sheet: "player/skin/danbored", minLevel: 4 },
  { id: "taekwondo", name: "Mestre Taekwondo", desc: "Faixa preta e dobok branco.", sheet: "player/skin/taekwondo", minLevel: 5 },
  { id: "oldman", name: "Velho Sábio", desc: "Barba longa, passos lentos, olhar atento.", sheet: "player/skin/oldmanskin", minLevel: 7 },
  { id: "skeleton", name: "Esqueleto", desc: "Voltou do Abismo e esqueceu de morrer.", sheet: "player/skin/skeletonskin", minLevel: 10 },
  { id: "darkskeleton", name: "Esqueleto Sombrio", desc: "Ossos tingidos pela Noite.", sheet: "player/skin/darkskeletonskin", minLevel: 15 },
  { id: "classic", name: "Herói em pixels", desc: "O visual personalizável original (pele, cabelo, roupa…).", sheet: "", minLevel: 1 },
];
export const CLASSIC_SKIN = HERO_SKINS.length - 1;
export const skinUnlocked = (i: number, level: number) => level >= (HERO_SKINS[i]?.minLevel ?? 1);

/** Folha de arma para cada tipo quando o item não tiver uma própria. */
const KIND_SPRITE: Record<WeaponKind, string> = { sword: "tinsword", spear: "bronzespear", bow: "woodenbow", staff: "naturestaff" };
export function weaponSheet(item: Pick<ItemDef, "sprite" | "weapon"> | undefined): string {
  const s = item?.sprite ?? KIND_SPRITE[item?.weapon ?? "sword"];
  return `player/weapon/${s}`;
}

/**
 * Desenha o herói com sprites Kaetram. Retorna false quando a skin é a clássica
 * ou as imagens ainda não carregaram (o jogo então usa drawChar).
 */
export function drawHero(c: CanvasRenderingContext2D, x: number, y: number, o: { skin: number; dir: number; moving: boolean; frameT: number; attack: number; weapon?: Pick<ItemDef, "sprite" | "weapon"> | null; time: number; alpha?: number; scale?: number }): boolean {
  const skin = HERO_SKINS[o.skin] ?? HERO_SKINS[0];
  if (!skin.sheet || !kImage(skin.sheet)) return false;
  const d = K_DIR[o.dir] ?? "down", flip = o.dir === 1;
  const bow = o.weapon?.weapon === "bow";
  const attacking = o.attack > 0;
  const anim = attacking ? `${bow ? "bow_" : ""}atk_${d}` : o.moving ? `walk_${d}` : `idle_${d}`;
  const frame = attacking ? Math.min(3, Math.floor((1 - o.attack) * 4)) : o.moving ? o.frameT : o.time * 2.2;
  const wsheet = o.weapon ? weaponSheet(o.weapon) : null;
  const sc = o.scale ?? 1, a = o.alpha ?? 1;
  if (wsheet && d === "up") drawK(c, wsheet, anim, frame, x, y, flip, a, sc);
  drawK(c, skin.sheet, anim, frame, x, y, flip, a, sc);
  if (wsheet && d !== "up") drawK(c, wsheet, anim, frame, x, y, flip, a, sc);
  return true;
}
