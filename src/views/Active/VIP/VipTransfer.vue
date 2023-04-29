<script setup lang="ts">
import BannerImg from "@/assets/img/active/vip/viptransfer/banner.jpg"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import { useDateFormat } from "@vueuse/core"
import ApiSetting from "@/api/service"
import { ref, computed } from "vue"
import { useSysStore } from "@/stores/system"
import { showConfirmDialog, showToast } from "vant"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

class VipGetVipTransferInit {
    active_start_time: number = 0

    // 前端自定义
    active_show_time?: string = ""

    // 状态： 0  可领   1 已领取   *** 其他状态
    status: number = 0

    status_tip: string = ""

    tips: string = ""

    setting: {
        level: string
        deposit: number
        percent: number
        bonus: number
        limit: number
    }[] = []

    bonus: number = 0

    bonus_level: number = 0
}

const initData = ref<VipGetVipTransferInit>(new VipGetVipTransferInit())

const btnText = computed(() => {
    if (initData.value.status == 1) {
        return "已领取"
    } else {
        return "立即申请"
    }
})

const btnDisable = computed<boolean>(() => {
    if (initData.value.status == 1 || (initData.value.status > 1 && initData.value.status != 103)) {
        return true
    } else {
        return false
    }
})

const open = (): void => {
    if (initData.value.status != 0) {
        showToast({
            className: "vk-toast-fail",
            message: initData.value.status_tip,
            icon: "warning"
        })
        return
    }
    showConfirmDialog({
        title: "提示",
        message: `您目前可领取VIP${initData.value.bonus_level}  月优惠存款${initData.value.bonus}元`,
        className: "vk-confirm-dialog",
        confirmButtonText: "立即领取",
        width: 300
    })
        .then(async () => {
            systemParams.PageLoading = true
            HttpPlus.setUrlOptions(ApiSetting.active.getVipTransferBonus)
            const res = await HttpPlus.sendHttpRequest()
            systemParams.PageLoading = false
            if (res.status === 1) {
                showToast({
                    className: "vk-toast-success",
                    message: res.message,
                    icon: "checked"
                })
                initData.value.status = 1
            } else if (res.message) {
                showToast({
                    className: "vk-toast-fail",
                    message: res.message,
                    icon: "warning"
                })
            }
        })
        .catch(() => {
            // on cancel
        })
}

