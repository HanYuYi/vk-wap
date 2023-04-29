<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useWalletStore } from "@/stores/wallet"

const walletStore = useWalletStore()

const selectIndex = ref(0)
const TITLE_ARR = ["ERC&TRC", "如何购买", "如何充值", "提款&卖币"]
const showVideo = ref(false)
const videoUrl = ref("")
const posterUrl = ref("")

const choose = (index: number): void => {
    selectIndex.value = index
    checkoutVideo()
}

const checkoutVideo = (): void => {
    showVideo.value = false

    const timer = setTimeout(() => {
        videoUrl.value = walletStore.richpayInitData.video[selectIndex.value]
        posterUrl.value = new URL(`../../assets/img/virtualCoiCourse/video_${selectIndex.value}_poster.png`, import.meta.url).href
        showVideo.value = true
        clearTimeout(timer)
    }, 300)
}

onMounted(async () => {
    await walletStore.getRichpayData()
    checkoutVideo()
})
</script>

<template>
    <div class="vir-course">
        <ul class="video-selector">
            <li v-for="(txt, index) in TITLE_ARR" :key="index" @click="choose(index)" :class="{ active: selectIndex === index }">
                {{ txt }}
            </li>
        </ul>

        <div class="video-box">
            <video v-if="showVideo" loop playsinline controls preload="auto" :poster="posterUrl">
                <source :src="videoUrl" type="video/mp4" />
            </video>
        </div>
    </div>
</template>

<style lang="less" scoped>
.vir-course {
    width: 3.56rem;
    height: 3.54rem;
    margin: 0.165rem auto 0;
    background-image: url("@/assets/img/virtualCoiCourse//course_bg.png");
    background-size: 100% 100%;
    overflow: hidden;

    .video-selector {
        width: 3.05rem;
        margin: 0.2rem auto 0;

        li {
            display: inline-block;
            width: 1.43rem;
            height: 0.47rem;
            margin-bottom: 0.1rem;
            background-image: url("@/assets/img/virtualCoiCourse//selector_btn_bg.png");
            background-size: 100% 100%;
            font-size: 0.15rem;
            line-height: 0.45rem;
            text-align: center;
            color: #fff;
            &:nth-child(2n + 2) {
                margin-left: 0.19rem;
            }

            &.active {
                color: #001fd3;
                background-image: url("@/assets/img/virtualCoiCourse//selector_btn_bg_active.png");
                background-size: 100% 100%;
            }
        }
    }

    .video-box {
        width: 3.25rem;
        height: 1.86rem;
        border: solid 2px #88fee1;
        background-color: #020202;
        box-sizing: border-box;
        margin: 0 auto 0;
        text-align: center;
        overflow: hidden;
        video {
            height: 100%;
        }
    }
}
</style>
