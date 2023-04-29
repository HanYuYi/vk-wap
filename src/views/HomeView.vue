<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, nextTick, watch } from "vue"
import type { ComputedRef, Ref } from "vue"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { useSysStore } from "@/stores/system"
import { useWalletStore } from "@/stores/wallet"
import ApiSetting from "@/api/service"
import { HttpPlus } from "@/api/HttpPlus"
import { useStartGame, useMarquee } from "@/composable/util"
import { Autoplay } from "swiper"
import { usePlaceImg } from "@/utils/globalImgs"
import type DialogHomeNotice from "@/components/dialog/DialogHomeNotice.vue"
import DialogHotGame from "@/components/dialog/DialogHotGame.vue"
import BuoyAside from "@/components/BuoyAside.vue"
import type { GameItem, IndexIndexV2 } from "@/api/pojo/IndexIndexV2"
import type { IndexGetHotGame } from "@/api/pojo/IndexGetHotGame"

// 这里使用了await后，组件自动变为异步依赖，Suspense会在结果响应前自动展示fallback插槽里面的LoadingView

const router: Router = useRouter()
const systemParams: ReturnType<typeof useSysStore> = useSysStore()
const walletStore: ReturnType<typeof useWalletStore> = useWalletStore()
const { GameCardError } = usePlaceImg()

watch(
    () => systemParams.isLogin,
    (val?: boolean) => {
        if (val) {
            walletStore.loadMoney("NM")
        }
    }
)

// 接口banner数据
let bannerList = ref<IndexIndexV2["banner"] | null>(null) // 轮播

/**
 * 跑马灯公告
 */
// 计算跑马灯过渡时间，速度默认为90
const { marqueeDuration }: { marqueeDuration: ComputedRef<number> } = useMarquee()
// 接口跑马灯数据
let noticeList = ref<IndexIndexV2["notice"]>(null)
const selectNotice = ref<Partial<IndexIndexV2["notice"][0]>>({})
const NoticeRef = ref<InstanceType<typeof DialogHomeNotice> | null>(null)

// 点击单条公告查看详情
const toNoticeDio = (notice: Partial<IndexIndexV2["notice"][0]>): void => {
    if (!Object.keys(notice).length) return

    selectNotice.value = notice
    systemParams.appRootBlur = true
    NoticeRef.value.show = true
}

/**
 * 热门赛事功能
 */
type IndexGetHotGameItem = IndexGetHotGame["data"]
// 接口热门赛事数据
let hotGame: IndexGetHotGameItem = []
// 热门赛事弹窗组件Ref
const HotGameRef: Ref<{ show: boolean; hotTabIndex: number } | null> = ref(null)
// 打开热门赛事弹窗
const toHotDio = (): void => {
    systemParams.appRootBlur = true
    HotGameRef.value.show = true
}

/**
 * 中间账户功能区
 */
const JUMP_ARR = [
    {
        key: "deposit",
        label: "充值",
        icon: new URL(`../assets/img/template/july/home/user_center_deposit.png`, import.meta.url).href,
        path: "/finance/deposit"
    },
    {
        key: "transfer",
        label: "转账",
        icon: new URL(`../assets/img/template/july/home/user_center_transfer.png`, import.meta.url).href,
        path: "/finance"
    },
    {
        key: "withdraw",
        label: "提款",
        icon: new URL(`../assets/img/template/july/home/user_center_withdraw.png`, import.meta.url).href,
        path: "/finance/withdraw"
    },
    {
        key: "vip",
        label: "VIP",
        icon: new URL(`../assets/img/template/july/home/user_center_vip.png`, import.meta.url).href,
        path: "/vipsystem"
    }
]
const jump = (item: { path: string }): void => {
    router.push({
        path: `${item.path === "/vipsystem" ? item.path : systemParams.isLogin ? item.path : "/login"}`
    })
}

/**
 * 底部游戏功能区
 */
