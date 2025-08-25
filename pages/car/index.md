---
layout: home
description: "車両図鑑"
hero:
  name: "車両図鑑"
---

<script setup lang="ts">
import { data as carData } from '../.vitepress/car.data'
import { withBase } from 'vitepress'

function safeUrl(url: string) {
  const normalized = url.startsWith('/') ? url : '/' + url
  return withBase(normalized)
}
</script>

<div
  v-for="group in carData"
  :key="group.parent?.url || (group.children[0] && group.children[0].url)"
>
  <h1 v-if="group.parent?.frontmatter?.title">
    {{ group.parent.frontmatter.title }}
  </h1>

  <ul>
    <li v-for="car in group.children" :key="car.url">
      <a :href="safeUrl(car.url)">{{ car.frontmatter.title }}</a>
      <p>{{ car.frontmatter.description }}</p>
    </li>
  </ul>
</div>