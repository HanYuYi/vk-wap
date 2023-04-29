<script setup lang="ts">
import Img11 from "@/assets/img/active/general/usdtdeposit/active1_1.png"
import Img12 from "@/assets/img/active/general/usdtdeposit/active1_2.png"
import Img13 from "@/assets/img/active/general/usdtdeposit/active1_3.png"
import Img22 from "@/assets/img/active/general/usdtdeposit/active2_2.png"
import Img23 from "@/assets/img/active/general/usdtdeposit/active2_3.png"

import ApiSetting from "@/api/service"
import { Pagination } from "swiper"
import { ref } from "vue"
import { formatCountDown } from "@/utils/date"
import { useSysStore } from "@/stores/system"
import { formatterStr } from "@/composable/validate"
import { useCountDown } from "@vant/use"
import { showToast } from "vant"
import { BaseActiveStruct } from "@/api/pojo/BaseStruct"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

class ActiveGetUsdtDepositInit extends BaseActiveStruct {
    active_show_time: string = "即日起"

    status_tips: string = ""

    active_setting: { flag: string; is_reward: number }[]

    countdown_time: number

    // 前端自定义
    showCountDown?: boolean = false
}

const initInfo = ref<ActiveGetUsdtDepositInit>(new ActiveGetUsdtDepositInit())

interface ActiveDataItem {
    flag: string
    title: string
    rule: string
    ruleIconPos: string
    desc: string[]
    ruleIconText?: string
}

const activeData = ref<Array<ActiveDataItem & Partial<ActiveGetUsdtDepositInit["active_setting"][number]>>>([
    {
        flag: "A",
        title: "一重礼：第1步",
        rule: "全新注册会员首存送58%",
        ruleIconPos: Img11,
        desc: ["新会员注册后60分钟首存即可享受。", "存送彩金上限58元。", "提款流水=(存款+彩金)X3倍。"]
    },
    {
        flag: "C",
        title: "一重礼：第2步",
        rule: "全新注册会员续存送68%",
        ruleIconPos: Img12,
        desc: ["已领取一重第1步礼的会员存入第二笔。", "存送彩金上限288元。", "提款流水=(存款+彩金)X8倍。"]
    },
    {
        flag: "E",
        title: "一重礼：第3步",
        rule: "全新注册会员三存送40%",
        ruleIconPos: Img13,
        desc: ["已领取一重礼第2步的会员存入第三笔。", "存送彩金无上限。", "提款流水=(存款+彩金)X25倍。"]
    },
    {
        flag: "B",
        title: "二重礼",
        rule: "六个月内新会员首存送50%",
        ruleIconPos: Img22,
        ruleIconText: "6个月内<br>送50%",
        desc: [
            "未领取一重礼的会员首存即可享受。",
            "注册六个月内未使用过虚拟币存款的会员。",
            "存送彩金上限188元。",
            "提款流水=(存款+彩金)X5倍。"
        ]
    },
    {
        flag: "D",
        title: "三重礼",
        rule: "二重礼上再续存送30%",
        ruleIconPos: Img23,
        ruleIconText: "无上限<br>送30%",
        desc: ["已领取二重礼的会员存入第二笔。", "存送彩金无上限。", "提款流水=(存款+彩金)X25倍。"]
    }
])

const countDown = useCountDown({
    time: 1 * 1000,
    onFinish: () => {
        countDown.reset()
    }
})

const countDownTime = countDown.current

const init = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.active.usdtDepositInit)
    const res = await HttpPlus.sendHttpRequest<ActiveGetUsdtDepositInit>()
    if (res.status === 1) {
        // 过滤时间字符串空格
        if (res.data.active_show_time && res.data.active_show_time.length) {
            res.data.active_show_time = formatterStr(res.data.active_show_time)
        }
        initInfo.value = res.data
        initInfo.value.showCountDown = Boolean(res.data.countdown_time)
        if (res.data.countdown_time) {
            countDown.reset(res.data.countdown_time * 1000)
            countDown.start()
        }
        activeData.value = activeData.value.map((item: ActiveDataItem) => {
            const find = res.data.active_setting.find(
                (currentRow: ActiveGetUsdtDepositInit["active_setting"][number]) => currentRow.flag === item.flag
            )
            if (find) {
                return {
                    ...item,
                    ...find
                }
            } else {
                return item
            }
        })
    }
}

