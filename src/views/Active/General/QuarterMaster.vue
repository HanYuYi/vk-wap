<script setup lang="ts">
import reward1 from "@/assets/img/active/general/quartermaster/reward_1.png"
import reward2 from "@/assets/img/active/general/quartermaster/reward_2.png"
import reward3 from "@/assets/img/active/general/quartermaster/reward_3.png"
import taskCheckImg from "@/assets/img/active/general/quartermaster/task_checkIn.png"
import taskDepImg from "@/assets/img/active/general/quartermaster/task_deposit.png"
import taskGameImg from "@/assets/img/active/general/quartermaster/task_game.png"

import ApiSetting from "@/api/service"
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useSysStore } from "@/stores/system"
import { formatNumberSplit } from "@/utils/numberUtils"
import { showToast } from "vant"
import { computed } from "vue"
import { HttpPlus } from "@/api/HttpPlus"
import { BaseActiveStruct } from "@/api/pojo/BaseStruct"

const router = useRouter()
const systemParams = useSysStore()

interface ActiveListItem {
    id: number
    type: string
    typeAmount?: number
    rule: string
    btnTxt: string
    iconUrl: string
    taskUrl: string
    vb: number
    data: number
    status: number
    tagTip?: string
    richpayData?: number
    betTwoGames?: boolean
}
const activeList = ref<ActiveListItem[]>([
    /* {
      id: 0,
      type: '登录',
      rule: 'V币+',
      btnTxt: '去登录',
      iconUrl: require('../../../../assets/active/quartermaster/task_login.png'),
      vb: 10,
      data: 0,
      status: 0
    }, */
    {
        id: 1,
        type: "签到",
        rule: "V币+",
        btnTxt: "去签到",
        iconUrl: taskCheckImg,
        tagTip: "已连续签到{}天",
        taskUrl: "/user",
        vb: 10,
        data: 0,
        status: 0
    },
    {
        id: 0,
        type: "充值≥{}",
        typeAmount: 100,
        rule: "V币+",
        btnTxt: "去充值",
        iconUrl: taskDepImg,
        taskUrl: "/finance/deposit",
        vb: 50,
        data: 0,
        status: 0
    },
    {
        id: 2,
        type: "充值≥{}",
        typeAmount: 500,
        rule: "V币+",
        btnTxt: "去充值",
        iconUrl: taskDepImg,
        taskUrl: "/finance/deposit",
        vb: 100,
        data: 0,
        status: 0
    },
    {
        id: 3,
        type: "任意游戏 流水≥{}元",
        typeAmount: 1000,
        rule: "V币+",
        btnTxt: "去投注",
        iconUrl: taskGameImg,
        taskUrl: "/",
        vb: 20,
        data: 0,
        status: 0
    },
    {
        id: 4,
        type: "任意游戏 流水≥{}元",
        typeAmount: 10000,
        rule: "V币+",
        btnTxt: "去投注",
        iconUrl: taskGameImg,
        taskUrl: "/",
        vb: 50,
        data: 0,
        status: 0
    },
    {
        id: 5,
        type: " 投注两种以上不同类型的游戏<br>并且总流水≥{}元",
        typeAmount: 500,
        rule: "V币+",
        btnTxt: "去投注",
        iconUrl: taskGameImg,
        taskUrl: "/",
        vb: 50,
        data: 0,
        status: 0
    }
])

interface RewardListItem {
    title: string
    rule: string
    num: number
    status: number
    btnTxt: string
    bg: string
}

const rewardList = ref<RewardListItem[]>([
    {
        title: "最高188元",
        rule: "军需任务总数≥{}个",
        num: 15,
        status: 0,
        btnTxt: "开宝箱",
        bg: reward1
    },
    {
        title: "最高388元",
        rule: "军需任务总数≥{}个",
        num: 25,
        status: 1,
        btnTxt: "开宝箱",
        bg: reward2
    },
    {
        title: "最高888元",
        rule: "军需任务总数≥{}个",
        num: 35,
        status: 0,
        btnTxt: "开宝箱",
        bg: reward3
    }
])

