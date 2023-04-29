<script setup lang="ts">
import ApiSetting from "@/api/service"
import { ref, computed, watch } from "vue"
import { useRoute } from "vue-router"
import type { RouteLocationNormalizedLoaded } from "vue-router"
import { useFreshStore } from "@/stores/fresh"
import { useSysStore } from "@/stores/system"
import { showConfirmDialog, showDialog, showToast } from "vant"
import { hexToRgb } from "@/utils/commonUtils"
import { usePlaceImg } from "@/utils/globalImgs"
import { useForm } from "@/composable/form"
import {
    formatterBankCard,
    formatterStr,
    checkChineseName,
    checkBankCard,
    formatterPhone,
    checkPhone
} from "@/composable/validate"
import { HttpPlus } from "@/api/HttpPlus"
import type { UserBankUserBankList } from "@/api/pojo/UserBankUserBankList"
import type { UserVirtualBankUserBankList } from "@/api/pojo/UserVirtualBankUserBankList"
import type { UserBankBankAndArea } from "@/api/pojo/UserBankBankAndArea"
import type { UserVirtualBankBank } from "@/api/pojo/UserVirtualBankBank"

const route: RouteLocationNormalizedLoaded = useRoute()
const freshStore = useFreshStore()
const systemParams = useSysStore()
const { lazyPack140 } = usePlaceImg()
const { codeSended, phone, phonecode, codeCheck, codeloading, isCountDown, countdownTime, handleSendVerCode, resetForm } =
    useForm()

const bankLocked = ref(false)
const coinLocked = ref(false)
const userBankInfo = ref<Partial<UserBankUserBankList>>({})

type UserBankUserBankListBanks = UserBankUserBankList["banks"]
type UserVirtualBankUserBankListBanks = UserVirtualBankUserBankList["banks"]

const userBankList = ref<UserBankUserBankListBanks>([])
const userCoinInfo = ref<Partial<UserVirtualBankUserBankList>>({})
const userCoinList = ref<UserVirtualBankUserBankListBanks>([])

const noBankCard = ref(true)
const noCoinCard = ref(true)

// 表单
const checkNum = ref(0)
const username = ref("")
const bankcardnumber = ref("")
const bankcardagain = ref("")

type areaInfosItem = UserBankBankAndArea["areaInfos"][number]

type CurrentCity = {
    province: areaInfosItem["name"]
    provinceId: areaInfosItem["id"]
    city: areaInfosItem["name"]
    cityId: areaInfosItem["id"]
}
const currentCity = ref<Partial<CurrentCity>>({})
const selectedValues = ref<number[]>([]) // 选中的省市
const showBottomSelect = ref(false)
const BottomType = ref("")
const currentBankId = ref(0)

const currentBank = computed<UserBankBankAndArea["bankInfo"][number]>(() => {
    return freshStore.bankInfo[currentBankId.value]
})

const currentCoinId = ref(0)

const currentCoin = computed<UserVirtualBankBank["bankInfo"][number]>(() => {
    return freshStore.CryptoCurrencyInfo[currentCoinId.value]
})

const address = ref("") // 虚拟币地址
const confirmLast = ref("")

watch(currentBankId, () => {
    showBottomSelect.value = false
})
watch(currentCoinId, () => {
    showBottomSelect.value = false
})

// 绑定银行卡前是否需要验证
const isNeedVerifyFirst = computed<boolean>(() => {
    return userBankInfo.value.count && !checkNum.value
})

const submitDiabled = computed<boolean>(() => {
    if (active.value === 0) {
        if (isNeedVerifyFirst.value) {
            return !username.value || !bankcardnumber.value
        } else {
            return (
                !username.value ||
                !bankcardnumber.value ||
                !bankcardagain.value ||
                !currentBank.value.bank_id ||
                !currentCity.value.cityId
            )
        }
    } else {
        return (
            !!checkPhone(phone.value, systemParams.countryCode.number).length ||
            !phonecode.value ||
            !currentCoin.value.bank_id ||
            !address.value
        )
    }
})

