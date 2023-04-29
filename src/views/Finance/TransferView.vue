<script setup lang="ts">
import ApiSetting from "@/api/service"
import { ref, computed } from "vue"
import type { ComputedRef } from "vue"
import { useSysStore } from "@/stores/system"
import { useWalletStore } from "@/stores/wallet"
import { usePlaceImg } from "@/utils/globalImgs"
import { showConfirmDialog, showToast } from "vant"
import { useCountDown } from "@vant/use"
import type { CurrentTime } from "@vant/use"
import { HttpPlus } from "@/api/HttpPlus"
import type { IndexGetUserInfo } from "@/api/pojo/IndexGetUserInfo"
import type { DepositExchangeList } from "@/api/pojo/DepositExchangeList"

const { lazyLogo } = usePlaceImg()

const walletStore = useWalletStore()
const systemParams = useSysStore()

// 是否开启了一键转入
const oneKeyChecked = computed<boolean>(() => {
    if (systemParams.isLogin && "wallet_onekey_status" in systemParams.userInfo) {
        return Boolean(systemParams.userInfo.wallet_onekey_status)
    }
    return false
})

const oneKeyChange = (): void => {
    const next = oneKeyChecked.value ? 0 : 1

    if (!oneKeyChecked.value) {
        showConfirmDialog({
            title: "是否开启一键转入模式？",
            message: "开启后，进入任一游戏，其它游戏余额(含主钱包)都会自动转入至该钱包。",
            className: "vk-confirm-dialog",
            width: 300
        })
            .then(() => {
                setQuicklyTransfer(next)
            })
            .catch(() => {})
    } else {
        setQuicklyTransfer(next)
    }
}

//  是否正在倒计时
const isCountDown = ref(false)

const countDown: ReturnType<typeof useCountDown> = useCountDown({
    time: 60 * 1000,
    onFinish: () => {
        isCountDown.value = false
    }
})

const countdownTime: ComputedRef<CurrentTime> = countDown.current

// 余额回收
const balanceBack = (): void => {
    if (isCountDown.value) return

    showConfirmDialog({
        message: "您确认一键回收三方余额到主账户吗？",
        className: "vk-confirm-dialog",
        width: 310
    })
        .then(async (): Promise<void> => {
            systemParams.PageLoading = true
            countDown.start()
            isCountDown.value = true
            try {
                HttpPlus.setUrlOptions(ApiSetting.user.getBackAllMoney)
                const res = await HttpPlus.sendHttpRequest()
                systemParams.PageLoading = false

                if (res.status === 1) {
                    showToast({
                        className: "vk-toast-success",
                        message: res.message,
                        icon: "checked"
                    })
                }
                walletStore.getWalletAll()
            } catch (error: unknown) {
                systemParams.PageLoading = false
                countDown.reset()
                isCountDown.value = false
                throw error
            }
        })
        .catch(() => {})
}

type WalletOneKeyStatus = Pick<IndexGetUserInfo, "wallet_onekey_status">

const setQuicklyTransfer = async (next: number): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.user.setQuicklyTransfer)
    const res = await HttpPlus.sendHttpRequest<{ is_on: IndexGetUserInfo["wallet_onekey_status"] }>({
        is_on: next
    })

    if (res.status === 1) {
        showToast({
            className: "vk-toast-success",
            message: res.message,
            icon: "checked"
        })
        systemParams.updateUserInfo<WalletOneKeyStatus>({
            wallet_onekey_status: res.data.is_on
        })
    }
}

const loadMainMoney = async (): Promise<void> => {
    systemParams.PageLoading = true
    await walletStore.getUserMoney("NM")
    systemParams.PageLoading = false
}

// 更新某个游戏钱包的余额
const reLoadGameMoney = (item: DepositExchangeList): void => {
    if (!walletStore.gameWalletList.length) {
        walletStore.getWalletAll()
    }
    walletStore.gameWalletList.forEach(async (wallet: DepositExchangeList) => {
        if (wallet.code === item.code) {
            walletStore.loadGameWalletMoney(wallet)
        }
    })
}

const types = ref(0)
const rollOutMoneyNum = ref("")
const rollInOutPopup = ref(false)
const rollOutWallet = ref<Partial<DepositExchangeList>>({})
const rollInWallet = ref<Partial<DepositExchangeList>>({})

