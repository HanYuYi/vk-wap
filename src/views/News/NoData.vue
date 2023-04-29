<script setup lang="ts">
/**
 * Emits
 */
interface Emits {
    (e: "startgame"): void
}
const emit = defineEmits<Emits>()

const start = (): void => {
    emit("startgame")
}
</script>

<template>
    <!-- 占位图 -->
    <div class="no-data-wrapper ab-center">
        <img class="no-data-img" src="@/assets/img/template/july/news/live/no-live.png" alt="" />
        <div class="no-data-text">暂无直播</div>
        <div class="no-data-btn primary-btn" @click="start">投一注</div>
    </div>
</template>

<style lang="scss" scoped>
.no-data-wrapper {
    text-align: center;

    .no-data-img {
        display: block;
        margin: auto;
        width: 105px;
        height: 127.5px;
    }

    .no-data-text {
        font-size: 15px;
        color: var(--vk-old-light-text-color);
        line-height: 2;
    }

    .no-data-btn {
        margin: 24px auto 0;
        width: 120px;
        height: 40px;
        border-radius: 20px;
        font-size: 15px;
        line-height: 40px;
        font-weight: bold;
        color: #000;
    }
}
</style>
