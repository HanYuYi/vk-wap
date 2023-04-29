<script setup lang="ts">
import { Parser, Player } from "svga"
import { onMounted, onUnmounted, ref } from "vue"
import type { Video } from "svga/dist/types"

/**
 * Props
 */
interface Props {
    // 动画播放次数，默认为0：无限循环
    loop?: number

    url: string
}

const props = withDefaults(defineProps<Props>(), {
    loop: 0,

    url: ""
})

/**
 * Emits
 */
interface Emits {
    (e: "finish"): void
    (e: "svgaError"): void
}

const emit = defineEmits<Emits>()

const playerRef = ref<Player>(null)

onMounted(async () => {
    try {
        const parser: Parser = new Parser()
        const svga: Video = await parser.load(props.url)

        const player: Player = new Player({
            container: document.getElementById("svgaCanvas") as HTMLCanvasElement,
            loop: props.loop
        })

        playerRef.value = player

        await player.mount(svga)

        player.onEnd = () => {
            emit("finish")
        }
        // 开始播放动画
        player.start()
    } catch (e: unknown) {
        console.info(e)
        emit("svgaError")
    }
})

onUnmounted(() => {
    playerRef.value?.stop()
})
</script>

<template>
    <canvas id="svgaCanvas"></canvas>
</template>
