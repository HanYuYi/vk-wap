<script setup lang="ts">
import { useSysStore } from "@/stores/system"
import { useFreshStore } from "@/stores/fresh"
import { useLoginStore } from "@/stores/loginRegister"
import { useRoute, useRouter } from "vue-router"
import type { RouteLocationNormalizedLoaded, Router } from "vue-router"
import { computed } from "vue"

const systemParams = useSysStore()
const freshStore = useFreshStore()
const loginStore = useLoginStore()

const route: RouteLocationNormalizedLoaded = useRoute()
const router: Router = useRouter()

const isShowLeftTitle = computed<boolean>(() => {
    return Boolean(route.meta.leftTitle)
})

const isShowWhiteIcon = computed<boolean>(() => {
    return Boolean(route.meta.headWhiteIcon)
})

const isShowLogIcon = computed<boolean>(() => {
    return Boolean(route.meta.headLogIcon)
})
const isShowSearchIcon = computed<boolean>(() => {
    return Boolean(route.meta.headSearchIcon)
})

const isShowHeadPlace = computed<boolean>(() => route.name != "home" && route.name != "liveVideo")

const isShowMessIcon = computed<boolean>(() => route.name == "home")

const showKfIcon = computed<boolean>(() => {
    return Boolean(route.meta.needHeaderKFBtn)
})

// 一级菜单，显示侧边栏icon
const isShowDrawIcon = computed<boolean>(() => {
    return Boolean(route.meta.showDrawIcon)
})

const isBgWhiteTransparent = computed<boolean>(() => {
    return Boolean(route.meta.isBgWhiteTransparent)
})

const isBlackBgTransparent = computed<boolean>(() => {
    return Boolean(route.meta.isBlackBgTransparent)
})

const headBgStyle = computed<{ background: string } | "">(() => {
    // 首页显示透明背景
    if (isBlackBgTransparent.value) {
        return {
            background: `rgba(0,0,0,${systemParams.headBgColorOpacity})`
        }
    }
    if (isBgWhiteTransparent.value) {
        return {
            background: `rgba(255,255,255,${systemParams.headBgColorOpacity})`
        }
    }
    // 首页header不需要滚动渐变
    if (route.name == "home") {
        return {
            background: "transparent"
        }
    }
    return ""
})

/**
 * 回退
 */
const back = (): void => {
    const backMap = new Map<boolean, () => void>()

    // 注册页后退弹窗提示
    backMap.set(route.name === "register", () => {
        systemParams.appRootBlur = true
        loginStore.showRegLeaveDialog = true
    })
    backMap.set(route.name === "login", () => {
        router.push("/")
    })
    backMap.set(route.name === "liveVideo", () => {
        router.push("/news?tab=live")
    })
    backMap.set(route.name === "rollroom" || route.name === "myroll", () => {
        freshStore.resetList()
        router.push("/roll")
    })

    for (const [key, value] of backMap) {
        if (key) {
            value()
            return
        }
    }

    if (!window.history.state) {
        router.push("/")
    }
    router.back()
}
</script>

<template>
    <header class="com-header">
        <div
            class="top-wrapper w-screen h-44px fixed top-0 inset-x-0 z-200 px-14px hstack justify-between bg-white"
            :style="headBgStyle"
            :class="{
                'top-50px absolute!': systemParams.isShowAppDownBar
            }"
        >
            <div class="header-left relative hstack">
                <slot name="left">
                    <div
                        v-if="isShowMessIcon"
                        @click="$router.push({ path: '/messages', query: { id: 1 } })"
                        class="top-icon messcenter-icon"
                    >
                        <div v-if="systemParams.isShowZNXBadge" class="badge"></div>
                    </div>
                    <div
                        v-else-if="isShowDrawIcon"
                        @click="systemParams.showDraw = !systemParams.showDraw"
                        class="top-icon draw-icon"
                    ></div>
                    <div
                        v-else
                        @click="back"
                        class="top-icon left-icon"
                        :class="{
                            'left-icon-white': isShowWhiteIcon,
                            'mr-0!': isShowLeftTitle
                        }"
                    ></div>
                    <div v-if="isShowLogIcon" class="icon-placeholder w-22px h-22px"></div>
                    <div @click="back" v-if="isShowLeftTitle">
                        {{ route.meta.leftTitle }}
                    </div>
                </slot>
            </div>
            <div class="header-center text-primary-text">
                <slot></slot>
            </div>
            <div class="header-right relative hstack">
                <slot name="right">
                    <div @click="$emit('search')" v-if="isShowSearchIcon" class="top-icon search_icon"></div>
                    <div @click="$emit('tolog')" v-if="isShowLogIcon" class="top-icon log_icon"></div>
                    <div
                        v-if="showKfIcon"
                        class="top-icon kf_icon"
                        :class="{ kf_icon_white: isShowWhiteIcon }"
                        @click.stop="systemParams.clickHeaderKF"
                    ></div>
                    <div class="hstack" v-if="!showKfIcon && !isShowLogIcon && !isShowSearchIcon">
                        <!-- 左边有副标题时，右边也占位一下，确保title始终居中 -->
                        <div style="visibility: hidden" v-if="isShowLeftTitle">
                            {{ route.meta.leftTitle }}
                        </div>
                        <div class="icon-placeholder w-22px h-22px"></div>
                    </div>
                </slot>
            </div>
        </div>
        <div class="header-placeholder w-full h-44px" v-if="isShowHeadPlace"></div>
        <van-popup
            class="draw-vant-class"
            overlay-class="draw-overlay-class"
            v-model:show="systemParams.showDraw"
            position="left"
            :style="{ height: '100%' }"
            teleport="body"
        >
            <DrawerMenu />
        </van-popup>
    </header>
</template>

<style lang="scss">
.com-header {
    .header_title {
        font-size: 18px;
        font-weight: bold;
    }
    .top-wrapper {
        transform: translate3d(0, 0, 0);
    }
}
.draw-overlay-class {
    background-color: rgba(0, 0, 0, 0.3);
}

.draw-vant-class {
    width: 230px;
    background-color: var(--vk-page-bgcolor);
}
</style>
