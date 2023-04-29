<script setup lang="ts">
import { nextTick, ref, watch } from "vue"
import { useSysStore } from "@/stores/system"

const systemParams = useSysStore()

// iframe没有展开之前，始终loading
const loading = ref(true)
const kfIframeRef = ref<HTMLIFrameElement>(null)

watch(
    () => systemParams.kfDialogShow,
    (val: boolean) => {
        if (val) {
            nextTick(() => {
                const kfIframe: HTMLIFrameElement = kfIframeRef.value
                kfIframe.onload = () => {
                    loading.value = false
                }
            })
        } else {
            loading.value = true
        }
    }
)
</script>

<template>
    <div v-if="systemParams.kfDialogShow">
        <van-popup
            class="bg-black"
            v-model:show="systemParams.kfDialogShow"
            :close-on-click-overlay="false"
            closeable
            round
            position="top"
            :style="{ height: '84%' }"
        >
            <iframe class="w-full h-full" ref="kfIframeRef" :src="systemParams.currentKfUrl" frameborder="0"></iframe>
            <van-loading class="ab-center" type="spinner" v-if="loading" />
        </van-popup>
    </div>
</template>
