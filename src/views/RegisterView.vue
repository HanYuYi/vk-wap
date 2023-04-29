<script setup lang="ts">
import Validator from "@/components/Validator.vue"
import DialogRegLeave from "@/components/dialog/DialogRegLeave.vue"
import ApiSetting from "@/api/service"
import { HttpPlus } from "@/api/HttpPlus"
import { onMounted, onUnmounted, ref, computed } from "vue"
import {
    checkPhone,
    formatterPhone,
    formatterStr,
    checkUsernameForRegister,
    checkPasswordForRegister
} from "@/composable/validate"
import { useSysStore } from "@/stores/system"
import { useLoginStore } from "@/stores/loginRegister"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { useForm } from "@/composable/form"
import { showToast } from "vant"
import type { IndexRegister } from "@/api/pojo/IndexRegister"

const systemParams = useSysStore()
const loginStore = useLoginStore()
const router: Router = useRouter()
const {
    codeSended,
    phone,
    phonecode,
    username,
    password,
    verifycode,
    verifyBotion,
    isShowPassIcon,
    codeloading,
    isCountDown,
    countdownTime,
    switchPassIcon,
    handleSendVerCode,
    resetForm
} = useForm()

const invitecode = ref("")

const isSubmitBtnDisable = computed<boolean>(() => {
    if (loginStore.registerMode === "phone") {
        return !!checkPhone(phone.value, systemParams.countryCode.number).length || !phonecode.value.length
    }
    if (loginStore.registerMode === "username") {
        // 图片验证码模式
        if (loginStore.loginRegModelData.verfiy === 0) {
            return !username.value.length || !password.value.length || !verifycode.value.length
        } else {
            // 极速验证模式
            return !username.value.length || !password.value.length || !verifyBotion.value
        }
    }
    return false
})

// 用户名注册模式下，验证所有输入是否可以提交

interface RegisterBaseFiled {
    invitecode: string
}
// 手机注册
interface PhoneRegisterFormFiled extends RegisterBaseFiled {
    phone: string
    phonecode: string
}
// 账号注册
interface AccountRegisterFormFiled extends RegisterBaseFiled {
    password: string
    username: string
}

const validateResolve = (values: PhoneRegisterFormFiled | AccountRegisterFormFiled): boolean => {
    let validationPassed = false

    if ("username" in values && "password" in values) {
        validationPassed = !checkUsernameForRegister(values.username) && !checkPasswordForRegister(values.password)
    }

    if (validationPassed) {
        if (loginStore.loginRegModelData.verfiy === 0) {
            validationPassed = !!verifycode.value
        } else {
            validationPassed = !!verifyBotion.value
        }
    }
    return validationPassed
}

const verifyRef = ref<{
    reset: () => void
} | null>(null)

const submitLoading = ref(false)

const onSubmit = async (values: PhoneRegisterFormFiled | AccountRegisterFormFiled): Promise<void> => {
    let params
    if (loginStore.registerMode === "username" && "username" in values && "password" in values) {
        if (!validateResolve(values)) return

        params = {
            username: values.username,
            password: values.password,
            repassword: values.password,
            invite_number: values.invitecode,
            verify_code: verifycode.value,
            has_read: 1,
            register_type: 0,
            gt_version: 4,
            ...verifyBotion.value
        }
    } else if ("phone" in values) {
        params = {
            phone: formatterStr(values.phone),
            prefix: systemParams.countryCode.number,
            invite_number: values.invitecode,
            phone_verify: values.phonecode,
            has_read: 1,
            register_type: 2
        }
    }

    submitLoading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.index.register)
        const res = await HttpPlus.sendHttpRequest<IndexRegister>(params)
        submitLoading.value = false

        console.info("注册响应：", res)
        if (res.status === 1) {
            showToast({ className: "vk-toast-success", message: res.message, icon: "checked" })

            systemParams.isLogin = true

            systemParams.updateUserInfo<IndexRegister>(res.data)

            const timer = setTimeout(() => {
                clearTimeout(timer)
                resetForm()
                router.push("/")
            }, 400)
        } else {
            // 仅当用户名方式注册时生效的逻辑
            if (loginStore.registerMode === "username") {
                if (verifyRef.value) {
                    verifyRef.value.reset()
                }
            }
        }
    } catch (error: unknown) {
        submitLoading.value = false
        throw error
    }
}

const switchMode = (): void => {
    resetForm()
    if (loginStore.registerMode === "phone") {
        loginStore.registerMode = "username"
    } else {
        loginStore.registerMode = "phone"
    }
}

const getVerfy = (val: { tag: "img" | "botion"; res: Record<string, string> | string }): void => {
    if (typeof val.res === "string" && val.tag === "img") {
        verifycode.value = val.res
    }
    if (typeof val.res === "object" && val.tag === "botion") {
        verifyBotion.value = val.res
    }
}

onMounted(() => {
    document.body.style.backgroundColor = "#212432"
    loginStore.loginRegInit()
})

onUnmounted(() => {
    document.body.style.backgroundColor = ""
    loginStore.registerMode = "phone"
})
</script>

