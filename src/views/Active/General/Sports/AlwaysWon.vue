<script setup lang="ts">
import BannerImg from "@/assets/img/active/sports/alwaysWon/banner.png"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import ApiSetting from "@/api/service"
import { ref } from "vue"
import { useSysStore } from "@/stores/system"
import { HttpPlus } from "@/api/HttpPlus"
import { ActiveGetNewSportIndemnityInit } from "@/api/pojo/active/ActiveGetNewSportIndemnityInit"

const systemParams = useSysStore()

const TABLE_LIST = [
    [3, 28, 38, 58],
    [4, 38, 58, 88],
    [5, 58, 88, 128],
    [6, 88, 128, 188],
    [7, 128, 188, 228],
    [8, 188, 288, 388]
]

const initData = ref<ActiveGetNewSportIndemnityInit>(new ActiveGetNewSportIndemnityInit())

const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.shabaIndemnityActiveInit)
    const res = await HttpPlus.sendHttpRequest<ActiveGetNewSportIndemnityInit>()
    systemParams.PageLoading = false
    if (res.status === 1 && res.data) {
        initData.value = res.data
    }
}

init()
</script>

<template>
    <ActiveUniversalTem
        class="AlwaysWon-Page"
        :headTitle="'连赢好运喜上加喜'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        desc="活动期间会员投注体育赛事，完成指定连赢次数并满足单场投注需求即可获得对应彩金。"
        :btnDisable="false"
    >
        <template #table>
            <table cellspacing="0" width="100%">
                <tr>
                    <th class="text-12px! text-#262933! h-40px! leading-14px! py-0! whitespace-nowrap">连赢场数</th>
                    <th class="text-12px! text-#262933! h-40px! leading-14px! py-0! whitespace-nowrap bg-#d9efea">
                        单场投注≥500
                        <br />
                        可获彩金
                    </th>
                    <th class="text-12px! text-#262933! h-40px! leading-14px! py-0! whitespace-nowrap">
                        单场投注≥1000
                        <br />
                        可获彩金
                    </th>
                    <th class="text-12px! text-#262933! h-40px! leading-14px! py-0! whitespace-nowrap bg-#d9efea">
                        单场投注≥2000
                        <br />
                        可获彩金
                    </th>
                    <th class="text-12px! text-#262933! h-40px! leading-14px! py-0! whitespace-nowrap">流水要求</th>
                </tr>
                <tr v-for="(row, index) in TABLE_LIST" :key="index">
                    <td class="text-12px! h-26px!" :class="{ 'bg-#d9efea': i % 2 !== 0 }" v-for="(num, i) in row" :key="i">
                        {{ num }}
                    </td>
                    <td class="text-12px! h-26px!" v-if="index === 0" :rowspan="TABLE_LIST.length">1倍体育</td>
                </tr>
            </table>
        </template>
        <template #btndesc></template>
        <template #btn>
            <div class="vk_comfire_btn w-130px! mt-20px!">
                <van-button @click="systemParams.UpdateKFDialogShow(true)" class="vk-btn" block>联系客服申请</van-button>
            </div>
        </template>
        <template #rules>
            <ol>
                <li>
                    此优惠活动仅针对在威客体育、FB体育、BTI体育、平博Sports、皇冠体育、沙巴体育、IM体育其中单个平台内投注体育赛事产生连赢的会员，若投注其他赛事连赢，则无法申请此优惠活动。
                </li>
                <li>
                    参与此优惠的会员需要在体育赛事投注独赢，让球，大小，单双四个盘口，允许投注上半场或全场及滚球（不包括特殊盘口）；盘口赔率要求：不得低于欧盘1.75、亚洲盘及马来盘0.75。
                </li>
                <li>
                    此优惠活动连赢不计算串关玩法，若在期间投注串关玩法，无论输赢均视无法参与此优惠活动。若会员在一场赛事中，连续投注同一玩法,产生连赢的注单，均视为连赢场数为1。相反，投注不同玩法产生连赢，则正常计算连赢场数。
                </li>
                <li>会员连赢每局单笔投注额需符合活动要求，连赢局数中的单笔投注额以最低投注额为彩金计算标准。</li>
                <li>
                    会员相邻的连赢注单投注时间不得超过24小时。例：会员连赢了3场比赛，第3场比赛的投注时间与第2场比赛投注时间间隔不得超过24小时，若超过24小时，会员只能申请连赢2场的彩金。
                </li>
                <li>
                    此优惠活动每24小时内仅限申请一次，连赢场次完成后需要24小时内（以连赢最后一局注单结束时间为准）联系在线客服进行申请，逾期则视为自动放弃。
                </li>
                <li>
                    彩金将在审核通过后的3日内派发至用户指定的体育钱包（威客体育、FB体育、BTI体育、平博Sports、皇冠体育、沙巴体育、IM体育七选一）中，彩金需在所选游戏中完成对应的流水要求，流水未完成前不可再次申请本活动；当用户对应体育钱包余额≤原钱包余额且无未结算注单时，系统将自动判定已完成活动规定的有效流水。亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水。
                </li>
                <li>
                    每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠。对违规的用户，VKGAME保留无限期审核，
                    和扣回红利及所产生的利润权利，本活动最终解释权归VKGAME所有。
                </li>
            </ol>
        </template>
        <template #dialog></template>
    </ActiveUniversalTem>
</template>
