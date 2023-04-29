<script setup lang="ts">
import BannerImg from "@/assets/img/active/realman/RealPersonDailyReturn/wap-banner.jpg"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import ApiSetting from "@/api/service"
import { ref, computed, unref } from "vue"
import { useSysStore } from "@/stores/system"
import { formatNumberSplit } from "@/utils/numberUtils"
import { showToast } from "vant"
import { HttpPlus } from "@/api/HttpPlus"
import { BaseActiveStruct } from "@/api/pojo/BaseStruct"

const systemParams = useSysStore()

class ActiveGetRealPersonDailyReturnInit extends BaseActiveStruct {
    // 状态： 0  可领   1 已领取   *** 其他状态
    status: number = 0

    status_tips: string = ""

    today_bonus: number = 0

    yesterday_bet: number = 0

    active_setting: {
        limit: number

        info: {
            deposit: number
            bonus: number
        }[]
    } = {
        limit: 5,

        info: []
    }

    walletList?: { name: string; code: string }[]
}
const initData = ref<ActiveGetRealPersonDailyReturnInit>(new ActiveGetRealPersonDailyReturnInit())

const show = ref(false)
const confirmLoading = ref(false)

const transfer = async (): Promise<void> => {
    confirmLoading.value = true
    try {
        const params = {
            from: "NM",
            to: unref(walletCode),
            money: initData.value.today_bonus,
            active_id: initData.value.active_id
        }
        HttpPlus.setUrlOptions(ApiSetting.user.transferSubmit)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        confirmLoading.value = false
        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: `${initData.value.today_bonus}元彩金已转入您的${walletList.value[walletIndex.value].name}，${
                    initData.value.active_setting.limit
                }倍流水即可提款!`,
                icon: "checked"
            })
            show.value = false
            initData.value.status = 1
            init()
        }
    } catch (error: unknown) {
        confirmLoading.value = false
        console.error(error)
    }
}

const open = (): void => {
    walletIndex.value = 0
    show.value = true
}

const btnText = computed(() => {
    if (initData.value.status == 1) {
        return "已领取"
    } else {
        return "立即领取"
    }
})
const walletIndex = ref(0)
const walletList = ref<ActiveGetRealPersonDailyReturnInit["walletList"]>([])

const walletCode = computed<string>(() => {
    if (walletList.value.length) {
        return walletList.value[walletIndex.value]?.code
    }
    return ""
})

const desc = computed<string>(() => {
    return `活动期间，会员每日在真人场馆完成≥${
        initData.value.active_setting?.info ? formatNumberSplit(initData.value.active_setting.info[0]?.deposit, 0) : 0
    }元有效投注，即可申请领取相应优惠彩金，最高可获得${
        initData.value.active_setting?.info
            ? formatNumberSplit(initData.value.active_setting.info[initData.value.active_setting.info.length - 1]?.bonus, 0)
            : 0
    }元。`
})

const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.initBackwaterForever)
    const res = await HttpPlus.sendHttpRequest<ActiveGetRealPersonDailyReturnInit>()
    systemParams.PageLoading = false
    if (res.status === 1 && res.data) {
        initData.value = res.data
        if (res.data.walletList && res.data.walletList.length) {
            walletList.value = res.data.walletList
        }
    }
}

init()
</script>

<template>
    <ActiveUniversalTem
        class="RealPersonDailyReturn-Page"
        :headTitle="'真人返不停'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        :walletList="walletList"
        :desc="desc"
        :btnText="btnText"
        :btnDisable="[1, 2, 4].includes(initData.status)"
        @open="open"
    >
        <template #table>
            <table cellspacing="0" width="100%">
                <tr>
                    <th>有效投注(￥)</th>
                    <th>返利彩金(￥)</th>
                    <th>流水要求</th>
                </tr>
                <tr v-for="(item, index) in initData.active_setting.info" :key="index">
                    <td>≥{{ formatNumberSplit(item.deposit, 0) }}</td>
                    <td class="bold-red">{{ formatNumberSplit(item.bonus, 0) }}</td>
                    <td v-if="index === 0" :rowspan="initData.active_setting.info.length">
                        {{ initData.active_setting.limit }}倍真人
                    </td>
                </tr>
            </table>
        </template>
        <template #btndesc>
            <p class="liushui" v-if="initData.is_login">
                <template v-if="initData.status === 0 || initData.status === 1">
                    昨日累计有效流水{{ formatNumberSplit(initData.yesterday_bet, 0) }}元，今日{{
                        initData.status === 0 ? "可" : "已"
                    }}领
                    <span>{{ formatNumberSplit(initData.today_bonus, 0) }}</span>
                    元
                </template>
                <template v-else-if="[2, 3, 4].includes(initData.status)">
                    {{ initData.status_tips }}
                </template>
            </p>
        </template>
        <template #rules>
            <ol>
                <li>真人每日返利金需在本活动页面手动领取，每日仅限领取一次。</li>
                <li>每日累计流水达到对应的额度即可领取彩金，领取时间为次日 00:30:00-23:59:59，指定时间内未领取视为自动放弃。</li>
                <li>
                    用户在领取真人每日返利金时选择将其领取至对应的真人游戏钱包（AG真人、PM真人、欧博真人、PT真人），真人每日返利金需完成{{
                        initData.active_setting.limit
                    }}倍真人有效流水，活动流水未完成前不可再次申请。
                </li>
                <li>有效流水仅计算产生输赢结果的注单；注单取消、对冲、未结算等不计算为有效流水。</li>
                <li>
                    每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利；VKGAME对本活动保有最终解释权。
                </li>
            </ol>
        </template>
        <template #dialog>
            <van-dialog
                class="active-universal-dialog"
                :close-on-click-overlay="true"
                v-model:show="show"
                :show-confirm-button="false"
                get-container="body"
            >
                <div class="close" @click="show = false"></div>
                <div>
                    <div class="dialog_title">
                        可领彩金：
                        <span class="text-#07f0bc">{{ formatNumberSplit(initData.today_bonus, 0) }}</span>
                        元
                    </div>
                    <div class="wallet_title">转入至：</div>
                    <div class="wallet_box_wrapper" v-if="walletList.length">
                        <div
                            @click="walletIndex = i"
                            class="wallet_box"
                            :class="[`${item.code}`, { active: walletIndex === i }]"
                            v-for="(item, i) in walletList"
                            :key="i"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                    <div v-if="!walletList.length" class="wallet_box_wrapper">
                        <van-loading class="ab-center" type="spinner" />
                    </div>
                </div>
                <div class="vk_comfire_btn">
                    <van-button
                        :loading="confirmLoading"
                        @click="transfer"
                        class="h-36px primary-btn rounded-30px border-none text-15px text-#000"
                        block
                    >
                        确定
                    </van-button>
                </div>
            </van-dialog>
        </template>
    </ActiveUniversalTem>
</template>
