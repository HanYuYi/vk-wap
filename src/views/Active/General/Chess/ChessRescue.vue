<script setup lang="ts">
import BannerImg from "@/assets/img/active/chess/ChessRescue/banner.jpg"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import { useDateFormat } from "@vueuse/core"
import ApiSetting from "@/api/service"
import { ref, computed, unref } from "vue"
import { useSysStore } from "@/stores/system"
import { showToast } from "vant"
import { CHESS_WALLETS } from "@/const/Wallet"
import { BaseActiveStruct } from "@/api/pojo/BaseStruct"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

const show = ref(false)

class ActiveGetChessRescueFundInit extends BaseActiveStruct {
    bouns: number = 0

    status: number = 0

    status_tip: string = ""

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
        max_bonus: 588,
        negative_profit: 500,
        percent: 0.03,
        percent_show: 3
    }
}
const initData = ref<ActiveGetChessRescueFundInit>(new ActiveGetChessRescueFundInit())

const btnText = computed(() => {
    if (initData.value.status == 1 && initData.value.is_login) {
        return "已领取"
    }
    return "立即申请"
})

const walletIndex = ref(0)
const walletCode = computed(() => {
    if (CHESS_WALLETS.length) {
        return CHESS_WALLETS[walletIndex.value]?.code
    }
    return ""
})

const desc = computed<string>(() => {
    return `活动期间， 凡当日首充≥${initData.value.active_setting.first_deposit}且在威客棋牌游戏中累计产生负盈利≥${
        initData.value.active_setting.negative_profit
    }的玩家，即可申请棋牌游戏负盈利的${initData.value.active_setting.percent_show}%返利。<br>
            例：用户A当日首充${initData.value.active_setting.first_deposit}元，在棋牌游戏中累计负盈利${
        initData.value.active_setting.negative_profit
    }元，此时可申请领取${initData.value.active_setting.negative_profit}x${initData.value.active_setting.percent_show}%=${
        initData.value.active_setting.negative_profit * initData.value.active_setting.percent
    }元的返利彩金。`
})

const chooseWallet = (i: number): void => {
    walletIndex.value = i
}

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
        }
    } catch (error: unknown) {
        confirmLoading.value = false
        console.error(error)
    }
}

const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.getChessRescueFundInit)
    const res = await HttpPlus.sendHttpRequest<ActiveGetChessRescueFundInit>()
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
        class="ChessRescue-Page"
        :headTitle="'棋牌救援金'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        :walletList="CHESS_WALLETS"
        :desc="desc"
        :btnText="btnText"
        :btnDisable="initData.status == 1"
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
                        <th class="text-12px! text-#262933! h-28px!">棋牌负盈利</th>
                        <th class="text-12px! text-#262933! h-28px!">返利百分比</th>
                        <th class="text-12px! text-#262933! h-28px!">红利上限</th>
                        <th class="text-12px! text-#262933! h-28px!">红利流水倍数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-12px! h-28px!">≥{{ initData.active_setting?.first_deposit }}</td>
                        <td class="text-12px! h-28px!">≥{{ initData.active_setting?.negative_profit }}</td>
                        <td class="text-12px! h-28px!">{{ initData.active_setting?.percent_show }}%</td>
                        <td class="text-12px! h-28px!">
                            {{ initData.active_setting?.max_bonus }}
                        </td>
                        <td class="text-12px! h-28px!">棋牌游戏{{ initData.active_setting?.bet_times }}倍流水</td>
                    </tr>
                </tbody>
            </table>
        </template>
        <template #btndesc>
            <!-- <div class="text-15px font-bold">可领{{ initData.bouns }}元救援金</div> -->
        </template>
        <template #rules>
            <ol>
                <li>棋牌游戏包括：乐游棋牌、开元棋牌、凯旋棋牌、博乐棋牌。</li>
                <li>VIP会员每日未提款前的累计有效存款都视为首充。</li>
                <li>
                    满足条件的用户需在产生负盈利的次日（00:00:00至23:59:59）期间在本活动页面申请此优惠活动，预期则视为自动放弃。
                </li>
                <li>
                    申请获得的奖金将自动派发至用户指定的的棋牌游戏钱包中，活动奖金需在棋牌游戏中完成8倍流水即可转出。当用户对应棋牌钱包余额≤原钱包余额且无未结算注单时，系统将自动判定已完成活动规定的有效流水，活动流水未完成前不可再次申请本活动。
                </li>
                <li>此活动不与其他首存活动、救援金活动共享，每位用户每日仅限申请一次。</li>
                <li>
                    每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠。对违规的用户，VKGAME保留无限期审核，
                    和扣回红利及所产生的利润权利。
                </li>
                <li>VKGAME官方对本活动保有最终解释权。</li>
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
                    <div class="wallet_box_wrapper px-0! w-260px" v-if="CHESS_WALLETS.length">
                        <div
                            @click="chooseWallet(i)"
                            class="wallet_box mr-4px! mb-8px!"
                            :class="[`${item.code}`, { active: walletIndex === i }]"
                            v-for="(item, i) in CHESS_WALLETS"
                            :key="i"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                    <div v-if="!CHESS_WALLETS.length" class="wallet_box_wrapper">
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