<template>
    <div class="login-reg-page bg-#212432">
        <HeaderBar />
        <div class="register-wrapper expand-page hstack flex-col justify-between px-24px">
            <div class="w-full">
                <div class="text-white text-24px leading-58px font-bold">
                    {{ loginStore.registerMode === "phone" ? "手机注册" : "账号注册" }}
                    <i class="tag relative inline-block text-13px text-primary-green font-normal w-222.5px h-48.5px">
                        <span class="block mt12px ml-43px leading-none">{{ loginStore.loginRegModelData.registerTips }}</span>
                    </i>
                </div>
                <van-form class="form_box" @submit="onSubmit">
                    <!-- 手机号注册 -->
                    <template v-if="loginStore.registerMode === 'phone'">
                        <div class="input_box">
                            <PhoneCountry />
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
                            />
                        </div>
                        <div class="input_box">
                            <div class="login_icon ver_icon"></div>
                            <van-field
                                :border="false"
                                v-model.trim="phonecode"
                                name="phonecode"
                                :maxlength="6"
                                clearable
                                :formatter="formatterStr"
                                autocomplete="off"
                                placeholder="请输入短信验证码"
                            />
                            <van-button
                                class="send_vercode_btn"
                                @click="handleSendVerCode(1)"
                                :loading="codeloading"
                                :disabled="!!checkPhone(phone, systemParams.countryCode.number).length || isCountDown"
                                :class="{
                                    'primary-btn text-old-text': !checkPhone(phone, systemParams.countryCode.number).length
                                }"
                                size="small"
                            >
                                <template v-if="isCountDown">{{ countdownTime.seconds }}s</template>
                                <template v-else>{{ codeSended ? "重新发送" : "获取验证码" }}</template>
                            </van-button>
                        </div>
                        <div class="input_box">
                            <div class="login_icon invite_icon"></div>
                            <van-field
                                :border="false"
                                v-model="invitecode"
                                clearable
                                :formatter="formatterStr"
                                :maxlength="12"
                                name="invitecode"
                                autocomplete="off"
                                placeholder="请输入邀请码（可选）"
                            />
                        </div>
                    </template>
                    <!-- 账号注册 -->
                    <template v-if="loginStore.registerMode === 'username'">
                        <div class="input_box">
                            <div class="login_icon username_icon"></div>
                            <van-field
                                :border="false"
                                v-model="username"
                                clearable
                                name="username"
                                :maxlength="12"
                                :formatter="formatterStr"
                                placeholder="6-12位包含小写字母和数字"
                            />
                        </div>
                        <div class="input_box">
                            <div class="login_icon password_icon"></div>
                            <van-field
                                :border="false"
                                v-model="password"
                                clearable
                                :type="isShowPassIcon ? 'password' : 'text'"
                                name="password"
                                :maxlength="20"
                                :formatter="formatterStr"
                                placeholder="6~20位包含大小写字母数字或字符"
                            />
                            <div
                                class="login_icon mr-10px ml-0!"
                                :class="[isShowPassIcon ? 'eye_close_icon' : 'eye_icon']"
                                @click="switchPassIcon"
                            ></div>
                        </div>
                        <div class="input_box">
                            <div class="login_icon invite_icon"></div>
                            <van-field
                                :border="false"
                                v-model="invitecode"
                                clearable
                                :formatter="formatterStr"
                                :maxlength="12"
                                name="invitecode"
                                autocomplete="off"
                                placeholder="请输入邀请码（可选）"
                            />
                        </div>
                        <!-- 验证码系统 -->
                        <Validator ref="verifyRef" @send="getVerfy" />
                    </template>
                    <div class="text-13.25px text-#8b9ab4">
                        注册即代表同意
                        <router-link class="font-bold" to="/serviceterms">《VKGAME用户注册与服务协议》</router-link>
                    </div>
                    <div class="mt-24px">
                        <van-button
                            class="button_primary_2022 border-none h-45px! leading-45px! font-bold"
                            block
                            :disabled="isSubmitBtnDisable"
                            :loading="submitLoading"
                            native-type="submit"
                        >
                            立即注册
                        </van-button>
                    </div>
                </van-form>
                <div class="keep_login_forget mt-15px text-white flex justify-between text-15px leading-15px">
                    <router-link to="/">随便逛逛</router-link>
                    <div @click="switchMode">
                        {{ loginStore.registerMode === "phone" ? "账号注册" : "手机注册" }}
                    </div>
                </div>
            </div>
            <div class="register-bottom">
                <!-- 轮播 -->
                <BannerJump
                    class="register-swipe w-327px h-90px rounded-8px m-auto"
                    :placehold="'none'"
                    :banner-list="loginStore.loginRegModelData.registerSwiperData"
                />
                <div class="text-16px text-#8b9ab4 text-center leading-72.5px">
                    已有VKGAME账号？
                    <router-link class="text-primary-green" to="/login">去登录</router-link>
                </div>
            </div>
        </div>
        <DialogRegLeave />
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/style/form.scss";
.register-wrapper {
    .tag {
        background: url("@/assets/img/login/register_title_tag.png") no-repeat center;
        background-size: 100% 100%;
        vertical-align: bottom;
        &::before {
            content: "";
            position: absolute;
            top: 7px;
            left: 18px;
            width: 24px;
            height: 24px;
            background: url("@/assets/img/login/register_tag_before.png") no-repeat center;
            background-size: 100% 100%;
        }
    }
}
.register-swipe {
    :deep(.van-swipe__indicators) {
        bottom: 7px;

        .van-swipe__indicator {
            width: 5px;
            height: 5px;
            transition: width 0.4s;
            background: #fbfbfb;
            margin-right: 4px;

            &.van-swipe__indicator--active {
                width: 11px;
                border-radius: 2.5px;
                background: #fff;
            }
        }
    }
}
</style>
