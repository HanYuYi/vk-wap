<script setup lang="ts">
import { usePlaceImg } from "@/utils/globalImgs"
import { useDateFormat } from "@vueuse/core"
import { useTask } from "@/stores/task"

const taskStore = useTask()
const { GrayAvatar } = usePlaceImg()

if (!taskStore.taskLogList.length) {
    taskStore.task()
}

const formatDate = (time: number | string): string => {
    return useDateFormat(Number(time), "YYYY/MM/DD HH:mm").value
}
</script>

<template>
    <div class="tasklog-page bg-mypageColor">
        <HeaderBar>
            <div class="header_title">任务日志</div>
        </HeaderBar>
        <div class="expand-page p-12px">
            <div class="wrap-border">
                <div class="block" v-for="(list, index) in taskStore.taskLogList" :key="index + 'l'">
                    <div class="left hstack">
                        <img
                            class="w-54px h-54px mr-14px"
                            v-lazy="{
                                src: list?.icon,
                                error: GrayAvatar,
                                loading: GrayAvatar
                            }"
                            alt=""
                        />
                        <div class="h-54px">
                            <div class="title van-ellipsis">{{ list?.title }}</div>
                            <div class="w-155px leading-relaxed text-#bbbbbc text-12px van-ellipsis" v-if="list?.finish_time">
                                {{ formatDate(list?.finish_time * 1000) }}
                            </div>
                        </div>
                    </div>
                    <div class="right h-54px">
                        <div class="desc van-ellipsis" v-html="list?.prizeDesc"></div>
                    </div>
                </div>
            </div>
            <div class="text-center" v-if="!taskStore.taskLogList.length">
                <img class="w-200px h-180px mt-88px" src="@/assets/img/template/july/nolog.png" alt="" />
                <div class="text-#aaaaab leading-normal">暂无记录</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrap-border {
    padding: 0 16px;
    background-color: #fff;
    box-shadow: 0 2px 6px 0 rgba(52, 166, 202, 0.05);
    border-radius: 8px;
}
.block {
    display: flex;
    align-items: center;
    height: 90px;
    border-bottom: 1px solid #e6e8e8;

    &:last-child {
        border-bottom: none;
    }

    .left {
        flex: 0.7;

        .title {
            line-height: 24px;
            width: 155px;
            font-weight: bold;
            color: var(--vk-primary-text-color);
            margin-bottom: 6px;
        }
    }
    .desc {
        width: 105px;
        color: #808585;
        font-size: 12px;

        :deep(span) {
            font-size: 18px;
            font-weight: bold;
            line-height: 24px;
            color: #ff6600;

            margin-right: 4px;
            font-family: Roboto;
        }
    }

    .right {
        flex: 0.3;
        text-align: right;
    }
}
</style>