const DEFAULT_MENU = [
    {
        game_title: "电竞",
        icon: new URL(`../assets/img/template/july/home/game/egame.png`, import.meta.url).href,
        activeIcon: new URL(`../assets/img/template/july/home/game/egame-active.png`, import.meta.url).href
    },
    {
        game_title: "体育",
        icon: new URL(`../assets/img/template/july/home/game/sports.png`, import.meta.url).href,
        activeIcon: new URL(`../assets/img/template/july/home/game/sports-active.png`, import.meta.url).href
    },
    {
        game_title: "真人",
        icon: new URL(`../assets/img/template/july/home/game/live.png`, import.meta.url).href,
        activeIcon: new URL(`../assets/img/template/july/home/game/live-active.png`, import.meta.url).href
    },
    {
        game_title: "棋牌",
        icon: new URL(`../assets/img/template/july/home/game/chess.png`, import.meta.url).href,
        activeIcon: new URL(`../assets/img/template/july/home/game/chess-active.png`, import.meta.url).href
    },
    {
        game_title: "电玩",
        icon: new URL(`../assets/img/template/july/home/game/slot.png`, import.meta.url).href,
        activeIcon: new URL(`../assets/img/template/july/home/game/slot-active.png`, import.meta.url).href
    }
]

const recommendedGamesRef = ref<HTMLElement>(null)
const gameScrollRef = ref<HTMLElement>(null)

type GameArr = Array<
    {
        key: string
        icon: string
        activeIcon: string
    } & Pick<GameItem, "game_list">
>
// 游戏数据
const gameArr = ref<GameArr>([])
const currentGameIndex = ref<number>(0)
// 每个游戏在不同设备上面的高度
const realHeight = computed<number>(() => {
    return (312 * (window.innerWidth || document.documentElement.clientWidth)) / 375
})

const changeTab = (i: number): void => {
    currentGameIndex.value = i
    nextTick(() => {
        scrollSmoothTo(gameScrollRef.value, gameScrollRef.value.scrollTop, i * realHeight.value)
    })
}

const scrollSmoothTo = (el: HTMLElement | null, currentTop: number, position: number) => {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            return setTimeout(callback, 17)
        }
    }

    // 滚动step方法
    const step = function (): void {
        // 距离目标滚动距离, 目标位置 - 当前滚动高度
        const distance: number = position - currentTop

        // 目标滚动位置
        currentTop = currentTop + distance / 6
        if (Math.abs(distance) < 1) {
            el.scrollTop = position
        } else {
            el.scrollTop = currentTop
            requestAnimationFrame(step)
        }
    }
    step()
}

const clickGameSwiper = (swiper: unknown, event: Event): void => {
    const target = event.target as HTMLButtonElement

    if (target.dataset.code) {
        const row: { [p: string]: string } = { ...target.dataset }
        toPlayGame({
            is_redirect: Number.parseInt(row.redir),
            is_need_login: Number.parseInt(row.login),
            url: row.url
        })
    }
}

const toPlayGame = (item: { is_redirect: boolean | number; url: string; is_need_login: boolean | number }): void => {
    if (item.is_redirect) {
        // 跳转进入游戏
        const res: boolean = useStartGame(
            {
                url: item.url,
                isNeedLogin: item.is_need_login,
                isCheckName: true,
                changeFlag: systemParams.userInfo.change_flag
            },
            systemParams.isLogin
        )
        if (!res) {
            router.push({ path: "/login" })
        }
    } else {
        router.push({ path: item.url })
    }
}
/*  初始化数据结束 */

// 延迟加载底部，防止ios/chrome滚动后切换顶部/底部位置异常
const delayLoaded = ref<boolean>(false)

// 获取首页数据
type SomeIndexIndexV2 = Omit<IndexIndexV2, "banner" | "is_new_msg" | "notice">

type SomeIndexIndexV2Keys = keyof SomeIndexIndexV2