const initInfo = reactive({
    is_login: 0,
    finish_task_num: 0,
    active_show_time: "即日起"
})

// 计算完成个数与进度条的映射
const progressCount = computed<number>(() => {
    const fullCount = 25
    const accurateCount = (fullCount / 100) * ((initInfo.finish_task_num / 35) * 100)
    const vague = initInfo.finish_task_num > 1 ? Math.trunc(accurateCount) : Number.parseInt(accurateCount.toFixed(0))
    return vague > 35 ? 35 : vague
})

// 计算进度条中间两个数字（15, 25）位的置
const progressNumPos = computed<number[]>(() => {
    const fullCount = 2.1
    const one = (fullCount / 35) * 15 - 0.08
    const two = (fullCount / 35) * 25 - one - (0.08 + 0.16)
    const three = fullCount - one - two - (0.08 + 0.16 + 0.16)
    return [one, two, three]
})

const toastLogin = (): void => {
    showToast({
        className: "vk-toast-fail",
        message: "请您先登录",
        icon: "warning"
    })
}

const getRewardLoading = ref(false)
const takeDialogParams = reactive<Partial<{ type: number; num: number }>>({})
const takeDialogVisible = ref(false)

// 领取活动奖励
const getReward = async (id: number): Promise<void> => {
    const index = activeList.value.findIndex((item) => item.id === id)
    if (id !== 1) {
        if (getRewardLoading.value) return

        getRewardLoading.value = true
        try {
            HttpPlus.setUrlOptions(ApiSetting.active.quartermasterData.takeVB)
            const res = await HttpPlus.sendHttpRequest<{}, { taskid: number }>({ taskid: id + 1 })
            getRewardLoading.value = false

            if (res.status === 1) {
                // 前端更新状态、任务个数、拆礼盒状态
                activeList.value[index].status = 1
                initInfo.finish_task_num = initInfo.finish_task_num + 1
                const timer = setTimeout(() => {
                    activeList.value = formatTaskSink(activeList.value)
                    clearTimeout(timer)
                }, 500)
                // this.initActiveData()
                takeDialogParams.type = 1
                takeDialogParams.num = activeList.value[index].vb
                takeDialogVisible.value = true
            }
        } catch (error: unknown) {
            getRewardLoading.value = false
            console.error(error)
        }
    } else {
        toTask(id)
    }
}

// 做任务
const toTask = (id: number): void => {
    const index = activeList.value.findIndex((item: any) => item.id === id)
    router.push(activeList.value[index].taskUrl)
}

const getSurprisedLoading = ref(false)

class ActiveDrawQmgDayPrize {
    money: number | string
}
/**
 * 领取个数达到后的奖励
 * @param i {Number}
 */
const getSurprised = async (i: number): Promise<void> => {
    if (getSurprisedLoading.value) return

    getSurprisedLoading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.active.quartermasterData.takeSurprised)
        const res = await HttpPlus.sendHttpRequest<ActiveDrawQmgDayPrize, { taskid: number }>({
            taskid: i + 7
        })
        getSurprisedLoading.value = false
        if (res.status === 1 && res.data) {
            rewardList.value[i].status = 1

            takeDialogParams.type = 1
            takeDialogParams.num = +formatNumberSplit(res.data.money)

            takeDialogVisible.value = true
        }
    } catch (error: unknown) {
        getSurprisedLoading.value = false
        console.error(error)
    }
}

class ActiveGetActiveQmgInit extends BaseActiveStruct {
    day_task: {
        vb: number
        data: number
        status: number
        vft?: number
        bet_two_games?: boolean
    }[]

    amg_task: {
        num: number
        status: number
    }[]

    finish_task_num: number
}

