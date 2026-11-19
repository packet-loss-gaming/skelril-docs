// The roadmap's statuses and data shape, shared by the data loader and the page.
export const STATUSES = ['done', 'active', 'next', 'planned', 'later'] as const
export type Status = (typeof STATUSES)[number]

export interface RoadmapItem {
  text: string
  status: Status
}

export interface RoadmapPhase {
  name: string
  icon: string
  status: Status
  summary: string
  items: RoadmapItem[]
}

export interface RoadmapData {
  title: string
  tagline: string
  updated: string
  intro: string
  legend: Record<Status, string>
  phases: RoadmapPhase[]
}
