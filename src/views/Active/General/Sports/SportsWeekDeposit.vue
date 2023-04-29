<script setup lang="ts">
import BannerImg from "@/assets/img/active/sports/sportWeekDeposit/banner.jpg"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import ApiSetting from "@/api/service"
import { ref, computed, unref } from "vue"
import { useSysStore } from "@/stores/system"
import { formatNumberSplit } from "@/utils/numberUtils"
import { SPORTS_WALLETS } from "@/const/Wallet"
import { showToast } from "vant"
import { BaseActiveStruct } from "@/api/pojo/BaseStruct"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

const show = ref(false)

class ActiveGetSportWeekDepositInit extends BaseActiveStruct {
    // 状态： 1  可领   3 已领取   *** 其他状态
    claim_status: number

    status_tips: string = ""

    bonus: number = 0

    list: number[][] = []
}

const initData = ref<ActiveGetSportWeekDepositInit>(new ActiveGetSportWeekDepositInit())

const topBonus = computed<number>(() => {
    if (initData.value.list.length) {
        return initData.value.list[initData.value.list.length - 1][1]
    }
    return 0
})

const walletIndex = ref(0)

const walletCode = computed<string>(() => {
    return SPORTS_WALLETS[walletIndex.value]?.code
})

const btnText = computed(() => {
    if (initData.value.claim_status == 3) {
        return "已领取"
    } else {
        return "立即领取"
    }
})

const open = (): void => {
    if (!systemParams.isLogin) {
        showToast({
            className: "vk-toast-fail",
            message: "请您先登录",
            icon: "warning"
        })
    } else {
        if (initData.value.claim_status !== 1) {
            showToast({
                className: "vk-toast-fail",
                message: initData.value.status_tips,
                icon: "warning"
            })
        } else {
            walletIndex.value = 0
            show.value = true
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
            money: initData.value.bonus,
            active_id: initData.value.active_id
        }
        HttpPlus.setUrlOptions(ApiSetting.user.transferSubmit)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        confirmLoading.value = false

        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: `领取成功，请进入个人中心钱包查看！`,
                icon: "checked"
            })
            show.value = false
            initData.value.claim_status = 3
        }
    } catch (error: unknown) {
        confirmLoading.value = false
        console.error(error)
    }
}

const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.sportWeekDepositInit)
    const res = await HttpPlus.sendHttpRequest<ActiveGetSportWeekDepositInit>()
    systemParams.PageLoading = false
    if (res.status === 1 && res.data) {
        initData.value = res.data
    }
}

init()
</script>

<template>
    <ActiveUniversalTem
        class="SportsWeekDeposit-Page"
        :headTitle="'体育周存款高额返现'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        :walletList="SPORTS_WALLETS"
        :desc="`活动期间，满足条件的VIP会员在每个自然周内可领取一次体育单笔存送优惠，彩金最高可获得${topBonus}元！`"
        :btnText="btnText"
        :btnDisable="initData.claim_status === 3"
    >
        <template #table>
            <table cellspacing="0" width="100%">
                <tr>
                    <th class="text-12px! text-#262933!">首存金额</th>
                    <th class="text-12px! text-#262933!">存款红利</th>
                    <th class="text-12px! text-#262933!">流水要求</th>
                </tr>
                <tr v-for="(arr, index) in initData.list" :key="index">
                    <td class="text-12px!" v-for="(amount, i) in arr" :key="i">
                        {{ amount }}
                    </td>
                    <td class="text-12px!" v-if="index === 0" :rowspan="initData.list.length">（本金+红利）x12</td>
                </tr>
                <tr>
                    <td class="text-12px!">游戏场馆要求</td>
                    <td class="text-12px!" colspan="2">威客体育、FB体育、BTI体育、平博体育、皇冠体育、沙巴体育、IM体育</td>
                </tr>
            </table>
        </template>
        <template #btndesc>
            <div v-if="(initData.claim_status === 1 || initData.claim_status === 3) && initData.bonus > 0">
                <span class="liushui">
                    {{ initData.claim_status === 1 ? "当前可领取：" : "已领取："
                    }}{{ formatNumberSplit(initData.bonus, 0) }}元彩金
                </span>
            </div>
        </template>
        <template #btn>
            <div class="vk_comfire_btn">
                <van-button :disabled="initData.claim_status === 3" @click="open" class="vk-btn" block>{{ btnText }}</van-button>
            </div>
        </template>
        <template #rules>
            <ol>
                <li>
                    每个自然周内符合条件的VIP会员，可在优惠活动页面领取“体育周存款优惠”，对应的存款本金+活动彩金在领取成功后将自动添加至会员选择的体育游戏钱包中。每日未发起提款前的存款都视为首充。
                </li>
                <li>若会员在申请此优惠前将存款从主钱包转出或发起提款，则不可申请此优惠。</li>
                <li>
                    会员申请成功后需在所选择的体育游戏中完成相对应的流水要求。例：若会员当天首存500，申请体育周存款活动优惠，此时需完成（500+58）x12=6696的体育游戏有效流水。
                </li>
                <li>
                    此优惠活动每周仅限领取一次，领取当天不与平台首存类优惠活动、周存类优惠活动、VIP月存款活动、体育100%包赔活动共享，活动流水未完成前不可再次申请，当周未申请则视为自动放弃。
                </li>
                <li>
                    流水赔率要求：亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水。
                </li>
                <li>
                    每位有效玩家、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑者只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利。
                </li>
                <li>VKGAME对本活动保有最终解释权。</li>
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
                        <span class="text-#07f0bc">{{ formatNumberSplit(initData.bonus, 0) }}</span>
                        元
                    </div>
                    <div class="wallet_title">领取至：</div>
                    <div class="wallet_box_wrapper">
                        <div
                            @click="walletIndex = i"
                            class="wallet_box"
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
