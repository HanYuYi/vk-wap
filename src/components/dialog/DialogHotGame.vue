<script setup lang="ts">
import { ref, computed } from "vue"
import { useSysStore } from "@/stores/system"
import { useDateFormat } from "@vueuse/core"
import { useStartGame } from "@/composable/util"
import { usePlaceImg } from "@/utils/globalImgs"
import type { IndexGetHotGame } from "@/api/pojo/IndexGetHotGame"

interface ExposeType {
    show: boolean
    hotTabIndex: number
}

const systemParams: ReturnType<typeof useSysStore> = useSysStore()
const { lazyNewLogo } = usePlaceImg()

/**
 * Props
 */
type IndexGetHotGameItem = IndexGetHotGame["data"]

const props = defineProps<{ hotGame: IndexGetHotGameItem }>()

const formatDate = (time: number): string => useDateFormat(Number(time), "MM-DD HH:mm").value

// 控制弹窗展示
const show = ref<ExposeType["show"]>(false)

// 热门赛事选中的索引
const hotTabIndex = ref<ExposeType["hotTabIndex"]>(0)

const hotGameChangeIndex = ref<number>(0)
const imgKey = computed<string>(() => (props.hotGame.length ? props.hotGame[hotTabIndex.value].tag : ""))

const defaultJumpUrl = computed<string>(() => (props.hotGame.length ? props.hotGame[hotTabIndex.value].go_bet_url : ""))

type GameItem = IndexGetHotGameItem[1]["game_list"] | []

const currentHotGames = computed<GameItem>(() => {
    return props.hotGame.length ? props.hotGame[hotTabIndex.value].game_list : []
})
// 热门赛事，页面只展示3个，点击换一批，换下三个，如果接口只返回3个，换一批不展示
const hotDisplayGames = computed<GameItem>(() => {
    if (currentHotGames.value.length) {
        return currentHotGames.value.slice(hotGameChangeIndex.value, hotGameChangeIndex.value + 3)
    }
    return []
})

const changeHotTab = (i: number): void => {
    hotGameChangeIndex.value = 0
    hotTabIndex.value = i
}

/**
 * 换一批热门赛事
 */
const isRotate = ref<boolean>(false)

const switchHot = (): void => {
    isRotate.value = true
    const next: number = hotGameChangeIndex.value + 3

    if (next <= currentHotGames.value.length - 1) {
        hotGameChangeIndex.value = next
    } else {
        hotGameChangeIndex.value = 0
    }

    const timer = setTimeout(() => {
        isRotate.value = false
        clearTimeout(timer)
    }, 520)
}

defineExpose({ show, hotTabIndex })
</script>

