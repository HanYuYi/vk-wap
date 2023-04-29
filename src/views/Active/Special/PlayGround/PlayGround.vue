<script setup lang="ts">
import vueDanmaku from "vue3-danmaku"
import RedPacketForPlayground from "./RedPacketForPlayground.vue"
import BonusForPlayground from "./BonusForPlayground.vue"
import ApiSetting from "@/api/service"
import { ref } from "vue"
import { showToast } from "vant"
import type { GameItem, IndexIndexV2 } from "@/api/pojo/IndexIndexV2"
import { HttpPlus } from "@/api/HttpPlus"
import type { ActiveJoinSpecialVenue } from "@/api/pojo/active/ActiveJoinSpecialVenue"

const activeShowTime = ref("")
const activeTabIndex = ref(1)
const redPacketForPlaygroundRef = ref(null)
const bonusForPlaygroundRef = ref(null)

// 组装好的随机弹幕

type BulletScreenItem = {
    id: number
    avatar: string
    msg: string
    time: number
}

const bulletScreen = ref<BulletScreenItem[]>([])

const getPublicData = ({
    date,
    bulletList
}: {
    date: ActiveJoinSpecialVenue["active_show_time"]
    bulletList: ActiveJoinSpecialVenue["bullet_screen"]
}): void => {
    activeShowTime.value = date
    bulletList.length && addBarrageData(bulletList)
}

const addBarrageData = (list: ActiveJoinSpecialVenue["bullet_screen"]): void => {
    let added = 0
    let bulletTimer: number | undefined
    clearInterval(bulletTimer)
    bulletTimer = setInterval(() => {
        bulletScreen.value = []
        if (list.length && added <= list.length) {
            const pushNum = parseInt((Math.random() * 10).toString())
            for (let i = 0; i < pushNum; i++) {
                if (i + added < list.length - 1) {
                    let speed = Math.random() * 10
                    bulletScreen.value.push({
                        id: i + 1,
                        avatar: list[i + added].head_image,
                        msg: `恭喜${list[i + added].username}获得彩金${list[i + added].goods_name}元`,
                        time: speed < 3 ? speed + 3 : speed
                    })
                }
            }
            added += pushNum
            if (added >= list.length) {
                clearInterval(bulletTimer)
            }
        }
    }, 1000 * 8)
}

const walletIndex = ref(0)

type ReceiveWalletItem = { money_code: string; title: string }

const receiveWalletList = ref<ReceiveWalletItem[]>([])

const redPacketLeval = ref(0)

const receiveBonusVisible = ref(false)

// 开启领取彩金dialog
const openReceiveBonus = ({ walletList, leval = 0 }: { walletList: ReceiveWalletItem[]; leval: number }): void => {
    receiveWalletList.value = walletList
    redPacketLeval.value = leval
    receiveBonusVisible.value = true
}

// 礼金弹窗
const receiveBonusSubmitLoading = ref(false)

class ReceiveBonusSubmitResponse {
    amount: string | number
}

const receiveBonusSubmit = async (): Promise<void> => {
    if (receiveBonusSubmitLoading.value) {
        showToast({
            className: "vk-toast-fail",
            message: "领取中，请稍等...",
            icon: "warning"
        })
        return
    }
    receiveBonusSubmitLoading.value = true
    const postMap = new Map([
        [
            1,
            {
                url: ApiSetting.active.playgroundActive.joinRedPacketBonus,
                params: {
                    wallet: receiveWalletList.value[walletIndex.value]?.money_code,
                    leval: redPacketLeval.value
                }
            }
        ],
        [
            2,
            {
                url: ApiSetting.active.playgroundActive.joinWaterBonus,
                params: {
                    wallet: receiveWalletList.value[walletIndex.value]?.money_code
                }
            }
        ]
    ])

    try {
        const params = postMap.get(activeTabIndex.value).params

        HttpPlus.setUrlOptions(postMap.get(activeTabIndex.value).url)
        const res = await HttpPlus.sendHttpRequest<ReceiveBonusSubmitResponse, typeof params>(params)
        receiveBonusSubmitLoading.value = false
        if (res.status === 1 && res.data) {
            receiveBonusVisible.value = false
            walletIndex.value = 0
            showToast({
                className: "vk-toast-success",
                message: `${res.data.amount}元彩金已派发至您的${
                    receiveWalletList.value[walletIndex.value].title
                }钱包，请注意查收`,
                icon: "checked"
            })
            if (activeTabIndex.value === 1) {
                redPacketForPlaygroundRef.value.init()
            }
            if (activeTabIndex.value === 2) {
                bonusForPlaygroundRef.value.init()
            }
        }
    } catch (error: unknown) {
        receiveBonusSubmitLoading.value = false
        console.error(error)
    }
}

