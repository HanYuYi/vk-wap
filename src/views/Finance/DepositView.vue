<script setup lang="ts">
import ApiSetting from "@/api/service"
import { formatterStr, checkChineseName } from "@/composable/validate"
import { ref, computed, watch, nextTick, unref } from "vue"
import { usePlaceImg } from "@/utils/globalImgs"
import { useSysStore } from "@/stores/system"
import { useWalletStore } from "@/stores/wallet"
import { showToast } from "vant"
import { HttpPlus } from "@/api/HttpPlus"
import type { BanksItems, DepositGetDepositType, ExtInfoItem } from "@/api/pojo/DepositGetDepositType"
import type { DepositApplyDeposit } from "@/api/pojo/DepositApplyDeposit"

const walletStore = useWalletStore()
const systemParams = useSysStore()
const { lazyPack140 } = usePlaceImg()

const depositTypeIndex = ref(0)

type DepositGetDepositTypeAlias = DepositGetDepositType["data"]

const depositTypeList = ref<DepositGetDepositTypeAlias>([])

const currentDepositType = computed<DepositGetDepositTypeAlias[number] | {}>(
    () => depositTypeList.value[depositTypeIndex.value] ?? {}
)

// 充值金额
const amount = ref("")

const elseInfoList = computed<ExtInfoItem[]>(() => {
    if ("ext_info" in currentDepositType.value) {
        return currentDepositType.value?.ext_info
    }
    return []
})

const field = ref<{ [propName: string]: ExtInfoItem["field"] }>({})

// 金额最多允许两位小数，禁止输入负数
watch(amount, (val: string, oldVal: string) => {
    nextTick(() => {
        if (val && val.toString().indexOf(".") > 0 && val.split(".").length == 2) {
            if (val.split(".")[1].length > 2) {
                amount.value = oldVal
            }
        }
        if (Number(val) <= 0) {
            amount.value = ""
        }
    })
})

watch(elseInfoList, (arr: ExtInfoItem[]) => {
    if (arr.length) {
        arr.forEach((item: ExtInfoItem) => {
            if (item.field) {
                field.value[item.field] = ""
            }
        })
    }
})

const depositBankShow = ref(false)
const jumpConfirmBtn = ref(false)

const depositLineIndex = ref(0)

// 所有线路
const depositLineList = computed<BanksItems[]>(() => {
    if ("banks" in currentDepositType.value) {
        return currentDepositType.value.banks
    }
    return []
})

// 当前选择的线路
const currentDepositLine = computed<BanksItems>(() => depositLineList.value[depositLineIndex.value])

const depositLineSelect = (item: BanksItems): void => {
    depositLineIndex.value = item.id
    currentDepositBankIndex.value = 0
}

const isShowAccountName = computed<BanksItems["is_show_account_name"]>(() => currentDepositLine.value?.is_show_account_name ?? 0)

// 当前线上的id，用于给接口传参
const BankId = computed<BanksItems["bank_id"] | "">(() => currentDepositLine.value?.bank_id ?? "")

const currentDepositBankIndex = ref(0)

type ChildBanks = BanksItems["banks"]

const selectBankList = computed<ChildBanks>(() => currentDepositLine.value?.banks ?? [])

const currentBank = computed<ChildBanks[number] | {}>(() => selectBankList.value[currentDepositBankIndex.value] ?? {})

const currentDepositBankId = computed<ChildBanks[number]["value"]>(() => {
    if ("value" in currentBank.value) {
        return currentBank.value.value
    }
    return ""
})

const depositLimitMin = computed<string | number>(() => {
    if (selectBankList.value.length) {
        return currentDepositBankId.value.split("#")[1].split("-")[0]
    } else {
        return parseInt(currentDepositLine.value?.deposit_min) ?? 0
    }
})

const depositLimitMax = computed<string | number>(() => {
    if (selectBankList.value.length) {
        return currentDepositBankId.value.split("#")[1].split("-")[1]
    } else {
        return parseInt(currentDepositLine.value?.deposit_max) ?? 0
    }
})

const depositDataBank = computed<string>(() => {
    if ("value" in currentBank.value && selectBankList.value.length) {
        return currentBank.value?.value.split("#")[0] ?? ""
    } else {
        return ""
    }
})

watch(currentDepositBankIndex, () => {
    depositBankShow.value = false
})

const currentFastInputId = ref(0)

type FastInput = { id: number; number: number }

