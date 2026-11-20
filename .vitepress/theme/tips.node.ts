// Build-time side of the home page's tips: reads tips/tips.toml and the cheat sheet's command table, validates them,
// and writes tips.json. Used by config.mts, so a bad tip fails the build; never import this from the client.
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'smol-toml'
import { guideSource, guideUrls } from './news.node'
import { CHEAT_SHEET_URL, type Tip, type TipsFile } from './tips'

export const TIPS_FILE = 'tips/tips.toml'

function text(value: unknown, where: string, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`tips.toml: ${where} needs a "${field}"`)
  return value.trim()
}

/** The cheat sheet's rows as { command, text }. Cells split at unescaped pipes; "\|" in a cell is a literal pipe. */
function cheatSheetCommands(file: string): { command: string; text: string }[] {
  const rows: { command: string; text: string }[] = []
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const cells = line.trim().split(/(?<!\\)\|/).slice(1, -1).map((c) => c.trim().replace(/\\\|/g, '|'))
    const command = /^`(\/[^`]+)`$/.exec(cells[0] ?? '')
    if (cells.length === 2 && command) rows.push({ command: command[1], text: cells[1] })
  }
  if (!rows.length) throw new Error(`tips: found no commands in ${file}`)
  return rows
}

/** Every tip: tips.toml's own first, in file order, then one per cheat sheet command not listed in its `skip`. */
export function loadTips(root: string, rewrites: Record<string, string>): Tip[] {
  const raw = parse(fs.readFileSync(path.join(root, TIPS_FILE), 'utf8')) as Record<string, unknown>
  const guides = guideUrls(rewrites)
  const tips = ((raw.tips ?? []) as Record<string, unknown>[]).map((t, i): Tip => {
    const where = `tip ${i + 1}`
    const link = text(t.link, where, 'link')
    // The dead-link check does not see links made by Vue components, so check the page (without its #section) here.
    if (!guides.has(link.split('#')[0])) throw new Error(`tips.toml: ${where} links to missing guide page "${link}"`)
    return { text: text(t.text, where, 'text'), link }
  })
  if (!tips.length) throw new Error('tips.toml needs at least one [[tips]]')

  const skip = (raw.skip ?? []) as unknown[]
  if (!Array.isArray(skip) || skip.some((s) => typeof s !== 'string')) throw new Error('tips.toml: skip must be a list of commands such as "/pr"')
  const source = guideSource(rewrites, CHEAT_SHEET_URL)
  if (!source) throw new Error(`tips: no cheat sheet at ${CHEAT_SHEET_URL}`)
  const commands = cheatSheetCommands(path.join(root, source))
  for (const s of skip as string[]) {
    if (!commands.some((c) => c.command.split(' ')[0] === s)) throw new Error(`tips.toml: skip lists "${s}", which is not on the cheat sheet`)
  }
  return [...tips, ...commands.filter((c) => !skip.includes(c.command.split(' ')[0])).map((c) => ({ ...c, link: CHEAT_SHEET_URL }))]
}

export function renderTips(tips: Tip[]): string {
  return JSON.stringify({ tips } satisfies TipsFile)
}
