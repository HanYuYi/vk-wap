<script setup lang="ts">
import ApiSetting from "@/api/service"
import { ref, computed, watch, nextTick } from "vue"
import { useRoute } from "vue-router"
import type { RouteLocationNormalizedLoaded } from "vue-router"
import { usePlaceImg } from "@/utils/globalImgs"
import { useMarquee } from "@/composable/util"
import { formatNumberSplit } from "@/utils/numberUtils"
import { useSysStore } from "@/stores/system"
import { useWalletStore } from "@/stores/wallet"
import { formatterStr } from "@/composable/validate"
import { showDialog, showToast } from "vant"
import { useForm } from "@/composable/form"
import { HttpPlus } from "@/api/HttpPlus"
import type { DepositWithdraw } from "@/api/pojo/DepositWithdraw"
import type { UserBankUserBankList } from "@/api/pojo/UserBankUserBankList"

const walletStore = useWalletStore()
const systemParams = useSysStore()
const route: RouteLocationNormalizedLoaded = useRoute()
const { lazyPack140 } = usePlaceImg()
const { codeloading, isCountDown, countdownTime, handleSendVerCode } = useForm()

const focusState = ref(true)
const withdrawMoneyNum = ref("")
const withdrawBankShow = ref(false)
const showBottomType = ref("")

type WithdrawInfo = Partial<Omit<DepositWithdraw, "richpay_conf"> & { richpay_conf: DepositWithdraw["richpay_conf"] | {} }>

const withdrawInfo = ref<WithdrawInfo>({ richpay_conf: {} })

watch(withdrawMoneyNum, (val: string, oldVal: string) => {
    nextTick(() => {
        currentFastInputId.value = -1
        if (val) {
            if (Number(val) >= withdrawInfo.value.withdraw_max) {
                withdrawMoneyNum.value = withdrawInfo.value.withdraw_max.toString()
            }
            if (val.toString().indexOf(".") > 0 && val.split(".").length == 2) {
                if (val.split(".")[1].length > 2) {
                    withdrawMoneyNum.value =
                        Number(oldVal) > withdrawInfo.value.withdraw_max ? withdrawInfo.value.withdraw_max.toString() : oldVal
                }
            }
            if (Number(val) <= 0) {
                withdrawMoneyNum.value = ""
            }
        }
        const select = fastInputList.value.find((item) => item.number === Number(val))

        if (select) {
            currentFastInputId.value = select.id
        }
    })
})

const currencyType = ref(1) // 1 银行卡 2 虚拟币 3 威富通

const currentBankId = ref(0)
const withdrawBankList = ref<Array<UserBankUserBankList["banks"][number] & { accountNum: string }>>([])
const currentBank = computed(() => {
    return withdrawBankList.value[currentBankId.value]
})

watch(currentBankId, () => {
    withdrawBankShow.value = false
})

const currentvbIndex = ref(0)

const currentvb = computed<DepositWithdraw["virtualBanks"][number] | {} | undefined>(() => {
    return withdrawInfo.value?.virtualBanks ? withdrawInfo.value?.virtualBanks[currentvbIndex.value] : {}
})

const vbNum = computed<number>(() => {
    if (currentvb.value && withdrawMoneyNum.value && "id" in currentvb.value && currentvb.value.id) {
        let num: number = parseFloat(withdrawMoneyNum.value) / parseFloat(currentvb.value?.exchange_rate)
        return Math.floor(num * 10000) / 10000
    }
    return 0
})

// 取款提示
const withdrawLimitTips = computed<string>(() => {
    let tips = ""
    try {
        if (withdrawInfo.value && withdrawInfo.value.withdraw_max) {
            if (currencyType.value == 1) {
                // 银行卡
                if (withdrawInfo.value.mid_money)
                    tips = `金额 ≤ ${withdrawInfo.value.mid_money}元将产生<span class="highlight">${withdrawInfo.value.mid_fee}元手续费</span>，`
                tips += "单笔限额" + withdrawInfo.value.withdraw_min + "元至" + withdrawInfo.value.withdraw_max + "元"
            } else if (currencyType.value == 2) {
                // 虚拟币
                if (currentvb.value && "exchange_rate" in currentvb.value && withdrawInfo.value.virtualBanks.length) {
                    tips =
                        "虚拟币" +
                        currentvb.value.withdraw_virtual_min_num +
                        "起提，" +
                        "单笔限额" +
                        Math.ceil(
                            (currentvb.value.exchange_rate ? +currentvb.value.exchange_rate : 0) *
                                currentvb.value.withdraw_virtual_min_num
                        ) +
                        "元至" +
                        withdrawInfo.value.withdraw_max +
                        "元"
                } else {
                    tips =
                        "虚拟币" +
                        withdrawInfo.value.withdraw_virtual_min_num +
                        "起提，" +
                        "单笔限额" +
                        withdrawInfo.value.withdraw_virtual_min +
                        "元至" +
                        withdrawInfo.value.withdraw_max +
                        "元"
                }
            } else if ("input_tips" in withdrawInfo.value.richpay_conf && currencyType.value == 3) {
                tips = withdrawInfo.value.richpay_conf.input_tips
            }
        }
    } catch (error: unknown) {
        return tips
    }
    return tips
})

