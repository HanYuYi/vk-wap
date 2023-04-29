<script setup lang="ts">
import BannerImg from "@/assets/img/active/realman/RealPersonFirstRecharge/wap-banner.png"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import ApiSetting from "@/api/service"
import { ref, computed } from "vue"
import { useSysStore } from "@/stores/system"
import { ActiveGetChessCardsFirstRechargeInit } from "@/api/pojo/active/ActiveGetChessCardsFirstRechargeInit"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

class ActiveGetRealPersonFirstRechargeInit extends ActiveGetChessCardsFirstRechargeInit {}

const initData = ref<ActiveGetRealPersonFirstRechargeInit>(new ActiveGetRealPersonFirstRechargeInit())

const btnText = computed(() => {
    if (initData.value.status == 1) {
        return "已领取"
    } else {
        return "立即首存"
    }
})

const walletList = ref<ActiveGetRealPersonFirstRechargeInit["walletList"]>([])

const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.RealPerson2022.FirstRechargeInit)
    const res = await HttpPlus.sendHttpRequest<ActiveGetRealPersonFirstRechargeInit>()
    systemParams.PageLoading = false
    if (res.status === 1 && res.data) {
        initData.value = res.data
        if (res.data.walletList.length) {
            walletList.value = res.data.walletList
        }
    }
}

init()
</script>

<template>
    <ActiveUniversalTem
        class="RealPersonFirstRecharge-Page"
        :headTitle="'真人首存优惠'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        :walletList="walletList"
        :desc="`活动期间，新会员首次存款时可申请一次真人首存优惠，申请成功的用户可享受单笔存款最高${initData.active_setting?.rate}的存款优惠。`"
        :btnText="btnText"
        :btnDisable="initData.status === 1"
        @transfer="
            () => {
                initData.status = 1
                init()
            }
        "
    >
        <template #table>
            <table cellspacing="0" width="100%">
                <thead>
                    <tr align="center">
                        <th width="20%">
                            首存
                            <br />
                            金额(￥)
                        </th>
                        <th width="12%">返利</th>
                        <th width="25%">
                            最高赠
                            <br />
                            送彩金(￥)
                        </th>
                        <th>流水要求</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>≥{{ initData.active_setting?.min_deposit }}</td>
                        <td>{{ initData.active_setting?.rate }}</td>
                        <td class="bold-red">{{ initData.active_setting?.max_bonus }}</td>
                        <td>(本金+红利)x{{ initData.active_setting?.limit }} 真人</td>
                    </tr>
                </tbody>
            </table>
        </template>
        <template #rules>
            <ol>
                <li>
                    符合条件的会员可在点击本优惠活动页面上“立即首存”按钮后，选择“AG真人钱包”、“PM真人钱包”、“WE真人钱包”、“欧博真人钱包”、“PT真人钱包”其中之一进行首存转账。对应的存款本金+活动奖金在转账成功后将自动添加至用户选择的真人游戏钱包中。
                </li>
                <li>此活动首笔存款定义为：用户注册后的第一笔存款；若用户在申请前将首笔存款从主钱包转出，则不可申请首存优惠。</li>
                <li>
                    申请奖金后需在指定真人游戏中完成相对应的流水要求，当用户对应真人钱包余额＜最低投注额且无未结算注单时，系统将自动判定已完成活动规定的有效流水。
                </li>
                <li>
                    此活动不与其它首存活动共享，每个账户仅限申请一次；不可与老用户召回存款活动同一天参与；领取了此项优惠活动的新用户需先完成活动规定的流水后才可申请平台救援金活动。
                </li>
                <li>
                    每位有效玩家、每个手机号码、电子邮箱、IP地址、每张银行卡、每台设备只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利；VKGAME对本活动保有最终解释权。
                </li>
            </ol>
        </template>
    </ActiveUniversalTem>
</template>
