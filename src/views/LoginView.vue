<script setup lang="ts">
import Validator from "@/components/Validator.vue"
import { ref, computed, onMounted, onUnmounted } from "vue"
import ApiSetting from "@/api/service"
import { HttpPlus } from "@/api/HttpPlus"
import { showToast } from "vant"
import { useSysStore } from "@/stores/system"
import { useLoginStore } from "@/stores/loginRegister"
import { useForm } from "@/composable/form"
import { checkPhone, formatterPhone, formatterStr, checkUsername, checkPassword } from "@/composable/validate"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import type { IndexDoLogin } from "@/api/pojo/IndexDoLogin"

interface ValidatorBackType {
    tag: "img" | "botion"
    res: Record<string, string> | string
}

interface ValidatorExposeType {
    reset: () => void
}

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
    showVerifyCode,
    codeloading,
    isCountDown,
    countdownTime,
    switchPassIcon,
    handleSendVerCode,
    resetForm
} = useForm()

const verifyRef = ref<ValidatorExposeType | null>(null)

const isSubmitBtnDisable = computed<boolean>(() => {
    if (loginStore.loginMode === "phone") {
        return !!checkPhone(phone.value, systemParams.countryCode.number).length || !phonecode.value.length
    }

    if (loginStore.loginMode === "username") {
        if (showVerifyCode.value) {
            // 图片验证码模式
            if (loginStore.loginRegModelData.verfiy === 0) {
                return !username.value.length || !password.value.length || !verifycode.value.length
            } else {
                // 极速验证模式
                return !username.value.length || !password.value.length || !verifyBotion.value
            }
        } else {
            return !username.value.length || !password.value.length
        }
    }
    return false
})

const switchLoginMode = (): void => {
    resetForm()
    if (loginStore.loginMode === "phone") {
        loginStore.loginMode = "username"
    } else {
        loginStore.loginMode = "phone"
    }
}

const getVerfy = (val: ValidatorBackType): void => {
    if (typeof val.res === "string" && val.tag === "img") {
        verifycode.value = val.res
    }
    if (typeof val.res === "object" && val.tag === "botion") {
        verifyBotion.value = val.res
    }
}

// 用户名登录模式下，验证所有输入是否可以提交
interface UsernameFormFiled {
    password: string
    username: string
}
const validateResolve = (values: UsernameFormFiled): boolean => {
    let validationPassed = false
    validationPassed = !checkUsername(values.username) && !checkPassword(values.password)
    if (validationPassed && showVerifyCode.value) {
        if (loginStore.loginRegModelData.verfiy === 0) {
            validationPassed = !!verifycode.value
        } else {
            validationPassed = !!verifyBotion.value
        }
    }
    return validationPassed
}

const submitLoading = ref(false)

interface PhoneFormFiled {
    phone: string
    phonecode: string
}

