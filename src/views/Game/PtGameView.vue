<script setup lang="ts">
import ApiSetting from "@/api/service"
import { useMarquee, useStartGame } from "@/composable/util"
import { formatNumberSplit } from "@/utils/numberUtils"
import { formatterStr } from "@/composable/validate"
import { useSysStore } from "@/stores/system"
import { showToast } from "vant"
import { onBeforeMount, ref, watch } from "vue"
import { HttpPlus } from "@/api/HttpPlus"
import type { GameListItem, PtSlotGetGameList } from "@/api/pojo/PtSlotGetGameList"
import type { PtSlotCollectGame } from "@/api/pojo/PtSlotCollectGame"

const systemParams = useSysStore()

// 计算跑马灯过渡时间，速度默认是90
const { marqueeDuration } = useMarquee(130)

const showMaintainPage = ref(true)
const maintainTime = ref("")
const maintainText = ref("")
const showPage = ref(true)

const prizePool = ref(0)
const noticeList = ref<PtSlotGetGameList["bet_win_list"]>([])
const typeFixed = ref(false)

const activeTab = ref(0)

const tabs = ref<Array<{ id: number; title: string; list: GameListItem[] }>>([
    {
        id: 0,
        title: "全部",
        list: []
    },
    {
        id: 1,
        title: "热门",
        list: []
    },
    {
        id: 2,
        title: "奖池",
        list: []
    },
    {
        id: 3,
        title: "桌牌",
        list: []
    },
    {
        id: 4,
        title: "收藏",
        list: []
    }
])

const markGameLoading = ref(false)

// 收藏点赞
const markGame = async (item: GameListItem): Promise<void> => {
    if (!systemParams.isLogin) {
        showToast({
            className: "vk-toast-fail",
            message: "请您先登录",
            icon: "warning"
        })
        return
    }

    if (markGameLoading.value) return

    markGameLoading.value = true
    try {
        const collectList = [1, 0]

        const params = {
            game_code: item.game_code,
            type: item.is_collect
        }
        HttpPlus.setUrlOptions(ApiSetting.ptCollectGame)
        const res = await HttpPlus.sendHttpRequest<PtSlotCollectGame["data"], typeof params>(params)
        markGameLoading.value = false

        if (res.status === 1) {
            item.is_collect = collectList[item.is_collect]
            tabs.value[1].list = []
            tabs.value[2].list = []
            tabs.value[3].list = []
            tabs.value[0].list.forEach((game) => {
                if (game.game_code == item.game_code) {
                    game.is_collect = item.is_collect
                }
                if (game.is_hot) {
                    tabs.value[1].list.push(game)
                }
                if (game.is_table) {
                    tabs.value[3].list.push(game)
                }
                if (game.is_prize) {
                    tabs.value[2].list.push(game)
                }
            })

            if (res.data) {
                tabs.value[4].list = res.data
            } else {
                tabs.value[4].list = []
            }

            showToast({
                className: "vk-toast-success",
                message: res.message,
                icon: "checked",
                duration: 1000
            })
        }
    } catch (error: unknown) {
        markGameLoading.value = false
        throw error
    }
}

// 进入游戏
const playGame = (url: string): void => {
    useStartGame(
        {
            url: url,
            isNeedLogin: true,
            isCheckName: true,
            changeFlag: systemParams.userInfo.change_flag
        },
        systemParams.isLogin,
        true
    )
}
const isShowNoMore = ref(false)
const showSearch = ref(false)

const search = ref<{ filterStr: string; filters: GameListItem[] }>({
    filterStr: "",
    filters: []
})

// 搜索返回
const toBack = (): void => {
    showSearch.value = false
    clearInput()
}

// 清除搜索框
const clearInput = (): void => {
    search.value = {
        filterStr: "",
        filters: []
    }
    isShowNoMore.value = false
}

