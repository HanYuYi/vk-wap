<script setup lang="ts">
import allNavImg from "@/assets/img/template/july/youhui/nav/0.png"
import allNavAcImg from "@/assets/img/template/july/youhui/nav/0-active.png"
import allImg from "@/assets/img/template/july/youhui/all-icon.png"
import allAcImg from "@/assets/img/template/july/youhui/all-icon-hover.png"
import esImg from "@/assets/img/template/july/youhui/esports-icon.png"
import esAcImg from "@/assets/img/template/july/youhui/esports-icon-hover.png"
import sporImg from "@/assets/img/template/july/youhui/sports-icon.png"
import sporsAcImg from "@/assets/img/template/july/youhui/sports-icon-hover.png"
import casinoImg from "@/assets/img/template/july/youhui/casino-icon.png"
import casinoAcImg from "@/assets/img/template/july/youhui/casino-icon-hover.png"
import pokerImg from "@/assets/img/template/july/youhui/poker-icon.png"
import pokerAcImg from "@/assets/img/template/july/youhui/poker-icon-hover.png"
import slotImg from "@/assets/img/template/july/youhui/slot-icon.png"
import slotAcImg from "@/assets/img/template/july/youhui/slot-icon-hover.png"
import otherImg from "@/assets/img/template/july/youhui/other-icon.png"
import otherAcImg from "@/assets/img/template/july/youhui/other-icon-hover.png"

import useClipboard from "vue-clipboard3"
import { animateCSS, useMarquee } from "@/composable/util"
import { ref, computed, watch, nextTick, onUnmounted } from "vue"
import { useSysStore } from "@/stores/system"
import { useFreshStore } from "@/stores/fresh"
import { useToggle } from "@vant/use"
import ApiSetting from "@/api/service"
import { HttpPlus } from "@/api/HttpPlus"
import { useRouter } from "vue-router"
import { usePlaceImg } from "@/utils/globalImgs"
import { showToast } from "vant"
import type { ActiveGetUserJoinStatus } from "@/api/pojo/active/ActiveGetUserJoinStatus"
import type { ActiveIndex, Data } from "@/api/pojo/active/ActiveIndex"

const { toClipboard } = useClipboard()

const doCopy = async (x: number): Promise<void> => {
    let url = ""
    if (x === 1) {
        url = seoData.value.seoUrl
    }
    if (x === 2) {
        url = seoData.value.seo_key
    }
    if (url) {
        try {
            await toClipboard(url)
            showToast({ className: "vk-toast-success", message: "复制成功", icon: "checked" })
        } catch (e: unknown) {
            throw e
        }
    }
}

const systemParams = useSysStore()
const { lazyYHImg, GrayAvatar } = usePlaceImg()
const router = useRouter()
const freshStore = useFreshStore()

// 计算跑马灯过渡时间，速度默认是90
const { marqueeDuration } = useMarquee(150)

const [showCategory, toggle] = useToggle(false)

const changeCateShow = () => {
    toggle()
}

interface TypeArr {
    id: number
    title: string
    code: string
    icon: string
    activeIcon: string
}
const typeArr = ref<Array<TypeArr>>([
    {
        id: 0,
        title: "全部",
        code: "all",
        icon: allImg,
        activeIcon: allAcImg
    },
    {
        id: 2,
        title: "电竞",
        code: "esports",
        icon: esImg,
        activeIcon: esAcImg
    },
    {
        id: 3,
        title: "体育",
        code: "sports",
        icon: sporImg,
        activeIcon: sporsAcImg
    },
    {
        id: 4,
        title: "真人",
        code: "casino",
        icon: casinoImg,
        activeIcon: casinoAcImg
    },
    {
        id: 5,
        title: "棋牌",
        code: "poker",
        icon: pokerImg,
        activeIcon: pokerAcImg
    },
    {
        id: 6,
        title: "电玩",
        code: "slot",
        icon: slotImg,
        activeIcon: slotAcImg
    },
    {
        id: 7,
        title: "其它",
        code: "other",
        icon: otherImg,
        activeIcon: otherAcImg
    }
])

