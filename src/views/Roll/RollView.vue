<script setup lang="ts">
import RollRoomItem from "./RollRoomItem.vue"
import ApiSetting from "@/api/service"
import { ref, onUnmounted, watch } from "vue"
import { useSysStore } from "@/stores/system"
import { useFreshStore } from "@/stores/fresh"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { computed } from "vue"
import { showToast } from "vant"
import type { RollGetList } from "@/api/pojo/RollGetList"
import { HttpPlus } from "@/api/HttpPlus"
import type { RollGetTitleMenu } from "@/api/pojo/RollGetTitleMenu"
import type { RollGetUserProfile } from "@/api/pojo/RollGetUserProfile"

const systemParams = useSysStore()
const freshStore = useFreshStore()
const router: Router = useRouter()

const active = ref(0)
const rollNavList = ref<RollGetTitleMenu["data"]>([])

const showEmpty = computed<boolean>(() => {
    return (
        !freshStore.listLoading &&
        !freshStore.list.length &&
        (currentRollType.value === 3 || currentRollType.value === 4 || currentRollType.value === 5)
    )
})

watch(active, (val: number) => {
    freshStore.$reset()
    getRollRoomList()
    if (val === 4) {
        getUserProfile()
    }
})

const currentRollType = computed<number>(() => {
    return rollNavList.value[active.value]?.type ?? 2
})

const search = (): void => {
    router.push("/rollroomsearch")
}

/**
 * 下拉刷新
 */
const onRefresh = (): void => {
    freshStore.resetList()
    getRollRoomList()
}

freshStore.resetList()

const loadTitleMenu = async (): Promise<void> => {
    systemParams.PageLoading = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.roll.getTitleMenu)
        const res = await HttpPlus.sendHttpRequest<RollGetTitleMenu["data"]>()
        systemParams.PageLoading = false

        if (res.status === 1 && res.data.length) {
            rollNavList.value = res.data.filter((item: RollGetTitleMenu["data"][number]) =>
                item.need_login ? systemParams.isLogin : true
            )
            freshStore.resetList()
            getRollRoomList()
        }
    } catch (e: unknown) {
        systemParams.PageLoading = false
        throw e
    }
}

// 获取roll房间列表
const getRollRoomList = async (): Promise<void> => {
    const params = {
        type: currentRollType.value,
        room_id: ""
    }

    freshStore.getList<RollGetList, typeof params>({
        url: ApiSetting.roll.getRollRoomList,
        params,
        limit: true
    })
}

const canCreateRoom = ref(false)

// 是否能创建房间
const getUserProfile = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.roll.getUserProfile)
    const res = await HttpPlus.sendHttpRequest<RollGetUserProfile>()
    if (res.status === 1 && res.data.canCreate == 1) {
        canCreateRoom.value = true
    } else {
        canCreateRoom.value = false
    }
}

// 创建房间
const hanleToCreateRoom = (): void => {
    if (canCreateRoom.value) {
        router.push("/createroom")
    } else {
        showToast({
            className: "vk-toast-fail",
            message: "没有创建ROLL的权限",
            icon: "warning"
        })
    }
}

loadTitleMenu()
// 组件卸载后，下拉刷新和懒加载组件的状态重置
onUnmounted(() => {
    freshStore.$reset()
})
</script>

<template>
    <div class="roll-page bg-#e8f1ef font-classic">
        <HeaderBar @search="search">
            <div class="header_title">饰品/红包</div>
        </HeaderBar>
        <div class="expand-page">
            <van-tabs sticky offset-top="0.44rem" :ellipsis="false" background="#e8f1ef" v-model:active="active">
                <van-tab
                    v-for="(tab, index) in rollNavList"
                    :key="index"
                    :title="tab.name"
                    :title-class="{ celebrate: tab?.is_festival }"
                >
                    <PullRefresh @on-refresh="onRefresh">
                        <div class="list">
                            <ListLazy
                                v-if="!systemParams.PageLoading"
                                :finishedText="showEmpty ? '' : '没有更多了'"
                                @load="getRollRoomList"
                            >
                                <roll-room-item v-for="item in freshStore.list" :key="item.id" :item="item"></roll-room-item>
                            </ListLazy>
                            <div
                                :class="{
                                    'h-50px w-full bg-transparent': systemParams.isLogin
                                }"
                            ></div>
                            <div class="mt-70px text-center text-#7c839f" v-if="showEmpty && !freshStore.listLoading">
                                <img class="w-46%" src="@/assets/img/template/july/roll/no-data.png" alt="" />
                                <p class="leading-relaxed text-18px mt-6px" v-if="currentRollType === 3">
                                    您还没有参与任何活动！
                                </p>
                                <div @click="active = 1" class="link_btn" v-if="currentRollType === 3">去参与活动</div>
                                <p class="leading-relaxed text-18px mt-6px" v-if="currentRollType === 4">
                                    您还没有创建任何活动！
                                </p>
                                <div @click="hanleToCreateRoom" class="link_btn" v-if="currentRollType === 4">创建房间</div>
                            </div>
                            <van-loading v-if="freshStore.listLoading" color="#444" class="ab-center" type="spinner" />
                        </div>
                    </PullRefresh>
                </van-tab>
            </van-tabs>
            <router-link to="/myroll" class="to_myroll van-hairline--top" v-if="systemParams.isLogin">我的ROLL</router-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.roll-page {
    .van-tabs {
        :deep(.van-tab) {
            &.celebrate {
                &:after {
                    pointer-events: none;
                    position: absolute;
                    content: "";
                    inset: 0;
                    z-index: 1;
                    width: inherit;
                    height: inherit;
                    background: url("@/assets/img/template/july/roll/celebrate.gif") no-repeat;
                    background-size: 100% auto;
                }
            }
        }
    }

    .com-header {
        :deep(.header-left) {
            width: 60px;
        }
    }
    .list {
        position: relative;
        min-height: calc(100vh - 88px);
        min-height: calc(var(--vh) * 100 - 88px);
    }
    .link_btn {
        margin: 1rem auto 0;
        width: 1.1rem;
        text-align: center;
        border: 1px solid #7c839f;
        font-size: 0.16rem;
        height: 0.4rem;
        line-height: 0.4rem;
        border-radius: 0.3rem;
        &:active {
            border-color: #262933;
            color: #262933;
        }
    }
    .to_myroll {
        position: fixed;
        width: 100%;
        left: 0;
        bottom: 0;
        height: 0.46rem;
        line-height: 0.46rem;
        font-size: 0.18rem;
        text-align: center;
        background-color: #fff;
    }
}
</style>
