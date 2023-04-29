<script setup lang="ts">
import DPlayer from "dplayer"
import type { DPlayer as DPlayerType } from "@/types"
import { useWalletStore } from "@/stores/wallet"
import { ref, watch } from "vue"

const walletStore = useWalletStore()

const currentId = ref(0)
let collapse = ref(true)
const playerRef = ref<HTMLElement | null>(null)
const playerInstance = ref<DPlayerType | null>(null)
// 展开次数，仅第一次展开初始化视频播放器
const expandTime = ref(0)

const tabList = ["ERC&TRC", "如何购买", "如何充值", "提款&卖币"]

const initPlayer = (): void => {
    if (!walletStore.richpayInitData?.video?.length) return

    const container = playerRef.value
    playerInstance.value = new DPlayer({
        container,
        video: {
            url: walletStore.richpayInitData.video[currentId.value],
            pic: new URL(`../../assets/img/template/july/richpay/virtual_cover_${currentId.value + 1}.jpg`, import.meta.url).href
        }
    })
}

const switchVideo = (index: number): void => {
    currentId.value = index
    if (!playerInstance.value) return

    playerInstance.value.switchVideo({
        url: walletStore.richpayInitData.video[currentId.value],
        pic: new URL(`../../assets/img/template/july/richpay/virtual_cover_${currentId.value + 1}.jpg`, import.meta.url).href
    })
}

watch(collapse, (val?: boolean) => {
    if (!val) {
        if (expandTime.value <= 0) {
            initPlayer()
        }
        expandTime.value++
    } else {
        if (playerInstance.value) {
            playerInstance.value.pause()
        }
    }
})
</script>

<template>
    <div class="main">
        <div class="richpay_head" :class="{ richpay_head_collapse: collapse }" @click="collapse = !collapse">
            虚拟币使用教程
            <i class="fold_icon" :class="{ open: !collapse }"></i>
        </div>
        <transition name="slide-fade">
            <div class="richpay_content" v-show="!collapse">
                <div class="table-panel">
                    <ul class="tab">
                        <li
                            v-for="(txt, index) in tabList"
                            :key="index"
                            @click="switchVideo(index)"
                            :class="{ active: currentId === index }"
                        >
                            {{ txt }}
                        </li>
                    </ul>

                    <div class="video-box">
                        <div class="video-play" ref="playerRef"></div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
.table-panel {
    border-top: 1px solid transparent;
    margin: 0 auto 0.195rem;
    width: 3rem;
    padding-bottom: 0.135rem;

    .tab {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        li {
            width: 1.4rem;
            height: 0.38rem;
            line-height: 0.38rem;
            margin-top: 0.17rem;
            text-align: center;
            background: url("@/assets/img/template/july/richpay/dialog_btn.png") no-repeat;
            background-size: 100% 100%;
            font-size: 0.15rem;
            color: #fefeff;

            &:active,
            &.active {
                color: #9de1f3;
                background: url("@/assets/img/template/july/richpay/dialog_btn_hover.png") no-repeat;
                background-size: 100% 100%;
                font-weight: bold;
            }
        }
    }

    .video-box {
        position: relative;
        min-height: 1.7rem;
        margin: 0.19rem 0 0;

        .video-play {
            width: 100%;
            height: 100%;
            background: #000;
            overflow: visible;
        }
    }
}
</style>

<style>
@import "@/assets/style/dplayer.css";
</style>
