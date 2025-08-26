<script setup lang="ts">
import { computed, ref, onMounted, onServerPrefetch, onUnmounted, watch } from 'vue'
import { loadLines, loadStations, type Line as RawLine, type Station as RawStation } from '../lib/dataLoaders'

interface LineConnection {
    code: string
    prev: string | null
    next: string | null
}

interface Station {
    id: string
    name: string
    hiragana: string
    romaji: string
    lines: Record<string, LineConnection>
    x: number
    y: number
    not_station: boolean
    url?: string
}

interface Line {
    id: string
    numbering: string
    name: string
    color: string
    type: 'normal' | 'dot'
    width: number
    url?: string
}

interface RailwayMapData {
    canvas: {
        width: number
        height: number
        dark: boolean
    }
    stations: Station[]
    lines: Line[]
}

type LineConnectionRendered = {
    from: Station
    to: Station
    line: {
        id: string
        name: string
        color: string
        type: Line['type']
        width: number
    }
}

const props = defineProps<{
    data?: RailwayMapData
    fullscreen?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:fullscreen', value: boolean): void
}>()

// dataLoaders の出力から本コンポーネントの表示用データへ変換
function buildRailwayMapData(rawLines: RawLine[], rawStations: RawStation[]): RailwayMapData {
    const lines: Line[] = rawLines.map((l) => ({
        id: l.id,
        numbering: l.letter || l.id,
        name: l.name,
        color: l.color || '#000',
        type: 'normal',
        width: 4,
        url: (l as any).link || '',
    }))

    const stations: Station[] = rawStations.map((s) => {
        const lineRecord: Record<string, LineConnection> = {}
        for (const sid of (s.lines || [])) {
            lineRecord[sid.line] = {
                code: sid.id,
                prev: (sid.prev as any) ?? null,
                next: (sid.next as any) ?? null,
            }
        }
        return {
            id: s.id,
            name: s.name,
            hiragana: '',
            romaji: '',
            lines: lineRecord,
            x: typeof s.x === 'number' ? s.x : 0,
            y: typeof s.y === 'number' ? s.y : 0,
            not_station: false,
            url: (s as any).link || '',
        }
    })

    return {
        canvas: {
            width: 800,
            height: 600,
            dark: false,
        },
        stations,
        lines,
    }
}
const dataRef = ref<RailwayMapData | null>(props.data ?? null)

if (!props.data) {
    onServerPrefetch(async () => {
        try {
            const [rl, rs] = await Promise.all([loadLines(), loadStations()])
            dataRef.value = buildRailwayMapData(rl, rs)
        } catch (e) {
        }
    })

    onMounted(async () => {
        if (!dataRef.value) {
            try {
                const [rl, rs] = await Promise.all([loadLines(), loadStations()])
                dataRef.value = buildRailwayMapData(rl, rs)
            } catch (e) {
            }
        }
    })
}