const init = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.active.quartermasterData.init)
    const res = await HttpPlus.sendHttpRequest<ActiveGetActiveQmgInit>()

    if (res.status === 1 && res.data) {
        const { data } = res
        const filterData = formatServiceData(data)
        filterData.day_task = formatTaskSink(filterData.day_task)
        activeList.value = [...filterData.day_task]
        rewardList.value = [...filterData.amg_task]
        initInfo.active_show_time = filterData.active_show_time
        initInfo.finish_task_num = filterData.finish_task_num
        initInfo.is_login = filterData.is_login
    }
}

const formatServiceData = <
    T extends { day_task: ActiveGetActiveQmgInit["day_task"]; amg_task: ActiveGetActiveQmgInit["amg_task"] }
>(
    data: T
) => {
    const { day_task, amg_task } = data
    const _day_task =
        day_task && day_task.length
            ? [...activeList.value].map((item, index) => {
                  item.vb = day_task[index].vb
                  item.data = day_task[index].data
                  item.status = day_task[index].status
                  // 任务3：支持V富通转账也算充值
                  if (Object.keys(day_task[index]).includes("vft")) {
                      item.richpayData = day_task[index].vft
                  }
                  // 任务6：支持两种以上不同类型的游戏
                  if (Object.keys(day_task[index]).includes("bet_two_games")) {
                      item.betTwoGames = day_task[index].bet_two_games
                  }
                  return item
              })
            : activeList.value

    const _amg_task =
        amg_task && amg_task.length
            ? [...rewardList.value].map((item, index) => {
                  item.num = amg_task[index].num
                  item.status = amg_task[index].status
                  return item
              })
            : rewardList.value

    return {
        ...data,
        day_task: _day_task as ActiveListItem[],
        amg_task: _amg_task as RewardListItem[]
    }
}

/**
 * 任务下沉
 * @param list
 */
const formatTaskSink = function <T extends { status: number }>(list: T[]): T[] {
    const cloneList = [...list]
    cloneList.sort((a, b) => a.status - b.status)
    return cloneList
}

init()
</script>

