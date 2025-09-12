---
layout: doc
description: "車両図鑑"
editLink: false
---

<script setup lang="ts">
import { data as carData } from '../.vitepress/car.data'
import { withBase } from 'vitepress'

function safeUrl(url: string) {
  const normalized = url.startsWith('/') ? url : '/' + url
  return withBase(normalized)
}
</script>

# 車両図鑑

<div
  v-for="group in carData"
  :key="group.parent?.url || (group.children[0] && group.children[0].url)"
>
  <h2 v-if="group.parent?.frontmatter?.title">
    {{ group.parent.frontmatter.title }}
  </h2>

  <ul>
    <li v-for="car in group.children" :key="car.url">
      <a :href="safeUrl(car.url)">{{ car.frontmatter.title }}</a>
      <span v-if="car.frontmatter.description"><br>{{ car.frontmatter.description }}</span>
    </li>
  </ul>
</div>