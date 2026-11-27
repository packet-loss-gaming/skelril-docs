<script setup lang="ts">
// The skin tool (wiki.skelril.net/skins): turns a skin PNG into the base64 text that Settings > Skins > Add skin > "Paste a
// skin file" takes in the game, and shows the skin on a 3D model. Everything happens in the browser; nothing is uploaded.
// The checks match the game's (Lunatic native/src/skins/png.cpp): a PNG of 64x64 or 64x32 pixels, at most 96 KB.
// Layout: the model beside three numbered steps (choose, check and copy, paste in the game), each lit up in turn.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { createSkinView, type SkinView } from './skinModel'
import { backdrop, skeletonSkin } from './skinScene'

const MAX_BYTES = 96 * 1024
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

type View = 'front' | 'back' | 'spin'
const VIEWS: { id: View; label: string }[] = [{ id: 'front', label: 'Front' }, { id: 'back', label: 'Back' }, { id: 'spin', label: 'Spin' }]

const canvas = ref<HTMLCanvasElement>()
const fileInput = ref<HTMLInputElement>()
const text = ref('')
const fileName = ref('')
const dims = ref('')
const kb = ref('')
const detectedSlim = ref(false)
const error = ref('')
const copied = ref(false)       // the button says "Copied" for a moment
const everCopied = ref(false)   // step 2 is done, step 3 is up
const slim = ref(false)
const layer = ref(true)
const dragging = ref(false)
const noWebGL = ref(false)
const view = ref<View | null>(null)
let model: SkinView | null = null

// Each step is done, the current one, or still to come.
const steps = computed(() => {
  const s1 = text.value ? 'done' : 'now'
  const s2 = !text.value ? 'later' : everCopied.value ? 'done' : 'now'
  const s3 = everCopied.value ? 'now' : 'later'
  return [s1, s2, s3]
})

onMounted(() => {
  if (canvas.value) model = createSkinView(canvas.value, () => (view.value = null))
  noWebGL.value = !model
  model?.setSkin(skeletonSkin(), false)     // a stand-in until a skin is chosen
  view.value = model && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'spin' : null
})
onBeforeUnmount(() => model?.destroy())

function toBase64(bytes: Uint8Array): string {
  let s = ''
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(s)
}

// The game guesses slim arms the same way: the column right of a classic right arm (x 54-55, y 20-31) is transparent.
function guessSlim(px: Uint8ClampedArray, height: number): boolean {
  if (height !== 64) return false
  for (let y = 20; y < 32; y++) for (let x = 54; x < 56; x++) if (px[(y * 64 + x) * 4 + 3] !== 0) return false
  return true
}

async function load(file: File) {
  error.value = ''
  copied.value = false
  everCopied.value = false
  text.value = ''
  fileName.value = file.name
  if (file.size > MAX_BYTES) return void (error.value = `That file is ${Math.ceil(file.size / 1024)} KB; a skin can be at most 96 KB.`)
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (!PNG_SIGNATURE.every((b, i) => bytes[i] === b)) return void (error.value = 'That is not a PNG image. Skins are PNG files.')
  let image: ImageBitmap
  try {
    image = await createImageBitmap(new Blob([bytes], { type: 'image/png' }))
  } catch {
    return void (error.value = 'That PNG could not be read. Is the file damaged?')
  }
  if (image.width !== 64 || (image.height !== 64 && image.height !== 32)) {
    return void (error.value = `That image is ${image.width}x${image.height} pixels; a skin is 64x64 (or the old 64x32).`)
  }
  const flat = document.createElement('canvas')
  flat.width = 64
  flat.height = image.height
  const ctx = flat.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(image, 0, 0)
  detectedSlim.value = slim.value = guessSlim(ctx.getImageData(0, 0, 64, image.height).data, image.height)
  model?.setSlim(slim.value)
  model?.setSkin(flat, image.height === 32)
  text.value = toBase64(bytes)
  dims.value = `${image.width}x${image.height}`
  kb.value = `${(file.size / 1024).toFixed(1)} KB`
}

function picked(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) load(file)
  input.value = ''              // so choosing the same file again still loads it
}
function dropped(e: DragEvent) {
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) load(file)
}

async function copy() {
  try {
    await navigator.clipboard.writeText(text.value)
  } catch {
    // Older browsers, or a page not served over HTTPS: select the text so Ctrl+C works.
    const field = document.getElementById('skin-text') as HTMLInputElement | null
    field?.select()
    document.execCommand('copy')
  }
  copied.value = everCopied.value = true
  setTimeout(() => (copied.value = false), 2500)
}

function setSlim(s: boolean) { slim.value = s; model?.setSlim(s) }
function setLayer(s: boolean) { layer.value = s; model?.setLayer(s) }
function setView(v: View) { view.value = v; model?.setView(v) }
</script>

