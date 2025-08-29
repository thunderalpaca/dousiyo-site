---
layout: doc
description: "駅一覧"
---

<script setup lang="ts">
import { data as stationData } from '../.vitepress/station.data'
import { withBase } from 'vitepress'
import { computed } from 'vue'

function safeUrl(url: string) {
  const normalized = url.startsWith('/') ? url : '/' + url
  return withBase(normalized)
}

function urlSlug(url: string) {
  const path = url.split('?')[0].split('#')[0]
  const last = path.replace(/\/$/, '').split('/').pop() || ''
  return last.replace(/\.html$/, '')
}

const groups = computed(() => {
  const out: Array<{ key: string; items: any[] }> = []
  let currentKey = ''
  let bucket: { key: string; items: any[] } | null = null
  for (const s of stationData as any[]) {
    const k = (s as any).groupKey || 'その他'
    if (!bucket || k !== currentKey) {
      currentKey = k
      bucket = { key: k, items: [] }
      out.push(bucket)
    }
    bucket.items.push(s)
  }
  return out
})
</script>

# 駅一覧
<section v-for="g in groups" :key="g.key">
  <h2> {{ g.key }} </h2>
  <ul>
    <li v-for="station in g.items" :key="station.url">
      <a :href="safeUrl(station.url)">{{ station.frontmatter.title }}</a>
      <a style="margin-left: 8px;" :href="safeUrl(`/map/auto?station=${urlSlug(station.url)}`)">マップで表示</a>
      <span v-if="station.frontmatter.description"><br>{{ station.frontmatter.description }}</span>
    </li>
  </ul>
</section>
