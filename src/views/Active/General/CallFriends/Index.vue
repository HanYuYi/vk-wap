<script setup lang="ts">
import Rules from "./Rules.vue"
import Desc from "./Desc.vue"
import ApiSetting from "@/api/service"
import { computed, reactive, ref, unref } from "vue"
import { useSysStore } from "@/stores/system"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { showToast } from "vant"
import { formatNumberSplit } from "@/utils/numberUtils"
import type { ActiveGetCallFriendsInit, RankItem } from "@/api/pojo/active/ActiveGetCallFriendsInit"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()
const router: Router = useRouter()

const tabInfo = [{ text: "邀请首存送" }, { text: "邀请周存送" }, { text: "返利无上限" }]

// 0 邀请人排行榜；1 受邀请人排行榜
const phbIndex = ref(0)
// 三个活动切换
const tabIndex = ref(0)
const activeTime = ref<string>("即日起")
// 邀请人排行榜数据
const inviteList = ref<RankItem[]>([])
// 被邀请人排行榜数据
const invitedList = ref<RankItem[]>([])
// 0：派发不足15元；1：满15元，未派发；2：满15元，已派发
const sendStatus = ref(0)
const activeThree = reactive({
    rebate_today: 0,
    total_bet: 0,
    total_rebate: 0
})

// 是否绑定手机号，0: 未绑定，1：绑定
const isBindPhone = ref(true)
// 当前是否是邀请人排行榜
const isInvitePhb = computed(() => phbIndex.value === 0)

const init = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.active.callFriends.init)
    const res = await HttpPlus.sendHttpRequest<ActiveGetCallFriendsInit>()
    if (res.status === 1) {
        activeTime.value = res.data.active_show_time
        inviteList.value = res.data.inviter_rank
        invitedList.value = res.data.invitee_rank
        sendStatus.value = res.data.active_three.rebate_status ? res.data.active_three.rebate_status : 0
        activeThree.rebate_today = res.data.active_three.rebate_today ? res.data.active_three.rebate_today : 0.0
        activeThree.total_bet = res.data.active_three.total_bet ? res.data.active_three.total_bet : 0.0
        activeThree.total_rebate = res.data.active_three.total_rebate ? res.data.active_three.total_rebate : 0.0
        if (res.data.active_three.has_mobile && typeof res.data.active_three.has_mobile === "number") {
            isBindPhone.value = Boolean(res.data.active_three.has_mobile)
        }
    }
}

const switchTab = (index: number): void => {
    phbIndex.value = 0
    tabIndex.value = index
}

const checkRecord = (tabIndex: number): void => {
    if (systemParams.isLogin) {
        router.push(`/callFriendsRecords?tab=${unref(tabIndex)}`)
    } else {
        showToast({
            className: "vk-toast-fail",
            message: "您还未登录，请登录!",
            icon: "warning"
        })
    }
}

// 姓名处理，一律展示9位，最后3位***
const nickName = (name: string): string => {
    return name.slice(0, 6) + "***"
}

/**
 * 活动页面分享功能
 */
const handleToShare = (): void => {
    if (!systemParams.isLogin) {
        showToast({ className: "vk-toast-fail", message: "请您先登录", icon: "warning" })
        return
    }
    router.push("/seo")
}

init()
</script>