const selectCoin = (): void => {
    BottomType.value = "coin"
    showBottomSelect.value = true
}
const selectBank = (): void => {
    BottomType.value = "bank"
    showBottomSelect.value = true
}
const selectCity = (): void => {
    BottomType.value = "city"
    showBottomSelect.value = true
}
// 设置当前地区
const setArea = (province: areaInfosItem, city: areaInfosItem): void => {
    currentCity.value.province = province.name
    currentCity.value.provinceId = province.id
    currentCity.value.city = city.name
    currentCity.value.cityId = city.id
}

// 选择了地区
const confirmCity = (): void => {
    if (selectedValues.value.length) {
        const provice = freshStore.AreaOrigin.find((item: areaInfosItem) => item.id === selectedValues.value[0])

        const city = freshStore.AreaOrigin.find((item: areaInfosItem) => item.id === selectedValues.value[1])

        if (provice && city) {
            setArea(provice, city)
            showBottomSelect.value = false
        }
    }
}

const submitLoading = ref(false)

type SubmitFields = {
    address: string
    bankcardagain: string
    bankcardnumber: string
    phone: string
    phonecode: string
    username: string
}

class UserBankCheckBank {
    check: string
}

const onSubmit = async (values: Partial<SubmitFields>): Promise<void> => {
    if (active.value === 0) {
        if (isNeedVerifyFirst.value) {
            if (checkChineseName(values.username, "", "开户人姓名必须为中文") || checkBankCard(values.bankcardnumber)) return
        } else {
            if (
                checkChineseName(values.username, "", "开户人姓名必须为中文") ||
                checkBankCard(values.bankcardnumber) ||
                checkBankCard(values.bankcardagain)
            )
                return
            if (values.bankcardnumber !== values.bankcardagain) {
                showToast({
                    className: "vk-toast-fail",
                    message: "两次卡号输入不一致",
                    icon: "warning"
                })
                return
            }
        }
        submitLoading.value = true
        try {
            // 验证银行卡
            if (isNeedVerifyFirst.value) {
                const params = {
                    account_name: values.username,
                    account: values.bankcardnumber
                }

                HttpPlus.setUrlOptions(ApiSetting.user.checkUserBank)
                const res = await HttpPlus.sendHttpRequest<UserBankCheckBank, typeof params>(params)

                submitLoading.value = false
                if (res.status === 1) {
                    resetAllForm()
                    checkNum.value = Number(res.data.check)
                    if (!freshStore.bankInfo.length) {
                        freshStore.loadAreaBank()
                    }
                }
            } else {
                // 确认银行卡
                confirmLast.value = "banklast"
            }
        } catch (error: unknown) {
            submitLoading.value = false
            throw error
        }
    }
    if (active.value === 1) {
        // 确认账户
        confirmLast.value = "coinLast"
    }
}

// 最终绑定
const handleAddEnd = async (): Promise<void> => {
    systemParams.PageLoading = true
    if (active.value === 0) {
        const params = {
            account: bankcardnumber.value,
            account_name: username.value,
            bank_id: currentBank.value.bank_id,
            province: currentCity.value.provinceId,
            city: currentCity.value.cityId,
            check: checkNum.value ? checkNum.value : ""
        }
        HttpPlus.setUrlOptions(ApiSetting.user.addUserBankCard)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        systemParams.PageLoading = false

        if (res.status === 1) {
            showToast({ className: "vk-toast-success", message: res.message, icon: "checked" })
            showBindPop.value = false
            resetAllForm()
            loadUserBankInfo()
        }
    }

    if (active.value === 1) {
        const params = {
            check: codeCheck.value,
            bank_id: currentCoin.value.bank_id,
            bank_url: address.value,
            phone_verify: phonecode.value
        }
        HttpPlus.setUrlOptions(ApiSetting.user.addVirtualBank)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        systemParams.PageLoading = false

        if (res.status === 1) {
            showToast({ className: "vk-toast-success", message: res.message, icon: "checked" })
            showBindPop.value = false
            resetAllForm()
            loadCoinInfo()
        }
    }
}