type gameListItem = GameItem["game_list"][number]

// 游戏场馆信息
type GameVenuesDataList = { title: string; game_list: ReceiveWalletItem[] }[]

const gameVenuesDataList = ref<GameVenuesDataList>([])

const gameVenuesTitleMap = ref<Map<string, string[]>>(new Map())

type KeysType = "live" | "chess" | "slot"

const init = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.home.getHomeData)
    const res = await HttpPlus.sendHttpRequest<IndexIndexV2>()

    if (res.status === 1 && res.data) {
        // 将数据处理为场馆所需数据
        const gameKeyList: string[] = Object.keys(res.data).filter(
            (key: string) => key === "live" || key === "chess" || key === "slot"
        )

        gameVenuesDataList.value = gameKeyList.map((key: string) => {
            return {
                game_list: res.data[key as KeysType].game_list
                    .filter((game: gameListItem) => !game.title.includes("捕鱼") && !game.title.includes("FF链游"))
                    .map((game: gameListItem) => {
                        return {
                            money_code: game.code,
                            title: game.title
                        }
                    }),
                title: res.data[key as KeysType].game_title.includes("电玩")
                    ? "电子场馆"
                    : `${res.data[key as KeysType].game_title}场馆`
            }
        })

        gameVenuesDataList.value.forEach((item: GameVenuesDataList[number]) => {
            gameVenuesTitleMap.value.set(
                item.title.substring(0, 2),
                item.game_list.map((game) => game.title)
            )
        })
        console.info("(使用的是首的接口)场馆信息信息初始化")
        console.info("处理之后的数据：", gameVenuesDataList.value)
    }
}

init()
</script>

<template>
    <div class="font-classic leading-relaxed">
        <HeaderBar>
            <div class="header_title">娱乐专场</div>
        </HeaderBar>

        <div class="expand-page PlayGround-page">
            <!-- 中奖弹幕 -->
            <vue-danmaku
                ref="danmaku"
                v-model:danmus="bulletScreen"
                :speeds="20"
                :channels="8"
                randomChannel
                useSlot
                style="height: 6rem; width: 100vw"
                class="playground-baberrage"
            >
                <template v-slot:dm="{ danmu }">
                    <div
                        class="win_prize_tip border-#f2dea8! text-15px text-#f2dea8 bg-old-text leading-none py-3px pl-3px pr-15px hstack select-none"
                    >
                        <img class="avatar" :src="danmu.avatar" alt="" />
                        <div>{{ danmu.msg }}</div>
                    </div>
                </template>
            </vue-danmaku>

            <h4 class="date" :class="{ active: activeShowTime }">
                {{ activeShowTime || "加载中" }}
            </h4>
            <!-- 子活动tab-->
            <ul class="active-tab" :class="`active-${activeTabIndex}`">
                <li v-for="num in 2" :key="num" @click="activeTabIndex = num"></li>
            </ul>

            <h1 class="active-title"></h1>

            <!-- 专属红包-->
            <red-packet-for-playground
                v-if="activeTabIndex === 1"
                ref="redPacketForPlaygroundRef"
                :game-venues-list="gameVenuesDataList"
                :game-venues-map="gameVenuesTitleMap"
                @send-data="getPublicData"
                @receive-bonus="openReceiveBonus"
            />

            <!-- 专属流水送-->
            <bonus-for-playground
                v-if="activeTabIndex === 2"
                ref="bonusForPlaygroundRef"
                :game-venues-list="gameVenuesDataList"
                :game-venues-map="gameVenuesTitleMap"
                @receive-bonus="openReceiveBonus"
            />
        </div>
        <!-- 领取彩金，两个子活动共用-->
        <van-dialog
            v-model:show="receiveBonusVisible"
            class="receive-bonus-for-playground"
            get-container="body"
            :close-on-click-overlay="true"
            :show-confirm-button="false"
            @close="receiveBonusVisible = false"
        >
            <div class="receive-main" :class="{ disabled: receiveBonusSubmitLoading }">
                <i @click="receiveBonusVisible = false" class="close"></i>

                <ul class="wallet-list">
                    <li
                        v-for="(item, index) in receiveWalletList"
                        :key="index"
                        @click="walletIndex = index"
                        :class="{ active: walletIndex === index }"
                    >
                        {{ item?.title }}钱包
                    </li>
                </ul>

                <button @click="receiveBonusSubmit" class="receive-btn"></button>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="less" scoped>