<template>
    <div class="font-classic leading-relaxed">
        <HeaderBar>
            <div class="header_title">迎新唤友</div>
        </HeaderBar>
        <div class="expand-page CallFriends">
            <div class="bbg"></div>
            <div class="flag"></div>
            <div class="left-hero"></div>
            <div class="right-hero"></div>
            <div class="left-smoke"></div>
            <div class="right-smoke"></div>
            <div class="mask"></div>
            <div class="page-title"></div>
            <div class="page-content">
                <div class="tab-wrapper">
                    <div
                        @click="switchTab(index)"
                        :class="{ 'active-tab': tabIndex == index }"
                        class="tab"
                        v-for="(item, index) in tabInfo"
                        :key="index"
                    >
                        {{ item.text }}
                    </div>
                </div>
                <!-- 活动内容 -->
                <div class="table-block hdnr">
                    <div class="rect"></div>
                    <div class="main-title">活动时间</div>
                    <div class="main-time">{{ activeTime }}</div>
                    <div class="main-title">活动内容</div>
                    <template v-if="tabIndex == 0">
                        <div class="t-desc">
                            VKGAME用户使用个人中心 --
                            推广/分享里的专属推广链接或邀请码，通过QQ、论坛、贴吧、微博等方式分享，成功邀请好友即可获得现金奖励！
                        </div>
                        <div class="record-title" @click="checkRecord(0)">查看我的推广记录</div>
                        <div class="schd-table">
                            <table border="0" align="center" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>
                                            推荐新用户
                                            <br />
                                            首存金额
                                        </th>
                                        <th>
                                            可获得
                                            <br />
                                            推荐礼金
                                        </th>
                                        <th>流水要求</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>≥100</td>
                                        <td class="gold">8元</td>
                                        <td rowspan="6" style="line-height: 1.4">
                                            全站1倍
                                            <br />
                                            有效流水
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>≥1000</td>
                                        <td class="gold">38元</td>
                                    </tr>
                                    <tr>
                                        <td>≥5000</td>
                                        <td class="gold">58元</td>
                                    </tr>
                                    <tr>
                                        <td>≥10000</td>
                                        <td class="gold">88元</td>
                                    </tr>
                                    <tr>
                                        <td>≥50000</td>
                                        <td class="gold">388元</td>
                                    </tr>
                                    <tr>
                                        <td>≥100000</td>
                                        <td class="gold">888元</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </template>
                    <template v-if="tabIndex == 1">
                        <div class="t-desc">
                            活动期间，通过您的推广链接进行注册，并达到周累计存款要求，您和受邀请人均可获得该累计存款金额 1%
                            的新人奖励，最高单周可获得
                            <span class="gold bold">88888</span>
                            元哦！
                        </div>
                        <div class="record-title" @click="checkRecord(1)">查看我的推广记录</div>
                        <div class="zc-table">
                            <table border="0" align="center" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>
                                            邀请人
                                            <br />
                                            等级要求
                                        </th>
                                        <th>
                                            周累计
                                            <br />
                                            存款
                                        </th>
                                        <th>
                                            邀请人
                                            <br />
                                            比例
                                        </th>
                                        <th>
                                            受邀请
                                            <br />
                                            人比例
                                        </th>
                                        <th>
                                            礼金
                                            <br />
                                            上限
                                        </th>
                                        <th>
                                            流水
                                            <br />
                                            要求
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1~2级</td>
                                        <td>≥5000元</td>
                                        <td class="gold" rowspan="6">1%</td>
                                        <td class="gold" rowspan="6">1%</td>
                                        <td class="gold">88元</td>
                                        <td rowspan="6" style="line-height: 1.4">
                                            全站
                                            <br />
                                            1倍
                                            <br />
                                            有效
                                            <br />
                                            流水
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>3~5级</td>
                                        <td>≥10000元</td>
                                        <td class="gold">188元</td>
                                    </tr>
                                    <tr>
                                        <td>6~7级</td>
                                        <td>≥50000元</td>
                                        <td class="gold">388元</td>
                                    </tr>
                                    <tr>
                                        <td>8~9级</td>
                                        <td>≥100000元</td>
                                        <td class="gold">888元</td>
                                    </tr>
                                    <tr>
                                        <td>10~11级</td>
                                        <td>≥500000元</td>
                                        <td class="gold">8888元</td>
                                    </tr>
                                    <tr>
                                        <td>12级</td>
                                        <td>≥1000000元</td>
                                        <td class="gold">88888元</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </template>
                    <template v-if="tabIndex == 2">
                        <div class="t-desc">
                            活动期间，邀请人可获得每个好友从其注册时间开始计算
                            <span class="gold bold">15</span>
                            天的有效投注额
                            <span class="gold bold">0.15%</span>
                            的返利，无上限。
                        </div>
                        <div class="record-title" @click="checkRecord(2)">查看我的推广记录</div>
                        <div class="fl-wrapper">
                            <div class="fl-block">
                                <div class="fl-title">近15天好友投注总额</div>
                                <div class="money">
                                    <MoneySplit showSuffix suffix="元" :amount="activeThree.total_bet" />
                                </div>
                            </div>
                            <div class="fl-block">
                                <div class="fl-title" v-if="sendStatus == 0">累计待派返利</div>
                                <div class="fl-title" v-if="sendStatus == 1">今日可派返利</div>
                                <div class="fl-title" v-if="sendStatus == 2">今日已派返利</div>
                                <div class="money gold">
                                    <MoneySplit showSuffix suffix="元" :amount="activeThree.rebate_today" />
                                </div>
                            </div>
                            <div class="fl-block">
                                <div class="fl-title">最近15天累计返利</div>
                                <div class="money gold">
                                    <MoneySplit showSuffix suffix="元" :amount="activeThree.total_rebate" />
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="btn share-btn" @click="handleToShare">立即分享</div>
                    <div v-if="!isBindPhone && tabIndex == 2" @click="$router.push('/usersafety')" class="fl-tip gold">
                        您还未绑定手机号, 去绑定>>
                    </div>
                </div>
                <!-- 邀请榜单 -->
                <div class="table-block phb">
                    <div class="rect"></div>
                    <div class="tab-up">
                        <div class="btn tab-label" :class="{ 'label-active': isInvitePhb }" @click="phbIndex = 0">
                            邀请人派奖排行榜
                        </div>
                        <div class="btn tab-label" :class="{ 'label-active': !isInvitePhb }" @click="phbIndex = 1">
                            受邀请人派奖排行榜
                        </div>
                    </div>
                    <div class="in" v-if="isInvitePhb" key="one">
                        <div class="pd-block" v-for="(item, index) in inviteList.slice(0, 3)" :key="index">
                            <div class="btn" :class="`jb-icon-${index}`"></div>
                            <div class="detail">
                                <div class="line">
                                    <div class="gold">用户名：</div>
                                    <div class="yq-name">{{ nickName(item.username) }}</div>
                                    <div class="gold spera">奖金：</div>
                                    <div>{{ formatNumberSplit(item?.bonus) }}元</div>
                                </div>
                                <div class="line">
                                    <div class="gold">注册时间：</div>
                                    <div class="yq-name">{{ item.register_date }}</div>
                                    <div class="gold spera">推荐人数：</div>
                                    <div>{{ item.invite_count }}</div>
                                </div>
                            </div>
                        </div>
                        <template v-if="!inviteList.length">
                            <div class="pd-block" v-for="index in 3" :key="index">
                                <div class="btn" :class="`jb-icon-${index - 1}`"></div>
                                <div class="detail">
                                    <div class="line">
                                        <div class="gold">用户名：</div>
                                        <div class="no-display">abcdef</div>
                                        <div class="gold spera">奖金：</div>
                                        <div class="no-display">0.00元</div>
                                    </div>
                                    <div class="line">
                                        <div class="gold">注册时间：</div>
                                        <div class="no-display">2022年06月</div>
                                        <div class="gold spera">推荐人数：</div>
                                        <div class="no-display">0</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="ed" v-else key="two">
                        <div class="pd-block" v-for="(item, index) in invitedList.slice(0, 3)" :key="index">
                            <div class="btn" :class="`jb-icon-${index}`"></div>
                            <div class="detail">
                                <div class="line">
                                    <div class="gold">用户名：</div>
                                    <div class="yq-name">{{ nickName(item.username) }}</div>
                                    <div class="gold spera">奖金：</div>
                                    <div>{{ formatNumberSplit(item.bonus) }}元</div>
                                </div>
                                <div class="line line-placeholder">
                                    <div class="gold">注册时间：</div>
                                </div>
                            </div>
                        </div>
                        <template v-if="!invitedList.length">
                            <div class="pd-block" v-for="index in 3" :key="index">
                                <div class="btn" :class="`jb-icon-${index - 1}`"></div>
                                <div class="detail">
                                    <div class="line">
                                        <div class="gold">用户名：</div>
                                        <div class="no-display">abcdef</div>
                                        <div class="gold spera">奖金：</div>
                                        <div class="no-display">0.00元</div>
                                    </div>
                                    <div class="line line-placeholder">
                                        <div class="gold">注册时间：</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="phb-table" v-if="isInvitePhb" key="three">
                        <table border="0" align="center" cellspacing="0" width="100%">
                            <thead>
                                <tr>
                                    <th>排名</th>
                                    <th>用户名</th>
                                    <th>推荐人数</th>
                                    <th>奖金</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in inviteList.slice(3, 10)" :key="index">
                                    <td>No.{{ index + 4 }}</td>
                                    <td>{{ nickName(item.username) }}</td>
                                    <td>{{ item.invite_count }}</td>
                                    <td class="gold">
                                        <MoneySplit showSuffix suffix="元" :amount="item?.bonus" />
                                    </td>
                                </tr>
                                <template v-if="!inviteList.length">
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td class="gold text-right">暂无</td>
                                        <td class="gold text-left">数据</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    <div class="phb-table invited-table" v-else key="four">
                        <table border="0" align="center" cellspacing="0" width="100%">
                            <thead>
                                <tr>
                                    <th>排名</th>
                                    <th>用户名</th>
                                    <th>奖金</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in invitedList.slice(3, 10)" :key="index">
                                    <td>No.{{ index + 4 }}</td>
                                    <td>{{ nickName(item?.username) }}</td>
                                    <td class="gold">
                                        <MoneySplit showSuffix suffix="元" :amount="item?.bonus" />
                                    </td>
                                </tr>
                                <template v-if="!invitedList.length">
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td class="gold">暂无数据</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    <div class="phb-tip text-#bf9854 mt-10px text-12px">
                        排行榜按
                        <span v-if="phbIndex == 0">日</span>
                        <span v-else>周</span>
                        更新，展示最近30天获礼金最高前十名VIP会员
                    </div>
                </div>
                <!-- 推广攻略 -->
                <Desc v-if="tabIndex == 0" />
                <!-- 活动规则 -->
                <Rules :tab="tabIndex" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "callfriends.scss";
