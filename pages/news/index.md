---
layout: home
description: "ニュース"
hero:
  name: "ニュース"
  tagline: "運行情報、事件、アップデート情報など"
---

<script setup lang="ts">
import { data as newsData } from '../.vitepress/news.data'
import { withBase } from 'vitepress'
import { formatDate } from '../.vitepress/theme/utils/date'

function safeUrl(url: string) {
  const normalized = url.startsWith('/') ? url : '/' + url
  return withBase(normalized)
}

</script>

## 記事一覧

<ul>
  <li v-for="news in newsData" :key="news.url">
    <p><a :href="safeUrl(news.url)">{{ news.frontmatter.title }}</a>{{ formatDate(news.frontmatter.date) }}
    <br>{{ news.frontmatter.description }}</p>
  </li>
</ul>