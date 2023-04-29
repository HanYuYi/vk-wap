<script setup lang="ts">
import RegressTemplate from "./RegressTemplate.vue"
import ApiSetting from "@/api/service"
import { ref, computed } from "vue"
import { useSysStore } from "@/stores/system"
import { showToast } from "vant"
import { BaseActiveStruct } from "@/api/pojo/BaseStruct"
import type { ActiveGetChessCardsFirstRechargeInit } from "@/api/pojo/active/ActiveGetChessCardsFirstRechargeInit"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

const LOGIN_TABLE = [
    { first: "Lv1", second: "8" },
    { first: "Lv2", second: "18" },
    { first: "Lv3", second: "38" },
    { first: "Lv4", second: "58" },
    { first: "Lv5", second: "88" },
    { first: "Lv6", second: "188" },
    { first: "Lv7", second: "388" },
    { first: "Lv8", second: "588" },
    { first: "Lv9", second: "888" },
    { first: "Lv10", second: "1,088" },
    { first: "Lv11", second: "1,288" },
    { first: "Lv12", second: "1,688" }
]

const NAV_MENU = [
    { key: "login", type: 1, name: "回归登录礼包" },
    { key: "firstdepo", type: 2, name: "回归首存送" },
    { key: "againdepo", type: 3, name: "回归再存加码" }
]

const FIRST_TABLE = [
    { first: "≥500", second: "38" },
    { first: "≥1,000", second: "58" },
    { first: "≥3,000", second: "88" },
    { first: "≥5,000", second: "188" },
    { first: "≥10,000", second: "388" },
    { first: "≥50,000", second: "888" },
    { first: "≥100,000", second: "1,888" }
]

const SECOND_TABLE = [
    { first: "≥500", second: "38" },
    { first: "≥1,000", second: "58" },
    { first: "≥3,000", second: "88" },
    { first: "≥5,000", second: "188" },
    { first: "≥10,000", second: "388" },
    { first: "≥50,000", second: "888" },
    { first: "≥100,000", second: "1,888" }
]
const LOGIN_TABLE_TITLE = [{ label: "等级需求" }, { label: "回归彩金(￥)" }, { label: "流水要求" }]

const FIRST_TABLE_TITLE = [{ label: "首存金额(￥)" }, { label: "返利彩金(￥)" }, { label: "流水要求" }]

const AGAIN_TABLE_TITLE = [{ label: "再存金额(￥)" }, { label: "返利彩金(￥)" }, { label: "流水要求" }]

const loading = computed<boolean>(() => {
    return btnLoading.value || initLoading.value
})

// 状态： 0  可领   1 已领取 2 未达到领取条件 *** 其他状态
type ItemType = Pick<ActiveGetChessCardsFirstRechargeInit, "status" | "status_tips"> & { error_tips?: string }

class ActiveGetRegressInit extends BaseActiveStruct {
    regress_login: ItemType

    first_deposit: ItemType

    second_deposit: ItemType
}

const initData = ref<ActiveGetRegressInit | null>(null)

const initLoading = ref(false)

const activeType = ref(1)

const returnLoginStatus = ref<ItemType>({
    status: 0,
    status_tips: ""
})
const returnFirstStatus = ref<ItemType>({
    status: 0,
    status_tips: ""
})
const returnSecondStatus = ref<ItemType>({
    status: 0,
    status_tips: ""
})

// 领取奖励
const btnLoading = ref(false)

const getBonus = async (): Promise<void> => {
    if (!systemParams.isLogin) {
        showToast({
            className: "vk-toast-fail",
            message: "请您先登录",
            icon: "warning"
        })
    } else {
        btnLoading.value = true
        try {
            HttpPlus.setUrlOptions(ApiSetting.active.regress.join)
            const res = await HttpPlus.sendHttpRequest<{}, { type: number }>({ type: activeType.value })
            btnLoading.value = false
            if (res.status === 1) {
                if (activeType.value === 1) {
                    returnLoginStatus.value.status = 1
                }
                if (activeType.value === 2) {
                    returnFirstStatus.value.status = 1
                }
                if (activeType.value === 3) {
                    returnSecondStatus.value.status = 1
                }
                showToast({
                    className: "vk-toast-success",
                    message: res.message,
                    icon: "checked"
                })
                init()
            }
        } catch (error: unknown) {
            btnLoading.value = false
            console.error(error)
        }
    }
}

