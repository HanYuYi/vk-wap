<script setup lang="ts">
import { formatNumberSplit } from "@/utils/numberUtils"
import ApiSetting from "@/api/service"
import { ref, computed, onBeforeMount, watch } from "vue"
import { useSysStore } from "@/stores/system"
import { useWalletStore } from "@/stores/wallet"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { showToast } from "vant"
import Banner from "./Banner.vue"
import TableDesc from "./TableDesc.vue"
import DialogRewardlist from "./Dialog/DialogRewardlist.vue"
import DialogRate from "./Dialog/DialogRate.vue"
import VirtualTutorial from "./VirtualTutorial.vue"
import DialogStoreExtras from "./Dialog/DialogStoreExtras.vue"
import DialogLottery from "./Dialog/DialogLottery.vue"
import DialogInterest from "./Dialog/DialogInterest.vue"
import Advantage from "./Advantage.vue"
import BonusStep from "./BonusStep.vue"
import Doubt from "./Doubt.vue"
import type { RichPayLottery } from "@/api/pojo/RichPayLottery"
import { HttpPlus } from "@/api/HttpPlus"
import type { RichPayGetPrizeList } from "@/api/pojo/RichPayGetPrizeList"
import type { RichPayTransferOutToMain } from "@/api/pojo/RichPayTransferOutToMain"

const router: Router = useRouter()
const systemParams = useSysStore()
const walletStore = useWalletStore()

const loading = ref(false)
const moneyout = ref("")
const show = ref(false)

const DIALOG_STATUS_LIST = [
    { code: "", classStr: "", title: "" },
    { code: "showRateDio", classStr: "richpay-rate-diolog", title: "V富通VIP年利率" },
    { code: "showRewardlist", classStr: "richpay-reward-diolog", title: "我的中奖记录" },
    { code: "showTransferOut", classStr: "richpay-transferout-diolog", title: "转出至主钱包" },
    { code: "showOpenInterest", classStr: "richpay-inter-diolog", title: "未提利息" },
    { code: "showTransferGift", classStr: "richpay-trangift-diolog", title: "V富通转账红包" },
    { code: "showLottery", classStr: "richpay-lottery-diolog", title: "恭喜获得" },
    { code: "showStoreExtras", classStr: "richpay-storeextras-diolog", title: "存放额外加码" }
] as const

type DialogStatusList = typeof DIALOG_STATUS_LIST[number]

const dialogStatus = ref<DialogStatusList["code"]>("")

const transferoutLoading = ref(false)

export type RecordsPage = {
    currentPage: number
    maxPage: number
    page_size: number
    records: RichPayGetPrizeList["list"]
}
const recordsPage = ref<RecordsPage>({
    currentPage: 1,
    maxPage: 20,
    page_size: 4,
    records: []
})

watch(show, (val?: boolean) => {
    if (val) {
        if (dialogStatus.value === "showRewardlist") {
            getAwardRecords()
        }
    }
})

// 打开年利率弹窗
const openrate = (): void => {
    dialogStatus.value = "showRateDio"
    show.value = true
}

// 七天收益
const getSevenInterest = computed(() => {
    if (moneyout.value === null || moneyout.value === "") {
        return formatNumberSplit(0)
    }
    let num = walletStore.richpayInitData.wallet_info.richpay_seven_day_rate * Number(moneyout.value)
    return formatNumberSplit(num)
})

const richpayDioClass = computed<DialogStatusList["classStr"]>(() => {
    return DIALOG_STATUS_LIST.find((item) => item.code === dialogStatus.value).classStr
})

// 标题
const titleInDio = computed<DialogStatusList["title"]>(() => {
    return DIALOG_STATUS_LIST.find((item) => item.code === dialogStatus.value).title
})

// 存放款额外加码
const storeextras = (): void => {
    dialogStatus.value = "showStoreExtras"
    show.value = true
}

// 抽奖
const lotteryData = ref<RichPayLottery | {}>({})

