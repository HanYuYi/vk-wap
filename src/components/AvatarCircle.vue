<script setup lang="ts">
import { computed, ref } from "vue"
import { useSysStore } from "@/stores/system"
import { usePlaceImg } from "@/utils/globalImgs"
import { pxToRem } from "@/utils/commonUtils"

const systemParams = useSysStore()
const { GrayAvatar } = usePlaceImg()

/**
 * Props
 */
interface Props {
    width?: number

    imgWidth?: number

    showRate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    width: 54,

    imgWidth: 50,

    showRate: true
})

const currentRate = ref(0)

const rate = computed<number>(() => {
    if (props.showRate && "level_percent" in systemParams.userInfo) {
        const num: string = systemParams.userInfo.level_percent ?? "0"
        return parseFloat(num) * 100
    } else {
        return 0
    }
})

const rateColor = computed<"#ffffff" | "#07f1b7">(() => {
    if ("level_percent" in systemParams.userInfo) {
        const num = systemParams.userInfo.level_percent ?? "0"
        return parseFloat(num) === 0 ? "#ffffff" : "#07f1b7"
    }
    return "#ffffff"
})
</script>

<template>
    <div
        :style="{
            width: `${pxToRem(props.width)}rem`,
            height: `${pxToRem(props.width)}rem`
        }"
    >
        <van-circle
            :size="`${pxToRem(props.width)}rem`"
            v-model:current-rate="currentRate"
            :rate="rate"
            :color="rateColor"
            :speed="100"
            layer-color="#ffffff"
            text="颜色定制"
            v-lazy-container="{
                selector: 'img',
                error: GrayAvatar,
                loading: GrayAvatar
            }"
        >
            <img
                :data-src="systemParams.userInfo.head_image"
                alt=""
                class="rounded-50% ab-center"
                :style="{
                    width: `${pxToRem(props.imgWidth)}rem`,
                    height: `${pxToRem(props.imgWidth)}rem`
                }"
            />
        </van-circle>
    </div>
</template>

<style scoped></style>
