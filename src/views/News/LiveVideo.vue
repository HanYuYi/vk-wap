<script setup lang="ts">
import NoData from "./NoData.vue"
import LiveItem from "./LiveItem.vue"
import { showToast } from "vant"
import ApiSetting from "@/api/service"
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue"
import { useStartGame } from "@/composable/util"
import { useSysStore } from "@/stores/system"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import flvjs from "flv.js"
import Hls from "hls.js"
import DPlayer from "dplayer"
import type { DPlayer as DPlayerType } from "@/types"
import type { IndexGetRecommend } from "@/api/pojo/IndexGetRecommend"
import { HttpPlus } from "@/api/HttpPlus"
import type { GameList } from "@/api/pojo/IndexGetSchedule"
import type { IndexGetHotLive } from "@/api/pojo/IndexGetHotLive"
import type { Props } from "@/views/News/LiveItemType"
import { IndexGetLive } from "@/api/pojo/IndexGetLive"

const systemParams = useSysStore()
const router: Router = useRouter()

type RecommendMatch = IndexGetRecommend["data"]

const recommendMatch = ref<RecommendMatch>([])
const recomLoading = ref(false)

/**
 * 返回媒体资源扩展类型
 */
const findMSEType = (url: string): string => {
    let back = ""
    if (!url.length) return back
    const videoTypeMap = new Map<string, string>([
        ["flv", "flv"],
        ["m3u8", "hls"]
    ])
    for (const [key, value] of videoTypeMap) {
        if (url.includes(`.${key}`)) {
            back = value
            break
        }
    }
    return back
}

const matchDPlayerRef = ref<HTMLDivElement>(null)
const msePlayer = ref<DPlayerType>(null)
const currentMatchLineIndex = ref(0)
const showLineLayer = ref(false)
const showBottom = ref(true)
const showTip = ref(true)
const isFullScreen = ref(false)

// 当前线路文字
type LiveLineList = GameList["live_line_list"]

const selectedLineText = computed<LiveLineList[number]["name"]>(() => {
    const routeParams = systemParams.routeParams as { live_line_list: LiveLineList }
    return routeParams?.live_line_list[currentMatchLineIndex.value]?.name
})

const isIOS = computed<boolean>(() => {
    const u: string = navigator.userAgent
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
})

// 初始化播放容器
const initMatchVideo = async () => {
    const routeParams = systemParams.routeParams as { liveTypeData: IndexGetHotLive; live_line_list: LiveLineList }

    let videoUrl = ""
    if (routeParams?.liveTypeData?.show_live === 2) {
        videoUrl = routeParams?.liveTypeData?.default.url
    } else {
        videoUrl = routeParams?.live_line_list[currentMatchLineIndex.value]?.url
    }

    if (!videoUrl) return

    const MSEType: string = findMSEType(videoUrl)

    const videoContainer = matchDPlayerRef.value
    const dplayerHolder = (msePlayer.value = new DPlayer({
        container: videoContainer,
        live: routeParams?.liveTypeData?.show_live === 1,
        theme: "#07f1b7",
        autoplay: true,
        video: {
            url: videoUrl,
            duration: 0,
            // flv
            ...(MSEType === "flv" && {
                type: "customFlv",
                customType: {
                    customFlv: (video: HTMLMediaElement) => {
                        const flvPlayer: flvjs.Player = flvjs.createPlayer(
                            {
                                type: "flv"
                            },
                            { autoCleanupSourceBuffer: true }
                        )
                        flvPlayer.attachMediaElement(video)
                        flvPlayer.load()
                    }
                }
            }),

            // m3u8
            ...(MSEType === "hls" && {
                type: "customHls",
                customType: {
                    customHls: (video: HTMLMediaElement) => {
                        const hlsPlayer = new Hls()
                        hlsPlayer.loadSource(videoUrl)
                        hlsPlayer.attachMedia(video)
                    }
                }
            })
        }
    }) as DPlayerType)

    await nextTick()

    const dplayerFullInIcon: HTMLButtonElement = document.querySelector(".dplayer-full-in-icon")
    if (dplayerFullInIcon) {
        dplayerFullInIcon.style.display = "none"
    }
    dplayerHolder.play()

    dplayerHolder.on("canplay", () => {
        if (dplayerFullInIcon) {
            dplayerFullInIcon.style.display = "none"
        }
        dplayerHolder.play()
        showLineLayer.value = false
        const timer = setTimeout(() => {
            showTip.value = false
            clearTimeout(timer)
        }, 7000)
    })
    dplayerHolder.on("fullscreen", () => {
        isFullScreen.value = true
    })
    dplayerHolder.on("fullscreen_cancel", () => {
        isFullScreen.value = false
    })
    dplayerHolder.on("resize", () => {
        videoContainer.style.height = [...videoContainer.classList].includes("dplayer-fulled") ? "100%" : "211px"
    })
}