const handleChange = (): void => {
    isShowNoMore.value = false
    const str = search.value.filterStr
    if (!str) {
        search.value.filters = []
        return
    }

    search.value.filters = tabs.value[0].list.filter((item: GameListItem) => {
        return item?.title.indexOf(str) >= 0
    })

    if (!search.value.filters.length) {
        isShowNoMore.value = true
    }
}

watch(
    () => search.value.filterStr,
    () => {
        handleChange()
    }
)

class PtSlotGetJackpot {
    prize_pool: PtSlotGetGameList["prize_pool"]
}
// 刷新奖池
const reloadBouns = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.pyGetJackpot)
    const res = await HttpPlus.sendHttpRequest<PtSlotGetJackpot>()

    if (res.status === 1) {
        prizePool.value = res.data.prize_pool
    }
}

const listLoading = ref(false)

const init = async (): Promise<void> => {
    showPage.value = true
    showMaintainPage.value = false
    listLoading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.ptSlotgetGameList)
        const res = await HttpPlus.sendHttpRequest<PtSlotGetGameList>()
        listLoading.value = false

        if (res.status === 1) {
            const { bet_win_list, game_list, prize_pool } = res.data
            if (prize_pool) {
                prizePool.value = prize_pool
            }
            if (bet_win_list.length) {
                noticeList.value = bet_win_list
            }
            if (game_list.length) {
                tabs.value[0].list = game_list
                game_list.forEach((game: GameListItem) => {
                    if (game.is_hot) {
                        tabs.value[1].list.push(game)
                    }
                    if (game.is_table) {
                        tabs.value[3].list.push(game)
                    }
                    if (game.is_prize) {
                        tabs.value[2].list.push(game)
                    }
                    if (game.is_collect) {
                        tabs.value[4].list.push(game)
                    }
                })
            }
        } else {
            showPage.value = false
            showMaintainPage.value = true
            maintainTime.value = res.message
            maintainText.value = res.info
        }
    } catch (error: unknown) {
        listLoading.value = false
        throw error
    }
}

init()

const Interval = setInterval(() => {
    reloadBouns()
}, 15 * 1000)

onBeforeMount(() => {
    clearInterval(Interval)
})
</script>

