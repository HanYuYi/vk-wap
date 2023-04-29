<script setup lang="ts">
import SuccessToast from "./UserToast.vue"
import ApiSetting from "@/api/service"
import { useForm } from "@/composable/form"
import { ref, computed } from "vue"
import { useSysStore } from "@/stores/system"
import { checkPhone, formatterPhone, formatterStr } from "@/composable/validate"
import type ExtraGetCountryPrefix from "@/api/pojo/ExtraGetCountryPrefix"
import { HttpPlus } from "@/api/HttpPlus"

const { codeSended, phone, phonecode, codeloading, isCountDown, countdownTime, handleSendVerCode, resetForm } = useForm()
const systemParams = useSysStore()

const HeadTitle = computed(() => {
    if (systemParams.userInfo.tel && !showBindPhone.value) {
        return "验证原手机号"
    }
    return "绑定新手机号"
})

const BtnTitle = computed(() => {
    if (systemParams.userInfo.tel && !showBindPhone.value) {
        return "确认"
    }
    return "保存"
})

const showBindPhone = ref(false)

// 展示国家区号和手机号码
const show = ref(false)
const selectedId = ref<ExtraGetCountryPrefix["value"][]>([])
const customFieldName = {
    text: "name"
}

const onConfirm = (): void => {
    const choose = systemParams.countryCodeList.find((item: ExtraGetCountryPrefix) => item.value === selectedId.value[0])
    if (choose) {
        systemParams.countryCode = choose
        show.value = false
    }
}

const submitLoading = ref(false)

const submitDisable = computed<boolean>(() => {
    return !!checkPhone(phone.value, systemParams.countryCode.number).length || !phonecode.value
})

type SubmitParameters = {
    phone: typeof phone.value
    phonecode: typeof phonecode.value
}

const onSubmit = async (values: SubmitParameters): Promise<void> => {
    const params = {
        tel: formatterStr(values.phone),
        phone_verify: values.phonecode,
        prefix: selectedId.value[0] ? selectedId.value[0] : systemParams.countryCode.number
    }
    submitLoading.value = true
    // 验证已经存在的号码
    if (systemParams.userInfo.tel && !showBindPhone.value) {
        try {
            HttpPlus.setUrlOptions(ApiSetting.user.verPhoneNumber)
            const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
            submitLoading.value = false
            if (res.status === 1) {
                showBindPhone.value = true
                resetForm()
            }
        } catch (error: unknown) {
            submitLoading.value = false
            console.error(error)
        }
    } else {
        // 绑定新的手机号
        try {
            HttpPlus.setUrlOptions(showBindPhone.value ? ApiSetting.user.updatePhone : ApiSetting.user.bindPhone)
            const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
            submitLoading.value = false
            if (res.status === 1) {
                systemParams.userInfo.tel = formatterStr(values.phone).slice(0, -4) + "****"
                systemParams.showSuccessDio = true
                resetForm()
            }
        } catch (error: unknown) {
            submitLoading.value = false
            console.error(error)
        }
    }
}

systemParams.getAreaCode()
</script>

<template>
    <div class="personal-page bg-mypageColor">
        <HeaderBar>
            <div class="header_title">{{ HeadTitle }}</div>
        </HeaderBar>
        <div class="expand-page py-12px">
            <van-form label-width="80" class="userset-form" @submit="onSubmit">
                <van-cell-group inset>
                    <div class="input_box">
                        <van-field
                            :border="false"
                            v-model="phone"
                            type="digit"
                            clearable
                            :formatter="formatterPhone"
                            :maxlength="systemParams.countryCode.number === '86' ? 13 : 16"
                            name="phone"
                            autocomplete="off"
                            placeholder="请输入手机号码"
                        >
                            <template #label>
                                <div class="text-center right-line" @click="show = true">
                                    <span>+</span>
                                    <span>{{ systemParams.countryCode.number }}</span>
                                    <i class="down-arrow"></i>
                                </div>
                            </template>
                        </van-field>
                    </div>
                    <div class="input_box phonecode_input_box" :class="{ phonecode_input_cding: isCountDown }">
                        <van-field
                            :border="false"
                            v-model.trim="phonecode"
                            name="phonecode"
                            label="手机验证码"
                            :maxlength="6"
                            clearable
                            :formatter="formatterStr"
                            placeholder="请输入短信验证码"
                        />
                        <van-button
                            class="send_vercode_btn"
                            :class="{
                                'opacity-100 bg-#f6f8f8 border-#dcdcdd! text-#bbbbbc!': isCountDown
                            }"
                            @click="systemParams.userInfo.tel && !showBindPhone ? handleSendVerCode(7) : handleSendVerCode(6)"
                            :loading="codeloading"
                            :disabled="!!checkPhone(phone, systemParams.countryCode.number).length || isCountDown"
                            size="small"
                        >
                            <template v-if="isCountDown">{{ countdownTime.seconds }}s 后再次发送</template>
                            <template v-else>{{ codeSended ? "重新发送" : "发送验证码" }}</template>
                        </van-button>
                    </div>
                </van-cell-group>
                <div class="mt-20px w-351px m-auto">
                    <van-button
                        block
                        :disabled="submitDisable"
                        :loading="submitLoading"
                        class="button_primary_2022 border-none h-45px! leading-45px! font-bold text-white!"
                        :class="{
                            'from-#d7dede! to-#d0d8d6! bg-gradient-to-r! opacity-100!': submitDisable
                        }"
                        native-type="submit"
                    >
                        {{ BtnTitle }}
                    </van-button>
                    <SuccessToast message="手机号绑定成功!" />
                </div>
            </van-form>
        </div>
        <van-popup
            :overlayStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }"
            round
            teleport="body"
            class="question-overpop"
            v-model:show="show"
            position="bottom"
        >
            <van-picker
                @confirm="onConfirm"
                @cancel="show = false"
                v-model="selectedId"
                :columns-field-names="customFieldName"
                title="选择地区"
                :columns="systemParams.countryCodeList"
            />
        </van-popup>
    </div>
</template>

<style lang="scss" scoped>
@import "common.scss";
</style>