const receiveLoading = ref(false)

class ActiveJoinUsdtDeposit {
    bonus: number

    need_money: number
}

type DialogRow = ActiveDataItem & ActiveGetUsdtDepositInit["active_setting"][number] & ActiveJoinUsdtDeposit

const dialogRow = ref<Partial<DialogRow>>({})
const visibleDialog = ref(false)

// 领取彩金
const receiveMoney = async (row: ActiveDataItem & Partial<ActiveGetUsdtDepositInit["active_setting"][number]>): Promise<void> => {
    if (initInfo.value.is_login && !receiveLoading.value) {
        receiveLoading.value = true
        try {
            HttpPlus.setUrlOptions(ApiSetting.active.getUsdtDeposit)
            const res = await HttpPlus.sendHttpRequest<ActiveJoinUsdtDeposit, { flag: ActiveDataItem["flag"] }>({
                flag: row.flag
            })
            receiveLoading.value = false

            if (res.status === 1) {
                const { bonus, need_money } = res.data
                dialogRow.value = { ...row, bonus, need_money }
                visibleDialog.value = true
                init()
            }
        } catch (error: unknown) {
            receiveLoading.value = false
            console.error(error)
        }
    } else {
        showToast({
            className: "vk-toast-fail",
            message: initInfo.value.status_tips,
            icon: "warning"
        })
    }
}

init()
</script>

