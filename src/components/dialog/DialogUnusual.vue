<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useForm } from "@/composable/form"
import { formatterStr, checkPhoneCode, checkPasswordForRegister } from "@/composable/validate"
import { useSysStore } from "@/stores/system"
import ApiSetting from "@/api/service"
import { HttpPlus } from "@/api/HttpPlus"
import { showToast } from "vant"

const systemParams = useSysStore()
const {
    codeSended,
    phonecode,
    password,
    repassword,
    isShowPassIcon,
    isShowRePassIcon,
    codeloading,
    isCountDown,
    countdownTime,
    switchPassIcon,
    switchRePassIcon,
    handleSendVerCode,
    resetForm
} = useForm()

const show = ref(false)
const cupassword = ref("") // 当前密码
const isShowCuPassIcon = ref(true)

const switchCuPassIcon = (): void => {
    isShowCuPassIcon.value = !isShowCuPassIcon.value
}

const isSubmitBtnDisable = computed<boolean>(() => {
    if (systemParams.unusualWeakpass) {
        return !password.value || !repassword.value || !cupassword.value || !phonecode.value
    }
    return false
})

const title = computed(() => {
    if (systemParams.unusualLogin) {
        return "异常登录验证"
    }
    if (systemParams.unusualWeakpass) {
        return "修改密码"
    }
    return ""
})

const notice = computed(() => {
    if (systemParams.unusualLogin) {
        return "您好，由于系统检测到您目前在非常用登录地，为了您的账号安全，请验证手机验证码。"
    }
    if (systemParams.unusualWeakpass) {
        return "您好，由于系统检测到您的登录密码属于弱密码，为了您的账号安全，请修改您的登录密码。"
    }
    return ""
})

watch(
    () => systemParams.unusualLogin,
    (val: number) => {
        show.value = !!val
    }
)

watch(
    () => systemParams.unusualWeakpass,
    (val: number) => {
        show.value = !!val
    }
)

type ValidateField = Partial<{
    phonecode: string
    cupassword: string
    password: string
    repassword: string
}>

// 弱密码校验规则
const validateWeakResolve = (values: ValidateField): boolean => {
    let validationPassed = false

    validationPassed =
        !checkPasswordForRegister(values.cupassword, "旧密码不能为空") &&
        !checkPasswordForRegister(values.password, "新密码不能为空") &&
        !checkPasswordForRegister(values.repassword, "确认新密码不能为空") &&
        !checkPhoneCode(values.phonecode)

    return validationPassed
}

// 异常登录校验
const validateLoginResolve = (values: ValidateField): boolean => {
    let validationPassed = false
    validationPassed = !checkPhoneCode(values.phonecode)
    return validationPassed
}

const submitLoading = ref(false)

type SubmitParams = Partial<{
    verfiy_code: ValidateField["phonecode"]
    old_password: ValidateField["cupassword"]
    new_password: ValidateField["password"]
    renew_password: ValidateField["repassword"]
}>
const onSubmit = async (values: ValidateField): Promise<void> => {
    let params: SubmitParams = {}

    if (systemParams.unusualWeakpass) {
        if (!validateWeakResolve(values)) return

        params = {
            old_password: values.cupassword,
            new_password: values.password,
            renew_password: values.repassword
        }
    }

    if (systemParams.unusualLogin) {
        if (!validateLoginResolve(values)) return
    }

    params["verfiy_code"] = values.phonecode

    submitLoading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.index.resetUnusalLogin)
        const res = await HttpPlus.sendHttpRequest<{}, SubmitParams>(params)
        submitLoading.value = false

        if (res.status === 1) {
            resetForm()
            if (systemParams.unusualWeakpass) {
                showToast({ className: "vk-toast-success", message: "密码修改成功", icon: "checked" })
            }
            if (systemParams.unusualLogin) {
                showToast({ className: "vk-toast-success", message: "验证成功", icon: "checked" })
            }
            show.value = false
        }
    } catch (error: unknown) {
        submitLoading.value = false
        throw error
    }
}

const close = (): void => {
    systemParams.unusualWeakpass = 0
    systemParams.unusualLogin = 0
}
</script>

