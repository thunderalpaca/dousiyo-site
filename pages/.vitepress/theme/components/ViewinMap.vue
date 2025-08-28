<template>
    <a :href="`/map/auto?station=${stationId}`" style="margin-left: 10px; font-size: small;">マップで表示</a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const stationId = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  const last = parts[parts.length - 1] || ''
  return last.replace(/\.html$/, '')
})
</script>