<template>
  <div :class="$style.tool">
    <div :class="[$style.stage, dragging && $style.over]" :style="backdrop" @dragover.prevent="dragging = true" @dragleave="dragging = false" @drop.prevent="dropped">
      <canvas ref="canvas" :class="$style.view" aria-label="Your skin on a player model. Drag to turn it." role="img" />
      <div v-if="!noWebGL" :class="$style.views" role="group" aria-label="Turn the model">
        <button v-for="v in VIEWS" :key="v.id" type="button" :class="[$style.chip, $style.solid, view === v.id && $style.on]"
          :aria-pressed="view === v.id" @click="setView(v.id)">{{ v.label }}</button>
      </div>
      <p v-else :class="$style.hint">This browser cannot show the 3D model, but the text still works.</p>
    </div>

    <ol :class="$style.steps">
      <li :class="[$style.step, $style[steps[0]]]">
        <span :class="$style.badge" aria-hidden="true">
          <svg v-if="steps[0] === 'done'" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 10l4 4 8-8" /></svg>
          <template v-else>1</template>
        </span>
        <div :class="$style.body">
          <div :class="$style.head">
            <h3 :class="$style.title">Choose a skin</h3>
            <button v-if="text" type="button" :class="[$style.chip, $style.again]" @click="fileInput?.click()">Choose another</button>
          </div>
          <template v-if="text">
            <p :class="$style.p"><strong :class="$style.name">{{ fileName }}</strong>: {{ dims }}, {{ kb }}</p>
            <ul :class="$style.checks" aria-label="Checks passed">
              <li>PNG</li>
              <li>{{ dims }} pixels<template v-if="dims === '64x32'"> (the older layout)</template></li>
              <li>Under 96 KB</li>
              <li>{{ detectedSlim ? 'Slim' : 'Classic' }} arms detected</li>
            </ul>
          </template>
          <template v-else>
            <p :class="$style.p">A PNG of 64x64 pixels (or the older 64x32), at most 96 KB, as made for Minecraft.</p>
            <div :class="$style.head">
              <button type="button" :class="$style.btn" @click="fileInput?.click()">Choose a skin file</button>
              <span :class="$style.p">or drop one on the model</span>
            </div>
          </template>
          <p v-if="error" :class="$style.error" role="alert"><strong>{{ fileName }}</strong>: {{ error }}</p>
          <input ref="fileInput" type="file" accept="image/png" :class="$style.hidden" @change="picked">
        </div>
      </li>

      <li :class="[$style.step, $style[steps[1]]]">
        <span :class="$style.badge" aria-hidden="true">
          <svg v-if="steps[1] === 'done'" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 10l4 4 8-8" /></svg>
          <template v-else>2</template>
        </span>
        <div :class="$style.body">
          <h3 :class="$style.title">Check it and copy</h3>
          <template v-if="text">
            <div :class="$style.row">
              <div :class="$style.row" role="group" aria-label="Arms">
                <span :class="$style.label">Arms</span>
                <button type="button" :class="[$style.chip, !slim && $style.on]" :aria-pressed="!slim" @click="setSlim(false)">Classic</button>
                <button type="button" :class="[$style.chip, slim && $style.on]" :aria-pressed="slim" @click="setSlim(true)">Slim</button>
              </div>
              <label :class="$style.row"><input type="checkbox" :checked="layer" @change="setLayer(($event.target as HTMLInputElement).checked)"> Outer layer</label>
            </div>
            <div :class="$style.copyRow">
              <label :class="$style.field">
                <span :class="$style.label">Skin text</span>
                <input id="skin-text" :class="$style.text" type="text" readonly :value="text" @focus="($event.target as HTMLInputElement).select()">
              </label>
              <button type="button" :class="[$style.btn, $style.primary]" @click="copy">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="5" width="9" height="9" /><path d="M2 11V2h9" /></svg>
                {{ copied ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <span :class="$style.live" aria-live="polite">{{ copied ? 'Copied the skin text.' : '' }}</span>
          </template>
          <p v-else :class="$style.p">Turn the model to check your skin, then copy it as text.</p>
        </div>
      </li>

      <li :class="[$style.step, $style[steps[2]]]">
        <span :class="$style.badge" aria-hidden="true">3</span>
        <div :class="$style.body">
          <h3 :class="$style.title">Paste it in the game</h3>
          <ol :class="$style.path" aria-label="Where to paste">
            <li>Inventory</li><li aria-hidden="true">›</li>
            <li>Settings</li><li aria-hidden="true">›</li>
            <li>Add skin</li><li aria-hidden="true">›</li>
            <li>Paste a skin file</li><li aria-hidden="true">›</li>
            <li :class="$style.key">Ctrl+V</li>
          </ol>
          <p :class="$style.p">The game picks the arms the same way; you can change them there. <a href="/guide/mechanics/skins">Skins guide</a></p>
        </div>
      </li>
      <li :class="$style.note">Your file never leaves your computer: nothing is uploaded.</li>
    </ol>
  </div>
</template>

<style module>
.tool { display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start; margin: 24px 0; }

/* The stage: pixel art at 4 CSS pixels per pixel. Clouds, ground along the bottom (the model's feet stand on the grass), sky. */
.stage { flex: 1 1 360px; min-width: 0; position: relative; height: 600px; border: 4px solid; border-color: #c9a07a #5e4129 #5e4129 #c9a07a;
  overflow: hidden; image-rendering: pixelated; background-color: #8ecbff;
  background-image: var(--cloud-near), var(--cloud-far), var(--ground), var(--sky-day);
  background-size: 240px 16px, 184px 12px, 64px 48px, 100% 100%;
  background-repeat: repeat-x, repeat-x, repeat-x, no-repeat;
  background-position: 0 72px, 0 128px, 0 100%, 0 0;
  animation: drift 120s linear infinite; }
:global(.dark) .stage { background-color: #16224a;
  background-image: var(--stars), var(--ground), var(--sky-night);
  background-size: 160px 120px, 64px 48px, 100% 100%;
  background-repeat: repeat-x, repeat-x, no-repeat;
  background-position: 0 0, 0 100%, 0 0;
  animation: none; }
/* The clouds drift slowly; the ground and sky stay put. */
@keyframes drift { to { background-position: 240px 72px, 184px 128px, 0 100%, 0 0; } }
@media (prefers-reduced-motion: reduce) { .stage { animation: none; } }
.over { outline: 3px dashed var(--gold); outline-offset: -10px; }
.view { width: 100%; height: 100%; display: block; touch-action: none; cursor: grab; }
.view:active { cursor: grabbing; }
.views { position: absolute; inset: 12px 12px auto; display: flex; justify-content: center; gap: 8px; }
.hint { position: absolute; inset: 12px 0 auto; margin: 0; text-align: center; font-size: 14px; color: var(--ink); pointer-events: none; }

.steps { flex: 1 1 420px; min-width: 0; list-style: none !important; margin: 0 !important; padding: 0 !important; display: flex; flex-direction: column; gap: 14px; }
.step { display: flex; gap: 14px; margin: 0 !important; padding: 16px; background: var(--card); border: 3px solid var(--dirt-light); }
.done { border-color: var(--grass); }
.now { border-color: var(--gold); }
.later { opacity: 0.75; }
.badge { flex: none; width: 36px; height: 36px; display: grid; place-items: center; font-family: "Silkscreen", monospace; font-size: 18px;
  background: var(--vp-c-bg-soft); color: var(--ink); }
.done .badge { background: var(--grass); color: #fff; }
.now .badge { background: var(--gold); color: #1b1b1b; }
.body { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 12px; width: 100%; }
.head:has(.btn) { justify-content: flex-start; }
.title { margin: 0 !important; padding: 0 !important; border: 0 !important; font-family: "Silkscreen", monospace; font-size: 15px !important;
  font-weight: 400; line-height: 1.4 !important; color: var(--ink) !important; }
.p { margin: 0 !important; font-size: 15px; line-height: 1.5; }
.name { overflow-wrap: anywhere; }
.checks { list-style: none !important; margin: 0 !important; padding: 0 !important; display: flex; flex-wrap: wrap; gap: 6px 16px; font-size: 14px;
  font-weight: 700; color: var(--grass-dark); }
:global(.dark) .checks { color: var(--grass-light); }
.checks li { margin: 0 !important; }
.checks li::before { content: "✓ "; }
.row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; font-size: 15px; }
.copyRow { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 10px; width: 100%; }
.field { flex: 1 1 220px; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.label { font-weight: 700; font-size: 15px; }
.text { width: 100%; box-sizing: border-box; font-family: monospace; font-size: 12px; padding: 10px 8px; min-height: 44px;
  background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); border: 2px solid var(--stone); }
.path { list-style: none !important; margin: 0 !important; padding: 0 !important; display: flex; flex-wrap: wrap; align-items: center; gap: 6px;
  font-size: 14px; font-weight: 700; }
.path li { margin: 0 !important; display: block; }  /* not list-item: VitePress numbers .vp-doc ol items */
.path li:not([aria-hidden]) { padding: 4px 8px; border: 2px solid var(--dirt-light); }
.path .key { background: var(--deepslate); color: #fff; border-color: var(--deepslate) !important; }
.note { margin: 0 !important; padding: 0 4px; font-size: 14px; }
.error { margin: 0 !important; font-size: 15px; color: var(--vp-c-danger-1); font-weight: 700; }
.hidden { display: none; }
.live { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }

.btn { display: inline-flex; align-items: center; gap: 8px; font-family: "Silkscreen", monospace; font-size: 13px; padding: 10px 16px 8px;
  min-height: 44px; color: #fff; background: var(--dirt); border: 3px solid; border-color: #c9a07a #5e4129 #5e4129 #c9a07a; cursor: pointer; }
.primary { background: var(--sky); color: #1b1b1b; min-width: 130px; justify-content: center; }
.chip { font-size: 14px; font-weight: 700; padding: 6px 12px; min-height: 40px; background: transparent; color: var(--ink);
  border: 2px solid var(--stone); cursor: pointer; }
.solid { background: var(--card); border-color: var(--dirt-dark); }
.again { min-height: 36px; padding: 4px 10px; color: var(--grass-dark); border-color: var(--grass); }
:global(.dark) .again { color: var(--grass-light); }
.on { background: var(--gold); color: #1b1b1b; border-color: var(--deepslate); }
.btn:focus-visible, .chip:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }
</style>
