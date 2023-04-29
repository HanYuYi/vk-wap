<script setup lang="ts">
import BannerImg from "@/assets/img/active/chess/Chessking/banner.jpg"

import ActiveUniversalTem from "@/components/ActiveUniversalTem.vue"
import ApiSetting from "@/api/service"
import { Autoplay } from "swiper"
import { useDateFormat } from "@vueuse/core"
import { ref, computed, unref } from "vue"
import { useSysStore } from "@/stores/system"
import { CHESS_WALLETS } from "@/const/Wallet"
import { usePlaceImg } from "@/utils/globalImgs"
import { showToast } from "vant"
import { ActiveGetChessKingInit, WeekItem } from "@/api/pojo/active/ActiveGetChessKingInit"
import { HttpPlus } from "@/api/HttpPlus"

const { GrayAvatar } = usePlaceImg()
const systemParams = useSysStore()

const initData = ref<ActiveGetChessKingInit>(new ActiveGetChessKingInit())

const lastWeekScollData = computed<WeekItem[][]>(() => {
    const arr: WeekItem[][] = []
    const sourceArr: WeekItem[] = initData.value.last_week.slice(3)
    if (sourceArr.length) {
        for (let i = 0; i < sourceArr.length; i += 4) {
            arr.push(sourceArr.slice(i, i + 4))
        }
    }
    return arr
})
const currentWeekScollData = computed<WeekItem[][]>(() => {
    const arr: WeekItem[][] = []
    const sourceArr: WeekItem[] = initData.value.current_week.slice(3)
    if (sourceArr.length) {
        for (let i = 0; i < sourceArr.length; i += 4) {
            arr.push(sourceArr.slice(i, i + 4))
        }
    }
    return arr
})

const activeSetting = ref<ActiveGetChessKingInit["active_setting"]>({
    list: [],
    bet_times: 3
})

const btnText = computed(() => {
    if (initData.value.is_login && initData.value.status === 1) {
        return "已领取"
    }
    return "立即申请"
})
const btnDisable = computed<boolean>(() => {
    if (initData.value.is_login && initData.value.status === 1) {
        return true
    }
    return false
})

const walletIndex = ref(0)
const walletCode = computed<string>(() => {
    if (CHESS_WALLETS.length) {
        return CHESS_WALLETS[walletIndex.value]?.code
    }
    return ""
})

const show = ref(false)

const confirmLoading = ref(false)

const transfer = async (): Promise<void> => {
    confirmLoading.value = true
    try {
        const params = {
            from: "NM",
            to: unref(walletCode),
            money: initData.value.bouns,
            active_id: initData.value.active_id
        }
        HttpPlus.setUrlOptions(ApiSetting.user.transferSubmit)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        confirmLoading.value = false

        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: `领取成功！`,
                icon: "checked"
            })
            show.value = false
            initData.value.status = 1
        }
    } catch (error: unknown) {
        confirmLoading.value = false
        console.error(error)
    }
}

const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.getChessKingInit)
    const res = await HttpPlus.sendHttpRequest<ActiveGetChessKingInit>()
    systemParams.PageLoading = false
    if (res.status === 1 && res.data) {
        initData.value = res.data
        initData.value.active_show_time = useDateFormat(res.data.active_start_time * 1000, "YYYY[年]MM[月]DD[日]").value + "起"
        if (res.data.active_setting) {
            activeSetting.value = res.data.active_setting
        }
    }
}

init()
</script>

