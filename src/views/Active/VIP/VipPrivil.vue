<script setup lang="ts">
import BannerImg from "@/assets/img/active/vip/VipPrivil/banner.jpg"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import { useDateFormat } from "@vueuse/core"
import ApiSetting from "@/api/service"
import { ref, computed } from "vue"
import { useSysStore } from "@/stores/system"
import { showToast } from "vant"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

class VipJoinVipPrivilegeActive {
    active_start_time: number = 0

    // 前端自定义
    active_show_time?: string = ""

    // 状态： 0  可领   1 已领取   *** 其他状态
    status: number = 0

    status_tips: string = ""

    setting: {
        level: string
        bonus: number
    }[] = []

    page_show_text: string = ""
}

const initData = ref<VipJoinVipPrivilegeActive>(new VipJoinVipPrivilegeActive())

const titArr = ["等级", "游戏体验金", "体验金流水要求"]

const btnText = computed(() => {
    if (initData.value.status == 1) {
        return "已领取"
    } else {
        return "立即申请"
    }
})

const btnLoading = ref(false)

const open = async (): Promise<void> => {
    btnLoading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.active.joinVipPrivilegeActive)
        const res = await HttpPlus.sendHttpRequest()
        btnLoading.value = false
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
    } catch (error: unknown) {
        btnLoading.value = false
        console.error(error)
    }
}

const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.getVipPrivilegeInit)
    const res = await HttpPlus.sendHttpRequest<VipJoinVipPrivilegeActive>()
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
        class="VipPrivil-Page"
        :headTitle="'VIP月体验金'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        desc="VIP会员每个自然月内累计存款金额≥500即可免费领取一次对应的游戏体验金。"
        :btnText="btnText"
        :btnLoading="btnLoading"
        :btnDisable="initData.status == 1"
        @open="open"
    >
        <template #table>
            <table cellspacing="0" width="100%" v-if="initData.setting.length">
                <thead>
                    <tr align="center">
                        <td class="text-12px!" v-for="(name, j) in titArr" :key="j" v-html="name"></td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-12px! h-28px!">{{ initData.setting[0]?.level }}</td>
                        <td class="text-12px! h-28px! text-#606882!">
                            {{ initData.setting[0]?.bonus ? initData.setting[0]?.bonus + "元" : "-" }}
                        </td>
                        <td class="text-12px! h-28px! text-#606882!" rowspan="13">全站3倍有效流水</td>
                    </tr>
                    <tr v-for="i in 12" :key="i">
                        <td class="text-12px! h-28px!">{{ initData.setting[i]?.level }}</td>
                        <td class="text-12px! h-28px! text-#606882!">
                            {{ initData.setting[i]?.bonus ? initData.setting[i]?.bonus + "元" : "-" }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>
        <template #btndesc>
            <div>{{ initData.page_show_text }}</div>
        </template>
        <template #rules>
            <ol>
                <li>每个自然月内累计存款≥500的VIP会员可免费领取一次专属游戏体验金，此优惠彩金需完成对应的3倍有效流水。</li>
                <li>游戏体验金需在VIP页面或优惠活动页面自助领取，此优惠活动当月未领取则视为自动放弃。</li>
                <li>
                    电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                    <span class="text-#27bc74" @click="systemParams.ActiveMoreRules.isShow = true">点击查看</span>
                    。
                </li>
                <li>
                    每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠。对违规的用户，VKGAME保留无限期审核，
                    和扣回红利及所产生的利润权利。
                </li>
                <li>VKGAME对本活动保有最终解释权。</li>
            </ol>
        </template>
        <template #dialog>
            <div></div>
        </template>
    </ActiveUniversalTem>
</template>

<style lang="scss" scoped>
table {
    td {
        height: 24px !important;
    }
}
</style>
