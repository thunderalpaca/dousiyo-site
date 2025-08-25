---
layout: home
description: "駅一覧"

hero:
  name: "駅一覧"
---


<script setup lang="ts">
import { data as stationData } from '../.vitepress/station.data'
</script>

<ul>
    <li v-for="station in stationData" :key="station.url">
        <a :href="station.url">{{ station.frontmatter.title }}</a>
        <p>{{ station.frontmatter.description }}</p>
    </li>
</ul>