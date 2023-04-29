<script setup lang="ts">
import ApiSetting from "@/api/service"
import { ref, computed, watch, reactive } from "vue"
import { useSysStore } from "@/stores/system"
import { showToast } from "vant"
import { formatNumberSplit } from "@/utils/numberUtils"
import { ActiveJoinSpecialVenue } from "@/api/pojo/active/ActiveJoinSpecialVenue"
import { HttpPlus } from "@/api/HttpPlus"
import type { InferArray } from "@/types"

const systemParams = useSysStore()

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
    (e: "receive-bonus", args: { walletList: { money_code: string; title: string }[]; leval: number }): void
    (
        e: "send-data",
        args: { date: ActiveJoinSpecialVenue["active_show_time"]; bulletList: ActiveJoinSpecialVenue["bullet_screen"] }
    ): void
}

const emit = defineEmits<Emits>()

const stepBarList = [
    { amount: 100, bonus: "1.8~188" },
    { amount: 1000, bonus: "8.8~888" },
    { amount: 5000, bonus: "12.8~1888" },
    { amount: 10000, bonus: "18.8~3888" },
    { amount: 30000, bonus: "58.8~8888" }
]

const remainingAmount = computed<number>(() => {
    return initInfo.value.my_deposit - initInfo.value.my_transfer
})

const more = (): void => {
    systemParams.ActiveMoreRules.classname = "PlayGround"
    systemParams.ActiveMoreRules.isShow = true
}

const transferDialogRow = reactive<
    Partial<{
        walletList: Props["gameVenuesList"][number]["game_list"]
        quickAmountList: InferArray<typeof stepBarList>[]
        transferableAmount: number
        activeId: number
    }>
>({})

// 弹窗
// 快捷金额处理
const quickList = computed<{ title?: string; amount: number; bonus?: string }[]>(() => {
    if (!transferDialogRow.quickAmountList) return []

    const backList: { title?: string; amount: number; bonus?: string }[] = [...transferDialogRow.quickAmountList]

    if (backList.length <= 0) {
        backList.push({
            amount: transferDialogRow.transferableAmount,
            title: "全部"
        })
    } else {
        if (backList.length < 5 && transferDialogRow.transferableAmount > backList[backList.length - 1].amount) {
            backList.push({
                amount: transferDialogRow.transferableAmount,
                title: "全部"
            })
        }
    }
    return backList
})

const checkedWalletIndex = ref(0)
const transferAmount = ref("")
const submitLoading = ref(false)

const submitTransfer = async (): Promise<void> => {
    if (submitLoading.value) {
        showToast({
            className: "vk-toast-fail",
            message: "提交中，请稍等...",
            icon: "warning"
        })
        return
    }
    if (+transferAmount.value > transferDialogRow.transferableAmount) {
        showToast({
            className: "vk-toast-fail",
            message: "首充金额不足，请先充值",
            icon: "warning"
        })
        return
    }
    if (typeof +transferAmount.value !== "number") {
        showToast({
            className: "vk-toast-fail",
            message: "请输入转账金额",
            icon: "warning"
        })
        return
    }
    if (+transferAmount.value <= 0) {
        showToast({
            className: "vk-toast-fail",
            message: "转账金额有误，请重新输入",
            icon: "warning"
        })
        return
    }
    submitLoading.value = true
    // 针对 PTSLOT 单独处理
    const toParams: { to: string; active_type?: "PTSLOT" } = {
        to: transferDialogRow.walletList[checkedWalletIndex.value].money_code
    }
    if (toParams.to === "PTSLOT") {
        toParams.active_type = toParams.to
        toParams.to = "PT"
    }

    const params = {
        from: "NM",
        ...toParams,
        money: +transferAmount.value,
        active_id: transferDialogRow.activeId
    }
    try {
        HttpPlus.setUrlOptions(ApiSetting.user.transferSubmit)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        submitLoading.value = false
        if (res.status === 1) {
            init()
            transferVisible.value = false
            showToast({
                className: "vk-toast-success",
                message: `${transferAmount.value}元已成功转入您的${
                    transferDialogRow.walletList[checkedWalletIndex.value].title
                }钱包`,
                icon: "checked"
            })
        }
    } catch (error: unknown) {
        submitLoading.value = false
        console.error(error)
    }
}

