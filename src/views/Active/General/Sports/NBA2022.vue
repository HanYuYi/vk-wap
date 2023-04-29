<script setup lang="ts">
import ApiSetting from "@/api/service"
import { useSysStore } from "@/stores/system"
import { computed, unref, ref } from "vue"
import { showToast } from "vant"
import { formatNumberSplit } from "@/utils/numberUtils"
import type { BaseActiveStruct } from "@/api/pojo/BaseStruct"
import type { ActiveGetChessCardsFirstRechargeInit } from "@/api/pojo/active/ActiveGetChessCardsFirstRechargeInit"
import { HttpPlus } from "@/api/HttpPlus"
import { ActiveGetNbaBetReturnInit } from "@/api/pojo/active/ActiveGetNbaBetReturnInit"
import { ActiveGetNbaProfitReturnInit } from "@/api/pojo/active/ActiveGetNbaProfitReturnInit"

const systemParams = useSysStore()

const NAV_MENU = [
    { key: "bet", label: "(投注)返利不停" },
    { key: "bonus", label: "(盈利)喜上加喜" }
]

const initDataBet = ref<ActiveGetNbaBetReturnInit>(new ActiveGetNbaBetReturnInit())

type WalletList = ActiveGetChessCardsFirstRechargeInit["walletList"]

class ActiveGetNba2022Init {
    active_id: BaseActiveStruct["active_id"]

    active_show_time: BaseActiveStruct["active_show_time"]

    wallet_list: WalletList
}

const showTime = ref("即日起")
const activeId = ref(0)
const activeNav = ref(0)
const showDio = ref(false)

const walletIndex = ref(0)
const walletList = ref<WalletList>([])

const walletCode = computed<WalletList[number]["code"]>(() => {
    return walletList.value[walletIndex.value].code
})

const confirmLoading = ref(false)

const init = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.active.nba2022.getNbaInit)
    const res = await HttpPlus.sendHttpRequest<ActiveGetNba2022Init>()
    if (res.status === 1 && res.data) {
        showTime.value = res.data.active_show_time
        activeId.value = res.data.active_id
        if (res.data.wallet_list.length) {
            walletList.value = res.data.wallet_list
        }
    }
    initBet()
    initWin()
}

const loadBet = ref(false)
const modiStatus = ref(0)

// 投注初始化
const initBet = async (): Promise<void> => {
    if (loadBet.value) return

    loadBet.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.active.nba2022.getNbaBetInit)
        const res = await HttpPlus.sendHttpRequest<ActiveGetNbaBetReturnInit>()
        loadBet.value = false
        if (res.status === 1 && res.data) {
            if (res.status === 1 && res.data) {
                initDataBet.value = res.data
                modiStatus.value = 0
            }
        }
    } catch (error: unknown) {
        loadBet.value = false
        console.error(error)
    }
}

const loadWin = ref(false)

const initDataWin = ref<ActiveGetNbaProfitReturnInit>(new ActiveGetNbaProfitReturnInit())

// 盈利初始化
const initWin = async (): Promise<void> => {
    if (loadWin.value) return

    loadWin.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.active.nba2022.getNbaWinInit)
        const res = await HttpPlus.sendHttpRequest<ActiveGetNbaProfitReturnInit>()
        loadWin.value = false
        if (res.status === 1 && res.data) {
            initDataWin.value = res.data
            modiStatus.value = 0
        }
    } catch (error: unknown) {
        loadWin.value = false
        console.error(error)
    }
}

const activeBetLimit = computed<number>(() => {
    return activeNav.value == 0 ? initDataBet.value.active_bet_limit : initDataWin.value.active_bet_limit
})

const todayBonus = computed<number>(() => {
    return activeNav.value == 0 ? initDataBet.value.today_bonus : initDataWin.value.today_bonus
})

// 状态： 0  可领   1 已领取 2 昨日未达到领取条件  *** 其他状态
const receiveStatus = computed<number>(() => {
    return activeNav.value == 0 ? initDataBet.value.status : initDataWin.value.status
})

const yesterdayAmount = computed<number>(() => {
    return activeNav.value == 0 ? initDataBet.value.yesterday_bet : initDataWin.value.yesterday_profit
})
const activeType = computed<number>(() => {
    return activeNav.value == 0 ? initDataBet.value.active_type : initDataWin.value.active_type
})
const statusTips = computed<string>(() => {
    return activeNav.value == 0 ? initDataBet.value.status_tips : initDataWin.value.status_tips
})