<template>
    <div class="bg-#e8f1ef font-classic text-#262933 leading-relaxed!">
        <HeaderBar>
            <div class="header_title">USDT新会员存送</div>
        </HeaderBar>

        <div class="expand-page UsdtDeposit">
            <!-- banner-->
            <div class="banner">
                <img src="@/assets/img/active/general/usdtdeposit/banner.png" alt="" />
            </div>
            <!-- 描述区-->
            <div class="desc-panel">
                <!-- 活动时间-->
                <h1 class="active-date">{{ initInfo.active_show_time }}</h1>

                <div class="desc">
                    USDT作为当前最为安全与高效的数字货币，您值得拥有
                    <router-link to="/guide/cryptocurrency?id=2" class="guide">查看充值教程</router-link>
                    <router-link to="/finance/deposit" class="deposit"><span>USDT充值</span></router-link>
                </div>
            </div>

            <div class="active-panel">
                <i v-if="initInfo.showCountDown" class="count-down">{{ formatCountDown(countDownTime, false, false) }}</i>
                <!-- X重礼切换头部-->
                <div class="swiper-pagination banner-custom-pagination"></div>

                <!-- X重礼切换部分-->
                <swiper
                    :modules="[Pagination]"
                    :pagination="{
                        el: '.banner-custom-pagination',
                        clickable: true
                    }"
                    autoHeight
                    observeSlideChildren
                    observer
                    class="triple-scroll"
                >
                    <swiper-slide class="triple-gift">
                        <ul class="gift-box">
                            <li v-for="(item, index) in activeData.slice(0, 3)" :key="index" class="gift-panel">
                                <div class="top">
                                    <h2>{{ item.title }}</h2>
                                    <div class="rule-icon" :style="{ 'background-image': `url(${item.ruleIconPos})` }">
                                        <p class="rule-txt">{{ item.rule }}</p>
                                    </div>
                                    <ul class="desc">
                                        <li v-for="(row, i) in item.desc" :key="i">
                                            {{ row }}
                                        </li>
                                    </ul>
                                    <div v-if="initInfo.showCountDown && item.flag === 'A'" class="count-down-t">
                                        友情提醒：请在
                                        <i>{{ formatCountDown(countDownTime) }}</i>
                                        内领取
                                    </div>
                                </div>
                                <div
                                    class="bottom"
                                    :class="{
                                        dis1: initInfo.showCountDown && item.flag === 'A'
                                    }"
                                >
                                    <template v-if="initInfo.is_login">
                                        <van-button
                                            v-if="item.is_reward === 0"
                                            @click="receiveMoney(item)"
                                            :loading="receiveLoading"
                                            class="available"
                                        >
                                            <span class="text">领取彩金</span>
                                        </van-button>
                                        <van-button v-if="item.is_reward === 1" class="received">
                                            <span class="text">已领取</span>
                                        </van-button>
                                        <van-button
                                            v-if="item.is_reward === 2"
                                            @click="receiveMoney(item)"
                                            :loading="receiveLoading"
                                        >
                                            <span class="text">领取彩金</span>
                                        </van-button>
                                    </template>
                                    <template v-else>
                                        <van-button @click="receiveMoney(item)" class="available">
                                            <span class="text">领取彩金</span>
                                        </van-button>
                                    </template>
                                </div>
                            </li>
                        </ul>
                    </swiper-slide>
                    <!-- 二三重礼专享活动-->
                    <swiper-slide class="triple-gift double-gift">
                        <ul class="gift-box">
                            <li v-for="(item, index) in activeData.slice(3, 5)" :key="index" class="gift-panel">
                                <div class="top">
                                    <h2>{{ item.title }}</h2>
                                    <div class="rule-icon" :style="{ 'background-image': `url(${item.ruleIconPos})` }">
                                        <p class="rule-txt">{{ item.rule }}</p>
                                        <h3
                                            v-html="item.ruleIconText"
                                            :class="{ exception: index > 0 }"
                                            class="rule-icon-txt"
                                        ></h3>
                                    </div>
                                    <ul class="desc">
                                        <li v-for="(row, i) in item.desc" :key="i">
                                            {{ row }}
                                        </li>
                                    </ul>
                                </div>
                                <div class="bottom">
                                    <template v-if="initInfo.is_login">
                                        <van-button
                                            v-if="item.is_reward === 0"
                                            @click="receiveMoney(item)"
                                            :loading="receiveLoading"
                                            class="available"
                                        >
                                            <span class="text">领取彩金</span>
                                        </van-button>
                                        <van-button v-if="item.is_reward === 1" class="received">
                                            <span class="text">已领取</span>
                                        </van-button>
                                        <van-button
                                            v-if="item.is_reward === 2"
                                            @click="receiveMoney(item)"
                                            :loading="receiveLoading"
                                        >
                                            <span class="text">领取彩金</span>
                                        </van-button>
                                    </template>
                                    <template v-else>
                                        <van-button class="available" @click="receiveMoney(item)">
                                            <span class="text">领取彩金</span>
                                        </van-button>
                                    </template>
                                </div>
                            </li>
                        </ul>
                    </swiper-slide>
                </swiper>
            </div>

            <!-- 活动规则-->
            <dl class="rules">
                <dt>活动规则</dt>
                <dd>
                    <ul>
                        <li>1 .本优惠自您注册之日起6个月内可报名参加，如超过6个月视为活动失效。</li>
                        <li>
                            2
                            .此活动首笔存款定义为：活动开始后，新注册用户未发起提款前的第一笔USDT存款。领取首存活动后，未发起提款前的USDT第二笔存款视为二存。领取二存活动后，未发起提款前的USDT第三笔存款视为三存。存款后7天内领取有效。注：注册后6个月内从未使用USDT存款的客户亦可报名参加新会员专属存送。
                        </li>
                        <li>
                            3
                            .申请奖金后需在任意游戏中完成相对应的流水要求，当用户对应的钱包余额＜最低投注额且无未结算注单时，系统将自动判定已完成活动规定的有效流水，若用户在申请前将本金从主钱包转出，则不可申请此次优惠。
                        </li>
                        <li>
                            4
                            .此活动领取当天不与首存类优惠活动和再存类优惠活动共享，每个账户仅限申请一次；不可与老用户召回存款活动同一天参与；领取了此项优惠活动的新用户需先完成活动规定的流水后才可申请平台任何形式的救援金活动。
                        </li>
                        <li>
                            5
                            .电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                            <span class="text-white" @click="systemParams.ActiveMoreRules.isShow = true">点击查看</span>
                            。
                        </li>
                        <li>
                            6
                            .每位有效玩家、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑者只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利。VKGAME对本活动保有最终解释权。
                        </li>
                    </ul>
                </dd>
            </dl>
        </div>
        <van-dialog v-model:show="visibleDialog" :showConfirmButton="false" class="usdtdeposit-dialog" teleport="body">
            <div class="dialog-main">
                <h2>恭喜您获得</h2>
                <div
                    class="rule-icon"
                    :style="{
                        'background-image': `url(${dialogRow.ruleIconPos})`,
                        position: dialogRow.ruleIconText ? 'relative' : 'static'
                    }"
                >
                    <p class="rule-txt">{{ dialogRow.bonus }} 元彩金</p>
                    <h3
                        v-if="dialogRow.ruleIconText"
                        v-html="dialogRow.ruleIconText"
                        :class="{ exception: dialogRow.title === '三重礼' }"
                        class="rule-icon-txt"
                    ></h3>
                </div>
                <ul class="desc">
                    <li>彩金已加入您的主账户</li>
                    <li>{{ dialogRow.need_money }} 流水即可提款</li>
                </ul>
                <button @click="visibleDialog = false" class="close">
                    <span>知道啦</span>
                </button>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss" scoped>