const canUseMoney = computed<string>(() => {
    if (rollOutWallet.value.code === walletStore.mainWallet.code) {
        // 从主钱包转入
        return walletStore.userMoney.NM
    } else {
        // 从游戏钱包转出
        const curgamew: DepositExchangeList = walletStore.gameWalletList.find(
            (item: DepositExchangeList) => item.code === rollOutWallet.value.code
        )
        return curgamew ? curgamew.money : "0.00"
    }
})

// 转账金额输入
const moneyInputChange = (): void => {
    const str = rollOutMoneyNum.value.toString()
    let reg: RegExpMatchArray = str.match(/\d+\.?\d{0,2}/)
    if (reg === null) {
        rollOutMoneyNum.value = ""
        return
    } else {
        rollOutMoneyNum.value = reg[0]
    }
    if (Number(rollOutMoneyNum.value) * 100 > +canUseMoney.value * 100) {
        rollOutMoneyNum.value = canUseMoney.value
    }
}

// 全部转账
const inputAllMoney = (): void => {
    rollOutMoneyNum.value = canUseMoney.value
}

// 转出 转入按钮点击
const handleToRoll = (type: number, x: DepositExchangeList): void => {
    types.value = type
    // type==1转出  type==2 转入  x.errorcode==34046 未注册
    if ((type == 1 && (+x.money == 0 || x.getMoneyFail)) || (type == 2 && x.getMoneyFail && x.errorcode != 34046)) {
        return
    }
    rollOutMoneyNum.value = ""
    rollInOutPopup.value = true
    if (type === 1) {
        rollOutWallet.value = x
        rollInWallet.value = walletStore.mainWallet
    }
    if (type === 2) {
        rollInWallet.value = x
        rollOutWallet.value = walletStore.mainWallet
    }
}

const tranferLoading = ref(false)

// 确认转账
const doTransfer = async (): Promise<void> => {
    tranferLoading.value = true
    try {
        const params = {
            from: rollOutWallet.value.code,
            to: rollInWallet.value.code,
            money: rollOutMoneyNum.value
        }
        HttpPlus.setUrlOptions(ApiSetting.user.transferSubmit)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        tranferLoading.value = false

        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: res.message,
                icon: "checked",
                duration: 1000
            })
            rollOutMoneyNum.value = ""
            rollInOutPopup.value = false
            await loadMainMoney()
            walletStore.gameWalletList.forEach((wallet: DepositExchangeList) => {
                if (wallet.code === rollOutWallet.value.code || wallet.code === rollInWallet.value.code) {
                    walletStore.loadGameWalletMoney(wallet)
                }
            })
        }
    } catch (error) {
        tranferLoading.value = false
    }
}

walletStore.getWalletAll()
</script>