const init = async (): Promise<void> => {
    if (initLoading.value) {
        return
    }
    systemParams.PageLoading = true
    initLoading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.active.regress.init)
        const res = await HttpPlus.sendHttpRequest<ActiveGetRegressInit>()
        initLoading.value = false
        systemParams.PageLoading = false
        if (res.status === 1 && res.data) {
            initData.value = res.data
            returnLoginStatus.value = res.data.regress_login
            returnFirstStatus.value = res.data.first_deposit
            returnSecondStatus.value = res.data.second_deposit
        }
    } catch (error: unknown) {
        initLoading.value = false
        systemParams.PageLoading = false
        console.error(error)
    }
}

init()
</script>

<template>
    <div class="font-classic leading-relaxed bg-#e8f1ef">
        <HeaderBar>
            <div class="header_title">王者归来 再创传奇</div>
        </HeaderBar>

        <div class="expand-page regress-page">
            <div class="nav-wrapper flex-center">
                <div
                    :data-text="item.name"
                    @click="activeType = item.type"
                    :class="[`nav-tab-${item.key}`, { 'nav-tab-active': item.type === activeType }]"
                    class="nav-tab"
                    v-for="(item, i) in NAV_MENU"
                    :key="i + item.key"
                >
                    <span class="tab-name">{{ item.name }}</span>
                    <span class="light"><i></i></span>
                </div>
            </div>
            <Transition name="fade" mode="out-in">
                <div v-if="activeType === 1" key="login">
                    <regress-template
                        :class="{
                            'login-dis-temp': returnLoginStatus.status === 2 && systemParams.isLogin
                        }"
                        :btn-status="returnLoginStatus.status"
                        :btnLoading="loading"
                        :active-type="activeType"
                        :table-title="LOGIN_TABLE_TITLE"
                        :table-data="LOGIN_TABLE"
                        :activeTime="initData?.active_show_time"
                        @getbonus="getBonus"
                    >
                        <template #desc>
                            <span>威客电竞回馈老会员，现老会员回归后可免费申请对应VIP等级彩金，机会不可错过，赶快领取啦~</span>
                        </template>
                        <template #rowspan>
                            <td rowspan="12">
                                3倍
                                <br />
                                全站有效流水
                            </td>
                        </template>

                        <div v-if="returnLoginStatus.status === 2 && systemParams.isLogin" class="regress-desc text-center">
                            您不符合回归玩家领取条件
                        </div>
                        <template #gz>
                            <ol>
                                <li>
                                    老会员判定标准：
                                    <br />
                                    -最近30天无存款，无投注，且周期前(30天前)历史累计存款≥2,000元或累计有效投注≥5,000元;
                                    <br />
                                    例如：用户申请时间为9月1日，则用户需在8月2日-8月31日期间无存款，无投注，并且在8月2日之前历史累计存款≥2,000元或累计有效投注≥5,000元。
                                </li>
                                <li>
                                    此活动礼金每位符合条件的用户，在每个活动周期内仅可领取一次；活动更新周期为：从用户回归时算起满6个月重置，VIP等级以会员领取时的等级进行计算。
                                </li>
                                <li>
                                    符合条件的每位老会员，需自行在本优惠活动页面里点击“立即申请”按钮，彩金成功领取后，系统将会自动派发且添加至用户的主钱包中；并需要完成此活动规定的3倍全站有效流水。
                                </li>
                                <li>
                                    电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                                    <span
                                        class="text-#0ee9e5 underline"
                                        @click="
                                            () => {
                                                systemParams.ActiveMoreRules.classname = 'regress'
                                                systemParams.ActiveMoreRules.isShow = true
                                            }
                                        "
                                    >
                                        查看详情
                                    </span>
                                    。
                                </li>
                                <li>
                                    每位有效玩家、每个手机号码、电子邮箱、IP地址、每张银行卡、每台设备只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利；VKGAME对本活动保有最终解释权。
                                </li>
                            </ol>
                        </template>
                    </regress-template>
                </div>
                <div v-else-if="activeType === 2" key="first">
                    <regress-template
                        :btn-status="returnFirstStatus.status"
                        :btnLoading="loading"
                        :active-type="activeType"
                        :table-title="FIRST_TABLE_TITLE"
                        :table-data="FIRST_TABLE"
                        :activeTime="initData?.active_show_time"
                        @getbonus="getBonus"
                    >
                        <template #desc>
                            <span>活动期间，回归老会员完成首存≥500元，可申请对应档位的彩金，最高可领1,888元。</span>
                        </template>
                        <template #rowspan>
                            <td rowspan="7">
                                (本金+彩金)x5
                                <br />
                                全站有效流水
                            </td>
                        </template>
                        <template #gz>
                            <ol>
                                <li>
                                    老会员判定标准：
                                    <br />
                                    -最近30天无存款，无投注，且周期前(30天前)历史累计存款≥2,000元或累计有效投注≥5,000元;
                                    <br />
                                    例如：用户申请时间为9月1日，则用户需在8月2日-8月31日期间无存款，无投注，并且在8月2日之前历史累计存款≥2,000元或累计有效投注≥5,000元。
                                </li>
                                <li>
                                    此活动礼金每位符合条件的用户，在每个活动周期内仅可领取一次；活动更新周期为：从用户回归时算起满6个月重置；每日未发起提款前的存款都视为首充。
                                </li>
                                <li>
                                    符合条件的老会员存款后可在本优惠活动页面上点击“立即领取”
                                    按钮，系统将自动判定该会员自活动开始后的最近一笔有效存款，对应的彩金将自动添加至用户的主钱包中；会员在申请此优惠时，账户主钱包余额需
                                    ≥ 最近的一笔存款金额。
                                </li>
                                <li>
                                    此活动不与召回类、首存、复存活动共享彩金需完成活动规定（存款本金+彩金）x5倍的全站有效流水，当会员钱包余额≤原钱包余额且无未结算注单时，系统将自动判定已完成活动规定的有效流水。
                                </li>
                                <li>此活动领取当天不与平台的其它首存类活动共享，每位会员每日仅可申请一次首存活动。</li>
                                <li>
                                    电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                                    <span
                                        class="text-#0ee9e5 underline"
                                        @click="
                                            () => {
                                                systemParams.ActiveMoreRules.classname = 'regress'
                                                systemParams.ActiveMoreRules.isShow = true
                                            }
                                        "
                                    >
                                        查看详情
                                    </span>
                                    。
                                </li>
                                <li>
                                    每位有效玩家、每个手机号码、电子邮箱、IP地址、每张银行卡、每台设备只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利；VKGAME对本活动保有最终解释权。
                                </li>
                            </ol>
                        </template>
                    </regress-template>
                </div>
                <div v-else-if="activeType === 3" key="second">
                    <regress-template
                        :btn-status="returnSecondStatus.status"
                        :btnLoading="loading"
                        :active-type="activeType"
                        :table-title="AGAIN_TABLE_TITLE"
                        :table-data="SECOND_TABLE"
                        :activeTime="initData.active_show_time"
                        @getbonus="getBonus"
                    >
                        <template #desc>
                            <span>活动期间，回归老会员完成再存≥500元，可申请对应档位的彩金，最高可领1888元。</span>
                        </template>
                        <template #rowspan>
                            <td rowspan="7">
                                (本金+彩金)x12
                                <br />
                                全站有效流水
                            </td>
                        </template>
                        <template #gz>
                            <ol>
                                <li>
                                    老会员判定标准：
                                    <br />
                                    -最近30天无存款，无投注，且周期前(30天前)历史累计存款≥2,000元或累计有效投注≥5,000元;
                                    <br />
                                    例如：用户申请时间为9月1日，则用户需在8月2日-8月31日期间无存款，无投注，并且在8月2日之前历史累计存款≥2,000元或累计有效投注≥5,000元。
                                </li>
                                <li>
                                    此活动礼金每位符合条件的用户，在每个活动周期内仅可领取一次；活动更新周期为：从用户回归时算起满6个月重置。
                                </li>
                                <li>
                                    符合条件的老会员再存≥500元，可在本优惠活动页面上点击“立即领取”
                                    按钮，彩金成功领取后，对应的彩金将自动添加至用户的主钱包中。
                                </li>
                                <li>
                                    彩金需完成活动规定（存款本金+彩金）x12倍的全站有效流水，当会员钱包余额≤原钱包余额且无未结算注单时，系统将自动判定已完成活动规定的有效流水。
                                </li>
                                <li>此活动领取当天不与平台的其它再存类活动共享，每位会员每日仅可申请一次再存活动。</li>
                                <li>
                                    电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                                    <span
                                        class="text-#0ee9e5 underline"
                                        @click="
                                            () => {
                                                systemParams.ActiveMoreRules.classname = 'regress'
                                                systemParams.ActiveMoreRules.isShow = true
                                            }
                                        "
                                    >
                                        查看详情
                                    </span>
                                    。
                                </li>
                                <li>
                                    每位有效玩家、每个手机号码、电子邮箱、IP地址、每张银行卡、每台设备只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利；VKGAME对本活动保有最终解释权。
                                </li>
                            </ol>
                        </template>
                    </regress-template>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "regress.scss";