const fastInputList = computed<FastInput[]>(() => {
    if (depositLimitMin.value > 0) {
        const arr = [
            {
                id: 0,
                number: Math.floor(+depositLimitMin.value)
            },
            {
                id: 1,
                number: Math.floor(+depositLimitMin.value * 5)
            },
            {
                id: 2,
                number: Math.floor(+depositLimitMin.value * 10)
            }
        ]

        if (arr[1].number < depositLimitMax.value && depositLimitMax.value < arr[2].number) {
            arr[2].number = Math.floor(+depositLimitMax.value)
        }

        if (depositLimitMax.value <= arr[1].number) {
            const midtemp: number = (+depositLimitMax.value - arr[0].number) / 2 + arr[0].number
            arr[1].number = Math.floor(midtemp / 10) * 10
            arr[2].number = Math.floor(+depositLimitMax.value)
        }

        return arr
    }
    return []
})

watch(fastInputList, (list: FastInput[]) => {
    if (list.length) {
        fastInputSelect(list[0])
    }
})

const fastInputSelect = (x: FastInput): void => {
    if (x) {
        currentFastInputId.value = x.id
        amount.value = x.number.toString()
    }
}

const depositLimitTips = computed<string>(() => {
    if (depositLimitMax.value) {
        return "单笔充值限额" + depositLimitMin.value + "元至" + depositLimitMax.value + "元"
    } else {
        return ""
    }
})

// 提交后html格式返回
const dialogType = ref("html")
const show = ref(false)

type SubmitAccountInfo = Omit<DepositApplyDeposit["account"], "deposit_min">

const applyDepositDialogInfo = ref<Partial<SubmitAccountInfo & Pick<DepositApplyDeposit, "money" | "orderId" | "account_diff">>>(
    {}
)
const qrImgUrl = ref("")
const depositForm = ref<{ url: string; params: DepositApplyDeposit["params"] }>({
    url: "",
    params: {}
})

const toTransferDes = ref("")
const toTransferStrong = ref("")

const submitLoading = ref(false)

// 提交充值
const handleApplyDeposit = async (): Promise<void> => {
    if (selectBankList.value.length && !depositDataBank.value) {
        showToast({
            className: "vk-toast-fail",
            message: "请您选择银行",
            icon: "warning"
        })
        return
    }
    if (!Number(amount.value)) {
        showToast({
            className: "vk-toast-fail",
            message: "充值金额不能为空或格式不正确",
            icon: "warning"
        })
        return
    }
    if (parseFloat(amount.value) > parseFloat(depositLimitMax.value.toString())) {
        showToast({
            className: "vk-toast-fail",
            message: "超出单笔充值限额",
            icon: "warning"
        })
        return
    }
    if (parseFloat(amount.value) < parseFloat(depositLimitMin.value.toString())) {
        showToast({
            className: "vk-toast-fail",
            message: "低于单笔充值限额",
            icon: "warning"
        })
        return
    }
    const baseParams = {
        bank_id: BankId.value,
        amount: amount.value,
        bank: depositDataBank.value
    }

    const businessParams: { [propName: string]: ExtInfoItem["field"] } = {}

    if (Object.keys(field.value).length) {
        for (let key in field.value) {
            if (!(isShowAccountName.value == 0 && key == "account_name")) {
                if (field.value[key]) {
                    if (checkChineseName(field.value[key], "", "", "middle")) {
                        return
                    }
                    businessParams[key] = field.value[key]
                } else {
                    const message: string = elseInfoList.value.find((item: ExtInfoItem) => item.field === key)?.desc
                    showToast({
                        className: "vk-toast-fail",
                        message,
                        icon: "warning"
                    })
                    return
                }
            }
        }
    }

    const mergeParams = {
        ...baseParams,
        ...businessParams
    }
    submitLoading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.user.applyDeposit)
        const res = await HttpPlus.sendHttpRequest<DepositApplyDeposit, typeof mergeParams>(mergeParams)
        submitLoading.value = false

        if (res.status === 1) {
            const { type, params, deposit_type, url, account, money, orderId, account_diff } = res.data
            dialogType.value = type

            if (dialogType.value === "html") {
                let someAccountInfo: Partial<SubmitAccountInfo> = {}
                if (account) {
                    const { acount_bank, acount, name, acount_bank_info } = account
                    someAccountInfo = { acount_bank, acount, name, acount_bank_info }
                }
                applyDepositDialogInfo.value = {
                    ...someAccountInfo,
                    money,
                    orderId,
                    account_diff
                }
                show.value = true
            }

            if (dialogType.value === "qrcode") {
                qrImgUrl.value = url
                show.value = true
            }

            if (dialogType.value === "form") {
                depositForm.value.url = url
                depositForm.value.params = params
                jumpConfirmBtn.value = true
            }

            if (deposit_type !== 5) {
                toTransferStrong.value = `转账单笔最低限额${parseFloat(res.data.account?.deposit_min).toFixed(
                    2
                )}元，低于该限额无法办理到账。`
            } else {
                toTransferStrong.value = "转账时请输入带小数点的充值金额，否则不能到账。"
            }
            toTransferDes.value = `2. 平台的${
                account?.desposit_type_tip ?? ""
            }账户会不定时更换，请在获取最新信息后充值，否则将无法即时到帐。<br/>3. 平台填写金额应当与${
                account?.desposit_type_tip ?? ""
            }汇款金额完全一致， 否则将无法即时到帐 <br / >4. 订单有效期${
                account?.show_over_time || "15"
            }分钟 <br / >5. 若存在10分钟之后仍未到帐， 请联系在线客服 `
            if (deposit_type === 4) {
                toTransferDes.value +=
                    "<br/>6. 银行卡直充线路如果用银联云闪付、支付宝等第三方软件，不能自动到账，可能会影响您的投注。"
            }
        }
    } catch (error: unknown) {
        submitLoading.value = false
        throw error
    }
}

