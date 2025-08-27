---
layout: home
description: "観光"
hero:
  name: "観光"
  actions:
    - theme: brand
      text: 初見さん向けガイドはこちら
      link: /tour/guide
    - theme: alt
      text: 歴史
      link: /history
---

# 名所一覧
<script setup lang="ts">
import { data as landmarkData } from '../.vitepress/landmark.data'
import { withBase } from 'vitepress'

function safeUrl(url: string) {
  const normalized = url.startsWith('/') ? url : '/' + url
  return withBase(normalized)
}
</script>

<ul>
  <li v-for="landmark in landmarkData" :key="landmark.url">
    <a :href="safeUrl(landmark.url)">{{ landmark.frontmatter.title }}</a>
    <p>{{ landmark.frontmatter.description }}</p>
  </li>
</ul>