---
layout: doc
title: "テストニュース"
description: "[速報]みーつー空港の設計をひさびさに始める"
date: 2025-08-27-12:00:00+09:00
emergency: false
---

<script setup lang="ts">
import { formatDate } from '../../.vitepress/theme/utils/date'
</script>

# {{ $frontmatter.title }}
{{ formatDate($frontmatter.date) }}

## {{ $frontmatter.description }}  