const currentFastInputId = ref(-1)

const fastInputList = computed<{ id: number; number: number }[]>(() => {
    try {
        if (currencyType.value === 1) {
            return [
                { id: 0, number: +withdrawInfo.value?.withdraw_show_min - 0 },
                { id: 1, number: withdrawInfo.value?.withdraw_show_mid - 0 },
                { id: 2, number: withdrawInfo.value?.withdraw_show_max - 0 }
            ]
        }
        if (currencyType.value === 2) {
            if (currentvb.value && "withdraw_virtual_show_min" in currentvb.value && withdrawInfo.value.virtualBanks.length) {
                return [
                    { id: 0, number: currentvb.value?.withdraw_virtual_show_min - 0 },
                    { id: 1, number: currentvb.value?.withdraw_virtual_show_mid - 0 },
                    { id: 2, number: currentvb.value?.withdraw_virtual_show_max - 0 }
                ]
            } else {
                return [
                    { id: 0, number: withdrawInfo.value?.withdraw_virtual_min - 0 },
                    { id: 1, number: withdrawInfo.value?.withdraw_virtual_min * 3 },
                    { id: 2, number: withdrawInfo.value?.withdraw_virtual_min * 5 }
                ]
            }
        }
        if ("withdraw_show_min" in withdrawInfo.value.richpay_conf && currencyType.value === 3) {
            return [
                {
                    id: 0,
                    number: withdrawInfo.value?.richpay_conf?.withdraw_show_min - 0
                },
                {
                    id: 1,
                    number: withdrawInfo.value?.richpay_conf?.withdraw_show_mid - 0
                },
                {
                    id: 2,
                    number: withdrawInfo.value?.richpay_conf?.withdraw_show_max - 0
                }
            ]
        }
    } catch (error: unknown) {
        console.error(error)
        return []
    }

    return []
})

const fastInputSelect = (item: { id: number; number: number }): void => {
    currentFastInputId.value = item.id
    withdrawMoneyNum.value = item.number.toString()
}

const vbChangeTipShow = () => {
    showDialog({
        title: "虚拟币汇率提示",
        message: "根据多个交易所当前汇率得出，因数字货币波动强烈，以实际到账数量为准。",
        messageAlign: "left",
        className: "vk-confirm-dialog xnb-confirm-dialog",
        confirmButtonText: "知道了",
        width: 300
    })
        .then(() => {})
        .catch(() => {})
}

// 提现到V富通验证
const richpayBtnLoading = ref(false)

const RichpayWithdraw = async (): Promise<void> => {
    if (!withdrawMoneyNum.value) {
        showToast({
            className: "vk-toast-fail",
            message: "请输入提款金额",
            icon: "warning"
        })
        return
    }
    // 余额是否足够
    if (
        parseFloat(withdrawInfo.value.userMoney) === 0 ||
        parseFloat(withdrawMoneyNum.value) > parseFloat(withdrawInfo.value.userMoney)
    ) {
        showToast({
            className: "vk-toast-fail",
            message: "余额不足",
            icon: "warning"
        })
        return
    }
    // 提现到V富通金额需要大于1
    if (parseFloat(withdrawMoneyNum.value) < 1) {
        showToast({
            className: "vk-toast-fail",
            message: "提现到V富通钱包需要1元起哦",
            icon: "warning"
        })
        return
    }
    // V富通是否被锁定
    if ("wallet_is_lock" in withdrawInfo.value.richpay_conf && withdrawInfo.value.richpay_conf.wallet_is_lock) {
        showToast({
            className: "vk-toast-fail",
            message: "您的V富通钱包被锁定，如有疑问请联系客服",
            icon: "warning"
        })
        return
    }

    richpayBtnLoading.value = true
    try {
        const params = {
            money: withdrawMoneyNum.value,
            money_type: 3
        }
        HttpPlus.setUrlOptions(ApiSetting.user.withdrawToRichPaySubmit)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        richpayBtnLoading.value = false

        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: res.message,
                icon: "checked"
            })
            init()
        }
    } catch (error: unknown) {
        richpayBtnLoading.value = false
        throw error
    }
}

const verCodeInputRef = ref<HTMLInputElement>(null)

// 验证码输入
const handleInput = (e: KeyboardEvent): void => {
    numberCurrentIndex.value = verCode.value.length
    if (verCode.value.length >= number.value) {
        // 输入完成隐藏键盘
        ;(document.activeElement as HTMLInputElement).blur() // ios隐藏键盘
        verCodeInputRef.value.blur() // android隐藏键盘
    }
}

const number = ref(6)
const numberCurrentIndex = ref(0)
const verCode = ref("")
const tradePassWord = ref("")
const showVerMsgCodePop = ref(false)
const withdrawLoading = ref(false)

