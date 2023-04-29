<script setup lang="ts">
import ApiSetting from "@/api/service"
import { ref, unref } from "vue"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { useSysStore } from "@/stores/system"
import { computed } from "vue"
import { useCountDown } from "@vant/use"
import type { CurrentTime } from "@vant/use"
import { pxToRem } from "@/utils/commonUtils"
import { formatCountDown } from "@/utils/date"
import { HttpPlus } from "@/api/HttpPlus"
import type { ActiveGetActivePopup } from "@/api/pojo/active/ActiveGetActivePopup"

const router: Router = useRouter()
const systemParams = useSysStore()

const event = (e: TouchEvent): void => {
    e.preventDefault()
}
// 禁止滑动调用
const unScroll = (): void => {
    document.addEventListener("touchmove", event, { passive: false })
}
// 启动滑动
const scroll = (): void => {
    document.removeEventListener("touchmove", event, false)
}

type CountDown = ReturnType<typeof useCountDown>

const countDown: CountDown = useCountDown({
    time: 1 * 1000,
    onFinish: (): void => {
        AnniversaryPopup()
    }
})

type ActiveGetActivePopupData = ActiveGetActivePopup["data"]

type ActiveGetActivePopupItem = ActiveGetActivePopupData[0]

type AnniverAside = Array<(ActiveGetActivePopupItem & { down: CountDown["current"] }) | ActiveGetActivePopupItem>

const anniverAside = ref<AnniverAside>([])
const bottomA = ref<number>(0.54)
const rightA = ref<number>(0.045)
const StartX = ref<number>(0) // 起始位置
const StartY = ref<number>(0)
const moveX = ref<number>(0)
const moveY = ref<number>(0)
const floatWindowRef = ref<HTMLDivElement>(null)

// 图片距离底部的距离
const FixedBottom = computed<number>(() => {
    const screenWidth = window.innerWidth || document.documentElement.clientWidth
    return (60 * screenWidth) / 375
})
// 有无下载栏顶部的距离
const MinTop = computed<number>(() => {
    const screenWidth = window.innerWidth || document.documentElement.clientWidth
    if (systemParams.isShowAppDownBar) {
        return (96 * screenWidth) / 375
    } else {
        return (46 * screenWidth) / 375
    }
})
const disAside = computed<AnniverAside>(() => {
    return anniverAside.value.filter((item: AnniverAside[0]) => item.is_show)
})

const startHandler = (e: TouchEvent): void => {
    // 悬浮窗跟随手指移动时，不允许页面滚动
    unScroll()
    const { clientX, clientY } = e.touches[0]
    StartX.value = clientX
    StartY.value = clientY
}

const movingHandler = (e: TouchEvent): void => {
    if (!e.touches) {
        return
    }

    const screenWidth: number = window.innerWidth || document.documentElement.clientWidth
    const screenHeight: number = window.innerHeight || document.documentElement.clientHeight
    const { bottom, right, width, left, top }: DOMRect = floatWindowRef.value.getBoundingClientRect()
    const { clientX, clientY }: Touch = e.touches[0]

    moveX.value = clientX - StartX.value
    moveY.value = clientY - StartY.value
    // 图片位于最右边，且还在往右边移动
    if (moveX.value > 0 && right >= screenWidth) {
        moveX.value = 0
        rightA.value = 0
    }
    // 图片位于最左边，且还在往左边移动
    if (moveX.value < 0 && left <= 0) {
        moveX.value = 0
        rightA.value = pxToRem(screenWidth - width) > 0 ? pxToRem(screenWidth - width) : 0
    }
    // 图片位于最下面，且还在往下面移动
    if (moveY.value > 0 && bottom >= screenHeight - FixedBottom.value) {
        moveY.value = 0
        bottomA.value = pxToRem(screenHeight - bottom) > 0 ? pxToRem(screenHeight - bottom) : 0
    }
    // 图片位于最上面，且还在往上移动
    if (moveY.value < 0 && top <= MinTop.value) {
        moveY.value = 0
        bottomA.value = pxToRem(screenHeight - bottom) > 0 ? pxToRem(screenHeight - bottom) : 0
    }
    floatWindowRef.value.setAttribute(
        "style",
        `transform:translate3d(${pxToRem(moveX.value)}rem,${pxToRem(moveY.value)}rem,0);
        right: ${rightA.value}rem;
        bottom:${bottomA.value}rem`
    )
}