if (!Object.keys(systemParams.routeParams).length) {
    router.back()
} else {
    const routeParams = systemParams.routeParams as { game_type: string; live_id?: string; id?: string }

    // 获取推荐赛事
    recomLoading.value = true

    const params = {
        game_type: routeParams.game_type,
        live_id: routeParams.live_id ? routeParams.live_id : routeParams.id
    }
    HttpPlus.setUrlOptions(ApiSetting.vkNews.recommendMatch)
    const res = await HttpPlus.sendHttpRequest<RecommendMatch, typeof params>(params)
    recomLoading.value = false

    if (res.status == 1 && res.data.length) {
        recommendMatch.value = res.data
    }
}

const startgame = (): void => {
    if (!Object.keys(systemParams.routeParams).length) {
        return
    }

    const routeParams = systemParams.routeParams as { betUrlObj: Props["item"]["bet_url_pc"] }

    useStartGame(
        {
            url: routeParams.betUrlObj.jump_url,
            isNeedLogin: routeParams.betUrlObj.is_need_login,
            isCheckName: routeParams.betUrlObj.is_check_name,
            changeFlag: systemParams.userInfo.change_flag
        },
        systemParams.isLogin,
        true
    )
}

// 切换线路
const switchLine = (i: number): void => {
    currentMatchLineIndex.value = i
    initMatchVideo()
}

// 点击视频隐藏/显示底部
const switchDisplay = async (): Promise<void> => {
    await nextTick()

    if (matchDPlayerRef.value.classList.contains("dplayer-hide-controller")) {
        showBottom.value = false
    } else {
        showBottom.value = true
    }
}

// 切换视频
const watchLiveVideo = async (item: Props["item"] & Pick<GameList, "live_id" | "id">): Promise<void> => {
    const routeParams = systemParams.routeParams as { id: string }

    if (item.status != 2) {
        showToast({
            className: "vk-toast-fail",
            message: "赛事暂未开始，敬请期待",
            icon: "warning"
        })
        return
    }
    if (item.id === +routeParams?.id) {
        showToast({
            className: "vk-toast-fail",
            message: "您正在收看当前直播，请播放其他推荐赛事",
            icon: "warning"
        })
        return
    }

    offStream()

    const params = {
        game_type: item.game_type,
        live_id: item.live_id ? item.live_id : item.id,
        ios: isIOS.value ? 1 : 0 // 判断用户当前是不是iphone,如果是，只获取m3u8的视频资源
    }

    HttpPlus.setUrlOptions(ApiSetting.vkNews.openLive)
    const res = await HttpPlus.sendHttpRequest<IndexGetLive["data"], typeof params>(params)

    if (res.status === 1 && res.data.length) {
        const currentMatch = {
            ...(systemParams.routeParams as object),
            ...item,
            live_line_list: res.data
        }
        systemParams.routeParams = { ...currentMatch }
        initMatchVideo()
    }
}

// 断流
const offStream = (): void => {
    if (msePlayer.value) {
        msePlayer.value.destroy()
        msePlayer.value = null
    }
}

onMounted(async () => {
    document.body.style.backgroundColor = "#e8f1ef"
    await nextTick()
    // 初始化播放器
    initMatchVideo()
})

onUnmounted(() => {
    document.body.style.backgroundColor = ""
    offStream()
    systemParams.routeParams = {}
})
</script>