const getHomeData = async (): Promise<void> => {
    try {
        systemParams.PageLoading = true
        HttpPlus.setUrlOptions(ApiSetting.home.getHomeData)
        const res = await HttpPlus.sendHttpRequest<IndexIndexV2>()
        systemParams.PageLoading = false
        delayLoaded.value = true

        if (res.status === 1) {
            const { data } = res

            // 设置站内信小红点是否展示
            systemParams.isShowZNXBadge = res.data.is_new_msg

            // 设置banner
            if (data.banner?.length) {
                data.banner.forEach((v: any) => {
                    v.img = v.image_path
                    v.url = v.wap_url
                })
                bannerList.value = data.banner
            }

            // 设置滚动通知
            if (data.notice?.length) {
                noticeList.value = data.notice
            }

            // 设置首页游戏
            const keyList = Object.keys(data) as SomeIndexIndexV2Keys[]
            const gameKeysArr: SomeIndexIndexV2Keys[] = keyList.filter((key) => !["banner", "is_new_msg", "notice"].includes(key))

            gameArr.value = gameKeysArr.map((key) => {
                if (key && key in data) {
                    const gameList: GameItem = data[key as SomeIndexIndexV2Keys]

                    return Object.assign(
                        {},
                        {
                            key,
                            icon: new URL(`../assets/img/template/july/home/game/${key}.png`, import.meta.url).href,
                            activeIcon: new URL(`../assets/img/template/july/home/game/${key}-active.png`, import.meta.url).href,
                            ...gameList
                        }
                    )
                }
            })

            // 自动选中游戏
            nextTick((): void => {
                if (systemParams.routeParams) {
                    const routeParams = systemParams.routeParams as { gametype: string | number }
                    const gameSelectedIndex: number = +routeParams.gametype
                    if (gameSelectedIndex) {
                        window.scrollTo({
                            top: recommendedGamesRef.value.offsetTop,
                            behavior: "smooth"
                        })
                        changeTab(gameSelectedIndex - 1)
                    }
                }
            })
        }
    } catch (error: unknown) {
        systemParams.PageLoading = false
        setTimeout(() => {
            delayLoaded.value = true
        }, 200)
        throw error
    }
}

// 获取首页热门赛事弹窗的数据
const getHotGame = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.home.getHotGame)
    const res = await HttpPlus.sendHttpRequest<IndexGetHotGameItem>()

    if (res.status === 1 && res.data) {
        const { data } = res
        hotGame = data
        nextTick(() => {
            if (HotGameRef.value) {
                HotGameRef.value.hotTabIndex = data.findIndex((item: IndexGetHotGameItem[0]) => item?.is_select === 1)
            }
        })
    }
}

// 生命周期
onMounted(() => {
    systemParams.setAppDownBar(true)
    if (systemParams.isLogin) {
        walletStore.getUserMoney("NM")
        systemParams.getUserInfo()
    }
})

getHomeData()
getHotGame()

onBeforeUnmount(() => {
    systemParams.routeParams = {}
    systemParams.appRootBlur = false
    systemParams.setAppDownBar(false)
})
</script>