const withdraw = async () => {
    if (+withdrawInfo.value.limitAmount > 0) {
        showToast({
            className: "vk-toast-fail",
            message: "您的流水不足",
            icon: "warning"
        })
        return
    }
    if (!withdrawMoneyNum.value) {
        showToast({
            className: "vk-toast-fail",
            message: "请输入提款金额",
            icon: "warning"
        })
        return
    }
    if (currencyType.value === 2 && !withdrawInfo.value.virtualCount) {
        // 虚拟币账户
        showToast({
            className: "vk-toast-fail",
            message: "请先添加虚拟币账户",
            icon: "warning"
        })
        return
    }
    if (!tradePassWord.value) {
        showToast({
            className: "vk-toast-fail",
            message: "请输入交易密码",
            icon: "warning"
        })
        return
    }
    if (
        parseFloat(withdrawInfo.value.todayLeftWithdraw) === 0 ||
        parseFloat(withdrawMoneyNum.value) > parseFloat(withdrawInfo.value.todayLeftWithdraw)
    ) {
        showToast({
            className: "vk-toast-fail",
            message: "余额不足",
            icon: "warning"
        })
        return
    }
    withdrawLoading.value = true

    try {
        if (withdrawInfo.value.needMsgCode) {
            showVerMsgCodePop.value = true
            verCode.value = ""
            nextTick(() => {
                verCodeInputRef.value.focus()
            })
            numberCurrentIndex.value = 0
            await handleSendVerCode(5)
            withdrawLoading.value = false
        } else {
            await handleWithdrawCheck()
            withdrawLoading.value = false
        }
    } catch (error: unknown) {
        withdrawLoading.value = false
        throw error
    }
}

const fullBankName = ref("")
const showConfirmPage = ref(false)

class DepositWithdrawCheck {
    show_full_account: string
}

const handleWithdrawCheck = async (): Promise<void> => {
    if (!verCode.value && withdrawInfo.value.needMsgCode) {
        showToast({
            className: "vk-toast-fail",
            message: "请输入手机验证码",
            icon: "warning"
        })
        return
    }
    if (currencyType.value == 1) {
        // 银行卡验证
        systemParams.PageLoading = true
        let data = {
            money: withdrawMoneyNum.value,
            bank_id: currentBank.value.id,
            password: tradePassWord.value,
            phone_verify: verCode.value
        }
        fullBankName.value = ""

        HttpPlus.setUrlOptions(ApiSetting.user.withdrawCheck)
        const res = await HttpPlus.sendHttpRequest<DepositWithdrawCheck, typeof data>(data)
        systemParams.PageLoading = false

        if (res.status === 1) {
            fullBankName.value = res.data.show_full_account || currentBank.value.show_account
            showVerMsgCodePop.value = false
            const timer = setTimeout(() => {
                clearTimeout(timer)
                showConfirmPage.value = true
            }, 300)
        }
    } else {
        // currencyType==2 虚拟币
        showVerMsgCodePop.value = false
        showConfirmPage.value = true
    }
}

const submitLoading = ref(false)

const handleWithdrawSubmit = async (): Promise<void> => {
    submitLoading.value = true
    systemParams.PageLoading = true

    const data = {
        money_type: currencyType.value,
        money: withdrawMoneyNum.value,
        password: tradePassWord.value,
        phone_verify: verCode.value
    }
    let virtualData = {}
    if (currencyType.value == 2) {
        virtualData = { virtual_money: vbNum.value }
    }
    const bankData = {
        bank_id:
            currencyType.value == 1 ? currentBank.value.id : currentvb.value && "id" in currentvb.value ? currentvb.value.id : ""
    }
    const mergeData = { ...data, ...virtualData, ...bankData }

    try {
        HttpPlus.setUrlOptions(ApiSetting.user.withdrawSubmit)
        const res = await HttpPlus.sendHttpRequest<{}, typeof mergeData>(mergeData)
        submitLoading.value = false
        systemParams.PageLoading = false

        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: res.message,
                icon: "checked"
            })
        }
        showConfirmPage.value = false
        init()
    } catch (error: unknown) {
        submitLoading.value = false
        throw error
    }
}

const loadMainMoney = async (): Promise<void> => {
    systemParams.PageLoading = true
    await walletStore.getUserMoney("NM")
    systemParams.PageLoading = false
}

// 初始化
const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.user.withdrawIndex)
    const res = await HttpPlus.sendHttpRequest<DepositWithdraw, {}>()
    systemParams.PageLoading = false

    if (res.status === 1 && res.data) {
        withdrawInfo.value = res.data

        if (withdrawInfo.value?.wallet_type.length) {
            currencyType.value = +route.query?.type || withdrawInfo.value?.wallet_type[0].bank_id || 1
        }
        walletStore.userMoney.NM = res.data.userMoney
        if (res.data.banks.length) {
            withdrawBankList.value = res.data.banks.map((bank: UserBankUserBankList["banks"][number]) => {
                const arr: string[] = bank.show_account.split("*")
                const accountNum: string = arr[arr.length - 1]
                return { ...bank, accountNum }
            })
        }
        if (res.data.virtualBanks.length) {
            withdrawInfo.value?.virtualBanks.forEach((item) => {
                item.showbankUrl = item.bank_url.substring(item.bank_url.length - 6)
            })
        }
    }
}

init()
const { marqueeDuration } = useMarquee(60)
</script>

