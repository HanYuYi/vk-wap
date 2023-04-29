<script setup lang="ts">
import { formatterStr, checkPhone, formatterPhone, checkChineseName } from "@/composable/validate"
import { ref, computed, reactive } from "vue"
import { useSysStore } from "@/stores/system"
import { useFreshStore } from "@/stores/fresh"
import { onBeforeRouteLeave, useRouter } from "vue-router"
import type { Router } from "vue-router"
import ApiSetting from "@/api/service"
import { showToast } from "vant"
import { HttpPlus } from "@/api/HttpPlus"

const router: Router = useRouter()
const systemParams = useSysStore()
const freshStore = useFreshStore()

const headTitle = ref("添加收货地址")
const status = ref("add")
const account = ref("")

type CurrentCity = { province: string; provinceId: number; city: string; cityId: number } | null
let currentCity = reactive<CurrentCity>(null)
const selectedValues = ref<number[]>([])
const showBottom = ref(false)

const username = ref("")
const phone = ref("")
const address = ref("")

const btnDisable = computed<boolean>(() => {
    if (status.value == "account" || status.value == "modifyAccount") {
        return !account.value
    } else {
        // 新增/编辑收货地址
        return (
            !!checkPhone(phone.value, systemParams.countryCode.number).length ||
            !username.value ||
            !address.value ||
            !currentCity?.city
        )
    }
})

type SubmitParameter = { account?: string; username?: string; phone?: string; address?: string }

const validateResolve = (values: SubmitParameter): boolean => {
    let validationPassed = false
    validationPassed =
        !checkChineseName(values.username) &&
        !checkPhone(values.phone, systemParams.countryCode.number) &&
        !!currentCity?.cityId &&
        !!currentCity?.provinceId &&
        !!address.value.length
    return validationPassed
}

// 修改某个快递商品的收货地址
const modifyAddress = async (values: SubmitParameter): Promise<void> => {
    try {
        const routeParams = systemParams.routeParams as Partial<{ id: string | number }>
        const params = {
            delivery_id: routeParams?.id,
            receive: values.username,
            phone: formatterStr(values.phone),
            province: currentCity?.provinceId,
            city: currentCity?.cityId
        }
        HttpPlus.setUrlOptions(ApiSetting.user.modifyExpress)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        btnLoading.value = false

        if (res.status == 1) {
            showToast({
                className: "vk-toast-success",
                message: "我们会尽快发货",
                icon: "checked"
            })
            const timer = setTimeout(() => {
                clearTimeout(timer)
                router.back()
            }, 600)
        }
    } catch (error: unknown) {
        btnLoading.value = false
        console.error(error)
    }
}

const btnLoading = ref(false)

const onSubmit = async (values: SubmitParameter) => {
    if (status.value == "account") {
        // 添加平台账号
        btnLoading.value = true
        const { account } = values
        try {
            const routeParams = systemParams.routeParams as Partial<{ id: string | number; record_id: string | number }>
            const params = {
                package_id: routeParams?.id,
                record_id: routeParams?.record_id,
                account
            }
            HttpPlus.setUrlOptions(ApiSetting.user.openVirGoods)
            const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
            btnLoading.value = false

            if (res.status == 1) {
                showToast({
                    className: "vk-toast-success",
                    message: "我们将尽快充值至您的账号上",
                    icon: "checked"
                })
                const timer = setTimeout(() => {
                    clearTimeout(timer)
                    router.back()
                }, 600)
            }
        } catch (error: unknown) {
            btnLoading.value = false
            console.error(error)
        }
    } else if (status.value == "modifyAccount") {
        btnLoading.value = true
        const { account } = values
        try {
            const routeParams = systemParams.routeParams as Partial<{ id: string | number }>
            const params = {
                delivery_id: routeParams?.id,
                account
            }
            HttpPlus.setUrlOptions(ApiSetting.user.changeAccount)
            const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
            btnLoading.value = false

            if (res.status == 1) {
                showToast({
                    className: "vk-toast-success",
                    message: "修改信息成功，我们将尽快发货",
                    icon: "checked"
                })
                const timer = setTimeout(() => {
                    clearTimeout(timer)
                    router.back()
                }, 600)
            }
        } catch (error: unknown) {
            btnLoading.value = false
            console.error(error)
        }
    } else {
        // 新增/编辑收货地址
        if (!validateResolve(values)) return

        const { username, phone, address } = values
        btnLoading.value = true
        if (status.value == "modify") {
            // 修改快递收货地址
            modifyAddress(values)
        } else {
            const params = {
                address_id: status.value == "edit" ? freshStore.userAddress?.id : null,
                receive: username,
                phone: formatterStr(phone),
                province: currentCity?.provinceId,
                city: currentCity?.cityId,
                address
            }
            for (const props in params) {
                if (!params[props as keyof typeof params]) {
                    delete params[props as keyof typeof params]
                }
            }
            try {
                class UserAddressSaveAddress {
                    address_id: number
                }

                HttpPlus.setUrlOptions(ApiSetting.user.addAddress)
                const res = await HttpPlus.sendHttpRequest<{ address_id: number }, Partial<typeof params>>(params)
                btnLoading.value = false

                if (res.status === 1) {
                    const routeParams = systemParams.routeParams as Partial<{ id: number }>
                    const flag = await freshStore.confirmExpress({
                        address_id: status.value == "add" ? res.data.address_id : freshStore.userAddress?.id,
                        package_id: routeParams?.id
                    })
                    if (flag) {
                        showToast({
                            className: "vk-toast-success",
                            message: "我们会尽快发货",
                            icon: "checked"
                        })
                        const timer = setTimeout(() => {
                            clearTimeout(timer)
                            router.back()
                        }, 600)
                    }
                }
            } catch (error: unknown) {
                btnLoading.value = false
                console.error(error)
            }
        }
    }
}

