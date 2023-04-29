<template>
    <div class="my_page">
        <HeaderBar />
        <PullRefresh @on-refresh="onRefresh">
            <div class="user_home pb-60px" v-if="isShowPage">
                <!--用户信息-->
                <section class="relative w-full h-120px pt-22px pl-14px pr-16px">
                    <template v-if="systemParams.isLogin">
                        <div class="drawer_top hstack justify-between">
                            <div class="hstack">
                                <AvatarCircle :width="64" :imgWidth="60" class="avatar" />
                                <div class="ml-15px">
                                    <div class="hstack">
                                        <div class="text font-robot van-ellipsis">
                                            {{ systemParams.userInfo.nickname }}
                                        </div>
                                        <div class="icon-edit" @click="router.push('/userinfoset')"></div>
                                    </div>
                                    <div v-if="systemParams.userInfo.specific_sign" class="desc mt-2px! van-ellipsis">
                                        {{ systemParams.userInfo.specific_sign }}
                                    </div>
                                    <div class="vip mt-4px" :class="`vip${systemParams.userInfo.user_lever}`"></div>
                                </div>
                            </div>
                            <SignButton class="h-34px pr-14px pl-10px" />
                        </div>
                    </template>
                    <template v-else>
                        <div class="drawer_top hstack" @click="router.push('/login')" v-if="!systemParams.isLogin">
                            <img class="w-64px h-64px" :src="GrayAvatar" alt="" />
                            <div class="ml-15px">
                                <div class="text">登录/注册</div>
                                <div class="desc">登录威客电竞，更多精彩等着您！</div>
                            </div>
                        </div>
                    </template>
                </section>
                <!-- 钱包 -->
                <section v-if="systemParams.isLogin" class="user_home_wallet px-15px w-full mb-14px hstack justify-between">
                    <div class="money-wrapper">
                        <div class="top-line hstack justify-between">
                            <div class="text">主钱包余额</div>
                            <div class="desc" @click="router.push('/finance')">
                                <div>我的账户</div>
                                <div class="icon-right-arrow"></div>
                            </div>
                        </div>
                        <div class="bottom-line hstack">
                            <div class="wallet-icon money-icon"></div>
                            <MoneySplit :amount="walletStore.userMoney.NM" />
                        </div>
                    </div>
                    <div class="money-wrapper">
                        <div class="top-line hstack justify-between">
                            <div class="text">V币余额</div>
                            <div class="desc" @click="router.push(`/tradingrecord?type=0`)">
                                <div>查看明细</div>
                                <div class="icon-right-arrow"></div>
                            </div>
                        </div>
                        <div class="bottom-line hstack">
                            <div class="wallet-icon vb-icon"></div>
                            <MoneySplit :amount="walletStore.userVbMoney" :diglen="0" />
                        </div>
                    </div>
                </section>
                <!--V富通钱包-->
                <section v-if="systemParams.isLogin" class="rich-pay">
                    <div class="rp-top hstack justify-between">
                        <div class="rp-title">V富通钱包</div>
                        <div class="rp-desc">
                            已获得
                            <span>{{ walletStore.richpayInitData.wallet_info.lottery_chance }}</span>
                            次抽奖机会
                        </div>
                    </div>
                    <div class="hstack">
                        <div class="rp-left">
                            <div class="wallet-title">总资产</div>
                            <MoneySplit :amount="walletStore.richpayInitData.wallet_info.total_balance" />
                        </div>
                        <div class="line"></div>
                        <div class="rp-right flex">
                            <div class="year-rate-block">
                                <div class="wallet-title">
                                    年利率
                                    <div
                                        :class="{
                                            'icon-rate-long':
                                                walletStore.richpayInitData.wallet_info.coupon_value.toString().length > 2
                                        }"
                                        class="icon-rate"
                                        v-if="walletStore.richpayInitData.wallet_info.coupon_value"
                                    >
                                        <span>X{{ walletStore.richpayInitData.wallet_info.coupon_value }}</span>
                                    </div>
                                </div>
                                <div class="rate-text font-robot">{{ walletStore.richpayInitData.wallet_info.year_show }}%</div>
                            </div>
                            <div class="bonus-block yet-bonus-block">
                                <div class="wallet-title">未提利息</div>
                                <MoneySplit :amount="walletStore.richpayInitData.wallet_info.interest_balance" />
                            </div>
                            <div class="bonus-block done-bonus-block">
                                <div class="wallet-title">已提利息</div>
                                <MoneySplit :amount="walletStore.richpayInitData.wallet_info.total_income" />
                            </div>
                        </div>
                    </div>
                    <div class="rich-pay-btn primary-btn van-haptics-feedback" @click="$router.push('/richpay')">
                        查看更多收益及抽奖
                    </div>
                </section>
                <!-- 功能区 -->
                <section class="relative px-15px">
                    <div class="func-wrapper" v-for="(block, index) in finalData" :key="index">
                        <div class="func-title">{{ block.bigtitle }}</div>
                        <div class="flex flex-wrap">
                            <div @click="jump(item)" class="block-area" v-for="(item, m) in block.list" :key="m + 'item'">
                                <div class="icon" :class="[`icon-${item.classname}`]">
                                    <Badge
                                        :num="systemParams.msgCount"
                                        v-if="item.classname == 'message' && systemParams.isLogin && systemParams.msgCount"
                                    />
                                    <Badge
                                        :num="systemParams.taskCount.package_count"
                                        v-if="
                                            item.classname == 'package' &&
                                            systemParams.isLogin &&
                                            systemParams.taskCount.package_count
                                        "
                                    />
                                    <Badge
                                        :disable="systemParams.taskCount.finish === 0"
                                        :num="systemParams.taskCount.count"
                                        v-if="item.classname == 'task' && systemParams.isLogin && systemParams.taskCount.count"
                                    />
                                </div>
                                <div class="name">{{ item.title }}</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PullRefresh>
    </div>
