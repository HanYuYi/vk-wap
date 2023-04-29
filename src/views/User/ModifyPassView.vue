<script setup lang="ts">
import ApiSetting from "@/api/service"
import { useForm } from "@/composable/form"
import { computed, onBeforeMount, ref } from "vue"
import { useRoute } from "vue-router"
import { useSysStore } from "@/stores/system"
import SuccessToast from "./UserToast.vue"
import { formatterStr, checkPhoneCode, checkPasswordSame, checkPasswordForRegister } from "@/composable/validate"
import { HttpPlus } from "@/api/HttpPlus"
import type { BusinessResponse } from "@/api/HttpPlus"

const {
    codeSended,
    phonecode,
    password,
    repassword,
    isShowPassIcon,
    isShowRePassIcon,
    switchPassIcon,
    switchRePassIcon,
    codeloading,
    isCountDown,
    countdownTime,
    handleSendVerCode,
    resetForm
} = useForm()

const route = useRoute()
const systemParams = useSysStore()

const HeadTitle = computed(() => {
    if (route.query?.type === "1") {
        if ("has_securitypwd" in systemParams.userInfo && systemParams.userInfo.has_securitypwd) {
            return "修改交易"
        } else {
            return "设置交易"
        }
    } else {
        if ("has_loginpwd" in systemParams.userInfo && systemParams.userInfo.has_loginpwd) {
            return "修改账户"
        } else {
            return "设置账户"
        }
    }
})

const saveBtnText = computed(() => {
    if (route.query?.type === "1") {
        if ("has_securitypwd" in systemParams.userInfo && systemParams.userInfo.has_securitypwd) {
            return "确认修改"
        } else {
            return "保存"
        }
    } else {
        if ("has_loginpwd" in systemParams.userInfo && systemParams.userInfo.has_loginpwd) {
            return "确认修改"
        } else {
            return "保存"
        }
    }
})

const ToastTxt = computed(() => {
    if (route.query?.type === "1") {
        return "个人中心"
    }
    return "登录页"
})

const routepath = computed(() => {
    if (route.query?.type === "1") {
        return "/user"
    }
    return "/login"
})

const cupassword = ref("") // 当前密码
const isShowCuPassIcon = ref(true)
const submitLoading = ref(false)

// 切换确认密码显示状态
const switchCuPassIcon = (): void => {
    isShowCuPassIcon.value = !isShowCuPassIcon.value
}

const submitDisable = computed(() => {
    if (
        ("has_securitypwd" in systemParams.userInfo && !systemParams.userInfo.has_securitypwd) ||
        ("has_loginpwd" in systemParams.userInfo && !systemParams.userInfo.has_loginpwd)
    ) {
        return !password.value || !repassword.value || !phonecode.value
    } else {
        return !cupassword.value || !password.value || !repassword.value || !phonecode.value
    }
})

type SubmitParameters = {
    cupassword: typeof cupassword.value
    password: typeof password.value
    repassword: typeof repassword.value
    phonecode: typeof phonecode.value
}

const validateResolve = (values: SubmitParameters): boolean => {
    let validationPassed = false
    if (
        (route.query?.type === "1" && "has_securitypwd" in systemParams.userInfo && systemParams.userInfo.has_securitypwd) ||
        (!route.query?.type && "has_loginpwd" in systemParams.userInfo && systemParams.userInfo.has_loginpwd)
    ) {
        validationPassed = !checkPasswordForRegister(
            values.cupassword,
            "当前密码不能为空",
            "当前密码格式不正确（6~20位字母和数字哦）"
        )
    }
    validationPassed =
        !checkPasswordForRegister(values.password, "新密码不能为空", "新密码格式不正确（6~20位字母和数字哦）") &&
        !checkPasswordForRegister(values.repassword, "确认密码不能为空", "确认密码格式不正确（6~20位字母和数字哦）") &&
        !checkPasswordSame(values.password, values.repassword, "确认密码与新密码不一致")
    !checkPhoneCode(values.phonecode)
    return validationPassed
}

