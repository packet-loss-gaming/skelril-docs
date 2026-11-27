// A Minecraft-layout player skin on a 3D player model, drawn with plain WebGL (no libraries) for the skin tool (SkinTool.vue).
// Runs in the browser only. The skin never leaves the page.
//
// Skin layout (64x64; a legacy 64x32 skin has no second layer except the hat, and its left arm and leg mirror the right ones):
// every part is a box of size w x h x d (pixels) whose six faces sit in the texture around (u, v):
//   top (u+d, v, w x d)  bottom (u+d+w, v, w x d)
//   right (u, v+d, d x h)  front (u+d, v+d, w x h)  left (u+d+w, v+d, d x h)  back (u+2d+w, v+d, w x h)
// "right" and "left" are the character's. The model faces +z; its right side is -x.

type Vec3 = [number, number, number]
interface Part { size: Vec3; at: Vec3; uv: [number, number]; layer?: [number, number]; legacyMirrorOf?: [number, number] }

function parts(slim: boolean): Part[] {
  const arm = slim ? 3 : 4
  const ax = 4 + arm / 2
  return [
    { size: [8, 8, 8], at: [0, 28, 0], uv: [0, 0], layer: [32, 0] },                                    // head, hat
    { size: [8, 12, 4], at: [0, 18, 0], uv: [16, 16], layer: [16, 32] },                                // body, jacket
    { size: [arm, 12, 4], at: [-ax, 18, 0], uv: [40, 16], layer: [40, 32] },                            // right arm, sleeve
    { size: [arm, 12, 4], at: [ax, 18, 0], uv: [32, 48], layer: [48, 48], legacyMirrorOf: [40, 16] },  // left arm, sleeve
    { size: [4, 12, 4], at: [-2, 6, 0], uv: [0, 16], layer: [0, 32] },                                  // right leg, trousers
    { size: [4, 12, 4], at: [2, 6, 0], uv: [16, 48], layer: [0, 48], legacyMirrorOf: [0, 16] },        // left leg, trousers
  ]
}

// Per face: 4 corners (x, y, z in -1..1 of the box), the texture rectangle, and a shade (sides darker, like the game).
// Corner order: top-left, top-right, bottom-right, bottom-left as seen from outside the face.
function boxFaces(w: number, h: number, d: number, u: number, v: number) {
  return [
    { c: [[-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]], r: [u + d, v, w, d], shade: 1.0 },              // top: back row first
    { c: [[-1, -1, 1], [1, -1, 1], [1, -1, -1], [-1, -1, -1]], r: [u + d + w, v, w, d], shade: 0.5 },      // bottom
    { c: [[-1, 1, -1], [-1, 1, 1], [-1, -1, 1], [-1, -1, -1]], r: [u, v + d, d, h], shade: 0.65 },         // right (-x)
    { c: [[-1, 1, 1], [1, 1, 1], [1, -1, 1], [-1, -1, 1]], r: [u + d, v + d, w, h], shade: 0.85 },         // front (+z)
    { c: [[1, 1, 1], [1, 1, -1], [1, -1, -1], [1, -1, 1]], r: [u + d + w, v + d, d, h], shade: 0.65 },     // left (+x)
    { c: [[1, 1, -1], [-1, 1, -1], [-1, -1, -1], [1, -1, -1]], r: [u + 2 * d + w, v + d, w, h], shade: 0.75 }, // back (-z)
  ]
}

// Interleaved x, y, z, s, t, shade per vertex; 6 vertices (two triangles) per face.
function buildMesh(slim: boolean, legacy: boolean, layer: boolean): Float32Array {
  const out: number[] = []
  const texH = legacy ? 32 : 64
  const add = (p: Part, uv: [number, number], grow: number, mirror: boolean) => {
    const [w, h, d] = p.size
    const half: Vec3 = [w / 2 + grow, h / 2 + grow, d / 2 + grow]
    for (const f of boxFaces(w, h, d, uv[0], uv[1])) {
      const [ru, rv, rw, rh] = f.r
      const e = 0.02           // a hair inside the face's pixels, so a neighbouring (often transparent) pixel never bleeds in
      const st = [[ru + e, rv + e], [ru + rw - e, rv + e], [ru + rw - e, rv + rh - e], [ru + e, rv + rh - e]]
      const vert = (i: number) => {
        const c = f.c[i]
        const x = c[0] * half[0] * (mirror ? -1 : 1)
        out.push(p.at[0] + x, p.at[1] + c[1] * half[1], p.at[2] + c[2] * half[2], st[i][0] / 64, st[i][1] / texH, f.shade)
      }
      for (const i of [0, 1, 2, 0, 2, 3]) vert(i)
    }
  }
  for (const p of parts(slim)) {
    if (!layer) {
      if (legacy && p.legacyMirrorOf) add(p, p.legacyMirrorOf, 0, true)
      else add(p, p.uv, 0, false)
    } else if (p.layer && (!legacy || p.uv[0] === 0 && p.uv[1] === 0)) {
      add(p, p.layer, p.uv[1] === 0 ? 0.5 : 0.25, false)           // the hat stands out further than the other layer parts
    }
  }
  return new Float32Array(out)
}

const VS = `
attribute vec3 aPos; attribute vec2 aUV; attribute float aShade;
uniform mat4 uMVP; varying vec2 vUV; varying float vShade;
void main() { gl_Position = uMVP * vec4(aPos, 1.0); vUV = aUV; vShade = aShade; }`
const FS = `
precision mediump float;
uniform sampler2D uTex; uniform bool uOpaque; varying vec2 vUV; varying float vShade;
void main() {
  vec4 c = texture2D(uTex, vUV);
  if (!uOpaque && c.a < 0.5) discard;
  gl_FragColor = vec4(c.rgb * vShade, 1.0);
}`

