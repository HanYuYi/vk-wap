<script setup lang="ts">
import fireImg1 from "@/assets/img/active/egame/dotaMojor/fire1_r.png"
import fireImg2 from "@/assets/img/active/egame/dotaMojor/fire2_r.png"
import fireImg3 from "@/assets/img/active/egame/dotaMojor/fire3_r.png"
import fireImg4 from "@/assets/img/active/egame/dotaMojor/fire4_r.png"
import fireImg5 from "@/assets/img/active/egame/dotaMojor/fire5_r.png"
import fireImg6 from "@/assets/img/active/egame/dotaMojor/fire6_r.png"
import fireImg7 from "@/assets/img/active/egame/dotaMojor/fire7_r.png"

import ListLazy from "@/components/ListLazy.vue"
import ApiSetting from "@/api/service"
import { useDateFormat, useNow } from "@vueuse/core"
import { ref, computed, unref, watch } from "vue"
import type { ComputedRef } from "vue"
import { useCountDown } from "@vant/use"
import type { CurrentTime } from "@vant/use"
import { useSysStore } from "@/stores/system"
import { formatCountDown, formatterYMD } from "@/utils/date"
import { RemToPx } from "@/utils/commonUtils"
import { formatNumberSplit } from "@/utils/numberUtils"
import { usePlaceImg } from "@/utils/globalImgs"
import { showToast } from "vant"
import { useFreshStore } from "@/stores/fresh"
import { HttpPlus } from "@/api/HttpPlus"
import { ActiveGetDotaMajor2023Init } from "@/api/pojo/active/ActiveGetDotaMajor2023Init"

const systemParams = useSysStore()
const freshStore = useFreshStore()
const { lazyNewLogo } = usePlaceImg()

const flakeList = [fireImg1, fireImg2, fireImg3, fireImg4, fireImg5, fireImg6, fireImg7]

const activeTabIndex = ref(1)
const initialSlide = ref(0)

const activeGetDotaMajor2023Init = new ActiveGetDotaMajor2023Init()

const initInfo = ref({
    active_id: activeGetDotaMajor2023Init.active_id,
    is_login: activeGetDotaMajor2023Init.is_login,
    show_time: activeGetDotaMajor2023Init.show_time
})

type FirstActiveInfo = ActiveGetDotaMajor2023Init["active_one"]

// 活动一数据
const firstActiveInfo = ref<{ cdtime?: ComputedRef<CurrentTime> } & FirstActiveInfo>(activeGetDotaMajor2023Init.active_one)

// 活动二数据
const lastActiveInfo = ref(activeGetDotaMajor2023Init.active_two)

const maxBonusAmount = computed<number>(() => {
    if (lastActiveInfo.value.active_setting.length) {
        return lastActiveInfo.value.active_setting[lastActiveInfo.value.active_setting.length - 1]?.bonus
    }
    return 0
})
const playgroundList = computed<string[]>(() => {
    if (lastActiveInfo.value.wallet.length) {
        return lastActiveInfo.value.wallet.map((item) => (item.name ? item.name.replace("钱包", "") : ""))
    }
    return []
})

// 去竞猜
const guessingLoading = ref(false)

const toGuessing = async (row: FirstActiveInfo["list"][number], teamKey: "team_id_1" | "team_id_2"): Promise<void> => {
    if (guessingLoading.value) return

    guessingLoading.value = true
    const params = {
        match_id: row.id,
        team_id: row[teamKey]
    }

    try {
        console.info("dota2 mojor活动1竞猜入参：", params)
        HttpPlus.setUrlOptions(ApiSetting.active.dotaMojor.guessDotaMajor)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        console.info("dota2 mojor活动1竞猜响应：", res)
        guessingLoading.value = false

        if (res.status === 1) {
            init()
            showToast({
                className: "vk-toast-success",
                message: res.message,
                icon: "checked"
            })
        }
    } catch (error: unknown) {
        guessingLoading.value = false
        console.error(error)
    }
}

const datePickerVisible = ref(false)
const recordVisible = ref(false)
const guessDate = ref("")

const dateTitle = ["赛事", "竞猜队伍", "竞猜结果", "竞猜时间"]

const YEAR = unref(useDateFormat(useNow(), "YYYY"))
const MONTH = unref(useDateFormat(useNow(), "MM"))
const DAY = unref(useDateFormat(useNow(), "DD"))
const minDate = new Date(`${Number(YEAR) - 10}/${MONTH}/${DAY}`)
const maxDate = new Date(`${Number(YEAR) + 10}/${MONTH}/${DAY}`)

// 将字符串日期转为数组
const changeDateStr = (str: string, icon: string = "/"): string[] => {
    return str.split(icon)
}
const chooseDay = ref(changeDateStr(`${YEAR}/${MONTH}/${DAY}`))

const confirmDate = (): void => {
    guessDate.value = chooseDay.value.join("-")
    datePickerVisible.value = false
    freshStore.resetList()
    getRecordList()
}

const clearDate = (): void => {
    chooseDay.value = changeDateStr(`${YEAR}/${MONTH}/${DAY}`)
    guessDate.value = ""
    freshStore.resetList()
    getRecordList()
}

const getRecordList = (): void => {
    freshStore.getList({
        url: ApiSetting.active.dotaMojor.getApplyList,
        params: {
            date: unref(guessDate)
        }
    })
}