// 当前点击后所显示的场馆索引
const gameVenuesIndex = ref(0)

const initInfo = ref<ActiveJoinSpecialVenue>(new ActiveJoinSpecialVenue())

const transferVisible = ref(false)

watch(transferVisible, (val: boolean) => {
    if (val) {
        checkedWalletIndex.value = 0
        transferAmount.value = ""
    }
})

// 选择的场馆抖动提示
const currentPlaygroundShake = ref(false)

// 计算步骤条节点状态 0: 不可领取 1: 已领取 2: 可领取
const calcPointStatus = (index: number): 0 | 1 | 2 => {
    // 没有转账场馆
    if (initInfo.value.my_venue <= 0) return 0
    // 转账金额为0
    if (initInfo.value.my_deposit <= 0) return 0
    // 当前点击显示的场馆不是转账场馆
    if (gameVenuesIndex.value !== initInfo.value.my_venue - 1) return 0

    // 转账金额大于当前节点的金额
    if (initInfo.value.my_transfer >= stepBarList[index >= stepBarList.length ? index - 1 : index].amount) {
        // 真人场馆最后一个节点可以领取两次
        if (index === stepBarList.length - 1 && initInfo.value.my_venue === 1 && initInfo.value.my_joins - 1 === index) {
            return 2
        } else {
            if (initInfo.value.my_joins - 1 >= index) {
                return 1
            } else {
                return 2
            }
        }
    } else {
        // 转账金额小于当前节点的金额，当前节点为不可领取
        return 0
    }
}

const speedOfProgress = computed<number>(() => {
    // 没有转账场馆
    if (initInfo.value.my_venue <= 0) return 0
    // 转账金额为0
    if (initInfo.value.my_deposit <= 0) return 0
    // 当前点击显示的场馆不是转账场馆
    if (gameVenuesIndex.value !== initInfo.value.my_venue - 1) return 0

    const totalLen = 4.66
    let receiveIndex = 0
    // 计算可领取的节点下标
    stepBarList.forEach((item, index) => {
        if (initInfo.value.my_transfer >= item.amount) {
            receiveIndex = index
        }
    })

    return (totalLen / (stepBarList.length - 1)) * receiveIndex
})

const showDoule = (index: number): boolean => {
    if (props.gameVenuesList && props.gameVenuesList.length && props.gameVenuesList[gameVenuesIndex.value]) {
        return props.gameVenuesList[gameVenuesIndex.value]?.title === "真人场馆" && index === stepBarList.length - 1
    }
    return false
}

// 点击立即转账
const openTransferDialog = (): void => {
    if (!initInfo.value.is_login) {
        showToast({
            className: "vk-toast-fail",
            message: "请您先登录",
            icon: "warning"
        })
        return
    }
    if (initInfo.value.my_venue > 0 && gameVenuesIndex.value !== initInfo.value.my_venue - 1) {
        showToast({
            className: "vk-toast-fail",
            message: `您今日已选择${props.gameVenuesList[initInfo.value.my_venue - 1].title}，不可向其他场馆转账`,
            icon: "warning"
        })
        shakeMethod()
        return
    }
    // 后端提示前置
    if (initInfo.value.status !== 0) {
        showToast({
            className: "vk-toast-fail",
            message: initInfo.value.status_tips,
            icon: "warning"
        })
        return
    }
    if (initInfo.value.my_deposit < stepBarList[0].amount) {
        showToast({
            className: "vk-toast-fail",
            message: "请先完成活动首充要求",
            icon: "warning"
        })
        return
    }
    transferDialogRow.walletList = props.gameVenuesList[gameVenuesIndex.value].game_list
    transferDialogRow.quickAmountList = stepBarList.filter((item) => remainingAmount.value >= item.amount)
    transferDialogRow.transferableAmount = remainingAmount.value
    transferDialogRow.activeId = initInfo.value.active_id

    transferVisible.value = true
}

