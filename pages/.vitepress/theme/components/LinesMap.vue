<template>
    <div class="lines-map">
        <div class="line" v-for="line in Lines" :key="line.id" :style="{ backgroundColor: line.color }">
            <a :href="line.link" style="color: black; font-weight: normal;">
                <span class="line-name">{{ line.name }}</span></a>
            <span class="line-id">_{{ line.id }}</span>
            <span class="line-letter">_{{ line.letter }}</span>
        </div>
    </div>

    <div class="stations">
        <div class="station" v-for="st in StationsData" :key="st.link || st.name">
            <a class="station-name" :href="st.link">{{ st.name }}</a>
            <span class="station-line" v-for="sl in st.lines" :key="sl.line + '-' + sl.id"
                :style="{ backgroundColor: lineById[sl.line]?.color || '#ddd' }">
                {{ lineById[sl.line]?.letter }}{{ sl.id }}
            </span>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { withBase } from 'vitepress'
// line.data is a VitePress content loader; access its named `data` export via dynamic import


interface Line {
    name: string;
    letter: string;
    id: string;
    link: string;
    color: string;
}

interface StationID {
    line: Line['id'];
    id: number;
}

interface Station {
    name: string;
    lines: StationID[];
    link: string;
}

const Lines = ref<Line[]>([])
const StationsData = ref<Station[]>([])

const lineById = computed<Record<string, Line>>(() => {
    const map: Record<string, Line> = {}
    for (const l of Lines.value) map[l.id] = l
    return map
})

function mapToLines(raw: any[]): Line[] {
    return raw.map((item: any) => {
        const url: string = item?.url || ''
        const title: string = item?.frontmatter?.title?.toString?.() || ''
        const letterMatch = title.match(/\(([^)]+)\)\s*$/)
        const letter = letterMatch ? letterMatch[1] : ''
        const name = title.replace(/\s*\([^)]+\)\s*$/, '').trim()
        const id = (url.split('/').filter(Boolean).pop() || '').replace(/\.html$/, '')
        const link = withBase(url.startsWith('/') ? url : `/${url}`)
        const color = item?.color || ''
        const line: Line = { name, letter, id, link, color }
        return line
    })
}

// Helpers for fallback parsing if station.data lacks extras
function parseServedLineIdsFromSrc(src: string): string[] {
    const ids: string[] = []
    const sectionIdx = src.indexOf('## 乗り入れ路線')
    let servedSection = ''
    if (sectionIdx !== -1) {
        const after = src.slice(sectionIdx)
        const nextIdx = after.indexOf('\n## ')
        servedSection = nextIdx !== -1 ? after.slice(0, nextIdx) : after
    } else {
        servedSection = src
    }
    const re = /\]\((\/company\/[^)]+?\/line\/([a-z0-9_-]+)\.md)\)/gi
    for (const m of servedSection.matchAll(re)) {
        const id = (m as any)[2]
        if (id && !ids.includes(id)) ids.push(id)
    }
    return ids
}

function parseNumberingsFromSrc(src: string): Record<string, string> {
    const map: Record<string, string> = {}
    for (const m of src.matchAll(/`([A-Za-z])([0-9]+)`/g)) {
        const letter = (m as any)[1]; const digits = (m as any)[2]
        if (letter && digits && !(letter in map)) map[letter] = digits
    }
    return map
}

async function loadLines(): Promise<Line[]> {
    const mod: any = await import('../../line.data')
    const loaded: any[] = Array.isArray(mod?.data) ? mod.data : []
    return mapToLines(loaded)
}

async function loadStationsRaw(): Promise<any[]> {
    const stationMod: any = await import('../../station.data')
    return Array.isArray(stationMod?.data) ? stationMod.data : []
}

function buildStationsData(lines: Line[], stationRaw: any[]): Station[] {
    return stationRaw.map((st: any) => {
        const name: string = st?.frontmatter?.title?.toString?.() || ''
        const stationUrl: string = st?.url || ''
        const link: string = stationUrl ? withBase(stationUrl.startsWith('/') ? stationUrl : `/${stationUrl}`) : ''
        const servedLineIds: string[] = Array.isArray(st?.servedLineIds) && st.servedLineIds.length
            ? st.servedLineIds
            : parseServedLineIdsFromSrc(st?.src || '')
        const numberings: Record<string, string> = st?.numberings && Object.keys(st.numberings).length
            ? st.numberings
            : parseNumberingsFromSrc(st?.src || '')

        const stationLines: StationID[] = []
        for (const lid of servedLineIds) {
            const line = lines.find(l => l.id === lid)
            if (!line) continue
            const digits = numberings[line.letter]
            if (!digits) continue
            const num = parseInt(digits, 10)
            if (Number.isFinite(num)) stationLines.push({ line: line.id, id: num })
        }
        return { name, lines: stationLines, link }
    })
}

async function init() {
    try {
        Lines.value = await loadLines()
        const stationRaw = await loadStationsRaw()
        StationsData.value = buildStationsData(Lines.value, stationRaw)
        console.log('Lines mapped:', Lines.value)
        console.log('StationsData built:', StationsData.value)
    } catch (e) {
        console.error('Failed to load or build data:', e)
    }
}

onMounted(() => { void init() })

</script>