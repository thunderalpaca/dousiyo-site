import { withBase } from 'vitepress'

// Shared types
export interface Line {
  name: string
  letter: string
  id: string
  link: string
  color: string
  slug?: string
  companyKey?: string
}

export interface StationID {
  line: Line['id']
  id: string
  prev: Station["id"]
  next: Station["id"]
}

export interface Station {
  name: string
  id: string
  lines: StationID[]
  link: string
}

export function mapToLines(raw: any[]): Line[] {
  return raw.map((item: any) => {
    const url: string = item?.url || ''
    const title: string = item?.frontmatter?.title?.toString?.() || ''
    const letter: string = item?.frontmatter?.letter?.toString?.() || ''
    const name = title.replace(/\s*\([^)]+\)\s*$/, '').trim()
  const parts = url.split('/').filter(Boolean)
  const slug = (parts[parts.length - 1] || '').replace(/\.html$/, '')
  const lineIdx = parts.indexOf('line')
  const companyKey = lineIdx > 0 ? parts[lineIdx - 1] : ''
  const prefix = companyKey.slice(0, 3)
  const id = `${prefix}${letter}`
  const link = withBase(url.startsWith('/') ? url : `/${url}`)
    const color: string = item?.frontmatter?.color?.toString?.() || ''
  const line: Line = { name, letter, id, link, color, slug, companyKey }
    return line
  })
}

export async function loadLines(): Promise<Line[]> {
  const mod: any = await import('../../line.data')
  const loaded: any[] = Array.isArray(mod?.data) ? mod.data : []
  return mapToLines(loaded)
}

export async function loadStationsRaw(): Promise<any[]> {
  const stationMod: any = await import('../../station.data')
  return Array.isArray(stationMod?.data) ? stationMod.data : []
}

export function buildStationsData(lines: Line[], stationRaw: any[]): Station[] {
  const idMap: Record<string, Line> = {}
  const slugMap: Record<string, Line> = {}
  for (const l of lines) {
    idMap[l.id] = l
    if (l.slug) slugMap[l.slug] = l
  }
  return stationRaw.map((st: any) => {
    const name: string = st?.frontmatter?.title?.toString?.() || ''
    const stationUrl: string = st?.url || ''
    const parts = stationUrl.split('/').filter(Boolean)
    const sSlug = (parts[parts.length - 1] || '').replace(/\.html$/, '')
    const link: string = stationUrl ? withBase(stationUrl.startsWith('/') ? stationUrl : `/${stationUrl}`) : ''
    const stationLines: StationID[] = []
    const lineFm: Record<string, any> | undefined = st?.frontmatter?.line
    if (!lineFm || typeof lineFm !== 'object') return { name, id: sSlug, lines: stationLines, link }
    for (const key of Object.keys(lineFm)) {
      let line: Line | undefined = idMap[key] || slugMap[key]
      if (!line) continue
      const entry = lineFm[key] || {}
      const numRaw = entry?.number ?? entry?.num ?? entry?.id
      const numStr = String(numRaw ?? '').trim()
      if (!/^[0-9]+$/.test(numStr)) continue
      const prevRaw: string | undefined = entry?.prev
      const nextRaw: string | undefined = entry?.next
      stationLines.push({ line: line.id, id: numStr, prev: prevRaw as any, next: nextRaw as any })
    }
    return { name, id: sSlug, lines: stationLines, link }
  })
}

export async function loadStations(): Promise<Station[]> {
  const [lines, raw] = await Promise.all([loadLines(), loadStationsRaw()])
  return buildStationsData(lines, raw)
}

export function getStationById(stations: Station[], id: Station['id']): Station | undefined {
  if (!Array.isArray(stations)) return undefined
  const target = String(id ?? '').trim()
  if (!target) return undefined
  return stations.find(s => String(s?.id ?? '').trim() === target)
}

export async function getStationByIdLazy(id: Station['id']): Promise<Station | undefined> {
  const stations = await loadStations()
  return getStationById(stations, id)
}

export function getLineById(lines: Line[], id: Line['id']): Line | undefined {
  if (!Array.isArray(lines)) return undefined
  const target = String(id ?? '').trim()
  if (!target) return undefined
  return lines.find(l => String(l?.id ?? '').trim() === target)
}

export async function getLineByIdLazy(id: Line['id']): Promise<Line | undefined> {
  const lines = await loadLines()
  return getLineById(lines, id)
}
