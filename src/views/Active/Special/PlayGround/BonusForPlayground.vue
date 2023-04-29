<script setup lang="ts">
import ApiSetting from "@/api/service"
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useSysStore } from "@/stores/system"
import { showToast } from "vant"
import { formatNumberSplit } from "@/utils/numberUtils"
import { ActiveSpecialWater } from "@/api/pojo/active/ActiveSpecialWater"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()
const router = useRouter()

/**
 * Props
 */
interface Props {
    gameVenuesList: { title: string; game_list: { money_code: string; title: string }[] }[]

    gameVenuesMap: Map<string, string[]>
}

const props = defineProps<Props>()

/**
 * Emits
 */
interface Emits {
    (e: "receive-bonus", args: { walletList: { money_code: string; title: string }[] }): void
}

const emit = defineEmits<Emits>()

const toHomeRealman = (): void => {
    systemParams.setRouteParams<{ gametype: number }>({ gametype: 3 })
    router.push("/")
}

const initInfo = ref<ActiveSpecialWater>(new ActiveSpecialWater())

const bonusList = [
    { amount: 10000, bonus: 8 },
    { amount: 50000, bonus: 18 },
    { amount: 100000, bonus: 58 },
    { amount: 300000, bonus: 88 },
    { amount: 500000, bonus: 188 },
    { amount: 800000, bonus: 388 },
    { amount: 1500000, bonus: 888 },
    { amount: 3000000, bonus: 1888 }
]

const receiveBonus = [
    {
        conditions: "真人有效流水：5倍",
        tipsField: "zr_water",
        statusField: "zr_status"
    },
    {
        conditions: "棋牌有效流水：8倍",
        tipsField: "qp_water",
        statusField: "qp_status"
    },
    {
        conditions: "电玩有效流水：8倍",
        tipsField: "dz_water",
        statusField: "dz_status"
    }
] as const

//是否是活动开始第二天
const isSecondDay = computed<boolean>(() => {
    if (!initInfo.value.active_start_time) return false

    const startTime = new Date(initInfo.value?.active_start_time * 1000)
    const secondTime = new Date(
        `${startTime.getFullYear()}/${startTime.getMonth() + 1}/${startTime.getDate() + 1} 00:00:00`
    ).getTime()

    if (Date.now() >= secondTime) {
        return true
    }
    return false
})

const bettingTips = (amount: number): void => {
    showToast({
        className: "vk-toast-fail",
        message: `昨日累计投注：${formatNumberSplit(amount)}元`,
        icon: "warning"
    })
}

const more = (): void => {
    systemParams.ActiveMoreRules.classname = "PlayGround"
    systemParams.ActiveMoreRules.isShow = true
}

const receiveBonusMethod = (index: number): void => {
    if (!initInfo.value.is_login) {
        showToast({
            className: "vk-toast-fail",
            message: "请您先登录",
            icon: "warning"
        })
        return
    }

    if (initInfo.value[receiveBonus[index].tipsField] < bonusList[0].amount) {
        showToast({
            className: "vk-toast-fail",
            message: "您昨日累计投注未达到活动要求",
            icon: "warning"
        })
        return
    }
    emit("receive-bonus", {
        walletList: props.gameVenuesList[index].game_list
    })
}

const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.playgroundActive.initWaterActive)
    const res = await HttpPlus.sendHttpRequest<ActiveSpecialWater>()
    systemParams.PageLoading = false
    if (res.status === 1 && res.data) {
        initInfo.value = res.data
    }
}

defineExpose({ init })

init()
</script>