<template>
    <div class="transfer-page h-full">
        <!--主钱包-->
        <section class="main_wallet_box">
            <!--主钱包金额-->
            <div class="main_wallet_box_left">
                <div class="wallet_name">
                    <i class="wallet_icon"></i>
                    <span>主钱包</span>
                    <span class="main_wallet_box_refresh_btn" @click="loadMainMoney"></span>
                </div>
                <div class="wallet_number">
                    <MoneySplit class="font-classic" showSymbol :amount="walletStore.userMoney.NM">
                        <template #symbol>
                            <div class="currency_icon"></div>
                        </template>
                    </MoneySplit>
                </div>
            </div>
            <!--一键转入 余额回收-->
            <div>
                <span @click="oneKeyChange" class="onekey_switch" :class="{ 'switch-checked': oneKeyChecked }">
                    <span class="switch-inner">
                        <span>一键转入</span>
                    </span>
                    <span class="switch-swiper">{{ oneKeyChecked ? "开" : "关" }}</span>
                </span>
                <div class="onekey_switch balance_back" :class="{ countcown_color: isCountDown }" @click="balanceBack">
                    {{ isCountDown ? countdownTime.seconds + "S" : "余额回收" }}
                </div>
            </div>
        </section>
        <!--各个钱包-->
        <section class="game_wallet_list">
            <div class="game_wallet_list_box" v-for="(item, index) in walletStore.gameWalletExceptMain" :key="index">
                <div class="game_icon">
                    <img
                        v-lazy="{
                            src: item?.icon,
                            error: lazyLogo,
                            loading: lazyLogo
                        }"
                        alt=""
                    />
                </div>
                <div class="game_wallet_detail van-hairline--bottom">
                    <div class="game_wallet_info">
                        <div class="game_wallet_name">
                            {{ item?.name }}
                            <span class="wallet_refresh_btn" @click="reLoadGameMoney(item)"></span>
                        </div>
                        <!--钱包金额-->
                        <div class="game_wallet_number hstack">
                            <i v-if="item.money" class="currency_icon"></i>
                            <span v-if="item.getMoneyFail" class="wallet_error van-ellipsis">
                                {{ item.errMsg }}
                            </span>
                            <span v-else-if="item.money">
                                <MoneySplit class="font-classic" :amount="item.money" />
                            </span>
                            <span v-else>--</span>
                        </div>
                    </div>
                    <!--转出 转入-->
                    <div class="game_wallet_op">
                        <span
                            class="roll_out_btn"
                            :class="{ no_click: item.money == 0 || item.getMoneyFail }"
                            @click="handleToRoll(1, item)"
                        >
                            转出
                        </span>
                        <span
                            class="roll_in_btn"
                            :class="{
                                no_click: item.getMoneyFail && item.errorcode != 34046
                            }"
                            @click="handleToRoll(2, item)"
                        >
                            转入
                        </span>
                    </div>
                </div>
            </div>
        </section>
        <!-- 顶部弹出 -->
        <van-popup teleport="body" v-model:show="rollInOutPopup" position="top">
            <div class="game_wallet_roll_popup">
                <!--钱包名字-->
                <div class="popup_top">
                    <div class="wallet_name fl">{{ rollOutWallet.name }}</div>
                    <div class="split fl"></div>
                    <div class="wallet_name fl">{{ rollInWallet.name }}</div>
                </div>
                <!--转账金额-->
                <div class="wallet_roll_input_box">
                    <div class="box_title leading-relaxed">转账金额</div>
                    <div class="input_box van-hairline--bottom">
                        <img class="money_icon" src="@/assets/img/template/july/finance/icon-yuan.png" alt="" />
                        <input type="number" v-model="rollOutMoneyNum" v-on:input="moneyInputChange" />
                    </div>
                    <div class="wallet_roll_tips">
                        可用金额￥{{ canUseMoney }}，
                        <span @click="inputAllMoney">全部转账</span>
                    </div>
                </div>
                <!--确认转账-->
                <div class="mt-25px">
                    <van-button
                        :disabled="!rollOutMoneyNum || Number(rollOutMoneyNum) === 0"
                        :loading="tranferLoading"
                        @click="doTransfer"
                        class="button_primary_2022 rounded-30px! border-none h-30px! leading-30px! font-bold"
                        rounded
                        block
                        native-type="submit"
                    >
                        确认转账
                    </van-button>
                </div>

                <div class="first_deposit_box" v-if="types == 2 && rollInWallet.first_transfer_is_show == 1">
                    <router-link :to="rollInWallet.first_transfer_href">
                        <i>{{ rollInWallet.first_transfer_tips }}</i>
                        ⇒
                    </router-link>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<style lang="scss" scoped>
.transfer-page {
}

.onekey_switch {
    width: 0.82rem;
    height: 0.25rem;
    box-sizing: border-box;
    border-radius: 0.12rem;
    vertical-align: middle;
    border: 1px solid #7c839f;
    background-color: #262933;
    position: relative;
    user-select: none;
    transition: all 0.2s ease-in-out;
    display: inline-block;
    font-size: 0.12rem;
    line-height: 0.25rem;
    color: #7c839f;
    outline: none;
    &.balance_back {
        text-align: center;
        display: block;
        margin-top: 0.08rem;
        color: #fff;
        &.countcown_color {
            color: #7c839f;
        }
    }
    .switch-inner {
        position: absolute;
        left: 0.28rem;
    }
    .switch-swiper {
        box-sizing: border-box;
        width: 0.26rem;
        height: 0.26rem;
        border-radius: 50%;
        line-height: 0.26rem;
        text-align: center;
        background-color: #fff;
        position: absolute;
        left: -0.01rem;
        top: -0.01rem;
        transition: left 0.2s ease-in-out, width 0.2s ease-in-out;
    }
    &.switch-checked {
        border-color: #07f1b7;
        background-color: #07f1b7;
        color: #333745;
        .switch-swiper {
            left: 0.55rem;
        }
        .switch-inner {
            left: 0.06rem;
        }
    }
}

