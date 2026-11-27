// The skin tool's scenery (SkinTool.vue): a pixel-art backdrop behind the 3D model, and the skeleton skin it wears until a
// visitor picks their own. The backdrop is plain SVG text (safe at build time); the skeleton is painted in the browser.

// The theme's palette (vitepress-theme-skelril pixelData.json).
const GRASS = '#5b8731', GRASS_DARK = '#3f6b22', DIRT = '#866043', DIRT_DARK = '#5e4129'

// Same integer hash as the theme's landscape, so the speckles look alike; in [0, 1).
function hash(x: number, y: number, seed: number): number {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1442695041)) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

function svg(w: number, h: number, body: string): string {
  const text = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" shape-rendering="crispEdges">${body}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(text)}")`
}
const px = (x: number, y: number, fill: string, w = 1, h = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`

// Rows of a shape: '.' is empty, any other character is `fill`.
function shape(rows: string[], x0: number, y0: number, fill: string): string {
  return rows.flatMap((row, y) => [...row].map((c, x) => (c === '.' ? '' : px(x0 + x, y0 + y, fill)))).join('')
}

// One 16x12 tile of ground: two rows of grass over dirt, speckled.
function groundTile(): string {
  let body = px(0, 0, GRASS, 16, 1) + px(0, 1, GRASS, 16, 1) + px(0, 2, DIRT, 16, 10)
  for (let x = 0; x < 16; x++) {
    if (hash(x, 1, 7) < 0.35) body += px(x, 1, GRASS_DARK)
    if (hash(x, 2, 7) < 0.5) body += px(x, 2, GRASS_DARK)           // grass hanging over the dirt's edge
    for (let y = 3; y < 12; y++) if (hash(x, y, 7) < 0.12) body += px(x, y, DIRT_DARK)
  }
  return svg(16, 12, body)
}

const CLOUD = ['....wwww......', '..wwwwwwwww...', '.wwwwwwwwwwww.', 'wwwwwwwwwwwwww']
const SMALL_CLOUD = ['..wwww....', '.wwwwwwww.', 'wwwwwwwwww']

// Stars on a 40x30 tile, a few brighter than the rest.
function starTile(): string {
  let body = ''
  for (let y = 0; y < 30; y++) for (let x = 0; x < 40; x++) {
    const r = hash(x, y, 11)
    if (r < 0.006) body += px(x, y, '#ffffff')
    else if (r < 0.014) body += px(x, y, '#9fb0e6')
  }
  return svg(40, 30, body)
}

// Sky bands (hard stops, so they read as pixel art), top to bottom.
function bands(colors: string[]): string {
  const step = 100 / colors.length
  return `linear-gradient(${colors.map((c, i) => `${c} ${(i * step).toFixed(1)}% ${((i + 1) * step).toFixed(1)}%`).join(', ')})`
}

// CSS custom properties for SkinTool.vue's stylesheet to paint the backdrop with.
export const backdrop: Record<string, string> = {
  '--sky-day': bands(['#6fb4f2', '#7cbdf6', '#8ecbff', '#a3d5ff', '#bfe3ff']),
  '--sky-night': bands(['#0b1228', '#101a38', '#16224a', '#1d2b5c', '#26366e']),
  '--ground': groundTile(),
  '--cloud-near': svg(60, 4, shape(CLOUD, 8, 0, '#ffffff')),
  '--cloud-far': svg(46, 3, shape(SMALL_CLOUD, 30, 0, '#e2f1ff')),
  '--stars': starTile(),
}

// The skeleton skin (64x64, classic arms, no outer layer), for the model before a skin is chosen.
const BONE = '#e6e2d3', BONE_SHADE = '#c9c4b0', BONE_DARK = '#a19c8a', GAP = '#3b3a36', HOLE = '#141414'

export function skeletonSkin(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const fill = (color: string, x: number, y: number, w = 1, h = 1) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h) }

  // A box's faces in the texture, as in skinModel.ts: the sides run right, front, left, back from (u, v + d).
  const box = (u: number, v: number, w: number, h: number, d: number, color: string) => {
    fill(color, u + d, v, 2 * w, d)                  // top, bottom
    fill(color, u, v + d, 2 * (w + d), h)            // the four sides
  }

  // Head: a skull with eye sockets, a nose hole and teeth.
  box(0, 0, 8, 8, 8, BONE)
  fill(BONE_SHADE, 16, 0, 8, 8)                      // underside
  fill(BONE_SHADE, 0, 15, 32, 1)                     // jaw line all round
  fill(HOLE, 9, 11, 2, 2); fill(HOLE, 13, 11, 2, 2)  // eyes
  fill(BONE_DARK, 9, 10, 2, 1); fill(BONE_DARK, 13, 10, 2, 1)
  fill(GAP, 11, 13, 2, 1)                            // nose
  for (let x = 10; x < 14; x++) fill(x % 2 ? GAP : BONE, x, 14)   // teeth
  fill(BONE_DARK, 2, 12, 2, 1); fill(BONE_DARK, 20, 12, 2, 1)       // temples

  // Body: a ribcage over a dark gap, front and back alike, with a spine and a pelvis.
  box(16, 16, 8, 12, 4, GAP)
  fill(BONE, 20, 16, 8, 4)                           // shoulders seen from above
  fill(BONE_SHADE, 28, 16, 8, 4)
  for (const fx of [20, 32]) {                       // front, back
    fill(BONE, fx, 20, 8, 1)                         // collarbone
    fill(BONE, fx + 3, 20, 2, 12)                    // spine
    for (const y of [22, 24, 26]) fill(BONE, fx + 1, y, 6, 1)
    fill(BONE, fx, 29, 8, 3)                         // pelvis
    fill(BONE_SHADE, fx, 31, 8, 1)
  }
  for (const sx of [16, 28]) {                       // right, left sides: rib ends
    fill(BONE, sx, 20, 4, 1)
    for (const y of [22, 24, 26]) fill(BONE_SHADE, sx, y, 4, 1)
    fill(BONE, sx, 29, 4, 3)
  }

  // Limbs: bone with shaded edges and a joint at the elbow or knee.
  const limb = (u: number, v: number) => {
    box(u, v, 4, 12, 4, BONE)
    fill(BONE_SHADE, u + 8, v, 4, 4)                 // bottom
    for (let face = 0; face < 4; face++) {
      fill(BONE_SHADE, u + face * 4, v + 4, 1, 12)
      fill(BONE_SHADE, u + face * 4 + 3, v + 4, 1, 12)
    }
    fill(BONE_DARK, u, v + 9, 16, 1)                 // joint
    fill(BONE_SHADE, u, v + 13, 16, 1)               // wrist or ankle
  }
  limb(40, 16); limb(32, 48)                         // right, left arm
  limb(0, 16); limb(16, 48)                          // right, left leg

  // A little grain on the plain bone, so it reads as pixel art rather than flat colour.
  const img = ctx.getImageData(0, 0, 64, 64)
  for (let i = 0; i < 64 * 64; i++) {
    const p = i * 4
    if (img.data[p + 3] && img.data[p] === 0xe6 && img.data[p + 1] === 0xe2 && hash(i % 64, i >> 6, 3) < 0.12) {
      img.data[p] = 0xd8; img.data[p + 1] = 0xd3; img.data[p + 2] = 0xc2
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}
