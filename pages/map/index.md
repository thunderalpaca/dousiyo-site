---
layout: home
title: "路線図"
description: "路線図"
---

<script setup>
import { withBase } from 'vitepress'
</script>

<BigImage :src="withBase('/map/map2025-08-25.dzi')" width="100%" height="75vh"/>
<small>2025年8月25日現在</small>

<a :href="withBase('/map/map2025-08-25.png')" download="map2025-08-25.png">ダウンロード</a>  
[自動生成マップ(試験運用)](/map/auto)