function isColorLight(hexColor: string): '#000' | '#fff' {
    const hex = hexColor.replace('#', '')
    const bigint = parseInt(hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b
    return luminance > 186 ? '#000' : '#fff'
}

function getStationDisplayText(station: Station, allLines: Line[]) {
    const lineIds = Object.keys(station.lines)
    if (lineIds.length === 0) return station.name

    const stationNumbers = lineIds
        .map((lineId) => {
            const line = allLines.find((l) => l.id === lineId)
            const lineCode = station.lines[lineId]?.code ?? ''
            const lineNumbering = line?.numbering ?? lineId
            return `${lineNumbering}${lineCode}`
        })
        .join('・')

    return `${station.name} ${stationNumbers}`
}

function getLineConnections(stations: Station[], lines: Line[]): LineConnectionRendered[] {
    const connections: LineConnectionRendered[] = []
    const processed = new Set<string>()

    for (const station of stations) {
        for (const [lineId, connection] of Object.entries(station.lines)) {
            if (!connection.next) continue
            const nextStation = stations.find((s) => s.id === connection.next)
            if (!nextStation) continue

            const key = `${station.id}-${nextStation.id}`
            if (processed.has(key)) continue

            let usedLine = lines.find((l) => l.id === lineId)
            let color = usedLine?.color ?? '#000'
            let type: Line['type'] = usedLine?.type ?? 'normal'
            let width = usedLine?.width ?? 4

            if (!nextStation.lines[lineId]) {
                const nextIds = Object.keys(nextStation.lines)
                if (nextIds.length > 0) {
                    const nextLine = lines.find((l) => l.id === nextIds[0])
                    if (nextLine) {
                        usedLine = nextLine
                        color = nextLine.color
                        type = nextLine.type
                        width = nextLine.width
                    }
                }
            }

            connections.push({
                from: station,
                to: nextStation,
                line: {
                    id: usedLine?.id ?? lineId,
                    name: usedLine?.name ?? lineId,
                    color,
                    type,
                    width,
                },
            })

            processed.add(key)
        }
    }
    return connections
}

const data = computed(() => props.data ?? dataRef.value)

const dark = computed(() => data.value?.canvas?.dark ?? false)
const stations = computed(() => data.value?.stations ?? [])
const lines = computed(() => data.value?.lines ?? [])

const lineConnections = computed(() => getLineConnections(stations.value, lines.value))

const maxLineNameLength = computed(() => Math.max(...lines.value.map((l) => l.name.length), 0))
const charWidth = 13
const dynamicRectWidth = computed(() => Math.max(maxLineNameLength.value * charWidth + 10, 0))

const padding = 20
const legendRight = computed(() => 52 + dynamicRectWidth.value)
const legendBottom = computed(() => 8 + (lines.value.length * 20 + 4))
const maxStationX = computed(() => Math.max(0, ...stations.value.map(s => (s?.x ?? 0) + 8)))
const maxStationY = computed(() => Math.max(0, ...stations.value.map(s => (s?.y ?? 0) + 8)))
const width = computed(() => Math.max(600, Math.max(legendRight.value, maxStationX.value) + padding))
const height = computed(() => Math.max(600, Math.max(legendBottom.value, maxStationY.value) + padding))


const isFullscreen = ref(false)
const mainEl = ref<HTMLElement | null>(null)

function onFsChange() {
    const active = !!document.fullscreenElement
    isFullscreen.value = active
    emit('update:fullscreen', active)
}

async function enterFullscreen() {
    const el = mainEl.value
    if (!el) return
    if (document.fullscreenElement) return
    if (el.requestFullscreen) {
        try {
            await el.requestFullscreen()
        } catch (e) {
        }
    }
}

async function exitFullscreen() {
    if (document.fullscreenElement && document.exitFullscreen) {
        try {
            await document.exitFullscreen()
        } catch (e) {
        }
    }
}

watch(() => props.fullscreen, (val) => {
    if (val == null) return
    if (val) enterFullscreen()
    else exitFullscreen()
})

onMounted(() => {
    document.addEventListener('fullscreenchange', onFsChange)
})
onUnmounted(() => {
    document.removeEventListener('fullscreenchange', onFsChange)
})
</script>

<template>
    <main class="viewer" ref="mainEl" :class="{ fullscreen: isFullscreen }">
        <button class="fullscreen-toggle" type="button" @click="isFullscreen ? exitFullscreen() : enterFullscreen()">
            {{ isFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}
        </button>
        <div class="svg-container">
            <svg class="railway-map" :width="width + 100" :height="height + 100" :viewBox="`0 0 ${width} ${height}`"
                role="img" aria-label="路線図キャンバス" :style="{ backgroundColor: dark ? '#222' : 'white' }">

                <g>
                    <rect x="8" y="8" width="44" :height="(lines.length * 20) + 4" :fill="dark ? '#222' : '#f5f5f5'"
                        stroke="#ccc" />

                    <template v-for="(line, i) in lines" :key="`legend-color-${line.id}`">
                        <rect x="10" :y="10 + i * 20" width="40" height="20" :fill="line.color" />
                        <a :href="line.url"><text x="12" :y="30 + i * 20 - 5" font-size="13"
                                :fill="isColorLight(line.color)">{{
                                    `${(line.id || '').slice(3)}01` }}</text></a>
                    </template>

                    <rect x="52" y="8" :width="dynamicRectWidth" :height="(lines.length * 20) + 4"
                        :fill="dark ? '#222' : '#f5f5f5'" stroke="#ccc" />

                    <template v-for="(line, i) in lines" :key="`legend-name-${line.id}`">
                        <a :href="line.url"><text x="54" :y="30 + i * 20 - 5" font-size="13"
                                :fill="dark ? '#fff' : '#000'">{{ line.name
                                }}</text></a>
                    </template>
                </g>

                <!-- 路線の描画 -->
                <template v-for="(connection, i) in lineConnections"
                    :key="`conn-${i}-${connection.from.id}-${connection.to.id}`">
                    <line :x1="connection.from.x" :y1="connection.from.y" :x2="connection.to.x" :y2="connection.to.y"
                        :stroke="connection.line.color || '#000'" :stroke-width="connection.line.width || 4"
                        :stroke-dasharray="connection.line.type === 'dot' ? '4, 4' : undefined" />
                </template>

                <!-- 駅の描画 -->
                <template v-for="station in stations" :key="station.id">
                    <g v-if="!station.not_station">
                        <a :href="station.url">
                            <circle :cx="station.x" :cy="station.y" r="8" fill="white" stroke="#333" stroke-width="2" />
                            <text :x="station.x" :y="station.y - 15" text-anchor="middle" class="station-label"
                                :fill="dark ? '#fff' : '#000'"
                                :transform="`rotate(-60 ${station.x}, ${station.y - 15})`">{{
                                    getStationDisplayText(station, lines) }}</text>
                        </a>
                    </g>
                    <g v-else>
                        <circle :cx="station.x" :cy="station.y" r="8" fill="white" stroke="#333" stroke-width="2"
                            class="virtual-station" />
                        <text :x="station.x" :y="station.y" text-anchor="middle" class="station-label virtual-station"
                            :fill="dark ? '#fff' : '#000'">{{ getStationDisplayText(station, lines) }}</text>
                    </g>
                </template>
            </svg>
        </div>
    </main>

</template>

<style scoped>
.viewer {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: #808080;
    overflow: auto;
    max-height: 60vh;
    padding: 8px;
}

.viewer.fullscreen {
    position: fixed;
    inset: 0;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    max-height: none;
    overflow: auto;
}

.svg-container {
    display: inline-block;
    min-width: max-content;
    min-height: max-content;
}

svg {
    display: block;
}

.svg-container svg {
    background-color: white;
    max-width: none !important;
}

.station-label {
    font-size: 11px;
    pointer-events: none;
}

.virtual-station {
    opacity: 0.2;
}

.fullscreen-toggle {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
    padding: 6px 10px;
    font-size: 12px;
}
</style>