// Loads roadmap/roadmap.toml at build time, validates it, and hands it to the /roadmap page.
import fs from 'node:fs'
import { parse } from 'smol-toml'
import { defineLoader } from 'vitepress'
import { ICON_NAMES } from 'vitepress-theme-skelril/node'
import { STATUSES, type RoadmapData, type RoadmapPhase, type Status } from './roadmap'

function isStatus(value: unknown): value is Status {
  return typeof value === 'string' && (STATUSES as readonly string[]).includes(value)
}

declare const data: RoadmapData
export { data }
export type { RoadmapData }

export default defineLoader({
  watch: ['../../roadmap/roadmap.toml'],
  load(files: string[]): RoadmapData {
    if (files.length !== 1) throw new Error(`roadmap.data.ts: expected roadmap/roadmap.toml, found ${files.length} files`)
    const raw = parse(fs.readFileSync(files[0], 'utf8')) as Record<string, unknown> & { phases: RoadmapPhase[] }
    // A TOML date (updated = 2026-11-18) is parsed as a Date; turn it back into YYYY-MM-DD text.
    const updated = raw.updated instanceof Date ? raw.updated.toISOString().slice(0, 10) : String(raw.updated)
    for (const phase of raw.phases) {
      for (const status of [phase.status, ...phase.items.map((i) => i.status)]) {
        if (!isStatus(status)) throw new Error(`roadmap.toml: unknown status "${status}" in phase "${phase.name}"`)
      }
      if (!ICON_NAMES.includes(phase.icon)) throw new Error(`roadmap.toml: unknown icon "${phase.icon}" in phase "${phase.name}"`)
    }
    const legend = raw.legend as Record<Status, string> | undefined
    for (const s of STATUSES) if (!legend || !legend[s]) throw new Error(`roadmap.toml: legend is missing "${s}"`)
    return { ...(raw as unknown as RoadmapData), updated }
  },
})
