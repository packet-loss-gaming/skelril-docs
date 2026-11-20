// The roadmap's data shape, shared by the data loader and the page.
export const HORIZONS = ['soon', 'working', 'later'] as const
export type Horizon = (typeof HORIZONS)[number]

/** An upcoming feature to look out for. */
export interface Teaser {
  title: string
  horizon: Horizon
  icon: string
  text: string
}

export interface RoadmapData {
  horizons: Record<Horizon, string>
  teasers: Teaser[]
}