<template>
    <van-dialog teleport="body" v-model:show="show" :show-confirm-button="false" className="home-diolog">
        <div
            class="gg-close"
            @click="
                () => {
                    systemParams.appRootBlur = false
                    show = false
                }
            "
        ></div>
        <div
            bg="gradient-to-r"
            class="hot-wrapper from-#e2ffef to-#d1f0ff relative rounded-8px w-full px-15px pb-15px m-auto h-440px"
        >
            <div class="w-160px h-79.5px absolute left-0 top--78.5px" :class="`left-img-${imgKey}`"></div>
            <div class="tab-wrapper relative h-54.5px w-full hstack justify-between">
                <div
                    @click="changeHotTab(i)"
                    class="tab w-85px h-34px leading-34px"
                    text="16px primaryText"
                    :class="{ 'tab-active': i == hotTabIndex }"
                    v-for="(tab, i) in props.hotGame"
                    :key="i"
                >
                    {{ tab.name }}
                </div>
            </div>
            <div
                class="hotgame-block relative w-298px h-117px px-11px pt-16px rounded-4px mb-10px flex justify-between last-of-type:mb-0"
                shadow="[0_4px_8px_0_rgba(45,48,57,0.1)]"
                bg="white"
                v-for="(game, index) in hotDisplayGames"
                :key="index"
            >
                <div class="team-block">
                    <div
                        class="team-logo"
                        v-lazy-container="{
                            selector: 'img',
                            error: lazyNewLogo,
                            loading: lazyNewLogo
                        }"
                    >
                        <img :data-src="game.team_logo_1" alt="" />
                    </div>
                    <div class="team-name">{{ game.team_name_1 }}</div>
                    <div class="peilv font-robot">{{ game.team_1_point }}</div>
                </div>
                <div class="center-block">
                    <div class="game-title">{{ game.event_name }}</div>
                    <div class="game-time peilv font-robot">
                        {{ formatDate(game.game_start_time * 1000) }}
                    </div>
                    <div
                        text="14px primaryText"
                        class="primary-btn mx-auto mt-8px w-82px h-32px leading-32px rounded-4px font-bold"
                        @click.stop="
                            () => {
                                useStartGame({
                                    url: game.bet_url,
                                    isNeedLogin: false,
                                    isCheckName: false,
                                    changeFlag: systemParams.userInfo.change_flag
                                })
                            }
                        "
                    >
                        立即投注
                    </div>
                </div>
                <div class="team-block">
                    <div
                        class="team-logo"
                        v-lazy-container="{
                            selector: 'img',
                            error: lazyNewLogo,
                            loading: lazyNewLogo
                        }"
                    >
                        <img :data-src="game.team_logo_2" alt="" />
                    </div>
                    <div class="team-name">{{ game.team_name_2 }}</div>
                    <div class="peilv font-robot">{{ game.team_2_point }}</div>
                </div>
            </div>
            <!-- 没有活动时的默认显示 -->
            <div class="ab-center" v-if="!currentHotGames.length">
                <div text="15px secondText" class="whitespace-nowrap leading-">暂无热门赛事，请前往游戏</div>
                <div
                    text="14px primaryText"
                    class="primary-btn mx-auto mt-12px w-82px h-32px leading-32px rounded-4px font-bold"
                    @click="
                        () => {
                            useStartGame({
                                url: defaultJumpUrl,
                                isNeedLogin: false,
                                isCheckName: false,
                                changeFlag: systemParams.userInfo.change_flag
                            })
                        }
                    "
                >
                    立即投注
                </div>
            </div>
            <div
                v-if="currentHotGames.length > 3"
                class="absolute left-0 w-full h-24px bottom--36px leading-none text-14px text-white"
            >
                <div class="h-full w-fit m-auto flex-center" @click.stop="switchHot">
                    <div
                        class="refresh-icon w-18px h-14.5px mr-5.5px"
                        :class="{
                            'rotate-1round': isRotate
                        }"
                    ></div>
                    <div>换一批</div>
                </div>
            </div>
        </div>
    </van-dialog>
</template>

<style lang="scss" scoped>
.van-dialog.home-diolog {
    .hot-wrapper {
        // 足球的图
        .left-img-soccer {
            background: url("@/assets/img/template/july/home/zq-float.webp") no-repeat center;
            background-size: 100% 100%;
        }

        // 篮球的图
        .left-img-basketball {
            background: url("@/assets/img/template/july/home/lq-float.webp") no-repeat center;
            background-size: 100% 100%;
        }

        // 电竞的图
        .left-img-esports {
            background: url("@/assets/img/template/july/home/dj-float.webp") no-repeat center;
            background-size: 100% 100%;
        }
        .tab-active {
            background: url("@/assets/img/template/july/home/tab-active.png") no-repeat center;
            background-size: cover;
            font-weight: bold;
        }
    }
    .hotgame-block {
        .peilv {
            font-size: 14px;
            color: #4b566b;
        }

        .team-block {
            flex: 0.25;
            text-align: center;
            overflow: hidden;

            .team-logo {
                margin: auto;
                position: relative;
                width: 49px;
                height: 49px;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;

                &::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    padding: 2px;
                    background: linear-gradient(0deg, #01e9bd, #007cde);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask-composite: exclude;
                }

                img {
                    width: 32px;
                    height: 32px;
                }
            }

            .team-name {
                font-size: 13px;
                color: #222;
                white-space: nowrap;
                text-overflow: ellipsis;
                max-width: 74px;
                overflow: hidden;
            }
        }

        .center-block {
            flex: 0.5;

            .game-title {
                font-size: 15px;
                font-weight: bold;
                color: #222;
                max-width: 138px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
    .refresh-icon {
        background: url("@/assets/img/template/july/home/refresh.png") no-repeat center;
        background-size: 100% 100%;
    }
}
</style>