const TAGS_LIST = [
    "充值奖",
    "复活金",
    "加码金",
    "新手礼",
    "投注奖",
    "会员奖",
    "领V币",
    "推荐奖",
    "转运金",
    "签到奖",
    "饰品奖",
    "幸运金"
]

const winPrizeData = ref<ActiveIndex["prize_list"]>([])

// 弹窗中大分类高亮索引
const topIndex = ref(0)
// 活动列表
const listLoading = ref(false)
const list = ref<Array<Data>>([])
const seoData = ref<Partial<ActiveGetUserJoinStatus["seo"]>>({})

type CurTopType = ActiveIndex["show_lists"][number]

const curTopType = computed<CurTopType>(() => topTypeList.value[topIndex.value])

const topTypeList = ref<Array<CurTopType>>([
    {
        id: 0,
        title: "全部优惠",
        icon: allNavImg,
        activeIcon: allNavAcImg
    }
])

// 小分类, 0 全部，2 电竞 3 体育 4 真人 5 棋牌 6 电玩 7 其他
const curType = ref<number>(0)

watch(curType, async (val, oldVal): Promise<void> => {
    if (typeof oldVal == "number" && typeof val == "number") {
        await nextTick()
        animateCSS(".van-tab--active", "animate-bounce-in")
    }
})

// 小分类展示
const chooseType = computed<Array<Omit<TypeArr, "id">>>(() => {
    const childKeyList: TypeArr["id"][] = typeArr.value.map((item: TypeArr) => item.id)

    const _childMenuId = new Set<number>()
    _childMenuId.add(0)
    TopList.value.forEach((item: Data) => {
        item._type_arr.forEach((num: Data["_type_arr"][number]) => {
            if (childKeyList.includes(num)) {
                _childMenuId.add(num)
            }
        })
    })

    const arr: Array<Omit<TypeArr, "id">> = []

    typeArr.value.forEach((type: TypeArr) => {
        if ([..._childMenuId].indexOf(type.id) !== -1) {
            arr.push(type)
        }
    })
    return arr
})

// 根据当前顶部的分类过滤出所有活动,
const TopList = computed<Array<Data>>(() => {
    return curTopType.value.id === 0
        ? list.value
        : list.value.filter((item: Data) => item._status_arr.includes(curTopType.value.id))
})

// 从顶部的活动中过滤中符合的类型, 0 全部，2 电竞 3 体育 4 真人 5 棋牌 6 电玩 7 其他
const chooseList = computed<Array<Data>>(() => {
    return curType.value === 0 ? TopList.value : TopList.value.filter((item: Data) => item._type_arr.includes(curType.value))
})

// 获取用户参与每个活动的状态
const getUserJoinStatus = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.active.getUserJoinStatus)
    const res = await HttpPlus.sendHttpRequest<ActiveGetUserJoinStatus>()

    const { status, data } = res
    if (status === 1 && data) {
        seoData.value = data.seo

        if (data.active.length) {
            list.value.forEach((item: Data) => {
                data.active.forEach((aItem: ActiveGetUserJoinStatus["active"][number]) => {
                    if (item.active_id == aItem.active_id) {
                        item.user_status = aItem.status
                        // 用户参与状态join_status  0:未登录 1：可参与；2未领取；3：已领取
                        if (!isRollActive(item)) {
                            if (item.user_status == 2) {
                                item.user_status_tips = "大奖等你来拿"
                            }
                            if (item.user_status == 3) {
                                item.user_status_tips = "分享拿奖励"
                            }
                        }
                    }
                })
            })
        }
    }
}

// 是否是Roll活动
const isRollActive = (item: Data): boolean => {
    return item.url == "/roll" && item.active_id == 0
}