.game_wallet_list {
    height: calc(100% - 1rem);
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 0;
    padding-top: 0.2rem;
    box-sizing: border-box;
    .game_wallet_list_box {
        display: flex;
        height: 1rem;
        justify-content: flex-start;
        &:last-child {
            .game_wallet_detail {
                &:after {
                    display: none;
                }
            }
        }
        .game_icon {
            width: 19%;
            height: 100%;
            text-align: center;
            display: flex;
            align-items: center;
            padding-right: 0.2rem;
            box-sizing: border-box;
            img {
                display: inline-block;
                width: 100%;
                height: auto;
            }
        }
        .game_wallet_detail {
            width: 81%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
            .game_wallet_info {
                font-weight: bold;
                .game_wallet_name {
                    color: #7c839f;
                    height: 0.3rem;
                    line-height: 0.3rem;
                    display: flex;
                    align-items: center;
                    font-size: 0.2rem;
                    .wallet_refresh_btn {
                        display: inline-block;
                        width: 0.22rem;
                        height: 0.22rem;
                        margin-left: 0.05rem;
                        background: url("@/assets/img/template/july/finance/btn-refresh-normal.png") no-repeat center;
                        background-size: contain;
                    }
                    &:active {
                        .wallet_refresh_btn {
                            background: url("@/assets/img/template/july/finance/btn-refresh-pressed.png") no-repeat center;
                            background-size: contain;
                        }
                    }
                }
                .game_wallet_number {
                    height: 0.3rem;
                    font-size: 0.2rem;
                    .currency_icon {
                        display: inline-block;
                        width: 0.14rem;
                        height: 0.14rem;
                        background: url("@/assets/img/template/july/finance/icon-yuan.png") no-repeat center;
                        background-size: contain;
                        margin-right: 0.06rem;
                    }
                    .wallet_error {
                        font-size: 0.14rem;
                        color: #c6cfdb;
                        max-width: 1.4rem;
                        display: inline-block;
                    }
                    .num {
                        .float {
                            font-size: 0.18rem;
                        }
                    }
                }
            }
            .game_wallet_op {
                height: 0.3rem;
                display: flex;
                span {
                    margin-left: 0.08rem;
                    width: 0.56rem;
                    text-align: center;
                    height: 100%;
                    line-height: 0.3rem;
                    font-size: 0.16rem;
                    box-sizing: border-box;
                    border-radius: 0.16rem;
                    &.roll_out_btn {
                        border: 1px solid #7c839f;
                        color: #000;
                    }
                    &.roll_in_btn {
                        font-weight: bold;
                        background: linear-gradient(to right, #07e9f1, #07f1b7);
                    }
                    &.roll_out_btn,
                    &.roll_in_btn {
                        &.no_click {
                            color: #c6cfdb;
                            border: 1px solid #c6cfdb;
                            background: none;
                        }
                    }
                }
            }
        }
    }
}

.game_wallet_roll_popup {
    box-sizing: border-box;
    padding: 0.4rem 0.3rem;
    background-color: #262933;
    color: #fff;
    .fl {
        float: left;
    }
    .popup_top {
        font-size: 0.24rem;
        height: 0.3rem;
        line-height: 0.3rem;
        .wallet_name {
            width: 45%;
            font-size: 0.2rem;
            text-align: center;
        }
        .split {
            width: 10%;
            height: 100%;
            background: url("@/assets/img/template/july/finance/icon-transfer.png") no-repeat center center;
            background-size: 0.22rem 0.13rem;
        }
    }
    .wallet_roll_input_box {
        margin-top: 0.3rem;
        .box_title {
            font-size: 0.16rem;
        }
        .input_box {
            height: 0.42rem;
            display: flex;
            align-items: center;
            font-size: 0.16rem;
            .money_icon {
                width: 0.08rem;
                margin-right: 0.06rem;
            }
            input {
                flex: auto;
            }
        }
    }
    .wallet_roll_tips {
        margin-top: 0.02rem;
        font-size: 12px;
        height: 0.24rem;
        line-height: 0.24rem;
        color: #7c839f;
        span {
            line-height: normal;
            color: #07f1b7;
        }
    }
    .vk_comfire_btn {
        font-weight: bold;
    }
    .first_deposit_box {
        height: 0.2rem;
        line-height: 0.2rem;
        margin-top: 0.1rem;
        font-size: 0.14rem;
        a {
            i {
                text-decoration: underline;
                font-size: 0.12rem;
            }
        }
    }
}
</style>
