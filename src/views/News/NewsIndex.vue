<script setup lang="ts">
import NewsPage from "./NewsPage.vue"
import type { NewsPageType } from "./NewsPage.vue"
import LivePage from "./LivePage.vue"
import type { LivePageType } from "./LivePage.vue"
import ScheduPage from "./ScheduPage.vue"
import type { ScheduPageType } from "./ScheduPage.vue"
import { useFreshStore } from "@/stores/fresh"
import { ref, watch, nextTick } from "vue"
import { animateCSS } from "@/composable/util"
import { pxToRem } from "@/utils/commonUtils"
import { useRoute } from "vue-router"
import type { RouteLocationNormalizedLoaded } from "vue-router"

const freshStore = useFreshStore()
freshStore.resetList()

const route: RouteLocationNormalizedLoaded = useRoute()

const newsRef = ref<NewsPageType>(null)
const liveRef = ref<LivePageType>(null)
const scheduPageRef = ref<ScheduPageType>(null)

const HEAD_TAB = [
    { id: "news", label: "资讯" },
    { id: "live", label: "直播" },
    { id: "schedule", label: "赛程" }
] as const

type ActiveTab = typeof HEAD_TAB[number]["id"]

const activeTab = ref<ActiveTab>("news")

const showLive = ref(false)

const moveStyle = ref({})

watch(activeTab, async (val: ActiveTab) => {
    window.scrollTo(0, 0)
    const index: number | undefined = HEAD_TAB.findIndex((item) => item.id === val)

    if (index !== -1 && index !== undefined) {
        await nextTick()
        // 调用vant-tab组件的 resize 方法来主动触发重绘：
        liveRef.value && liveRef.value.tabs && liveRef.value.tabs.resize()
        scheduPageRef.value && scheduPageRef.value.tabs && scheduPageRef.value.tabs.resize()
        const distance: number = index * 68
        moveStyle.value = {
            "background-position-x": `${pxToRem(distance)}rem`
        }
    }
})

// 切换资讯tab的小动画
watch(
    () => newsRef.value?.activeType,
    (val: NewsPageType["activeType"], oldVal?: NewsPageType["activeType"] | undefined) => {
        if (typeof oldVal == "number" && typeof val == "number") {
            animateCSS(`.news-tab-item-${val}`, "animate-bounce-in")
        }
    }
)

// 切换直播tab的小动画
watch(
    () => liveRef.value?.activeKey,
    (val?: LivePageType["activeKey"], oldVal?: LivePageType["activeKey"] | undefined) => {
        if (typeof oldVal == "string" && typeof val == "string") {
            animateCSS(`.live-tab-item-${val}`, "animate-bounce-in")
        }
    }
)

// 切换赛程tab的小动画
watch(
    () => scheduPageRef.value?.activeKey,
    (val?: ScheduPageType["activeKey"], oldVal?: ScheduPageType["activeKey"] | undefined) => {
        if (typeof oldVal == "string" && typeof val == "string") {
            animateCSS(`.schepage-tab-item-${val}`, "animate-bounce-in")
        }
    }
)

if (route.query.tab) {
    activeTab.value = route.query.tab as ActiveTab
}
</script>

<template>
    <div class="vk-news">
        <!-- 头部 -->
        <HeaderBar>
            <div shadow="[0_0_12px_0_rgba(0,0,0,0.2)]" class="relative top-1px hstack py-3px px-3.5px rounded-16.5px">
                <div class="vknews-head-bg absolute w-full h-27px" :style="moveStyle"></div>
                <div
                    @click="activeTab = item.id"
                    :class="{
                        'text-white! pl-1px font-semibold': activeTab === item.id
                    }"
                    class="w-48px h-27px text-center leading-27px text-15px text-secondText mr-20px relative select-none last:mr-0"
                    v-for="(item, i) in HEAD_TAB"
                    :key="i"
                >
                    <span class="relative">{{ item.label }}</span>
                    <i class="live-icon absolute top-0 right--8.5px w-16px h-10px" v-show="item.id === 'live'"></i>
                </div>
            </div>
        </HeaderBar>
        <!-- 资讯 -->
        <news-Page ref="newsRef" v-if="activeTab === 'news'" />
        <!-- 直播 -->
        <live-page ref="liveRef" @showlive="showLive = true" v-show="activeTab === 'live'" />
        <!-- 赛程 -->
        <schedu-page ref="scheduPageRef" v-show="activeTab === 'schedule'" />
    </div>
</template>

<style lang="scss" scoped>
.news-content-wrapper {
    min-height: calc(100vh - 44px);
    min-height: calc(var(--vh) * 100 - 44px);
}
.vknews-head-bg {
    background-image: url("@/assets/img/template/july/news/selected.png");
    background-repeat: no-repeat;
    background-position: 0 center;
    background-size: contain;
    z-index: -1;
    transition: all 0.3s;
}
.live-icon {
    background: url("@/assets/img/template/july/home/bottom/live_gif.gif") no-repeat center;
    background-size: 100% 100%;
}
:deep(.van-tabs__line) {
    background-image: linear-gradient(to right, #07e9f1, #07f1b7);
    width: 34px;
    height: 3px;
}
:deep(.van-tab__text) {
    overflow: visible;
}

// :deep(.van-tabs__content) {
//   padding: 0 15px;
// }

:deep(.van-swipe__indicators) {
    bottom: 9px;

    .van-swipe__indicator {
        transition: width 0.4s;
        background: #fbfbfb;

        &.van-swipe__indicator--active {
            width: 15px;
            border-radius: 4px;
            background: #fff;
        }
    }
}
:deep(.list) {
    position: relative;
    width: 345px;
    margin: auto;
    margin-bottom: 80px;
    min-height: calc(100vh - 168px);
    min-height: calc(var(--vh) * 100 - 168px);
}
:deep(.live-tab-icon) {
    width: 24px;
    height: 24px;
    margin-right: -2.5px;

    &.live-tab-icon-hot {
        margin-right: -4.5px;
    }
}
</style>
