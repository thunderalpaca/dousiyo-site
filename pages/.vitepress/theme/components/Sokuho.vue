<template>
    <div v-for="item in emergencyNews" :key="item.url" class="emergency-news">
      <a :href="item.url" style="font-weight: 600;">
        <span class="mr-2">[速報]</span>{{ item.frontmatter.title }}
      </a>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

type NewsItem = {
  url: string
  frontmatter: { title?: string; emergency?: boolean; date?: string }
}

const emergencyNews = ref<NewsItem[]>([])
let alive = true

onUnmounted(() => {
  alive = false
})

onMounted(async () => {
  try {
    const mod: any = await import('../../news.data')
    if (!alive) return
    const items: NewsItem[] = Array.isArray(mod?.data)
      ? (mod.data as NewsItem[])
      : (await mod?.default?.load?.()) ?? []
    if (!alive) return
    const now = Date.now()
    const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000
    emergencyNews.value = (items || []).filter((item) => {
      if (!item.frontmatter?.emergency) return false
      const d = item.frontmatter?.date
      if (!d) return false
      const t = new Date(d).getTime()
      if (!isFinite(t)) return false
      const diff = now - t
      return diff >= 0 && diff <= TWO_DAYS_MS
    })
  } catch (e) {
  }
})

</script>

<style>
.emergency-news {
  padding: 1rem;
  background-color: #ff000033;
}
</style>