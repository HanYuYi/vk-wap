<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue"

/**
 * Props
 */
interface Props {
    // 特效图片对象list
    baseBubbles: string[]

    // 特效相对数量
    relativeNum?: number

    // 特效飘落方向，目前只兼容上下两种，更多的自行扩展
    direction?: "to-top" | "to-bottom"

    // 特效飘落速度
    speed?: number
}

const props = withDefaults(defineProps<Props>(), {
    baseBubbles: () => [],

    relativeNum: 5,

    direction: "to-top",

    speed: 0.2
})

const canvasRef = ref<HTMLCanvasElement>(null)

const ctx = ref<CanvasRenderingContext2D>(null)

const time = ref(0)

// 被渲染的图片类型
type Bubbles = {
    imgU: Promise<HTMLImageElement>
    imgO?: HTMLImageElement
    x: number
    y: number
    vx: number
    vy: number
}

const bubbles = ref<Bubbles[]>([])

// 执行帧渲染
const loopFire = (): void => {
    time.value++
    canvasRef.value.width = innerWidth
    canvasRef.value.height = innerHeight
    bubbles.value.forEach((b: Bubbles) => {
        b.x += b.vx
        b.y += b.vy
        limit(b)
        ctx.value.beginPath()
        ctx.value.drawImage(b.imgO, b.x, b.y, b.imgO.width / 1.41, b.imgO.height / 1.41)
    })
    requestAnimationFrame(loopFire)
}
// 溢出限制
const limit = (d: Bubbles): void => {
    if (d.x < -d.imgO.width) d.x = innerWidth + d.imgO.width
    if (d.x > innerWidth + d.imgO.width) d.x = -d.imgO.width
    if (d.y < -d.imgO.height) d.y = innerHeight + d.imgO.height
    if (d.y > innerHeight + d.imgO.height) d.y = -d.imgO.height
}

// 装载图片
const loadAllImg = (): void => {
    const tempImg: Promise<HTMLImageElement>[] = [...bubbles.value].map((item) => item?.imgU)

    Promise.all(tempImg).then((res: HTMLImageElement[]) => {
        for (let i = 0; i < res.length; i++) {
            bubbles.value[i].imgO = res[i]
        }
        loopFire()
    })
}

// 图片预加载
const loadImgFn = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const imgO: HTMLImageElement = new Image()
        imgO.src = url
        imgO.onload = () => {
            resolve(imgO)
        }
        imgO.onerror = () => {
            reject(false)
        }
    })
}

// 初始化 fire 数据
const initData = (): void => {
    const baseBubbles: Promise<HTMLImageElement>[] = props.baseBubbles.map((imgObj: string) => loadImgFn(imgObj))

    let concatBaseBubbles: Promise<HTMLImageElement>[] = []

    for (let i = 0; i < props.relativeNum; i++) {
        concatBaseBubbles = concatBaseBubbles.concat(baseBubbles)
    }

    const tempBubbles: Bubbles[] = []

    for (let i = 0; i < concatBaseBubbles.length; i++) {
        const dirObj: Record<Props["direction"], number> = {
            "to-top": Number.parseFloat(`-${props.speed}`) - Math.random(),
            "to-bottom": props.speed + Math.random()
        }

        tempBubbles[i] = {
            imgU: concatBaseBubbles[i],
            x: Math.random() * innerWidth,
            y: Math.random() * innerHeight,
            vx: 0.5 - Math.random(),
            vy: dirObj[props.direction]
        }
    }
    bubbles.value = tempBubbles

    loadAllImg()
}

onMounted(() => {
    nextTick(() => {
        canvasRef.value.width = window.innerWidth
        canvasRef.value.height = window.innerHeight - 2
        ctx.value = canvasRef.value.getContext("2d")
        initData()
    })
})
</script>

<template>
    <canvas ref="canvasRef"></canvas>
</template>

<style lang="scss" scoped>
canvas {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
