<script setup lang="ts">
import ApiSetting from "@/api/service"
import { useDateFormat } from "@vueuse/core"
import PullRefresh from "@/components/PullRefresh.vue"
import ListLazy from "@/components/ListLazy.vue"
import { ref, watch } from "vue"
import { useFreshStore } from "@/stores/fresh"
import { useSysStore } from "@/stores/system"
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router"
import type { RouteLocationNormalizedLoaded, Router, RouteLocationNormalized } from "vue-router"
import type { IndexGetNotice } from "@/api/pojo/IndexGetNotice"
import type { UserGetMessageList } from "@/api/pojo/UserGetMessageList"
import { HttpPlus } from "@/api/HttpPlus"
import type { UserMessageDetail } from "@/api/pojo/UserMessageDetail"

const route: RouteLocationNormalizedLoaded = useRoute()
const router: Router = useRouter()
const freshStore = useFreshStore()
const systemParams = useSysStore()

const formatDate = (time: number | string, format: string = "YYYY/MM/DD"): string => {
    return useDateFormat(Number(time), format).value
}

const active = ref(0)

const PAGE_NAV_LIST = [
    {
        id: 1,
        name: "站内信"
    },
    {
        id: 2,
        name: "公告"
    },
    {
        id: 3,
        name: "登录日志"
    }
]

// 加载公告
const loadNotice = (): void => {
    freshStore.getList<IndexGetNotice, {}>({
        url: ApiSetting.user.getNoticeList
    })
}

// 加载站内信和登录日志
const loadMessageAnd = (): void => {
    const params = { status: -1 }

    freshStore.getList<UserGetMessageList, typeof params>({
        url: ApiSetting.user.getMessageList,
        params,
        isLoginLog: +route.query.id === 2
    })
}

/**
 * 下拉刷新
 */
const onRefresh = (): void => {
    freshStore.resetList()
    if (active.value === 1) {
        loadNotice()
    } else {
        loadMessageAnd()
    }
}

freshStore.resetList()

if (route.query?.id) {
    active.value = Number(route.query.id)
    if (active.value === 1) {
        loadNotice()
    } else {
        freshStore.paginationData.total = null
        loadMessageAnd()
    }
} else {
    loadMessageAnd()
}

watch(active, async (val: number, oldVal: number) => {
    if (oldVal === 0) freshStore.resetList()
    await router.replace(`/messages?id=${val}`)
    freshStore.resetList()

    if (val === 1) {
        loadNotice()
    } else {
        loadMessageAnd()
    }
})

const toDetail = async (item: UserGetMessageList["list"][number] | IndexGetNotice["list"][number]): Promise<void> => {
    // 站内信
    if (active.value === 0) {
        const params = { id: item.id }

        HttpPlus.setUrlOptions(ApiSetting.user.getMessageDetail)
        const res = await HttpPlus.sendHttpRequest<UserMessageDetail, typeof params>(params)

        if (res.status === 1 && "is_read" in item) {
            item.is_read = 1

            let content: string = res.data.app_content.replace(/[\r\n]/g, "<br/>")

            if (res.data.app_ext) {
                const { copy, jump_wap } = res.data.app_ext
                if (copy) {
                    content = content.replace(/复制/g, '<span id="copyBtn" class="theme-text copy-text">复制</span>')
                }
                if (jump_wap) {
                    const text: string = jump_wap.text
                    if (text) {
                        content = content.replace(new RegExp(text, "g"), `<span id="bagBtn" class="theme-text">${text}</span>`)
                    }
                }
            }
            systemParams.routeParams = {
                title: res.data.title,
                time: res.data.add_time,
                headtit: "消息详情",
                jump_wap: res.data.app_ext?.jump_wap,
                copy: res.data.app_ext?.copy,
                content
            }
            router.push(`/messages/mes=${item.id}`)
        }
    }

    // 公告
    if (active.value === 1) {
        systemParams.routeParams = {
            title: item.title,
            content: item.content.replace(/[\r\n]/g, "<br/>"),
            time: "create_time" in item ? item.create_time : "",
            headtit: "公告详情"
        }
        router.push(`/messages/notice=${item.id}`)
    }
}

