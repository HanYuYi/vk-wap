<script setup lang="ts">
import ApiSetting from "@/api/service"
import { useDateFormat } from "@vueuse/core"
import { useCountDown } from "@vant/use"
import type { CurrentTime } from "@vant/use"
import { ref } from "vue"
import { useSysStore } from "@/stores/system"
import { usePlaceImg } from "@/utils/globalImgs"
import { formatCountDown } from "@/utils/date"
import BannerImg from "@/assets/img/active/sports/baopei/banner.png"
import { showToast } from "vant"
import { BaseActiveStruct } from "@/api/pojo/BaseStruct"
import { HttpPlus } from "@/api/HttpPlus"

const { lazyNewLogo } = usePlaceImg()

const systemParams = useSysStore()

const CONST_ARR = [
    ["会员要求", "VIP0", "VIP1", "VIP2", "VIP3", "VIP4", "VIP5", "VIP6", "VIP7", "VIP8", "VIP9", "VIP10", "VIP11", "VIP12"],
    ["存款金额", "≥500"],
    ["单笔<br>投注金额", "≥500"],
    ["包赔返利", "10%", "10%", "15%", "15%", "15%", "18%", "18%", "18%", "20%", "20%", "20%", "25%", "50%"],
    ["包赔<br>金额最高", "58", "68", "88", "128", "168", "188", "258", "288", "388", "528", "688", "888", "1888"],
    ["流水要求", "3倍体育"]
]

class ActiveGetSportIndemnityInit extends BaseActiveStruct {
    active_show_time: string = "即日起"

    status: number = 0

    status_tip: string = ""
}
const initInfo = ref<ActiveGetSportIndemnityInit>(new ActiveGetSportIndemnityInit())

class ActiveGetIndemnityGameList extends Array {
    data: {
        game_name: string

        team_logo_1: string

        team_name_1: string

        team_logo_2: string

        team_name_2: string

        start_time: number

        game_status: number

        deposit_start_time: number

        deposit_end_time: number

        deposit_status: number

        // 前端自定义
        showTime?: boolean

        // 前端自定义
        down?: CurrentTime
    }[]
}

type GameList = ActiveGetIndemnityGameList["data"]

const gameListArr = ref<GameList>([])

const liW = ref(2.1)
const listW = ref(0)
const transW = ref(0)
const count = ref(0)

const change = (type: number): void => {
    if (type == 1) {
        count.value--
        if (count.value < 0) {
            count.value = 0
        }
    } else if (type == 2) {
        count.value++
        if (count.value + 1 > gameListArr.value.length) {
            count.value = gameListArr.value.length - 1
        }
    }
    transW.value = count.value * liW.value
}

const apply = (item: GameList[number]): void => {
    if (initInfo.value.status == 0) {
        if (item.deposit_status == 0) {
            showToast({
                className: "vk-toast-fail",
                message: "存款未达到要求！",
                icon: "warning"
            })
            return
        } else {
            systemParams.UpdateKFDialogShow(true)
        }
    } else {
        showToast({
            className: "vk-toast-fail",
            message: initInfo.value.status_tip,
            icon: "warning"
        })
        return
    }
}

const getSportIndemnityInit = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.getSportIndemnityInit)
    const res: any = await HttpPlus.sendHttpRequest<ActiveGetSportIndemnityInit>()
    systemParams.PageLoading = false
    if (res.status === 1 && res.data) {
        initInfo.value = res.data
        initInfo.value.active_show_time = useDateFormat(res.data.active_start_time * 1000, "YYYY[年]MM[月]DD[日]").value + "起"
    }
}