<template>
    <van-dialog teleport="body" v-model:show="show" @close="close" :show-confirm-button="false" className="unusual-diolog">
        <div>
            <div class="title">{{ title }}</div>
            <div class="notice leading-normal">
                {{ notice }}
                <span class="text-old-text font-normal underline" @click="systemParams.UpdateKFDialogShow(true)">联系客服</span>
            </div>
            <div class="text-15px text-light-text leading-22px my-35px">
                预留手机号：
                <span class="leading-22px text-20px text-old-text">{{ systemParams.userInfo.tel }}</span>
            </div>
            <van-form class="form_box" @submit="onSubmit">
                <div class="input_box" v-if="systemParams.unusualWeakpass">
                    <van-field
                        :border="false"
                        v-model="cupassword"
                        clearable
                        :type="isShowCuPassIcon ? 'password' : 'text'"
                        name="cupassword"
                        :maxlength="20"
                        :formatter="formatterStr"
                        placeholder="当前密码"
                    />
                    <div
                        class="login_icon mr-20px ml-0!"
                        :class="[isShowCuPassIcon ? 'eye_close_icon' : 'eye_icon']"
                        @click="switchCuPassIcon"
                    ></div>
                </div>

                <div class="input_box" v-if="systemParams.unusualWeakpass">
                    <van-field
                        :border="false"
                        v-model="password"
                        clearable
                        :type="isShowPassIcon ? 'password' : 'text'"
                        name="password"
                        :maxlength="20"
                        :formatter="formatterStr"
                        placeholder="新密码"
                    />
                    <div
                        class="login_icon mr-20px ml-0!"
                        :class="[isShowPassIcon ? 'eye_close_icon' : 'eye_icon']"
                        @click="switchPassIcon"
                    ></div>
                </div>

                <div class="input_box" v-if="systemParams.unusualWeakpass">
                    <van-field
                        :border="false"
                        v-model="repassword"
                        clearable
                        :type="isShowRePassIcon ? 'password' : 'text'"
                        name="repassword"
                        :maxlength="20"
                        :formatter="formatterStr"
                        placeholder="确认新密码"
                    />
                    <div
                        class="login_icon mr-20px ml-0!"
                        :class="[isShowRePassIcon ? 'eye_close_icon' : 'eye_icon']"
                        @click="switchRePassIcon"
                    ></div>
                </div>

                <div class="input_box phonecode_input_box">
                    <van-field
                        :border="false"
                        v-model.trim="phonecode"
                        name="phonecode"
                        :maxlength="6"
                        clearable
                        :formatter="formatterStr"
                        autocomplete="off"
                        placeholder="手机验证码"
                    />
                    <van-button
                        class="send_vercode_btn"
                        @click="handleSendVerCode(5)"
                        :loading="codeloading"
                        :disabled="isCountDown"
                        size="small"
                    >
                        <template v-if="isCountDown">{{ countdownTime.seconds }}s</template>
                        <template v-else>{{ codeSended ? "重新发送" : "获取验证码" }}</template>
                    </van-button>
                </div>

                <div class="w-295px m-auto my-20px">
                    <van-button
                        class="button_primary_2022 border-none rounded-30px! h-36px! leading-36px!"
                        block
                        :disabled="isSubmitBtnDisable"
                        :loading="submitLoading"
                        native-type="submit"
                    >
                        确定
                    </van-button>
                </div>
            </van-form>
        </div>
    </van-dialog>
</template>

<style lang="scss">
.van-dialog.unusual-diolog {
    width: 345px;
    max-width: 100vw;
    background: #fff;
    text-align: center;
    border-radius: 3px;
    color: var(--vk-old-text-color);
    .title {
        font-size: 17px;
        font-weight: bold;
        line-height: 45px;
        border-bottom: solid 1px #c6d0db;
        width: 100%;
    }
    .notice {
        font-size: 12px;
        padding: 0 10px;
        color: #d1572b;
        margin-top: 15px;
    }
    .form_box {
        font-size: 15px;
        width: 100%;
        padding: 0 10px;
        .login_icon {
            width: 24px;
            height: 24px;
            background-size: 100% 100%;
            margin-left: 10px;
            &.eye_icon {
                background-image: url("@/assets/img/login/pass_c_icon.png");
            }

            &.eye_close_icon {
                background-image: url("@/assets/img/login/pass_p_icon.png");
            }
        }
        .send_vercode_btn {
            margin-left: 26px;
            width: 114px;
            height: 40px;
            border: 1px solid #07e9f1;
            border-radius: 30px;
            font-size: 15px;
            color: var(--vk-old-text-color);
        }
        .input_box {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            position: relative;
            &.phonecode_input_box {
                &::after {
                    width: 175.5px;
                    transform: translateX(0);
                    left: 16px;
                }
                .van-cell {
                    width: 175.5px;
                }
            }
            &::after {
                content: "";
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                bottom: 0;
                height: 1px;
                width: 300px;
                background-color: #c7c7c7;
            }
            input {
                &::placeholder {
                    font-size: 15px;
                }
            }
        }
    }
}
</style>