</template>

<script setup lang="ts">
import { useSysStore } from "@/stores/system"
import { useWalletStore } from "@/stores/wallet"
import { useFreshStore } from "@/stores/fresh"
import { useRouter } from "vue-router"
import { computed, ref, onMounted } from "vue"
import { usePlaceImg } from "@/utils/globalImgs"
import Badge from "@/components/Badge.vue"
const systemParams = useSysStore()
const walletStore = useWalletStore()
const freshStore = useFreshStore()
const router = useRouter()

const { GrayAvatar } = usePlaceImg()

// 屏幕往下滚动时，header背景由透明变为不透明
window.onscroll = () => {
    systemParams.headBgColorOpacity = window.scrollY / 80
}

const centerLink = ref([
    {
        bigtitle: "资金管理",
        list: [
            { title: "充值", url: "/finance/deposit", classname: "deposit" },
            { title: "转账", url: "/finance", classname: "transfer" },
            { title: "提现", url: "/finance/withdraw", classname: "withdraw" },
            { title: "收款账户", url: "/bankcard", classname: "userbank" }
        ]
    },
    {
        bigtitle: "我的应用",
        list: [
            { title: "饰品红包", url: "/roll", classname: "roll" },
            { title: "任务中心", url: "/task", classname: "task" },
            { title: "V币商城", url: "/vbmarket", classname: "vbmarket" },
            { title: "我的背包", url: "/package", classname: "package" },
            { title: "交易记录", url: "/tradingrecord", classname: "tradingrecord" },
            { title: "消息公告", url: "/messages", classname: "message" },
            { title: "兑换码", url: "/redeemcode", classname: "redeemcode" }
        ]
    },
    {
        bigtitle: "热门推荐",
        list: [
            { title: "优惠活动", url: "/discovery", classname: "active" },
            { title: "推广分享", url: "/seo", classname: "seo" },
            { title: "合作加盟", url: "/jointly", classname: "join" },
            { title: "我的代理", url: "", classname: "proxy", tag: "href" },
            { title: "设置", url: "/setting", classname: "setting" }
        ]
    }
])

const proxyUrl = computed(() => (systemParams.userInfo.proxy_href ? systemParams.userInfo.proxy_href + "&gfrom=wap" : ""))

const finalData = computed(() => {
    if (systemParams.isLogin && systemParams.userInfo.user_type === 2 && systemParams.userInfo.proxy_href) {
        return centerLink.value.map((item, i) => {
            if (i === 2) {
                const list = item.list.filter((ele) => ele.classname !== "join")
                return { bigtitle: item.bigtitle, list }
            } else {
                return item
            }
        })
    }
    return centerLink.value.map((item, i) => {
        if (i === 2) {
            const list = item.list.filter((ele) => ele.classname !== "proxy")
            return { bigtitle: item.bigtitle, list }
        } else {
            return item
        }
    })
})