watch(recordVisible, (val: boolean) => {
    if (val) {
        datePickerVisible.value = false
        chooseDay.value = changeDateStr(`${YEAR}/${MONTH}/${DAY}`)
        guessDate.value = ""
        freshStore.resetList()
        getRecordList()
    } else {
        freshStore.resetList()
    }
})

// 查看竞猜记录
const viewGuessRecord = (): void => {
    if (!initInfo.value.is_login) {
        showToast({
            className: "vk-toast-fail",
            message: "请您先登录",
            icon: "warning"
        })
        return
    }
    recordVisible.value = true
}

const receiveVisible = ref(false)

const receiveBonus = (): void => {
    if (lastActiveInfo.value.status === 3) return

    if (lastActiveInfo.value.status !== 0) {
        showToast({
            className: "vk-toast-fail",
            message: lastActiveInfo.value.status_tips,
            icon: "warning"
        })
        return
    }
    receiveVisible.value = true
}

const walletIndex = ref(0)

const walletCode = computed<string>(() => {
    return lastActiveInfo.value.wallet[walletIndex.value]?.code
})

const confirmLoading = ref(false)

const submitReceive = async (): Promise<void> => {
    if (confirmLoading.value) return

    confirmLoading.value = true
    try {
        const params = {
            from: "NM",
            to: unref(walletCode),
            money: lastActiveInfo.value.today_bonus,
            active_id: initInfo.value.active_id
        }

        HttpPlus.setUrlOptions(ApiSetting.user.transferSubmit)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)

        confirmLoading.value = false
        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: `${lastActiveInfo.value.today_bonus}元彩金已转入您的${
                    lastActiveInfo.value.wallet[walletIndex.value]?.name
                }，${lastActiveInfo.value.active_bet_limit}倍流水即可转出`,
                icon: "checked"
            })
            receiveVisible.value = false
            init()
        }
    } catch (error: unknown) {
        confirmLoading.value = false
        console.error(error)
    }
}

const swiperIndex = ref(0)

const onSlideChange = ({ realIndex }: { realIndex: number }): void => {
    swiperIndex.value = realIndex
}

const swiperTransitionEnd = ref(false)

const countDown = useCountDown({
    time: 1 * 1000,
    onFinish: () => {
        init()
    }
})

const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.dotaMojor.activeInit)
    const res = await HttpPlus.sendHttpRequest<ActiveGetDotaMajor2023Init>()
    systemParams.PageLoading = false

    if (res.status === 1 && res.data) {
        const { active_one, active_two } = res.data

        firstActiveInfo.value = active_one

        if (active_one.list && active_one.list.length) {
            const obj = { time: 0, index: 0 }

            // 默认选中开始时间距离当前时间最近的赛事，如果没有即将开始的，选中第一条,之前的逻辑只实现了一半
            // 即所有比赛都未开赛，才会生效；一旦有一条赛事时间过期了，逻辑就失效了，因为PC/APP已经做成那样了，暂时将错就错
            const expired = active_one.list.find((item: FirstActiveInfo["list"][number]) => item.start_time * 1000 <= Date.now())

            if (expired) {
                initialSlide.value = 0
            } else {
                active_one.list.forEach((item: FirstActiveInfo["list"][number], index: number) => {
                    if (item.start_time * 1000 - Date.now() > 0 && index) {
                        if (!obj.time || obj.time > item.start_time) {
                            obj.time = item.start_time
                            obj.index = index
                        }
                    }
                })
                if (obj.index) {
                    initialSlide.value = obj.index
                }
            }

            if (initialSlide.value === 0) {
                swiperTransitionEnd.value = true
            }

            // 竞猜进行中 且 距离结束时间 <= 1小时 显示倒计时
            firstActiveInfo.value.list = active_one.list.map((item: FirstActiveInfo["list"][number]) => {
                const timeLeft = item.deposit_end_time * 1000 - Date.now()

                if (item.game_status === 1 && timeLeft <= 60 * 60 * 1000) {
                    countDown.reset(timeLeft)
                    countDown.start()

                    return {
                        ...item,
                        cdtime: countDown.current
                    }
                } else {
                    return item
                }
            })
        }

        lastActiveInfo.value = active_two

        const filterRes = { ...res.data }
        delete filterRes.active_one
        delete filterRes.active_two
        initInfo.value = filterRes
    }
}

freshStore.resetList()

init()
</script>

