<template>
	<ul v-if="stationsForLine.length">
		<li v-for="st in stationsForLine" :key="st.id">
			<a :href="st.link">{{ st.name }}</a>
		</li>
	</ul>
	<p v-else>情報がありませんでした。</p>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useData } from 'vitepress'
import { getLineByIdLazy, loadStations, type Line, type Station } from '../lib/dataLoaders'

const route = useRoute()
const { page } = useData()

const companyKey = computed(() => {
	const parts = route.path.split('/').filter(Boolean)
	const idx = parts.indexOf('line')
	return idx > 0 ? parts[idx - 1] : ''
})

const letter = computed(() => String((page.value as any)?.frontmatter?.letter ?? '').trim())
const lineId = computed(() => (companyKey.value.slice(0, 3) || '') + (letter.value || ''))

const line = ref<Line | undefined>(undefined)
const fetchLine = async (id: string) => {
	line.value = id ? await getLineByIdLazy(id) : undefined
}
watch(() => lineId.value, (id) => { fetchLine(id) }, { immediate: true })

const allStations = ref<Station[]>([])
loadStations().then(sts => { allStations.value = sts })

const stationsForLine = computed<Station[]>(() => {
	const id = lineId.value
	if (!id) return []
	return allStations.value.filter(st => Array.isArray(st.lines) && st.lines.some(sid => sid.line === id))
})
</script>