const handleJumpConfirm = (): void => {
    jumpConfirmBtn.value = false
}

const loadMainMoney = async (): Promise<void> => {
    systemParams.PageLoading = true
    await walletStore.getUserMoney("NM")
    systemParams.PageLoading = false
}

const LINE_CAPITAL = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]

const loadDepositList = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.user.getDepositList)
    const res = await HttpPlus.sendHttpRequest<DepositGetDepositType>()
    systemParams.PageLoading = false

    if (res.status === 1) {
        depositTypeList.value = res.data.map((card: DepositGetDepositTypeAlias[number], cardIndex: number) => {
            let banks: BanksItems[] = []
            if (card.banks.length) {
                banks = card.banks.map((bank: BanksItems, bIndex: number) => {
                    let name: string = LINE_CAPITAL[bIndex]

                    if (bIndex >= 10) {
                        const ten: number = +bIndex.toString()[0]
                        const bit: number = +bIndex.toString()[1]

                        if (bIndex < 19) {
                            name = `${LINE_CAPITAL[9]}${LINE_CAPITAL[bit]}`
                        } else if (+(bit + 1).toString()[1] === 0) {
                            name = `${LINE_CAPITAL[ten]}${LINE_CAPITAL[9]}`
                        } else {
                            name = `${LINE_CAPITAL[ten - 1]}${LINE_CAPITAL[bit]}`
                        }
                    }

                    return {
                        ...bank,
                        id: bIndex,
                        name
                    }
                })
            }

            return {
                ...card,
                banks,
                id: cardIndex
            }
        })
    }
}

loadDepositList()
</script>