const transfer = async (): Promise<void> => {
    if (confirmLoading.value) return

    confirmLoading.value = true
    try {
        const params = {
            from: "NM",
            to: unref(walletCode),
            money: unref(todayBonus),
            active_id: unref(activeId),
            active_type: unref(activeType)
        }

        HttpPlus.setUrlOptions(ApiSetting.user.transferSubmit)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        confirmLoading.value = false
        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: `【${unref(todayBonus)}】元彩金已转入您的【${walletList.value[walletIndex.value].name}】,需${unref(
                    activeBetLimit
                )}倍流水即可转出!`,
                icon: "checked"
            })
            modiStatus.value = 1
            showDio.value = false
            if (activeNav.value == 0) {
                initBet()
            } else {
                initWin()
            }
        }
    } catch (error: unknown) {
        confirmLoading.value = false
        console.error(error)
    }
}

const openDio = (): void => {
    if (!systemParams.isLogin) {
        showToast({
            className: "vk-toast-fail",
            message: "请您先登录",
            icon: "warning"
        })
    } else {
        if (receiveStatus.value == 1 || receiveStatus.value == 2) {
            return
        } else if (receiveStatus.value != 0) {
            showToast({
                className: "vk-toast-fail",
                message: statusTips.value,
                icon: "warning"
            })
        } else {
            walletIndex.value = 0
            showDio.value = true
        }
    }
}

init()
</script>