const init = async (): Promise<void> => {
    listLoading.value = true
    systemParams.PageLoading = true

    HttpPlus.setUrlOptions(ApiSetting.active.getActiveList)
    const res = await HttpPlus.sendHttpRequest<ActiveIndex>()

    listLoading.value = false
    systemParams.PageLoading = false

    if (res.status === 1 && res.data) {
        const { prize_list, show_lists, type_lists, data } = res.data

        // 中奖用户
        if (prize_list) {
            winPrizeData.value = prize_list
        }

        // 顶部大分类
        if (show_lists) {
            if (topTypeList.value.length <= 1) {
                for (const row of show_lists) {
                    row.id = Number(row.status)
                    row.icon = new URL(`../assets/img/template/july/youhui/nav/${row.status}.png`, import.meta.url).href
                    row.activeIcon = new URL(
                        `../assets/img/template/july/youhui/nav/${row.status}-active.png`,
                        import.meta.url
                    ).href
                    delete row.status
                    topTypeList.value.push(row)
                }
            }
        }

        // 小分类
        if (type_lists) {
            const haveTypeList: string[] = Object.keys(type_lists)
            haveTypeList.push("0")
            typeArr.value = typeArr.value.filter((type) => haveTypeList.indexOf(type.id.toString()) != -1)
        }

        if (data) {
            list.value = data
            if (data.length) {
                data.forEach((item: Data) => {
                    // 将一级筛选字段status 和 二级筛选字段格式化为 number[]
                    const status: string = item.status.toString().replace(/\s+/g, "")

                    item._status_arr = status.length
                        ? status.split(",").map((num: number | string) => Number.parseInt(num.toString()))
                        : [0]

                    item._type_arr = item.type
                        .toString()
                        .replace(/\s+/g, "")
                        .split(",")
                        .map((num: number | string) => Number.parseInt(num.toString()))

                    item._label_id = TAGS_LIST.indexOf(item.prize_type.trim()) + 1
                    // 用户参与状态join_status  0:未登录 1：可参与；2未领取；3：已领取
                    if (!isRollActive(item)) {
                        item.user_status_tips = "立即参与"
                    }
                })
            }
        }

        if (systemParams.isLogin) {
            getUserJoinStatus()
        }
    }
}

// 头部下拉框 选择
const selectTopType = (index: number): void => {
    listLoading.value = true
    topIndex.value = index
    toggle(false)
    curType.value = 0
}

// 活动状态标签，0 不显示，1 即将开始 2 新 3 即将结束 4 已结束
const activeStatusText = (tag: number) => {
    const tagList = ["", "即将开始", "最新", "即将结束", "已结束"]
    return tagList[tag]
}

/**
 * 下拉刷新
 */
const onRefresh = async (): Promise<void> => {
    try {
        await init()
        freshStore.refreshLoading = false
    } catch (error) {
        freshStore.refreshLoading = false
    }
}

// 推荐弹窗
const showRecommend = ref<boolean>(false)

// 跳转活动内页 或者推荐奖励
const handleJumpToActivePage = (data: Data, type: number): void => {
    // type 1：从图片点击  2：从文字点击, status: 3 新人
    if (systemParams.isLogin && data.user_status == 3 && type == 2) {
        showRecommend.value = true
    } else {
        if (data.url) {
            router.push({ path: data.url })
        }
    }
}

init()

// 组件卸载后，下拉刷新和懒加载组件的状态重置
onUnmounted(() => {
    freshStore.$reset()
})
</script>