<template>
    <div class="font-classic leading-relaxed">
        <HeaderBar>
            <div class="header_title">ESL One柏林 Major</div>
        </HeaderBar>
        <div class="expand-page DotaMojor-page" :class="`bg-${activeTabIndex}`">
            <DriftPost :baseBubbles="flakeList" :relativeNum="3" class="animate-bg" />
            <h4 class="date">
                {{ initInfo.show_time || "加载中" }}
            </h4>
            <ul class="active-tab">
                <li
                    v-for="num in 2"
                    :key="num"
                    @click="activeTabIndex = num"
                    :class="[`tab-${num}`, { active: activeTabIndex === num }, { 'has-tag': num === 2 }]"
                ></li>
            </ul>
            <h1 class="active-title"></h1>

            <!-- 竞猜活动-->
            <div v-show="activeTabIndex === 1" class="guess-dota-mojor">
                <h6 class="active-content">
                    活动期间，会员每日首存≥100元，完成每日精选赛事竞猜玩法“独赢”猜中，即可获得 8元奖金。
                </h6>

                <button @click="viewGuessRecord" class="record-btn">
                    <span>竞猜记录</span>
                </button>

                <!-- 赛事-->
                <template v-if="firstActiveInfo.list.length">
                    <swiper
                        @slideChange="onSlideChange"
                        @slideChangeTransitionStart="swiperTransitionEnd = false"
                        @slideChangeTransitionEnd="swiperTransitionEnd = true"
                        :initial-slide="initialSlide"
                        :space-between="RemToPx(0.12)"
                        :centered-slides="true"
                        :slides-perView="'auto'"
                        ref="dotaMojorSwiper"
                        class="guess-swiper"
                    >
                        <!--game_status 0：未开始   1：竞猜中   2：进行中   4：已结束-->
                        <swiper-slide
                            v-for="(item, index) in firstActiveInfo.list"
                            :key="index"
                            :class="[
                                {
                                    'not-started': item.game_status === 0 || item.game_status === 1
                                },
                                { progress: item.game_status === 2 },
                                { end: item.game_status === 3 }
                            ]"
                        >
                            <h2 class="match-title">{{ item.game_name }}</h2>

                            <div class="match-content">
                                <!-- 左侧战队-->
                                <!-- result:   -1: 未开   0: 和局   -2: 输   >0: 赢队伍的id -->
                                <div
                                    class="team-item team-left"
                                    :class="[
                                        { already: item.guess_who_id === item.team_id_1 },
                                        {
                                            win: item.guess_who_id === item.team_id_1 && item.result > 0
                                        },
                                        {
                                            lose: item.guess_who_id === item.team_id_1 && item.result === -2
                                        },
                                        {
                                            draw: item.guess_who_id === item.team_id_1 && item.result === 0
                                        }
                                    ]"
                                >
                                    <i class="team-logo">
                                        <img
                                            v-lazy="{
                                                src: item.l_team_logo,
                                                error: lazyNewLogo,
                                                loading: lazyNewLogo
                                            }"
                                        />
                                    </i>
                                    <h5>{{ item.l_team_name }}</h5>
                                    <button
                                        v-if="item.game_status === 1 && item.guess_who_id === -1"
                                        @click="toGuessing(item, 'team_id_1')"
                                        class="guessing"
                                    >
                                        竞猜
                                    </button>
                                </div>

                                <div class="team-center">
                                    <p class="time">{{ item.date_time }}</p>
                                    <em class="vs"></em>
                                    <small class="game-type">{{ item.game_type }}</small>
                                </div>

                                <!-- 右侧战队-->
                                <div
                                    class="team-item team-right"
                                    :class="[
                                        { already: item.guess_who_id === item.team_id_2 },
                                        {
                                            win: item.guess_who_id === item.team_id_2 && item.result > 0
                                        },
                                        {
                                            lose: item.guess_who_id === item.team_id_2 && item.result === -2
                                        },
                                        {
                                            draw: item.guess_who_id === item.team_id_2 && item.result === 0
                                        }
                                    ]"
                                >
                                    <i class="team-logo">
                                        <img
                                            v-lazy="{
                                                src: item.r_team_logo,
                                                error: lazyNewLogo,
                                                loading: lazyNewLogo
                                            }"
                                        />
                                    </i>
                                    <h5>{{ item.r_team_name }}</h5>
                                    <button
                                        v-if="item.game_status === 1 && item.guess_who_id === -1"
                                        @click="toGuessing(item, 'team_id_2')"
                                        class="guessing"
                                    >
                                        竞猜
                                    </button>
                                </div>
                            </div>

                            <template
                                v-if="
                                    item.game_status === 0 ||
                                    (item.game_status === 1 && swiperIndex === index && swiperTransitionEnd)
                                "
                            >
                                <p v-if="item.game_status === 1 && item.hasOwnProperty('cdtime')" class="deposit-time">
                                    竞猜倒计时：{{ formatCountDown(item.cdtime, true, false) }}
                                </p>
                                <p v-else class="deposit-time">
                                    该场赛事要求竞猜时间：{{
                                        useDateFormat(item.deposit_start_time * 1000, "MM.DD HH:mm").value
                                    }}-{{ useDateFormat(item.deposit_end_time * 1000, "MM.DD HH:mm").value }}
                                </p>
                            </template>
                        </swiper-slide>
                    </swiper>
                </template>

                <!-- 赛事为空时占位图-->
                <div v-else class="placeholder-pic"></div>

                <p class="info-count" style="margin: 0.2rem auto 0">
                    竞猜次数：
                    <template v-if="initInfo.is_login">
                        <span>{{ firstActiveInfo.quiz_times }}</span>
                        次
                    </template>
                    <template v-else>--</template>
                </p>

                <!-- 规则-->
                <dl class="rules">
                    <dt></dt>
                    <dd>
                        <ul>
                            <li>
                                <i>01.</i>
                                <p>每日未发起提款前的存款都视为首充。</p>
                            </li>
                            <li>
                                <i>02.</i>
                                <p>当日会员每满足首存100元即可获得一次赛事竞猜；此竞猜次数仅限当天使用有效，隔日无效。</p>
                            </li>
                            <li>
                                <i>03.</i>
                                <p>若赛事开赛时间为 00:00 点，则用户需要在指定时间内完成首存和赛事竞猜，即可竞猜成功。</p>
                            </li>
                            <li>
                                <i>04.</i>
                                <p>
                                    此竞猜结果分为：输、和、赢；参与精选赛事竞猜结算（赢）猜中，即可获得8元奖金，若竞猜结果结算为“和”将会视为无效竞猜。
                                </p>
                            </li>
                            <li>
                                <i>05.</i>
                                <p>
                                    符合条件的用户只需等待当日赛事结束即可，工作人员将会在24小时内统一派彩，活动彩金将会添加至用户主钱包中，彩金流水需要完成全站5倍有效流水。
                                </p>
                            </li>
                            <li>
                                <i>06.</i>
                                <p>
                                    电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                                    <span
                                        @click="
                                            () => {
                                                systemParams.ActiveMoreRules.classname = 'DotaMojor'
                                                systemParams.ActiveMoreRules.isShow = true
                                            }
                                        "
                                    >
                                        查看详情
                                    </span>
                                    。
                                </p>
                            </li>
                            <li>
                                <i>07.</i>
                                <p>
                                    每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠。对违规的用户，VKGAME保留无限期审核，和扣回红利及所产生的利润权利，本活动最终解释权归VKGAME所有。
                                </p>
                            </li>
                        </ul>
                    </dd>
                </dl>
            </div>

            <!-- 投注活动-->
            <div v-show="activeTabIndex === 2" class="rebate-dota-mojor">
                <h6 class="active-content">
                    活动期间，会员每日在电竞场馆【ESL One柏林 Major】中累计有效流水≥5000，即可申请领取相应优惠彩金，最高可获得{{
                        formatNumberSplit(maxBonusAmount, 0)
                    }}元。
                </h6>

                <div class="rebate-panel">
                    <table border="0" align="center" cellspacing="0">
                        <tr>
                            <th>游戏场馆</th>
                            <th>有效投注(￥)</th>
                            <th>返利彩金(￥)</th>
                            <th>流水要求</th>
                        </tr>
                        <tr v-for="(item, index) in lastActiveInfo.active_setting" :key="index">
                            <td v-if="index === 0" :rowspan="lastActiveInfo.active_setting.length">
                                <span v-for="(wallet, i) in playgroundList" :key="i">
                                    {{ wallet }}
                                    <br v-if="i < lastActiveInfo.wallet.length - 1" />
                                </span>
                            </td>
                            <td>{{ formatNumberSplit(item.amount, 0) }}+</td>
                            <td>{{ formatNumberSplit(item.bonus, 0) }}</td>
                            <td v-if="index === 0" :rowspan="lastActiveInfo.active_setting.length" class="mini">
                                电竞{{ lastActiveInfo.active_bet_limit }}倍
                                <br />
                                有效流水
                            </td>
                        </tr>
                    </table>
                </div>

                <p class="info-count" style="margin: 0.19rem auto 0">
                    <template v-if="initInfo.is_login">
                        昨日累计有效投注
                        <span>{{ formatNumberSplit(lastActiveInfo.yesterday_profit) }}</span>
                        元，今日{{ lastActiveInfo.status === 3 ? "已" : "可" }}领
                        <span>{{ formatNumberSplit(lastActiveInfo.today_bonus) }}</span>
                        元
                    </template>
                    <template v-else>昨日累计有效投注 --，今日可领 --</template>
                </p>

                <button @click="receiveBonus" class="receive-rebate" :class="{ received: lastActiveInfo.status === 3 }"></button>

                <!-- 规则-->
                <dl class="rules">
                    <dt></dt>
                    <dd>
                        <ul style="margin: 0.19rem 0.23rem 0">
                            <li>
                                <i>01.</i>
                                <p>每日返利金需在本活动页面手动领取，每日仅限领取一次。</p>
                            </li>
                            <li>
                                <i>02.</i>
                                <p>
                                    每日累计流水达到对应的额度即可领取彩金，领取时间为次日
                                    00:30:00-23:59:59，指定时间内未领取视为自动放弃。
                                </p>
                            </li>
                            <li>
                                <i>03.</i>
                                <p>
                                    用户在领取【ESL One柏林 Major】每日返利金时选择将其领取至对应的电竞游戏钱包（{{
                                        playgroundList.join("、")
                                    }}），每日返利金需完成3倍电竞有效流水，活动流水未完成前不可再次申请。
                                </p>
                            </li>
                            <li>
                                <i>04.</i>
                                <p>
                                    电竞游戏场馆仅限：{{
                                        playgroundList.join("、")
                                    }}。有效投注额仅计算产生输赢结果的注单，电竞赔率＜1.5，走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效投注。
                                </p>
                            </li>
                            <li>
                                <i>05.</i>
                                <p>
                                    每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利；VKGAME对本活动保有最终解释权。
                                </p>
                            </li>
                        </ul>
                    </dd>
                </dl>
            </div>
        </div>
        <van-dialog
            v-model:show="receiveVisible"
            class="receive-dota-mojor"
            teleport="body"
            :close-on-click-overlay="false"
            :show-confirm-button="false"
            @close="receiveVisible = false"
        >
            <div class="receive-main" :class="{ disabled: confirmLoading }">
                <h3>
                    领取
                    <b>{{ lastActiveInfo.today_bonus }}</b>
                    元彩金至
                </h3>

                <ul class="wallet-list">
                    <li
                        v-for="(item, index) in lastActiveInfo.wallet"
                        :key="index"
                        @click="walletIndex = index"
                        :class="{ active: walletIndex === index }"
                    >
                        {{ item?.name }}
                    </li>
                </ul>

                <p class="water-tips">{{ lastActiveInfo.active_bet_limit }}倍彩金流水转出</p>
            </div>

            <button @click="submitReceive" class="receive-btn" :class="{ disabled: confirmLoading }">确定</button>
        </van-dialog>
        <van-popup
            v-model:show="recordVisible"
            round
            position="bottom"
            class="record-guess-dota-mojor"
            teleport="body"
            :close-on-popstate="true"
            :style="{ width: '100%', height: '4.7rem' }"
            :duration="0.2"
            :closeable="true"
            close-icon-position="top-right"
            @close="recordVisible = false"
        >
            <div class="my-record">
                <!-- 表头-->
                <div class="table-form">
                    <div class="form-date">
                        <label>日期</label>
                        <div @click="datePickerVisible = true" class="content-date">
                            <p class="val">{{ guessDate }}</p>
                            <i v-if="!guessDate" class="icon"></i>
                            <i v-else @click.stop="clearDate" class="icon close"></i>
                        </div>
                    </div>
                </div>

                <div class="content-record">
                    <!-- 数据head-->
                    <ul class="list-head width-set">
                        <li v-for="(txt, index) in dateTitle" :key="index">
                            {{ txt }}
                        </li>
                    </ul>
                    <!-- 数据list-->

                    <ListLazy v-if="freshStore.list.length" @load="getRecordList" class="content-list">
                        <van-cell v-for="(item, index) in freshStore.list" :key="index">
                            <ul class="width-set">
                                <li>
                                    <p>{{ item.game_name }}</p>
                                </li>
                                <li>
                                    <p :class="{ checked: item.result === item.team_name_1 }">
                                        <span>{{ item.team_name_1 }}</span>
                                    </p>
                                    <p :class="{ checked: item.result === item.team_name_2 }">
                                        <span>{{ item.team_name_2 }}</span>
                                    </p>
                                </li>
                                <li>
                                    <!-- is_win:   -1: 未开  0: 输， 1: 赢 -->
                                    <span v-if="item.is_win === -1" class="progress">进行中</span>
                                    <template v-if="item.is_win === 1" class="win">赢</template>
                                    <span v-if="item.is_win === 0" class="lose">输</span>
                                </li>
                                <li>{{ item.apply_time.replace(/[0-9]{4}-/, "") }}</li>
                            </ul>
                        </van-cell>
                    </ListLazy>

                    <div v-if="!freshStore.listLoading && !freshStore.list.length" class="empty-data">
                        <p>暂无数据</p>
                    </div>
                </div>
                <van-popup v-model:show="datePickerVisible" position="bottom">
                    <!-- 时间选择器-->
                    <van-date-picker
                        :formatter="formatterYMD"
                        v-model="chooseDay"
                        title="选择日期"
                        :min-date="minDate"
                        :max-date="maxDate"
                        @cancel="datePickerVisible = false"
                        @confirm="confirmDate"
                    />
                </van-popup>
            </div>
        </van-popup>
    </div>
