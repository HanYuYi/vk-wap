<script setup lang="ts">
import BannerImg from "@/assets/img/active/vip/VipAcheie/banner.jpg"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import ApiSetting from "@/api/service"
import { ref, computed } from "vue"
import { useSysStore } from "@/stores/system"
import { showToast } from "vant"
import { BaseActiveStruct } from "@/api/pojo/BaseStruct"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

class VipGetVipMonthAchienementAwardInit extends BaseActiveStruct {
    // 状态： 0  可领   1 已领取   *** 其他状态
    status: number = 0

    status_tips: string = ""

    setting: {
        level: string
        level_name: string
        total_profit: string
        bonus: string
    }[] = []
}

const initData = ref<VipGetVipMonthAchienementAwardInit>(new VipGetVipMonthAchienementAwardInit())

const titArr = ["等级", "会员<br>勋章", "月总<br>盈利", "成就奖", "流水要求"]

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
        HttpPlus.setUrlOptions(ApiSetting.active.joinVipMonthAchienementAward)
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
    HttpPlus.setUrlOptions(ApiSetting.active.getVipMonthAchienementAwardInit)
    const res = await HttpPlus.sendHttpRequest<VipGetVipMonthAchienementAwardInit>()
    systemParams.PageLoading = false
    if (res.status === 1 && res.data) {
        initData.value = res.data
    }
}

init()
</script>

<template>
    <ActiveUniversalTem
        class="VipAcheie-Page"
        :headTitle="'VIP月成就奖'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        desc="VIP会员每个自然月累计盈利≥300000即可免费领取一次对应的月成就奖彩金。"
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
                        <td class="text-12px! h-28px!">
                            {{ initData.setting[0]?.level_name }}
                        </td>
                        <td class="text-12px! h-28px!">
                            {{
                                initData.setting[0]?.total_profit == "-"
                                    ? initData.setting[0]?.total_profit
                                    : "≥" + initData.setting[0]?.total_profit
                            }}
                        </td>
                        <td class="text-12px! h-28px!">{{ initData.setting[0]?.bonus }}</td>
                        <td class="text-12px! h-28px!" rowspan="13">全站1倍有效流水</td>
                    </tr>
                    <tr v-for="i in 12" :key="i">
                        <td class="text-12px! h-28px!">{{ initData.setting[i]?.level }}</td>
                        <td class="text-12px! h-28px!">
                            {{ initData.setting[i]?.level_name }}
                        </td>
                        <td class="text-12px! h-28px!">
                            {{
                                initData.setting[i]?.total_profit == "-"
                                    ? initData.setting[i]?.total_profit
                                    : "≥" + initData.setting[i]?.total_profit
                            }}
                        </td>
                        <td class="text-12px! h-28px!">{{ initData.setting[i]?.bonus }}</td>
                    </tr>
                </tbody>
            </table>
        </template>
        <template #btndesc></template>
        <template #rules>
            <ol>
                <li>月总盈利计算周期为一个自然月，若当月总盈利≥300000即可在VIP页面或优惠活动页面申请领取此优惠。</li>
                <li>当月成就奖需于次月1-3号自助领取，月成就奖需完成全站1倍有效流水，此活动逾期未领取则视为自动放弃。</li>
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
