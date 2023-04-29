<script setup lang="ts">
import BannerImg from "@/assets/img/active/egame/EgameFirstRecharge/banner.jpg"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import { useDateFormat } from "@vueuse/core"
import ApiSetting from "@/api/service"
import { ref, computed, unref } from "vue"
import { useSysStore } from "@/stores/system"
import { formatterStr } from "@/composable/validate"
import { showToast } from "vant"
import { BaseActiveStruct } from "@/api/pojo/BaseStruct"
import type { ActiveGetChessCardsFirstRechargeInit } from "@/api/pojo/active/ActiveGetChessCardsFirstRechargeInit"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

const show = ref(false)

class ActiveGetEgameFirstTransferInit extends BaseActiveStruct {
    // 2 活动未开始或已结束
    active_status: number = 0

    // 状态： 0  可领   1 已参与   2 不可参与
    join_status: number = 0

    active_bet_times: number = 15

    active_detail: {
        low_money: number
        percent: string
        max_bonus: number
    }[] = []

    first_money: number = 0

    active_single_deposit: number = 0

    walletList?: ActiveGetChessCardsFirstRechargeInit["walletList"]
}

const initData = ref<ActiveGetEgameFirstTransferInit>(new ActiveGetEgameFirstTransferInit())

const btnText = computed(() => {
    if (initData.value.join_status == 1 && initData.value.is_login) {
        return "已参与"
    } else if (initData.value.join_status == 2 && initData.value.is_login) {
        return "不可参与"
    } else {
        return "立即首存"
    }
})

const walletIndex = ref(0)

const walletList = ref<ActiveGetEgameFirstTransferInit["walletList"]>([
    { name: "小艾电竞钱包", code: "EG" },
    { name: "RG电竞钱包", code: "RG" },
    { name: "IM电竞钱包", code: "IM" }
])

const walletCode = computed(() => {
    if (walletList.value.length) {
        return walletList.value[walletIndex.value]?.code
    }
    return ""
})

const shoucunmoney = ref("")
const dialogHongli = ref(0)
const dialogLiushui = ref(0)

const reset = (): void => {
    walletIndex.value = 0
    shoucunmoney.value = ""
    dialogHongli.value = 0
    dialogLiushui.value = 0
}

const depositMoneyChange = (): void => {
    if (initData.value.first_money < initData.value.active_single_deposit) {
        return
    }
    if (initData.value.first_money) {
        shoucunmoney.value = initData.value.first_money.toString()
    }
    const obj: ActiveGetEgameFirstTransferInit["active_detail"][number] =
        unref(walletCode) === "EG" ? initData.value.active_detail[0] : initData.value.active_detail[1]
    const _dialogHongli = Number(shoucunmoney.value) * (parseFloat(obj.percent) / 100)

    if (_dialogHongli <= obj.max_bonus) {
        dialogHongli.value = Math.floor(_dialogHongli) * 1
        dialogLiushui.value = Math.floor((Number(shoucunmoney.value) + dialogHongli.value) * initData.value.active_bet_times)
    } else {
        dialogHongli.value = obj.max_bonus * 1
        dialogLiushui.value =
            (Math.floor(dialogHongli.value / (parseFloat(obj.percent) / 100)) + dialogHongli.value) *
            initData.value.active_bet_times
    }
    if (!shoucunmoney.value) {
        dialogHongli.value = 0
        dialogLiushui.value = 0
    }
}

const chooseWallet = (i: number): void => {
    reset()
    if (initData.value.first_money) {
        depositMoneyChange()
    }
    walletIndex.value = i
}

const openDio = (): void => {
    if (!initData.value.is_login) {
        showToast({
            className: "vk-toast-fail",
            message: "请您先登录",
            icon: "warning"
        })
    } else {
        if (initData.value.active_status == 2) {
            showToast({
                className: "vk-toast-fail",
                message: "活动未开始或已结束",
                icon: "warning"
            })
        } else {
            reset()
            depositMoneyChange()
            show.value = true
        }
    }
}

const confirmLoading = ref(false)

const transfer = async (): Promise<void> => {
    if (!shoucunmoney.value) {
        showToast({
            className: "vk-toast-fail",
            message: "请输入首存金额",
            icon: "warning"
        })
    }
    confirmLoading.value = true
    try {
        const params = {
            from: "NM",
            to: unref(walletCode),
            money: shoucunmoney.value,
            active_id: initData.value.active_id
        }
        HttpPlus.setUrlOptions(ApiSetting.user.transferSubmit)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        confirmLoading.value = false
        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: `首存成功！`,
                icon: "checked"
            })
            show.value = false
            initData.value.join_status = 1
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
    HttpPlus.setUrlOptions(ApiSetting.active.getEgameFirstTransferInit)
    const res = await HttpPlus.sendHttpRequest<ActiveGetEgameFirstTransferInit>()
    systemParams.PageLoading = false
    if (res.status === 1 && res.data) {
        initData.value = res.data
        initData.value.active_show_time = useDateFormat(res.data.active_start_time * 1000, "YYYY[年]MM[月]DD[日]").value + "起"
        if (res.data.walletList && res.data.walletList.length) {
            walletList.value = res.data.walletList
        }
    }
}