// 账户列表
const list = computed<UserBankUserBankListBanks | UserVirtualBankUserBankListBanks>(() => {
    if (active.value === 0) {
        return userBankList.value
    }
    if (active.value === 1) {
        return userCoinList.value
    }
    return []
})

const showAddBtn = computed<boolean>(() => {
    if (active.value === 0) {
        return userBankInfo.value.count < userBankInfo.value.bankLimit && !bankLocked.value
    }
    if (active.value === 1) {
        return userCoinInfo.value.count < userCoinInfo.value.bankLimit && !coinLocked.value
    }
    return false
})

const showRightTitle = computed<boolean>(() => {
    if (active.value === 0) {
        return !noBankCard.value
    }
    if (active.value === 1) {
        return !noCoinCard.value
    }
    return false
})
const headRightTitle = computed<"已锁定" | "锁定">(() => {
    if (active.value === 0 && bankLocked.value) {
        // 银行卡锁定
        return "已锁定"
    }
    if (active.value === 1 && coinLocked.value) {
        // 虚拟币锁定
        return "已锁定"
    }
    return "锁定"
})

const active = ref(0)

const NAV = [
    {
        key: "card",
        name: "银行卡"
    },
    {
        key: "coin",
        name: "虚拟币"
    }
]

const showLockInfo = ref(false)
const showCancelBtn = ref(false)
const lockInfoTitle = ref("")
const confirmButtonText = ref("")

const handleLock = (): void => {
    if (active.value === 0) {
        // 银行卡锁定提示
        if (bankLocked.value) {
            lockInfoTitle.value = "银行卡账户已锁定"
            showCancelBtn.value = false
            confirmButtonText.value = "知道了"
        } else {
            lockInfoTitle.value = "锁定银行卡账户"
            showCancelBtn.value = true
            confirmButtonText.value = "确认锁定"
        }
        showLockInfo.value = true
    }
    if (active.value === 1) {
        // 虚拟币锁定提示
        if (coinLocked.value) {
            lockInfoTitle.value = "虚拟币账户已锁定"
            showCancelBtn.value = false
            confirmButtonText.value = "知道了"
        } else {
            lockInfoTitle.value = "锁定虚拟币账户"
            showCancelBtn.value = true
            confirmButtonText.value = "确认锁定"
        }
        showLockInfo.value = true
    }
}

const confirmLockInfo = async (): Promise<void> => {
    // 确认锁定银行卡
    if (active.value === 0 && !bankLocked.value) {
        HttpPlus.setUrlOptions(ApiSetting.user.lockBankCard)
        const res = await HttpPlus.sendHttpRequest()
        if (res.status === 1) {
            bankLocked.value = true
            showToast({
                className: "vk-toast-success",
                message: "锁定成功",
                icon: "checked",
                duration: 1200
            })
        }
    }
    // 确认锁定虚拟币
    if (active.value === 1 && !coinLocked.value) {
        HttpPlus.setUrlOptions(ApiSetting.user.virtuallockBank)
        const res = await HttpPlus.sendHttpRequest()
        if (res.status === 1) {
            coinLocked.value = true
            showToast({
                className: "vk-toast-success",
                message: "锁定成功",
                icon: "checked",
                duration: 1200
            })
        }
    }
}

// 绑定弹窗上面的标题
const bindPopTitle = computed<string>(() => {
    if (active.value === 0) {
        if (confirmLast.value === "banklast") {
            return "确认账户"
        } else {
            if (userBankInfo.value.count && !checkNum.value) {
                return "验证银行卡"
            } else {
                return "添加银行卡"
            }
        }
    }
    if (active.value === 1) {
        if (confirmLast.value === "coinLast") {
            return "确认账户"
        } else {
            return "添加虚拟币账户"
        }
    }
    return ""
})

const resetAllForm = (): void => {
    username.value = ""
    bankcardnumber.value = ""
    bankcardagain.value = ""
    currentCity.value = {}
    selectedValues.value = []
    BottomType.value = ""
    currentBankId.value = 0
    currentCoinId.value = 0
    confirmLast.value = ""
    resetForm()
}

