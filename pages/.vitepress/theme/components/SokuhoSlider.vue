<template>
  <div v-if="emergencyNews.length" class="marqueebox">
    <Vue3Marquee v-if="emergencyNews.length" :pauseOnHover="true" :clone="true" :duration="1">
      <div v-for="item in emergencyNews" :key="item.url">
        <a :href="item.url" style="font-weight: 600;">
          <span class="mr-2">[速報]</span>{{ item.frontmatter.title }}
        </a>
        <span class="gap"></span>
      </div>
    </Vue3Marquee>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Vue3Marquee } from 'vue3-marquee'

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
@import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');
.marqueebox {
  position: fixed;
  width: 100vw;
  left: 0;
  height: 2.5rem;
  padding-top: 0.5rem;
  font-family: "DotGothic16", sans-serif;
}
.marqueebox a {
  color: var(--vp-c-red-1);
}
.gap {
  padding-left: 5px;
  padding-right: 5px;
}
</style>