const richPaylottery = async (): Promise<void> => {
    if (loading.value) return

    loading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.richPaylottery)
        const res = await HttpPlus.sendHttpRequest<RichPayLottery>()
        loading.value = false

        if (res.status === 1) {
            walletStore.getRichpayData()
            lotteryData.value = res.data
            dialogStatus.value = "showLottery"
            show.value = true
        }
    } catch (error: unknown) {
        loading.value = false
        throw error
    }
}
// 奖品放入背包 或 使用奖品
const richPaySavePrize = async (type: number): Promise<void> => {
    if (loading.value) return

    loading.value = true
    try {
        const params = {
            type,
            id: "coupon_id" in lotteryData.value ? lotteryData.value.coupon_id : ""
        }

        HttpPlus.setUrlOptions(ApiSetting.richPaySavePrize)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        loading.value = false

        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: res.message,
                icon: "checked"
            })
            show.value = false
            if (type === 2) {
                walletStore.getRichpayData()
            }
        }
    } catch (error: unknown) {
        loading.value = false
        throw error
    }
}

// 提取利息
const richPayWithdrawInterest = async (type: number): Promise<void> => {
    if (loading.value) return

    // 余额是否足够
    if (type && walletStore.richpayInitData.wallet_info.interest_balance < 1) {
        showToast({
            className: "vk-toast-fail",
            message: "转入V富通钱包需要1元起哦~",
            icon: "warning"
        })
        return
    }
    // V富通是否被锁定
    if (walletStore.richpayInitData.wallet_is_lock) {
        showToast({
            className: "vk-toast-fail",
            message: "您的V富通钱包被锁定，如有疑问请联系客服",
            icon: "warning"
        })
        return
    }
    loading.value = true
    try {
        const params = {
            type,
            money: Number(walletStore.richpayInitData.wallet_info.interest_balance)
        }

        HttpPlus.setUrlOptions(ApiSetting.richPayWithdrawInterest)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        loading.value = false

        if (res.status === 1) {
            walletStore.getRichpayData()
            walletStore.getUserMoney("NM")
            showToast({
                className: "vk-toast-success",
                message: res.message,
                icon: "checked"
            })
            show.value = false
        }
    } catch (error: unknown) {
        loading.value = false
        throw error
    }
}

// 转账红包弹窗
type TransferOutResult = { bonus: number; money: number; plusFees: RichPayTransferOutToMain["plus_bonus"] }

const transferOutResult = ref<TransferOutResult | {}>({})

// 转账红包领取按钮loading
const tfgloading = ref(false)
// 转账红包状态，1：未领取，2：领取了
const transferGiftStatus = ref(1)
// 转账红包领取成功的金额
const getSuccessMoney = ref(0)

class RichPayJoinPlus {
    item_price: number
}

// 领取转账红包
const getTransferOutGift = async (): Promise<void> => {
    if (tfgloading.value) return

    tfgloading.value = true
    try {
        const params = {
            money: "money" in transferOutResult.value ? transferOutResult.value.money : 0,
            plus_fees: "plusFees" in transferOutResult.value ? transferOutResult.value.plusFees : ""
        }

        HttpPlus.setUrlOptions(ApiSetting.richPayGetjoinPlus)
        const res = await HttpPlus.sendHttpRequest<RichPayJoinPlus, typeof params>(params)
        tfgloading.value = false

        if (res.status === 1 && res.data) {
            walletStore.getRichpayData()
            walletStore.getUserMoney("NM")
            getSuccessMoney.value = res.data.item_price
            transferGiftStatus.value = 2
        }
    } catch (error: unknown) {
        tfgloading.value = false
        throw error
    }
}

// 提交转出
const submit = async (values: { moneyout: string | null }): Promise<void> => {
    const { moneyout } = values

    if (moneyout === "" || moneyout === null) {
        showToast({
            className: "vk-toast-fail",
            message: "请输入金额",
            icon: "warning"
        })
        return
    }
    // 余额是否足够
    if (
        !walletStore.richpayInitData.wallet_info.total_balance ||
        Number(moneyout) > Number(walletStore.richpayInitData.wallet_info.total_balance)
    ) {
        showToast({
            className: "vk-toast-fail",
            message: "余额不足",
            icon: "warning"
        })
        return
    }
    // 转出金额不能小于1元
    if (parseFloat(moneyout) < 1) {
        showToast({
            className: "vk-toast-fail",
            message: "转出金额不能小于1元哦",
            icon: "warning"
        })
        return
    }
    // V富通是否被锁定
    if (walletStore.richpayInitData.wallet_is_lock) {
        showToast({
            className: "vk-toast-fail",
            message: "您的V富通钱包被锁定，如有疑问请联系客服",
            icon: "warning"
        })
        return
    }
    transferoutLoading.value = true
    try {
        const params = { money: parseFloat(moneyout) }

        HttpPlus.setUrlOptions(ApiSetting.richPayTransferOutToMain)
        const res = await HttpPlus.sendHttpRequest<RichPayTransferOutToMain, typeof params>(params)
        transferoutLoading.value = false

        if (res.status === 1) {
            walletStore.getRichpayData()
            walletStore.getUserMoney("NM")

            showToast({
                className: "vk-toast-success",
                message: res.message,
                icon: "checked"
            })
            show.value = false
            if (parseFloat(res.data.plus_bonus)) {
                transferOutResult.value = {
                    bonus: parseFloat(res.data.plus_bonus),
                    plusFees: res.data.plus_fees,
                    money: parseFloat(moneyout)
                }
                show.value = false
                dialogStatus.value = "showTransferGift"
                show.value = true
            }
        }
    } catch (error: unknown) {
        transferoutLoading.value = false
        throw error
    }
}