@import "playground.scss";
@import "@/assets/style/danmu.scss";
.playground-baberrage {
    position: absolute !important;
    z-index: 5;
    left: 0;
    margin-top: 0.16rem;
    pointer-events: none;
}
.PlayGround-page {
    padding-bottom: 0.14rem;
    overflow: hidden;
    background-image: url("@/assets/img/active/special/playground/bg.png");
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 100% auto;
    position: relative;
    .date {
        margin-top: 4.66rem;
        font-size: 0.1425rem;
        color: #fff;
        white-space: nowrap;
        text-align: center;
        position: relative;
        &.active {
            margin: 4.66rem auto 0;
            width: fit-content;
            animation: date-animate 1s;
            &::before,
            &::after {
                position: absolute;
                top: 0.01rem;
                content: "";
                width: 0.19rem;
                height: 0.19rem;
                background: url("@/assets/img/active/special/playground/date_modifier.png");
                background-size: 100% 100%;
                animation: date-modifier-animate 2s infinite;
                animation-delay: 1s;
            }
            &::before {
                left: -0.24rem;
            }
            &::after {
                right: -0.24rem;
            }
        }
        @keyframes date-animate {
            0% {
                transform: scaleX(0);
            }
            100% {
                transform: scaleX(1);
            }
        }
        @keyframes date-modifier-animate {
            0% {
                transform: scale(1, 1);
            }
            40% {
                transform: scale(1.8, 1.8);
            }
            100% {
                transform: scale(1, 1);
            }
        }
    }

    .active-tab {
        margin-top: 0.15rem;
        height: 1.2rem;
        overflow: hidden;
        display: flex;
        transition: background 0.6s;
        li {
            margin-top: 0.1rem;
            width: 50%;
            height: 0.55rem;
        }
        &.active-1 {
            background: url("@/assets/img/active/special/playground/tab_bar_1.png") no-repeat center top;
            background-size: 100% auto;
        }
        &.active-2 {
            background: url("@/assets/img/active/special/playground/tab_bar_2.png") no-repeat center top;
            background-size: 100% auto;
        }
    }

    .active-title {
        margin-top: -0.25rem;
        height: 0.72rem;
        background: url("@/assets/img/active/special/playground/active_title.png") no-repeat center top;
        background-size: auto 100%;
    }
}
</style>
<style lang="scss">
.van-dialog.receive-bonus-for-playground {
    top: 52%;
    width: 3.5rem;
    background: #191211 url("@/assets/img/active/special/playground/receive_bonus_for_playground_title.png") no-repeat center top;
    background-size: 101% auto;
    border: solid 0.01rem #c83934;
    box-sizing: border-box;
    border-radius: 0;
    overflow: visible;
}
</style>
