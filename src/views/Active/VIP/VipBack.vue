<script setup lang="ts">
import BannerImg from "@/assets/img/active/vip/VipBack/banner.jpg"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import { useDateFormat } from "@vueuse/core"
import ApiSetting from "@/api/service"
import { ref } from "vue"
import { useSysStore } from "@/stores/system"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

class VipVipGameBack {
    // 前端自定义
    active_show_time?: string = ""

    active_start_time: number = 0

    setting: {
        level: string
        egame_back: string
        tfgame_back: string
        imgame_back: string
        other_egame_back: string
        sport_back: string
        crown_back: string
        pb_sport_back: string
        live_game_back: string
        chess_back: string
        slots_back: string
    }[] = []
}

const initData = ref<VipVipGameBack>(new VipVipGameBack())

const titArr = [
    "等级",
    "小艾<br>电竞",
    "IM<br>电竞",
    "RG<br>电竞",
    "威客<br>&FB<br>体育",
    "皇冠<br>体育",
    "其他<br>体育",
    "真人",
    "棋牌",
    "电子<br>游戏"
]

const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.vipGameBack)
    const res = await HttpPlus.sendHttpRequest<VipVipGameBack>()
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
        class="VipBack-Page"
        :headTitle="'VIP返水优惠'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        desc="`所有参与VKGAME游戏投注的VIP会员均可享受每日返水奖金，返水不设上限。`"
        :btnText="''"
        :btnDisable="true"
    >
        <template #table>
            <table cellspacing="0" width="100%" v-if="initData.setting.length">
                <thead>
                    <tr align="center">
                        <td class="text-12px!" v-for="(name, j) in titArr" :key="j" v-html="name"></td>
                    </tr>
                    <tr v-for="i in 13" :key="i">
                        <td class="text-12px! h-28px!" width="10%">
                            {{ initData.setting[i - 1]?.level }}
                        </td>
                        <td class="text-12px! h-28px!">
                            {{ initData.setting[i - 1]?.egame_back }}
                        </td>
                        <td class="text-12px! h-28px!">
                            {{ initData.setting[i - 1]?.imgame_back }}
                        </td>
                        <td class="text-12px! h-28px!">
                            {{ initData.setting[i - 1]?.other_egame_back }}
                        </td>
                        <td class="text-12px! h-28px!">
                            {{ initData.setting[i - 1]?.sport_back }}
                        </td>
                        <td class="text-12px! h-28px!">
                            {{ initData.setting[i - 1]?.crown_back }}
                        </td>
                        <td class="text-12px! h-28px!">
                            {{ initData.setting[i - 1]?.pb_sport_back }}
                        </td>
                        <!-- <td class="text-12px! h-28px!">{{initData.setting[i-1].pb_sport_back}}</td> -->
                        <td class="text-12px! h-28px!">
                            {{ initData.setting[i - 1]?.live_game_back }}
                        </td>
                        <td class="text-12px! h-28px!">
                            {{ initData.setting[i - 1]?.chess_back }}
                        </td>
                        <td class="text-12px! h-28px!">
                            {{ initData.setting[i - 1]?.slots_back }}
                        </td>
                    </tr>
                    <tr>
                        <td class="text-12px! h-28px! text-left!" :colspan="titArr.length">
                            <span>数据单位:%</span>
                            <br />
                            小艾电竞包含自走棋。其它体育：平博体育、IM体育、沙巴体育。真人：AG真人、PM真人、WE真人、欧博真人、PT真人。棋牌:乐游棋牌、开元棋牌、凯旋棋牌、博乐棋牌。电子游戏：PT电子游戏、PG电子游戏。
                        </td>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </template>
        <template #btndesc></template>
        <template #btn><div></div></template>
        <template #rules>
            <ol>
                <li>
                    小艾电竞包含自走棋。其它体育包括：平博体育、IM体育、沙巴体育。真人包括：AG真人、PM真人、WE真人、欧博真人、PT真人。棋牌包括:乐游棋牌、开元棋牌、凯旋棋牌、博乐棋牌。电子游戏包括：PT电子游戏、PG电子游戏。
                </li>
                <li>
                    电竞/体育返水每日18:00左右自动派发，其余游戏返水每日凌晨0:30左右自动派发、无需申请。返现奖金无最低派发额度，无上限，此奖金需完成活动规定的1倍全站有效流水。返水计算周期为：昨日0点至今日0点的返水报表。
                </li>
                <li>
                    电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水。
                </li>
                <li>
                    所有轮盘类游戏、牛牛、骰宝、捕鱼王、空战世纪将不享受返水优惠；PT电子游戏中以下游戏不享受返水优惠：
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
    </ActiveUniversalTem>
</template>