const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.getVipTransferInit)
    const res = await HttpPlus.sendHttpRequest<VipGetVipTransferInit>()
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
        class="VipTransfer-Page"
        :headTitle="'VIP存款优惠'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        desc="满足条件的VIP会员每个自然月内可申请一次单笔存送优惠，彩金最高可获2188元！"
    >
        <template #table>
            <table cellspacing="0" width="100%">
                <thead>
                    <tr align="center">
                        <td class="text-12px! h-24px!">等级</td>
                        <td class="text-12px! h-24px!">最高彩金</td>
                        <td class="text-12px! h-24px!">单笔要求</td>
                        <td class="text-12px! h-24px!">优惠比例</td>
                        <td class="text-12px! h-24px!">流水要求</td>
                    </tr>
                </thead>
                <tbody v-if="initData.setting.length">
                    <tr>
                        <td class="text-12px! h-24px!">{{ initData.setting[0].level }}</td>
                        <td class="text-12px! h-24px! text-#606882!">
                            {{ initData.setting[0].bonus ? initData.setting[0].bonus + "元" : "-" }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882!">
                            {{ initData.setting[0].deposit ? "≥" + initData.setting[0].deposit + "元" : "-" }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882!">
                            {{ parseInt(initData.setting[0].percent * 100) ? initData.setting[0].percent + "%" : "-" }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882!">
                            {{ parseInt(initData.setting[0].limit * 100) ? "(本金+彩金)*" + initData.setting[0].limit : "-" }}
                        </td>
                    </tr>
                    <tr>
                        <td class="text-12px! h-24px!">{{ initData.setting[1].level }}</td>
                        <td class="text-12px! h-24px! text-#606882!">
                            {{ initData.setting[1].bonus ? initData.setting[1].bonus + "元" : "-" }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882!" rowspan="3">
                            {{ initData.setting[1].deposit ? "≥" + initData.setting[1].deposit + "元" : "-" }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882!" rowspan="3">
                            {{ parseInt(initData.setting[1].percent * 100) ? initData.setting[1].percent + "%" : "-" }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882!" rowspan="3">
                            {{ parseInt(initData.setting[1].limit * 100) ? "(本金+彩金)*" + initData.setting[1].limit : "-" }}
                        </td>
                    </tr>
                    <tr v-for="i in 2" :key="i">
                        <td class="text-12px! h-24px!">
                            {{ initData.setting[i + 1].level }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882!">
                            {{ initData.setting[i + 1].bonus ? initData.setting[i + 1].bonus + "元" : "-" }}
                        </td>
                    </tr>
                    <tr>
                        <td class="text-12px! h-24px!">{{ initData.setting[4].level }}</td>
                        <td class="text-12px! h-24px! text-#606882!">
                            {{ initData.setting[4].bonus ? initData.setting[4].bonus + "元" : "-" }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882! text-#606882!" rowspan="5">
                            {{ initData.setting[4].deposit ? "≥" + initData.setting[4].deposit + "元" : "-" }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882! text-#606882!" rowspan="5">
                            {{ parseInt(initData.setting[4].percent * 100) ? initData.setting[4].percent + "%" : "-" }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882! text-#606882!" rowspan="5">
                            {{ parseInt(initData.setting[4].limit * 100) ? "(本金+彩金)*" + initData.setting[4].limit : "-" }}
                        </td>
                    </tr>
                    <tr v-for="i in 4" :key="i">
                        <td class="text-12px! h-24px!">
                            {{ initData.setting[i + 4].level }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882!">
                            {{ initData.setting[i + 4].bonus ? initData.setting[i + 4].bonus + "元" : "-" }}
                        </td>
                    </tr>
                    <tr>
                        <td class="text-12px! h-24px!">{{ initData.setting[9].level }}</td>
                        <td class="text-12px! h-24px! text-#606882!">
                            {{ initData.setting[9].bonus ? initData.setting[9].bonus + "元" : "-" }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882!" rowspan="4">
                            {{ initData.setting[9].deposit ? "≥" + initData.setting[9].deposit + "元" : "-" }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882!" rowspan="4">
                            {{ parseInt(initData.setting[9].percent * 100) ? initData.setting[9].percent + "%" : "-" }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882!" rowspan="4">
                            {{ parseInt(initData.setting[9].limit * 100) ? "(本金+彩金)*" + initData.setting[9].limit : "-" }}
                        </td>
                    </tr>
                    <tr v-for="i in 3" :key="i">
                        <td class="text-12px! h-24px!">
                            {{ initData.setting[i + 9].level }}
                        </td>
                        <td class="text-12px! h-24px! text-#606882!">
                            {{ initData.setting[i + 9].bonus ? initData.setting[i + 9].bonus + "元" : "-" }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>
        <template #btndesc>
            <div class="liushui">{{ initData.tips }}</div>
        </template>
        <template #btn>
            <div class="vk_comfire_btn">
                <van-button :disabled="btnDisable" @click="open" class="vk-btn" block>{{ btnText }}</van-button>
            </div>
        </template>
        <template #rules>
            <ol>
                <li>
                    每个自然月内单笔存款符合条件的VIP会员可在VIP页面或优惠活动页面申请一次“VIP月存款优惠”，此优惠彩金需完成对应的有效流水。
                    <br />
                    例：VIP3会员单笔存款500，申请本月VIP月存款活动优惠，此时需完成（500+500X15%）x12=6900 的全站有效流水。
                </li>
                <li>
                    会员存款后需在活动页面申请，若用户在申请此优惠前将存款从主钱包转出或发起提款，则不可申请月存优惠，会员申请成功后，奖金将会主动添加至用户的主钱包。
                </li>
                <li>VIP会员单笔存款要求以及对应优惠彩金以会员申请后充值到账时间所对应的VIP等级为准。</li>
                <li>
                    VIP月存款优惠不与新用户首存优惠活动、全站每日存款活动共享，活动规定的彩金流水未完成前不可再次申请，此优惠活动当月未申请则视为自动放弃。
                </li>
                <li>
                    电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>
                    0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                    <span class="text-#27bc74" @click="systemParams.ActiveMoreRules.isShow = true">点击查看</span>
                    。
                </li>
                <li>
                    每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠。对违规的用户，VKGAME保留无限期审核，
                    和扣回红利及所产生的利润权利。
                </li>
                <li>VKGAME官方对本活动保有最终解释权。</li>
            </ol>
        </template>
        <template #dialog>
            <div></div>
        </template>
    </ActiveUniversalTem>
</template>
