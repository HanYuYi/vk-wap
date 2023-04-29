<script setup lang="ts">
import type { ComputedRef } from "vue"
import { useCountDown } from "@vant/use"
import type { CurrentTime } from "@vant/use"
import ApiSetting from "@/api/service"
import { HttpPlus } from "@/api/HttpPlus"
import { checkPhone, formatterPhone, formatterStr, checkUsername, checkPasswordForRegister } from "@/composable/validate"
import { ref, onMounted, onUnmounted, computed } from "vue"
import { useForm } from "@/composable/form"
import { useSysStore } from "@/stores/system"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import type { IndexForgetPass } from "@/api/pojo/IndexForgetPass"

const systemParams = useSysStore()
const router: Router = useRouter()
const {
    codeSended,
    phone,
    phonecode,
    username,
    password,
    isShowPassIcon,
    codeloading,
    isCountDown,
    countdownTime,
    switchPassIcon,
    handleSendVerCode,
    resetForm
} = useForm()

const currentStep = ref(1)
const firstStepBtnLoad = ref(false)
const secStepBtnLoad = ref(false)
const question = ref("") // 密保问题
const rand = ref("") // 第一步接口返回，作为第二步传参
const isUw = ref(false) // 不显示密保

const STEPS_LIST = [
    {
        step: 1,
        text: "填写用户名"
    },
    {
        step: 2,
        text: "找回密码"
    },
    {
        step: 3,
        text: "修改成功"
    }
]
// 表单
const answer = ref("")

const isSubmitBtnDisable = computed<boolean>(() => {
    return (
        !!checkPhone(phone.value, systemParams.countryCode.number).length ||
        !phonecode.value.length ||
        (!isUw.value && !answer.value.length) ||
        !password.value.length
    )
})

// 第一步，提交账号
const pressFirstStep = async (): Promise<void> => {
    // 用户名验证不通过
    if (checkUsername(username.value)) return

    firstStepBtnLoad.value = true
    const params = {
        username: username.value,
        step: "check"
    }

    rand.value = ""
    try {
        HttpPlus.setUrlOptions(ApiSetting.index.forgetPass)
        const res = await HttpPlus.sendHttpRequest<IndexForgetPass, typeof params>(params)
        firstStepBtnLoad.value = false

        if (res.status === 1) {
            currentStep.value = 2
            question.value = res.data.ques
            rand.value = res.data.rand.toString()
            isUw.value = res.data.is_uw * 1 === 1
        }
    } catch (error: unknown) {
        firstStepBtnLoad.value = false
        throw error
    }
}

// 验证所有输入是否可以提交
interface Step2FormFiled {
    answer: string
    password: string
    phone: string
    phonecode: string
}
const validateResolve = (values: Step2FormFiled): boolean => {
    let validationPassed = false
    validationPassed =
        !checkPhone(formatterStr(values.phone), systemParams.countryCode.number) && !checkPasswordForRegister(values.password)

    if (validationPassed && !isUw.value) {
        validationPassed = answer.value.length > 0
    }
    return validationPassed
}

// 提交成功，5秒倒计时结束返回首页
const countDownJump = useCountDown({
    time: 5 * 1000,
    onFinish: () => {
        resetForm()
        router.push("/login")
    }
})
const SEC: ComputedRef<CurrentTime> = countDownJump.current

// 清除倒计时
const clearForLoginCountDown = (): void => {
    resetForm()
    router.push("/login")
    countDownJump.reset()
}

// 第二部提交表单

const onSubmit = async (values: Step2FormFiled): Promise<void> => {
    if (!validateResolve(values)) return

    secStepBtnLoad.value = true
    const params = {
        phone: formatterStr(values.phone),
        prefix: systemParams.countryCode.number,
        phone_verify: values.phonecode,
        rand: rand.value,
        answer: values.answer,
        password: values.password,
        repassword: values.password,
        step: "reset"
    }
    try {
        console.info("第二步 提交找回密码入参：", params)

        HttpPlus.setUrlOptions(ApiSetting.index.forgetPass)
        const res = await HttpPlus.sendHttpRequest<IndexForgetPass, typeof params>(params)
        secStepBtnLoad.value = false

        console.info("第二步 提交找回密码响应：", res)
        if (res.status === 1) {
            currentStep.value = 3
            countDownJump.start()
        }
    } catch (error: unknown) {
        secStepBtnLoad.value = false
        throw error
    }
}

onMounted(() => {
    document.body.style.backgroundColor = "#212432"
    resetForm()
})