// 选择了地区
const onConfirm = () => {
    if (selectedValues.value.length) {
        const provice = freshStore.AreaOrigin.find((item: any) => item.id === selectedValues.value[0])
        const city = freshStore.AreaOrigin.find((item: any) => item.id === selectedValues.value[1])
        if (provice && city) {
            setArea(provice?.name, provice?.id, city?.name, city?.id)
            showBottom.value = false
        }
    }
}

// 设置当前地区
const setArea = (province: string, province_id: number, city: string, city_id: number): void => {
    currentCity = reactive<CurrentCity>({
        province,
        provinceId: province_id,
        city,
        cityId: city_id
    })
}

await freshStore.checkAddress()

type SetAreaParameters = Parameters<typeof setArea>

type InitParamsParameter = {
    receive: string
    phone: string
    province: SetAreaParameters[0]
    province_id: SetAreaParameters[1]
    city: SetAreaParameters[2]
    city_id: SetAreaParameters[3]
    address: string
    secret: string
}

const initParams = async (stat: string, params: InitParamsParameter): Promise<void> => {
    status.value = stat
    if (stat === "add") {
        headTitle.value = "添加收货地址"
    }
    if (stat === "edit") {
        headTitle.value = "编辑收货地址"
        currentCity = reactive<CurrentCity>(null)
        let haveAddress = false
        if (freshStore.userAddress) {
            haveAddress = true
        } else {
            haveAddress = await freshStore.checkAddress()
        }
        if (haveAddress) {
            username.value = freshStore.userAddress?.receive
            phone.value = freshStore.userAddress?.phone
            setArea(
                freshStore.userAddress?.province,
                freshStore.userAddress?.province_id,
                freshStore.userAddress?.city,
                freshStore.userAddress?.city_id
            )
            address.value = freshStore.userAddress?.address
        }
    }
    if (stat === "modify") {
        headTitle.value = "修改收货地址"
        currentCity = reactive<CurrentCity>(null)
        username.value = params.receive
        phone.value = params.phone
        setArea(params.province, params.province_id, params.city, params.city_id)
        address.value = params.address
    }
    if (stat === "account" || stat === "modifyAccount") {
        headTitle.value = stat == "account" ? "添加详情信息" : "修改详情信息"
        account.value = params.secret
    }
}

const { deStatus } = systemParams.routeParams as { deStatus: string }
if (deStatus) {
    initParams(deStatus, systemParams.routeParams as InitParamsParameter)
}
freshStore.loadAreaBank()

onBeforeRouteLeave(() => {
    systemParams.routeParams = {}
})
</script>

