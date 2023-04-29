<script setup lang="ts">
import { useFreshStore } from "@/stores/fresh"
const freshStore = useFreshStore()

/**
 * Props
 */
interface Props {
    finishedText?: string
}

const props = withDefaults(defineProps<Props>(), {
    finishedText: "没有更多了"
})

/**
 * Emits
 */
interface Emits {
    (e: "load"): void
}

const emit = defineEmits<Emits>()

function load() {
    emit("load")
}
</script>

<template>
    <van-list
        v-model:loading="freshStore.listLoading"
        loading-text="更多加载中.."
        offset="70"
        v-model:error="freshStore.listError"
        error-text="请求失败，点击重新加载"
        :finished="freshStore.listFinished"
        :finished-text="props.finishedText"
        @load="load"
    >
        <slot></slot>
    </van-list>
</template>
