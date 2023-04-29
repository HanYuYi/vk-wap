<script setup lang="ts">
import BannerImg from "@/assets/img/active/sports/sabaIndemnity/banner.jpg"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import ApiSetting from "@/api/service"
import { ref } from "vue"
import { useSysStore } from "@/stores/system"
import { ActiveGetNewSportIndemnityInit } from "@/api/pojo/active/ActiveGetNewSportIndemnityInit"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

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
        class="SabaIndemnity-Page"
        :headTitle="'体育100%首单包赔'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        :desc="`活动期间，VIP会员在FB体育、BTI体育、IM体育、沙巴体育、皇冠体育可享受首单100%包赔优惠，活动彩金最高领取${initData.bonus}元！`"
        :btnDisable="false"
    >
        <template #table>
            <table cellspacing="0" width="100%">
                <tr>
                    <th width="40%" class="text-12px! text-#262933!">注单要求</th>
                    <th class="text-12px! text-#262933!">返还比例</th>
                    <th class="text-12px! text-#262933!">最高返还</th>
                    <th class="text-12px! text-#262933!">彩金流水要求</th>
                </tr>
                <tr>
                    <td class="text-12px!">单笔投注金额不限</td>
                    <td class="text-12px!" rowspan="3">100%</td>
                    <td class="text-12px!" rowspan="3">{{ initData.bonus }}</td>
                    <td class="text-12px!" rowspan="3">
                        体育游戏
                        <br />
                        6倍流水
                    </td>
                </tr>
                <tr>
                    <td class="text-12px!">注单结果为输值</td>
                </tr>
                <tr>
                    <td class="text-12px!">
                        第一笔在
                        <br />
                        FB体育/BTI体育/IM体育/沙巴体育/皇冠体育投注的注单
                    </td>
                </tr>
                <tr>
                    <td class="text-12px!">游戏场馆要求</td>
                    <td class="text-12px!" colspan="3">FB体育、BTI体育、IM体育、沙巴体育、皇冠体育</td>
                </tr>
            </table>
        </template>
        <template #btndesc></template>
        <template #btn>
            <div class="vk_comfire_btn mt-20px!">
                <van-button @click="systemParams.UpdateKFDialogShow(true)" class="vk-btn" block>联系客服</van-button>
            </div>
        </template>
        <template #rules>
            <ol>
                <li>
                    活动期间，VIP会员在FB体育或BTI体育或IM体育或沙巴体育或皇冠体育的第一笔有效注单结果为全输，即可享受首单100%包赔优惠，活动彩金最高领取{{
                        initData.bonus
                    }}元！
                </li>
                <li>
                    符合以上条件的会员，请在注单结束后的24小时内联系在线客服进行申请并选择彩金派发钱包，客服审核无误后将于24小时内派发彩金至对应的体育游戏钱包中，逾期则视为自动放弃。
                </li>
                <li>申请首单100%包赔的注单需为全输，若会员所投注的注单结算为输一半则视为无效注单，不可申请。</li>
                <li>
                    此优惠活动每位会员仅限领取一次，领取当天不与新用户首存优惠活动、电子首存优惠活动、电竞首存优惠活动、VIP月存款活动、体育周存款活动、体育包赔单活动、棋牌周存款、真人周存款活动共享。
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
        <template #dialog></template>
    </ActiveUniversalTem>
</template>
