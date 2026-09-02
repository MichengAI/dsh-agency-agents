// 生成 src/client/roster.ts：从 assets/agency-agents 提取静态花名册（slug/英文名/emoji/分区/简介）。
// 中文名与中文分区由 client 端复用 src/names.ts（ZH_NAME/ZH_DIVISION），此处不重复。
// 用法：node scripts/generate-roster.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises'

const ROOT = new URL('../assets/agency-agents/', import.meta.url)
const DIVISIONS = [
  'academic', 'design', 'engineering', 'finance', 'game-development', 'gis',
  'healthcare', 'marketing', 'paid-media', 'product', 'project-management',
  'research', 'sales', 'security', 'spatial-computing', 'specialized', 'support', 'testing',
]

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (m === null) return {}
  const fm = m[1]
  const get = (key) => {
    const mm = fm.match(new RegExp('^' + key + '\\s*:\\s*(.*)$', 'm'))
    if (mm === null) return undefined
    let v = mm[1].trim()
    if (v.length >= 2 && ((v[0] === '"' && v.endsWith('"')) || (v[0] === "'" && v.endsWith("'")))) v = v.slice(1, -1)
    return v
  }
  return { name: get('name'), emoji: get('emoji'), description: get('description'), descriptionEn: get('descriptionEn') }
}

async function walk(dir, cb) {
  let entries
  try { entries = await readdir(dir, { withFileTypes: true }) } catch { return }
  for (const e of entries) {
    const full = new URL(e.name + '/', dir)
    if (e.isDirectory()) await walk(full, cb)
    else if (e.isFile() && e.name.endsWith('.md')) await cb(full, e.name)
  }
}

const roster = []
for (const source of DIVISIONS.map((division) => ({ dir: division, division }))) {
  await walk(new URL(source.dir + '/', ROOT), async (fileUrl, fileName) => {
    const slug = fileName.slice(0, -3)
    const raw = await readFile(fileUrl, 'utf8')
    const parsed = parseFrontmatter(raw)
    if (parsed.name === undefined || parsed.description === undefined) return
    roster.push({ slug, nameEn: parsed.name, emoji: parsed.emoji ?? '', division: source.division, description: parsed.description, descriptionEn: parsed.descriptionEn ?? '' })
  })
}

roster.sort((a, b) => a.slug.localeCompare(b.slug))

const out = new URL('../src/client/roster.ts', import.meta.url)
const body = `// 由 scripts/generate-roster.mjs 生成，勿手改。\nexport interface RosterEntry {\n  readonly slug: string\n  readonly nameEn: string\n  readonly emoji: string\n  readonly division: string\n  readonly description: string\n  readonly descriptionEn: string\n}\n\nexport const ROSTER: ReadonlyArray<RosterEntry> = ${JSON.stringify(roster, null, 2)}\n`
await writeFile(out, body, 'utf8')
console.log(`已生成 ${roster.length} 条 roster -> src/client/roster.ts`)