<template>
    <div class="bg-#e8f1ef font-classic text-#262933 leading-relaxed!">
        <HeaderBar>
            <div class="header_title">威客军需官</div>
        </HeaderBar>

        <div class="expand-page QuarterMaster">
            <!-- 活动内容文案-->
            <div class="desc-panel">
                <p>完成一定数量的每日任务, 即可免费领取神秘大奖,最高可获得888元</p>
            </div>
            <!-- 活动时间-->
            <div class="date-panel">
                <h3>活动时间: {{ initInfo.active_show_time }}</h3>
            </div>
            <!-- 每日活动-->
            <div class="title-panel active">
                <i></i>
                <h2>
                    每日活动
                    <p>DAILY ACTIVITIES</p>
                </h2>
            </div>
            <ul class="active-detail">
                <li v-for="(item, index) in activeList" :key="index">
                    <div class="left">
                        <i class="icon" :style="{ backgroundImage: `url(${item.iconUrl})` }"></i>
                        <div class="core">
                            <p
                                class="type-desc"
                                v-html="
                                    item.type.includes('{}')
                                        ? item.type.replace(/{}/gi, formatNumberSplit(item.typeAmount, 0))
                                        : item.type
                                "
                            ></p>
                            <p class="result-desc">{{ item.rule }}{{ item.vb }}</p>
                        </div>
                    </div>
                    <div class="right">
                        <template v-if="initInfo.is_login">
                            <!-- 0 未领取  1 已领取-->
                            <!-- <template v-if="item.id === 0">
                <button class="finish">已自动派发</button>
              </template>-->
                            <template v-if="item.id === 1">
                                <button v-if="item.status === 1" class="finish">已自动派发</button>
                                <button v-else @click="getReward(item.id)">
                                    {{ item.btnTxt }}
                                </button>
                            </template>
                            <template v-else>
                                <button v-if="item.status === 1" class="finish">已领取</button>
                                <template v-else>
                                    <!-- V富通转账也算充值-->
                                    <template v-if="item.richpayData !== undefined">
                                        <button
                                            v-if="
                                                item.status === 0 &&
                                                ((item.data > 0 && item.data >= item.typeAmount) ||
                                                    (item.richpayData > 0 && item.richpayData >= item.typeAmount))
                                            "
                                            class="can-do"
                                            @click="getReward(item.id)"
                                        >
                                            领取奖励
                                        </button>
                                        <button
                                            v-else-if="
                                                item.status === 0 &&
                                                ((item.richpayData > 0 && item.richpayData < item.typeAmount) ||
                                                    (item.data > 0 && item.data < item.typeAmount))
                                            "
                                            class="go-on"
                                            @click="toTask(item.id)"
                                        >
                                            继续完成
                                        </button>
                                        <button v-else @click="toTask(item.id)">
                                            {{ item.btnTxt }}
                                        </button>
                                    </template>
                                    <!-- 支持两种以上不同类型的游戏-->
                                    <template v-else-if="item.betTwoGames !== undefined">
                                        <button
                                            v-if="
                                                item.status === 0 &&
                                                item.data > 0 &&
                                                item.data >= item.typeAmount &&
                                                item.betTwoGames
                                            "
                                            class="can-do"
                                            @click="getReward(item.id)"
                                        >
                                            领取奖励
                                        </button>
                                        <button
                                            v-else-if="item.status === 0 && !item.betTwoGames && item.data <= 0"
                                            @click="toTask(item.id)"
                                        >
                                            {{ item.btnTxt }}
                                        </button>
                                        <button v-else @click="toTask(item.id)" class="go-on">继续完成</button>
                                    </template>
                                    <template v-else>
                                        <button
                                            v-if="item.status === 0 && item.data > 0 && item.data < item.typeAmount"
                                            class="go-on"
                                            @click="toTask(item.id)"
                                        >
                                            继续完成
                                        </button>
                                        <button
                                            v-else-if="item.status === 0 && item.data > 0 && item.data >= item.typeAmount"
                                            class="can-do"
                                            @click="getReward(item.id)"
                                        >
                                            领取奖励
                                        </button>
                                        <button v-else @click="toTask(item.id)">
                                            {{ item.btnTxt }}
                                        </button>
                                    </template>
                                </template>
                            </template>
                        </template>
                        <button v-else @click="toastLogin">
                            {{ item.btnTxt }}
                        </button>
                        <span class="contrast">
                            <template v-if="item.type === '签到'">
                                {{ item.tagTip.replace(/{}/gi, formatNumberSplit(item.data, 0)) }}
                            </template>
                            <template v-else-if="item.typeAmount">
                                {{ formatNumberSplit(item.data) }}/{{ formatNumberSplit(item.typeAmount, 0) }}
                            </template>
                        </span>
                    </div>
                </li>
            </ul>
            <!-- 我的奖励-->
            <div class="title-panel reward">
                <i></i>
                <h2>
                    我的奖励
                    <p>MY REWARD</p>
                </h2>
            </div>
            <div class="reward-panel">
                <h3 class="task-count">
                    本周已完成任务数量:
                    <small>{{ initInfo.finish_task_num }}个</small>
                </h3>
                <!-- 进度条-->
                <div class="progress" :class="{ 'has-count': progressCount > 0 }">
                    <i v-for="num in progressCount" :key="num" class="percentage"></i>
                </div>
                <ul class="progress-pointer">
                    <li
                        v-for="(count, index) in [
                            [0, 0],
                            [15, progressNumPos[0]],
                            [25, progressNumPos[1]],
                            [35, progressNumPos[2]]
                        ]"
                        :key="index"
                        :style="{ marginLeft: `${count[1]}rem` }"
                    >
                        {{ count[0] }}
                    </li>
                </ul>
                <!-- 奖励面板-->
                <ul class="reward-detail">
                    <li v-for="(item, index) in rewardList" :key="index" :style="{ backgroundImage: `url(${item.bg})` }">
                        <div class="left">
                            <h2>{{ item.title }}</h2>
                            <h3>{{ item.rule.replace(/{}/gi, `${item.num}`) }}</h3>
                        </div>
                        <div class="right">
                            <template v-if="initInfo.is_login">
                                <button
                                    v-if="item.status === 0 && initInfo.finish_task_num >= item.num"
                                    @click="getSurprised(index)"
                                >
                                    {{ item.btnTxt }}
                                </button>
                                <button v-else class="disabled">{{ item.btnTxt }}</button>
                            </template>
                            <button v-else @click="toastLogin">
                                {{ item.btnTxt }}
                            </button>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- 活动规则-->
            <dl class="rule-panel">
                <dt>活动规则</dt>
                <dd>
                    <ol>
                        <li>每日军需任务完成后，需在活动页面领取奖励，未领取则视为主动放弃；</li>
                        <li>军需礼物可以累计领取，完成35次军需任务可以领取全部三份军需礼物（彩金需完成1倍流水才能提款）；</li>
                        <li>每周日凌晨24:00，军需任务累计数量清零。未领取的每日任务奖励和军需礼物视为放弃；</li>
                        <li>
                            V富通单日累计转账100元-500元至主钱包亦可视为每日充值任务达标（需满足V富通存款时间不低于6小时并领取V富通转账红包）；
                        </li>
                        <li>两种不同类型的游戏即电竞，体育，真人，电子，棋牌等大类。同类型下不同游戏不计算在本活动内；</li>
                        <li>
                            电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                            <span
                                @click="
                                    () => {
                                        systemParams.ActiveMoreRules.classname = 'quartermaster-style-class'
                                        systemParams.ActiveMoreRules.isShow = true
                                    }
                                "
                                class="underline"
                            >
                                查看详情
                            </span>
                            ；
                        </li>
                        <li>
                            每位有效玩家、每个手机号码、电子邮箱、IP地址、每张银行卡、每台设备只能享受一次优惠，如发现有违规者我们将保留无限期审核和扣回红利及所产生的利润权利。VKGAME对本活动保有最终解释权；
                        </li>
                    </ol>
                </dd>
            </dl>
        </div>
        <van-dialog v-model:show="takeDialogVisible" :showConfirmButton="false" class="quartermaster-dialog" teleport="body">
            <div class="dialog-main">
                <i class="close" @click="takeDialogVisible = false"></i>

                <i class="reward-type" :class="takeDialogParams.type === 1 ? 'vb' : 'red-paper'"></i>
                <h2 class="font-bold">领取成功</h2>
                <p v-if="takeDialogParams.type === 1">{{ takeDialogParams.num }}V币已派发，请注意查收</p>
                <p v-else>{{ takeDialogParams.num }}元现金红包已派发至主钱包，请注意查收</p>
                <button @click="takeDialogVisible = false">我知道了</button>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss" scoped>