// 获取中奖记录
const getAwardRecords = async (): Promise<void> => {
    loading.value = true
    const params = {
        page: recordsPage.value.currentPage,
        page_size: recordsPage.value.page_size
    }
    try {
        HttpPlus.setUrlOptions(ApiSetting.richPayGetPrizeList)
        const res = await HttpPlus.sendHttpRequest<RichPayGetPrizeList, typeof params>(params)
        loading.value = false

        if (res.status === 1) {
            recordsPage.value.maxPage = Math.ceil(res.data.count / 4)
            recordsPage.value.records = res.data.list
        }
    } catch (error: unknown) {
        loading.value = false
        throw error
    }
}

// 中奖记录切换页码
const recordPageChange = (num: number): void => {
    if (loading.value) {
        return
    }
    if (recordsPage.value.currentPage + num <= 0 || recordsPage.value.currentPage + num > recordsPage.value.maxPage) return
    recordsPage.value.currentPage += num
    getAwardRecords()
}

const checkLogin = (type: string): void => {
    if (loading.value) return

    if (!systemParams.isLogin) {
        showToast({
            className: "vk-toast-fail",
            message: "您还未登录，请登录",
            icon: "warning"
        })
        return
    }
    // 查看中奖记录
    if (type === "rewardlist") {
        dialogStatus.value = "showRewardlist"
        show.value = true
    }
    // 转出
    if (type === "transferOut") {
        dialogStatus.value = "showTransferOut"
        show.value = true
    }
    // 提息
    if (type === "openInterest") {
        if (walletStore.richpayInitData.wallet_info.interest_balance === 0) {
            showToast({
                className: "vk-toast-fail",
                message: "您暂时没有未提利息哦",
                icon: "warning"
            })
            return
        }
        dialogStatus.value = "showOpenInterest"
        show.value = true
    }
}

const close = (): void => {
    dialogStatus.value = ""
    recordsPage.value = {
        currentPage: 1,
        maxPage: 20,
        page_size: 4,
        records: []
    }
    transferOutResult.value = {}
    transferGiftStatus.value = 1
    getSuccessMoney.value = 0
    lotteryData.value = {}
}

onBeforeMount(async (): Promise<void> => {
    await walletStore.getRichpayData()
    if (!walletStore.richpayInitData.is_use_richpay) {
        router.replace("/")
    }
})
</script>

