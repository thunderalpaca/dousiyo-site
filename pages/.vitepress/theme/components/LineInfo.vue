<template>
  <ul v-if="stationLines.length">
    <li v-for="line in stationLines" :key="line.id">
      <a :href="line.link">
        <span
          :style="{
            backgroundColor: line.color,
            display: 'inline-block',
            width: '0.75em',
            height: '0.75em',
            border: `1px solid #1b1b1f`
          }"
        />
        {{ line.name }}
        ({{ line.letter }})
      </a>
    </li>
  </ul>
  <p v-else>情報がありませんでした。</p>
</template>


<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import {
  loadLines,
  getStationByIdLazy,
  getLineById,
  type Line,
  type Station
} from '../lib/dataLoaders'

const route = useRoute()
const stationId = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  const last = parts[parts.length - 1] || ''
  return last.replace(/\.html$/, '')
})

const allLines = ref<Line[]>([])
loadLines().then(ls => { allLines.value = ls })

const station = ref<Station | undefined>(undefined)
const fetchStation = async (id: string) => {
  station.value = await getStationByIdLazy(id)
}
fetchStation(stationId.value)
watch(() => stationId.value, (id) => { fetchStation(id) })

const stationLines = computed<Line[]>(() => {
  if (!station.value) return []
  return station.value.lines
  .map((sid) => getLineById(allLines.value, sid.line))
    .filter((l): l is Line => Boolean(l))
})
</script>