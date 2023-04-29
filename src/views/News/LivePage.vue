<script setup lang="ts">
import NoData from "./NoData.vue"
import LiveItem from "./LiveItem.vue"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { computed, onBeforeMount, ref } from "vue"
import { useSysStore } from "@/stores/system"
import ApiSetting from "@/api/service"
import { useStartGame } from "@/composable/util"
import { toWatchLive } from "./composable"
import { useFreshStore } from "@/stores/fresh"
import { HttpPlus } from "@/api/HttpPlus"
import type { IndexGetHotLive, LiveItem as LiveItemData } from "@/api/pojo/IndexGetHotLive"
import type { TabsInstance } from "vant"
import type { BetUrl } from "@/api/pojo/IndexGetSchedule"

type ActiveKey = keyof IndexGetHotLive["live"]

interface LivePageType {
    tabs: TabsInstance
    activeKey: ActiveKey
}

const freshStore = useFreshStore()
const systemParams = useSysStore()
const router: Router = useRouter()

const tabsRef = ref<TabsInstance>(null)

const activeKey = ref<ActiveKey>("hot")

// 1 直播 2 默认视频 0 不展示
type LiveTypeData = Partial<Omit<IndexGetHotLive, "show_live">> & Pick<IndexGetHotLive, "show_live">
const liveTypeData = ref<LiveTypeData>({ show_live: 1 })

// 是否存在分类
const haveLiveList = computed<number>(() => (liveTypeData.value?.live ? Object.keys(liveTypeData.value?.live).length : 0))

// 当前分类下的比赛列表
type MatchList = LiveItemData["live_list"]
const matchList = computed<MatchList>(() => (liveTypeData.value?.live ? liveTypeData.value.live[activeKey.value].live_list : []))

// 当前分类下的投注跳转路径配置
const betUrlObj = computed<BetUrl | "">(() => liveTypeData.value.live[activeKey.value].bet_url ?? "")

const getLive = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.vkNews.getLive)
    const res = await HttpPlus.sendHttpRequest<IndexGetHotLive>()

    if (res.status === 1 && res.data) {
        liveTypeData.value = res.data
    }
}

onBeforeMount(() => {
    getLive()
})

const onRefresh = async (): Promise<void> => {
    systemParams.PageLoading = true
    await getLive()
    systemParams.PageLoading = false
    freshStore.refreshLoading = false
}

// 看直播
const toLiveVideo = async (item: MatchList[number]): Promise<void> => {
    const res = await toWatchLive({
        ...item,
        next: item.status === 2
    })

    if (res) {
        const currentMatch = {
            ...res,
            betUrlObj: betUrlObj.value,
            liveTypeData: liveTypeData.value
        }
        systemParams.routeParams = { ...currentMatch }
        router.push(`/news/live/${item.id}`)
    }
}

defineExpose({
    tabs: tabsRef,
    activeKey
})
</script>

<template>
    <div class="livepage-wrapper bg-pageColor">
        <van-tabs
            ref="tabsRef"
            class="news-tab livepage-tab"
            v-if="haveLiveList"
            v-model:active="activeKey"
            animated
            sticky
            offset-top="0.44rem"
            background="#f8fcfe"
        >
            <van-tab title-class="px-10px!" :name="key" v-for="(row, key) in liveTypeData?.live" :key="key">
                <!-- 自定义tab标题 -->
                <template #title>
                    <div :class="`live-tab-item-${key}`" class="live-tab-item hstack">
                        <img
                            class="live-tab-icon"
                            :class="[`live-tab-icon-${key}`]"
                            :src="key === activeKey ? row.icon_hover : row.icon"
                            alt=""
                        />
                        <span>{{ row.name }}</span>
                    </div>
                </template>
                <PullRefresh @on-refresh="onRefresh">
                    <div class="list">
                        <LiveItem @click="toLiveVideo(item)" :item="item" v-for="(item, i) in matchList" :key="i" />
                        <!-- 占位图 -->
                        <NoData
                            @startgame="
                                () => {
                                    useStartGame(
                                        {
                                            url: betUrlObj.jump_url,
                                            isNeedLogin: betUrlObj.is_need_login,
                                            isCheckName: betUrlObj.is_check_name,
                                            changeFlag: systemParams.userInfo.change_flag
                                        },
                                        systemParams.isLogin,
                                        true
                                    )
                                }
                            "
                            v-if="!matchList.length"
                        />
                    </div>
                </PullRefresh>
            </van-tab>
        </van-tabs>
    </div>
</template>