const onSubmit = async (values: UsernameFormFiled | PhoneFormFiled) => {
    let params = {}
    if (loginStore.loginMode === "username" && "username" in values) {
        if (!validateResolve(values)) return

        params = {
            username: values.username,
            password: values.password,
            verify_code: verifycode.value,
            auto_login: 1,
            gt_version: 4,
            type: 1,
            ...verifyBotion.value
        }
    } else if ("phone" in values) {
        params = {
            phone: formatterStr(values.phone),
            prefix: systemParams.countryCode.number,
            type: 2,
            phone_verify: values.phonecode,
            auto_login: 1
        }
    }
    submitLoading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.index.login)
        const res = await HttpPlus.sendHttpRequest<IndexDoLogin, typeof params>(params)
        console.info("登录响应：", res)

        submitLoading.value = false
        showVerifyCode.value = res.show_verify == 1

        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: res.message,
                icon: "checked"
            })
            if (res.data.mobile) {
                systemParams.userInfo.tel = res.data.mobile
            }
            // 更新登录状态
            systemParams.isLogin = true
            systemParams.updateUserInfo<IndexDoLogin>(res.data)
            const timer = setTimeout(() => {
                resetForm()
                router.push("/")
                systemParams.loadHotSpot = true
                clearTimeout(timer)
            }, 400)
        } else {
            // 仅当用户名/密码方式登录时生效的逻辑
            if (loginStore.loginMode === "username") {
                showVerifyCode.value = true
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

onMounted(() => {
    document.body.style.backgroundColor = "#212432"
    loginStore.loginRegInit()
})

onUnmounted(() => {
    document.body.style.backgroundColor = ""
    loginStore.loginMode = "phone"
})
</script>

<template>
    <div class="login-reg-page bg-#212432">
        <HeaderBar />
        <div class="login-wrapper expand-page hstack flex-col justify-between">
            <div class="w-full px-24px">
                <div class="login_title text-24px text-white leading-58px font-700">
                    {{ loginStore.loginMode === "phone" ? "手机验证码登录" : "密码登录" }}
                </div>
                <van-form class="form_box" @submit="onSubmit">
                    <!-- 手机号登录 -->
                    <template v-if="loginStore.loginMode === 'phone'">
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
                                @click="handleSendVerCode(2)"
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
                    </template>
                    <!-- 用户名登录 -->
                    <template v-if="loginStore.loginMode === 'username'">
                        <div class="input_box">
                            <div class="login_icon username_icon"></div>
                            <van-field
                                :border="false"
                                v-model="username"
                                clearable
                                name="username"
                                :maxlength="18"
                                :formatter="formatterStr"
                                placeholder="请输入用户名"
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
                                placeholder="请输入密码"
                            />
                            <div
                                class="login_icon mr-10px ml-0!"
                                :class="[isShowPassIcon ? 'eye_close_icon' : 'eye_icon']"
                                @click="switchPassIcon"
                            ></div>
                        </div>
                        <!-- 验证码系统 -->
                        <Validator ref="verifyRef" v-if="showVerifyCode" @send="getVerfy" />
                        <router-link class="text-13.25px leading-13.25px text-white" to="/forget">忘记密码?</router-link>
                    </template>
                    <div class="mt-24px">
                        <van-button
                            class="button_primary_2022 border-none h-45px! leading-45px! font-bold"
                            block
                            :disabled="isSubmitBtnDisable"
                            :loading="submitLoading"
                            native-type="submit"
                        >
                            立即登录
                        </van-button>
                    </div>
                </van-form>
                <div class="keep_login_forget mt-15px text-white flex justify-between text-15px leading-15px">
                    <router-link to="/">随便逛逛</router-link>
                    <div @click="switchLoginMode">
                        {{ loginStore.loginMode === "phone" ? "密码登录" : "免密登录" }}
                    </div>
                </div>
            </div>
            <div class="login_bottom">
                <div class="lb-title">赞助伙伴</div>
                <div class="team-list flex justify-between mt-16px mx-9px">
                    <div class="tnc"></div>
                    <div class="dawnbattle"></div>
                </div>
                <div class="login_footer_txt">
                    还没有VKGAME账号？
                    <router-link to="/register">去注册</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/style/form.scss";
.login_bottom {
    width: calc(100% - 0.48rem);

    .lb-title {
        width: 100%;
        font-size: 14px;
        line-height: 14px;
        letter-spacing: 0.7px;
        text-align: center;
        color: #8e9ab2;
        position: relative;

        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 6.5px;
            width: 122.5px;
            height: 0.5px;
            background-color: #3e4253;
        }

        &::after {
            content: "";
            position: absolute;
            right: 0;
            top: 6.5px;
            width: 122.5px;
            height: 0.5px;
            background-color: #3e4253;
        }
    }

    .team-list {
        .tnc {
            margin-top: 0.08rem;
            width: 1.125rem;
            height: 0.52rem;
            background-image: url("@/assets/img/login/tnc.png");
            background-size: 100% 100%;
        }

        .dawnbattle {
            width: 1.665rem;
            height: 0.6rem;
            background-image: url("@/assets/img/login/dawnbattle.png");
            background-size: 100% 100%;
        }
    }

    .login_footer_txt {
        margin-top: 0.24rem;
        font-size: 0.16rem;
        line-height: 0.71rem;
        text-align: center;
        color: #8b9ab4;
        position: relative;

        a {
            color: #07f1b7;
        }

        &::before {
            content: "";
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            height: 0.005rem;
            background-color: #3e4253;
        }
    }
}
</style>