init()
</script>

<template>
    <ActiveUniversalTem
        class="EgameFirstRecharge-Page"
        :headTitle="'电竞首存活动'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        :walletList="walletList"
        desc="活动期间新会员首次存款时可申请一次电竞首存优惠，申请成功的用户可享受单笔存款最高35%的存款优惠。"
        :btnText="btnText"
        :btnDisable="true"
    >
        <template #table>
            <table cellspacing="0" width="100%">
                <thead>
                    <tr align="center">
                        <th class="text-12px! text-#262933! h-26px!">存款游戏钱包</th>
                        <th class="text-12px! text-#262933! h-26px!">首存金额</th>
                        <th class="text-12px! text-#262933! h-26px!">红利百分比</th>
                        <th class="text-12px! text-#262933! h-26px!">红利上限</th>
                        <th class="text-12px! text-#262933! h-26px!">流水要求</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-12px! leading-25px!" rowspan="4">
                            <div class="game_list_box">小艾电竞</div>
                            <div class="game_list_box">RG电竞</div>
                            <div class="game_list_box">IM电竞</div>
                        </td>
                        <td class="text-12px! leading-25px!" rowspan="4">≥{{ initData.active_detail[1]?.low_money }}</td>
                        <td class="text-#e34d12! font-bold text-13px! leading-25px!" rowspan="4">
                            {{ initData.active_detail[1]?.percent }}
                        </td>
                        <td class="text-12px! leading-25px!" rowspan="4">
                            {{ initData.active_detail[1]?.max_bonus }}
                        </td>
                        <td class="text-12px! leading-25px!" rowspan="4">
                            （本金+红利）
                            <br />
                            x{{ initData && initData?.active_bet_times }}
                            电竞
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>
        <template #btndesc></template>
        <template #btn>
            <div class="vk_comfire_btn">
                <van-button :disabled="btnText !== '立即首存'" @click="openDio" class="vk-btn" block>{{ btnText }}</van-button>
            </div>
        </template>
        <template #rules>
            <ol>
                <li>
                    符合条件的会员可在点击本优惠活动页面上“立即首存”按钮后，选择“小艾电竞钱包”、“RG电竞钱包”、“IM电竞钱包”其中之一进行首存转账。对应的存款本金+活动奖金在转账成功后将自动添加至用户选择的电竞游戏钱包中。
                </li>
                <li>此活动首笔存款定义为：用户注册后的第一笔存款；若用户在申请前将首笔存款从主钱包转出，则不可申请首存优惠。</li>
                <li>
                    申请奖金后需在指定电竞游戏中完成相对应的流水要求，当用户对应电竞钱包余额＜最低投注额且无未结算注单时，系统将自动判定已完成活动规定的有效流水。
                </li>
                <li>
                    此活动不与其它首存活动共享，每个账户仅限申请一次；不可与老用户召回存款活动同一天参与；领取了此项优惠活动的新用户需先完成活动规定的流水后才可申请平台救援金活动。
                </li>
                <li>
                    有效流水仅计算产生输赢结果的注单，电竞赔率＜1.5、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水。
                </li>
                <li>
                    每位有效玩家、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑者只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利。VKGAME对本活动保有最终解释权。
                </li>
            </ol>
        </template>
        <template #dialog>
            <van-dialog
                class="active-universal-dialog px-6px! pt-50px!"
                :close-on-click-overlay="true"
                v-model:show="show"
                :show-confirm-button="false"
                get-container="body"
            >
                <div class="close" @click="show = false"></div>
                <div class="flex">
                    <div class="wallet_title w-70px block whitespace-nowrap mt-10px">首存至：</div>
                    <div class="wallet_box_wrapper px-0! w-260px" v-if="walletList.length">
                        <div
                            @click="chooseWallet(i)"
                            class="wallet_box mr-4px! mb-8px!"
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
                <div class="hstack">
                    <div class="wallet_title w-70px block whitespace-nowrap mt-10px">首存金额</div>
                    <van-field
                        class="leading-18px py-6px bg-transparent text-12px border-#07e9f1 border w-124px rounded-20px overflow-hidden"
                        :formatter="formatterStr"
                        v-model.trim="shoucunmoney"
                        type="digit"
                        :placeholder="initData.active_single_deposit + '元起'"
                    />
                </div>
                <div class="mt-3px text-left text-#7c839f pl-70px">
                    可得红利
                    <i class="text-#07f1b7">{{ dialogHongli }}</i>
                    元，提款流水
                    <i class="text-#07f1b7">{{ dialogLiushui }}</i>
                    元
                </div>
                <div class="vk_comfire_btn mt-25px!">
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
