// Build-time side of the roadmap: reads and validates roadmap/roadmap.toml. Used by roadmap.data.ts; never import this
// from the client.
import fs from 'node:fs'
import { parse } from 'smol-toml'
import { ICON_NAMES } from 'vitepress-theme-skelril/node'
import { HORIZONS, type Horizon, type RoadmapData, type Teaser } from './roadmap'

function isHorizon(value: unknown): value is Horizon {
  return typeof value === 'string' && (HORIZONS as readonly string[]).includes(value)
}

function text(value: unknown, where: string, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`roadmap.toml: ${where} needs a "${field}"`)
  return value.trim()
}

export function loadRoadmap(file: string): RoadmapData {
  const raw = parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>
  const horizons = raw.horizons as Record<Horizon, string> | undefined
  for (const h of HORIZONS) if (!horizons || !horizons[h]) throw new Error(`roadmap.toml: [horizons] is missing "${h}"`)

  const teasers = ((raw.teasers ?? []) as Record<string, unknown>[]).map((t, i): Teaser => {
    const where = `teaser ${i + 1} (${String(t.title)})`
    if (!isHorizon(t.horizon)) throw new Error(`roadmap.toml: ${where} has unknown horizon "${String(t.horizon)}"`)
    if (typeof t.icon !== 'string' || !ICON_NAMES.includes(t.icon)) throw new Error(`roadmap.toml: ${where} has unknown icon "${String(t.icon)}"`)
    return { title: text(t.title, where, 'title'), horizon: t.horizon, icon: t.icon, text: text(t.text, where, 'text') }
  })
  return { horizons: horizons as Record<Horizon, string>, teasers }
}
