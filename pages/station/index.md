---
layout: home
description: "駅一覧"

hero:
  name: "駅一覧"
---

<script setup lang="ts">
import { data as stationData } from '../.vitepress/station.data'
import { withBase } from 'vitepress'

function safeUrl(url: string) {
  const normalized = url.startsWith('/') ? url : '/' + url
  return withBase(normalized)
}
</script>

<ul>
  <li v-for="station in stationData" :key="station.url">
    <a :href="safeUrl(station.url)">{{ station.frontmatter.title }}</a>
    <p>{{ station.frontmatter.description }}</p>
  </li>
</ul>