<template>
    <div class="richpay-page">
        <HeaderBar>
            <div class="header_title">威客V富通钱包</div>
        </HeaderBar>
        <div class="page-wrapper expand-page relative pb-30px">
            <Banner />
            <!-- 核心钱包模块 -->

            <div class="wallet-box w-345px h-279.5px m-auto z-3 relative pt-6px">
                <!-- 盈利榜 -->
                <div class="rank-show w-full h-23px text-white text-12px leading-25px px-30px overflow-hidden">
                    <van-notice-bar
                        background="transparent"
                        color="#ffffff"
                        class="h-25px! leading-25px! p-0!"
                        :scrollable="false"
                    >
                        <van-swipe
                            vertical
                            class="h-25px! leading-25px!"
                            :autoplay="3000"
                            :touchable="false"
                            :show-indicators="false"
                        >
                            <van-swipe-item v-for="(item, i) in walletStore.richpayInitData.time_to_time_records" :key="i">
                                <div class="w-285px hstack justify-between text-12px">
                                    <div>盈利榜</div>
                                    <div class="font-robot">{{ item.time }}</div>
                                    <div class="w-50px van-ellipsis font-robot">
                                        {{ item.show_username }}
                                    </div>
                                    <div>
                                        {{ item.status_cn }}
                                        <span text="#83f9fd">{{ item.amount }}</span>
                                    </div>
                                </div>
                            </van-swipe-item>
                        </van-swipe>
                    </van-notice-bar>
                </div>
                <!-- 钱包 -->
                <div class="wallet-wrapper">
                    <div class="w-86% font-bold leading-relaxed text-16px mt-23px flex justify-between ml-23px">
                        V富通钱包
                        <span class="text-15px text-#83f9fd font-normal underline" @click="checkLogin('rewardlist')">
                            中奖记录
                        </span>
                    </div>
                    <div class="w-86% ml-23px flex justify-between">
                        <div>
                            <div class="leading-relaxed">总资产</div>
                            <MoneySplit
                                class="leading-normal"
                                showSymbol
                                :amount="walletStore.richpayInitData.wallet_info.total_balance"
                            />
                        </div>
                        <div class="text-center">
                            <div class="leading-relaxed">今日剩余红利额度</div>
                            <MoneySplit
                                class="text-#83f9fd leading-normal"
                                showSymbol
                                :amount="walletStore.richpayInitData.last_bonus"
                            />
                        </div>
                        <div class="text-right">
                            <div class="leading-relaxed">七日预期收益</div>
                            <MoneySplit
                                class="leading-normal"
                                showSymbol
                                :amount="walletStore.richpayInitData.wallet_info.seven_day_ideal_income"
                            />
                        </div>
                    </div>
                    <div class="ml-23px hstack mt-8px">
                        <RouterLink class="v-btn" to="/finance/withdraw">转入</RouterLink>
                        <a class="v-btn" @click="checkLogin('transferOut')">转出</a>
                        <RouterLink class="v-btn" to="/vrichrecord">交易明细</RouterLink>
                    </div>
                    <div class="w-86% ml-23px mt-17px flex justify-between">
                        <div>
                            <div class="leading-relaxed">未提利息</div>
                            <MoneySplit
                                class="leading-normal text-#83f9fd"
                                showSymbol
                                :amount="walletStore.richpayInitData.wallet_info.interest_balance"
                            />
                        </div>
                        <div>
                            <div class="leading-relaxed relative" @click="openrate">
                                年利率
                                <i
                                    class="relative top-1px w-15px h-15px leading-15px rounded-full inline-block ml-10px text-12px text-center border border-white"
                                >
                                    i
                                </i>
                                <b v-if="walletStore.richpayInitData.wallet_info.coupon_type" class="hot-tips font-robot">
                                    X{{ walletStore.richpayInitData.wallet_info.coupon_value }}
                                </b>
                            </div>
                            <div class="leading-normal font-robot">{{ walletStore.richpayInitData.wallet_info.year_show }}%</div>
                        </div>
                        <div>
                            <div class="leading-relaxed">已提利息</div>
                            <MoneySplit
                                class="leading-normal"
                                showSymbol
                                :amount="walletStore.richpayInitData.wallet_info.total_income"
                            />
                        </div>
                    </div>
                    <div class="w-86% ml-23px mt-5px hstack justify-between">
                        <a class="v-btn" @click="checkLogin('openInterest')">提息</a>
                        <div>
                            已获得
                            <span
                                class="font-robot"
                                :class="walletStore.richpayInitData.wallet_info.lottery_chance && 'text-#07f0bb'"
                            >
                                {{ walletStore.richpayInitData.wallet_info.lottery_chance }}
                            </span>
                            次抽奖机会
                            <span
                                class="ml-10px underline text-15px text-#83f9fd"
                                v-if="walletStore.richpayInitData.wallet_info.lottery_chance"
                                @click="richPaylottery"
                            >
                                立即抽奖
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 福利升级模块 -->
            <TableDesc @storeextras="storeextras" class="richpay_home_floor" />
            <!--虚拟币使用教程模块-->
            <VirtualTutorial class="richpay_home_floor mt-50.5px!" />
            <!--五大特点和优势轮播模块-->
            <Advantage @openrate="openrate" class="richpay_home_floor" />
            <!--获取收益步骤轮播模块-->
            <BonusStep class="richpay_home_floor mt-30.5px!" />
            <!--钱包常见问题-->
            <Doubt class="richpay_home_floor mt-30.5px!" />
        </div>
        <!-- 弹窗汇总 -->
        <van-dialog
            close-on-click-overlay
            v-model:show="show"
            :show-confirm-button="false"
            @close="close"
            class="richpay-diolog"
            :className="richpayDioClass"
        >
            <div class="close" @click="show = false"></div>
            <div class="relative text-center">
                <div class="richpay_head">{{ titleInDio }}</div>
                <div class="richpay_content">
                    <!-- 转出至主钱包 -->
                    <div class="cus-transfer-out pt-30px px-23px" v-if="dialogStatus === 'showTransferOut'">
                        <van-form class="form_box" @submit="submit">
                            <div class="line hstack">
                                <div class="currcy_icon w-8px h-13px"></div>
                                <van-field
                                    v-model="moneyout"
                                    name="moneyout"
                                    type="number"
                                    clearable
                                    maxlength="500"
                                    :placeholder="
                                        '最大可转' +
                                        formatNumberSplit(Number(walletStore.richpayInitData.wallet_info.total_balance))
                                    "
                                />
                            </div>
                            <div class="text-left text-15px text-#a1a3df leading-29px">
                                您将减少七日预期收益
                                <span text="#9de1f3">{{ getSevenInterest }}</span>
                            </div>
                            <div class="w-140px m-auto mt-67px">
                                <van-button
                                    class="richpay_btn active"
                                    :loading="transferoutLoading"
                                    :disabled="moneyout === ''"
                                    block
                                    native-type="submit"
                                >
                                    确定
                                </van-button>
                            </div>
                        </van-form>
                    </div>
                    <!-- 转账红包 -->
                    <div class="cus-transfer-out-gift" v-if="dialogStatus === 'showTransferGift'">
                        <template v-if="transferGiftStatus === 1">
                            <div class="award-img">
                                <MoneySplit
                                    class="amount"
                                    showSuffix
                                    suffix="元"
                                    :amount="'bonus' in transferOutResult && transferOutResult.bonus"
                                />
                                <small class="desc">恭喜您获得</small>
                            </div>
                            <div class="btns-group">
                                <button class="richpay_btn" @click="show = false">暂不领取</button>
                                <button class="richpay_btn active" @click="getTransferOutGift">
                                    {{ tfgloading ? "领取中..." : "立即领取" }}
                                </button>
                            </div>
                            <p class="award-notice">
                                <span>*</span>
                                领取后需完成(转出金额+彩金)1倍全站流水
                            </p>
                        </template>

                        <template v-else>
                            <div class="award-img">
                                <MoneySplit class="amount" showSuffix suffix="元" :amount="getSuccessMoney" />
                                <small class="desc">恭喜您获得</small>
                            </div>
                            <div class="btns-group justify-center!">
                                <button
                                    class="richpay_btn active"
                                    @click="
                                        () => {
                                            show = false
                                            router.push('/callfriends')
                                        }
                                    "
                                >
                                    分享领福利
                                </button>
                            </div>
                            <p class="award-notice">
                                <span>*</span>
                                彩金已转入您的主钱包
                            </p>
                        </template>
                    </div>
                    <!-- 中奖记录 -->
                    <DialogRewardlist
                        :recordsPage="recordsPage"
                        :loading="loading"
                        @recordPageChange="recordPageChange"
                        v-if="dialogStatus === 'showRewardlist'"
                    />
                    <!-- 年利率 -->
                    <DialogRate v-if="dialogStatus === 'showRateDio'" />
                    <!-- 抽奖中奖 -->
                    <DialogLottery
                        :lotteryData="lotteryData"
                        @close="show = false"
                        @richPaySavePrize="richPaySavePrize"
                        v-if="dialogStatus === 'showLottery'"
                    />
                    <!-- 提息 -->
                    <DialogInterest
                        @richPayWithdrawInterest="richPayWithdrawInterest"
                        v-if="dialogStatus === 'showOpenInterest'"
                    />
                    <!-- 存放额外加码 -->
                    <DialogStoreExtras v-if="dialogStatus === 'showStoreExtras'" />
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss" scoped>
.richpay-page {
    font-family: PingFangSC;
    color: white;
    font-size: 12px;
    :deep(.richpay_home_floor) {
        width: 3.45rem;
        margin: 0.31rem auto 0;
        position: relative;
    }
    :deep(.main) {
        .slide-fade-enter-active,
        .slide-fade-leave-active {
            transition: all 0.2s;
        }

        .slide-fade-enter-from,
        .slide-fade-leave-to {
            transform: translateY(-30px);
            opacity: 0;
        }
        .richpay_head {
            width: calc(100% + 2px);
            height: 0.4rem;
            background: url("@/assets/img/template/july/richpay/header.png") no-repeat;
            background-size: 100% 100%;
            position: relative;
            font-size: 0.16rem;
            font-weight: bold;
            line-height: 0.32rem;
            text-align: center;
            color: #fff;
            margin-left: -1px;
            &.richpay_head_collapse {
                background-image: url("@/assets/img/template/july/richpay/header_coll.png");
            }
            .fold_icon {
                display: inline-block;
                width: 0.18rem;
                height: 0.15rem;
                background: url("@/assets/img/template/july/richpay/fold_head_icon.png");
                background-size: 100% 100%;
                margin-left: 0.06rem;
                vertical-align: middle;
                transition: transform 0.2s;

                &.open {
                    transform: rotate(180deg);
                }
            }
        }

        .richpay_content {
            height: auto;
            position: relative;
            background: #232656;
            margin: 0.035rem auto 0;
            border-left: 0.5px solid #37fcff;
            border-right: 0.5px solid #37fcff;

            &:before,
            &:after {
                content: "";
                position: absolute;
                width: calc(100% + 1px);
                left: -0.4px;
            }

            &:before {
                height: 0.215rem;
                background: url("@/assets/img/template/july/richpay/dialog_top.png") no-repeat;
                background-size: 100% 100%;
                top: -0.215rem;
                z-index: 1;
            }

            &:after {
                height: 0.195rem;
                background: url("@/assets/img/template/july/richpay/dialog_bottom.png") no-repeat;
                background-size: 100% 100%;
                bottom: -0.195rem;
            }

            .richpay_btn {
                width: 1.4rem;
                height: 0.38rem;
                background: url("@/assets/img/template/july/richpay/dialog_btn.png") no-repeat;
                background-size: 100% 100%;
                font-size: 0.15rem;
                color: #fefeff;
                border: 0;
                outline: 0;

                &.active {
                    color: #9de1f3;
                    background: url("@/assets/img/template/july/richpay/dialog_btn_hover.png") no-repeat;
                    background-size: 100% 100%;
                    font-weight: bold;
                }
            }
        }
    }

    .v-btn {
        background-image: linear-gradient(90deg, #3a3db5, #3a3db5), linear-gradient(90deg, #07f1b7, #07e9f1);
        display: inline-block;
        padding: 0 15px;
        height: 0.4rem;
        border: 2px solid transparent;
        border-radius: 0.4rem;
        margin-right: 0.11rem;
        text-align: center;
        line-height: 0.36rem;
        font-size: 0.15rem;
        background-clip: padding-box, border-box;
        background-origin: padding-box, border-box;
    }
    .page-wrapper {
        background-image: url("@/assets/img/template/july/richpay/bg.jpg"), linear-gradient(to bottom, #515cac, #17136c);
        background-position: center top, left 3.95rem;
        background-repeat: no-repeat, no-repeat;
        background-size: 100% 3.985rem, 100% 100%;
        .wallet-box {
            background: url("@/assets/img/template/july/richpay/wallet.png");
            background-size: 100% 100%;
        }
        .wallet-wrapper {
            .hot-tips {
                display: block;
                position: absolute;
                width: 0.35rem;
                height: 0.15rem;
                line-height: 0.15rem;
                text-align: center;
                font-size: 0.12rem;
                color: #303441;
                left: -0.4rem;
                top: 0.02rem;
                background: url("@/assets/img/template/july/my/hot-tips.png");
                background-size: 100% 100%;
                font-weight: bold;
            }
        }
    }
}
:deep(.richpay-diolog) {
    width: 345px;
    max-width: 100vw;
    overflow: visible;
    border-radius: 3px;
    font-size: 12px;
    &.richpay-transferout-diolog {
        .richpay_content {
            height: 206.3px;
        }
    }
    .currcy_icon {
        background: url("@/assets/img/template/july/richpay/icon_cny.png");
        background-size: 100% 100%;
        margin-right: 8px;
    }

    .cus-transfer-out-gift {
        text-align: center;
        overflow: hidden;
        width: calc(100% - 0.45rem);
        margin: 0 auto;

        .award-img {
            width: 2.21rem;
            height: 1.34rem;
            margin: 0.35rem auto 0;
            background: url("@/assets/img/template/july/richpay/transfer_out_gift.png");
            background-size: 100% 100%;
            position: relative;
            overflow: hidden;

            .amount {
                position: absolute;
                width: 100%;
                top: 0.18rem;
                left: 0;
                font-size: 0.15rem;
                text-align: center;
                color: #da3d27;
                .big-num {
                    font-size: 0.21rem;
                    line-height: 0.21rem;
                }

                b {
                    font-weight: normal;
                    font-size: 0.21rem;
                    line-height: 0.21rem;
                    vertical-align: revert;
                }
            }

            .desc {
                margin-top: 1rem;
                width: 100%;
                display: block;
                font-size: 0.12rem;
                line-height: 0.12rem;
                text-align: center;
                color: #fff;
            }
        }

        .btns-group {
            margin-top: 0.23rem;
            display: flex;
            justify-content: space-between;
        }

        .award-notice {
            position: absolute;
            width: 100%;
            margin-top: 0.13rem;
            font-size: 0.15rem;
            line-height: 0.15rem;
            text-align: center;
            color: #a1a3df;
            white-space: nowrap;
            margin-left: -0.2rem;

            span {
                font-size: 24px;
                color: #83f9fd;
                margin-right: 0.05rem;
                vertical-align: -webkit-baseline-middle;
            }
        }
    }
    .cus-transfer-out {
        .form_box {
            .line {
                border-bottom: 1px solid #83f9fd;
            }
            .van-cell {
                padding: 0;
                line-height: 26px;
                background: transparent;
                input {
                    font-size: 15px;
                    color: #fff;
                    &::placeholder {
                        color: #a1a3df;
                    }
                }
            }
        }
    }
    .close {
        position: absolute;
        width: 0.15rem;
        height: 0.15rem;
        top: -0.3rem;
        right: 0.075rem;
        background: url("@/assets/img/template/july/richpay/close.png") no-repeat;
        background-size: 100% 100%;

        &:active {
            background: url("@/assets/img/template/july/richpay/close_hover.png") no-repeat;
            background-size: 100% 100%;
        }
    }
    .richpay_head {
        width: calc(100% + 2px);
        height: 0.4rem;
        background: url("@/assets/img/template/july/richpay/header.png") no-repeat;
        background-size: 100% 100%;
        position: relative;
        font-size: 0.16rem;
        font-weight: bold;
        line-height: 0.32rem;
        text-align: center;
        color: #fff;
        margin-left: -1px;
    }
    .richpay_content {
        height: 2.605rem;
        position: relative;
        background: #232656;
        margin: 0.035rem auto 0.495rem;
        border-left: 0.5px solid #37fcff;
        border-right: 0.5px solid #37fcff;
        &:before,
        &:after {
            content: "";
            position: absolute;
            width: calc(100% + 1px);
            left: -0.4px;
        }
        &:before {
            height: 0.215rem;
            background: url("@/assets/img/template/july/richpay/dialog_top.png") no-repeat;
            background-size: 100% 100%;
            top: -0.215rem;
            z-index: 1;
        }

        &:after {
            height: 0.195rem;
            background: url("@/assets/img/template/july/richpay/dialog_bottom.png") no-repeat;
            background-size: 100% 100%;
            bottom: -0.195rem;
        }

        .richpay_btn {
            width: 1.4rem;
            height: 0.38rem;
            background: url("@/assets/img/template/july/richpay/dialog_btn.png") no-repeat;
            background-size: 100% 100%;
            font-size: 0.15rem;
            color: #fefeff;
            border: 0;
            outline: 0;

            &.active {
                color: #9de1f3;
                background: url("@/assets/img/template/july/richpay/dialog_btn_hover.png") no-repeat;
                background-size: 100% 100%;
                font-weight: bold;
            }
        }
    }
}
</style>