type Mat4 = Float32Array
function mul(a: Mat4, b: Mat4): Mat4 {
  const o = new Float32Array(16)
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
    let s = 0
    for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]
    o[c * 4 + r] = s
  }
  return o
}
function perspective(fovy: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far)
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0])
}
function rotY(a: number): Mat4 {
  const c = Math.cos(a), s = Math.sin(a)
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1])
}
function rotX(a: number): Mat4 {
  const c = Math.cos(a), s = Math.sin(a)
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1])
}
function translate(x: number, y: number, z: number): Mat4 {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1])
}

export interface SkinView {
  setSkin(image: HTMLCanvasElement, legacy: boolean): void
  setSlim(slim: boolean): void
  setLayer(show: boolean): void
  // Turn to face front or back, or spin; dragging stops either.
  setView(view: 'front' | 'back' | 'spin'): void
  destroy(): void
}

// Draws into `canvas`; drag (mouse or touch) to turn the model. `onDrag` hears when a drag takes over from setView.
export function createSkinView(canvas: HTMLCanvasElement, onDrag?: () => void): SkinView | null {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false })
  if (!gl) return null
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS))
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS))
  gl.linkProgram(prog)
  gl.useProgram(prog)
  const aPos = gl.getAttribLocation(prog, 'aPos'), aUV = gl.getAttribLocation(prog, 'aUV'), aShade = gl.getAttribLocation(prog, 'aShade')
  const uMVP = gl.getUniformLocation(prog, 'uMVP'), uOpaque = gl.getUniformLocation(prog, 'uOpaque')
  const baseBuf = gl.createBuffer()!, layerBuf = gl.createBuffer()!
  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  for (const p of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, p, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.enable(gl.DEPTH_TEST)

  let slim = false, legacy = false, layer = true, hasSkin = false
  let counts = [0, 0]
  // It turns by itself until first dragged, unless the visitor asked for reduced motion.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let yaw = 0.5, pitch = 0.15, spinning = !reduceMotion, frame = 0, last = 0
  let target: number | null = null       // a yaw to ease towards (Front, Back)
  const rebuild = () => {
    const base = buildMesh(slim, legacy, false), over = buildMesh(slim, legacy, true)
    gl.bindBuffer(gl.ARRAY_BUFFER, baseBuf)
    gl.bufferData(gl.ARRAY_BUFFER, base, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, layerBuf)
    gl.bufferData(gl.ARRAY_BUFFER, over, gl.STATIC_DRAW)
    counts = [base.length / 6, over.length / 6]
  }
  const drawBuf = (buf: WebGLBuffer, n: number, opaque: boolean) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 24, 0)
    gl.enableVertexAttribArray(aUV); gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 24, 12)
    gl.enableVertexAttribArray(aShade); gl.vertexAttribPointer(aShade, 1, gl.FLOAT, false, 24, 20)
    gl.uniform1i(uOpaque, opaque ? 1 : 0)
    gl.drawArrays(gl.TRIANGLES, 0, n)
  }
  const draw = (t: number) => {
    frame = requestAnimationFrame(draw)
    const dt = last ? t - last : 0
    if (spinning) yaw += dt * 0.0006
    if (target !== null) {
      const k = Math.min(1, dt * 0.008)
      yaw += (target - yaw) * k
      pitch += (0.15 - pitch) * k
      if (Math.abs(target - yaw) < 0.001) { yaw = target; target = null }
    }
    last = t
    const dpr = window.devicePixelRatio || 1
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr)
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
    gl.viewport(0, 0, w, h)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    if (!hasSkin) return
    const model = mul(rotX(pitch), mul(rotY(yaw), translate(0, -16, 0)))
    const mvp = mul(perspective(0.6, w / Math.max(h, 1), 1, 200), mul(translate(0, 0, -64), model))
    gl.uniformMatrix4fv(uMVP, false, mvp)
    drawBuf(baseBuf, counts[0], true)
    if (layer) drawBuf(layerBuf, counts[1], false)
  }
  frame = requestAnimationFrame(draw)

  // Drag to turn.
  let drag: { x: number; y: number } | null = null
  const down = (e: PointerEvent) => {
    drag = { x: e.clientX, y: e.clientY }
    if (spinning || target !== null) onDrag?.()
    spinning = false
    target = null
    canvas.setPointerCapture(e.pointerId)
  }
  const move = (e: PointerEvent) => {
    if (!drag) return
    yaw += (e.clientX - drag.x) * 0.01
    pitch = Math.max(-1.2, Math.min(1.2, pitch + (e.clientY - drag.y) * 0.01))
    drag = { x: e.clientX, y: e.clientY }
  }
  const up = () => { drag = null }
  canvas.addEventListener('pointerdown', down)
  canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerup', up)
  canvas.addEventListener('pointercancel', up)

  rebuild()
  return {
    setSkin(image, isLegacy) {
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      legacy = isLegacy
      hasSkin = true
      rebuild()
    },
    setSlim(s) { slim = s; rebuild() },
    setLayer(s) { layer = s },
    setView(v) {
      spinning = v === 'spin'
      if (spinning) return void (target = null)
      // The nearest yaw that faces the camera (front) or away from it (back), so it never turns the long way round.
      const face = v === 'front' ? 0 : Math.PI
      const t = face + Math.round((yaw - face) / (2 * Math.PI)) * 2 * Math.PI
      if (reduceMotion) { yaw = t; pitch = 0.15; target = null } else target = t
    },
    destroy() {
      cancelAnimationFrame(frame)
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointercancel', up)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