<template>
    <ActiveUniversalTem
        class="Chessking-Page"
        :headTitle="'雀王争霸'"
        :BannerImg="BannerImg"
        :time="initData.active_show_time"
        :initData="initData"
        :walletList="CHESS_WALLETS"
        desc="参与威客雀王争霸赛，每个自然周在棋牌游戏累计流水排名前五十名的会员均可获得现金红包奖励。"
        :btnText="btnText"
        :btnDisable="btnDisable"
        @open="
            () => {
                walletIndex = 0
                show = true
            }
        "
    >
        <template #table>
            <table cellspacing="0" width="100%" v-if="activeSetting.bet_times">
                <thead>
                    <tr align="center">
                        <td class="text-#262933! text-12px! h-27px!">雀王排名</td>
                        <td class="text-#262933! text-12px! h-27px!" v-for="(levelset, index) in activeSetting.list" :key="index">
                            {{ levelset?.level_cn }}
                        </td>
                    </tr>
                    <tr>
                        <td class="text-#262933! text-12px! h-27px!">彩金</td>
                        <td class="text-#262933! text-12px! h-27px!" v-for="(itemset, index) in activeSetting.list" :key="index">
                            {{ itemset?.bonus }}元
                        </td>
                    </tr>
                    <tr>
                        <td class="text-#262933! text-12px! h-27px!">彩金流水</td>
                        <td class="text-#262933! text-12px! h-27px!" colspan="6">棋牌游戏3倍流水</td>
                    </tr>
                </thead>
            </table>
        </template>
        <template #btndesc></template>
        <template #other>
            <section>
                <!--上周排名-->
                <div class="chessking_rank">
                    <h3 class="k_header">上周排名</h3>
                    <div class="topthree">
                        <ul class="top3ul nomore" v-if="initData.last_week.length">
                            <li
                                v-for="(item, index) in initData.last_week.slice(0, 3)"
                                :key="index"
                                class="list-complete-item"
                                :class="{ 'list-complete-item-ool': index % 2 == 1 }"
                            >
                                <span class="fl usernum">{{ item.rank }}.</span>
                                <img
                                    class="user_headimg"
                                    v-lazy="{
                                        src: item?.head_image,
                                        error: GrayAvatar,
                                        loading: GrayAvatar
                                    }"
                                />
                                <p>
                                    <span class="fl van-ellipsis user_name" title="">{{ item.username }}</span>
                                    <br />
                                    <span class="user_level" :class="['lv' + item.level]">VIP.{{ item.level }}</span>
                                </p>
                            </li>
                        </ul>
                        <div v-else class="norank">排行统计中</div>
                    </div>
                    <div class="otherrank" v-if="lastWeekScollData.length">
                        <swiper
                            :modules="[Autoplay]"
                            :autoplay="{
                                delay: 2400,
                                disableOnInteraction: false
                            }"
                            :loop="lastWeekScollData.length > 1"
                            :speed="800"
                            direction="vertical"
                            class="h-70px"
                        >
                            <swiper-slide
                                class="other_list"
                                tag="ul"
                                v-for="(item, index) in lastWeekScollData"
                                :key="index + 'other'"
                            >
                                <li
                                    v-for="(ele, eindex) in item"
                                    :key="eindex"
                                    class="list-complete-item"
                                    :class="{ 'list-complete-item-ool': eindex % 2 == 1 }"
                                >
                                    <span class="fl usernum">{{ ele.rank }}.</span>
                                    <img
                                        class="user_headimg"
                                        v-lazy="{
                                            src: ele?.head_image,
                                            error: GrayAvatar,
                                            loading: GrayAvatar
                                        }"
                                    />
                                    <p>
                                        <span class="fl van-ellipsis user_name">{{ ele.username }}</span>
                                        <br />
                                        <span class="user_level" :class="['lv' + ele.level]">VIP.{{ ele.level }}</span>
                                    </p>
                                </li>
                            </swiper-slide>
                        </swiper>
                    </div>
                </div>
                <!--本周排名-->
                <div class="chessking_rank">
                    <h3 class="k_header">本周排名</h3>
                    <div class="topthree">
                        <ul class="top3ul nomore" v-if="initData.current_week.length">
                            <li
                                v-for="(item, index) in initData.current_week.slice(0, 3)"
                                :key="index"
                                class="list-complete-item"
                                :class="{ 'list-complete-item-ool': index % 2 == 1 }"
                            >
                                <span class="fl usernum">{{ item.rank }}.</span>
                                <img
                                    class="user_headimg"
                                    v-lazy="{
                                        src: item?.head_image,
                                        error: GrayAvatar,
                                        loading: GrayAvatar
                                    }"
                                />
                                <p>
                                    <span class="fl van-ellipsis user_name" title="">{{ item.username }}</span>
                                    <br />
                                    <span class="user_level" :class="['lv' + item.level]">VIP.{{ item.level }}</span>
                                </p>
                            </li>
                        </ul>
                        <div v-else class="norank">排行统计中</div>
                    </div>
                    <div class="otherrank" v-if="currentWeekScollData.length">
                        <swiper
                            :modules="[Autoplay]"
                            :autoplay="{
                                delay: 2400,
                                disableOnInteraction: false
                            }"
                            :loop="currentWeekScollData.length > 1"
                            :speed="800"
                            direction="vertical"
                            class="h-70px"
                        >
                            <swiper-slide
                                class="other_list"
                                tag="ul"
                                v-for="(item, index) in currentWeekScollData"
                                :key="index + 'otherc'"
                            >
                                <li
                                    v-for="(ele, eindex) in item"
                                    :key="eindex"
                                    class="list-complete-item"
                                    :class="{ 'list-complete-item-ool': eindex % 2 == 1 }"
                                >
                                    <span class="fl usernum">{{ ele.rank }}.</span>
                                    <img
                                        class="user_headimg"
                                        v-lazy="{
                                            src: ele?.head_image,
                                            error: GrayAvatar,
                                            loading: GrayAvatar
                                        }"
                                    />
                                    <p>
                                        <span class="fl van-ellipsis user_name">{{ ele.username }}</span>
                                        <br />
                                        <span class="user_level" :class="['lv' + ele.level]">VIP.{{ ele.level }}</span>
                                    </p>
                                </li>
                            </swiper-slide>
                        </swiper>
                    </div>
                </div>
                <!--我的排名-->
                <div class="chessking_rank userrank">
                    <h3 class="k_header">{{ initData.is_monday ? "上" : "本" }}周我的排名</h3>
                    <div class="topthree">
                        <ul class="top3ul nomore" v-if="initData.is_login">
                            <li class="nofl" v-if="initData.self_data">
                                <span class="fl usernum" v-if="initData.self_data.rank <= 50 && initData.self_data.rank > 0">
                                    {{ initData.self_data.rank }}.
                                </span>
                                <img
                                    class="user_headimg"
                                    v-lazy="{
                                        src: initData.self_data?.head_image,
                                        error: GrayAvatar,
                                        loading: GrayAvatar
                                    }"
                                />
                                <p>
                                    <span class="fl van-ellipsis user_name">{{ initData.self_data.username }}</span>
                                    <br />
                                    <span class="user_level" :class="['lv' + initData.self_data.level]">
                                        VIP.{{ initData.self_data.level }}
                                    </span>
                                </p>
                            </li>
                            <li class="nofl" v-else>
                                <img class="user_headimg" :src="GrayAvatar" />
                                <p>
                                    <span class="fl user_name">排行统计中</span>
                                    <br />
                                </p>
                            </li>
                            <div class="user_ps" v-if="initData.is_login">
                                <span v-if="!initData.is_monday && initData.self_data.rank > 50">
                                    还差
                                    <strong>{{ initData.self_data.bet }}</strong>
                                    流水，您可超越当前第50名，再接再厉哦
                                </span>
                                <span v-if="!initData.is_monday && initData.self_data.rank <= 50 && initData.self_data.rank > 0">
                                    还差
                                    <strong>{{ initData.self_data.bet }}</strong>
                                    流水，您的排名即可超越上一级哦
                                </span>
                                <span v-if="!initData.is_monday && initData.self_data.rank == 0">
                                    还未产生有效流水，您还未入榜
                                </span>
                                <span v-if="initData.is_monday && (initData.self_data.rank > 50 || initData.self_data.rank == 0)">
                                    上周未达到彩金领取条件，本周请继续努力哦
                                </span>
                                <span v-if="initData.is_monday && initData.self_data.rank <= 50 && initData.self_data.rank > 0">
                                    您可领取{{ initData.self_data.bouns }}元彩金
                                </span>
                            </div>
                        </ul>
                        <ul class="top3ul nologin nomore" v-if="!initData.is_login">
                            <li class="nofl">
                                <img class="user_headimg" :src="GrayAvatar" />
                                <router-link class="text-#09e7b2 underline" to="/login">请您先登录！</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="user_desc">
                    <i class="dot"></i>
                    雀王争霸赛排名数据每日00:00:00左右更新
                    <br />
                    <i class="dot"></i>
                    彩金领取时间为每周一00:10:00-23:59:59
                </div>
            </section>
        </template>
        <template #rules>
            <ol>
                <li>棋牌游戏包括：乐游棋牌、开元棋牌、凯旋棋牌、博乐棋牌。</li>
                <li>参与雀王争霸排名前五十的会员需于每周一在活动页面领取彩金并选择彩金派发的钱包，逾期则视为自动放弃。</li>
                <li>
                    彩金需在对应钱包游戏中完成活动规定的有效流水。当用户对应棋牌游戏钱包余额≤原钱包余额且无未结算注单时，系统将自动判定已完成活动规定的有效流水，彩金流水未完成前不可再次领取。
                </li>
                <li>
                    每位有效玩家、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑者只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利。
                </li>
                <li>VKGAME对本活动保有最终解释权。</li>
            </ol>
        </template>
        <template #dialog>
            <van-dialog
                class="active-universal-dialog px-6px! pt-40px!"
                :close-on-click-overlay="true"
                v-model:show="show"
                :show-confirm-button="false"
                get-container="body"
            >
                <div class="close" @click="show = false"></div>
                <div class="flex">
                    <div class="wallet_title w-70px block whitespace-nowrap">彩金：</div>
                    <div>{{ initData.bouns }}元</div>
                </div>
                <div class="flex">
                    <div class="wallet_title w-70px block whitespace-nowrap">返利至：</div>
                    <div class="wallet_box_wrapper px-0! w-260px min-h-70px!" v-if="CHESS_WALLETS.length">
                        <div
                            @click="walletIndex = i"
                            class="wallet_box mr-4px! mb-8px!"
                            :class="[`${item.code}`, { active: walletIndex === i }]"
                            v-for="(item, i) in CHESS_WALLETS"
                            :key="i"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                    <div v-if="!CHESS_WALLETS.length" class="wallet_box_wrapper">
                        <van-loading class="ab-center" type="spinner" />
                    </div>
                </div>
                <div class="vk_comfire_btn">
                    <van-button
                        :loading="confirmLoading"
                        @click="transfer"
                        class="h-36px primary-btn rounded-30px border-none text-15px text-#000 font-bold"
                        block
                    >
                        确定
                    </van-button>
                </div>
            </van-dialog>
        </template>
    </ActiveUniversalTem>
