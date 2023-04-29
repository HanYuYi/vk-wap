<script setup lang="ts">
import NoData from "./NoData.vue"
import LiveItem from "./LiveItem.vue"
import { computed, ref, onBeforeMount } from "vue"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import ApiSetting from "@/api/service"
import { useStartGame } from "@/composable/util"
import { toWatchLive } from "./composable"
import { useSysStore } from "@/stores/system"
import { useFreshStore } from "@/stores/fresh"
import type { TabsInstance } from "vant"
import type { IndexGetSchedule } from "@/api/pojo/IndexGetSchedule"
import { HttpPlus } from "@/api/HttpPlus"

export interface ScheduPageType {
    tabs: TabsInstance
    activeKey: string
}

const freshStore = useFreshStore()
const systemParams = useSysStore()
const router: Router = useRouter()

const activeKey = ref("soccer")
const tabsRef = ref<TabsInstance | null>(null)
const listData = ref<IndexGetSchedule["data"]>([])

// 当前分类
const currGame = computed<IndexGetSchedule["data"][number] | null>(() => {
    return listData.value.length ? listData.value.find((item) => item.tag === activeKey.value) : null
})

// 当前分类下的赛程列表
const matchList = computed<IndexGetSchedule["data"][number]["game_list"]>(() => {
    return currGame.value ? currGame.value?.game_list : []
})

const betUrlObj = computed(() => {
    if (currGame.value?.bet_url) {
        return currGame.value?.bet_url
    } else {
        if (activeKey.value == "egame") {
            return {
                jump_url: "/api/IaGame",
                is_need_login: 1
            }
        } else {
            return {
                jump_url: "/api/PinnacleGame",
                is_need_login: 1
            }
        }
    }
})

const getScheduleData = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.vkNews.getSchedule)
    const res = await HttpPlus.sendHttpRequest<IndexGetSchedule["data"]>()
    if (res.status === 1 && res.data) {
        listData.value = res.data
    }
}

const onRefresh = async (): Promise<void> => {
    systemParams.PageLoading = true
    await getScheduleData()
    systemParams.PageLoading = false
    freshStore.refreshLoading = false
}

// 观看直播
const toLiveVideo = async (item: IndexGetSchedule["data"][number]["game_list"][number]): Promise<void> => {
    const res = await toWatchLive({
        ...item,
        next: Boolean(item.live_line_list.length)
    })
    if (res) {
        const currentMatch = {
            ...res,
            betUrlObj: betUrlObj.value,
            liveTypeData: { show_live: 1 }
        }
        systemParams.routeParams = { ...currentMatch }
        router.push(`/news/live/${item.id}`)
    }
}

onBeforeMount(() => getScheduleData())

defineExpose({
    tabs: tabsRef,
    activeKey
})
</script>

<template>
    <div class="schepage-wrapper bg-pageColor">
        <van-tabs
            ref="tabsRef"
            class="news-tab schepage-tab"
            v-model:active="activeKey"
            animated
            sticky
            offset-top="0.44rem"
            background="#f8fcfe"
        >
            <van-tab title-class="px-10px!" :name="type.tag" v-for="(type, index) in listData" :key="index">
                <!-- 自定义tab标题 -->
                <template #title>
                    <div :class="`schepage-tab-item-${type.tag}`" class="schepage-tab-item hstack">
                        <img
                            class="live-tab-icon"
                            :class="[`live-tab-icon-${type.tag}`]"
                            :src="type.tag === activeKey ? type.icon_hover : type.icon"
                            alt=""
                        />
                        <span>{{ type.name }}</span>
                    </div>
                </template>
                <PullRefresh @on-refresh="onRefresh">
                    <div class="list">
                        <LiveItem
                            class="sche-list-item"
                            @click.stop="
                                () => {
                                    useStartGame(
                                        {
                                            url: item.bet_url,
                                            isNeedLogin: item.is_need_login,
                                            isCheckName: item.is_check_name,
                                            changeFlag: systemParams.userInfo.change_flag
                                        },
                                        systemParams.isLogin,
                                        true
                                    )
                                }
                            "
                            :item="item"
                            v-for="(item, i) in matchList"
                            :key="i"
                        >
                            <template #statu-label><div></div></template>
                            <template #living-img v-if="item.live_line_list.length">
                                <div @click.stop="toLiveVideo(item)" class="liveing-img sche-img"></div>
                            </template>
                            <template #top>
                                <div class="text-left leading-32px h-30px text-12px text-light-text pl-15.5px font-robot">
                                    <span class="inline-block align-middle">{{ item.show_time }}</span>
                                    <span class="max-w-102px ml-10px van-ellipsis inline-block align-middle">
                                        {{ item.league_name }}
                                    </span>
                                </div>
                            </template>
                            <template #center>
                                <div class="center-match">
                                    <div class="vs-text font-robot">
                                        <span class="pei text-15px text-light-text">{{ item.home_team_point }}</span>
                                        <span class="vs inline-block align-top leading-28.8px mx-10px">
                                            {{ item.status === 1 ? "VS" : "未开始" }}
                                        </span>
                                        <span class="pei text-15px text-light-text">{{ item.away_team_point }}</span>
                                    </div>
                                </div>
                            </template>
                        </LiveItem>
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

<style lang="scss" scoped>
.live-list-item.sche-list-item {
    height: 94px;
    background-image: url("@/assets/img/template/july/news/live/sche-bg.png");
    :deep(.left-match) {
        position: relative;
        left: 20px;
        flex: 0.3;
    }
    :deep(.center-match) {
        flex: 0.4;
    }
    :deep(.right-match) {
        position: relative;
        right: 20px;
        flex: 0.3;
    }
}
</style>