const getIndemnityGameList = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.active.getIndemnityGameList)
    const res = await HttpPlus.sendHttpRequest<GameList>()

    if (res.status === 1 && res.data) {
        listW.value = Math.round(res.data.length * liW.value * 100) / 100
        gameListArr.value = res.data.map((item: GameList[number]) => {
            const count: number = Math.floor(Math.abs(item.deposit_end_time * 1000 - new Date().getTime()) / 1000)

            if (count <= 24 * 60 * 60) {
                const countDown = useCountDown({
                    time: count * 1000,
                    onFinish: () => {
                        gameListArr.value = gameListArr.value.map((item: GameList[number]) => {
                            if (!item.down || !item.down.seconds) {
                                return {
                                    ...item,
                                    showTime: false
                                }
                            }
                        })
                    }
                })
                countDown.start()
                return {
                    ...item,
                    showTime: true,
                    down: countDown.current as unknown as CurrentTime
                }
            } else {
                return {
                    ...item,
                    showTime: false
                }
            }
        })
    }
}

getSportIndemnityInit()
getIndemnityGameList()
</script>

<template>
    <div class="bg-#e8f1ef font-classic text-#262933 leading-relaxed!">
        <HeaderBar>
            <div class="header_title">威客包赔单</div>
        </HeaderBar>

        <div class="expand-page SportIndemnity relative">
            <!-- 轮播图 -->
            <div class="topBanner w-full">
                <img class="w-full" :src="BannerImg" alt="" />
            </div>
            <div class="active_wrapper">
                <!-- 活动时间 -->
                <div class="title_box">
                    <span class="arrow"></span>
                    <span>活动时间：{{ initInfo.active_show_time }}</span>
                    <span class="arrow arrow_r"></span>
                </div>
                <div class="apply_box">
                    <h5>
                        共
                        <span>{{ gameListArr.length }}</span>
                        场包赔赛事
                    </h5>
                    <div class="game_events_box">
                        <ul
                            :style="{
                                width: listW + 'rem',
                                transform: 'translateX(-' + transW + 'rem)'
                            }"
                        >
                            <li v-for="(item, index) in gameListArr" :key="index">
                                <div class="game_info">
                                    <span class="e_name van-ellipsis">{{ item.game_name }}</span>
                                    <div class="team">
                                        <div class="team_box fl">
                                            <div class="team_img">
                                                <img
                                                    v-lazy="{
                                                        src: item.team_logo_1,
                                                        error: lazyNewLogo,
                                                        loading: lazyNewLogo
                                                    }"
                                                    alt=""
                                                />
                                            </div>
                                            <span class="team_name van-ellipsis" title="">{{ item.team_name_1 }}</span>
                                        </div>
                                        <span class="e_time fl" v-if="item.game_status != 1">
                                            {{ item.game_status == 2 ? "比赛中" : "已结束" }}
                                        </span>
                                        <span class="e_time fl" v-else>
                                            北京时间
                                            <br />
                                            {{ useDateFormat(item.start_time * 1000, "YYYY.MM.DD").value }}
                                            <br />
                                            {{ useDateFormat(item.start_time * 1000, "HH:mm").value }}
                                            <br />
                                        </span>
                                        <div class="team_box fl">
                                            <div class="team_img">
                                                <img
                                                    v-lazy="{
                                                        src: item.team_logo_2,
                                                        error: lazyNewLogo,
                                                        loading: lazyNewLogo
                                                    }"
                                                    alt=""
                                                />
                                            </div>
                                            <span class="team_name van-ellipsis" title="">{{ item.team_name_2 }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div @click="apply(item)" class="apply_btn" v-if="item.game_status != 1">申请包赔金</div>
                                <p v-if="item.game_status == 1 && item.showTime">
                                    请在
                                    <strong>{{ formatCountDown(item.down) }}</strong>
                                    内完成活动存款要求 点击进入
                                    <router-link to="/finance/deposit">财务中心</router-link>
                                </p>
                                <p v-if="item.game_status == 1 && !item.showTime">
                                    本比赛活动要求存款时间
                                    <br />
                                    {{ useDateFormat(item.deposit_start_time * 1000, "MM.DD HH:mm").value }}-{{
                                        useDateFormat(item.deposit_end_time * 1000, "MM.DD HH:mm").value
                                    }}
                                </p>
                            </li>
                        </ul>
                        <p v-if="!gameListArr.length" class="no_game">暂无赛事</p>
                    </div>
                    <div v-if="gameListArr.length" class="arr_box arr_box_l">
                        <span @click="change(1)" :class="{ disabled: transW <= 0.5 }"></span>
                    </div>
                    <div v-show="gameListArr.length" class="arr_box arr_box_r">
                        <span
                            @click="change(2)"
                            :class="{
                                disabled: transW >= Math.round((listW - liW) * 10) / 10
                            }"
                        ></span>
                    </div>
                </div>
                <!--活动内容-->
                <div class="title_box act_con">
                    <span class="arrow"></span>
                    <span>活动内容</span>
                    <span class="arrow arrow_r"></span>
                </div>
                <p class="act_con_p">
                    威客电竞VIP会员在活动存款时间内存款并参与指定体育赛事的盘口投注，若单笔注单结算为负盈利，即可申请注单包赔，领取包赔金。
                </p>
                <table class="act_tab" cellspacing="0" cellpadding="0">
                    <tr>
                        <td v-for="i in 6" :key="i" v-html="CONST_ARR[i - 1][0]"></td>
                    </tr>
                    <tr>
                        <td>{{ CONST_ARR[0][1] }}</td>
                        <td rowspan="13">{{ CONST_ARR[1][1] }}</td>
                        <td rowspan="13">{{ CONST_ARR[2][1] }}</td>
                        <td>{{ CONST_ARR[3][1] }}</td>
                        <td>{{ CONST_ARR[4][1] }}</td>
                        <td rowspan="13">{{ CONST_ARR[5][1] }}</td>
                    </tr>
                    <tr v-for="i in 12" :key="i">
                        <td>{{ CONST_ARR[0][i + 1] }}</td>
                        <td>{{ CONST_ARR[3][i + 1] }}</td>
                        <td>{{ CONST_ARR[4][i + 1] }}</td>
                    </tr>
                </table>
                <!--活动规则-->
                <div class="title_box act_con">
                    <span class="arrow"></span>
                    <span>活动规则</span>
                    <span class="arrow arrow_r"></span>
                </div>
                <div class="act_tab act_rule">
                    <ul>
                        <li class="li_1">
                            <p>
                                存款时间定义：每场赛事开赛前24小时内的累计存款，每次存款时间内的存款只可申请一次保险注单活动。
                                例：A场保单赛事时间为2月19日04:00，有效存款时间为2月18日04:00-2月19日04:00，在此期间会员累计存款≥500；若会员参与本场赛事投注，单笔投注额≥500即可参加A场保单赛事。
                            </p>
                        </li>
                        <br />
                        <li class="li_2">
                            <p>
                                参与包赔优惠的会员需要在体育赛事（威客体育、FB体育、BTI体育、平博Sports、皇冠体育）
                                <strong>投注独赢，让球，大小，单双四个盘口，允许投注上半场或全场及滚球（不包括特殊盘口）</strong>
                                ；盘口赔率要求：投注指定赛事的赔率不得低于欧盘1.75、亚洲盘及马来盘0.75。
                            </p>
                        </li>
                        <br />

                        <li class="li_3">
                            <p>申请包赔金的注单需为全输，若会员所投注的注单结算为输一半则视为无效注单，不可申请。</p>
                        </li>
                        <br />
                        <li class="li_4">
                            <p>符合条件的用户需在注单结算后的24小时内联系在线客服申请包赔金，逾期则视为自动放弃。</p>
                        </li>
                        <br />
                        <li class="li_5">
                            <p>
                                包赔金将在审核通过后的3日内派发至用户指定的体育钱包（威客体育、FB体育、BTI体育、平博Sports、皇冠体育五选一）中，包赔金需在所选游戏中完成对应的流水要求，流水未完成前不可再次申请本活动；当用户对应体育钱包余额≤原钱包余额且无未结算注单时，系统将自动判定已完成活动规定的有效流水。亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水。
                            </p>
                        </li>
                        <br />

                        <li class="li_6">
                            <p>
                                包赔单活动每场赛事仅限200个包赔名额，先到先得。此活动不与平台体育首存、体育救援金活动共享。若用户参与了体育首存，需先完成体育首存活动流水才可参加本活动；同样体育救援金与体育包赔活动不共享，活动同时进行时，只可选择一个参加。
                            </p>
                        </li>
                        <br />
                        <li class="li_7">
                            <p>
                                赛事取消或改期或其他原因导致赛事不能正常进行，则对应当期的保险投注优惠取消；若保单赛事因官方原因改变赛事时间，则有效存款时间从原开赛时间前24小时开始计算。
                            </p>
                        </li>
                        <br />
                        <li class="li_8">
                            <p>
                                每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠。对违规的用户，VKGAME保留无限期审核，
                                和扣回红利及所产生的利润权利，本活动最终解释权归VKGAME所有。
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.SportIndemnity {
    background-image: linear-gradient(to right, #131d38, #121423, #131d38);
    padding-bottom: 40px;
    .active_wrapper {
        padding: 0;
        margin-top: -0.32rem;
        z-index: 1;
        position: relative;
    }
    .title_box {
        background: url("@/assets/img/active/sports/baopei/line.png") no-repeat center top;
        background-size: 3.75rem 0.27rem;
        height: 0.27rem;
        text-align: center;
        padding-top: 0.4rem;
        &.act_con {
            margin-top: 0.27rem;
        }
        span:nth-child(2) {
            margin: 0 0.15rem;
            font-size: 0.17rem;
            color: #ffffff;
        }
        .arrow {
            width: 0.155rem;
            height: 0.14rem;
            display: inline-block;
            background: url("@/assets/img/active/sports/baopei/arr-l.png") no-repeat;
            background-size: 100% 100%;
            &.arrow_r {
                transform: rotateY(180deg);
            }
        }
    }
    .apply_box {
        width: 3.59rem;
        height: 2.06rem;
        background: url("@/assets/img/active/sports/baopei/sel_bor.png") no-repeat;
        background-size: 100% 100%;
        position: relative;
        margin: 0.5rem auto 0;
        padding-top: 0.14rem;
        overflow: hidden;
        .arr_box {
            position: absolute;
            z-index: 100;
            top: -0.14rem;
            width: 0.99rem;
            height: 2.3rem;
            background: url("@/assets/img/active/sports/baopei/left.png") no-repeat;
            background-size: 100% 100%;
            line-height: 2.6rem;
            pointer-events: none;
            span {
                pointer-events: all;
                width: 0.4rem;
                height: 0.5rem;
                display: inline-block;
                background: url("@/assets/img/active/sports/baopei/btn-left-normal.png") no-repeat center center;
                background-size: 0.2rem 0.32rem;
                &:active {
                    background: url("@/assets/img/active/sports/baopei/btn-left-hover.png") no-repeat center center;
                    background-size: 0.2rem 0.32rem;
                }
                &.disabled {
                    opacity: 0.1;
                    &:active {
                        background: none;
                    }
                }
            }
            &.arr_box_l {
                left: 0.05rem;
                padding-left: 0.03rem;
            }
            &.arr_box_r {
                padding-left: 0.57rem;
                background: url("@/assets/img/active/sports/baopei/right.png") no-repeat center center;
                background-size: 100% 100%;
                right: 0.01rem;
                span {
                    background: url("@/assets/img/active/sports/baopei/btn-right-normal.png") no-repeat center center;
                    background-size: 0.2rem 0.32rem;
                    &:active {
                        background: url("@/assets/img/active/sports/baopei/btn-right-hover.png") no-repeat center center;
                        background-size: 0.2rem 0.32rem;
                    }
                }
            }
        }
        h5 {
            font-size: 0.17rem;
            color: #ffffff;
            text-align: center;
            font-weight: normal;
            letter-spacing: 1px;
            span {
                color: #ffe038;
            }
        }
        .game_events_box {
            width: 2.64rem;
            margin: 0.1rem 0.5rem 0;
            overflow: hidden;
            .no_game {
                text-align: center;
                font-size: 0.14rem;
                line-height: 1.2rem;
                color: #b3b3b3;
            }
            ul {
                transition: all 0.3s ease 0s;
                li {
                    width: 1.82rem;
                    height: 1.5rem;
                    margin-left: 0.28rem;
                    float: left;
                    color: #d0d0d0;
                    .game_info {
                        width: 100%;
                        height: 1.125rem;
                        background: url("@/assets/img/active/sports/baopei/bor.png") center top no-repeat;
                        background-size: 100% 100%;
                    }
                    .e_name {
                        margin-top: 0.045rem;
                        margin-left: 0.08rem;
                        font-size: 0.08rem;
                        display: inline-block;
                        max-width: 0.6rem;
                    }
                    .team {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        overflow: hidden;
                        margin-top: 0.03rem;
                        .team_box {
                            width: 0.425rem;
                            top: 0;
                            text-align: center;
                            .team_img {
                                width: 0.425rem;
                                height: 0.425rem;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                img {
                                    max-width: 0.425rem;
                                    max-height: 0.425rem;
                                }
                            }
                            .team_name {
                                margin-top: 0.08rem;
                                font-size: 0.09rem;
                                display: inline-block;
                                max-width: 0.425rem;
                            }
                        }
                        .e_time {
                            width: 0.6rem;
                            line-height: 1.2;
                            display: block;
                            font-size: 0.09rem;
                            margin: 0 0.05rem;
                            text-align: center;
                        }
                    }
                    .apply_btn {
                        width: 1.035rem;
                        height: 0.31rem;
                        background: url("@/assets/img/active/sports/baopei/btn-apply-normal.png") no-repeat;
                        background-size: 100% 100%;
                        font-size: 0.12rem;
                        color: #ffffff;
                        text-align: center;
                        line-height: 0.31rem;
                        margin: 0.04rem auto 0;
                        cursor: pointer;
                        &:active {
                            background: url("@/assets/img/active/sports/baopei/btn-apply-hover.png") no-repeat;
                            background-size: 100% 100%;
                        }
                    }
                    p {
                        line-height: 1.2;
                        font-size: 0.12rem;
                        text-align: center;
                        margin-top: 0.04rem;
                        strong,
                        a {
                            color: #ffe038;
                            &:last-child {
                                text-decoration: underline;
                            }
                        }
                    }
                }
            }
        }
    }
    .act_con_p {
        font-size: 0.12rem;
        color: #d0d0d0;
        padding: 0 0.4rem;
        margin-top: 0.35rem;
        line-height: 1.3;
    }
    .act_tab {
        width: 3.57rem;
        margin: 0.4rem auto 0;
        height: 4/205rem;
        background: url("@/assets/img/active/sports/baopei/form.png") no-repeat;
        background-size: 100% 100%;
        box-shadow: 14px 14px 20px 0px rgba(0, 0, 0, 0.3), -14px -14px 20px 0px rgba(0, 0, 0, 0.3);
        font-size: 0.12rem;
        color: #d0d0d0;
        outline: 1px solid #ffe038;
        tr td {
            margin: 0;
            padding: 0;
            text-align: center;
            border-right: 1px solid #0f93aa;
            border-bottom: 1px solid #0f93aa;
        }
    }
    .act_rule {
        margin-top: 0.6rem;
        width: 3.57rem;
        height: 7rem;
        background: url("@/assets/img/active/sports/baopei/rule.png") no-repeat;
        background: 100% 100%;
        padding: 0.3rem 0.25rem 0;
        color: #d0d0d0;
        font-size: 0.12rem;
        line-height: 1.2;
        ul {
            li {
                display: flex;
                &::before {
                    content: "";
                    width: 0.13rem;
                    height: 0.09rem;
                    display: inline-block;
                    margin-right: 0.07rem;
                    margin-top: 0.02rem;
                }
                p {
                    width: 2.85rem;
                    strong {
                        font-weight: normal;
                        color: #ffe038;
                    }
                }
                .backgroundcard(@num) {
                    &.li_@{num}:before {
                        background: url("@/assets/img/active/sports/baopei/@{num}.png") no-repeat;
                        background-size: 100% 100%;
                    }
                }
                .loop (@i) when (@i < 9) {
                    .backgroundcard(@i);
                    .loop(@i+1);
                }
                .loop(1);
            }
        }
    }
}
</style>