@keyframes light {
    0% {
        left: -1.2rem;
    }

    25% {
        left: 1.3rem;
    }

    100% {
        left: 1.3rem;
    }
}
.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    transform: translateY(0.2rem);
    opacity: 0;
}
.regress-page {
    background-image: url("@/assets/img/active/general/regress/banner.png"), linear-gradient(0deg, #00b0ba, #4592bc 82%, #4592bc);
    background-position: center top;
    background-repeat: no-repeat;
    background-size: 100% auto;
    padding: 1.87rem 0.145rem 0.41rem;
    font-size: 0.14rem;
    color: #fff;
    .nav-tab {
        margin-bottom: 0.22rem;
        cursor: pointer;
        user-select: none;
        width: 1.135rem;
        height: 0.34rem;
        background: url("@/assets/img/active/general/regress/nav-bg.png") no-repeat center;
        background-size: contain;
        line-height: 0.34rem;
        text-align: center;
        font-size: 0.13rem;
        font-weight: bold;
        color: #eefaff;
        text-shadow: 0.0015rem 0.005rem 0.03rem #002935;
        margin-right: 0.015rem;
        position: relative;
        overflow: hidden;

        &.nav-tab-login {
            .light {
                i {
                    animation: light 2.5s 1s linear infinite;
                }
            }
        }

        &.nav-tab-firstdepo {
            .light {
                i {
                    animation: light 2.5s 1.5s linear infinite;
                }
            }
        }

        &.nav-tab-againdepo {
            .light {
                i {
                    animation: light 2.5s 2s linear infinite;
                }
            }
        }

        .light {
            cursor: pointer;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;

            i {
                position: absolute;
                left: -1.2rem;
                top: 0;
                width: 1.135rem;
                height: 100%;
                transform: skewx(-25deg);
                background-image: linear-gradient(
                    269deg,
                    rgba(255, 219, 157, 0),
                    rgba(255, 255, 255, 0.15),
                    rgba(255, 219, 157, 0)
                );
            }
        }

        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url("@/assets/img/active/general/regress/nav-active-bg.png") no-repeat;
            background-size: contain;
            background-position-x: -1.135rem;
            transition: background 0.3s ease;
        }
        &::after {
            position: absolute;
            content: attr(data-text);
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transform: translateY(35%);
            transition: 0.25s ease-out;
        }
        span {
            position: relative;
            &.tab-name {
                transition: 0.75s 0.1s cubic-bezier(0.19, 1, 0.22, 1);
            }
        }

        &:last-child {
            margin-right: 0;
        }

        &.nav-tab-active {
            &::before {
                background-position: 100% 100%;
            }
            .tab-name {
                opacity: 0;
                transform: translateY(-25%);
                transition: 0.25s ease-out;
            }

            &::after {
                opacity: 1;
                transform: translateY(0);
                transition: 0.75s 0.1s cubic-bezier(0.19, 1, 0.22, 1);
            }
        }
    }
}
</style>
