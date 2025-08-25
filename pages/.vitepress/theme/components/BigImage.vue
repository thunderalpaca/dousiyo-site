<template>
  <div :id="id" class="big-image" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps<{
  id?: string
  src: string
  width?: string
  height?: string
}>()

const id = props.id || `big-image-${Math.floor(Math.random() * 10000)}`
const width = props.width || '100%'
const height = props.height || '500px'

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/openseadragon@5.0/build/openseadragon/openseadragon.min.js'
  script.onload = () => {
    // @ts-ignore
    OpenSeadragon({
      id,
      prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@5.0/build/openseadragon/images/',
      tileSources: withBase(props.src)
    })
  }
  document.head.appendChild(script)
})
</script>