const showBindPop = ref(false)
// 处理绑定
const handleToBind = (): void => {
    //  先清空表单
    resetAllForm()
    if (active.value === 0) {
        // 绑定银行卡,
        showBindPop.value = true
    }
    if (active.value === 1) {
        // 绑定虚拟币前，必须有一张银行卡已绑定
        if (noBankCard.value) {
            showDialog({
                title: "虚拟币账户绑定提示",
                message: "至少绑定一张银行卡账户后,才能绑定虚拟币账户。",
                className: "vk-confirm-dialog",
                confirmButtonText: "知道了",
                width: 300
            })
                .then(() => {})
                .catch(() => {
                    // on cancel
                })
        } else {
            if (!freshStore.CryptoCurrencyInfo.length) {
                freshStore.loadCryptoCurrency()
            }
            showBindPop.value = true
        }
    }
}

// 设置默认收款账户
const setDefalut = (card: UserBankUserBankListBanks[number] | UserVirtualBankUserBankListBanks[number]) => {
    if (card.is_default) {
        return
    }
    showConfirmDialog({
        title: "设为默认收款账户",
        message:
            "将此账户设定为默认收款账户后，每次提现时将默认选中该账户，如在提款时需要临时更换其他账户作为收款账户，您可在提现界面手动更换。",
        messageAlign: "left",
        className: "vk-confirm-dialog",
        width: 300,
        confirmButtonText: "确认",
        confirmButtonColor: "#07f1b7"
    }).then(async (): Promise<void> => {
        const params = {
            bank_id: card.id,
            type: "set"
        }

        if (active.value === 0) {
            // 设置银行卡默认收款账户
            HttpPlus.setUrlOptions(ApiSetting.user.setDefaultBank)
            const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
            if (res.status === 1) {
                loadUserBankInfo()
                showToast({
                    className: "vk-toast-success",
                    message: "设置成功",
                    icon: "checked"
                })
            }
        }
        if (active.value === 1) {
            HttpPlus.setUrlOptions(ApiSetting.user.setDefaultVirtual)
            const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
            if (res.status === 1) {
                loadCoinInfo()
                showToast({
                    className: "vk-toast-success",
                    message: res.message,
                    icon: "checked"
                })
            }
        }
    })
}

//加载用户银行卡信息
const loadUserBankInfo = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.user.getUserBankList)
    const res = await HttpPlus.sendHttpRequest<UserBankUserBankList>()

    if (res.status === 1) {
        userBankInfo.value = res.data

        bankLocked.value = Boolean(res.data.bank_lock)
        noBankCard.value = !res.data.count

        userBankList.value = []
        if (res.data.banks && res.data.banks.length) {
            userBankList.value = res.data.banks
        }
    }
}

//加载虚拟币列表
const loadCoinInfo = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.user.getVirtualBankList)
    const res = await HttpPlus.sendHttpRequest<UserVirtualBankUserBankList>()

    if (res.status === 1) {
        userCoinInfo.value = res.data
        coinLocked.value = Boolean(res.data.bank_lock)
        noCoinCard.value = !res.data.count

        userCoinList.value = []
        if (res.data.banks && res.data.banks.length) {
            userCoinList.value = res.data.banks
        }
    }
}

if (route.query.type) {
    active.value = Number(route.query.type)
}

watch(active, (val) => {
    if (val == 0) {
        loadUserBankInfo()
    }
    if (val == 1) {
        loadCoinInfo()
    }
})

if (route.query.type) {
    loadCoinInfo()
}

loadUserBankInfo()

freshStore.loadAreaBank()
freshStore.loadCryptoCurrency()
</script>

