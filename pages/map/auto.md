---
layout: home
title: "自動生成マップ"
description: "自動生成マップ"
---

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { getStationByIdLazy } from '../.vitepress/theme/lib/dataLoaders.ts'
import { onMounted, onUnmounted, ref } from 'vue'

const route = useRoute()

const station = computed(() => {
  void route.path
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('station')
})

const text = ref('')

const width = ref(0)
const height = ref(0)
const updateSize = () => {
  if (typeof window === 'undefined') return
  width.value = window.innerWidth
  height.value = window.innerHeight
}

onMounted(async () => {
    updateSize()
    window.addEventListener('resize', updateSize)
    if (!station.value) return
    console.log(station.value)
    const data = await getStationByIdLazy(station.value)
    console.log(data)
    text.value = data.name

    let viewHeight = height.value - 200
    let viewWidth = width.value - 200

    if (viewWidth < data.x) {
        text.value = text.value + " 右"
    } else {
        text.value = text.value + " 左"
    }

    if (viewHeight < data.y) {
        text.value = text.value + "下にあります"
    } else {
        text.value = text.value + "にあります"
    }

    if (viewWidth > data.x && viewHeight < data.y) {
        text.value = data.name + " 下にあります"
    }

    if (viewWidth > data.x && viewHeight > data.y) {
        text.value = data.name + " 画面内にあります"
    }
})

onUnmounted(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('resize', updateSize)
})
</script>


<p style="margin: 0;">{{ text }}</p>

<LinesMap :station="station" />