<script setup lang="ts">
import ApiSetting from "@/api/service"
import { onBeforeMount } from "vue"
import { useTask } from "@/stores/task"
import type { TaskListArrList } from "@/stores/task"
import { useRouter } from "vue-router"
import { showToast } from "vant"
import { HttpPlus } from "@/api/HttpPlus"

const router = useRouter()

const taskStore = useTask()

const toLog = (): void => {
    router.push("/task/log")
}

const next = async (list: TaskListArrList[number]): Promise<void> => {
    if (list.status === 0) {
        // 去做任务
        router.push(list.jump_url)
    }
    if (list.status === 1) {
        // 领取奖励
        const params = {
            task_id: list.task_id
        }
        list.btnloading = true
        try {
            HttpPlus.setUrlOptions(ApiSetting.user.getTaskPrize)
            const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
            list.btnloading = false

            if (res.status === 1) {
                showToast({
                    className: "vk-toast-success",
                    message: res.message,
                    icon: "checked"
                })
                list.status = 2
                taskStore.task()
            }
        } catch (error: unknown) {
            list.btnloading = false
            console.error(error)
        }
    }
}

onBeforeMount(() => {
    taskStore.task()
})
</script>

<template>
    <div class="task-page bg-mypageColor">
        <HeaderBar @tolog="toLog">
            <div class="header_title">任务中心</div>
        </HeaderBar>
        <div class="expand-page p-12px">
            <div v-for="(item, index) in taskStore.taskListArr" :key="index" class="wrap-border">
                <section class="mb-12px" v-if="item.list.length">
                    <div class="title font-bold leading-44px text-newText">
                        {{ item.title }}
                    </div>
                    <div class="block" v-for="(list, index) in item.list" :key="index + 'l'">
                        <div class="left hstack">
                            <img class="w-54px h-54px mr-14px" :src="list?.icon" alt="" />
                            <div class="h-54px">
                                <div class="title van-ellipsis">{{ list?.title }}</div>
                                <div class="desc van-ellipsis" v-html="list?.prizeDesc"></div>
                            </div>
                        </div>
                        <div class="right">
                            <div class="btn w-80px inline-block">
                                <van-button
                                    @click="next(list)"
                                    :disabled="list.status === 2"
                                    :loading="list.btnloading"
                                    round
                                    block
                                    class="h-40px leading-40px border-#a5e3d2 bg-#f5fdfb color-#5ad8b5"
                                    :class="{
                                        'primary-btn border-none text-white': list.status === 1,
                                        'border-#dcdcdd text-#bbbbbc opacity-100 bg-#f6f8f8': list.status === 2
                                    }"
                                >
                                    {{ list.status === 2 ? "已完成" : list.status === 1 ? "领取" : "去完成" }}
                                </van-button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.task-page {
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
            }
            .desc {
                width: 155px;
                color: #808585;
                font-size: 12px;
                margin-top: 6px;
                :deep(span) {
                    font-size: 18px;
                    font-weight: bold;
                    line-height: 24px;
                    color: #ff6600;

                    margin-right: 4px;
                    font-family: Roboto;
                }
            }
        }
        .right {
            flex: 0.3;
            text-align: right;
        }
    }
}
</style>
