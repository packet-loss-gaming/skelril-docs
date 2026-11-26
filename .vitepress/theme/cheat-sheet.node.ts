// Build-time check of the player cheat sheet: the rows of each table must be in alphabetical order. Used by
// config.mts, so a misplaced row fails the build; never import this from the client.
import fs from 'node:fs'
import path from 'node:path'
import { guideSource } from './news.node'
import { CHEAT_SHEET_URL } from './tips'

/** A row's sort key: its first cell without backticks, lower case, such as "/claim trust <player> [here]". */
function sortKey(cell: string): string {
  return cell.replace(/`/g, '').toLowerCase()
}

/** Fails unless every table (consecutive "|" lines) on the cheat sheet lists its rows in order of their first cell. */
export function checkCheatSheet(root: string, rewrites: Record<string, string>): void {
  const source = guideSource(rewrites, CHEAT_SHEET_URL)
  if (!source) throw new Error(`cheat sheet: no guide page at ${CHEAT_SHEET_URL}`)
  const problems: string[] = []
  let previous: { key: string; line: number } | undefined
  fs.readFileSync(path.join(root, source), 'utf8').split('\n').forEach((line, i) => {
    if (!line.trim().startsWith('|')) return void (previous = undefined)
    const cells = line.trim().split(/(?<!\\)\|/).slice(1, -1).map((c) => c.trim())
    if (cells.length !== 2) problems.push(`line ${i + 1} has ${cells.length} cells, not 2 (escape a "|" in a cell as "\\|")`)
    // Body rows start with a command; this skips the header and the --- separator.
    if (!cells[0]?.startsWith('`')) return
    const key = sortKey(cells[0])
    if (previous && key < previous.key) problems.push(`line ${i + 1} (${cells[0]}) is out of alphabetical order: it belongs before line ${previous.line}`)
    previous = { key, line: i + 1 }
  })
  if (problems.length) throw new Error(`cheat sheet ${source}:\n  ${problems.join('\n  ')}`)
}