<template>
    <div class="bonus-for-playground">
        <h6 class="active-content">
            活动期间，会员每日在以下场馆完成≥10,000元有效投注，次日即可申请领取相应优惠彩金，最高可获得1,888元！
        </h6>

        <!-- 活动列表-->
        <div class="bonus-panel">
            <table border="0" align="center" cellspacing="0">
                <tr>
                    <th>有效投注（元）</th>
                    <th>返利彩金（元）</th>
                    <th>游戏场馆</th>
                </tr>
                <tr v-for="(item, index) in bonusList" :key="index">
                    <td>{{ formatNumberSplit(item.amount, 0) }}+</td>
                    <td>{{ formatNumberSplit(item.bonus, 0) }}</td>
                    <!-- 领取操作区-->
                    <td width="40%" v-if="index === 0" :rowspan="bonusList.length" class="operation-area">
                        <ul>
                            <li v-for="(receiveItem, i) in receiveBonus" :key="i">
                                <h5 class="text-12px">
                                    {{ receiveItem.conditions }}
                                    <i
                                        v-if="isSecondDay"
                                        class="popover-icon"
                                        @click="bettingTips(initInfo[receiveItem.tipsField])"
                                    ></i>
                                </h5>

                                <button
                                    v-if="initInfo[receiveItem.statusField] && initInfo[receiveItem.statusField].status === 1"
                                    class="disabled"
                                >
                                    今日已领取
                                </button>
                                <button v-else @click="receiveBonusMethod(i)">领取彩金</button>
                            </li>
                        </ul>
                    </td>
                </tr>
            </table>
        </div>

        <a @click="toHomeRealman" class="to-play"></a>

        <dl class="rules">
            <dt></dt>
            <dd>
                <ul>
                    <li>
                        <i>1</i>
                        <p>专享返利金需在本活动页面手动领取，单日仅限每个场馆可领1次；共3次。</p>
                    </li>
                    <li>
                        <i>2</i>
                        <p>
                            每日累计投注达到对应的额度即可领取彩金，领取时间为次日
                            00:30:00-23:59:59，指定时间内未领取视为自动放弃。
                        </p>
                    </li>
                    <li>
                        <i>3</i>
                        <p>
                            用户在领取专享返利金时，需选择将其领取至对应的游戏场馆钱包（真人、棋牌、电子场馆），此彩金需完成活动对应场馆所需的有效流水倍数，活动流水未完成前不可再次申请。
                        </p>
                    </li>
                    <li>
                        <i>4</i>
                        <p>
                            真人场馆包含：{{
                                gameVenuesMap.get("真人") && gameVenuesMap.get("真人").join("、")
                            }}；棋牌场馆包含：{{
                                gameVenuesMap.get("棋牌") && gameVenuesMap.get("棋牌").join("、")
                            }}；电子场馆包含：{{ gameVenuesMap.get("电子") && gameVenuesMap.get("电子").join("、") }}。
                        </p>
                    </li>
                    <li>
                        <i>5</i>
                        <p>
                            有效流水仅计算产生输赢结果的注单；注单取消、对冲、未结算等不计算为有效流水，PT电子游戏中以下游戏不算有效流水：
                            <span @click="more">查看详情</span>
                            。
                        </p>
                    </li>
                    <li>
                        <i>6</i>
                        <p>
                            每位有效玩家、每个手机号码、电子邮箱、IP地址、每张银行卡、每台设备只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利；VKGAME对本活动保有最终解释权。
                        </p>
                    </li>
                </ul>
            </dd>
        </dl>
    </div>
</template>

<style lang="scss" scoped>
@import "playground.scss";
.bonus-for-playground {
    .bonus-panel {
        margin: 0.13rem auto 0;
        width: 3.625rem;
        height: 3.655rem;
        background: url("@/assets/img/active/special/playground/bonus_panel.png");
        background-size: 100% 100%;
        overflow: hidden;

        table {
            margin: 0 0 0 0.04rem;
            width: 3.545rem;
            color: #ffffff;
            font-size: 0.14rem;
            text-align: center;
            line-height: 0.4rem;

            tr {
                th {
                    color: #fbde96;
                    line-height: 0.41rem;
                    font-weight: normal;
                }

                td {
                    border-top: 0.005rem solid #a34045;
                    border-left: 0.005rem solid #a34045;
                    font-family: Roboto;

                    &:first-child {
                        border-left: 0;
                    }

                    &.operation-area {
                        position: relative;

                        ul {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;

                            li {
                                width: 100%;
                                height: calc(100% / 3);
                                text-align: center;
                                overflow: hidden;

                                h5 {
                                    font-weight: normal;
                                    margin-top: 0.16rem;
                                    line-height: 0.16rem;

                                    .popover-icon {
                                        margin-left: 0.05rem;
                                        display: inline-block;
                                        width: 0.14rem;
                                        height: 0.14rem;
                                        background: url("@/assets/img/active/special/playground/popover_icon.png");
                                        background-size: 100% 100%;
                                        vertical-align: text-bottom;
                                    }
                                }

                                button {
                                    display: block;
                                    margin: 0.12rem auto 0;
                                    width: 0.69rem;
                                    height: 0.23rem;
                                    line-height: 0.23rem;
                                    font-size: 0.12rem;
                                    color: #88292a;
                                    border: 0;
                                    outline: 0;
                                    clip-path: polygon(7% 0%, 100% 0%, 100% 80%, 93% 100%, 0% 100%, 0% 20%);
                                    background-image: linear-gradient(to bottom, #f1cc73, #ffe4a2);
                                    &:active {
                                        background-image: linear-gradient(to top, #ffe3a0, #ffedc1);
                                    }
                                    &.disabled {
                                        width: 0.79rem;
                                        background-image: linear-gradient(to bottom, #959595, #c8c8c8);
                                        color: #5a5a5a;
                                        pointer-events: none;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .to-play {
        display: block;
        margin: 0.1rem auto 0;
        width: 1.745rem;
        height: 0.68rem;
        background: url("@/assets/img/active/special/playground/to_play.png");
        background-size: 100% 100%;
        transition: filter 0.1s;
        &:active {
            filter: saturate(130%);
        }
    }

    .rules {
        margin: 0.16rem auto 0;
        dd {
            height: 5.91rem;
            background: transparent url("@/assets/img/active/special/playground/active_2_rule.png");
            background-size: 100% 100%;
        }
    }
}
</style>