<template>
    <div>
        <AppDown />

        <HeaderBar class="home-header" />

        <div class="home_page relative" :class="{ 'pt-50px': systemParams.isShowAppDownBar }">
            <!-- 轮播 -->
            <BannerJump class="home-swipe h-198px m-auto" :placehold="'banner'" :banner-list="bannerList" />
            <div class="w-full h-198px bg-#e3e3e3 flex-center" v-if="!bannerList">
                <img class="w-154.5px h-31.5px" src="@/assets/defaultimg/july/banner-error.png" alt="" />
            </div>
            <!-- 公告 -->
            <div
                :class="{ 'top-248px': systemParams.isShowAppDownBar }"
                class="home-notice ab-center top-198px w-364px h-34px leading-34px px-8.5px rounded-17px"
                text="second-text"
                bg="#fff"
            >
                <div class="relative h-full" p="l-30px r-93.5px">
                    <div class="notic_title_mark absolute left-3.5px top-8px h-18px w-18px"></div>
                    <Vue3Marquee :delay="1" :pauseOnClick="true" :duration="marqueeDuration">
                        <span
                            @click.stop="toNoticeDio(notice)"
                            v-for="(notice, index) in noticeList"
                            :key="index"
                            class="word-style mx-20px select-none"
                        >
                            {{ notice?.show_cn }}
                        </span>
                    </Vue3Marquee>
                    <div
                        @click.stop="toHotDio"
                        text="13px"
                        bg="#f7fbfd"
                        border="1px #4b566b"
                        class="noti-hotwrapper absolute top-6px right-0 w-82px h-22px hstack rounded-11px"
                    >
                        <div class="hot-icon w-15px h-15px ml-6px mr-1px"></div>
                        <div>热门赛事</div>
                    </div>
                </div>
            </div>
            <div class="home-bottom w-full pt-17px overflow-hidden flex flex-col min-h-469px" v-if="delayLoaded">
                <div class="func-wrapper w-full h-68px flex px-14px">
                    <div style="flex: 0.4" class="vstack flex-col h-full">
                        <template v-if="systemParams.isLogin">
                            <div class="flex font-robot">
                                <div class="normal-text">
                                    {{ systemParams.userInfo.username }}
                                </div>
                                <div class="vip ml-3.9px" :class="`vip${systemParams.userInfo.user_lever}`"></div>
                            </div>
                            <div class="bold-text">
                                <MoneySplit :amount="walletStore.userMoney.NM" />
                            </div>
                        </template>
                        <template v-else>
                            <h3 @click="router.push({ path: '/login' })" class="bold-text">您还未登录</h3>
                            <div @click="router.push({ path: '/login' })" class="normal-text">登录/注册后查看</div>
                        </template>
                    </div>
                    <div style="flex: 0.6" class="hstack justify-between h-full">
                        <div class="text-center" @click="jump(item)" v-for="(item, i) in JUMP_ARR" :key="i">
                            <div
                                :style="`background-image:url(${item.icon})`"
                                class="w-36px h-36px bg-no-repeat bg-center bg-contain"
                            ></div>
                            <div class="text-13px text-primaryText">{{ item.label }}</div>
                        </div>
                    </div>
                </div>
                <div
                    class="game-wrapper w-full rounded-t-26px pl-11.5px bg-white flex flex-1 overflow-hidden"
                    shadow="[inset_0_1px_16px_0_rgba(0,0,0,0.14)]"
                    ref="recommendedGamesRef"
                >
                    <div
                        class="tab-menu mt-12px py-6px w-52px h-312px rounded-26px bg-white hstack justify-between flex-col"
                        shadow="[0_0_12px_0_rgba(0,0,0,0.2)]"
                    >
                        <div
                            class="tab relative w-48px h-60px flex-center"
                            @click="changeTab(i)"
                            :class="{ 'tab-active': currentGameIndex == i }"
                            v-for="(item, i) in gameArr"
                            :key="i + item.key"
                        >
                            <div
                                :style="`background-image:url('${currentGameIndex == i ? item.activeIcon : item.icon}')`"
                                class="tab-icon w-36px h-36px bg-center bg-no-repeat bg-contain"
                            >
                                <div class="tab-label text-12px">{{ item.game_title }}</div>
                            </div>
                        </div>
                        <template v-if="!gameArr.length">
                            <div
                                :class="{ 'tab-active': currentGameIndex == i }"
                                class="tab relative w-48px h-60px flex-center"
                                v-for="(item, i) in DEFAULT_MENU"
                                :key="i"
                            >
                                <div
                                    :style="`background-image:url('${currentGameIndex == i ? item.activeIcon : item.icon}')`"
                                    class="tab-icon w-36px h-36px bg-center bg-no-repeat bg-contain"
                                >
                                    <div class="tab-label text-12px">{{ item.game_title }}</div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="games-content mt-11px flex-1 overflow-hidden h-311px" ref="gameScrollRef">
                        <div
                            class="game-type"
                            :class="[`game-type-${type.game_list.length}`, { 'game-type-many': type.game_list.length > 6 }]"
                            v-for="(type, index) in gameArr"
                            :key="index + type.key"
                        >
                            <!-- 6个以上 -->
                            <template v-if="type.game_list.length > 6">
                                <div
                                    class="game-card"
                                    :style="`background: linear-gradient(to bottom, ${card.bg_color.split(',')[0]}, ${
                                        card.bg_color.split(',')[1]
                                    });`"
                                    @click="toPlayGame(card)"
                                    v-for="(card, ci) in type.game_list.slice(0, 2)"
                                    :key="ci + '2'"
                                >
                                    <div class="jb-layer"></div>
                                    <div class="img" :style="`background-image:url('${card.img}')`"></div>
                                    <div class="game-name">{{ card.title }}</div>
                                    <div class="game-stitle">{{ card.title_sub }}</div>
                                    <div class="hot-label new-label" v-if="card.is_new">最新</div>
                                    <div class="hot-label" v-if="card.is_hot">火热</div>
                                </div>
                                <swiper
                                    class="card-swipe"
                                    :modules="[Autoplay]"
                                    :autoplay="{
                                        delay: 2000,
                                        disableOnInteraction: false
                                    }"
                                    :slidesPerView="'auto'"
                                    :loopedSlides="5"
                                    loop
                                    @click="clickGameSwiper"
                                >
                                    <swiper-slide
                                        :data-redir="card.is_redirect"
                                        :data-url="card.url"
                                        :data-login="card.is_need_login"
                                        :data-code="card.code"
                                        v-for="(card, ci) in type.game_list.slice(2)"
                                        :key="ci + 'more'"
                                        class="game-card game-card-many"
                                    >
                                        <div class="jb-layer" :data-code="card.code"></div>
                                        <div
                                            :data-redir="card.is_redirect"
                                            :data-url="card.url"
                                            :data-login="card.is_need_login"
                                            :data-code="card.code"
                                            class="img"
                                            :style="`background-image:url('${card.img}')`"
                                        ></div>
                                        <div
                                            :data-redir="card.is_redirect"
                                            :data-url="card.url"
                                            :data-login="card.is_need_login"
                                            :data-code="card.code"
                                            class="game-name"
                                        >
                                            {{ card.title }}
                                        </div>
                                        <div
                                            :data-redir="card.is_redirect"
                                            :data-url="card.url"
                                            :data-login="card.is_need_login"
                                            :data-code="card.code"
                                            class="game-stitle"
                                        >
                                            {{ card.title_sub }}
                                        </div>
                                        <div
                                            :data-redir="card.is_redirect"
                                            :data-url="card.url"
                                            :data-login="card.is_need_login"
                                            :data-code="card.code"
                                            class="hot-label new-label"
                                            v-if="card.is_new"
                                        >
                                            最新
                                        </div>
                                        <div
                                            :data-redir="card.is_redirect"
                                            :data-url="card.url"
                                            :data-login="card.is_need_login"
                                            :data-code="card.code"
                                            class="hot-label"
                                            v-if="'is_hot' in card && card.is_hot"
                                        >
                                            火热
                                        </div>
                                    </swiper-slide>
                                </swiper>
                            </template>
                            <!-- 6个及6个以下 -->
                            <template v-else>
                                <div
                                    class="game-card"
                                    :style="`background: linear-gradient(to bottom, ${card.bg_color.split(',')[0]}, ${
                                        card.bg_color.split(',')[1]
                                    });`"
                                    @click="toPlayGame(card)"
                                    :class="[`game-card-${type.game_list.length}`]"
                                    v-for="(card, ci) in type.game_list"
                                    :key="ci"
                                >
                                    <div class="jb-layer"></div>
                                    <div class="img" :style="`background-image:url('${card.img}')`"></div>
                                    <div class="game-name">{{ card.title }}</div>
                                    <div class="game-stitle">{{ card.title_sub }}</div>
                                    <div class="hot-label new-label" v-if="card.is_new">最新</div>
                                    <div class="hot-label" v-if="card.is_hot">火热</div>
                                </div>
                            </template>
                        </div>
                        <div class="game-type" v-if="!gameArr.length">
                            <div class="game-card" v-for="i in 4" :key="i">
                                <div class="jb-layer"></div>
                                <div
                                    class="img"
                                    :style="{ backgroundImage: `url(${GameCardError})` }"
                                    style="bottom: 44%; width: 80%; left: 10%"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 首页公告弹窗 -->
        <DialogHomeNotice :selectNotice="selectNotice" ref="NoticeRef" />

        <!-- 热门赛事弹窗 -->
        <DialogHotGame :hotGame="hotGame" ref="HotGameRef" />

        <!-- 活动提示浮标-->
        <buoy-aside></buoy-aside>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/style/vip.scss";
.home-header.com-header {
    :deep(.kf_icon) {
        height: 24px;
        width: 24px;
        display: inline-block;
        vertical-align: middle;
        background-image: url("@/assets/img/template/july/home/kefu.png");
    }
    :deep(.messcenter-icon) {
        position: relative;
        width: 24px;
        height: 24px;
        background-image: url("@/assets/img/template/july/home/message.png");

        .badge {
            position: absolute;
            right: -2px;
            top: -2px;
            width: 9px;
            height: 9px;
            color: var(--badge-color);
            border-radius: 50%;
            border: solid 1px #fff;
            background-color: var(--badge-color);
        }
    }
}
.home_page {
    min-height: 100vh;
    min-height: calc(var(--vh) * 100);
}
.home-swipe {
    :deep(.van-swipe__indicators) {
        bottom: 21px;
        .van-swipe__indicator {
            transition: width 0.4s;
            background: #fbfbfb;

            &.van-swipe__indicator--active {
                width: 15px;
                border-radius: 4px;
                background: #fff;
            }
        }
    }
}
.notic_title_mark {
    background: url("@/assets/img/template/july/home/laba.png") no-repeat center;
    background-size: 100% 100%;
}
.noti-hotwrapper {
    .hot-icon {
        background: url("@/assets/img/template/july/home/hot.png") no-repeat center;
        background-size: 100% 100%;
    }
}
.home-bottom {
    line-height: 1.6;
    height: calc(100vh - 198px);
    // 兼容ios
    height: calc(var(--vh) * 100 - 198px);
    .tab {
        .tab-icon {
            position: relative;

            .tab-label {
                position: absolute;
                bottom: -10px;
                left: 6px;
            }
        }
        &.tab-active {
            background-image: url("@/assets/img/template/july/home/game/selected-point.png"),
                url("@/assets/img/template/july/home/game/selectd-bg.png");
            background-size: contain, contain;
            background-repeat: no-repeat, no-repeat;
            background-position: center top, center top;
            .tab-icon {
                position: absolute;
                width: 40px;
                height: 39px;
                top: 5px;

                .tab-label {
                    color: #fff;
                    font-weight: bold;
                    left: 8px;
                }
            }
        }
    }
    :deep(.game-type) {
        display: flex;
        flex-wrap: wrap;
        padding-left: 10px;
        &.game-type-many {
            padding-left: 0;

            .game-card {
                &:first-child {
                    margin-left: 10px;
                }
            }
        }
        .game-card {
            width: 140px;
            height: 146px;
            border-radius: 16px;
            position: relative;
            line-height: 1;
            padding-top: 10.5px;
            margin-right: 10px;
            margin-bottom: 10px;
            background: linear-gradient(to top, #f2fffc, #ffffff);
            box-shadow: 0 4px 8px 0 rgba(45, 48, 57, 0.25);

            overflow: hidden;
            .jb-layer {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 58.5px;
                pointer-events: none;
                background: url("@/assets/img/template/july/home/game/jianbian.png") no-repeat center bottom;
                background-size: 100% 100%;
            }

            .img {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                background-repeat: no-repeat;
                background-position: center bottom;
                background-size: contain;
            }
        }
        .game-card-1 {
            width: 290px;
            height: 301px;
            margin-right: 0;
        }

        .game-card-2 {
            width: 290px;
            margin-right: 0;
        }

        .game-card-3 {
            &:nth-of-type(1) {
                width: 290px;
                margin-right: 0;
            }
        }

        .game-card-4 {
            &:nth-of-type(2n) {
                margin-right: 0;
            }
        }

        .game-card-5 {
            width: 90px;

            &:nth-of-type(1) {
                width: 140px;
            }

            &:nth-of-type(2) {
                width: 140px;
                margin-right: 0;
            }

            &:nth-of-type(5) {
                margin-right: 0;
            }
        }

        .game-card-6 {
            width: 90px;

            &:nth-of-type(3n) {
                margin-right: 0;
            }
        }

        .game-card-many {
            width: 90px;
        }
        .game-name {
            font-size: 18px;
            font-weight: bold;
            color: #222;
            margin-left: 11px;
            white-space: nowrap;
        }

        .game-stitle {
            font-size: 12px;
            color: rgba(34, 34, 34, 0.5);
            margin-left: 11px;
            margin-top: 4.5px;
        }
        .hot-label {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 38px;
            height: 25px;
            pointer-events: none;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
            background-image: url("@/assets/img/template/july/home/game/hot-label.png");
            text-align: center;
            line-height: 24px;
            color: #fff;
            font-weight: bold;
            font-size: 12px;
        }

        .new-label {
            background-image: url("@/assets/img/template/july/home/game/new-label.png");
        }
    }
    .card-swipe {
        width: 98%;
        height: 160px;
        margin-left: 0;

        :deep(.game-card) {
            margin-left: 10px !important;
            margin-right: 0 !important;
        }
    }
}
.bold-text {
    width: fit-content;
    font-size: 19px;
    font-weight: bold;
    color: #222;
    line-height: 21px;
    .MoneySplit {
        line-height: 0.9;
    }
}
.normal-text {
    width: fit-content;
    font-size: 14px;
    color: #4b566b;
}
</style>