const jump = (item: any) => {
    if (item.tag === "href" && item.classname === "proxy" && proxyUrl.value) {
        location.href = proxyUrl.value
    } else {
        if (item.url === "/messages") {
            router.push(`${item.url}/?id=1`)
        } else {
            router.push(item.url)
        }
    }
}

const onRefresh = async () => {
    try {
        await init()
        freshStore.refreshLoading = false
    } catch (error) {
        freshStore.refreshLoading = false
    }
}

const isShowPage = ref(false)
const init = async () => {
    isShowPage.value = false
    await systemParams.getUserInfo()
    if (systemParams.isLogin) {
        walletStore.loadMoney("NM")
        walletStore.getRichpayData()
        systemParams.getMsgCount()
        systemParams.loadTaskCount()
    }
    isShowPage.value = true
}

onMounted(() => {
    init()
})
</script>

<style lang="scss" scoped>
@import "@/assets/style/vip.scss";

@mixin boxstyle() {
    box-shadow: 0 2px 6px 0 rgba(52, 166, 202, 0.05);
    border: solid 1px #d8e1e0;
    border-radius: 8px;
}
.my_page {
    width: 100%;
    min-height: 100vh;
    min-height: calc(var(--vh) * 100);
    background: url("@/assets/img/template/july/my/bg.png") no-repeat left top;
    background-size: contain;
}
.user_home {
    :deep(.sign-text) {
        line-height: 34px;
    }
    .drawer_top {
        .text {
            color: var(--vk-primary-text-color);
            font-size: 16px;
            line-height: 1.13;
            font-weight: bold;
            max-width: 160px;
        }

        .desc {
            margin-top: 8px;
            color: var(--vk-desc-text-color);
            font-size: 12px;
            line-height: 1.5;
            max-width: 180px;
        }
        .icon-edit {
            margin-left: 10px;
            width: 18px;
            height: 18px;
            background: url("@/assets/img/template/july/my/icon-edit.png") no-repeat center;
            background-size: contain;
        }
    }
    .user_home_wallet {
        .icon-right-arrow {
            width: 10px;
            height: 10px;
            background: url("@/assets/img/template/july/my/icon-right-arrow.png") no-repeat center;
            background-size: contain;
            margin-left: 2px;
        }
        .money-wrapper {
            @include boxstyle();
            width: 165.5px;
            padding: 13px 12px 13px 14px;

            .bottom-line {
                margin-top: 9px;
            }
        }
        .text {
            color: var(--vk-third-text-color);
            font-size: 13px;
            font-weight: bold;
            line-height: 1.5;
            margin-left: 1.5px;
        }

        .desc {
            line-height: 1.6;
            color: var(--vk-light-text-color);
            font-size: 12px;
            display: flex;
            align-items: center;
        }

        .MoneySplit {
            font-size: 20px;
            font-weight: 900;
            line-height: 1.2;
            color: var(--vk-primary-text-color);
        }
        .wallet-icon {
            width: 20px;
            height: 20px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin-right: 3px;
        }

        .money-icon {
            background-image: url("@/assets/img/template/july/my/money-icon.png");
        }

        .vb-icon {
            background-image: url("@/assets/img/template/july/my/vb-icon.png");
        }
    }
    .func-wrapper {
        @include boxstyle();
        width: 343px;
        min-height: 124px;
        padding: 14px 0 20px;
        line-height: 1;
        margin-bottom: 14px;
        .func-title {
            font-size: 16px;
            color: var(--vk-primary-text-color);
            font-weight: bold;
            width: 100%;
            padding: 0 16px;
            box-sizing: border-box;
        }

        .block-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 25%;
            margin-top: 27px;

            &:nth-child(1) {
                margin-top: 22px;
            }

            &:nth-child(2) {
                margin-top: 22px;
            }

            &:nth-child(3) {
                margin-top: 22px;
            }

            &:nth-child(4) {
                margin-top: 22px;
            }

            .name {
                font-size: 12px;
                color: var(--vk-name-color);
                margin-top: 10px;
            }

            .icon {
                position: relative;
                width: 30px;
                height: 30px;
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;

                .vk-badge-wrapper {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    margin: 0;

                    &.vk-badgefull {
                        right: -17px;
                    }

                    &.vk-badge-wide {
                        right: -7px;
                    }
                }

                &.icon-deposit {
                    background-image: url("@/assets/img/template/july/my/icon-deposit.png");
                }

                &.icon-transfer {
                    background-image: url("@/assets/img/template/july/my/icon-transfer.png");
                }

                &.icon-withdraw {
                    background-image: url("@/assets/img/template/july/my/icon-withdraw.png");
                }

                &.icon-userbank {
                    background-image: url("@/assets/img/template/july/my/icon-userbank.png");
                }

                &.icon-roll {
                    background-image: url("@/assets/img/template/july/my/icon-roll.png");
                }

                &.icon-roll {
                    background-image: url("@/assets/img/template/july/my/icon-roll.png");
                }

                &.icon-task {
                    background-image: url("@/assets/img/template/july/my/icon-task.png");
                }

                &.icon-redeemcode {
                    background-image: url("@/assets/img/template/july/my/icon-redeemcode.png");
                }

                &.icon-message {
                    background-image: url("@/assets/img/template/july/my/icon-message.png");
                }

                &.icon-package {
                    background-image: url("@/assets/img/template/july/my/icon-package.png");
                }

                &.icon-active {
                    background-image: url("@/assets/img/template/july/my/icon-active.png");
                }

                &.icon-vbmarket {
                    background-image: url("@/assets/img/template/july/my/icon-vbmarket.png");
                }

                &.icon-tradingrecord {
                    background-image: url("@/assets/img/template/july/my/icon-tradingrecord.png");
                }

                &.icon-seo {
                    background-image: url("@/assets/img/template/july/my/icon-seo.png");
                }

                &.icon-setting {
                    background-image: url("@/assets/img/template/july/my/icon-setting.png");
                }

                &.icon-join {
                    background-image: url("@/assets/img/template/july/my/icon-join.png");
                }

                &.icon-proxy {
                    background-image: url("@/assets/img/template/july/my/icon-proxy.png");
                }
            }
        }
    }
}