</template>

<style lang="scss" scoped>
@import "@/assets/style/vip.scss";
.fl {
    float: left;
}
.fr {
    float: right;
}
.Chessking-Page {
    .user_desc {
        font-size: 0.12rem;
        box-sizing: border-box;
        padding: 0 0.1rem 0;
        color: #1c1e25;
        .dot {
            width: 0.02rem;
            height: 0.02rem;
            margin-right: 0.03rem;
            border-radius: 100%;
            display: inline-block;
            background-color: #5a5a5a;
            vertical-align: middle;
            border: 1px solid #5a5a5a;
            margin-top: -0.01rem;
        }
    }
    .chessking_rank {
        width: 3.5rem;
        margin-bottom: 0.08rem;
        border: solid 1px #1c1e25;
        &.userrank .topthree {
            min-height: 0.6rem;
            height: fit-content;
        }
        .k_header {
            background-color: #3d4150;
            text-align: center;
            font-size: 0.14rem;
            color: #09e7b2;
            padding: 0.05rem 0;
        }
        .topthree {
            padding-top: 0.02rem;
            height: 0.7rem;
        }
        .otherrank {
            height: 0.7rem;
            border-top: solid 1px #1c1e25;
        }
        .norank {
            line-height: 0.7rem;
            text-align: center;
        }
        ul {
            overflow: hidden;
            position: relative;
            &:last-child {
                border-top: 0;
            }
            &.other_list {
                height: 0.7rem;
                .user_name {
                    color: #8692b6;
                }
            }
            &.top3ul {
                height: 100%;
            }
            &.top3ul.nomore {
                li {
                    &:first-child {
                        width: 100%;
                        padding-left: 1.3rem;
                    }
                }
            }
        }
        li {
            height: 0.35rem;
            line-height: 0.35rem;
            width: 50%;
            float: left;
            box-sizing: border-box;
            padding-left: 0.4rem;
            color: #1c1e25;
            display: flex;
            align-items: center;
            line-height: normal;
            font-size: 0.12rem;
            &.nofl {
                float: unset;
            }
        }
        .user_headimg {
            width: 0.25rem;
            height: 0.25rem;
            box-sizing: border-box;
            border-radius: 50%;
            border: 0.02rem solid #07f1b7;
            margin-right: 0.04rem;
        }
        .usernum {
            width: 0.2rem;
        }
        .user_name {
            line-height: normal;
            max-width: 0.7rem;
        }
        .user_ps {
            box-sizing: border-box;
            padding: 0.02rem 0.14rem 0.06rem;
            font-size: 0.12rem;
            color: #1c1e25;
            text-align: center;
            strong {
                color: #8692b6;
                font-weight: normal;
            }
        }
    }
}
</style>