onUnmounted(() => {
    document.body.style.backgroundColor = ""
})
</script>

<template>
    <div class="forget-page bg-#212432">
        <HeaderBar />
        <div class="expand-page px-24px">
            <div class="text-24px text-white leading-58px font-bold">找回密码</div>
            <!-- 步骤条 -->
            <div class="steps mt-3px mb-20px w-327px hstack justify-between text-#767ca0 text-14.25px text-center">
                <div
                    class="item whitespace-nowrap w-75px"
                    :class="{
                        'item-complete': item.step < currentStep,
                        'item-active': item.step === currentStep
                    }"
                    v-for="(item, i) in STEPS_LIST"
                    :key="i"
                >
                    <div
                        class="num mx-auto mb-8px w-28px h-28px rounded-1/2 bg-#767ca0 text-#222431 relative text-17px leading-28px"
                    >
                        {{ item.step }}
                    </div>
                    <div class="text">{{ item.text }}</div>
                </div>
            </div>
            <!-- 表单 -->
            <van-form class="form_box" @submit="onSubmit">
                <!-- 第一步 -->
                <template v-if="currentStep === 1">
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
                    <div class="mt-24px">
                        <van-button
                            @click="pressFirstStep"
                            class="button_primary_2022 border-none h-45px! leading-45px! font-bold"
                            block
                            :loading="firstStepBtnLoad"
                            :disabled="!username.length"
                        >
                            下一步
                        </van-button>
                    </div>
                </template>

                <!-- 第二步 -->
                <template v-if="currentStep === 2">
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
                            @click="handleSendVerCode(3)"
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
                    <!-- 密保 -->
                    <div class="input_box" v-if="!isUw">
                        <div class="login_icon answer_icon"></div>
                        <van-field
                            :border="false"
                            v-model.trim="answer"
                            name="answer"
                            :maxlength="10"
                            clearable
                            :formatter="formatterStr"
                            autocomplete="off"
                            :placeholder="question"
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
                            placeholder="请输入新密码"
                        />
                        <div
                            class="login_icon mr-10px ml-0!"
                            :class="[isShowPassIcon ? 'eye_close_icon' : 'eye_icon']"
                            @click="switchPassIcon"
                        ></div>
                    </div>
                    <div class="mt-24px">
                        <van-button
                            class="button_primary_2022 border-none h-45px! leading-45px! font-bold"
                            block
                            :loading="secStepBtnLoad"
                            :disabled="isSubmitBtnDisable"
                            native-type="submit"
                        >
                            提交
                        </van-button>
                    </div>
                </template>

                <!-- 第三步 -->
                <template v-if="currentStep === 3">
                    <div class="mt-48px text-center text-18px text-white">
                        <div class="suss-icon"></div>
                        <div class="mt-15px font-bold tracking-0.9px">恭喜您找回密码!</div>
                        <div class="mt-8px text-14px text-#8b9ab4 tracking-0.7px">
                            <span class="text-primary-green">{{ SEC.seconds }}</span>
                            秒后返回登录页面
                        </div>
                    </div>
                    <div class="mt-48px">
                        <van-button
                            @click="clearForLoginCountDown"
                            class="button_primary_2022 border-none h-45px! leading-45px! font-bold"
                            block
                        >
                            使用新密码登录
                        </van-button>
                    </div>
                </template>
            </van-form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/style/form.scss";
.suss-icon {
    width: 68px;
    height: 68px;
    margin: auto;
    background: url("@/assets/img/login/forget_success.png") no-repeat center;
    background-size: 100% 100%;
}
.steps {
    .item {
        .num {
            &::before {
                position: absolute;
                content: "";
                width: 0;
                z-index: 2;
                background-color: var(--vk-primary-green);
                height: 1.5px;
                left: 40px;
                top: 13.25px;
            }

            &::after {
                position: absolute;
                content: "";
                width: 68px;
                background-color: #767ca0;
                height: 1.5px;
                left: 40px;
                top: 13.25px;
            }
        }
        &:last-child {
            .num {
                &::before {
                    content: none !important;
                }
                &::after {
                    content: none !important;
                }
            }
        }
        &.item-active {
            color: var(--vk-primary-green);
            .num {
                background-color: var(--vk-primary-green);
                &::before {
                    width: 34px;
                }
            }
        }
        &.item-complete {
            color: var(--vk-primary-green);
            .num {
                background-color: var(--vk-primary-green);
                &::before {
                    width: 68px;
                }
            }
        }
    }
}
</style>
