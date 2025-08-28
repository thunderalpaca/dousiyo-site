---
layout: home
description: "鉄道"

hero:
  name: "鉄道"
  actions:
  - theme: brand
    text: 鉄道会社一覧
    link: /company
  - theme: alt
    text: 鉄道駅一覧
    link: /station
  - theme: alt
    text: 車両図鑑
    link: car
---

<script setup lang="ts">
import type { Line, Station } from '.vitepress/theme/lib/dataLoaders'
import { loadLines, loadStationsRaw, buildStationsData } from '.vitepress/theme/lib/dataLoaders'
import { ref, onMounted } from 'vue'

const Lines = ref<Line[]>([])
const StationsData = ref<Station[]>([])

onMounted(async () => {
  Lines.value = await loadLines()
  const stationRaw = await loadStationsRaw()
  StationsData.value = buildStationsData(Lines.value, stationRaw)
})
</script>

# ステータス

<p>
現在
<span style="font-weight: bold;">
{{Lines.length}}路線
{{StationsData.length}}駅
</span>
</p>