// 点击红包领取彩金
const receiveBonus = (index: number): void => {
    if (!initInfo.value.is_login) {
        showToast({
            className: "vk-toast-fail",
            message: "请您先登录",
            icon: "warning"
        })
        return
    }
    // 可领取 和 不可领取 都能点击
    if (calcPointStatus(index) !== 1) {
        if (initInfo.value.my_venue > 0 && gameVenuesIndex.value !== initInfo.value.my_venue - 1) {
            showToast({
                className: "vk-toast-fail",
                message: `您今日已选择${props.gameVenuesList[initInfo.value.my_venue - 1].title}，不可申请此优惠`,
                icon: "warning"
            })
            shakeMethod()
            return
        }
        // 后端提示前置
        if (initInfo.value.bonus_status !== 0) {
            showToast({
                className: "vk-toast-fail",
                message: initInfo.value.bonus_status_tips,
                icon: "warning"
            })
            return
        }
        // 按顺序领取
        if (index > 0) {
            for (let i = 0; i < index; i++) {
                if (calcPointStatus(i) === 2) {
                    showToast({
                        className: "vk-toast-fail",
                        message: "请按照顺序依次领取",
                        icon: "warning"
                    })
                    return
                }
            }
        }
        emit("receive-bonus", {
            walletList: props.gameVenuesList[gameVenuesIndex.value].game_list,
            leval: index + 1
        })
    }
}

const shakeMethod = (): void => {
    currentPlaygroundShake.value = true
    let timer = setTimeout(() => {
        currentPlaygroundShake.value = false
        clearTimeout(timer)
    }, 300)
}

const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.playgroundActive.initRedPacketActive)
    const res = await HttpPlus.sendHttpRequest<ActiveJoinSpecialVenue>()
    systemParams.PageLoading = false
    if (res.status === 1 && res.data) {
        emit("send-data", {
            date: res.data.active_show_time,
            bulletList: res.data.bullet_screen
        })
        // 已发起过转账
        if (res.data.my_venue > 0) {
            gameVenuesIndex.value = res.data.my_venue - 1
        }
        initInfo.value = res.data
    }
}

defineExpose({ init })

init()
</script>