const endHandler = (): void => {
    // 悬浮窗滑动结束，允许页面滚动
    scroll()
    const { bottom, width, left }: DOMRect = floatWindowRef.value.getBoundingClientRect()
    const screenWidth: number = window.innerWidth || document.documentElement.clientWidth
    const screenHeight: number = window.innerHeight || document.documentElement.clientHeight
    // 移动到屏幕的左边，停在左边，移动到屏幕的右边，停在右边
    const currentPX: number = left + width / 2
    if (currentPX >= screenWidth / 2) {
        bottomA.value = pxToRem(screenHeight - bottom) > 0 ? pxToRem(screenHeight - bottom) : 0
        rightA.value = 0.045
    } else {
        bottomA.value = pxToRem(screenHeight - bottom) > 0 ? pxToRem(screenHeight - bottom) : 0
        rightA.value = pxToRem(screenWidth - width) > 0 ? pxToRem(screenWidth - width) : 0
    }
    // 以下代码是停在最后的位置
    // bottomA.value = pxToRem(screenHeight - bottom)
    // rightA.value = pxToRem(screenWidth - right)
    floatWindowRef.value.setAttribute(
        "style",
        `right: ${rightA.value}rem;
         bottom:${bottomA.value}rem`
    )
    moveX.value = 0
    moveY.value = 0
}

const filterTimeDown = (row: AnniverAside[0]): string => {
    if ("down" in row) {
        return row.countdown_cn.replace(/\{0\}/, `<span>${formatCountDown<CurrentTime>(unref(row.down))}</span>`)
    }
    return ""
}

const close = (): void => {
    anniverAside.value = []
}

// 活动浮标显示

const AnniversaryPopup = async (): Promise<void> => {
    const params = { is_list: 1 }

    HttpPlus.setUrlOptions(ApiSetting.active.getActivePopup)
    const res = await HttpPlus.sendHttpRequest<ActiveGetActivePopupData, typeof params>(params)

    const { status, data } = res
    if (status === 1 && data && data.length) {
        const arr = data.filter((item: ActiveGetActivePopupItem) => item.is_show).reverse()

        anniverAside.value = arr.map((ele: ActiveGetActivePopupItem) => {
            if (ele.is_show_countdown && ele.countdown_time) {
                countDown.reset(ele.countdown_time * 1000)
                countDown.start()

                return {
                    ...ele,
                    down: countDown.current
                }
            } else {
                return ele
            }
        })
    }
}

AnniversaryPopup()
</script>

<template>
    <div
        class="aside-wrapper"
        v-if="disAside.length"
        ref="floatWindowRef"
        v-touch:press="startHandler"
        v-touch:drag="movingHandler"
        v-touch:release="endHandler"
        :style="{ bottom: `${bottomA}rem`, right: `${rightA}rem` }"
    >
        <div class="aside-swiper-con">
            <!-- 一个浮窗高度为1.22rem-->
            <van-swipe :touchable="false" loop autoplay="3000" indicator-color="#fff" class="aside-swiper">
                <van-swipe-item v-for="(item, index) in disAside" :key="index" @click.prevent="router.push(item.url)">
                    <img :src="item.img_src" alt="" />
                    <div class="anniversary_aside_close" @click.stop="close(index)"></div>
                    <div
                        class="anniversary_aside_time font-robot"
                        v-if="typeof item.countdown_time === 'number' && item.is_show_countdown"
                        :style="{ backgroundImage: 'url(' + item.countdown_src + ')' }"
                    >
                        <div class="time-wrapper" v-if="item.countdown_cn" v-html="filterTimeDown(item)"></div>
                        <template v-else>
                            <span class="item-down">{{ formatCountDown(item.down) }}</span>
                        </template>
                    </div>
                </van-swipe-item>
            </van-swipe>
        </div>
    </div>
</template>

<style scoped lang="scss">
.aside-wrapper {
    position: fixed;
    text-align: center;
    z-index: 50;
    width: 0.8rem;
    height: 0.955rem;

    .aside-swiper-con {
        width: 0.8rem;
        height: 0.955rem;
    }

    .aside-swiper {
        width: 100%;
        height: 100%;
    }

    img {
        width: 100%;
        height: 0.85rem;
    }

    :deep(.van-swipe__indicators) {
        bottom: 0;

        .van-swipe__indicator {
            background: #999;
            opacity: 1;

            &.van-swipe__indicator--active {
                background-color: #07f1b7 !important;
            }
        }
    }

    .anniversary_aside_close {
        position: absolute;
        right: 0;
        top: 0;
        width: 0.12rem;
        height: 0.12rem;
        background: url("@/assets/img/template/july/icon-close.png") no-repeat center center;
        background-size: 100% 100%;
    }

    .anniversary_aside_time {
        position: absolute;
        top: 0.66rem;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        width: 0.655rem;
        height: 0.2rem;
        margin: 0 auto;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        font-size: 0.12rem;
        color: #ffffff;
        line-height: 0.2rem;
        text-align: center;
        overflow: hidden;

        .item-down {
            display: inline-block;
            line-height: 1;
            transform: scale(0.86);
            white-space: nowrap;
        }

        .time-wrapper {
            width: 100%;
            height: 100%;
            transform: scale(0.84);
            white-space: nowrap;

            :deep(span) {
                color: #ffffff;
                font-weight: normal;
                font-size: 0.1rem;
            }
        }
    }
}
</style>
