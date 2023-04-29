<script setup lang="ts">
import BannerImg from "@/assets/img/active/sports/sportgas/banner.jpg"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import { useDateFormat } from "@vueuse/core"
import ApiSetting from "@/api/service"
import { ref, computed, unref } from "vue"
import { useSysStore } from "@/stores/system"
import { SPORTS_WALLETS } from "@/const/Wallet"
import { showToast } from "vant"
import { BaseActiveStruct } from "@/api/pojo/BaseStruct"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

const show = ref(false)

class ActiveGetSportGasInit extends BaseActiveStruct {
    status: number = 0

    status_tip: string = ""

    is_monday: boolean = false

    last_week: {
        bet: number
        bouns: number
        status: number
    } = {
        bet: 0,
        bouns: 0,
        status: 0
    }

    this_week: {
        bet: number
        status: number
    } = {
        bet: 0,
        status: 0
    }

    active_setting: { [propName: string]: number } = {}

    active_bet_limit: number = 3

    is_show_bet: boolean = false

    is_first: boolean = false
}

const initData = ref<ActiveGetSportGasInit>(new ActiveGetSportGasInit())

const btnDisable = computed<boolean>(() => {
    const { is_login, is_monday, last_week, this_week } = initData.value
    if (is_login) {
        if (is_monday && last_week.status === 0) {
            return false
        } else {
            return this_week.status === 0
        }
    }
    return false
})

const walletIndex = ref(0)

const walletCode = computed<string>(() => {
    return SPORTS_WALLETS[walletIndex.value]?.code
})

const openDio = (): void => {
    if (!initData.value.is_login) {
        showToast({
            className: "vk-toast-fail",
            message: "请您先登录",
            icon: "warning"
        })
    } else {
        if (initData.value.is_monday && initData.value.last_week.status === 0) {
            walletIndex.value = 0
            show.value = true
        } else {
            showToast({
                className: "vk-toast-fail",
                message: initData.value.status_tip,
                icon: "warning"
            })
        }
    }
}

const confirmLoading = ref(false)

const transfer = async (): Promise<void> => {
    confirmLoading.value = true
    try {
        const params = {
            from: "NM",
            to: unref(walletCode),
            money: initData.value.last_week.bouns,
            active_id: initData.value.active_id
        }
        HttpPlus.setUrlOptions(ApiSetting.user.transferSubmit)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        confirmLoading.value = false
        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: `恭喜您成功领取上周彩金！`,
                icon: "checked"
            })
            show.value = false
            initData.value.last_week.status = 1
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
    HttpPlus.setUrlOptions(ApiSetting.active.getSportGasInit)
    const res = await HttpPlus.sendHttpRequest<ActiveGetSportGasInit>()
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
        class="SportGas-Page"
        :headTitle="'威客体育加油站'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        :walletList="SPORTS_WALLETS"
        :contentTitle="'活动详情'"
        :btnText="'立即领取'"
    >
        <template #table>
            <table cellspacing="0" width="100%">
                <thead>
                    <tr align="center">
                        <th width="33%" class="text-12px! text-#262933! h-28px!">每周累计体育流水额</th>
                        <th width="33%" class="text-12px! text-#262933! h-28px!">彩金</th>
                        <th class="text-12px! text-#262933! h-28px!">彩金流水</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in initData.active_setting" :key="index">
                        <td class="text-12px! h-28px!">{{ index }}</td>
                        <td class="text-12px! h-28px!">{{ item }}</td>
                        <td v-if="index == 20000" rowspan="9">{{ initData?.active_bet_limit }}倍体育流水</td>
                    </tr>
                </tbody>
            </table>
        </template>
        <template #btndesc>
            <div v-if="initData.is_login && initData.is_show_bet && initData.is_monday && !initData.is_first">
                上周累计流水：{{ initData?.last_week?.bet }}元
            </div>
            <div v-if="initData.is_login && initData.is_show_bet">本周累计流水：{{ initData?.this_week?.bet }}元</div>
        </template>
        <template #btn>
            <div class="vk_comfire_btn">
                <van-button :disabled="btnDisable" @click="openDio" class="vk-btn" block>立即领取</van-button>
            </div>
        </template>
        <template #rules>
            <ol>
                <li>
                    威客体育加油金需在本活动页面手动领取，每个自然周内累计流水达到对应的额度即可领取彩金，彩金领取时间为次周一00:00:00-23:59:59，指定时间内未领取视为自动放弃。
                </li>
                <li>
                    威客体育游戏包括：威客体育、FB体育、BTI体育、平博体育、皇冠体育、沙巴体育、IM体育，用户在领取加油金时选择将其领取至对应的体育游戏钱包，加油金需完成活动规定的3倍体育流水，活动流水未完成前不可再次申请。
                </li>
                <li>
                    有效流水仅计算产生输赢结果的注单，亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水。
                </li>
                <li>
                    每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利；VKGAME对本活动保有最终解释权。
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
                    <div class="wallet_title w-70px block whitespace-nowrap">加油金：</div>
                    <div>{{ initData.last_week.bouns }}元</div>
                </div>
                <div class="flex">
                    <div class="wallet_title w-70px block whitespace-nowrap">返利至：</div>
                    <div class="wallet_box_wrapper px-0! w-260px">
                        <div
                            @click="walletIndex = i"
                            class="wallet_box mr-4px! mb-8px!"
                            :class="[`${item.code}`, { active: walletIndex === i }]"
                            v-for="(item, i) in SPORTS_WALLETS"
                            :key="i"
                        >
                            {{ item.name }}
                        </div>
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
