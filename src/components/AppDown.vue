<script setup lang="ts">
import { useSysStore } from "@/stores/system"

const systemParams = useSysStore()
</script>

<template>
    <!-- App下载 -->
    <div
        class="Appdownload-bar w-screen h-50px py-7px px-14px z-300 fixed top-0 inset-x-0 hstack justify-between bg-page-color"
        v-if="systemParams.isShowAppDownBar"
    >
        <div class="hstack">
            <div class="guanbi w-15px h-14.5px mr-14px" @click="systemParams.setAppDownBar(false)"></div>
            <div class="hstack">
                <div class="logo-icon w-36px h-36px mr-9px"></div>
                <div class="text-left h-32px flex flex-col justify-between">
                    <div text="16px primary-text" class="font-semibold">威客APP</div>
                    <div text="12px second-text">你想玩的都在这里！</div>
                </div>
            </div>
        </div>

        <a :href="systemParams.appdownUrl ? systemParams.appdownUrl : ''">
            <div
                text="primary-text 15px center"
                shadow="[0_2.5px_13.5px_0_rgba(0,0,0,0.2)]"
                class="relative primary-btn w-90px h-32px leading-32px rounded-4px heartbeat ripple"
            >
                立即下载
            </div>
        </a>
    </div>
</template>

<style lang="scss" scoped>
.Appdownload-bar {
    .guanbi {
        background: url("@/assets/img/template/july/home/guanbi.png") no-repeat center;
        background-size: 100% 100%;
    }
    .logo-icon {
        background: url("@/assets/img/template/july/home/logo-icon.png") no-repeat center;
        background-size: 100% 100%;
    }
}
</style>
