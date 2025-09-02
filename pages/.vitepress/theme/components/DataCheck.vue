<template>
    <div class="lines-map">
        <div class="line" v-for="line in Lines" :key="line.id" :style="{ backgroundColor: line.color }">
            <a :href="line.link" style="color: black; font-weight: normal;">
                <span class="line-name">{{ line.name }}</span></a>
            <span class="line-id" style="margin-left: 1em;">{{ line.id }}</span>
            <span class="line-letter" style="margin-left: 1em;">{{ line.letter }}</span>
        </div>
    </div>

    <div class="stations">
        <div class="station" v-for="st in StationsData" :key="st.link || st.name">
            <a class="station-name" :href="st.link">{{ st.name }}</a>
            <span class="station-line" v-for="sl in st.lines" :key="sl.line + '-' + sl.id"
                :style="{ backgroundColor: lineById[sl.line]?.color || '#ddd' }">
                {{ lineById[sl.line]?.letter }}{{ sl.id }}
            </span>
            <div class="station-prev-next" v-for="sl in st.lines" :key="sl.line + '-' + sl.id + '-pn'">
                <small>
                    prev:
                    <template v-if="Array.isArray(sl.prev)">
                        <template v-for="(pid, idx) in sl.prev" :key="pid">
                            <template v-if="stationById[pid]"><a :href="stationById[pid].link">{{ stationById[pid].name }}</a></template>
                            <template v-else>{{ pid }}</template>
                            <template v-if="idx < sl.prev.length - 1">, </template>
                        </template>
                    </template>
                    <template v-else-if="sl.prev && stationById[sl.prev]">
                        <a :href="stationById[sl.prev].link">{{ stationById[sl.prev].name }}</a>
                    </template>
                    <template v-else>{{ sl.prev ?? '-' }}</template>
                    ,
                    next:
                    <template v-if="Array.isArray(sl.next)">
                        <template v-for="(nid, idx) in sl.next" :key="nid">
                            <template v-if="stationById[nid]"><a :href="stationById[nid].link">{{ stationById[nid].name }}</a></template>
                            <template v-else>{{ nid }}</template>
                            <template v-if="idx < sl.next.length - 1">, </template>
                        </template>
                    </template>
                    <template v-else-if="sl.next && stationById[sl.next]">
                        <a :href="stationById[sl.next].link">{{ stationById[sl.next].name }}</a>
                    </template>
                    <template v-else>{{ sl.next ?? '-' }}</template>
                </small>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Line, Station } from '../lib/dataLoaders'
import { loadLines, loadStationsRaw, buildStationsData } from '../lib/dataLoaders'

const Lines = ref<Line[]>([])
const StationsData = ref<Station[]>([])

const lineById = computed<Record<string, Line>>(() => {
    const map: Record<string, Line> = {}
    for (const l of Lines.value) map[l.id] = l
    return map
})

const stationById = computed<Record<string, Station>>(() => {
    const map: Record<string, Station> = {}
    for (const s of StationsData.value) map[s.id] = s
    return map
})

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