@keyframes float {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-0.12rem);
    }
    100% {
        transform: translateY(0);
    }
}
@keyframes smokeLeft {
    0% {
        transform: translateX(0.2rem);
    }
    50% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(0.2rem);
    }
}
@keyframes smokeRight {
    0% {
        transform: translateX(1.2rem);
    }
    50% {
        transform: translateX(1.4rem);
    }
    100% {
        transform: translateX(1.2rem);
    }
}
.CallFriends {
    width: 100%;
    position: relative;
    overflow-x: hidden;
    background: linear-gradient(to top, #181840, #3a2842);
}
.bbg {
    pointer-events: none;
    width: 100%;
    height: calc(100vh - 0.44rem);
    background: url("@/assets/img/active/invitefriends/banner/bg.png") no-repeat center top;
    background-size: contain;
    position: absolute;
    top: 0;
}
.flag {
    pointer-events: none;
    width: 100%;
    height: calc(100vh - 0.44rem);
    background: url("@/assets/img/active/invitefriends/banner/flag.png") no-repeat center top;
    background-size: contain;
    position: absolute;
    top: 0;
}
.fl-tip {
    font-size: 0.13rem;
    text-decoration: underline;
    cursor: pointer;
    margin-top: 0.1rem;
}
.left-hero {
    pointer-events: none;
    width: 100%;
    height: calc(100vh - 0.44rem);
    background: url("@/assets/img/active/invitefriends/banner/left-hero.png") no-repeat center top;
    background-size: contain;
    position: absolute;
    top: 0;
    animation: float 4.8s linear infinite;
}
.right-hero {
    pointer-events: none;
    width: 100%;
    height: calc(100vh - 0.44rem);
    background: url("@/assets/img/active/invitefriends/banner/right-hero.png") no-repeat center top;
    background-size: contain;
    position: absolute;
    top: 0;
    animation: float 4.8s linear infinite;
}
.left-smoke {
    pointer-events: none;
    width: 100%;
    height: calc(100vh - 0.44rem);
    background: url("@/assets/img/active/invitefriends/banner/left-smoke.png") no-repeat center top;
    background-size: contain;
    position: absolute;
    top: 0;
    left: 0;
    animation: smokeLeft 4.8s linear infinite;
}
.right-smoke {
    pointer-events: none;
    width: 100%;
    height: calc(100vh - 0.44rem);
    background: url("@/assets/img/active/invitefriends/banner/right-smoke.png") no-repeat center -0.19rem;
    background-size: contain;
    position: absolute;
    top: 0;
    right: 0;
    transform: translateX(1.2rem);
    animation: smokeRight 4.8s linear infinite;
}
.mask {
    pointer-events: none;
    width: 100%;
    height: calc(100vh - 0.44rem);
    position: absolute;
    top: 0;
    background-image: linear-gradient(to top, #302341, rgba(255, 255, 255, 0));
}

.fl-wrapper {
    .fl-block {
        margin-top: 0.1rem;
        width: 3.21rem;
        border: solid 0.01rem #bf9854;
        &:first-child {
            margin-top: 0;
        }
        .fl-title {
            width: 100%;
            line-height: 0.25rem;
            color: #0a0f24;
            font-size: 0.14rem;
            font-weight: bold;
            height: 0.25rem;
            background-image: linear-gradient(to right, #ac905c, #f5d394);
        }
        .money {
            color: #fff;
            font-size: 0.15rem;
            padding-top: 0.1rem;
            padding-bottom: 0.1rem;
            .demi {
                transform-origin: 0 0.18rem;
                font-size: 0.15rem;
            }
            .yuan {
                margin-left: 0.06rem;
            }
        }
    }
}

.page-title {
    pointer-events: none;
    width: 100%;
    height: calc(100vh - 0.44rem);
    background: url("@/assets/img/active/invitefriends/banner/title.png") no-repeat center top;
    background-size: contain;
    position: absolute;
    top: 0;
}
.page-content {
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    padding-top: 2.43rem;
    padding-left: 0.15rem;
    padding-right: 0.15rem;
    padding-bottom: 0.3rem;
    .tab-wrapper {
        display: flex;
        justify-content: space-between;
        height: 0.87rem;
        width: 100%;
        .tab {
            cursor: pointer;
            user-select: none;
            width: 1.11rem;
            height: 0.57rem;
            background-image: url("@/assets/img/active/invitefriends/tab-btn.png");
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            text-align: center;
            line-height: 0.42rem;
            color: #0a0f24;
            font-size: 0.12rem;
            font-weight: bold;
        }
        .active-tab {
            background-image: url("@/assets/img/active/invitefriends/tab-btn-active.png");
            color: #fff;
            font-size: 0.16rem;
        }
    }
}

.main-time {
    color: #fff;
    font-size: 0.15rem;
}
.record-title {
    color: #b8995e;
    font-size: 0.15rem;
    text-decoration: underline;
    margin-top: 0.02rem;
    margin-bottom: 0.08rem;
    cursor: pointer;
}
table {
    border-top: #3f3834 0.01rem solid;
    border-right: #3f3834 0.01rem solid;
    box-sizing: border-box;
}
table th {
    border-left: #3f3834 0.01rem solid;
    border-bottom: #3f3834 0.01rem solid;
    background-color: #bf9854;
    height: 0.47rem;
    font-size: 0.15rem;
    color: #171d30;
    box-sizing: border-box;
}
table td {
    border-left: #3f3834 0.01rem solid;
    border-bottom: #3f3834 0.01rem solid;
    line-height: 0.36rem;
    font-size: 0.12rem;
    color: #ffffff;
    box-sizing: border-box;
}
.schd-table {
    width: 3.21rem;
    table {
        th {
            width: 33.3333%;
        }
        td {
            width: 33.3333%;
        }
    }
}
.zc-table {
    width: 3.21rem;
}

.share-btn {
    margin-top: 0.15rem;
    width: 1.2rem;
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.15rem;
    background-image: url("@/assets/img/active/invitefriends/btn.jpg");
    &:hover {
        background-image: url("@/assets/img/active/invitefriends/btn-active.jpg");
    }
}
.phb {
    .tab-up {
        display: flex;
        justify-content: center;
        margin-top: 0.21rem;
        .tab-label {
            width: 1.6rem;
            height: 0.42rem;
            background-size: contain;
            line-height: 0.42rem;
            color: rgba(184, 153, 94, 0.6);
            font-size: 0.14rem;
            font-weight: bold;
            background-image: url("@/assets/img/active/invitefriends/label.jpg");
            background-position: center;
            background-repeat: no-repeat;
        }
        .label-active {
            background-image: url("@/assets/img/active/invitefriends/label-active.jpg");
            color: #fff;
            font-size: 0.16rem;
        }
    }
    .pd-block {
        margin: 0.12rem auto 0;
        width: 3.2rem;
        display: flex;
        border-bottom: 0.01rem solid #bf9854;
        padding-bottom: 0.11rem;
        .detail {
            margin-left: 0.05rem;
            min-height: 0.15rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 0.12rem;
            color: #fff;
            .line {
                display: flex;
                white-space: nowrap;
                div {
                    min-width: 0.64rem;
                    text-align: left;
                    max-width: 0.7rem;
                    // text-overflow: ellipsis;
                    overflow: hidden;
                    line-height: 0.224rem;
                }
                .yq-name {
                    width: 0.62rem;
                    min-width: 0.5rem;
                }
                .gold {
                    font-size: 0.14rem;
                    text-align: right;
                    width: 0.7rem;
                }
                .spera {
                    margin-left: 0.1rem;
                }
            }
            .line-placeholder {
                opacity: 0;
            }
        }
        &:last-child {
            border: none;
        }
        .jb-icon-0 {
            width: 0.41rem;
            height: 0.5rem;
            background: url("@/assets/img/active/invitefriends/1.png") no-repeat center;
            background-size: 100% 100%;
        }
        .jb-icon-1 {
            width: 0.41rem;
            height: 0.5rem;
            background: url("@/assets/img/active/invitefriends/2.png") no-repeat center;
            background-size: 100% 100%;
        }
        .jb-icon-2 {
            width: 0.41rem;
            height: 0.5rem;
            background: url("@/assets/img/active/invitefriends/3.png") no-repeat center;
            background-size: 100% 100%;
        }
    }
    .phb-table {
        width: 3.2rem;
        table {
            border-left: #3f3834 0.01rem solid;
            border-bottom: #3f3834 0.01rem solid;
        }
        table th {
            width: 25%;
            border-bottom: none;
            &:first-of-type {
                border-left: none;
            }
        }
        table td {
            line-height: 0.36rem;
            height: 0.36rem;
            width: 25%;
            border: none;
        }
        table tbody tr:nth-of-type(2n + 1) {
            background: #13182a;
        }
    }
    .invited-table {
        table th {
            width: 33.3333%;
        }
        table td {
            width: 33.3333%;
        }
    }
}
</style>
