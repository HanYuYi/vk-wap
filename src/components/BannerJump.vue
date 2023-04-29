<script setup lang="ts">
import { useSysStore } from "@/stores/system"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { useStartGame } from "@/composable/util"
import { usePlaceImg } from "@/utils/globalImgs"

const { homeBannerError, lazyPack140 } = usePlaceImg()

/**
 * Props
 */
interface Props {
    bannerList: { wap_url: string; img: string; title: string }[] | null

    customJump?: boolean

    imgHeight?: string

    placehold?: string

    jump?: boolean

    showDesc?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    customJump: false,

    imgHeight: "full",

    placehold: "Pack140",

    jump: true,

    showDesc: false
})

/**
 * Emits
 */
interface Emits {
    (e: "jump", item: Props["bannerList"][number]): void
}

const emit = defineEmits<Emits>()

const systemParams = useSysStore()
const router: Router = useRouter()

// 点击了banner,跳转优惠或开启游戏
const clickBanner = (item: Props["bannerList"][number]): void => {
    if (!props.jump) {
        return
    }
    if (props.customJump) {
        emit("jump", item)
        return
    }
    if (item.wap_url && item.wap_url.includes("/api")) {
        // 跳转进入游戏
        const res = useStartGame(
            {
                url: item.wap_url,
                isNeedLogin: false,
                isCheckName: false,
                changeFlag: systemParams.userInfo.change_flag
            },
            systemParams.isLogin
        )
        if (!res) {
            router.push({ path: "/login" })
        }
    } else {
        router.push({ path: item.wap_url })
    }
}
</script>

<template>
    <van-swipe v-if="props.bannerList?.length" loop autoplay="3500" :stop-propagation="false" indicator-color="white">
        <van-swipe-item @click="clickBanner(item)" v-for="(item, index) in props.bannerList" :key="index">
            <img
                class="w-full"
                :class="{
                    'h-auto': props.imgHeight === 'auto',
                    'h-full': props.imgHeight === 'full'
                }"
                v-lazy="{
                    src: item?.img,
                    error: props.placehold === 'none' ? '' : props.placehold === 'banner' ? homeBannerError : lazyPack140,
                    loading: props.placehold === 'none' ? '' : props.placehold === 'banner' ? homeBannerError : lazyPack140
                }"
            />
            <div class="vk-banner-desc" v-if="props.showDesc">
                {{ item?.title }}
            </div>
        </van-swipe-item>
    </van-swipe>
</template>

<style scoped>
.vk-banner-desc {
    position: absolute;
    bottom: 0;
    height: 49px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.05);
    padding-top: 10px;
    padding-left: 15px;
    padding-right: 15px;
    font-size: 15px;
    font-weight: bold;
    color: #ffffff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
