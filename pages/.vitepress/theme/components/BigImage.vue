<template>
    <div ref="container" :id="id" class="big-image" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const container = ref<HTMLDivElement | null>(null)

function initializeViewer() {
    if (container.value) {
        container.value.innerHTML = ""
        // @ts-ignore
        OpenSeadragon({
            element: container.value,
            prefixUrl:
                'https://cdn.jsdelivr.net/npm/openseadragon@5.0/build/openseadragon/images/',
            tileSources: withBase(props.src)
        })
    } else {
        console.error('container要素が見つかりません')
    }
}

function loadOpenSeadragonScript() {
    const script = document.createElement('script')
    script.src =
        'https://cdn.jsdelivr.net/npm/openseadragon@5.0/build/openseadragon/openseadragon.min.js'
    script.onload = initializeViewer
    document.head.appendChild(script)
}

onMounted(() => {
    if ((window as any).OpenSeadragon) {
        initializeViewer()
    } else {
        loadOpenSeadragonScript()
    }
})
</script>