<template>
    <div class="live-video-page">
        <!-- 头部 -->
        <HeaderBar>
            <div class="max-w-260px text-15px leading-loose text-white van-ellipsis font-robot">
                {{ systemParams.routeParams?.home_team_name ?? "" }}
                VS
                {{ systemParams.routeParams?.away_team_name ?? "" }}
            </div>
        </HeaderBar>
        <div class="player-wrapper">
            <div @click="switchDisplay" class="match-video" ref="matchDPlayerRef"></div>
            <div class="cos-player-bottom absolute bottom-5px right-62px hstack" v-if="showBottom">
                <div
                    class="btn-line text-white rounded-15px text-14px border-white border-1 font-bold w-60px leading-29px h-30px text-center mr-16px"
                    v-if="systemParams.routeParams?.live_line_list.length > 1"
                    @click="showLineLayer = true"
                >
                    {{ selectedLineText }}
                </div>
                <div class="tip-icon" @click="startgame">
                    <div class="pop-wrapper" v-if="showTip">可快速投注</div>
                </div>
            </div>
            <van-popup
                teleport="body"
                class="lv-line-popup"
                overlay-class="line-overlay"
                v-model:show="showLineLayer"
                position="right"
                :style="{ width: '45.33%' }"
            >
                <div class="line-list-wrapper">
                    <div
                        class="line-btn"
                        :class="{ 'active-line-btn': currentMatchLineIndex == i }"
                        @click="switchLine(i)"
                        v-for="(item, i) in systemParams.routeParams?.live_line_list"
                        :key="i"
                    >
                        {{ item.name }}
                    </div>
                </div>
            </van-popup>
        </div>
        <div class="live-title bg-lightGreen">赛事推荐</div>
        <div class="list live-list bg-lightGreen">
            <van-loading v-if="recomLoading" color="#444" class="ab-center" type="spinner" />
            <div v-else>
                <!-- 占位图 -->
                <NoData @startgame="startgame" v-if="!recommendMatch.length" />
                <!-- 赛事列表 -->
                <LiveItem @click="watchLiveVideo(item)" :item="item" v-for="(item, i) in recommendMatch" :key="i" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import "@/assets/style/dplayer.css";
.line-overlay {
    height: 211px;
    background: transparent;
}

.lv-line-popup {
    height: 211px;
    top: 105.5px;
    opacity: 0.8;
    background-color: #000;

    .line-list-wrapper {
        color: #fff;
        padding: 15px 0;

        .line-btn {
            margin: 0 auto 20px;
            width: 77.5px;
            height: 30px;
            box-sizing: border-box;
            border-radius: 16px;
            border: solid 1px #fff;
            text-align: center;
            line-height: 28px;
            font-size: 15px;
            font-weight: 600;

            &:last-child {
                margin-bottom: 0;
            }

            &.active-line-btn {
                border-color: #07f1b7;
                color: #07f1b7;
            }
        }
    }
}
</style>
<style lang="scss" scoped>
@keyframes slidedown {
    0% {
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
        opacity: 0;
    }

    30% {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
}
.com-header {
    :deep(.top-wrapper) {
        background-image: linear-gradient(to top, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.9));
        background-color: transparent;
    }
}
.cos-player-bottom {
    .tip-icon {
        width: 25px;
        height: 25px;
        background: url("@/assets/img/template/july/news/live/tip-icon.png") no-repeat center;
        background-size: 100% 100%;

        .pop-wrapper {
            width: 89px;
            height: 30.5px;
            line-height: 25px;
            background: url("@/assets/img/template/july/news/live/pop-bg.png") no-repeat center;
            background-size: 100% 100%;
            position: absolute;
            bottom: 28px;
            right: -31px;
            font-size: 15px;
            color: #07f1b7;
            text-align: center;
            animation: slidedown 2s infinite;
        }
    }
}
.live-video-page {
    .player-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 211px;
        z-index: 199;
    }
    .match-video {
        margin: auto;
        width: 100%;
        height: 211px;
        background-color: #111;

        :deep(video) {
            object-fit: contain;
        }

        :deep(.dplayer-menu) {
            width: 0;
            pointer-events: none;
        }
    }

    .live-title {
        z-index: 199;
        position: fixed;
        top: 211px;
        margin: auto;
        font-size: 15px;
        font-weight: 600;
        color: #222;
        line-height: 2;
        width: 100%;
        box-sizing: border-box;
        padding: 3px 15px 0;
    }

    .live-list {
        position: relative;
        margin: 244px auto 0;
        box-sizing: border-box;
        width: 100%;
        min-height: calc(var(--vh) * 100 - 244px);
    }
}
</style>