const onSubmit = async (values: SubmitParameters): Promise<void> => {
    if (!validateResolve(values)) return
    const params = {
        old_password: values.cupassword ?? "",
        new_password: values.password,
        renew_password: values.repassword,
        phone_verify: values.phonecode
    }
    submitLoading.value = true
    try {
        let res: BusinessResponse<{}>
        if (route.query?.type === "1") {
            HttpPlus.setUrlOptions(ApiSetting.user.setTradePwd)
            res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        } else {
            HttpPlus.setUrlOptions(ApiSetting.user.setLoginPwd)
            res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        }
        submitLoading.value = false

        if (res.status === 1) {
            if (route.query?.type === "1" && "has_securitypwd" in systemParams.userInfo) {
                systemParams.userInfo.has_securitypwd = true
            }
            systemParams.showSuccessDio = true
            resetForm()
            cupassword.value = ""
            isShowCuPassIcon.value = true
        }
    } catch (error: unknown) {
        submitLoading.value = false
        console.error(error)
    }
}

onBeforeMount(() => {
    resetForm()
})
</script>

<template>
    <div class="personal-page bg-mypageColor">
        <HeaderBar>
            <div class="header_title">{{ HeadTitle }}密码</div>
        </HeaderBar>
        <div class="expand-page py-12px">
            <van-form label-width="80" class="userset-form" @submit="onSubmit">
                <van-cell-group inset>
                    <div
                        class="input_box"
                        v-if="
                            (route.query?.type === '1' && systemParams.userInfo.has_securitypwd) ||
                            (!route.query?.type && systemParams.userInfo.has_loginpwd)
                        "
                    >
                        <van-field
                            :border="false"
                            v-model="cupassword"
                            clearable
                            :type="isShowCuPassIcon ? 'password' : 'text'"
                            name="cupassword"
                            label="当前密码"
                            :maxlength="20"
                            :formatter="formatterStr"
                            placeholder="请输入当前密码"
                        />
                        <div
                            class="login_icon mr-20px ml-0!"
                            :class="[isShowCuPassIcon ? 'eye_close_icon' : 'eye_icon']"
                            @click="switchCuPassIcon"
                        ></div>
                    </div>
                    <div class="input_box">
                        <van-field
                            :border="false"
                            v-model="password"
                            clearable
                            :type="isShowPassIcon ? 'password' : 'text'"
                            name="password"
                            label="新密码"
                            :maxlength="20"
                            :formatter="formatterStr"
                            placeholder="请输入新密码"
                        />
                        <div
                            class="login_icon mr-20px ml-0!"
                            :class="[isShowPassIcon ? 'eye_close_icon' : 'eye_icon']"
                            @click="switchPassIcon"
                        ></div>
                    </div>
                    <div class="input_box">
                        <van-field
                            :border="false"
                            v-model="repassword"
                            clearable
                            :type="isShowRePassIcon ? 'password' : 'text'"
                            name="repassword"
                            label="确认密码"
                            :maxlength="20"
                            :formatter="formatterStr"
                            placeholder="请确认新密码"
                        />
                        <div
                            class="login_icon mr-20px ml-0!"
                            :class="[isShowRePassIcon ? 'eye_close_icon' : 'eye_icon']"
                            @click="switchRePassIcon"
                        ></div>
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
                            @click="route.query?.type === '1' ? handleSendVerCode(9) : handleSendVerCode(8)"
                            :loading="codeloading"
                            :disabled="isCountDown"
                            size="small"
                        >
                            <template v-if="isCountDown">{{ countdownTime.seconds }}s后再次发送</template>
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
                        {{ saveBtnText }}
                    </van-button>
                    <SuccessToast message="密码设置成功!" :path="routepath" :btntxt="ToastTxt" />
                </div>
            </van-form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "common.scss";
</style>