<template>
    <div class="discovery-page">
        <HeaderBar>
            <div class="hstack" @click="changeCateShow">
                <div class="header_title">{{ curTopType?.title }}</div>
                <div class="arrow-icon-down" :class="{ 'arrow-icon-up': showCategory }"></div>
            </div>
            <div v-show="showCategory" class="discoveryTypePopup van-hairline--top">
                <div class="mask" @click="toggle(false)"></div>
                <transition name="van-slide-down">
                    <div class="pop-wrapper flex flex-wrap relative" v-show="showCategory">
                        <div
                            class="list_box hstack flex-col text-primary-text"
                            v-for="(item, index) in topTypeList"
                            :key="index"
                            :class="{ selected: item.id === curTopType.id }"
                            @click="selectTopType(index)"
                        >
                            <div class="nav-icon-wrapper w-53px h-53px flex-center">
                                <img
                                    class="nav-icon w-22px h-22px"
                                    :class="`nav-icon-${item.id}`"
                                    :src="item.id === curTopType.id ? item.activeIcon : item.icon"
                                    alt=""
                                />
                            </div>
                            <div class="nav-name">{{ item.title }}</div>
                        </div>
                    </div>
                </transition>
            </div>
        </HeaderBar>
        <div class="expand-page discovery_nav w-full relative bg-white z-1">
            <van-tabs
                animated
                sticky
                offset-top="0.44rem"
                :ellipsis="false"
                v-model:active="curType"
                class="discovery-tabs"
                :class="{ 'disco-tabs-less': chooseType.length < 5 }"
            >
                <van-tab v-for="(item, index) in chooseType" :key="index" :name="item.id">
                    <template #title>
                        <img
                            v-if="item.code"
                            class="tab-icon w-22px h-22px"
                            :class="`tab-icon-${item.code}`"
                            :src="item.icon"
                            alt=""
                        />
                        <div v-if="item.code" class="tab-icon-active-wrapper mb-4px">
                            <img class="tab-icon-active" :class="`tab-icon-active-${item.code}`" :src="item.activeIcon" alt="" />
                        </div>
                        <div class="leading-none">{{ item.title }}</div>
                    </template>
                    <PullRefresh @on-refresh="onRefresh">
                        <!-- 活动列表 -->
                        <div class="discovery_list w-full pt-8px px-14px pb-74px m-auto">
                            <div
                                v-for="(item, index) in chooseList"
                                :key="index"
                                class="discovery_box m-auto bg-white"
                                :class="{ rollbg: isRollActive(item) }"
                            >
                                <div
                                    class="active_img"
                                    v-lazy-container="{
                                        selector: 'img',
                                        error: lazyYHImg,
                                        loading: lazyYHImg
                                    }"
                                    @click="handleJumpToActivePage(item, 1)"
                                >
                                    <img :data-src="item.img" />
                                    <div v-if="item._label_id && !isRollActive(item)" class="label_box">
                                        <div class="viplabel" :class="`viplabel-${item._label_id}`">
                                            {{ item.prize_type }}
                                        </div>
                                    </div>
                                    <!-- time-tag 0: 不显示 1: 即将开始， 2：新 3： 即将结束  4： 已结束 -->
                                    <div
                                        v-if="item.time_tag > 0"
                                        class="active-status-box"
                                        :class="`status-box-${item.time_tag}`"
                                    >
                                        {{ activeStatusText(Number(item.time_tag)) }}
                                    </div>
                                    <div class="isvip-block flex-center" v-if="item.is_vip && !isRollActive(item)">
                                        <div class="icon-img"></div>
                                    </div>
                                </div>

                                <div class="list_con" v-if="!isRollActive(item)">
                                    <div class="active-title van-ellipsis" :class="{ 'text-hidden': !item.title }">
                                        {{ item.title ? item.title : "活动标题" }}
                                    </div>
                                    <div class="hstack justify-between">
                                        <div class="active-timer-wrapper">
                                            <div class="time-icon"></div>
                                            <span>{{ item.show_time }}</span>
                                        </div>
                                        <div @click="handleJumpToActivePage(item, 2)" class="actice-desc">
                                            {{ item.user_status_tips }}&gt;&gt;
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PullRefresh>
                </van-tab>
            </van-tabs>
            <Vue3Marquee
                class="disco-reward-marquee absolute top-66px h-40px"
                :delay="1"
                :pauseOnClick="true"
                :duration="marqueeDuration"
            >
                <div
                    v-for="(item, index) in winPrizeData"
                    :key="index"
                    class="win_prize_tip text-white bg-old-text leading-none py-3px pl-3px pr-15px hstack select-none"
                >
                    <img
                        class="avatar"
                        v-lazy="{
                            src: item.head_image,
                            error: GrayAvatar,
                            loading: GrayAvatar
                        }"
                        alt=""
                    />
                    <div>
                        <span style="color: #fde9aa">{{ item.username }}</span>
                        <span>{{ item.desc }}</span>
                        <span style="color: #ff3f3f">{{ item.prize }}</span>
                    </div>
                </div>
            </Vue3Marquee>
        </div>
        <!--推荐奖励弹窗-->
        <van-dialog
            teleport="body"
            v-model:show="showRecommend"
            :show-confirm-button="false"
            className="home-diolog discovery_recom_diolog"
        >
            <div class="recom_box">
                <div class="bonus-wrapper">
                    <div class="flex-center">
                        <div class="left">最高领¥</div>
                        <div class="num">{{ seoData?.seo_bonus }}</div>
                    </div>
                    <div class="desc">被邀请的用户成功存款后</div>
                </div>
                <div class="qrcode-wrapper">
                    <img class="qrcode-img" :src="seoData?.showQrcode" alt="" />
                </div>
                <div class="invite-wrapper">
                    <div class="desc">专属邀请码</div>
                    <div class="invite-code" @click="doCopy(2)">
                        {{ seoData?.seo_key }}
                    </div>
                </div>
                <div class="botom-btn-wrapper">
                    <div class="btn-block" @click="doCopy(1)">复制链接分享</div>
                </div>
            </div>
            <div class="close-icon" @click="showRecommend = false"></div>
        </van-dialog>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/style/danmu.scss";