$contentwidth: calc(100% - 0.3rem);
.UsdtDeposit {
    background-image: linear-gradient(to right, #14243b, #203657, #203657, #203657, #14243b);
    padding-bottom: 16px;
    .banner {
        width: 100%;
        position: relative;
        img {
            width: inherit;
            pointer-events: none;
        }
    }
    .desc-panel {
        width: $contentwidth;
        margin: 0 auto 0.36rem;
        .active-date {
            width: 100%;
            text-align: center;
            color: #ffd499;
            font-size: 0.15rem;
            line-height: 0.15rem;
            font-weight: normal;
        }
        .desc {
            font-size: 0.15rem;
            color: #fff;
            position: relative;
            line-height: 0.28rem;
            margin-top: 0.07rem;
            .guide {
                color: #f8d5a1;
                text-decoration: underline;
            }
            .deposit {
                position: absolute;
                right: 0;
                bottom: -0.03rem;
                display: inline-block;
                width: 0.9rem;
                height: 0.28rem;
                border-radius: 0.05rem;
                text-align: center;
                line-height: 0.28rem;
                font-size: 0.15rem;
                background-image: linear-gradient(to bottom, #d11917, #ff2a25);
                font-weight: bold;
                box-shadow: 0 0.02rem 0.04rem 0 rgba(0, 0, 0, 0.4), inset 0 -0.015rem 0.01rem 0 rgba(0, 0, 0, 0.58);
                border: solid 0.01rem #fef1cd;
                box-sizing: border-box;
                &:active {
                    background-image: linear-gradient(to bottom, #fc6f6e, #ee3331);
                    span {
                        font-weight: normal;
                        color: #ffffff;
                    }
                }
                span {
                    background: linear-gradient(to bottom, #ffffff, #f8d5a1);
                    -webkit-background-clip: text;
                    color: transparent;
                }
            }
        }
    }

    .active-panel {
        width: 100%;
        margin-bottom: 0.3rem;
        position: relative;
        overflow: hidden;
        .count-down {
            position: absolute;
            top: 0.1rem;
            right: calc(50% + 0.015rem);
            text-align: center;
            display: inline-block;
            width: 0.33rem;
            height: 0.16rem;
            line-height: 0.18rem;
            border-radius: 0.08rem;
            box-shadow: inset 1px 1.7px 2px 0 rgba(61, 14, 4, 0.7);
            background-color: #fff;
            font-size: 0.11rem;
            color: #990000;
            z-index: 1;
        }
        .swiper-pagination {
            position: static;
            width: $contentwidth;
            height: 0.36rem;
            margin: 0 auto;
            background: url("@/assets/img/active/general/usdtdeposit/tab_bg.png");
            background-size: 100% 100%;
            box-shadow: 0 0.02rem 0.04rem 0 rgba(0, 0, 0, 0.4);
            border-radius: 0.5rem;
            display: flex;
            :deep(.swiper-pagination-bullet) {
                display: block;
                width: 50%;
                height: 0.36rem;
                border-radius: 0;
                background: transparent;
                opacity: 1;
                touch-action: pan-y;
                overflow: hidden;
                &:first-child,
                &:last-child {
                    &:before {
                        position: absolute;
                        left: 0;
                        width: 50%;
                        height: inherit;
                        content: "一重限时好礼";
                        color: #7e1911;
                        font-size: 0.15rem;
                        margin-top: 0.07rem;
                    }
                    &.swiper-pagination-bullet-active {
                        background: url("@/assets/img/active/general/usdtdeposit/tab_l.png") no-repeat;
                        background-size: 100% 100%;
                        outline: 0;
                    }
                }
                &:last-child {
                    &.swiper-pagination-bullet-active {
                        background: url("@/assets/img/active/general/usdtdeposit/tab_r.png") no-repeat;
                        background-size: 100% 100%;
                    }
                    &:before {
                        left: 50%;
                        content: "二三重礼专享";
                    }
                }
                &.swiper-pagination-bullet-active {
                    &:before {
                        background: linear-gradient(to bottom, #ffffff, #f8d5a1);
                        -webkit-background-clip: text;
                        color: transparent;
                        font-weight: bold;
                    }
                }
            }
        }
        .triple-scroll {
            width: 100%;
            margin-top: -0.075rem;
            padding-bottom: 10px;
            touch-action: pan-y;
            .triple-gift {
                .gift-box {
                    width: 1.97rem;
                    height: auto;
                    margin: 0 auto;
                    .gift-panel {
                        position: relative;
                        width: 1.97rem;
                        margin-top: 0.28rem;
                        overflow: hidden;
                        .top {
                            width: 100%;
                            height: 2.435rem;
                            border-bottom-left-radius: 0.18rem;
                            border-bottom-right-radius: 0.18rem;
                            box-shadow: 0 0.045rem 0.125rem -0.1rem rgb(0, 0, 0, 0.4);
                            background: url("@/assets/img/active/general/usdtdeposit/active_bg.png") no-repeat;
                            background-size: 100% 2.435rem;
                            h2 {
                                font-weight: normal;
                                font-size: 0.15rem;
                                line-height: 0.275rem;
                                text-align: center;
                                color: #fff;
                                margin-top: 11px;
                                text-shadow: 0 2px 3px rgba(0, 0, 0, 0.39);
                            }
                            .rule-icon {
                                margin: 0.02rem auto 0;
                                width: 1.695rem;
                                height: 1.435rem;
                                background-size: 100% 100%;
                                overflow: hidden;
                                .rule-txt {
                                    margin-top: 1.19rem;
                                    font-size: 0.11rem;
                                    line-height: 0.11rem;
                                    text-align: center;
                                    color: #990000;
                                }
                            }
                            .desc {
                                margin: 0.05rem 0 0 0.08rem;
                                li {
                                    width: calc(100% - 0.08rem);
                                    text-shadow: 0 0.01rem 0.015rem rgba(0, 0, 0, 0.39);
                                    font-size: 0.1rem;
                                    line-height: 0.14rem;
                                    color: #fff;
                                    white-space: nowrap;
                                }
                            }
                            .count-down-t {
                                position: absolute;
                                left: 0;
                                bottom: 0.38rem;
                                width: 100%;
                                font-size: 0.11rem;
                                line-height: 0.11rem;
                                text-align: center;
                                color: #ffffff;
                                i {
                                    color: #f8d5a1;
                                }
                            }
                        }
                        .bottom {
                            overflow: hidden;
                            button {
                                display: block;
                                margin: 0.18rem auto 0;
                                width: 0.9rem;
                                height: 0.3rem;
                                outline: 0;
                                border-radius: 0.15rem;
                                box-shadow: 0 0.02rem 0.04rem 0 rgba(0, 0, 0, 0.4),
                                    inset 0 -0.015rem 0.01rem 0 rgba(0, 0, 0, 0.58);
                                font-size: 0.15rem;
                                line-height: 0.29rem;
                                background-image: linear-gradient(to bottom, #686868, #8b8b8b);
                                border: solid 0.01rem #fef1cd;
                                box-sizing: border-box;
                                white-space: nowrap;
                                :deep(.text) {
                                    color: #c3c3c3;
                                    font-weight: bold;
                                }
                                :deep(.van-loading) {
                                    color: white;
                                    top: -2px;
                                }
                                &.available {
                                    background-image: linear-gradient(to bottom, #d11917, #ff2a25);
                                    :deep(.text) {
                                        background: linear-gradient(to bottom, #ffffff, #f8d5a1);
                                        -webkit-background-clip: text;
                                        color: transparent;
                                        font-weight: bold;
                                    }
                                    &:active {
                                        background-image: linear-gradient(to bottom, #fc6f6e, #ee3331);
                                        span {
                                            font-weight: bold;
                                            color: #fff;
                                        }
                                    }
                                    &.loading-btn {
                                        position: relative;
                                        background-image: linear-gradient(to bottom, #774040, #774040);
                                        span {
                                            background: linear-gradient(to bottom, #cccccc, #bea898);
                                            -webkit-background-clip: text;
                                            color: transparent;
                                            font-weight: bold;
                                        }
                                        .weui-loading {
                                            position: absolute;
                                            top: calc((0.3rem - 20px) / 2.1);
                                            left: calc((0.9rem - 20px) / 2);
                                        }
                                    }
                                }
                                &.received {
                                    text-shadow: 0 -0.01rem 0.015rem rgba(0, 0, 0, 0.39);
                                    background-image: linear-gradient(to top, #fbf4c4, #fffce6);
                                    border: solid 0.01rem #fef1cd;
                                    span {
                                        color: #7e1911;
                                        font-weight: bold;
                                    }
                                }
                            }
                            &.dis1 {
                                button {
                                    margin: 0.265rem auto 0;
                                }
                            }
                        }
                    }
                }
                &.double-gift {
                    .rule-icon {
                        position: relative;
                        .rule-icon-txt {
                            width: 100%;
                            top: 0.75rem;
                            left: 0;
                            position: absolute;
                            text-align: center;
                            font-size: 0.12rem;
                            line-height: 0.12rem;
                            font-weight: normal;
                            color: #fff;
                            &.exception {
                                left: 0.06rem;
                            }
                        }
                    }
                }
            }
        }
    }

    .rules {
        width: $contentwidth;
        margin: 0 auto;
        border-radius: 0.1rem;
        border: solid 0.025rem #fdcd8a;
        background-color: #19365a;
        box-sizing: border-box;
        box-shadow: 0 0.02rem 0.04rem 0 rgba(0, 0, 0, 0.4);
        overflow: hidden;
        dt {
            font-size: 0.17rem;
            line-height: 0.17rem;
            margin-top: 0.17rem;
            text-align: center;
            font-weight: bold;
            background: linear-gradient(to bottom, #ffffff, #f8d5a1);
            -webkit-background-clip: text;
            color: transparent;
        }
        dd {
            width: calc(100% - 0.3rem);
            margin: 0.13rem auto 0.17rem;
            ul {
                li {
                    line-height: 0.21rem;
                    font-size: 0.15rem;
                    color: #ffffff;
                    .white {
                        color: #ffffff;
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.usdtdeposit-dialog {
    width: 1.97rem;
    height: 2.915rem;
    background: url("@/assets/img/active/general/usdtdeposit/active_bg.png") no-repeat;
    background-size: 100% 2.435rem;
    line-height: 1.6;
    .dialog-main {
        overflow: hidden;
        h2 {
            font-weight: normal;
            font-size: 0.15rem;
            line-height: 0.275rem;
            text-align: center;
            color: #fff;
            text-shadow: 0 0.01rem 0.015rem rgba(0, 0, 0, 0.39);
        }
        .rule-icon {
            margin: 0.02rem auto 0;
            width: 1.695rem;
            height: 1.435rem;
            background-size: 100% 100%;
            overflow: hidden;
            .rule-txt {
                margin-top: 1.175rem;
                font-size: 0.12rem;
                line-height: 0.11rem;
                text-align: center;
                color: #8b1a11;
            }
            .rule-icon-txt {
                width: 100%;
                top: 0.75rem;
                left: 0;
                position: absolute;
                text-align: center;
                font-size: 0.12rem;
                line-height: 0.12rem;
                font-weight: normal;
                color: #fff;
                &.exception {
                    left: 0.06rem;
                }
            }
        }
        .desc {
            margin: 0.15rem auto 0;
            li {
                text-shadow: 0 0.01rem 0.015rem rgba(0, 0, 0, 0.39);
                font-size: 0.12rem;
                text-align: center;
                color: #fff;
            }
        }
        .close {
            position: absolute;
            display: block;
            left: 0.535rem;
            bottom: 0.01rem;
            width: 0.9rem;
            height: 0.3rem;
            outline: 0;
            border-radius: 0.15rem;
            background-image: linear-gradient(to bottom, #d11917, #ff2a25);
            border: solid 0.01rem #fef1cd;
            font-size: 0.15rem;
            line-height: 0.3rem;
            box-sizing: border-box;
            span {
                background: linear-gradient(to bottom, #ffffff, #f8d5a1);
                -webkit-background-clip: text;
                color: transparent;
                font-weight: bold;
            }
            &:active {
                background-image: linear-gradient(to bottom, #fc6f6e, #ee3331);
                span {
                    font-weight: bold;
                    color: #fff;
                }
            }
        }
    }
}
</style>