<template>
    <div class="withdraw-page w-full h-full overflow-x-hidden overflow-y-scroll">
        <!--已绑定银行卡 已绑定手机号码 已设置交易密码-->
        <section v-show="withdrawInfo?.has_securitypwd && withdrawBankList.length > 0 && systemParams.userInfo?.tel">
            <div class="leading-20px text-12px text-#e34d12">
                {{ withdrawInfo?.msg }}
            </div>
            <!--钱包基本信息-->
            <div class="withdraw_wallet_info">
                <!--主钱包-->
                <section class="main_wallet_box van-hairline--bottom">
                    <!--主钱包金额-->
                    <div class="main_wallet_box_left">
                        <div class="wallet_name">
                            <i class="wallet_icon"></i>
                            <span>主钱包</span>
                        </div>
                        <div class="wallet_number">
                            <MoneySplit class="font-classic" showSymbol :amount="walletStore.userMoney.NM">
                                <template #symbol>
                                    <div class="currency_icon"></div>
                                </template>
                            </MoneySplit>
                        </div>
                    </div>
                    <div class="main_wallet_box_refresh_btn" @click="loadMainMoney"></div>
                </section>
                <!--可提现余额和额度-->
                <div class="withdraw_limit_info">
                    <div class="limit_box">
                        <span class="limit_title">可提现余额</span>
                        <div class="limit_number flex items-baseline text-#07f1b7!">
                            <i class="currency_icon"></i>
                            <MoneySplit
                                v-if="currencyType != 3"
                                class="font-classic"
                                :amount="withdrawInfo?.todayLeftWithdraw ?? 0"
                            />
                            <MoneySplit v-else class="font-classic" :amount="walletStore.userMoney.NM" />
                        </div>
                    </div>
                    <div v-if="currencyType != 3" class="limit_box">
                        <span class="limit_title">今日提现额度</span>
                        <div class="limit_number flex items-baseline">
                            <i class="currency_icon"></i>
                            <MoneySplit class="font-classic" :amount="withdrawInfo?.maxWithdraw ?? 0" />
                        </div>
                    </div>
                </div>
            </div>
            <!--提现金额-->
            <section class="widraw_input_box section_box">
                <div class="input_box_title">
                    提现金额
                    <span class="withdraw_tips" v-if="+withdrawInfo?.limitAmount > 0">
                        需要全站流水{{ withdrawInfo?.limitAmount }}元
                    </span>
                </div>
                <div class="input_box van-hairline--bottom">
                    <van-field
                        class="vant-input z-2 bg-transparent text-16px text-#262933 font-bold leading-24px py-10px px-2px"
                        @blur="focusState = true"
                        @focus="focusState = false"
                        v-model="withdrawMoneyNum"
                        type="number"
                        clearable
                        autocomplete="off"
                    >
                        <template #left-icon>
                            <img class="w-8px h-14px inline-block" src="@/assets/img/template/july/finance/icon-yuan.png" />
                        </template>
                    </van-field>
                    <div
                        v-show="focusState && withdrawMoneyNum.length <= 0"
                        class="w-328px absolute top-0 right-0 text-#c6d0db text-14px leading-44px"
                    >
                        <Vue3Marquee :delay="1" :duration="marqueeDuration">
                            <span v-html="withdrawLimitTips"></span>
                        </Vue3Marquee>
                    </div>
                </div>
                <!--金额快捷输入-->
                <div class="fast_input_list">
                    <div
                        class="list_box"
                        v-for="item in fastInputList"
                        :key="item.id"
                        :class="{ selected: currentFastInputId === item.id }"
                        @click="fastInputSelect(item)"
                    >
                        提{{ item.number }}元
                    </div>
                </div>
            </section>
            <!--提现到-->
            <div class="section_box">
                <div class="input_box_title">提现到</div>
                <div class="fast_input_list">
                    <div
                        v-for="(item, index) in withdrawInfo?.wallet_type"
                        :key="index"
                        class="list_box"
                        :class="[{ selected: currencyType === item.bank_id }, { is_hot: item.is_hot }]"
                        @click="currencyType = item.bank_id"
                    >
                        {{ item.name }}
                        <i v-if="item.is_hot" class="hot"></i>
                    </div>
                </div>
            </div>

            <template v-if="currencyType != 3">
                <!--银行卡收款账户 选择银行-->
                <div class="trade_pwd_input_box section_box" v-if="currencyType === 1">
                    <span class="input_box_title">收款账户</span>
                    <div class="input_box van-hairline--bottom">
                        <van-cell
                            @click="
                                () => {
                                    showBottomType = 'bank'
                                    withdrawBankShow = true
                                }
                            "
                            class="bg-transparent px-0"
                            is-link
                        >
                            <template #value>
                                <img
                                    class="mr-5px w-20px inline-block align-middle"
                                    v-lazy="{
                                        src: currentBank?.logo,
                                        error: lazyPack140,
                                        loading: lazyPack140
                                    }"
                                    alt=""
                                />
                                <span class="text-#262933">{{ `${currentBank?.bank_name}(${currentBank?.accountNum})` }}</span>
                            </template>
                        </van-cell>
                    </div>
                </div>
                <!--虚拟币收款账户 选择虚拟币-->
                <div class="trade_pwd_input_box section_box" v-if="currencyType === 2">
                    <span class="input_box_title">收款账户</span>
                    <div class="input_box van-hairline--bottom">
                        <van-cell
                            @click="
                                () => {
                                    showBottomType = 'coin'
                                    withdrawBankShow = true
                                }
                            "
                            class="bg-transparent px-0"
                            is-link
                            v-if="withdrawInfo?.virtualCount"
                        >
                            <template #value>
                                <img
                                    class="mr-5px w-20px"
                                    v-lazy="{
                                        src: 'logo' in currentvb ? currentvb?.logo : '',
                                        error: lazyPack140,
                                        loading: lazyPack140
                                    }"
                                    alt=""
                                />
                                <span class="text-#262933">
                                    {{
                                        `${"bank_name" in currentvb ? currentvb?.bank_name : ""}(${
                                            "showbankUrl" in currentvb ? currentvb?.showbankUrl : ""
                                        })`
                                    }}
                                </span>
                            </template>
                        </van-cell>
                        <van-cell
                            class="bg-transparent px-0"
                            is-link
                            to="/bankcard?type=1"
                            value="添加虚拟币账户"
                            v-else
                        ></van-cell>
                    </div>
                    <p class="predict">
                        <span class="iconques" @click="vbChangeTipShow"></span>
                        <span>预计到账：{{ vbNum }}个</span>
                    </p>
                </div>

                <!--交易密码-->
                <div class="trade_pwd_input_box section_box">
                    <span class="input_box_title">交易密码</span>
                    <div class="input_box van-hairline--bottom">
                        <van-field
                            class="bg-transparent text-16px"
                            input-align="right"
                            v-model="tradePassWord"
                            type="password"
                            :maxlength="20"
                            :formatter="formatterStr"
                            placeholder="请输入交易密码"
                        />
                    </div>
                </div>

                <!--确认提现按钮-->
                <div class="w-340px mx-auto my-25px py-10px">
                    <van-button
                        class="primary-btn border-none rounded-30px text-15px h-40px leading-40px"
                        :loading="withdrawLoading"
                        @click="withdraw"
                        block
                    >
                        确认提现
                    </van-button>
                </div>
            </template>
            <!-- V富通-->
            <template v-else>
                <div class="trade_pwd_input_box h-120px!">
                    <div class="richpay_card">
                        <div class="rich-view">
                            <div class="title">
                                <i class="logo"></i>
                                <h4>V富通钱包</h4>
                            </div>
                            <div class="main-panel">
                                <div class="rate">
                                    <h6>
                                        年利率
                                        <i v-if="'coupon_value' in withdrawInfo.richpay_conf" class="hot-tips">
                                            X{{
                                                "coupon_value" in withdrawInfo.richpay_conf
                                                    ? withdrawInfo.richpay_conf.coupon_value
                                                    : 0
                                            }}
                                        </i>
                                    </h6>
                                    <p>{{ withdrawInfo.richpay_year_show }}%</p>
                                </div>
                                <div class="money-rate">
                                    <h6>该笔七日预期收益</h6>
                                    <p class="text-right">
                                        <span>
                                            ￥{{
                                                !isNaN(parseFloat(withdrawMoneyNum))
                                                    ? formatNumberSplit(
                                                          parseFloat(withdrawMoneyNum) * withdrawInfo.richpay_seven_day_rate
                                                      )
                                                    : "0.00"
                                            }}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-340px mx-auto my-25px py-10px">
                    <van-button
                        class="primary-btn border-none rounded-30px text-15px h-40px leading-40px"
                        :loading="richpayBtnLoading"
                        @click="RichpayWithdraw"
                        block
                    >
                        确认提现
                    </van-button>
                </div>
            </template>
        </section>
        <!--未绑定银行卡 未绑定手机号码 未设置交易密码-->
        <section
            class="text-12px leading-relaxed no_trade_pwd"
            v-if="!withdrawBankList.length || !withdrawInfo?.has_securitypwd || !systemParams.userInfo?.tel"
        >
            <p class="text-#e34d12 text-center my-22px">为了保护您的资金安全,需绑定或设定全部下列选项后,才能提现。</p>
            <div class="needitem van-hairline--top" :class="{ complete: withdrawBankList.length }">
                <img class="icon" src="@/assets/img/template/july/finance/icon-zhang.png" alt="" />
                <span>提现账户</span>
                <div class="comple"></div>
                <router-link to="/bankcard" class="toset">去设置</router-link>
            </div>
            <div class="needitem van-hairline--top" :class="{ complete: systemParams.userInfo.tel }">
                <img class="icon" src="@/assets/img/template/july/finance/icon-phone.png" alt="" />
                <span>手机号码</span>
                <div class="comple"></div>
                <router-link to="/usersafety" class="toset">去设置</router-link>
            </div>
            <div class="needitem van-hairline--top" :class="{ complete: withdrawInfo.has_securitypwd }">
                <img class="icon" src="@/assets/img/template/july/finance/icon-padd.png" alt="" />
                <span>提现密码</span>
                <div class="comple"></div>
                <router-link to="/usersafety" class="toset">去设置</router-link>
            </div>
        </section>

        <!-- 底部弹出 银行卡选择/虚拟币选择-->
        <van-popup
            class="deposit-bank-overpop"
            teleport="body"
            v-model:show="withdrawBankShow"
            position="bottom"
            @close="showBottomType = ''"
        >
            <div class="bank_list_popup">
                <div class="popup_title">
                    {{ showBottomType === "bank" ? "选择银行卡" : "选择虚拟币" }}
                </div>
                <div class="deposit_bank_list">
                    <template v-if="showBottomType === 'bank'">
                        <van-radio-group v-model="currentBankId">
                            <van-cell
                                class="leading-28px"
                                v-for="(bank, index) in withdrawBankList"
                                :key="index"
                                clickable
                                @click="currentBankId = index"
                            >
                                <template #title>
                                    <img
                                        class="h-26px mr-10px inline-block align-middle"
                                        v-lazy="{
                                            src: bank?.logo,
                                            error: lazyPack140,
                                            loading: lazyPack140
                                        }"
                                        alt=""
                                    />
                                    <span>{{ bank.bank_name }}({{ bank.accountNum }})</span>
                                </template>
                                <template #right-icon>
                                    <van-radio :name="index" />
                                </template>
                            </van-cell>
                        </van-radio-group>
                    </template>
                    <template v-if="showBottomType === 'coin'">
                        <van-radio-group v-model="currentvbIndex">
                            <van-cell
                                class="leading-28px"
                                v-for="(bank, index) in withdrawInfo.virtualBanks"
                                :key="index"
                                clickable
                                @click="currentvbIndex = index"
                            >
                                <template #title>
                                    <img
                                        class="h-26px mr-10px inline-block align-middle"
                                        v-lazy="{
                                            src: bank?.logo,
                                            error: lazyPack140,
                                            loading: lazyPack140
                                        }"
                                        alt=""
                                    />
                                    <span>{{ bank.bank_name }}({{ bank.showbankUrl }})</span>
                                </template>
                                <template #right-icon>
                                    <van-radio :name="index" />
                                </template>
                            </van-cell>
                        </van-radio-group>
                    </template>

                    <router-link v-if="showBottomType === 'bank'" to="/bankcard?type=0">
                        <div class="add_bank" v-if="withdrawInfo.count < withdrawInfo.bankLimit">
                            <span>+</span>
                            <i>添加银行卡账户</i>
                        </div>
                    </router-link>
                    <router-link v-if="showBottomType === 'coin'" to="/bankcard?type=1">
                        <div class="add_bank" v-if="withdrawInfo.virtualCount < withdrawInfo.virtualBankLimit">
                            <span>+</span>
                            <i>添加虚拟币账户</i>
                        </div>
                    </router-link>
                </div>
            </div>
        </van-popup>
        <!-- 顶部弹出 验证码-->
        <van-popup teleport="body" v-model:show="showVerMsgCodePop" position="top">
            <div class="msg_vercode_pop">
                <label for="verCode" class="number_input">
                    <div
                        class="number_input_box"
                        :class="{ actived: numberCurrentIndex === index }"
                        v-for="(item, index) in number"
                        :key="index"
                    >
                        {{ verCode[index] }}
                    </div>
                </label>
                <input
                    ref="verCodeInputRef"
                    class="input_code"
                    @keyup="handleInput($event)"
                    v-model="verCode"
                    id="verCode"
                    name="verCode"
                    type="tel"
                    :maxlength="number"
                    autocorrect="off"
                    autocomplete="off"
                    autocapitalize="off"
                />
                <div class="send_vercode_btn_box">
                    <van-button
                        class="text-white bg-transparent h-35px leading-35px border-#07f1b7 rounded-30px"
                        :class="{
                            'border-none! bg-#2f323e! text-#7c839f! opacity-100!': isCountDown
                        }"
                        @click="handleSendVerCode(5)"
                        :loading="codeloading"
                        :disabled="isCountDown"
                    >
                        <template v-if="isCountDown">{{ countdownTime.seconds }}秒后重新发送</template>
                        <template v-else>发送验证码</template>
                    </van-button>
                </div>
                <div class="w-280px mx-auto mt-30px">
                    <van-button
                        class="primary-btn border-none rounded-30px text-15px h-44px leading-44px text-18px"
                        @click="handleWithdrawCheck"
                        block
                    >
                        确定
                    </van-button>
                </div>
            </div>
        </van-popup>
        <!-- 右侧弹出 提现信息确认-->
        <van-popup
            class="confirm-withdraw-overpop"
            teleport="body"
            v-model:show="showConfirmPage"
            position="right"
            :style="{ width: '100%', height: '100%' }"
        >
            <HeaderBar>
                <template #left>
                    <div @click="showConfirmPage = false" class="top-icon left-icon"></div>
                </template>
                <div class="header_title">
                    {{ currencyType === 1 ? "提现到银行卡" : "提现到虚拟币" }}
                </div>
                <template #right>
                    <div class="icon-placeholder w-22px h-22px"></div>
                </template>
            </HeaderBar>
            <div class="inner_page_body">
                <div class="withdraw_confim_box van-hairline--bottom">
                    <span class="box_title">提现金额</span>
                    <span class="box_content">{{ withdrawMoneyNum }}元</span>
                </div>
                <!--银行卡信息-->
                <div v-if="currencyType === 1">
                    <div class="withdraw_confim_box van-hairline--bottom">
                        <span class="box_title">银行账户</span>
                        <span class="box_content">{{ fullBankName }}</span>
                    </div>
                    <div class="withdraw_confim_box van-hairline--bottom">
                        <span class="box_title">开户城市</span>
                        <span class="box_content">{{ currentBank.province }} {{ currentBank.city }}</span>
                    </div>
                    <div class="withdraw_confim_box van-hairline--bottom">
                        <span class="box_title">户主姓名</span>
                        <span class="box_content">{{ currentBank.account_name }}</span>
                    </div>
                </div>
                <!--虚拟币信息-->
                <div v-if="currencyType === 2">
                    <div class="withdraw_confim_box van-hairline--bottom">
                        <span class="box_title" @click="vbChangeTipShow">预计到账</span>
                        <span class="box_content">{{ vbNum }}个</span>
                        <span class="iconques" @click="vbChangeTipShow"></span>
                    </div>
                    <div class="withdraw_confim_box van-hairline--bottom">
                        <span class="box_title">虚拟币账户</span>
                        <span class="box_content">
                            {{ "bank_name" in currentvb ? currentvb.bank_name : "" }}&nbsp;&nbsp;{{
                                "bank_url" in currentvb ? currentvb.bank_url : ""
                            }}
                        </span>
                    </div>
                </div>
                <div class="w-340px mx-auto mt-30px">
                    <van-button
                        class="primary-btn border-none rounded-30px text-15px h-40px leading-40px text-17px"
                        :loading="submitLoading"
                        @click="handleWithdrawSubmit"
                        block
                    >
                        确认
                    </van-button>
                </div>
                <p class="confirmtip">通常您的提款申请只需 3-15 分钟即可到账，若超过 30 分钟未到账，请及时联系在线客服。</p>
            </div>
        </van-popup>
    </div>