<template>
    <div class="finance-page bg-light-green">
        <HeaderBar :class="{ showRightTitle: showRightTitle }">
            <div class="header_title">收款账户</div>
            <template #right>
                <div @click="handleLock" v-if="showRightTitle" class="w-60px text-right text-16px">
                    {{ headRightTitle }}
                </div>
            </template>
        </HeaderBar>
        <div class="expand-page font-classic relative">
            <van-tabs border background="#e8f1ef" v-model:active="active">
                <van-tab v-for="(item, index) in NAV" :title="item.name" :key="index"></van-tab>
            </van-tabs>
            <div>
                <section class="bank_card_main">
                    <div class="text-center text-#c6d0db text-12px">
                        <p
                            class="my-8px"
                            v-if="(active === 0 && !bankLocked && !noBankCard) || (active === 1 && !coinLocked && !noCoinCard)"
                        >
                            轻触{{ active === 0 ? "银行卡" : "虚拟币" }}账户，即可更换默认账户
                        </p>
                        <p class="my-8px" v-if="(active === 0 && bankLocked) || (active === 1 && coinLocked)">
                            所有{{ active === 0 ? "银行卡" : "虚拟币" }}账户已被锁定，无法更换或删除，
                            <span class="text-#07f1b7 underline" @click="handleLock">了解详情</span>
                        </p>
                    </div>

                    <!-- 账户列表 -->
                    <div
                        class="bank_card_box"
                        :class="{ 'dark-shaow': active === 1 }"
                        :style="{
                            background: 'linear-gradient(135deg,' + card.bank_color[0] + ',' + card.bank_color[1] + ')',
                            boxShadow: ' 0px 4px 8px 0 ' + hexToRgb(card.bank_color[1])
                        }"
                        v-for="(card, index) in list"
                        @click="setDefalut(card)"
                        :key="index"
                    >
                        <div class="bank_type">
                            <span class="bank_icon">
                                <img :src="card.logo" alt="" />
                            </span>
                            <span class="bank_name">{{ card.bank_name }}</span>
                        </div>
                        <span class="bank_account" v-if="active === 0">
                            {{ formatterBankCard("show_account" in card ? card.show_account : "") }}
                        </span>
                        <p class="vb_account" v-show="active === 1">{{ card.bank_url }}</p>
                        <img class="svg_wrapper" :src="card.svg || card.logo_back" />
                        <div class="default_card_mark" v-show="card.is_default">默认</div>
                    </div>

                    <!-- 添加按钮 -->
                    <div class="to_add_card" @click="handleToBind" v-if="showAddBtn">
                        <i>+</i>
                        <span>添加{{ active === 0 ? "银行卡" : "虚拟币" }}账户</span>
                    </div>
                    <p v-if="active === 0" class="my-8px text-center text-#c6d0db text-12px">
                        一个账户只能绑定{{ userBankInfo?.bankLimit || 5 }}个银行卡账户
                    </p>
                    <p v-if="active === 1" class="my-8px text-center text-#c6d0db text-12px">
                        一个账户只能绑定{{ userCoinInfo?.bankLimit || 5 }}个虚拟币账户
                    </p>
                </section>
            </div>
        </div>
        <van-dialog
            className="bg-white!"
            v-model:show="showLockInfo"
            :title="lockInfoTitle"
            @confirm="confirmLockInfo"
            :show-cancel-button="showCancelBtn"
            :confirmButtonText="confirmButtonText"
        >
            <div class="leading-relaxed text-12px px-14px py-10px">
                <p class="tit text-#07f1b7">Q:为什么锁定{{ active === 0 ? "银行卡" : "虚拟币" }}账户</p>
                <p class="con scale-88 origin-top-left whitespace-nowrap block">
                    A:锁定{{ active === 0 ? "银行卡" : "虚拟币" }}账户后，您的账号将不能解除已添加的{{
                        active === 0 ? "银行卡" : "虚拟币"
                    }}账户，
                    <br />
                    也不能添加其它新的{{ active === 0 ? "银行卡" : "虚拟币" }}账户，以保障您账号的资金安全。即
                    <br />
                    便账户被他人盗用，您账户的资金也不会被他人提款。锁定之后
                    <br />
                    ，也不会影响您的正常提款操作，及任何功能使用。
                </p>
                <p class="tit text-#07f1b7 titone">Q:如何解锁？</p>
                <p class="con">A:如需解锁，请联系在线客服，客服人员将协助您完成解锁。</p>
            </div>
        </van-dialog>
        <!-- 右侧弹出 -->
        <van-popup
            class="bindbank-overpop bg-#e8f1ef"
            teleport="body"
            v-model:show="showBindPop"
            position="right"
            :style="{ width: '100%', height: '100%' }"
            @close="confirmLast = ''"
        >
            <HeaderBar>
                <template #left>
                    <div @click="showBindPop = false" class="top-icon left-icon"></div>
                </template>
                <div class="header_title">{{ bindPopTitle }}</div>
            </HeaderBar>
            <div v-if="confirmLast === 'banklast'">
                <div class="conline van-hairline--bottom">
                    <p>
                        <span class="fs">银行卡号</span>
                        <span class="fcon">{{ bankcardnumber }}</span>
                    </p>
                    <p class="detailtip">请注意核对：【开头3或4位数】……【末尾3或4位数】</p>
                </div>
                <div class="conline van-hairline--bottom">
                    <p>
                        <span class="fs">银行名称</span>
                        <span class="fcon">{{ currentBank?.bank_name }}</span>
                    </p>
                </div>
                <div class="conline van-hairline--bottom">
                    <p>
                        <span class="fs">开户城市</span>
                        <span class="fcon">{{ currentCity.province }} {{ currentCity.city }}</span>
                    </p>
                </div>
                <div class="conline van-hairline--bottom">
                    <p>
                        <span class="fs">户主姓名</span>
                        <span class="fcon">{{ username }}</span>
                    </p>
                </div>
                <div class="w-340px mt-20px mx-auto">
                    <van-button class="primary-btn text-17px" round block @click="handleAddEnd">确认</van-button>
                </div>
                <p class="comfirmtip">为了保障您的账号安全，添加成功的银行卡账户不可自行移除或修改，请您校对您的账户信息</p>
            </div>
            <div v-else-if="confirmLast === 'coinLast'">
                <div class="conline van-hairline--bottom">
                    <p>
                        <span class="fs">虚拟币币种</span>
                        <span class="fcon">{{ currentCoin.bank_name }}</span>
                    </p>
                    <p class="detailtip">请注意核对：【币种】-【链类型】</p>
                </div>
                <div class="conline van-hairline--bottom">
                    <p>
                        <span class="fs">虚拟币账户</span>
                        <span class="fcon">{{ address }}</span>
                    </p>
                </div>
                <p class="detailtip outtip">请注意核对：【开头4位数】……【末尾4位数】</p>
                <div class="w-340px mt-20px mx-auto">
                    <van-button class="primary-btn text-17px" round block @click="handleAddEnd">确认</van-button>
                </div>
                <p class="comfirmtip">为了保障您的账号安全，添加成功的虚拟币账户不可自行移除或修改，请您校对您的账户信息</p>
            </div>
            <div class="pt-12px" v-else>
                <van-form
                    :label-width="active === 1 ? '0.64rem' : '0.8rem'"
                    :input-align="active === 0 ? 'right' : 'left'"
                    class="form_box"
                    @submit="onSubmit"
                >
                    <van-field
                        v-if="active === 0"
                        class="bg-transparent text-16px"
                        v-model="username"
                        clearable
                        name="username"
                        :maxlength="18"
                        :formatter="formatterStr"
                        autocomplete="off"
                        label="开户人"
                        size="large"
                        :placeholder="isNeedVerifyFirst ? '请输入最后一次开户人姓名' : '请输入开户人真实姓名'"
                    />
                    <van-cell
                        v-if="!isNeedVerifyFirst && active == 0"
                        class="bg-transparent"
                        size="large"
                        title="选择银行"
                        @click="selectBank"
                        is-link
                    >
                        <template #value>
                            <span class="text-#262933 text-16px">{{ currentBank?.bank_name }}</span>
                        </template>
                    </van-cell>
                    <van-cell
                        v-if="!isNeedVerifyFirst && active == 0"
                        class="bg-transparent"
                        size="large"
                        title="开户城市"
                        @click="selectCity"
                        is-link
                    >
                        <template #value>
                            <div class="text-#262933 text-16px">
                                <span>{{ currentCity?.province }}</span>
                                <span class="ml-5px">{{ currentCity?.city }}</span>
                            </div>
                        </template>
                    </van-cell>
                    <van-field
                        v-if="active === 0"
                        class="bg-transparent text-16px"
                        v-model="bankcardnumber"
                        type="digit"
                        clearable
                        name="bankcardnumber"
                        :maxlength="19"
                        :formatter="formatterStr"
                        autocomplete="off"
                        label="银行卡号"
                        size="large"
                        :placeholder="isNeedVerifyFirst ? '请填写最后一次绑定的银行卡号' : '银行卡号由16位数字或19位数字组成'"
                    />
                    <van-field
                        v-if="!isNeedVerifyFirst && active == 0"
                        class="bg-transparent text-16px"
                        v-model="bankcardagain"
                        type="digit"
                        clearable
                        name="bankcardagain"
                        :maxlength="19"
                        :formatter="formatterStr"
                        autocomplete="off"
                        label="确认卡号"
                        size="large"
                        onpaste="return false"
                        placeholder="只能手动输入，不能粘贴"
                    />
                    <!-- 添加虚拟币账户 -->
                    <van-field
                        v-if="active === 1"
                        class="bg-transparent text-16px"
                        v-model="phone"
                        name="phone"
                        type="digit"
                        clearable
                        :formatter="formatterPhone"
                        :maxlength="systemParams.countryCode.number === '86' ? 13 : 16"
                        autocomplete="off"
                        label="手机号"
                        size="large"
                        placeholder="请输入注册的手机号码"
                    />
                    <div class="input_box hstack pr-16px" v-if="active === 1">
                        <div class="login_icon ver_icon"></div>
                        <van-field
                            class="bg-transparent text-16px"
                            v-model.trim="phonecode"
                            name="phonecode"
                            :maxlength="6"
                            clearable
                            :formatter="formatterStr"
                            autocomplete="off"
                            label="验证码"
                            size="large"
                            placeholder="请输入短信验证码"
                        />
                        <div class="min-w-100px">
                            <van-button
                                class="send_vercode_btn rounded-20px px-8px border-#07e9f1 bg-transparent"
                                block
                                @click="handleSendVerCode(10)"
                                :loading="codeloading"
                                :disabled="!!checkPhone(phone, systemParams.countryCode.number).length || isCountDown"
                                :class="{
                                    'primary-btn text-old-text': !checkPhone(phone, systemParams.countryCode.number).length
                                }"
                                size="small"
                            >
                                <template v-if="isCountDown">{{ countdownTime.seconds }}s</template>
                                <template v-else>{{ codeSended ? "重新发送" : "发送验证码" }}</template>
                            </van-button>
                        </div>
                    </div>
                    <van-cell v-if="active == 1" class="bg-transparent" size="large" title="币种" @click="selectCoin" is-link>
                        <template #value>
                            <span class="text-#262933 text-16px">{{ currentCoin?.bank_name }}</span>
                        </template>
                    </van-cell>
                    <van-field
                        v-if="active === 1"
                        class="bg-transparent text-16px"
                        v-model="address"
                        name="address"
                        type="textarea"
                        rows="1"
                        maxlength="65"
                        autosize
                        clearable
                        :formatter="formatterStr"
                        autocomplete="off"
                        label="地址"
                        size="large"
                        placeholder="请输入虚拟币地址"
                    />
                    <div class="w-340px mt-20px mx-auto">
                        <van-button
                            class="primary-btn text-17px"
                            round
                            block
                            :disabled="submitDiabled"
                            :loading="submitLoading"
                            native-type="submit"
                        >
                            {{ active === 0 && isNeedVerifyFirst ? "下一步" : "确认" }}
                        </van-button>
                    </div>
                </van-form>
            </div>
        </van-popup>

        <!-- 底部弹出 银行卡选择/虚拟币选择-->
        <van-popup
            class="deposit-bank-overpop"
            teleport="body"
            v-model:show="showBottomSelect"
            position="bottom"
            @close="BottomType = ''"
        >
            <template v-if="BottomType === 'city'">
                <van-picker
                    @confirm="confirmCity"
                    @cancel="showBottomSelect = false"
                    title="选择地区"
                    v-model="selectedValues"
                    :columns="freshStore.AreaInfo"
                />
            </template>
            <div class="bank_list_popup" v-else>
                <div class="popup_title">
                    {{ BottomType === "bank" ? "选择银行卡" : "币种选择" }}
                </div>
                <div class="deposit_bank_list" v-if="BottomType === 'bank'">
                    <van-radio-group v-model="currentBankId">
                        <van-cell
                            class="leading-28px"
                            clickable
                            @click="currentBankId = index"
                            v-for="(bank, index) in freshStore.bankInfo"
                            :key="index"
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
                                <span>{{ bank.bank_name }}</span>
                            </template>
                            <template #right-icon>
                                <van-radio :name="index" />
                            </template>
                        </van-cell>
                    </van-radio-group>
                </div>
                <div class="deposit_bank_list" v-if="BottomType === 'coin'">
                    <van-radio-group v-model="currentCoinId">
                        <van-cell
                            class="leading-28px"
                            clickable
                            @click="currentCoinId = index"
                            v-for="(bank, index) in freshStore.CryptoCurrencyInfo"
                            :key="index"
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
                                <span>{{ bank.bank_name }}</span>
                            </template>
                            <template #right-icon>
                                <van-radio :name="index" />
                            </template>
                        </van-cell>
                    </van-radio-group>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<style lang="scss" scoped>