<template>
    <div class="bg-#e8f1ef font-classic leading-relaxed!">
        <HeaderBar>
            <div class="header_title">PT电子游戏</div>
        </HeaderBar>
        <div class="expand-page ptgame-page">
            <div class="wrapper" v-if="showMaintainPage">
                <Maintain :time="maintainTime" :content="maintainText"></Maintain>
            </div>
            <div class="third_game_jump pt_real relative" v-if="showPage">
                <div class="pt_game_banner" :class="{ banner_chage: typeFixed }">
                    <div class="pool">
                        <span class="pool_t">累计奖池:</span>
                        <span>¥{{ formatNumberSplit(prizePool, 0) }}</span>
                    </div>
                </div>
                <div class="sticky top-44px bg-#022488 z-8">
                    <div class="content_header">
                        <div class="content_tabs fl">
                            <span
                                class="tab_item"
                                :class="{
                                    actived: activeTab == item.id,
                                    middle: item.id == 1
                                }"
                                @click="activeTab = item.id"
                                v-for="item in tabs"
                                :key="item.id"
                            >
                                {{ item.title }}
                            </span>
                            <span class="tab_item fr" @click="showSearch = true">
                                搜索
                                <i class="icon_search"></i>
                            </span>
                        </div>
                    </div>
                    <!--跑马灯-->
                    <div class="notice_box" v-show="noticeList.length">
                        <div class="notice text-#1AB6B6">
                            <Vue3Marquee :duration="marqueeDuration" :delay="1" :pauseOnClick="true">
                                <span v-for="(notice, index) in noticeList" :key="index" class="word-style mx-20px select-none">
                                    {{ notice }}
                                </span>
                            </Vue3Marquee>
                        </div>
                    </div>
                </div>
                <!--类型-->
                <div class="main_content_box" :class="{ fixed: typeFixed }">
                    <!--列表-->
                    <div class="content_list" :class="{ fiexh: typeFixed }">
                        <div v-if="!listLoading && tabs[activeTab].list.length">
                            <div
                                class="list_item"
                                v-for="(item, index) in tabs[activeTab].list"
                                @click="playGame(item.url)"
                                :key="index"
                            >
                                <span class="hover_border"></span>
                                <span class="btn_mark" :class="{ actived: item.is_collect }" @click.stop="markGame(item)"></span>
                                <div class="img_box">
                                    <img class="game_img" :src="item.icon" />
                                </div>
                                <p class="game_name van-ellipsis" :title="item.title">
                                    {{ item.title }}
                                </p>
                            </div>
                        </div>
                        <p v-if="!listLoading && !tabs[activeTab].list.length && activeTab != 4" class="empty_list">暂无游戏！</p>
                        <p
                            v-if="!listLoading && !tabs[activeTab].list.length && activeTab == 4 && systemParams.isLogin"
                            class="empty_list"
                        >
                            暂无收藏游戏，快将喜欢的游戏加入收藏吧！
                        </p>
                        <p
                            v-if="!listLoading && !tabs[activeTab].list.length && activeTab == 4 && !systemParams.isLogin"
                            class="empty_list"
                        >
                            请先登录！
                        </p>
                        <van-loading v-if="listLoading" class="ab-center" type="spinner" size="20" text-size="12" color="#919191">
                            加载中...
                        </van-loading>
                    </div>
                </div>
                <!-- 右侧弹出 -->
                <van-popup v-model:show="showSearch" position="right" :style="{ width: '100%', height: '100%' }">
                    <!--搜索-->
                    <div class="search_page">
                        <div class="content_search">
                            <span class="back" @click="toBack"></span>
                            <span class="line"></span>
                            <van-field
                                v-model.trim="search.filterStr"
                                :formatter="formatterStr"
                                class="search_input"
                                placeholder="搜索"
                                autocomplete="off"
                                @focus="handleChange"
                            />

                            <span class="input_clear" @click="clearInput"></span>
                            <span class="icon_search" @click="handleChange"></span>
                        </div>
                        <p class="result_p" v-show="search.filters.length">你可能想找</p>
                        <p class="result_p" v-show="isShowNoMore && !search.filters.length">暂无相关游戏</p>
                        <div class="result">
                            <ul class="filter_list">
                                <li
                                    class="item"
                                    v-for="(item, index) in search.filters"
                                    :key="index"
                                    @click="
                                        () => {
                                            clearInput()
                                            playGame(item.url)
                                        }
                                    "
                                >
                                    <img :src="item?.icon" />
                                    <span class="name van-ellipsis">{{ item?.title }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </van-popup>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "search.scss";
.ptgame-page {
    .third_game_jump {
        &.pt_real {
            // height: 100%;
            // overflow-x: hidden;
            // overflow-y: scroll;
            .pt_game_banner {
                position: relative;
                width: 100%;
                height: 1.48rem;
                transition: opacity 0.5s;
                opacity: 1;

                &::before {
                    content: "";
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    background: url("@/assets/img/ptgame/ptbanner.jpg") no-repeat;
                    background-size: 100% 100%;
                }
                .pool {
                    padding: 0.16rem 0.2rem;
                    min-width: 2rem;
                    width: fit-content;
                    position: absolute;
                    height: 0.56rem;
                    background: url("@/assets/img/ptgame/prize_pool.png") no-repeat;
                    background-size: 100% 100%;
                    top: 50%;
                    left: 50%;
                    transform: translateX(-50%);
                    text-align: center;
                    font-size: 0.16rem;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    line-height: normal;
                    span {
                        text-shadow: 0 0 5px #fff, 0 0 10px #25ffff, 0 0 15px #25ffff, 0 0 20px #25ffff, 0 0 35px #25ffff;
                        line-height: 0.16rem;
                        margin-top: 0.02rem;
                        white-space: nowrap;
                    }
                    .pool_t {
                        font-size: 0.12rem;
                    }
                }
            }
            .main_content_box {
                background-image: url("@/assets/img/ptgame/bg.jpg");
                min-height: calc(100vh - 270px);
                min-height: calc(var(--vh) * 100 - 270px);
                &.fixed {
                    position: fixed;
                    z-index: 3;
                    top: 0.46rem;
                    height: 100%;
                    width: 100%;
                    overflow: hidden;
                }
            }
            .content_header {
                padding: 0 0.2rem;
                width: 100%;
                height: 0.53rem;
                display: flex;
                align-items: center;
                background-color: #022488;
                .content_tabs {
                    width: 100%;
                    .tab_item {
                        padding: 0.094rem 0;
                        cursor: pointer;
                        display: inline-block;
                        width: 0.5rem;
                        height: 0.36rem;
                        font-size: 0.12rem;
                        text-align: center;
                        color: #25ffff;
                        background: url("@/assets/img/ptgame/type.png") no-repeat;
                        background-size: 100% 100%;
                        transition: background 0.3s;
                        &.actived,
                        &:active {
                            color: #011f81;
                            background: url("@/assets/img/ptgame/type_hover.png") no-repeat;
                            background-size: 100% 100%;
                        }
                        .icon_search {
                            margin-top: -0.03rem;
                        }
                    }
                }
            }

            .notice_box {
                width: 100%;
                height: 0.24rem;
                background-color: #022488;
                border-top: 1px solid rgba(26, 182, 182, 0.6);
            }
            .notice {
                width: 100%;
                padding: 0;
                height: 0.24rem;
                background-color: #022488;
                span {
                    margin-right: 0.2rem;
                    font-size: 0.12rem;
                    line-height: 0.24rem;
                }
            }
            .content_list {
                width: 100%;
                padding: 0.15rem 0.12rem 0.2rem;
                &.fiexh {
                    height: calc(100% - 1.3rem);
                    overflow-x: hidden;
                    overflow-y: auto;
                }
                .empty_list {
                    height: 1rem;
                    line-height: 1rem;
                    text-align: center;
                    font-size: 0.16rem;
                    color: #c3c3c3;
                }
                &::after {
                    content: "";
                    display: block;
                    clear: both;
                    height: 0px;
                    font-size: 1px;
                    line-height: 0px;
                }
                .list_item {
                    cursor: pointer;
                    text-align: center;
                    float: left;
                    width: 1.085rem;
                    height: 0.87rem;
                    margin-right: 0.12rem;
                    margin-bottom: 0.08rem;
                    position: relative;
                    &:nth-child(3n) {
                        margin-right: 0;
                    }
                    .hover_border {
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 1;
                        width: 100%;
                        height: 100%;
                        background: url("@/assets/img/ptgame/list.png") no-repeat;
                        background-size: 100% 100%;
                        transition: background 0.3s;
                        &:active {
                            background: url("@/assets/img/ptgame/list_hover.png") no-repeat;
                            background-size: 100% 100%;
                            pointer-events: none;
                        }
                    }

                    .btn_mark {
                        display: inline-block;
                        cursor: pointer;
                        position: absolute;
                        z-index: 5;
                        top: 0.03rem;
                        right: 0.05rem;
                        width: 0.3rem;
                        height: 0.3rem;
                        transition: background 0.3s;
                        background: url("@/assets/img/ptgame/collect_icon.png") no-repeat center;
                        background-size: 0.185rem 0.16rem;
                        &:active,
                        &.actived {
                            background: url("@/assets/img/ptgame/collect_icon_hover.png") no-repeat center;
                            background-size: 0.185rem 0.16rem;
                        }
                    }
                    .img_box {
                        width: 0.965rem;
                        height: 0.56rem;
                        text-align: center;
                        position: relative;
                        margin: 0.05rem auto 0;
                    }
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    .game_name {
                        width: 0.965rem;
                        padding: 0 0.05rem;
                        transform: scale(0.9);
                        margin-top: 0.05rem;
                        line-height: 1;
                        display: inline-block;
                        font-size: 0.12rem;
                        color: #ffffff;
                    }
                }
            }
        }
    }
}
</style>