</template>

<style lang="less" scoped>
.ellipsis-txt {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.linear-txt {
    background-image: linear-gradient(to bottom, #fff, #a6c9dd);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.DotaMojor-page {
    padding-bottom: 0.25rem;
    overflow: hidden;
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 100% auto;
    position: relative;
    &.bg-1 {
        background-image: url("@/assets/img/active/egame/dotaMojor/banner_1.png");
    }
    &.bg-2 {
        background-image: url("@/assets/img/active/egame/dotaMojor/banner_2.png");
    }

    .animate-bg {
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 3;
    }

    .date {
        height: 0.24rem;
        margin-top: 3.4rem;
        text-align: center;
        font-size: 0.12rem;
        line-height: 0.24rem;
        color: #fff;
        font-weight: normal;
        background: url("@/assets/img/active/egame/dotaMojor/date_bg.png") no-repeat center top;
        background-size: auto 100%;
    }

    .active-tab {
        width: 3.51rem;
        margin: 0.3rem auto 0;
        display: flex;
        justify-content: space-between;

        li {
            width: 1.705rem;
            height: 0.46rem;
            &.has-tag {
                position: relative;
                &::before {
                    position: absolute;
                    content: "";
                    top: -0.09rem;
                    right: 0;
                    width: 0.57rem;
                    height: 0.215rem;
                    background: url("@/assets/img/active/egame/dotaMojor/tab_2_tag.png");
                    background-size: 100% 100%;
                }
            }
        }
        .bgFn(@num) {
            .tab-@{num} {
                background-image: url("@/assets/img/active/egame/dotaMojor/tab_@{num}.png");
                background-size: 100% 100%;
                &.active {
                    background-image: url("@/assets/img/active/egame/dotaMojor/tab_@{num}_active.png");
                    background-size: 100% 100%;
                }
            }
        }
        .bgFn(1);
        .bgFn(2);
    }

    .active-title {
        margin-top: 0.32rem;
        height: 0.59rem;
        background: url("@/assets/img/active/egame/dotaMojor/active_title.png") no-repeat center top;
        background-size: auto 100%;
    }

    .active-content {
        margin: 0.17rem 0.22rem 0;
        font-weight: normal;
        font-size: 0.12rem;
        line-height: 0.18rem;
        color: #bae1e4;
    }

    .record-btn {
        display: block;
        margin: 0.1rem auto 0;
        width: 0.7rem;
        height: 0.3rem;
        outline: 0;
        border: 0;
        background: url("@/assets/img/active/egame/dotaMojor/record_btn.png");
        background-size: 100% 100%;
        transition: transform 0.1s;
        white-space: nowrap;
        span {
            .linear-txt;
            font-size: 0.12rem;
        }
        &:active {
            transform: scale(0.96, 0.96);
        }
    }

    .guess-swiper {
        margin-top: 0.24rem;
        width: 3.75rem;
        height: 2.235rem;
        .swiper-slide {
            width: 3.39rem;
            height: inherit;
            background: url("@/assets/img/active/egame/dotaMojor/group_item.png");
            background-size: 100% 100%;

            &.not-started,
            &.progress,
            &.end {
                position: relative;
                &::before {
                    position: absolute;
                    width: 0.6rem;
                    height: 0.24rem;
                    top: 0.06rem;
                    right: 0.02rem;
                    font-size: 0.12rem;
                    line-height: 0.24rem;
                    text-align: center;
                    background-size: 100% 100%;
                }
            }
            &.not-started {
                &::before {
                    content: "未开始";
                    background-image: url("@/assets/img/active/egame/dotaMojor/not_started_icon.png");
                    color: #aed8e8;
                }
            }
            &.progress {
                &::before {
                    content: "进行中";
                    background-image: url("@/assets/img/active/egame/dotaMojor/progress_icon.png");
                    color: #d0f4ff;
                }
            }
            &.end {
                &::before {
                    content: "已结束";
                    background-image: url("@/assets/img/active/egame/dotaMojor/end_icon.png");
                    color: #728793;
                }
            }

            .match-title {
                width: 1.66rem;
                height: 0.35rem;
                margin: 0 auto;
                font-size: 0.12rem;
                text-align: center;
                line-height: 0.35rem;
                .ellipsis-txt;
                .linear-txt;
            }

            .match-content {
                display: flex;
                width: 3.15rem;
                margin: 0.1rem auto 0;

                .team-item {
                    width: 1.16rem;
                    text-align: center;

                    &.already,
                    &.win,
                    &.lose,
                    &.draw {
                        width: 1.16rem;
                        height: 1.46rem;
                        background: url("@/assets/img/active/egame/dotaMojor/team_already.png");
                        background-size: 100% 100%;
                    }

                    &.win,
                    &.lose,
                    &.draw {
                        position: relative;

                        &::before {
                            position: absolute;
                            content: "";
                            top: 0.01rem;
                            left: 0.01rem;
                            width: 0.38rem;
                            height: 0.36rem;
                            background-size: 100% 100%;
                        }
                    }

                    &.win {
                        &::before {
                            background-image: url("@/assets/img/active/egame/dotaMojor/win.png");
                        }
                    }

                    &.lose {
                        &::before {
                            background-image: url("@/assets/img/active/egame/dotaMojor/lose.png");
                        }
                    }
                    &.draw {
                        &::before {
                            background-image: url("@/assets/img/active/egame/dotaMojor/draw.png");
                        }
                    }

                    .team-logo {
                        display: inline-block;
                        margin-top: 0.09rem;
                        width: 0.64rem;
                        height: 0.64rem;
                        background: url("@/assets/img/active/egame/dotaMojor/team_logo_bg.png");
                        background-size: 100% 100%;

                        img {
                            margin-top: 17%;
                            height: 60%;
                            max-width: 60%;
                        }
                    }

                    h5 {
                        width: 100%;
                        font-weight: normal;
                        font-size: 0.12rem;
                        margin: 0.07rem auto 0;
                        color: #ffffff;
                        .ellipsis-txt;
                    }

                    .guessing {
                        padding: 0;
                        width: 0.8rem;
                        height: 0.32rem;
                        margin-top: 0.09rem;
                        font-size: 0.12rem;
                        box-sizing: border-box;
                        border-radius: 0.04rem;
                        color: #fff;
                        border: 0.005rem solid transparent;
                        background-image: linear-gradient(#22547c, #336b87), linear-gradient(#4e83a2, #4e83a2);
                        background-origin: border-box;
                        background-clip: content-box, border-box;
                        transition: all 0.1s;
                        &:active {
                            background-image: linear-gradient(#227cac, #44acc5), linear-gradient(#44acc5, #44acc5);
                        }
                    }
                }

                .team-center {
                    width: 0.83rem;
                    color: #ffffff;
                    text-align: center;
                    font-size: 0.11rem;
                    position: relative;
                    .time {
                        position: absolute;
                        margin-top: 0.09rem;
                        text-align: center;
                        left: -1.16rem;
                        width: 3.15rem;
                    }

                    .vs {
                        margin: 0.25rem auto 0;
                        display: block;
                        width: 0.54rem;
                        height: 0.46rem;
                        background: url("@/assets/img/active/egame/dotaMojor/vs_icon.png");
                        background-size: 100% 100%;
                    }

                    .game-type {
                        display: block;
                        margin-top: 0.12rem;
                        font-size: 0.12rem;
                    }
                }
            }

            .deposit-time {
                margin-top: 0.12rem;
                font-size: 0.11rem;
                text-align: center;
                color: #fff;
            }
        }
    }

    .placeholder-pic {
        margin: 0.24rem auto 0;
        width: 3.39rem;
        height: 2.19rem;
        background: url("@/assets/img/active/egame/dotaMojor/team_pic.png");
        background-size: 100% 100%;
    }

    .rebate-panel {
        margin: 0.2rem auto 0;
        width: 3.51rem;
        height: 4.08rem;
        background: url("@/assets/img/active/egame/dotaMojor/rebate_bg.png");
        background-size: 100% 100%;
        table {
            width: 100%;
            font-size: 0.11rem;
            text-align: center;
            tr {
                th {
                    font-weight: normal;
                    color: #adc8c7;
                    line-height: 0.41rem;
                }
                td {
                    width: 25%;
                    color: #ffffff;
                    line-height: 0.408rem;
                    &.mini {
                        line-height: 0.16rem;
                    }
                }
            }
        }
    }

    .receive-rebate {
        display: block;
        margin: 0.19rem auto 0;
        width: 1.3rem;
        height: 0.4rem;
        background-color: transparent;
        outline: 0;
        border: 0;
        background-image: url("@/assets/img/active/egame/dotaMojor/receive_btn.png");
        background-size: 100% 100%;
        transition: transform 0.1s;
        &:active {
            transform: scale(0.96, 0.96);
        }
        &.received {
            background-image: url("@/assets/img/active/egame/dotaMojor/received_btn.png");
            &:active {
                transform: none;
            }
        }
    }

    .info-count {
        width: fit-content;
        font-size: 0.12rem;
        line-height: 0.3rem;
        text-align: center;
        color: #fff;
        box-sizing: border-box;
        border-radius: 0.16rem;
        border: 0.01rem solid #192131;
        background: rgba(0, 0, 0, 0.2);
        padding: 0 0.12rem;
        span {
            color: #90fff1;
            font-size: 0.15rem;
            vertical-align: top;
        }
    }

    .rules {
        width: 3.51rem;
        dt {
            height: 0.59rem;
            background: url("@/assets/img/active/egame/dotaMojor/rules_title.png") no-repeat center top;
            background-size: auto 100%;
        }
        dd {
            margin-top: 0.24rem;
            overflow: hidden;
            background-size: 100% 100%;
            ul {
                margin: 0.15rem 0.23rem 0;
                li {
                    margin-top: 0.1rem;
                    font-size: 0.12rem;
                    line-height: 0.18rem;
                    color: #bae1e5;
                    display: flex;
                    i {
                        font-weight: bold;
                        margin-right: 0.08rem;
                    }
                }
            }
        }
    }

    .guess-dota-mojor {
        .rules {
            margin: 0.3rem auto 0;
            dd {
                height: 4.5rem;
                background-image: url("@/assets/img/active/egame/dotaMojor/rule1_bg.png");
            }
        }
    }

    .rebate-dota-mojor {
        .rules {
            margin: 0.4rem auto 0;
            dd {
                height: 3.99rem;
                background-image: url("@/assets/img/active/egame/dotaMojor/rule2_bg.png");
            }
        }
    }
}
</style>
<style lang="less">
.van-popup.record-guess-dota-mojor {
    background-color: #222c44;
    overflow: hidden;
    :deep(.van-popup__close-icon) {
        top: 0.28rem;
        right: 0.18rem;
        font-size: 0.2rem;
    }

    .my-record {
        position: relative;
        border-top: 0.1px solid transparent;

        .table-form {
            position: absolute;
            width: 100%;
            background-image: linear-gradient(to top, #222c44, #263c55);
            padding: 0.2rem 0.12rem 0.15rem;

            .form-date {
                display: flex;
                label {
                    font-size: 0.12rem;
                    line-height: 0.34rem;
                    color: #fff;
                }

                .content-date {
                    display: flex;
                    justify-content: space-evenly;
                    margin-left: 0.1rem;
                    width: 1.1rem;
                    height: 0.34rem;
                    border-radius: 0.06rem;
                    border: solid 1px #1b253e;
                    background: #2f4367;

                    .val {
                        width: 0.8rem;
                        height: inherit;
                        font-size: 0.12rem;
                        line-height: 0.336rem;
                        color: #d6e7f7;
                        white-space: nowrap;
                    }

                    .icon {
                        margin-top: 0.155rem;
                        display: block;
                        width: 0.05rem;
                        height: 0.03rem;
                        background-image: url("@/assets/img/active/worldCup2022/select_arrow.png");
                        background-size: 100% 100%;
                        &.close {
                            margin-top: 0.105rem;
                            width: 0.12rem;
                            height: 0.12rem;
                            background-image: url("@/assets/img/active/worldCup2022/date_close.png");
                        }
                    }
                }
            }
        }

        .content-record {
            margin: 0.69rem auto 0;
            width: 3.51rem;
            border-radius: 0.06rem;
            overflow: hidden;
            box-sizing: border-box;
            border: solid 1px #131a2b;
            .width-set {
                display: flex;
                li {
                    &:first-child {
                        width: 30%;
                    }
                    &:nth-child(2) {
                        width: 35%;
                    }
                    &:nth-child(3) {
                        width: 15%;
                    }
                    &:nth-child(4) {
                        width: 20%;
                    }
                }
            }

            .list-head {
                background-image: linear-gradient(to top, #2b3d5e, #344a71);
                padding: 0 0.13rem;
                li {
                    line-height: 0.41rem;
                    font-size: 0.11rem;
                    text-align: center;
                    color: #d6e7f7;
                    &:first-child,
                    &:nth-child(2) {
                        text-align: left;
                    }
                }
            }

            .content-list {
                height: 4.7rem - 0.84 - 0.41;
                background-color: #25344e;
                overflow-x: hidden;
                overflow-y: scroll;
                .van-cell {
                    background-color: transparent;
                    padding: 0;
                    height: 0.6rem;
                    &::after {
                        border-bottom: 1px solid #131a2b;
                        left: 0;
                        right: 0;
                    }
                    .van-cell__value {
                        padding: 0 0.13rem;

                        ul {
                            li {
                                font-size: 0.11rem;
                                line-height: 0.6rem;
                                text-align: center;
                                color: #fff;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;

                                &:first-child {
                                    p {
                                        width: 90%;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                    }
                                }

                                &:nth-child(2) {
                                    text-align: left;

                                    p {
                                        width: 0.96rem;
                                        line-height: 0.24rem;
                                        border-radius: 0.04rem;
                                        color: #d6e7f7;

                                        &:first-child {
                                            margin-top: 0.06rem;
                                        }

                                        span {
                                            margin-left: 0.06rem;
                                            display: block;
                                            width: 0.65rem;
                                            white-space: nowrap;
                                            text-overflow: ellipsis;
                                            overflow: hidden;
                                        }

                                        &.checked {
                                            background: url("@/assets/img/active/egame/dotaMojor/record_checked.png");
                                            background-size: 100% 100%;
                                        }
                                    }
                                }

                                &:nth-child(3) {
                                    .progress {
                                        color: #d6e7f7;
                                    }

                                    .lose {
                                        color: #677a8a;
                                    }
                                }
                            }
                        }
                    }
                }

                .van-list__finished-text {
                    color: #677a8a;
                    font-size: 0.11rem;
                }
                .van-list__loading {
                    color: #677a8a;
                    font-size: 0.11rem;
                    .van-loading {
                        color: #677a8a;
                        .van-loading__text {
                            color: #677a8a;
                            font-size: 0.11rem;
                        }
                    }
                }
            }

            .empty-data {
                height: 4.7rem - 0.84 - 0.41;
                background: url("@/assets/img/active/egame/dotaMojor/empty_record.png") no-repeat center 1.2rem;
                background-size: 0.4rem;
                p {
                    font-size: 0.12rem;
                    line-height: 3.7rem;
                    text-align: center;
                    color: #a5b6c5;
                }
            }
        }

        .dota-mojor-picker {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 2;
        }
    }
}
.van-dialog.receive-dota-mojor {
    top: 50%;
    width: 3.395rem;
    height: 3.8rem;
    background-color: transparent;
    line-height: 1.6;

    .van-dialog__content {
        overflow: hidden;

        .receive-main {
            height: 3.06rem;
            background: url("@/assets/img/active/egame/dotaMojor/receive_bg.png") no-repeat center bottom;
            background-size: 100% 100%;
            text-align: center;
            overflow-y: hidden;
            &.disabled {
                * {
                    pointer-events: none;
                }
            }

            h3 {
                margin-top: 1.34rem;
                font-size: 0.18rem;
                font-weight: normal;
                color: #fff;
                b {
                    color: #fff369;
                    font-size: 0.24rem;
                    vertical-align: middle;
                    font-weight: bold;
                }
            }

            .wallet-list {
                width: 2.08rem;
                margin: 0.1rem auto 0;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                li {
                    width: 1rem;
                    height: 0.4rem;
                    border-radius: 0.04rem;
                    box-sizing: border-box;
                    box-shadow: 0 0.01rem 0.025rem 0 rgba(21, 29, 46, 0.4);
                    border: solid 0.005rem #456b9b;
                    background-color: #457a93;
                    font-size: 0.12rem;
                    line-height: 0.39rem;
                    color: #fff;
                    margin-bottom: 0.08rem;
                    &.active {
                        box-shadow: 0 0 0 0.02rem rgba(109, 244, 245, 0.1), inset 0 0 0 0.005rem #49c8d7,
                            0 0.01rem 0.025rem 0 rgba(21, 29, 46, 0.5);
                        background-image: linear-gradient(to top, #43c4d2, #2ea7bd);
                    }
                }
            }

            .water-tips {
                font-size: 0.11rem;
                color: #c7f4ff;
            }
        }

        .receive-btn {
            display: block;
            margin: 0.3rem auto 0;
            width: 1.3rem;
            height: 0.44rem;
            outline: 0;
            font-size: 0.16rem;
            text-align: center;
            color: #fff;
            border-radius: 0.06rem;
            box-shadow: inset 0 -0.02rem 0 0 #59b2dc;
            border: solid 0.005rem #408db1;
            background-image: linear-gradient(to top, #428aa3, #408db1);
            transition: all 0.1s;

            &.disabled {
                pointer-events: none;
                .receive-btn {
                    opacity: 0.7;
                }
            }
            &:active {
                box-shadow: inset 0 -0.02rem 0 0 #6dcaf5;
                border: solid 0.005rem #54afda;
                background-image: linear-gradient(to top, #4bb3d2, #4f9be1);
            }
        }
    }
}
</style>