.rich-pay {
    @include boxstyle();
    width: 343px;
    margin: 0 auto 14px;
    padding: 14px 16px 20px;
    .MoneySplit {
        font-size: 14px;
        font-weight: 600;
        line-height: 1;
        color: var(--vk-primary-text-color);
    }

    .bonus-block {
        margin-left: 25px;

        &.yet-bonus-block {
            .MoneySplit {
                color: #ff6600;
            }
        }

        &.done-bonus-block {
            .MoneySplit {
                color: rgba(48, 64, 58, 0.8);
            }
        }
    }

    .year-rate-block {
        margin-left: 17px;
    }

    .wallet-title {
        font-size: 12px;
        color: var(--vk-light-text-color);
        line-height: 1;
        margin-bottom: 14px;
        position: relative;

        .icon-rate {
            position: absolute;
            box-sizing: border-box;
            padding-left: 0.02rem;
            top: 0;
            left: 0.38rem;
            width: 0.18rem;
            height: 0.12rem;
            background: url("@/assets/img/template/july/my/icon-rate.png") no-repeat center;
            background-size: cover;
            color: #ffffff;
            &.icon-rate-long {
                padding-left: 0.008rem;
                left: 0.37rem;
                width: 0.24rem;
                border-radius: 0.02rem;
                span {
                    transform: scale(0.7);
                }
            }
            span {
                display: inline-block;
                transform: scale(0.8);
            }
        }
    }

    .rate-text {
        font-size: 12px;
        line-height: 1.17;
        color: rgba(48, 64, 58, 0.8);
        font-weight: bold;
    }

    .rp-top {
        margin-bottom: 26px;
    }

    .rp-left {
        width: 94px;
    }

    .rp-right {
        flex: 1;
    }

    .line {
        width: 1px;
        height: 40px;
        background: rgba(179, 182, 181, 0.35);
    }

    .rp-title {
        font-size: 16px;
        font-weight: bold;
        line-height: 1;
        color: var(--vk-primary-text-color);
    }

    .rp-desc {
        font-size: 0.12rem;
        line-height: 1;
        color: var(--vk-light-text-color);

        span {
            color: var(--vk-primary-green);
            font-family: Roboto;
        }
    }

    .rich-pay-btn {
        margin: 20px auto 0;
        width: 311px;
        height: 40px;
        box-sizing: border-box;
        border-radius: 20px;
        box-shadow: 0 1px 3px 0 rgba(25, 226, 188, 0.25);
        line-height: 40px;
        font-size: 12px;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
    }
}
</style>