<template>
    <div class="bg-#e8f1ef font-classic leading-relaxed!">
        <HeaderBar>
            <div class="header_title">美职篮季后赛</div>
        </HeaderBar>

        <div class="expand-page NBA-2022">
            <div class="game-time">{{ showTime }}</div>
            <div class="nav-wrapper hstack justify-between">
                <div
                    class="nav"
                    @click="activeNav = i"
                    :class="[`nav-${item.key}`, { 'nav-active': i == activeNav }]"
                    v-for="(item, i) in NAV_MENU"
                    :key="i"
                >
                    <span class="light"><i></i></span>
                </div>
            </div>
            <transition name="fade" mode="out-in">
                <main class="main-bet" v-if="activeNav == 0" key="bet">
                    <div class="module-block">
                        <div class="big-title title-nr"></div>
                        <div class="content-wrapper nr-border">
                            <div class="desc">
                                活动期间，会员当日首充≥100元且在体育场馆投注【NBA季后赛】中累计有效投注额≥3,000元，即可申请优惠彩金，最高可领888元。
                            </div>
                            <div class="table">
                                <table width="100%" cellspacing="0">
                                    <thead>
                                        <tr>
                                            <th>累计有效投注(￥)</th>
                                            <th>赠送彩金(￥)</th>
                                            <th>彩金流水要求</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, i) in initDataBet.active_setting.info" :key="i">
                                            <td>{{ formatNumberSplit(item.bet_amount) }}+</td>
                                            <td>{{ item.bonus }}</td>
                                            <td v-if="i === 0" rowspan="9" style="line-height: 1.29">
                                                体育{{ activeBetLimit }}倍有效流水
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="btn-wrapper flex-center">
                                <div class="left-btn flex-center">
                                    <div class="money-icon"></div>
                                    <div class="money-tips">
                                        今日{{ receiveStatus === 1 ? "已" : "可" }}领:
                                        <span class="red num">
                                            {{ receiveStatus !== 0 && receiveStatus !== 1 ? "0" : todayBonus }}
                                        </span>
                                        元
                                    </div>
                                </div>
                                <div
                                    @click="openDio"
                                    class="right-btn"
                                    :class="{
                                        'right-btn-forbid': receiveStatus === 2,
                                        'right-btn-avai': receiveStatus === 1 || modiStatus === 1
                                    }"
                                ></div>
                            </div>
                            <div class="btn-desc">
                                <span class="border-bottom" v-if="receiveStatus === 0 || receiveStatus === 1">
                                    昨日累计有效投注 {{ formatNumberSplit(yesterdayAmount) }} 元
                                </span>
                                <span class="border-bottom" v-if="receiveStatus === 2">昨日未达到领取条件，今日暂不可领取</span>
                            </div>
                        </div>
                    </div>
                    <div class="module-block">
                        <div class="big-title title-gz"></div>
                        <div class="content-wrapper gz-border">
                            <ol>
                                <li>
                                    每日未发起提款前的存款都视为首充。体育游戏场馆包含：威客体育、FB体育、BTI体育、皇冠体育、平博Sports、沙巴体育、IM体育。
                                </li>
                                <li>参与此活动优惠的会员需当日首充≥100元，且在体育场馆投注【NBA季后赛】赛事盘口。</li>
                                <li>
                                    每日累计投注有效流水达到对应的额度即可领取彩金，领取时间为次日
                                    00:30:00-23:59:59，指定时间内未领取视为自动放弃；投注返利金需完成5倍体育有效流水。
                                </li>
                                <li>
                                    用户在领取投注返利金时选择将其领取至对应的体育游戏钱包（威客体育、FB体育、BTI体育、皇冠体育、平博Sports、沙巴体育、IM体育七选一），活动流水未完成前不可再次申请。
                                </li>
                                <li>
                                    此优惠活动领取当天不与威客体育加油站活动共享。有效流水仅计算产生输赢结果的注单，亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水。
                                </li>
                                <li>
                                    每位有效玩家、每个手机号码、电子邮箱、IP地址、每张银行卡、每台设备只能享受一次优惠，参与用户必须先绑定银行卡。对违规的用户，VKGAME保留无期限审核，和扣回红利及产生的利润权利。本活动最终解释权归VKGAME所有。
                                </li>
                            </ol>
                        </div>
                    </div>
                </main>
                <main class="main-bonus" v-else-if="activeNav === 1" key="win">
                    <div class="module-block">
                        <div class="big-title title-nr"></div>
                        <div class="content-wrapper nr-border">
                            <div class="desc">
                                活动期间，会员当日首充≥100元且在体育场馆投注【NBA季后赛】中累计产生盈利≥3,000元，即可申请优惠彩金，最高可领388元。
                            </div>
                            <div class="table">
                                <table width="100%" cellspacing="0">
                                    <thead>
                                        <tr>
                                            <th>
                                                累计
                                                <br />
                                                盈利(￥)
                                            </th>
                                            <th>Lv0-3(￥)</th>
                                            <th>Lv4-7(￥)</th>
                                            <th>Lv8-11(￥)</th>
                                            <th>Lv12(￥)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>3,000+</td>
                                            <td>6</td>
                                            <td>8</td>
                                            <td>18</td>
                                            <td>188</td>
                                        </tr>
                                        <tr>
                                            <td>50,000+</td>
                                            <td>8</td>
                                            <td>18</td>
                                            <td>28</td>
                                            <td>288</td>
                                        </tr>
                                        <tr>
                                            <td>100,000+</td>
                                            <td>18</td>
                                            <td>28</td>
                                            <td>38</td>
                                            <td>388</td>
                                        </tr>
                                        <tr>
                                            <td class="spec-td">
                                                投注场
                                                <br />
                                                馆要求
                                            </td>
                                            <td colspan="4">
                                                威客体育、FB体育、BTI体育、皇冠
                                                <br />
                                                体育、平博Sports、沙巴体育、IM体育
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="spec-td">
                                                彩金流
                                                <br />
                                                水要求
                                            </td>
                                            <td colspan="4">体育{{ activeBetLimit }}倍有效流水</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="btn-wrapper flex-center">
                                <div class="left-btn flex-center">
                                    <div class="money-icon"></div>
                                    <div class="money-tips">
                                        今日{{ receiveStatus === 1 ? "已" : "可" }}领:
                                        <span class="red num">
                                            {{ receiveStatus !== 0 && receiveStatus !== 1 ? 0 : todayBonus }}
                                        </span>
                                        元
                                    </div>
                                </div>
                                <div
                                    @click="openDio"
                                    class="right-btn"
                                    :class="{
                                        'right-btn-forbid': receiveStatus === 2,
                                        'right-btn-avai': receiveStatus === 1 || modiStatus === 1
                                    }"
                                ></div>
                            </div>
                            <div class="btn-desc">
                                <span class="border-bottom" v-if="receiveStatus === 0 || receiveStatus === 1">
                                    昨日累计盈利 {{ formatNumberSplit(yesterdayAmount) }} 元
                                </span>
                                <span class="border-bottom" v-if="receiveStatus === 2">昨日未达到领取条件，今日暂不可领取</span>
                            </div>
                        </div>
                    </div>
                    <div class="module-block">
                        <div class="big-title title-gz"></div>
                        <div class="content-wrapper gz-border">
                            <ol>
                                <li>
                                    每日未发起提款前的存款都视为首充。体育游戏场馆包含：威客体育、FB体育、BTI体育、皇冠体育、平博Sports、沙巴体育、IM体育。
                                </li>
                                <li>参与此活动优惠的会员需当日首充≥100元，且在体育场馆投注【NBA季后赛】赛事盘口。</li>
                                <li>
                                    每日累计体育场馆盈利达到对应的额度即可领取彩金，领取时间为次日
                                    00:30:00-23:59:59，指定时间内未领取视为自动放弃；盈利返利金需完成8倍体育有效流水。
                                </li>
                                <li>
                                    用户在领取投注返利金时选择将其领取至对应的体育游戏钱包（威客体育、FB体育、BTI体育、皇冠体育、平博Sports、沙巴体育、IM体育七选一），活动流水未完成前不可再次申请。
                                </li>
                                <li>
                                    此优惠活动领取当天不与体育连赢投注加码活动共享。彩金流水要求：仅计算产生输赢结果的注单，亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>
                                    0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水。
                                </li>
                                <li>
                                    每位有效玩家、每个手机号码、电子邮箱、IP地址、每张银行卡、每台设备只能享受一次优惠，参与用户必须先绑定银行卡。对违规的用户，VKGAME保留无期限审核，和扣回红利及产生的利润权利。本活动最终解释权归VKGAME所有。
                                </li>
                            </ol>
                        </div>
                    </div>
                </main>
            </transition>
        </div>
        <van-dialog
            overlay-class="nba-overlay"
            class="NBA-2022-dialog"
            :close-on-click-overlay="true"
            v-model:show="showDio"
            :show-confirm-button="false"
            teleport="body"
        >
            <div class="close" @click="showDio = false"></div>
            <div class="title">温馨提示</div>
            <div class="content-wrapper">
                <div class="tips">
                    领取
                    <span class="red">{{ todayBonus }}</span>
                    元彩金至
                </div>
                <div class="wallet_box_wrapper" v-if="walletList.length && !loadBet && !loadWin">
                    <div
                        @click="walletIndex = i"
                        class="wallet-box"
                        :class="[{ active: walletIndex === i }]"
                        v-for="(item, i) in walletList"
                        :key="i"
                    >
                        {{ item.name }}
                    </div>
                    <div class="confirm-btn" @click="transfer"></div>
                    <div class="impo-tip">
                        <div class="im-icon"></div>
                        <div>
                            <span class="red">{{ activeBetLimit }}倍</span>
                            流水即可转出
                        </div>
                    </div>
                </div>
                <van-loading v-if="loadBet || loadWin" class="ab-center" type="spinner" />
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss" scoped>
@keyframes light {
    0% {
        left: -180px;
    }

    25% {
        left: 460px;
    }

    100% {
        left: 460px;
    }
}
.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
}

