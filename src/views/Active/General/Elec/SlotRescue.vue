<script setup lang="ts">
import BannerImg from "@/assets/img/active/elec/SlotRescue/banner.jpg"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import { useDateFormat } from "@vueuse/core"
import ApiSetting from "@/api/service"
import { ref, computed, unref } from "vue"
import { useSysStore } from "@/stores/system"
import { ELEC_WALLETS } from "@/const/Wallet"
import { showToast } from "vant"
import { BaseActiveStruct } from "@/api/pojo/BaseStruct"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

const show = ref(false)

class ActiveGetSlotRescueFundInit extends BaseActiveStruct {
    status_tip: string = ""

    bouns: number = 0

    status: number = 0

    active_setting: {
        bet_times: number
        first_deposit: number
        max_bonus: number
        negative_profit: number
        percent: number
        percent_show: number
    } = {
        bet_times: 8,
        first_deposit: 500,
        max_bonus: 688,
        negative_profit: 500,
        percent: 0.03,
        percent_show: 3
    }
}

const initData = ref<ActiveGetSlotRescueFundInit>(new ActiveGetSlotRescueFundInit())

const btnDisable = computed<boolean>(() => {
    if (initData.value.is_login && initData.value.status === 1) {
        return true
    }
    return false
})
const btnText = computed(() => {
    if (initData.value.is_login && initData.value.status === 1) {
        return "已领取"
    }
    return "立即申请"
})

const desc = computed<string>(() => {
    return `活动期间， 凡当日首充≥${initData.value.active_setting.first_deposit}且在威客电子游戏中累计产生负盈利≥${
        initData.value.active_setting.negative_profit
    }的玩家，即可申请电子游戏负盈利的${initData.value.active_setting.percent_show}%返利。<br>
           例：用户A当日首充${initData.value.active_setting.first_deposit}元，在电子游戏中累计负盈利${
        initData.value.active_setting.negative_profit
    }元，此时可申请领取${initData.value.active_setting.negative_profit}x${initData.value.active_setting.percent_show}%=${
        initData.value.active_setting.negative_profit * initData.value.active_setting.percent
    }元的返利彩金。`
})

const walletIndex = ref(0)
const walletCode = computed<string>(() => {
    if (ELEC_WALLETS.length) {
        return ELEC_WALLETS[walletIndex.value]?.code
    }
    return ""
})

const confirmLoading = ref(false)

const transfer = async (): Promise<void> => {
    confirmLoading.value = true
    try {
        const params = {
            from: "NM",
            to: unref(walletCode),
            money: initData.value.bouns,
            active_id: initData.value.active_id
        }
        HttpPlus.setUrlOptions(ApiSetting.user.transferSubmit)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        confirmLoading.value = false
        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: `领取成功！`,
                icon: "checked"
            })
            show.value = false
            initData.value.status = 1
            const timer = setTimeout(() => {
                clearTimeout(timer)
                init()
            }, 1000)
        }
    } catch (error: unknown) {
        confirmLoading.value = false
        console.error(error)
    }
}

const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.getSlotRescueFundInit)
    const res = await HttpPlus.sendHttpRequest<ActiveGetSlotRescueFundInit>()
    systemParams.PageLoading = false
    if (res.status === 1 && res.data) {
        initData.value = res.data
        initData.value.active_show_time = useDateFormat(res.data.active_start_time * 1000, "YYYY[年]MM[月]DD[日]").value + "起"
    }
}

init()
</script>

<template>
    <ActiveUniversalTem
        class="SlotRescue-Page"
        :headTitle="'打虎英雄救援金'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        :desc="desc"
        :walletList="ELEC_WALLETS"
        :btnDisable="btnDisable"
        :btnText="btnText"
        @open="
            () => {
                walletIndex = 0
                show = true
            }
        "
    >
        <template #table>
            <table cellspacing="0" width="100%">
                <thead>
                    <tr align="center">
                        <th class="text-12px! text-#262933! h-28px!">当日首充</th>
                        <th class="text-12px! text-#262933! h-28px!">电子游戏负盈利</th>
                        <th class="text-12px! text-#262933! h-28px!">返利百分比</th>
                        <th class="text-12px! text-#262933! h-28px!">红利上限</th>
                        <th class="text-12px! text-#262933! h-28px!">红利流水倍数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-12px! h-62px!">
                            {{ initData.active_setting.first_deposit }}
                        </td>
                        <td class="text-12px! h-62px!">
                            {{ initData.active_setting.negative_profit }}
                        </td>
                        <td class="text-12px! h-62px!">{{ initData.active_setting.percent_show }}%</td>
                        <td class="text-12px! h-62px!">
                            {{ initData.active_setting.max_bonus }}
                        </td>
                        <td class="text-12px! h-62px!">
                            电子游戏
                            <br />
                            {{ initData.active_setting.bet_times }}倍流水
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>
        <template #btndesc></template>
        <template #rules>
            <ol>
                <li>电子游戏包括：PG电子游戏、PT电子游戏。</li>
                <li>VIP会员每日未提款前的累计有效存款都视为首充。</li>
                <li>
                    满足条件的用户需在产生负盈利的次日（00:00:00至23:59:59）期间在本活动页面申请此优惠活动，逾期则视为自动放弃。
                </li>
                <li>
                    申请获得的奖金将自动派发至用户指定的的电子游戏钱包中，活动奖金需在电子游戏中完成8倍流水即可转出。当用户对应电子钱包余额≤原钱包余额且无未结算注单时，系统将自动判定已完成活动规定的有效流水，活动流水未完成前不可再次申请本活动。
                </li>
                <li>此活动不与其他首存活动、救援金活动共享，每位用户每日仅限申请一次。</li>
                <li>
                    PT电子游戏的负盈利计算以及有效流水不包括以下游戏：
                    <span class="text-#27bc74" @click="systemParams.ActiveMoreRules.isShow = true">点击查看</span>
                    。
                </li>
                <li>
                    每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利。VKGAME对本活动保有最终解释权。
                </li>
            </ol>
        </template>
        <template #dialog>
            <van-dialog
                class="active-universal-dialog px-6px! pt-40px!"
                :close-on-click-overlay="true"
                v-model:show="show"
                :show-confirm-button="false"
                get-container="body"
            >
                <div class="close" @click="show = false"></div>
                <div class="flex">
                    <div class="wallet_title w-70px block whitespace-nowrap">救援金：</div>
                    <div>{{ initData.bouns }}元</div>
                </div>
                <div class="flex">
                    <div class="wallet_title w-70px block whitespace-nowrap">返利至：</div>
                    <div class="wallet_box_wrapper px-0! w-260px min-h-70px!" v-if="ELEC_WALLETS.length">
                        <div
                            @click="walletIndex = i"
                            class="wallet_box mr-4px! mb-8px!"
                            :class="[`${item.code}`, { active: walletIndex === i }]"
                            v-for="(item, i) in ELEC_WALLETS"
                            :key="i"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                    <div v-if="!ELEC_WALLETS.length" class="wallet_box_wrapper">
                        <van-loading class="ab-center" type="spinner" />
                    </div>
                </div>
                <div class="vk_comfire_btn">
                    <van-button
                        :loading="confirmLoading"
                        @click="transfer"
                        class="h-36px primary-btn rounded-30px border-none text-15px text-#000 font-bold"
                        block
                    >
                        确定
                    </van-button>
                </div>
            </van-dialog>
        </template>
    </ActiveUniversalTem>
</template>

<style lang="scss" scoped></style>
