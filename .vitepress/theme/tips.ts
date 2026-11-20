// "Did you know?" tips on the home page. Client-safe: types and helpers only.

/** The full list, written at build time (and served by the dev server). The home page fetches it after loading. */
export const TIPS_PATH = '/tips.json'
export const CHEAT_SHEET_URL = '/guide/cheat-sheet'

/**
 * One tip. A command tip comes from a cheat sheet row: `command` is the command and `text` what it does. Any other tip
 * comes from tips/tips.toml. `text` may hold `code` in backticks. `link` is the guide page to read more on.
 */
export interface Tip { text: string; command?: string; link: string }

export interface TipsFile { tips: Tip[] }

/** Splits text at backticks: odd-numbered parts were inside them and render as code. */
export function codeParts(text: string): { code: boolean; text: string }[] {
  return text.split('`').map((part, i) => ({ code: i % 2 === 1, text: part })).filter((p) => p.text)
}