.QuarterMaster {
    padding-bottom: 0.25rem;
    background: url("@/assets/img/active/general/quartermaster/bg.jpg") center top no-repeat;
    background-size: 100% auto;
    padding-top: 1.38rem;
    line-height: 1.6;
    .desc-panel {
        text-align: center;
        font-size: 0.12rem;
        line-height: 0.24rem;
        color: #e1e1e1;
    }
    .date-panel {
        margin-top: 0.08rem;
        font-size: 0.12rem;
        line-height: 0.12rem;
        text-align: center;
        color: #e1e1e1;
        * {
            font-weight: normal;
            font-size: 0.12rem;
            line-height: 0.12rem;
        }
    }
    .title-panel {
        height: 0.55rem;
        background: url("@/assets/img/active/general/quartermaster/title_bg.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
            display: block;
            width: 0.38rem;
            height: 0.33rem;
            margin-right: 0.07rem;
        }
        h2 {
            font-size: 0.17rem;
            font-weight: bold;
            line-height: 0.17rem;
            color: #fff;
            p {
                margin-top: 0.05rem;
                font-size: 0.1rem;
                line-height: 0.1rem;
                color: #fff;
                font-weight: normal;
            }
        }
        &.active {
            margin-top: 0.31rem;
            i {
                background: url("@/assets/img/active/general/quartermaster/active_icon.png") no-repeat;
                background-size: 100% 100%;
            }
        }
        &.reward {
            margin-top: 0.3rem;
            i {
                background: url("@/assets/img/active/general/quartermaster/reward_icon.png") no-repeat;
                background-size: 100% 100%;
            }
        }
    }
    .active-detail {
        width: calc(100% - 0.3rem);
        margin: 0.3rem auto 0;
        li {
            width: 100%;
            height: 0.65rem;
            margin-bottom: 0.14rem;
            background: url("@/assets/img/active/general/quartermaster/active_bg.png") no-repeat;
            background-size: 100% 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            &:last-child {
                margin-bottom: 0;
            }
            .left {
                margin-left: 0.26rem;
                .icon {
                    display: inline-block;
                    width: 0.29rem;
                    height: 0.29rem;
                    margin-right: 0.08rem;
                    background-size: 100% 100%;
                }
                .core {
                    display: inline-block;
                    vertical-align: bottom;
                    .type-desc {
                        font-size: 0.12rem;
                        line-height: 0.16rem;
                        color: #fff;
                    }
                    .result-desc {
                        margin-top: 0.05rem;
                        font-size: 0.12rem;
                        font-weight: bold;
                        line-height: 0.12rem;
                        color: #fff;
                    }
                }
            }
            .right {
                margin-right: 0.26rem;
                button {
                    width: 0.725rem;
                    height: 0.225rem;
                    border-radius: 0.025rem;
                    background-color: #f07a3a;
                    border: 0;
                    outline: 0;
                    font-size: 0.12rem;
                    font-weight: bold;
                    line-height: 0.225rem;
                    color: #fff;
                    &.go-on {
                        background-color: #67af4a;
                    }
                    &.can-do {
                        background-color: #ff5a04;
                    }
                    &.finish {
                        background-color: #919191;
                    }
                }
                .contrast {
                    position: absolute;
                    width: 0.775rem;
                    right: 0.235rem;
                    bottom: 0.05rem;
                    text-align: center;
                    font-size: 0.1rem;
                    line-height: 0.1rem;
                    color: #fff;
                }
            }
        }
    }

    .reward-panel {
        margin-top: 0.19rem;
        width: 100%;
        height: 5.31rem;
        background: url("@/assets/img/active/general/quartermaster/reward_bg.png") no-repeat;
        background-size: 100% 100%;
        overflow: hidden;
        .task-count {
            margin-top: 0.115rem;
            font-size: 0.1rem;
            line-height: 0.1rem;
            text-align: center;
            color: #fff;
            small {
                font-size: 0.1rem;
                line-height: 0.1rem;
                font-weight: bold;
                color: #ff5a04;
            }
        }
        .progress {
            margin: 0.11rem auto 0;
            width: 2.2rem;
            height: 0.175rem;
            position: relative;
            &.has-count {
                &:before {
                    position: absolute;
                    content: "";
                    top: 0.01rem;
                    left: 0;
                    width: 0.165rem;
                    height: 0.145rem;
                    background: url("@/assets/img/active/general/quartermaster/count_before.png");
                    background-size: 100% 100%;
                }
            }
            .percentage {
                display: inline-block;
                margin-left: -0.02rem;
                margin-top: 0.01rem;
                width: 0.1rem;
                height: 0.145rem;
                background: url("@/assets/img/active/general/quartermaster/progress_pointer.png") repeat no-repeat;
                background-position: left center;
                background-size: 100% 100%;
                &:first-child {
                    margin-left: 0.14rem;
                }
            }
        }
        .progress-pointer {
            width: 2.1rem;
            height: 0.1rem;
            margin: 0 auto;
            white-space: nowrap;
            li {
                display: inline-block;
                font-size: 0.1rem;
                font-weight: bold;
                height: 0.1rem;
                line-height: 0.1rem;
                color: #1aaff8;
            }
        }
        .reward-detail {
            width: calc(100% - 0.3rem);
            margin: 0.36rem auto 0;
            li {
                width: 100%;
                height: 1.105rem;
                background-size: 100% 100%;
                margin-bottom: 0.35rem;
                display: flex;
                &:last-child {
                    margin-bottom: 0;
                }
                .left {
                    width: 1.15rem;
                    height: 0.285rem;
                    margin-left: 1.34rem;
                    h2 {
                        margin-top: 0.45rem;
                        font-size: 0.12rem;
                        line-height: 0.12rem;
                        color: #00deff;
                        font-style: italic;
                    }
                    h3 {
                        margin-top: 0.1rem;
                        font-size: 0.1rem;
                        line-height: 0.1rem;
                        font-weight: bold;
                        color: #fff;
                        text-decoration: underline;
                    }
                }
                .right {
                    button {
                        margin-top: 0.5rem;
                        width: 0.725rem;
                        height: 0.225rem;
                        line-height: 0.225rem;
                        border-radius: 0.031rem;
                        background-color: #ff5a04;
                        font-size: 0.12rem;
                        font-weight: bold;
                        color: #fff;
                        outline: 0;
                        border: 0;
                        &.disabled {
                            background-color: #919191;
                        }
                    }
                }
            }
        }
    }

    .rule-panel {
        margin: 0.3rem 0.15rem 0 0.3rem;
        width: calc(100% - 0.45rem);
        color: #00fcff;
        dt {
            text-align: center;
            font-size: 0.15rem;
            font-weight: bold;
            line-height: 0.15rem;
        }
        dd {
            margin-top: 0.125rem;
            ol {
                li {
                    font-size: 0.13rem;
                    line-height: 0.2rem;
                    list-style: decimal;
                }
            }
        }
    }
}
</style>
<style lang="scss">
.van-dialog.quartermaster-dialog {
    width: 2.075rem;
    height: 1.76rem;
    background: url("@/assets/img/active/general/quartermaster/dialog_bg.png") no-repeat;
    background-size: 100% 100%;
    .dialog-main {
        position: relative;
        overflow: hidden;
        .close {
            position: absolute;
            top: 0.12rem;
            right: 0.17rem;
            display: block;
            width: 0.165rem;
            height: 0.165rem;
            background: url("@/assets/img/active/general/quartermaster/dialog_close.png") no-repeat;
            background-size: 100% 100%;
        }
        .reward-type {
            display: block;
            width: 0.3rem;
            height: 0.3rem;
            margin: 0.2rem auto 0;
            &.vb {
                background: url("@/assets/img/active/general/quartermaster/dialog_vb.png") no-repeat;
                background-size: 100% 100%;
            }
            &.red-paper {
                background: url("@/assets/img/active/general/quartermaster/dialog_red_paper.png") no-repeat;
                background-size: 100% 100%;
            }
        }
        h2 {
            margin-top: 0.07rem;
            font-size: 0.15rem;
            line-height: 0.15rem;
            text-align: center;
            color: #fff;
        }
        p {
            margin-top: 0.12rem;
            padding: 0 0.27rem;
            height: 0.38rem;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 0.15rem;
            line-height: 0.19rem;
            text-align: center;
            color: #fff;
        }
        button {
            display: block;
            width: 0.73rem;
            height: 0.23rem;
            margin: 0.08rem auto 0;
            border-radius: 0.025rem;
            background-color: #ff5a04;
            font-size: 0.12rem;
            font-weight: bold;
            color: #fff;
            border: 0;
            outline: 0;
        }
    }
}
</style>
