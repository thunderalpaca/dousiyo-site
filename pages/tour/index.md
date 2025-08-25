---
layout: home
description: "観光地"
hero:
  name: "観光地"
  actions:
    - theme: brand
      text: 初見さん向けガイドはこちら
      link: /tour/guide
---

# 名所一覧
<script setup lang="ts">
import { data as landmarkData } from '../.vitepress/landmark.data'
</script>

<ul>
    <li v-for="landmark in landmarkData" :key="landmark.url">
        <a :href="landmark.url">{{ landmark.frontmatter.title }}</a>
        <p>{{ landmark.frontmatter.description }}</p>
    </li>
</ul>