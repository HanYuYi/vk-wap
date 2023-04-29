<script setup lang="ts">
import { useFreshStore } from "@/stores/fresh"

const freshStore = useFreshStore()

/**
 * Emits
 */
interface Emits {
    (e: "onRefresh"): void
}
const emit = defineEmits<Emits>()

const onRefresh = (): void => {
    emit("onRefresh")
}
</script>

<template>
    <van-pull-refresh
        v-model="freshStore.refreshLoading"
        head-height="60"
        animation-duration="500"
        success-text="刷新成功"
        @refresh="onRefresh"
    >
        <!-- 加载提示 -->
        <template #loading>
            <img class="w-40px h-40px" src="@/assets/defaultimg/july/pull-refresh.png" />
        </template>
        <slot></slot>
    </van-pull-refresh>
</template>