<template>
    <div class="deposit-page h-full">
        <!--主钱包-->
        <section class="main_wallet_box">
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
        <!-- 充值方式 -->
        <div class="deposit_else_content" v-if="depositTypeList.length">
            <div class="pay_type_list section_box">
                <div class="input_box_title">选择支付方式</div>
                <div class="list_box radio_list mt-14px">
                    <van-radio-group v-model="depositTypeIndex">
                        <van-cell-group class="bg-transparent!" :border="false">
                            <van-cell
                                :border="false"
                                class="mb-2px bg-transparent! px-0 overflow-visible"
                                v-for="(type, index) in depositTypeList"
                                :key="index"
                                clickable
                                @click="depositTypeIndex = type.id"
                            >
                                <template #title>
                                    <div class="inline-block w-32px h-22px mr-10px relative align-middle">
                                        <img
                                            class="max-w-full h-full"
                                            v-lazy="{
                                                src: type?.logo,
                                                error: lazyPack140,
                                                loading: lazyPack140
                                            }"
                                            alt=""
                                        />
                                        <i
                                            class="hot-icon inline-block w-25px h-9px absolute top--9px right--25px"
                                            v-if="type.is_hot"
                                        ></i>
                                    </div>

                                    <span
                                        class="inline-block align-middle"
                                        :class="{ 'text-#7c839f': depositTypeIndex !== type.id }"
                                    >
                                        {{ type?.type_name }}
                                    </span>
                                    <span v-if="type.recommend_tips" class="recommend_tips">
                                        <span class="txt">{{ type?.recommend_tips }}</span>
                                    </span>
                                    <span class="ts_msg leading-normal" v-if="type.is_risk && depositTypeIndex === type.id">
                                        {{ type.risk_tips }}
                                    </span>
                                </template>
                                <template #right-icon>
                                    <van-radio :name="type.id" />
                                </template>
                            </van-cell>
                        </van-cell-group>
                    </van-radio-group>
                </div>
            </div>
            <div
                class="elseinfo_input_box section_box"
                v-for="(item, index) in elseInfoList"
                :key="index"
                v-show="!(item.field == 'account_name' && isShowAccountName == 0)"
            >
                <div class="input_box_title">
                    {{ item.name }}
                </div>
                <div class="input_box van-hairline--bottom">
                    <van-field
                        class="bg-transparent px-0 text-16px font-bold"
                        :border="false"
                        v-model="field[item.field]"
                        clearable
                        name="username"
                        :maxlength="18"
                        :formatter="formatterStr"
                        :placeholder="item.desc"
                    />
                </div>
            </div>

            <div class="deposit_input_box section_box">
                <div class="input_box_title">充值金额</div>
                <div class="input_box van-hairline--bottom">
                    <van-field
                        class="bg-transparent px-0 text-16px font-bold"
                        v-model="amount"
                        name="amount"
                        type="number"
                        clearable
                        autocomplete="off"
                        :formatter="formatterStr"
                        :placeholder="depositLimitTips"
                        maxlength="16"
                    >
                        <template #left-icon>
                            <img
                                class="currcy w-8px h-14px inline-block align-revert"
                                src="@/assets/img/template/july/finance/icon-yuan.png"
                            />
                        </template>
                    </van-field>
                </div>
                <div class="fast_input_list">
                    <div
                        class="list_box"
                        v-for="item in fastInputList"
                        :key="item.id"
                        :class="{ selected: currentFastInputId === item.id }"
                        @click="fastInputSelect(item)"
                    >
                        {{ item.number }}元
                    </div>
                </div>
            </div>

            <div class="deposit_line_list section_box">
                <div class="input_box_title">充值线路</div>
                <div
                    class="deposit_line_box"
                    :class="[
                        { more_line: depositLineList.length > 3 },
                        {
                            start_f: depositLineList.length > 2 && depositLineList.length % 3 === 2
                        }
                    ]"
                >
                    <div
                        class="line_list_box"
                        v-for="item in depositLineList"
                        :key="item.id"
                        :class="{ selected: depositLineIndex === item.id }"
                        @click="depositLineSelect(item)"
                    >
                        线路{{ item.name }}
                    </div>
                </div>
            </div>
            <div class="deposit_bank_select" v-if="selectBankList.length > 0">
                <van-cell
                    class="bg-transparent px-0!"
                    title-class="text-18px! font-bold text-oldText"
                    size="large"
                    title="选择银行"
                    :value="'name' in currentBank ? currentBank.name : ''"
                    is-link
                    @click="depositBankShow = true"
                />
            </div>
        </div>
        <div class="form_comfire_masker" v-if="jumpConfirmBtn"></div>
        <!-- 底部功能区 -->
        <div class="deposit_comfire_box" :class="{ heightplus: jumpConfirmBtn }" v-if="depositTypeList.length > 0">
            <div class="box_top">
                <div class="money_comfire">
                    共计
                    <span class="yuan_icon"></span>
                    <b>{{ amount ? amount : 0 }}</b>
                </div>
                <div class="to_deposit_btn">
                    <van-button
                        class="primary-btn border-none text-16px rounded-30px"
                        block
                        :loading="submitLoading"
                        v-if="!jumpConfirmBtn"
                        @click="handleApplyDeposit"
                    >
                        立即充值
                    </van-button>
                    <form
                        :action="depositForm.url"
                        method="post"
                        target="_blank"
                        id="form_export"
                        name="deposit_form"
                        class="btn"
                        @submit="handleJumpConfirm"
                        v-show="jumpConfirmBtn"
                    >
                        <input
                            type="text"
                            v-for="(val, k) in depositForm.params"
                            :key="k"
                            :name="k.toString()"
                            :value="val"
                            hidden
                        />
                        <input type="submit" :value="'前往充值'" class="vk_btn text-#000 rounded-30px py-5px jump_comfire" />
                    </form>
                </div>
            </div>
            <div class="comfire_tips">
                7x24小时急速到账服务。如果网络状况不佳会造成延迟到账情况。假如您的充值订单超过15分钟仍未到账，请及时联系
                <span class="kf-btn" @click="systemParams.clickHeaderKF">在线客服</span>
                。
            </div>
        </div>
        <!-- 底部弹出 -->
        <van-popup class="deposit-bank-overpop" teleport="body" v-model:show="depositBankShow" position="bottom">
            <div class="bank_list_popup">
                <div class="popup_title">选择银行卡</div>
                <div class="deposit_bank_list">
                    <van-radio-group v-model="currentDepositBankIndex">
                        <van-cell
                            v-for="(bank, index) in selectBankList"
                            :key="index"
                            clickable
                            @click="currentDepositBankIndex = index"
                        >
                            <template #title>
                                <img
                                    class="h-26px w-26px mr-10px inline-block align-middle"
                                    v-lazy="{
                                        src: bank?.icon_png,
                                        error: lazyPack140,
                                        loading: lazyPack140
                                    }"
                                    alt=""
                                />
                                <span>{{ bank.name }}</span>
                            </template>
                            <template #right-icon>
                                <van-radio :name="index" />
                            </template>
                        </van-cell>
                    </van-radio-group>
                </div>
            </div>
        </van-popup>
        <!-- 右侧弹出 -->
        <van-popup
            class="deposit-overpop"
            teleport="body"
            v-model:show="show"
            position="right"
            :style="{ width: '100%', height: '100%' }"
        >
            <HeaderBar>
                <template #left>
                    <div @click="show = false" class="top-icon left-icon"></div>
                </template>
                <div class="header_title">{{ "type_name" in currentDepositType ? currentDepositType.type_name : "" }}</div>
                <template #right>
                    <div class="icon-placeholder w-22px h-22px"></div>
                </template>
            </HeaderBar>
            <div class="inner_page_body" v-if="dialogType === 'html'">
                <div class="comfire_box">
                    <div class="dialog_input_box van-hairline--bottom">
                        <div class="dialog_input_box_wrapper">
                            <div class="input_box_title">收款银行</div>
                            <div class="input_box_content">
                                {{ "acount_bank" in applyDepositDialogInfo ? applyDepositDialogInfo.acount_bank : "" }}
                            </div>
                        </div>
                    </div>
                    <div class="dialog_input_box van-hairline--bottom acount">
                        <div class="dialog_input_box_wrapper">
                            <div class="input_box_title">收款账号</div>
                            <div class="input_box_content can_user_select">
                                {{ applyDepositDialogInfo.acount }}
                            </div>
                        </div>
                        <div class="accout_tips warning" v-if="applyDepositDialogInfo.account_diff == 1">
                            本次收款账号与您上一次不同，请勿充到旧账号
                        </div>
                    </div>
                    <div class="dialog_input_box van-hairline--bottom">
                        <div class="dialog_input_box_wrapper">
                            <div class="input_box_title">收款账号名</div>
                            <div class="input_box_content">
                                {{ applyDepositDialogInfo.name }}
                            </div>
                        </div>
                    </div>
                    <div class="dialog_input_box van-hairline--bottom" v-if="applyDepositDialogInfo.acount_bank_info">
                        <div class="dialog_input_box_wrapper">
                            <div class="input_box_title">支行信息</div>
                            <div class="input_box_content">
                                {{ applyDepositDialogInfo.acount_bank_info }}
                            </div>
                        </div>
                    </div>
                    <div class="dialog_input_box van-hairline--bottom">
                        <div class="dialog_input_box_wrapper">
                            <div class="input_box_title">充值金额</div>
                            <div class="input_box_content">
                                {{ applyDepositDialogInfo.money }}
                            </div>
                        </div>
                    </div>
                    <div class="dialog_input_box" v-if="applyDepositDialogInfo.orderId">
                        <div class="dialog_input_box_wrapper">
                            <div class="input_box_title">附言</div>
                            <div class="input_box_content">
                                {{ applyDepositDialogInfo.orderId }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="confirm_deposit_tips">
                    <span class="warning">1.{{ toTransferStrong }}</span>
                    <p v-html="toTransferDes"></p>
                </div>
            </div>
            <div class="inner_page_body deposit_qrcode" v-if="dialogType === 'qrcode'">
                <p class="qrcode_tips">扫下方二维码完成支付，有效期为20分钟</p>
                <div class="qrcode_img">
                    <img :src="qrImgUrl" alt="" />
                </div>
                <div class="deposit_money">￥{{ amount }}</div>
                <div class="qrcode_subtitle">应付金额</div>
            </div>
        </van-popup>
    </div>
</template>

<style lang="scss" scoped>
.deposit-page {
    .form_comfire_masker {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 2;
    }
    .deposit_comfire_box {
        position: fixed;
        left: 0;
        bottom: 0;
        background-color: #fff;
        padding: 0.15rem 0.1rem;
        width: 100%;
        height: 1.4rem;
        color: #7c839f;
        z-index: 3;
        transition: height 0.5s;
        &.heightplus {
            height: 3rem;
        }
        .box_top {
            display: flex;
            justify-content: space-between;
            align-content: center;
            font-size: 0.14rem;
            height: 0.36rem;
            .money_comfire {
                line-height: 0.36rem;
                height: 100%;
                b {
                    margin-left: 0.05rem;
                    color: #262933;
                    font-size: 0.2rem;
                    font-weight: bold;
                }
                .yuan_icon {
                    display: inline-block;
                    width: 0.08rem;
                    height: 0.12rem;
                    background: url("@/assets/img/template/july/finance/icon-yuan.png") no-repeat center;
                    background-size: contain;
                }
            }
            .to_deposit_btn {
                width: 1.3rem;
                .vk_btn {
                    height: 100%;
                    width: 100%;
                    font-size: 0.16rem;
                    line-height: 0.36rem;
                    &.jump_comfire {
                        background: linear-gradient(to right, #99fe37, #6ad801);
                    }
                }
            }
        }
        .comfire_tips {
            margin-top: 0.25rem;
            font-size: 12px;
            .kf-btn {
                text-decoration: underline;
                margin-left: 0.02rem;
                color: #262933;
            }
        }
    }
    .fast_input_list,
    .deposit_line_box {
        display: flex;
        justify-content: space-between;
        padding: 0.1rem 1px;
        .list_box,
        .line_list_box {
            width: 1.06rem;
            height: 0.38rem;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            border: 1px solid #7c839f;
            border-radius: 0.06rem;
            font-size: 0.16rem;
            color: #7c839f;
            &.selected {
                border: none;
                color: #262933;
                background: linear-gradient(to right, #07e9f1, #07f1b7);
            }
        }
    }
    .deposit_line_box {
        &.start_f {
            justify-content: start;
            .line_list_box {
                margin-right: calc((100% - (1.06rem * 3)) / 2);
                &:nth-child(3n + 3) {
                    margin-right: 0;
                }
            }
        }
        &.more_line {
            flex-wrap: wrap;
            .line_list_box {
                flex: none;
                margin-left: 0;
            }
        }
        .line_list_box {
            margin-bottom: 0.1rem;
            flex: 1;
            margin-left: 0.12rem;
            flex-wrap: wrap;
            &:first-child {
                margin-left: 0;
            }
        }
    }
    .hot-icon {
        background-image: url("@/assets/img/template/july/finance/deposit-hot.png");
        background-size: 100% 100%;
    }
    .ts_msg {
        color: #e34d12;
        font-size: 0.12rem !important;
        white-space: nowrap;
        position: absolute;
        left: -0rem;
        top: 0.34rem;
        display: block;
    }
    .recommend_tips {
        border-radius: 0.08rem;
        height: 0.16rem;
        background-color: #262933;
        color: #ffffff;
        padding: 0 0.07rem;
        position: relative;
        margin-left: 0.06rem;
        display: inline-block;
        vertical-align: middle;
        .txt {
            display: inline-block;
            max-width: 1.8rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 0.12rem;
            height: 0.16rem;
            line-height: 0.16rem;
        }
        &::before {
            display: inline-block;
            position: absolute;
            top: 4px;
            left: -4px;
            content: "";
            width: 0;
            height: 0;
            border-top: 5px solid transparent;
            border-right: 8px solid #262933;
            border-bottom: 5px solid transparent;
        }
    }
    .deposit_else_content {
        height: calc(100% - 1rem);
        overflow-x: hidden;
        overflow-y: auto;
        padding-bottom: 1.3rem;
        .section_box {
            margin-top: 0.25rem;
            .input_box_title {
                font-size: 18px;
                font-weight: bold;
            }
        }
    }
}
</style>