<template>
    <div class="package-page bg-light-green">
        <HeaderBar>
            <div class="header_title">{{ headTitle }}</div>
        </HeaderBar>

        <div class="expand-page font-classic pt-12px">
            <van-form
                :label-width="status == 'account' || status == 'modifyAccount' ? '1rem' : '0.8rem'"
                label-align="right"
                class="addressForm"
                @submit="onSubmit"
                ref="addressForm"
            >
                <template v-if="status == 'account' || status == 'modifyAccount'">
                    <van-field
                        class="vant-input vant-input-account"
                        v-model="account"
                        :formatter="formatterStr"
                        name="account"
                        label="填写账号信息"
                        placeholder="请输入充值账号或手机号信息"
                        maxlength="50"
                        clearable
                        autocomplete="off"
                    ></van-field>
                </template>
                <template v-else>
                    <van-field
                        class="vant-input vant-input-name"
                        v-model="username"
                        :formatter="formatterStr"
                        name="username"
                        label="收货人姓名"
                        placeholder="请填写真实姓名"
                        maxlength="12"
                        error-message="为了提高发货速度，请填写真实姓名"
                        clearable
                        autocomplete="off"
                    ></van-field>

                    <van-field
                        class="vant-input vant-input-phone"
                        v-model="phone"
                        :formatter="formatterPhone"
                        type="digit"
                        name="phone"
                        placeholder="请输入手机号码"
                        :maxlength="systemParams.countryCode.number === '86' ? 13 : 16"
                        clearable
                        autocomplete="off"
                    >
                        <template #label>
                            <div class="input-label">
                                <span>手机号码</span>
                                <span class="country-num">+86</span>
                            </div>
                        </template>
                    </van-field>
                    <van-cell @click="showBottom = true" class="van-haptics-feedback" title="所在地区" is-link>
                        <div>
                            <span>{{ currentCity?.province }}</span>
                            <span class="ml-5px">{{ currentCity?.city }}</span>
                        </div>
                    </van-cell>

                    <van-field
                        class="vant-input"
                        v-model="address"
                        :formatter="formatterStr"
                        rows="2"
                        autosize
                        maxlength="50"
                        type="textarea"
                        name="address"
                        label="详细地址"
                        show-word-limit
                        placeholder="请填写您的详细地址"
                        clearable
                        autocomplete="off"
                    ></van-field>
                </template>
                <div class="w-325px mx-auto mt-30px">
                    <van-button
                        :disabled="btnDisable"
                        :loading="btnLoading"
                        class="button_primary_2022 rounded-30px! border-none h-40px! leading-40px! font-bold text-17px!"
                        rounded
                        block
                        native-type="submit"
                    >
                        {{ status == "account" || status == "modifyAccount" ? "确认提交" : "保存" }}
                    </van-button>
                </div>
            </van-form>
        </div>
        <!-- 底部弹出 -->
        <van-popup v-model:show="showBottom" position="bottom">
            <van-picker
                @confirm="onConfirm"
                @cancel="showBottom = false"
                title="选择地区"
                v-model="selectedValues"
                :columns="freshStore.AreaInfo"
            />
        </van-popup>
    </div>
</template>

<style lang="scss" scoped>
.addressForm {
    .van-cell {
        background: transparent;
        font-size: 16px;
        line-height: 0.24rem;
        padding: 0.16rem 0.17rem;
        &:deep(.van-cell__title) {
            margin-right: 16px;
            font-size: 15px;
            color: #262933;
            text-align: right;
            flex: 0 0 auto;
        }
        &:deep(.van-cell__value) {
            text-align: left;
            font-size: 15px;
            color: #262933;
        }
        &.vant-input-name {
            padding-bottom: 0;
        }
        &.vant-input-phone {
            :deep(.van-field__label) {
                width: 120px !important;
                margin-right: 20px;
                position: relative;
                &::after {
                    content: "";
                    position: absolute;
                    top: 0.02rem;
                    right: -0.07rem;
                    width: 0.01rem;
                    height: 0.2rem;
                    background-color: #c6d0db;
                }
                .country-num {
                    margin-left: 0.12rem;
                    color: #f0c237;
                }
            }
        }
        :deep(.van-field__label) {
            margin-right: 16px;
            font-size: 15px;
            color: #262933;
        }
        :deep(.van-field__error-message) {
            position: relative;
            padding-left: 0.04rem;
            font-size: 0.12rem;
            left: -0.9rem;
            top: 0.014rem;
            color: #7c839f;
            &::before {
                content: "*";
                position: absolute;
                left: -0.01rem;
                color: #f80000;
            }
        }
    }
}
</style>