.discovery_recom_diolog {
    .recom_box {
        width: 3.665rem;
        height: 5.01rem;
        background: url("@/assets/img/template/july/youhui/dialog/bg.png") no-repeat center;
        background-size: 100% 100%;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;

        .bonus-wrapper {
            margin-top: 0.5rem;
            line-height: 1;

            .left {
                width: 0.44rem;
                font-size: 0.2rem;
                font-weight: 600;
                line-height: 1.15;
                text-align: center;
                color: #ee3f24;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                background-image: linear-gradient(to top, #a81000, #ff3114), linear-gradient(to bottom, #ee3f24, #ee3f24);
            }

            .num {
                font-size: 0.69rem;
                font-weight: 600;
                text-align: center;
                color: #ee3f24;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                background-image: linear-gradient(to top, #a81000, #ff3114), linear-gradient(to bottom, #ee3f24, #ee3f24);
            }

            .desc {
                display: block;
                text-align: center;
                color: #b9361e;
                font-size: 0.14rem;
                font-weight: 600;
                margin-top: 0.02rem;
            }
        }

        .qrcode-wrapper {
            width: 100vw;
            text-align: center;
            margin-top: 0.53rem;

            img {
                display: block;
                margin: auto;
                width: 1.55rem;
                height: 1.55rem;
            }
        }

        .invite-wrapper {
            width: 100vw;
            line-height: 1;
            text-align: center;

            .desc {
                font-size: 0.14rem;
                font-weight: 600;
                color: #6c0006;
                margin-top: 0.15rem;
                margin-bottom: 0.075rem;
            }

            .invite-code {
                margin: auto;
                width: fit-content;
                font-size: 0.3rem;
                font-weight: 600;
                color: #ffebd1;
                position: relative;

                &::after {
                    content: "";
                    position: absolute;
                    top: 0.1rem;
                    right: -0.3rem;
                    width: 0.16rem;
                    height: 0.16rem;
                    background: url("@/assets/img/template/july/youhui/dialog/copy.png") no-repeat center;
                    background-size: 100% 100%;
                }
            }
        }

        .botom-btn-wrapper {
            width: 100vw;
            text-align: center;

            .btn-block {
                display: block;
                margin: 0.08rem auto 0;
                width: 2.67rem;
                height: 0.72rem;
                background: url("@/assets/img/template/july/youhui/dialog/btn-bg.png") no-repeat center;
                background-size: 100% 100%;
                line-height: 0.71rem;
                text-align: center;
                color: #6c0006;
                font-size: 0.18rem;
                font-weight: 600;
            }
        }
    }

    .close-icon {
        margin: 0.16rem auto 0;
        width: 0.285rem;
        height: 0.28rem;
        background: url("@/assets/img/template/july/youhui/close.png") no-repeat center;
        background-size: 100% 100%;
        position: relative;
        left: 4px;
    }
}
.com-header {
    .arrow-icon-down {
        margin-left: 6px;
        width: 9px;
        height: 6.5px;
        background: url("@/assets/img/template/july/youhui/arrow.jpg") no-repeat center;
        background-size: 100% 100%;
        transform-origin: 50% 50%;
        transition: all 0.3s;
        &.arrow-icon-up {
            transform: rotate(180deg);
        }
    }
}
.discoveryTypePopup {
    z-index: 11;
    height: calc(100vh - 44px);
    position: absolute;
    pointer-events: all;
    overflow: hidden;
    top: 44px;
    left: 0;
    width: 100%;
    font-size: 15px;
    color: var(--vk-old-text-color);
    .mask {
        background: rgba(0, 0, 0, 0.8);
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .pop-wrapper {
        width: 100%;
        background-color: #ffffff;
        padding-bottom: 16px;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        &.van-hairline--top {
            &::after {
                border-color: #ebedf0;
            }
        }
        .list_box {
            flex: 0 0 25%;
            width: 100%;
            line-height: 1;
            text-align: center;
            box-sizing: border-box;
            margin-top: 12px;
            margin-bottom: 3.5px;
            &.selected {
                font-weight: 600;

                .nav-icon-wrapper {
                    border-color: #222;
                    background-color: var(--vk-primary-green);
                }
            }
            .nav-icon-wrapper {
                border: solid 1.5px #ebebeb;
                border-radius: 50%;
                margin-bottom: 8px;

                // 全部
                .nav-icon-0 {
                    width: 22.5px;
                    height: auto;
                }

                // VIP
                .nav-icon-1 {
                    width: 22.5px;
                    height: 20.5px;
                }

                // 充提
                .nav-icon-4 {
                    width: 22.5px;
                    height: 18px;
                }

                // 投注
                .nav-icon-5 {
                    width: 21.5px;
                }

                // 日常
                .nav-icon-5 {
                    height: 21px;
                }

                // 热门
                .nav-icon-8 {
                    height: 24px;
                }
            }
        }
    }
}
.discovery_nav {
    :deep(.discovery-tabs) {
        .van-tabs__wrap {
            height: 60px;
            border-bottom: solid 1px #e1e1e1;
            .van-tabs__line {
                background: transparent;
            }
            .van-tabs__nav--line {
                padding-left: 0;
                padding-right: 0;
            }
            .van-tab {
                flex: 0 0 20.55%;
                .tab-icon-active-wrapper {
                    display: none;
                }
                &.van-tab--active {
                    color: #222;
                    .tab-icon {
                        display: none;
                    }
                    .van-tab__text {
                        margin-top: -4px;
                    }
                    .tab-icon-active-wrapper {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        border: solid 1px #222;
                        background-image: linear-gradient(to bottom, #07f1b7, #07f1b7), linear-gradient(to top, #07f1b7, #dffdb4);
                    }
                }
                .van-tab__text {
                    text-align: center;
                }
            }
        }
        .tab-icon {
            &.tab-icon-esports {
                height: 21px;
            }

            &.tab-icon-poker {
                width: 21px;
            }
        }
        .tab-icon-active {
            width: 13px;
            height: 13px;
            display: block;

            &.tab-icon-active-esports {
                width: 14px;
                height: 12.5px;
            }

            &.tab-icon-active-poker {
                width: 13.5px;
                position: relative;
                left: 0.5px;
            }

            &.tab-icon-active-other {
                width: 14px;
                height: 13.5px;
            }

            &.tab-icon-active-slot {
                position: relative;
                left: 1px;
            }
        }
    }
    .disco-tabs-less {
        :deep(.van-tabs__wrap) {
            .van-tab {
                flex: 0 0 20%;
            }
        }
    }
}

.discovery_list {
    .discovery_box {
        width: 100%;
        padding-bottom: 10px;
        margin-bottom: 8px;
        border-radius: 10px;
        box-shadow: 0px 4px 16px 0 rgba(0, 0, 0, 0.1);
        &.rollbg {
            padding-bottom: 0;

            .active_img {
                border-radius: 10px;
                height: 108px;
            }
        }
        .active_img {
            height: 125px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;

            img {
                width: 100%;
                height: 100%;
                border-radius: inherit;
            }

            .label_box {
                position: absolute;
                right: -8px;
                bottom: -45px;

                .viplabel {
                    width: 83px;
                    height: 41px;
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    background-position: center;
                    font-size: 13px;
                    font-weight: bold;
                    line-height: 30px;
                    color: #fff;
                    text-align: center;

                    &.viplabel-1 {
                        background-image: url("@/assets/img/template/july/youhui/active-1.png");
                    }

                    &.viplabel-2 {
                        background-image: url("@/assets/img/template/july/youhui/active-2.png");
                    }

                    &.viplabel-3 {
                        background-image: url("@/assets/img/template/july/youhui/active-3.png");
                    }

                    &.viplabel-4 {
                        background-image: url("@/assets/img/template/july/youhui/active-4.png");
                    }

                    &.viplabel-5 {
                        background-image: url("@/assets/img/template/july/youhui/active-5.png");
                    }

                    &.viplabel-6 {
                        background-image: url("@/assets/img/template/july/youhui/active-6.png");
                    }

                    &.viplabel-7 {
                        background-image: url("@/assets/img/template/july/youhui/active-7.png");
                    }

                    &.viplabel-8 {
                        background-image: url("@/assets/img/template/july/youhui/active-8.png");
                    }

                    &.viplabel-9 {
                        background-image: url("@/assets/img/template/july/youhui/active-9.png");
                    }

                    &.viplabel-10 {
                        background-image: url("@/assets/img/template/july/youhui/active-10.png");
                    }

                    &.viplabel-11 {
                        background-image: url("@/assets/img/template/july/youhui/active-11.png");
                    }

                    &.viplabel-12 {
                        background-image: url("@/assets/img/template/july/youhui/active-12.png");
                    }
                }
            }

            .active-status-box {
                position: absolute;
                right: 6.5px;
                top: 5.5px;
                width: 65px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                border-radius: 10px;
                background: rgba(0, 0, 0, 0.8);
                font-size: 12px;

                &.status-box-1 {
                    color: #fff;
                }

                &.status-box-2 {
                    color: #07f1b7;
                }

                &.status-box-3 {
                    color: #ff3a3d;
                }

                &.status-box-4 {
                    color: rgba(255, 255, 255, 0.5);
                }
            }

            .isvip-block {
                position: absolute;
                top: 5.5px;
                left: 5.5px;
                width: 20px;
                height: 20px;
                background-color: rgba(0, 0, 0, 0.5);
                border-radius: 4px;

                .icon-img {
                    width: 14px;
                    height: 14px;
                    background: url("@/assets/img/template/july/youhui/vip.png") no-repeat center;
                    background-size: 100% 100%;
                }
            }
        }

        .list_con {
            padding: 0 12.5px;
            margin-top: 6px;
            color: #7c839f;
            position: relative;

            .active-title {
                color: #333;
                font-size: 18px;
                font-weight: bold;
                max-width: 260px;
                line-height: 1.6;
            }

            .actice-desc {
                font-size: 14px;
                color: #919ab0;
                max-width: 100%;
                position: relative;
                top: 7px;
            }

            .active-timer-wrapper {
                width: fit-content;
                margin-top: 2px;
                border: solid 1px #c3c3c3;
                box-sizing: border-box;
                padding: 4px 8px 4px 4px;
                border-radius: 5px;
                display: flex;
                align-items: center;

                .time-icon {
                    width: 19px;
                    height: 19px;
                    background: url("@/assets/img/template/july/youhui/time-icon.png") no-repeat center;
                    background-size: 100% 100%;
                }

                span {
                    line-height: 1;
                    font-size: 14px;
                    color: #000;
                    margin-left: 4px;
                }
            }
        }
    }
}
</style>
