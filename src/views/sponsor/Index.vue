<script setup lang="ts">
import vkstyleImg from "@/assets/img/sponsor/vkstyle.png"
import tncImg from "@/assets/img/sponsor/tnc.png"
import battleImg from "@/assets/img/sponsor/battle.png"

import { ref, onMounted } from "vue"
import type { Router } from "vue-router"
import { useRouter } from "vue-router"

const router: Router = useRouter()

const blockArr = [
    { key: "vkstyle", img: vkstyleImg, path: "/vkstyle" },
    { key: "tnc", img: tncImg, path: "/tnc" },
    { key: "battle", img: battleImg, path: "/battle" }
] as const

// 以下是为了修复ios上面的chrome浏览器滚动异常加的，看似没有必要。
// 如果chrome以后修复了在ios上的fixed定位问题，可以不需要下面的逻辑
const showPage = ref(false)

const init = (): void => {
    showPage.value = false
    const timer = setTimeout(() => {
        clearTimeout(timer)
        showPage.value = true
    }, 200)
}

onMounted(() => {
    init()
})
</script>

<template>
    <div class="sponsor-page bg-pageColor">
        <HeaderBar>
            <div class="header_title">赞助专题</div>
        </HeaderBar>
        <!-- 主内容 -->
        <section class="sponsor-list" v-if="showPage">
            <div
                class="spon-block"
                @click="router.push(`${item.path}`)"
                :style="{ backgroundImage: `url(${item.img})` }"
                v-for="(item, i) in blockArr"
                :key="i"
            ></div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.sponsor-list {
    width: 100%;
    padding: 0px 14px 10px;
    .spon-block {
        margin: auto;
        margin-top: 8px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        width: 100%;
        height: 174px;
        border-radius: 10px;
        box-shadow: 0px 4px 16px 0 rgba(0, 0, 0, 0.1);
    }
}
</style>