.NBA-2022 {
    width: 100%;
    box-sizing: border-box;
    background: url("@/assets/img/active/sports/nba2022/bg.jpg") center top no-repeat;
    background-size: 100% auto;
    padding: 4.23rem 0.07rem 0.41rem;
    font-size: 0.14rem;
    color: #d7e3ff;
    .game-time {
        margin: auto;
        max-width: 93%;
        text-align: center;
        line-height: 1;
        color: #fff;
        position: relative;
        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: -0.045rem;
            width: 0.26rem;
            height: 0.23rem;
            background: url("@/assets/img/active/sports/nba2022/time-left.png") center no-repeat;
            background-size: 100% 100%;
        }
        &::after {
            content: "";
            position: absolute;
            right: 0;
            top: -0.045rem;
            width: 0.26rem;
            height: 0.23rem;
            background: url("@/assets/img/active/sports/nba2022/time-right.png") center no-repeat;
            background-size: 100% 100%;
        }
    }

    .nav-wrapper {
        margin-top: 1.12rem;
        width: 100%;
        box-sizing: border-box;
        padding: 0 0.01rem;
        .nav {
            width: 1.75rem;
            height: 0.5rem;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
            position: relative;
            overflow: hidden;
            .light {
                cursor: pointer;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;

                i {
                    position: absolute;
                    left: -200px;
                    top: 0;
                    width: 180px;
                    height: 100%;
                    transform: skewx(-25deg);
                }
            }
            &.nav-bet {
                background-image: url("@/assets/img/active/sports/nba2022/tab1.png");
                .light {
                    i {
                        background-image: linear-gradient(
                            269deg,
                            rgba(255, 219, 157, 0),
                            rgba(255, 255, 255, 0.15),
                            rgba(255, 219, 157, 0)
                        );
                        animation: light 3.4s 2s linear infinite;
                    }
                }
            }
            &.nav-bonus {
                background-image: url("@/assets/img/active/sports/nba2022/tab2.jpg");
                .light {
                    i {
                        background-image: linear-gradient(
                            269deg,
                            rgba(255, 219, 157, 0),
                            rgba(255, 255, 255, 0.15),
                            rgba(255, 219, 157, 0)
                        );
                        animation: light 3.4s 2.5s linear infinite;
                    }
                }
            }
            &.nav-active {
                &.nav-bet {
                    background-image: url("@/assets/img/active/sports/nba2022/tab1-active.png");
                }

                &.nav-bonus {
                    background-image: url("@/assets/img/active/sports/nba2022/tab2-active.jpg");
                }
            }
        }
    }
    main {
        .red {
            color: #ff225e;
        }
        .table {
            color: #fff;
            width: 100%;
        }
        table {
            box-sizing: border-box;
            text-align: center;
            text-align: center;
            border-right: solid 0.01rem #fe0043;
            th {
                line-height: 1.24;
                font-size: 0.13rem;
                font-weight: bold;
                height: 0.4rem;
                box-sizing: border-box;
                box-shadow: inset 0 -0.01rem 0.042rem 0.008rem rgba(250, 37, 93, 0.4);
                border-left: solid 0.01rem #fe0043;
                border-bottom: solid 0.01rem #fe0043;
                background-image: linear-gradient(to top, #982742, #c81544);
            }
            td {
                line-height: 1.2;
                font-size: 0.14rem;
                height: 0.4rem;
                box-sizing: border-box;
                border-left: solid 0.01rem #fe0043;
                border-bottom: solid 0.01rem #fe0043;
                &.spec-td {
                    background-image: linear-gradient(to top, #982742, #c81544);
                    box-shadow: inset 0 -0.01rem 0.042rem 0.008rem rgba(250, 37, 93, 0.4);
                }
            }
            tr {
                &:nth-child(odd) {
                    background-color: #872139;
                }
                &:nth-child(even) {
                    background-color: #9a2742;
                }
            }
        }
        .module-block {
            margin-top: 0.25rem;
        }
        .big-title {
            margin: auto;
            width: 1.82rem;
            height: 0.45rem;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
            margin-bottom: 0.15rem;
            &.title-nr {
                background-image: url("@/assets/img/active/sports/nba2022/title-nr.png");
            }
            &.title-gz {
                background-image: url("@/assets/img/active/sports/nba2022/title-gz.png");
            }
        }
        .content-wrapper {
            margin: auto;
            width: 3.605rem;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
            box-sizing: border-box;
            padding: 0.07rem 0.07rem 0.07rem 0.11rem;
            .desc {
                padding: 0.12rem 0.26rem;
                line-height: 1.4;
            }
            &.gz-border {
                padding: 0.28rem;
            }
            ol {
                padding-left: 0.22rem;
                list-style: decimal;

                li {
                    position: relative;
                    list-style: decimal;
                    margin-bottom: 0.05rem;

                    &:last-of-type {
                        margin-bottom: 0;
                    }
                    &::marker {
                        color: transparent;
                    }
                    &::before {
                        content: "";
                        position: absolute;
                        top: 0.03rem;
                        left: -0.24rem;
                        width: 0.16rem;
                        height: 0.16rem;
                        background: url("@/assets/img/active/sports/nba2022/num.png") center no-repeat;
                        background-size: 100% 100%;
                    }
                }
            }
        }
        .btn-wrapper {
            margin-top: 0.2rem;
            .left-btn {
                width: 1.84rem;
                height: 0.45rem;
                box-sizing: border-box;
                border-style: solid;
                border-width: 0.01rem;
                border-image-source: linear-gradient(to top, #ff0043, #930c2f);
                border-image-slice: 1;
                background-color: #152041;
                .money-icon {
                    width: 0.195rem;
                    height: 0.21rem;
                    background: url("@/assets/img/active/sports/nba2022/money.png") center no-repeat;
                    background-size: 100% 100%;
                }
                .money-tips {
                    margin-left: 0.08rem;
                    font-size: 0.16rem;
                    .num {
                        font-family: Roboto;
                        font-size: 0.17rem;
                    }
                }
            }
            .right-btn {
                margin-left: -0.01rem;
                width: 1.3rem;
                height: 0.45rem;
                box-sizing: border-box;
                background-position: center;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-image: url("@/assets/img/active/sports/nba2022/get-btn.png");
                &.right-btn-forbid {
                    background-image: url("@/assets/img/active/sports/nba2022/forbi-btn.png");
                }
                &.right-btn-avai {
                    background-image: url("@/assets/img/active/sports/nba2022/ava-btn.png");
                }
            }
        }
        .btn-desc {
            text-align: center;
            color: #fff;
            font-size: 0.16rem;
            line-height: 3.2;
            .border-bottom {
                position: relative;
                transform-style: preserve-3d;
                &::before {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 0.055rem;
                    background-color: #cb334b;
                    z-index: -1;
                }
            }
        }
    }
    .main-bet {
        .nr-border {
            height: 6.265rem;
            background-image: url("@/assets/img/active/sports/nba2022/bet-nr-border.png");
        }
        .gz-border {
            height: 6.615rem;
            background-image: url("@/assets/img/active/sports/nba2022/gz-border.png");
        }
    }
    .main-bonus {
        .nr-border {
            height: 4.685rem;
            background-image: url("@/assets/img/active/sports/nba2022/bonus-nr-border.png");
        }
        .gz-border {
            height: 6.615rem;
            background-image: url("@/assets/img/active/sports/nba2022/gz-border.png");
        }
    }
}
</style>
<style lang="less">
.nba-overlay {
    background-color: rgba(0, 0, 0, 0.82);
}

.NBA-2022-dialog {
    max-width: 100vw;
    border: solid 0.01rem #e24f78;
    background-color: #101b36;
    border-radius: 0;
    width: 3.5rem;
    height: 4.35rem;
    font-size: 0.16rem;
    text-align: center;
    color: #fff;
    overflow: visible;

    .red {
        color: #ff225e;
        font-family: Roboto;
        font-size: 0.19rem;
    }

    .close {
        width: 0.325rem;
        height: 0.32rem;
        background: url("@/assets/img/active/sports/nba2022/close-icon.png") center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 0;
        top: -0.4rem;
    }

    .title {
        width: 100%;
        height: 0.45rem;
        box-shadow: inset 0px -0.01rem 0.042rem 0.008rem rgba(255, 255, 255, 0.4);
        background-image: linear-gradient(to top, #982742, #c81544);
        line-height: 0.44rem;
        font-size: 0.18rem;
        font-weight: bold;
    }

    .content-wrapper {
        width: 100%;
        height: 3.9rem;
        box-sizing: border-box;
        padding: 0.2rem 0.34rem;

        .tips {
            line-height: 1;
        }

        .wallet_box_wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-top: 0.2rem;

            .wallet-box {
                width: 1.35rem;
                height: 0.45rem;
                box-sizing: border-box;
                border: solid 0.01rem #485471;
                text-align: center;
                line-height: 0.45rem;
                margin-right: 0.08rem;
                margin-bottom: 0.1rem;
                color: #d7e3ff;
                position: relative;

                &:nth-child(even) {
                    margin-right: 0;
                }

                &.active {
                    border-color: #ff225e;

                    &::after {
                        content: "";
                        position: absolute;
                        right: 0;
                        bottom: -0.01rem;
                        width: 0.175rem;
                        height: 0.175rem;
                        background: url("@/assets/img/active/sports/nba2022/gou.png") center no-repeat;
                        background-size: 100% 100%;
                    }
                }
            }

            .confirm-btn {
                margin: auto;
                margin-top: 0.1rem;
                width: 1.6rem;
                height: 0.45rem;
                background: url("@/assets/img/active/sports/nba2022/confirm-btn.png") center no-repeat;
                background-size: 100% 100%;
            }

            .impo-tip {
                margin-top: 0.1rem;
                font-size: 0.14rem;
                color: #c0bdc8;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                .red {
                    font-size: 0.14rem;
                }

                .im-icon {
                    width: 0.18rem;
                    height: 0.18rem;
                    background: url("@/assets/img/active/sports/nba2022/im-icon.png") center no-repeat;
                    background-size: 100% 100%;
                    margin-right: 0.06rem;
                }
            }
        }
    }
}
</style>