</template>

<style lang="scss" scoped>
.withdraw-page {
    line-height: 1.6;
    :deep(.highlight) {
        color: #7c839f;
    }
    .no_trade_pwd {
        .needitem {
            width: 100%;
            height: 0.56rem;
            display: flex;
            align-items: center;
            font-size: 0.15rem;
            box-sizing: border-box;
            padding: 0 0.15rem;
            &.complete {
                .toset {
                    display: none;
                }
                .comple {
                    display: block;
                }
            }
            .icon {
                width: 0.36rem;
                height: 0.26rem;
                margin-right: 0.14rem;
            }
            span {
                flex: 1;
                text-align: left;
            }
            .comple {
                width: 1.04rem;
                height: 0.4rem;
                background: url("@/assets/img/template/july/finance/icon-correct.png") no-repeat center center;
                background-size: 0.4rem 0.4rem;
                display: none;
            }
            .toset {
                border-radius: 0.2rem;
                border: 1px solid #07e9f1;
                text-align: center;
                padding: 0.07rem 0;
                width: 1.04rem;
                &:focus {
                    color: #fff;
                    background-image: linear-gradient(to right, #07e9f1, #07f1b7);
                    border-color: transparent;
                }
            }
        }
    }
    .iconques {
        margin-top: -0.02rem;
        display: inline-block;
        width: 0.23rem;
        height: 0.23rem;
        background: url("@/assets/img/template/july/icon-question.png") no-repeat center center;
        background-size: 0.16rem 0.16rem;
    }
    .section_box {
        margin-top: 25px;
    }
    .withdraw_wallet_info {
        background: url("@/assets/img/template/july/finance/withdraw_wallet_bg.png") no-repeat;
        background-size: 100% 100%;
        box-shadow: 0 0 12px 3px rgba(0, 0, 0, 0.3);
        border-radius: 0.06rem;
        .main_wallet_box {
            box-shadow: none;
        }
        .withdraw_limit_info {
            font-size: 12px;
            height: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 0.2rem;
            box-sizing: border-box;
            color: #7c839f;
            .limit_box {
                width: 48%;
                box-sizing: border-box;
                overflow: hidden;
            }
            .limit_title {
                height: 0.18rem;
                line-height: 0.18rem;
            }
            .limit_number {
                height: 0.3rem;
                font-size: 0.24rem;
                font-weight: bold;
                color: #fff;
                white-space: nowrap;
                .num {
                    .float {
                        font-size: 0.18rem;
                    }
                }
            }
        }
    }
    .input_box_title {
        font-size: 18px;
        font-weight: bold;
    }
    .withdraw_tips {
        font-size: 12px;
        font-weight: normal;
        margin-left: 10px;
        color: #e34d12;
    }
    .fast_input_list {
        display: flex;
        justify-content: space-between;
        padding: 0.1rem 0;
        flex-wrap: wrap;
        .list_box {
            flex: 1;
            margin-right: 0.06rem;
            padding: 0.08rem 0;
            line-height: normal;
            text-align: center;
            box-sizing: border-box;
            border: 1px solid #7c839f;
            border-radius: 0.06rem;
            font-size: 0.16rem;
            color: #7c839f;
            &:last-child {
                margin-right: 0;
            }
            &.selected {
                border-color: transparent;
                color: #262933;
                background: linear-gradient(to right, #07e9f1, #07f1b7);
            }
            &.is_hot {
                position: relative;
                .hot {
                    display: inline-block;
                    width: 0.25rem;
                    height: 0.09rem;
                    position: absolute;
                    right: 0;
                    top: -0.05rem;
                    background-image: url("@/assets/img/template/july/finance/deposit-hot.png");
                    background-size: 100% 100%;
                }
            }
        }
    }
    .trade_pwd_input_box {
        display: flex;
        flex-wrap: wrap;
        height: 0.42rem;
        align-items: center;
        .input_box_title {
            width: 0.8rem;
            align-self: flex-end;
            line-height: 1.4;
        }
        .input_box {
            height: 100%;
            flex: 1;
            input {
                height: 100%;
                width: 100%;
                line-height: normal;
                font-size: 0.15rem;
                text-align: right;
                &::-webkit-input-placeholder {
                    text-align: right;
                }
            }
        }
        .predict {
            text-align: right;
            width: 100%;
            color: #7c839f;
            font-size: 0.13rem;
            margin-top: 0.1rem;
            span {
                vertical-align: middle;
            }
        }
        .richpay_card {
            margin-top: 0.1rem;
            position: relative;
            width: 100%;
            height: 1.1rem;
            border-radius: 0.053rem;
            background-color: #323440;
            &:before {
                position: absolute;
                content: "";
                width: calc(100% - 0.04rem);
                height: calc(100% - 0.04rem);
                border-radius: 0.053rem;
                border: 1px dashed #83868e;
                top: 0.02rem;
                left: 0.02rem;
                box-sizing: border-box;
                background-image: linear-gradient(to right, #494d5e, #313440);
            }
            .rich-view {
                width: calc(100% - 0.4rem);
                height: 100%;
                position: absolute;
                top: 0;
                left: 0.2rem;
                .title {
                    margin-top: 0.15rem;
                    display: flex;
                    i {
                        display: inline-block;
                        width: 0.405rem;
                        height: 0.37rem;
                        background: url("@/assets/img/template/july/finance/richpay_lwallet_ogo.png");
                        background-size: 100% 100%;
                        margin-right: 0.12rem;
                    }
                    h4 {
                        font-size: 0.17rem;
                        font-weight: normal;
                        line-height: 0.37rem;
                        color: #ffffff;
                    }
                }
                .main-panel {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 0.04rem;
                    h6 {
                        color: #ffffff;
                        font-size: 0.15rem;
                        font-weight: normal;
                        .hot-tips {
                            display: inline-block;
                            width: 0.325rem;
                            height: 0.14rem;
                            text-align: center;
                            line-height: 0.16rem;
                            background: url("@/assets/img/template/july/my/hot-tips.png");
                            background-size: 100% 100%;
                            font-size: 0.12rem;
                            color: #303441;
                            vertical-align: middle;
                            margin-left: 0.02rem;
                        }
                    }
                    p {
                        font-size: 0.15rem;
                        color: #ffffff;
                        span {
                            color: #09e8b3;
                        }
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.vk-confirm-dialog.xnb-confirm-dialog {
    .van-dialog__message {
        font-size: 12px;
    }
}
.msg_vercode_pop {
    background-color: #262933;
    padding: 0.35rem 0.12rem;
    box-sizing: border-box;
    color: #7c839f;
    .number_input {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .number_input_box {
            flex: 1;
            margin: 0 0.12rem;
            height: 0.4rem;
            line-height: 0.4rem;
            font-size: 0.22rem;
            color: #fff;
            text-align: center;
            border-bottom: 0.02rem solid #7c839f;
            &.actived {
                border-color: #07f1b7;
            }
        }
    }
    .input_code {
        position: absolute;
        left: -9999rem;
        top: -99999rem;
        opacity: 0;
        overflow: visible;
        z-index: -1;
    }
    .vk_comfire_btn {
        display: block;
        margin: 0.3rem auto 0;
        width: 80%;
        padding: 0.1rem 0;
        font-size: 0.18rem;
    }
    .send_vercode_btn_box {
        margin-top: 0.3rem;
        text-align: center;
        .send_vercode_btn {
            display: inline-block;
            padding: 0 0.16rem;
            height: 0.35rem;
            line-height: 0.33rem;
            box-sizing: border-box;
            border-radius: 0.3rem;
            border: 0.01rem solid #07f1b7;
            color: #fff;
            font-size: 0.14rem;
            &.disabled {
                border: none;
                line-height: 0.35rem;
                color: #7c839f;
                background: #2f323e;
            }
            &.send_btn {
                &:active {
                    border: none;
                    line-height: 0.35rem;
                    background: linear-gradient(to right, #07e9f1, #07f1b7);
                }
            }
        }
    }
}
.confirm-withdraw-overpop {
    background-color: #e8f1ef;
    .inner_page_body {
        padding: 0 0.12rem;
        line-height: 1.6;
        font-size: 12px;
        .withdraw_confim_box {
            font-size: 0.15rem;
            line-height: normal;
            height: 0.64rem;
            display: flex;
            align-items: center;
            .box_title {
                width: 0.9rem;
            }
            .box_content {
                flex: 1;
                margin-top: 0.03rem;
                word-break: break-all;
            }
        }
        .vk_comfire_btn {
            display: block;
            margin: 0.2rem auto 0;
            width: 3.4rem;
            padding: 0.09rem 0;
            font-size: 0.17rem;
        }
        .confirmtip {
            margin: 0.2rem auto;
            width: 3.4rem;
            color: #7c839f;
        }
    }
}
</style>
