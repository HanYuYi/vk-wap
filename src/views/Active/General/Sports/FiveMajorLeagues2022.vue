<script setup lang="ts">
import ApiSetting from "@/api/service"
import { ref } from "vue"
import { useSysStore } from "@/stores/system"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { HttpPlus } from "@/api/HttpPlus"

const router: Router = useRouter()
const systemParams = useSysStore()

class ActiveGetFiveMajorLeaguesInit {
    active_start_time: string

    active_end_time: string

    is_login: number

    sport_url: string
}
const initInfo = ref<ActiveGetFiveMajorLeaguesInit | null>(null)

const loading = ref(false)

const getInit = async (): Promise<void> => {
    loading.value = true
    HttpPlus.setUrlOptions(ApiSetting.active.getFiveMajorLeaguesInit)
    const res = await HttpPlus.sendHttpRequest<ActiveGetFiveMajorLeaguesInit>()
    loading.value = false
    if (res.status === 1 && res.data) {
        initInfo.value = res.data
    }
}

const openUrl = (): void => {
    if (!systemParams.isLogin) {
        router.push("/login")
    } else {
        window.open(initInfo.value?.sport_url)
    }
}

getInit()
</script>

<template>
    <div class="bg-#e8f1ef font-classic text-#262933 leading-relaxed!">
        <HeaderBar>
            <div class="header_title">五大联赛活动</div>
        </HeaderBar>

        <div class="expand-page fiveMajorLeagues2022">
            <div class="child-panel date-time">
                <h4 class="title">活动时间</h4>
                <p class="desc">
                    {{
                        initInfo && initInfo.active_start_time
                            ? `${initInfo.active_start_time} - ${initInfo.active_end_time}`
                            : "加载中..."
                    }}
                </p>
            </div>

            <div class="child-panel content-panel">
                <h4 class="title">活动内容</h4>
                <p class="desc">
                    活动期间内，会员投注【五大联赛】赛事周累计有效投注5000元及以上金额，即可获得返水加码，最高直升1.5‰。
                </p>

                <table cellspacing="0" width="100%">
                    <tr>
                        <td>【五大联赛】周累计有效投注</td>
                        <td>返水直升（‰）</td>
                    </tr>
                    <tr>
                        <td>≥ 5,000,000</td>
                        <td>1.5</td>
                    </tr>
                    <tr>
                        <td>≥ 1,000,000</td>
                        <td>1.2</td>
                    </tr>
                    <tr>
                        <td>≥ 500,000</td>
                        <td>1.0</td>
                    </tr>
                    <tr>
                        <td>≥ 50,000</td>
                        <td>0.6</td>
                    </tr>
                    <tr>
                        <td>≥ 5000</td>
                        <td>0.3</td>
                    </tr>
                </table>

                <!--0 可领 1已领取 3 已参与互斥活动 4 昨日未达到领取条件  其他-->
                <p
                    class="ffft"
                    v-if="
                        initInfo && initInfo.is_login && (initInfo.status === 0 || initInfo.status === 3 || initInfo.status === 4)
                    "
                >
                    {{ initInfo.status_tips }}
                </p>
                <div class="btn">
                    <button :class="{ disabled: loading }" @click="openUrl">立即投注</button>
                </div>
            </div>

            <div class="child-panel rule-panel">
                <h4 class="title">活动规则</h4>
                <ul>
                    <li>
                        1. 彩金无需申请，每个自然周内累计流水达到对应的额度即可获得返水加码彩金，派发时间为次周一 00:00-23:59。
                    </li>
                    <li>
                        2. 体育游戏包括：威客体育、FB体育、BTI体育、平博Sports、皇冠体育、沙巴体育、IM体育，其余注单不列入计算。
                    </li>
                    <li>3. 「周」结算区间为北京时间每周一00:00至周日23:59。</li>
                    <li>
                        4.
                        会员需要在体育赛事投注独赢，让球，大小，单双四个盘口，允许投注上半场或全场及滚球（不包括特殊盘口）；盘口赔率要求：投注指定赛事的赔率不得低于欧盘1.75、亚洲盘及马来盘0.75。
                    </li>
                    <li>5. 五大联赛分为英超，意甲，德甲，法甲，西甲五种类型。投注其余赛事不被计算为有效投注。</li>
                    <li>
                        6.
                        活动彩金需完成全站1倍有效流水，即可提款。有效流水要求：电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                        <span class="text-#99cccc underline" @click="systemParams.ActiveMoreRules.isShow = true">查看详情</span>
                        。
                    </li>
                    <li>
                        7.
                        每位有效玩家、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑者只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利。VKGAME对本活动保有最终解释权。
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.fiveMajorLeagues2022 {
    overflow: hidden;
    background: #002955 url("@/assets/img/active/sports/fiveMajorLeagues2022/bg.jpg") no-repeat center top;
    background-size: 100% auto;

    // public
    .child-panel {
        width: 3.45rem;
        margin: 0 auto;
        border-radius: 0.1rem;
        background-color: #336699;
        box-shadow: inset 0 0.01rem 0.02rem 0 rgba(255, 255, 255, 0.7);
        border-top: 0.01px solid transparent;

        .title {
            text-align: center;
            font-size: 0.17rem;
            font-weight: bold;
            line-height: 0.17rem;
            color: #fff;
            margin-top: 0.15rem;
        }

        .desc {
            width: calc(100% - 0.3rem);
            font-size: 0.15rem;
            line-height: 0.15rem;
            color: #99cccc;
            margin: 0.09rem auto 0;
        }
    }

    .date-time {
        margin: 2.17rem auto 0;
        height: 0.71rem;
        .desc {
            text-align: center;
        }
    }

    .content-panel {
        margin: 0.2rem auto 0;
        position: relative;
        .desc {
            line-height: 0.2rem;
        }

        table {
            border: 0;
            width: calc(100% - 0.3rem);
            margin: 0.1rem auto 0;
            border-radius: 0.1rem;
            background: #13477b;
            overflow: hidden;
            position: relative;
            &:before {
                position: absolute;
                inset: 0;
                content: "";
                box-sizing: border-box;
                border-radius: 0.1rem;
                border: 0.5px solid #99cccf;
            }
            tr {
                td {
                    width: 50%;
                    box-sizing: border-box;
                    text-align: center;
                    line-height: 0.285rem;
                    font-size: 0.11rem;
                    color: #99cccc;
                    border-bottom: 0.5px solid #99cccf;
                    border-right: 0.5px solid #99cccf;
                    white-space: nowrap;
                }
                &:first-child {
                    td {
                        font-weight: bold;
                    }
                }
            }
        }

        .ffft {
            margin-top: 0.15rem;
            line-height: 0.15rem;
            font-size: 0.15rem;
            width: 100%;
            color: #fff;
            text-align: center;
        }

        .btn {
            margin-top: 0.15rem;
            padding-bottom: 0.15rem;
            text-align: center;
            button {
                outline: 0;
                width: 1.555rem;
                height: 0.3rem;
                box-sizing: border-box;
                font-size: 0.15rem;
                line-height: 0.28rem;
                font-weight: bold;
                border-radius: 0.15rem;
                color: #fff;
                box-shadow: 0 0.02rem 0.03rem 0 rgba(0, 21, 76, 0.2), inset 0 -0.02rem 0.04rem 0 rgba(0, 0, 0, 0.3),
                    inset 0 0.02rem 0.04rem 0 rgba(255, 255, 255, 0.4);
                border: solid 0.01rem #fff5ea;
                background-image: linear-gradient(to bottom, #2c74bb, #264d74), linear-gradient(to bottom, #07e9f1, #07f1b7);
                transition: background 0.3s, box-shadow 0.3s;
                &:active {
                    box-shadow: 0 0.02rem 0.03rem 0 rgba(0, 21, 76, 0.2), inset 0 -0.02rem 0.04rem 0 rgba(0, 0, 0, 0.3),
                        inset 0 0.02rem 0.04rem 0 rgba(255, 255, 255, 0.6);
                    background-image: linear-gradient(to bottom, #5094da, #3973ae), linear-gradient(to bottom, #07e9f1, #07f1b7);
                }
                &.disabled {
                    opacity: 0.5;
                    pointer-events: none;
                }
            }
        }
    }

    .rule-panel {
        margin: 0.2rem auto;
        ul {
            width: calc(100% - 0.3rem);
            margin: 0.07rem auto 0;
            padding-bottom: 0.11rem;
            li {
                font-size: 0.15rem;
                line-height: 0.23rem;
                color: #99cccc;
            }
        }
    }
}
</style>