.com-header {
    &.showRightTitle {
        :deep(.header-left) {
            width: 60px;
        }
    }
}

.bank_card_box {
    box-shadow: 0 3px 10px 0px rgba(0, 0, 0, 0.4);
    height: 1.07rem;
    border-radius: 0.06rem;
    background: #e44d5a;
    color: #fff;
    position: relative;
    box-sizing: border-box;
    padding: 0.15rem 0 0.15rem 0.2rem;
    width: 3.45rem;
    margin: 0 auto 0.15rem;
    &.dark-shaow {
        box-shadow: 0 0.03rem 0.1rem 0 rgb(0 0 0 / 40%) !important;
    }
    .bank_type {
        height: 0.36rem;
        font-size: 0.16rem;
        line-height: 0.36rem;
        .bank_icon {
            display: inline-block;
            width: 0.36rem;
            height: 100%;
            border-radius: 50%;
            text-align: center;
            margin-right: 0.11rem;
            vertical-align: middle;
            background-color: #fff;
            img {
                width: 0.26rem;
                height: 0.26rem;
                border-radius: 50%;
                vertical-align: middle;
            }
        }
        .bank_name {
            display: inline-block;
            height: 100%;
        }
    }
    .vb_account {
        margin-top: 0.17rem;
        color: #262933;
        line-height: normal;
        padding-right: 0.15rem;
        overflow-wrap: anywhere;
        word-break: break-all;
    }
    .bank_account {
        width: 100%;
        display: inline-block;
        margin-top: 0.08rem;
        font-size: 0.24rem;
        font-weight: bold;
        white-space: nowrap;
        letter-spacing: 0.02rem;
    }
    .default_card_mark {
        position: absolute;
        right: 0.2rem;
        top: 0.15rem;
        background-color: rgba(0, 0, 0, 0.3);
        color: #fff;
        width: 0.5rem;
        padding: 0.03rem 0;
        line-height: normal;
        font-size: 0.15rem;
        border-radius: 0.12rem;
        text-align: center;
    }
    .svg_wrapper {
        position: absolute;
        top: 0.1rem;
        right: 0.4rem;
        z-index: 0;
        width: 0.9rem;
        height: 0.9rem;
        z-index: 0;
        opacity: 0.1;
    }
}
.to_add_card {
    border-radius: 0.06rem;
    border: 1px dashed #7c839f;
    font-size: 0.17rem;
    font-weight: 600;
    color: #7c839f;
    width: 3.4rem;
    box-sizing: border-box;
    margin: 0.1rem auto;
    height: 0.45rem;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: normal;
    i {
        color: #27bc74;
        font-size: 0.3rem;
    }
    span {
        margin-left: 0.05rem;
    }
}
</style>
<style lang="scss">
@import "finance.scss";
.bindbank-overpop {
    .form_box {
        .van-cell {
            .van-field__label {
                margin-right: 0 !important;
            }
        }
    }
}
</style>
