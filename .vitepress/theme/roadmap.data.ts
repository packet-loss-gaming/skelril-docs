// Loads roadmap/roadmap.toml at build time, validates it, and hands it to the /roadmap page.
import { defineLoader } from 'vitepress'
import type { RoadmapData } from './roadmap'
import { loadRoadmap } from './roadmap.node'

declare const data: RoadmapData
export { data }
export type { RoadmapData }

export default defineLoader({
  watch: ['../../roadmap/roadmap.toml'],
  load(files: string[]): RoadmapData {
    if (files.length !== 1) throw new Error(`roadmap.data.ts: expected roadmap/roadmap.toml, found ${files.length} files`)
    return loadRoadmap(files[0])
  },
})
