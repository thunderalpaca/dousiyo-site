---
layout: home
title: "自動生成マップ"
description: "自動生成マップ"
---

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { getStationByIdLazy } from '../.vitepress/theme/lib/dataLoaders.ts'
import { onMounted, ref } from 'vue'

const route = useRoute()

const station = computed(() => {
  void route.path
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('station')
})

const text = ref('')

onMounted(async () => {
    if (!station.value) return
    console.log(station.value)
    const data = await getStationByIdLazy(station.value)
    console.log(data)
    text.value = data.name
})
</script>

<p style="margin: 0;">{{ text }}</p>

<LinesMap :station="station" />