onBeforeRouteLeave((to: RouteLocationNormalized) => {
    if (to.name && to.name != "messagedetail") {
        systemParams.routeParams = {}
    }
})
</script>

<template>
    <div class="message-page bg-light-green">
        <HeaderBar>
            <div class="header_title">消息公告</div>
        </HeaderBar>

        <div class="expand-page">
            <van-tabs
                class="van-hairline--bottom"
                v-model:active="active"
                background="transparent"
                animated
                swipeable
                :ellipsis="false"
            >
                <van-tab v-for="(tab, i) in PAGE_NAV_LIST" :key="i" :title="tab.name">
                    <PullRefresh @on-refresh="onRefresh">
                        <div class="list px-12px">
                            <!-- 站内信 -->
                            <section v-if="active === 0">
                                <ListLazy @load="loadMessageAnd">
                                    <div
                                        @click="toDetail(item)"
                                        class="pt-15px pb-10px van-hairline--bottom"
                                        :class="{ is_read: item.is_read == 1 }"
                                        v-for="(item, index) in freshStore.list"
                                        :key="index"
                                    >
                                        <div class="list_box_top hstack justify-between h-30px">
                                            <span class="box_title text-16px w-70% font-bold van-ellipsis">
                                                {{ item?.title }}
                                            </span>
                                            <span v-if="item?.add_time" class="box_time text-12px text-#c6d0db">
                                                {{ formatDate(item?.add_time * 1000) }}
                                            </span>
                                        </div>
                                        <div
                                            class="list_box_content leading-relaxed w-350px mt-5px text-#7c839f van-ellipsis"
                                            v-html="item?.content"
                                        ></div>
                                    </div>
                                </ListLazy>
                            </section>
                            <!-- 公告 -->
                            <section v-if="active === 1">
                                <ListLazy @load="loadNotice">
                                    <div
                                        @click="toDetail(item)"
                                        class="pt-15px pb-10px van-hairline--bottom"
                                        v-for="(item, index) in freshStore.list"
                                        :key="index"
                                    >
                                        <div class="list_box_top hstack justify-between h-30px">
                                            <span class="box_title text-16px w-70% font-bold van-ellipsis">
                                                {{ item?.title }}
                                            </span>
                                            <span v-if="item?.time" class="box_time text-12px text-#c6d0db">
                                                {{ formatDate(item?.time * 1000) }}
                                            </span>
                                        </div>
                                        <div
                                            v-if="item?.show_type"
                                            class="list_box_content leading-relaxed w-350px mt-5px text-#7c839f van-ellipsis"
                                            v-html="item?.show_type"
                                        ></div>
                                    </div>
                                </ListLazy>
                            </section>
                            <!-- 登录日志 -->
                            <section v-if="active === 2">
                                <ListLazy @load="loadMessageAnd">
                                    <div
                                        class="py-10px van-hairline--bottom"
                                        v-for="(item, index) in freshStore.loginLogList"
                                        :key="index"
                                    >
                                        <div class="list_box_top hstack justify-between h-30px">
                                            <span class="box_title text-16px w-70% van-ellipsis">{{ item?.area_info }}</span>
                                            <span v-if="item?.real_ip" class="box_time text-16px text-oldText">
                                                {{ item?.real_ip }}
                                            </span>
                                        </div>
                                        <div
                                            v-if="item?.time"
                                            class="list_box_content leading-relaxed w-350px mt-5px text-#7c839f van-ellipsis"
                                        >
                                            {{ formatDate(item?.time * 1000, "YYYY/MM/DD HH:mm") }}
                                        </div>
                                    </div>
                                </ListLazy>
                            </section>
                        </div>
                    </PullRefresh>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.list {
    position: relative;
    min-height: calc(100vh - 88px);
    min-height: calc(var(--vh) * 100 - 88px);
    padding: 0 12px;
    .is_read {
        .box_title {
            color: #7c839f;
        }
    }
}
</style>
