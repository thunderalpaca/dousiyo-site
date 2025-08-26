<template>
  <span v-if="codes.length">
    <template v-for="(code, i) in codes" :key="code">
      <code>{{ code }}</code><span v-if="i < codes.length - 1">, </span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { getStationByIdLazy, type Station } from '../lib/dataLoaders'

const route = useRoute()
const stationId = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  const last = parts[parts.length - 1] || ''
  return last.replace(/\.html$/, '')
})

const station = ref<Station | undefined>(undefined)
const fetchStation = async (id: string) => {
  station.value = await getStationByIdLazy(id)
}
fetchStation(stationId.value)
watch(() => stationId.value, (id) => { fetchStation(id) })

const codes = computed<string[]>(() => {
  const s = station.value
  if (!s || !Array.isArray(s.lines)) return []
  return s.lines.map((sid) => `${String(sid.line).slice(3)}${sid.id}`)
})
</script>