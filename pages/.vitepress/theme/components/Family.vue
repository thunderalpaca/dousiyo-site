<template>
    <div v-if="familyStations.length > 0">
        <h2>他にも{{ parentStationNameStr }}駅があります</h2>
        <ul>
            <li v-for="station in familyStations" :key="station.id">
                <a :href="station.link">{{ station.name }}</a>
            </li>
        </ul>
    </div>
    <div v-if="parentId">
        親駅: <a :href="parentData?.link">{{ parentData?.name }}</a>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import {
    loadStations,
    getStationByIdLazy,
    type Station
} from '../lib/dataLoaders'

const familyStations = ref<Station[]>([])
const parentStationNameStr = ref<string>('')

const route = useRoute()
const stationId = computed(() => {
    const parts = route.path.split('/').filter(Boolean)
    const last = parts[parts.length - 1] || ''
    return last.replace(/\.html$/, '')
})

const parentId = ref<Station['id'] | null>(null)
const parentData = ref<Station | undefined | null>(undefined)

watch(stationId, async (id) => {
    const st = await getStationByIdLazy(id)
    parentStationNameStr.value = st?.name ?? ''
    parentId.value = st?.parent ?? null
}, { immediate: true })

watch(parentId, async (id) => {
    if (id) {
        parentData.value = await getStationByIdLazy(id)
    } else {
        parentData.value = null
    }
}, { immediate: true })

const allStations = ref<Station[]>([])
loadStations().then(ss => {
    allStations.value = ss
    familyStations.value = allStations.value.filter(
        station => station.parent === stationId.value
    )
})
</script>