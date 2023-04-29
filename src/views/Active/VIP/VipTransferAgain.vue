<script setup lang="ts">
import BannerImg from "@/assets/img/active/vip/VipTransferAgain/banner.jpg"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import ApiSetting from "@/api/service"
import { ref, computed } from "vue"
import { useSysStore } from "@/stores/system"
import { showToast } from "vant"
import { BaseActiveStruct } from "@/api/pojo/BaseStruct"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

class ActiveGetVipTransferAgainInit extends BaseActiveStruct {
    // 状态： 0  可领   1 已领取   *** 其他状态
    status: number = 0

    status_tips: string = ""
}

const initData = ref<ActiveGetVipTransferAgainInit>(new ActiveGetVipTransferAgainInit())

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
        HttpPlus.setUrlOptions(ApiSetting.active.joinVipTransferAgain)
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
    HttpPlus.setUrlOptions(ApiSetting.active.getVipTransferAgainInit)
    const res = await HttpPlus.sendHttpRequest<ActiveGetVipTransferAgainInit>()
    systemParams.PageLoading = false
    if (res.status === 1 && res.data) {
        initData.value = res.data
    }
}

init()
</script>

<template>
    <ActiveUniversalTem
        class="VipTransferAgain-Page"
        :headTitle="'VIP再存优惠活动'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        desc="满足条件的VIP会员每个自然月内可申请一次单笔再存优惠，彩金最高可获1588元！"
        :btnText="btnText"
        :btnLoading="btnLoading"
        :btnDisable="initData.status != 0"
        @open="open"
    >
        <template #table>
            <table cellspacing="0" width="100%">
                <thead>
                    <tr align="center">
                        <td class="text-12px!">等级</td>
                        <td class="text-12px!">
                            单笔
                            <br />
                            存款要求
                        </td>
                        <td class="text-12px!">
                            再存
                            <br />
                            优惠比例
                        </td>
                        <td class="text-12px!">
                            再存
                            <br />
                            最高彩金
                        </td>
                        <td class="text-12px!">
                            彩金流水
                            <br />
                            要求(全站)
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-12px!">VIP0</td>
                        <td class="text-12px! text-#606882!" v-for="i in 4" :key="i">-</td>
                    </tr>
                    <tr>
                        <td class="text-12px!">VIP1</td>
                        <td class="text-12px! text-#606882!" rowspan="3">≥500</td>
                        <td class="text-12px! text-#606882!" rowspan="3">8%</td>
                        <td class="text-12px! text-#606882!">68元</td>
                        <td class="text-12px! text-#606882!" rowspan="3">(本金+彩金)*15</td>
                    </tr>
                    <tr>
                        <td class="text-12px!">VIP2</td>
                        <td class="text-12px! text-#606882!">128元</td>
                    </tr>
                    <tr>
                        <td class="text-12px!">VIP3</td>
                        <td class="text-12px! text-#606882!">218元</td>
                    </tr>
                    <tr>
                        <td class="text-12px!">VIP4</td>
                        <td class="text-12px! text-#606882!" rowspan="5">≥1000</td>
                        <td class="text-12px! text-#606882!" rowspan="5">15%</td>
                        <td class="text-12px! text-#606882!">218元</td>
                        <td class="text-12px! text-#606882!" rowspan="5">(本金+彩金)*20</td>
                    </tr>
                    <tr>
                        <td class="text-12px!">VIP5</td>
                        <td class="text-12px! text-#606882!">288元</td>
                    </tr>
                    <tr>
                        <td class="text-12px!">VIP6</td>
                        <td class="text-12px! text-#606882!">388元</td>
                    </tr>
                    <tr>
                        <td class="text-12px!">VIP7</td>
                        <td class="text-12px! text-#606882!">518元</td>
                    </tr>
                    <tr>
                        <td class="text-12px!">VIP8</td>
                        <td class="text-12px! text-#606882!">688元</td>
                    </tr>

                    <tr>
                        <td class="text-12px!">VIP9</td>
                        <td class="text-12px! text-#606882!" rowspan="4">≥2000</td>
                        <td class="text-12px! text-#606882!" rowspan="4">25%</td>
                        <td class="text-12px! text-#606882!">688元</td>
                        <td class="text-12px! text-#606882!" rowspan="4">(本金+彩金)*25</td>
                    </tr>
                    <tr>
                        <td class="text-12px!">VIP10</td>
                        <td class="text-12px! text-#606882!">888元</td>
                    </tr>
                    <tr>
                        <td class="text-12px!">VIP11</td>
                        <td class="text-12px! text-#606882!">1288元</td>
                    </tr>
                    <tr>
                        <td class="text-12px!">VIP12</td>
                        <td class="text-12px! text-#606882!">1588元</td>
                    </tr>
                </tbody>
            </table>
        </template>
        <template #btndesc>
            <div v-if="initData.status != 1">{{ initData.status_tips }}</div>
        </template>
        <template #rules>
            <ol>
                <li>
                    每个自然月内单笔存款符合条件的VIP会员可在VIP页面或优惠活动页面申请一次“VIP月再存优惠”，此优惠彩金需完成对应的有效流水。
                    <br />
                    例：VIP3会员单笔存款500，申请本月VIP月再存活动优惠，此时需完成（500+500X8%）x15=8100 的全站有效流水。
                </li>
                <li class="text-#606882">此活动仅限已参与“VIP月存款活动”活动且已完成VIP月存款活动流水的会员参加。</li>
                <li>
                    会员存款后需在活动页面申请，若用户在申请此优惠前将存款从主钱包转出或发起提款，则不可申请月再存优惠，会员申请成功后，奖金将会主动添加至用户的主钱包。
                </li>
                <li>
                    VIP会员单笔存款要求以及对应优惠彩金以会员申请后充值到账时所对应的VIP等级为准。本活动规定的彩金流水未完成前不可再次申请，此优惠活动当月未申请则视为自动放弃。
                </li>
                <li>
                    电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                    <span class="text-#27bc74" @click="systemParams.ActiveMoreRules.isShow = true">查看详情</span>
                    。
                </li>
                <li>
                    每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠。对违规的用户，VKGAME保留无限期审核，
                    和扣回红利及所产生的利润权利；VKGAME官方对本活动保有最终解释权。
                </li>
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