<template>
    <div class="red-packet-for-playground">
        <h6 class="active-content">活动期间，会员每日完成首充≥100元并转至以下场馆，即可获得抽红包机会，最高可获得8888元现金！</h6>

        <!-- 选择场馆-->
        <ul v-if="gameVenuesList?.length" class="game-venues">
            <li
                v-for="(item, index) in gameVenuesList"
                :key="index"
                @click="gameVenuesIndex = index"
                :class="[
                    { active: gameVenuesIndex === index },
                    { shake: index === initInfo.my_venue - 1 && currentPlaygroundShake }
                ]"
            >
                {{ item.title }}
            </li>
        </ul>

        <!-- 步骤条面板-->
        <div class="step-panel">
            <div class="step-panel-scroll">
                <div class="step-container">
                    <div :style="{ width: `${speedOfProgress}rem` }" class="progress"></div>

                    <ul class="point-container">
                        <li
                            v-for="(item, index) in stepBarList"
                            :key="index"
                            :class="[
                                { can: calcPointStatus(index) === 2 },
                                { received: calcPointStatus(index) === 1 },
                                { double: showDoule(index) }
                            ]"
                        >
                            <i></i>
                            <p>{{ formatNumberSplit(item.amount, 0) }}元</p>
                            <div class="red-packet" @click="receiveBonus(index)">
                                <span>{{ item.bonus }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <p class="money-tips amount">
            <span>
                今日累计首充转账金额：
                <template v-if="initInfo.is_login">{{ formatNumberSplit(initInfo.my_transfer) }}元</template>
                <template v-else>--</template>
            </span>
        </p>

        <!-- 首充转账按钮-->
        <div class="btn-area">
            <router-link
                v-if="initInfo.my_deposit < stepBarList[stepBarList.length - 1].amount"
                to="/finance/deposit"
                class="btn deposit"
            ></router-link>
            <button @click="openTransferDialog" class="btn transfer"></button>
        </div>

        <p class="money-tips require"><span>红包流水要求：8倍流水</span></p>

        <dl class="rules">
            <dt></dt>
            <dd>
                <ul>
                    <li>
                        <i>1</i>
                        <p>每日充值在未发起提现前都视为首充；若在申请此优惠前将存款从主钱包转出或发起提现，则不可申请此优惠。</p>
                    </li>
                    <li>
                        <i>2</i>
                        <p>
                            用户首存≥100元，在本活动页面选择对应场馆（真人场馆、棋牌场馆、电子场馆三选一）的游戏钱包完成转账，即可获得1次机会；如当日抽红包次数未使用，则隔日累计无效。
                        </p>
                    </li>
                    <li>
                        <i>3</i>
                        <p>
                            若当日选择真人场馆，则当日可获抽红包上限次数为：6次；真人奖励翻倍x2：真人场馆完成5个抽红包阶段时，会额外获得1次机会。
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
                            活动彩金在领取成功后，将会自动添加至会员所选择的游戏钱包场馆中；需要完成此活动指定的8倍有效流水。当用户对应游戏钱包余额＜最低投注额且无未结算注单时，系统将自动判定已完成活动规定的有效流水。该活动流水未完成前不可再次申请。
                        </p>
                    </li>
                    <li>
                        <i>6</i>
                        <p>
                            此活动领取当天不与平台的真人首存类，棋牌首存类、电玩首存类活动共享；有效流水仅计算产生输赢结果的注单；注单取消、对冲、未结算，PT电子游戏中以下游戏不算有效流水：
                            <span @click="more">查看详情</span>
                            。
                        </p>
                    </li>
                    <li>
                        <i>7</i>
                        <p>
                            每位有效玩家、每个手机号码、电子邮箱、IP地址、每张银行卡、每台设备只能享受一次优惠，参与用户必须先绑定银行卡。对违规的用户，VKGAME保留无期限审核，和扣回红利及产生的利润权利。本活动最终解释权归VKGAME所有。
                        </p>
                    </li>
                </ul>
            </dd>
        </dl>

        <!-- 转账dialog-->
        <van-dialog
            v-model:show="transferVisible"
            class="transfer-for-playground"
            teleport="body"
            :close-on-click-overlay="true"
            :show-confirm-button="false"
            @close="transferVisible = false"
        >
            <div class="transfer-playground" :class="{ disabled: submitLoading }">
                <i @click="transferVisible = false" class="close"></i>

                <div class="transfer-form">
                    <!-- 选择场馆-->
                    <div class="form-item">
                        <h5 class="title">请选择场馆</h5>
                        <div class="pro">
                            <ul class="wallet-list" v-if="transferDialogRow?.walletList.length">
                                <li
                                    v-for="(item, index) in transferDialogRow?.walletList"
                                    :key="index"
                                    @click="checkedWalletIndex = index"
                                    :class="{ active: checkedWalletIndex === index }"
                                >
                                    {{ item.title }}钱包
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- 金额-->
                    <div class="form-item amount">
                        <h5 class="title">请输入金额（元）</h5>
                        <div class="pro">
                            <div class="input-box">
                                <van-field v-model="transferAmount" type="number" placeholder="请输入金额" />
                            </div>

                            <!-- 金额快捷键-->
                            <ul class="shortcut-btn">
                                <li v-for="(item, index) in quickList" :key="index" @click="transferAmount = item.amount">
                                    <template v-if="item.title">
                                        {{ item.title }}
                                    </template>
                                    <template v-else>
                                        {{ formatNumberSplit(item.amount, 0) }}
                                    </template>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <button @click="submitTransfer" class="transfer-btn"></button>

                <p class="transferable-tips">
                    今日剩余可转入首充金额：
                    <span>{{ formatNumberSplit(transferDialogRow?.transferableAmount, 0) }}元</span>
                </p>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss" scoped>
@import "playground.scss";
.red-packet-for-playground {
    .game-venues {
        margin: 0.3rem auto 0;
        display: flex;
        justify-content: space-evenly;
        li {
            width: 1.05rem;
            height: 0.36rem;
            font-size: 0.14rem;
            text-align: center;
            line-height: 0.34rem;
            box-sizing: border-box;
            color: #fbde96;
            border: 0.01rem solid transparent;
            background-image: linear-gradient(#000000, #000000), linear-gradient(#f2dea8, #930403);
            background-origin: border-box;
            background-clip: content-box, border-box;
            transition: all 0.2s;
            &.active {
                background-image: linear-gradient(#8e2324, #8e2324), linear-gradient(#930403, #f2dea8);
                box-shadow: 0 0.06rem 0.09rem 0 rgba(0, 0, 0, 0.35), inset 0 0.015rem 0.035rem 0 rgba(0, 0, 0, 0.4);
            }
            &.shake {
                animation: shake-animate 0.3s;
            }
            @keyframes shake-animate {
                0% {
                    transform: translateX(0);
                }
                10% {
                    transform: translateX(0.04rem);
                }
                30% {
                    transform: translateX(-0.04rem);
                }
                50% {
                    transform: translateX(0.04rem);
                }
                70% {
                    transform: translateX(-0.04rem);
                }
                90% {
                    transform: translateX(0.04rem);
                }
                100% {
                    transform: translateX(0);
                }
            }
        }
    }

    .step-panel {
        margin: 0.12rem auto 0;
        width: 3.75rem;
        height: 1.75rem;
        background: url("@/assets/img/active/special/playground/step_panel_bg.png");
        background-size: 100% 100%;
        .step-panel-scroll {
            width: 3.65rem;
            height: inherit;
            margin: 0 auto;
            overflow-x: auto;
            overflow-y: hidden;
            .step-container {
                margin: 0.25rem 0.36rem 0;
                width: 4.7rem;
                height: 0.16rem;
                border-radius: 0.08rem;
                box-shadow: 0px 0 0.02rem 0 rgba(255, 255, 255, 0.2), inset 0px 1px 0.015rem 0 rgba(0, 0, 0, 0.4);
                border: solid 0.005rem rgba(0, 0, 0, 0.06);
                background-color: #000;
                position: relative;

                .progress {
                    position: absolute;
                    top: 0.02rem;
                    left: 0.02rem;
                    height: 0.12rem;
                    border-radius: 0.06rem;
                    box-shadow: 0 0.06rem 0.09rem 0 rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
                    background-image: linear-gradient(to top, #761b1c, #ba3234);
                    transition: width 0.3s;
                }

                .point-container {
                    z-index: 1;
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    li {
                        width: 0.2rem;
                        margin-top: -0.02rem;
                        i {
                            display: block;
                            width: inherit;
                            height: 0.2rem;
                            border-radius: 0.1rem;
                            box-shadow: 0 0.06rem 0.09rem 0 rgba(0, 0, 0, 0.35), inset 0 0.015rem 0.035rem 0 rgba(0, 0, 0, 0.4);
                            border: 0.01rem solid transparent;
                            box-sizing: border-box;
                            border-image-slice: 1;
                            background-image: linear-gradient(to bottom, #8e2324, #8e2324),
                                linear-gradient(to top, #930403, #f2dea8);
                            background-origin: border-box;
                            background-clip: content-box, border-box;
                        }
                        p {
                            color: #fbde96;
                            margin-left: -0.35rem;
                            margin-top: 0.16rem;
                            font-family: Roboto;
                            font-size: 0.12rem;
                            width: 0.9rem;
                            text-align: center;
                        }
                        .red-packet {
                            border-top: 0.1px solid transparent;
                            margin-left: -0.35rem;
                            margin-top: 0.01rem;
                            width: 0.9rem;
                            height: 0.98rem;
                            text-align: center;
                            background: url("@/assets/img/active/special/playground/red_packet_disabled.png");
                            background-size: 100% 100%;
                            span {
                                display: block;
                                margin-top: 0.58rem;
                                font-family: Roboto;
                                font-size: 0.12rem;
                                background-image: linear-gradient(to bottom, #ffffff, #adadad);
                                -webkit-background-clip: text;
                                background-clip: text;
                                -webkit-text-fill-color: transparent;
                            }
                        }
                        &.can {
                            p {
                                color: #ffffff;
                            }
                            .red-packet {
                                background: url("@/assets/img/active/special/playground/red_packet.png");
                                background-size: 100% 100%;
                                span {
                                    background-image: linear-gradient(to bottom, #ffffff, #fff69d);
                                }
                            }
                        }
                        &.received {
                            .red-packet {
                                background: url("@/assets/img/active/special/playground/red_packet_received.png");
                                background-size: 100% 100%;
                                position: relative;
                                span {
                                    background-image: linear-gradient(to bottom, #ffffff, #fff69d);
                                }
                                &::before {
                                    position: absolute;
                                    top: 0.06rem;
                                    left: 0;
                                    width: 100%;
                                    text-align: center;
                                    content: "已领取";
                                    font-size: 0.12rem;
                                    color: #b64a47;
                                    pointer-events: none;
                                }
                            }
                        }
                        &.double {
                            .red-packet {
                                position: relative;
                                &::after {
                                    position: absolute;
                                    content: "";
                                    top: -0.09rem;
                                    right: -0.05rem;
                                    width: 0.4rem;
                                    height: 0.4rem;
                                    background: url("@/assets/img/active/special/playground/bonus_double.png");
                                    background-size: 100% 100%;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .money-tips {
        width: max-content;
        margin: 0 auto;
        position: relative;
        &::after {
            position: absolute;
            content: "";
            left: 0;
            bottom: 0.02rem;
            width: 100%;
            height: 0.075rem;
            background-color: #8e2324;
        }
        span {
            position: relative;
            z-index: 2;
            font-family: Roboto;
            font-size: 0.17rem;
            color: #fff;
        }
    }

    .amount {
        margin: 0.14rem auto 0;
    }

    .btn-area {
        margin-top: 0.18rem;
        display: flex;
        justify-content: center;
        .btn {
            width: 1.73rem;
            height: 0.68rem;
            margin: 0 0.04rem;
            border: 0;
            outline: 0;
            transition: filter 0.1s;
            &:active {
                filter: saturate(130%);
            }
        }
        .deposit {
            background: transparent url("@/assets/img/active/special/playground/deposit_btn.png");
            background-size: 100% 100%;
        }
        .transfer {
            background: transparent url("@/assets/img/active/special/playground/transfer_btn.png");
            background-size: 100% 100%;
        }
    }

    .require {
        margin: 0.01rem auto 0;
    }

    .rules {
        margin: 0.24rem auto 0;
        dd {
            height: 7.86rem;
            background: transparent url("@/assets/img/active/special/playground/active_1_rule.png");
            background-size: 100% 100%;
            ul {
                li {
                    margin-top: 0.1rem !important;
                    &:first-child {
                        margin-top: 0.17rem !important;
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.van-dialog.transfer-for-playground {
    top: 52%;
    width: 3.5rem;
    max-width: 100vw;
    background: #191211 url("@/assets/img/active/special/playground/transfer_for_playground_title.png") no-repeat center top;
    background-size: 101% auto;
    border: solid 0.01rem #c83934;
    box-sizing: border-box;
    border-radius: 0;
    overflow: visible;
    line-height: 1.6;
}
</style>
