<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue"
import { formatterStr } from "@/composable/validate"
import { useSysStore } from "@/stores/system"
import { useLoginStore } from "@/stores/loginRegister"

interface ValidatorBackType {
    tag: "img" | "botion"
    res: Record<string, string> | string
}

interface ValidatorExposeType {
    reset: () => ReturnType<typeof reset>
}

const systemParams = useSysStore()
const loginStore = useLoginStore()

const emit = defineEmits(["send"])

const txtVerifcode = ref("")
const verCodeImgRef = ref<HTMLDivElement>(null)

const veriImgUrl = ref("")
const changeVerCodeImg = () => {
    console.log("验证码图片更换了")
    veriImgUrl.value = `${systemParams.verCodeUrl}?${new Date().getTime()}`
}

const backResult = (val: ValidatorBackType): void => {
    emit("send", val)
}
// 返回父级图片验证码
const resultImg = (val: ValidatorBackType["res"]): void => {
    backResult({ tag: "img", res: val })
}

const verStatus = ref<string>("")

// 极速验证初始化
const initCaptcha = (): void => {
    // eslint-disable-next-line no-undef
    window.initBotion(
        {
            captchaId: "497663cd0b063076d5ff7109980e9504",
            nativeButton: {
                width: "100%",
                height: "100%"
            },
            nextWidth: "80%",
            product: "bind",
            hideBar: ["close"]
        },
        (captchaObj: any) => {
            console.log("极速验证执行完了", captchaObj)
            loginStore.captchaObj = captchaObj
            //  DOM 生成完毕
            captchaObj
                .onReady(() => {
                    console.log("极速验证DOM 生成完毕")
                    verStatus.value = "ready"
                })
                .onSuccess(() => {
                    // 验证结果
                    const result: ValidatorBackType["res"] = captchaObj.getValidate()
                    backResult({ tag: "botion", res: result })
                    verStatus.value = "success"
                })
                .onError(() => {
                    verStatus.value = "error"
                })
        }
    )
}

// 打开极速验证窗口
const openVerify = (): void => {
    if ((verStatus.value = "ready" && loginStore.captchaObj)) {
        loginStore.captchaObj.showCaptcha()
    }
}

onMounted(async (): Promise<void> => {
    await systemParams.getKFUrl()
    changeVerCodeImg()
    // 以下代码仅在登录页面生效，在其他页面使用了验证码的

    if (loginStore.loginRegModelData.verfiy === 0) {
        console.log("更换以下验证码图片")
        changeVerCodeImg()
        nextTick(() => {
            verCodeImgRef.value.click()
        })
    }
    if (loginStore.loginRegModelData.verfiy === 1) {
        initCaptcha()
    }
})

const reset = (): void => {
    if (loginStore.loginRegModelData.verfiy === 0) {
        txtVerifcode.value = ""
        changeVerCodeImg()
    }
    if (loginStore.loginRegModelData.verfiy === 1) {
        if (loginStore.captchaObj) {
            verStatus.value = ""
            loginStore.captchaObj.reset()
        }
    }
}

const destroyBotion = (): void => {
    if (loginStore.captchaObj) {
        loginStore.captchaObj.destroy()
        loginStore.captchaObj = null
    }
}

onBeforeUnmount((): void => {
    destroyBotion()
})

defineExpose({ reset })
</script>

<template>
    <div class="input_box" v-if="loginStore.loginRegModelData.verfiy === 0">
        <div class="login_icon verfiy_icon"></div>
        <van-field
            :border="false"
            v-model="txtVerifcode"
            @update:model-value="resultImg"
            clearable
            name="txtVerifcode"
            :maxlength="6"
            :formatter="formatterStr"
            placeholder="请输入验证码"
        />
        <div class="vercode_img_wrapper" @click="changeVerCodeImg" ref="verCodeImgRef">
            <img v-if="veriImgUrl.length" :src="veriImgUrl" alt="" />
        </div>
    </div>
    <div
        class="input_box justify-center"
        :class="{
            input_box_success: verStatus === 'success',
            input_box_error: verStatus === 'error'
        }"
        v-if="loginStore.loginRegModelData.verfiy === 1"
    >
        <van-button
            @click="openVerify"
            class="btn-gee bg-#282b3d border-none text-#b5c3d9 text-14px"
            :class="{
                'bg-#1e3940!': verStatus === 'success',
                'bg-#362737!': verStatus === 'error'
            }"
            block
        >
            <div class="hstack" v-if="verStatus === 'success'">
                <div class="botion-icon circle-success"></div>
                <div class="text-#07f1b7">验证成功</div>
            </div>
            <div class="hstack" v-else-if="verStatus === 'error'">
                <div class="botion-icon circle-error"></div>
                <div class="text-#f14667">验证失败</div>
            </div>
            <div class="hstack" v-else>
                <div class="botion-icon circle-point"></div>
                <div>点击按钮进行验证</div>
            </div>
        </van-button>
    </div>
</template>

<style lang="scss" scoped>
.vercode_img_wrapper {
    margin-right: 10px;
    width: 89.5px;
    height: 32px;
    border-radius: 4px;
    overflow: hidden;
    background-color: #a8c2ef;
    img {
        width: 100%;
        height: 100%;
    }
}
.botion-icon {
    width: 21.5px;
    height: 21.5px;
    margin-right: 5px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    &.circle-point {
        background-image: url("@/assets/img/login/botion/gee_btn_no.png");
    }
    &.circle-success {
        background-image: url("@/assets/img/login/botion/gee_btn_success.png");
    }
    &.circle-error {
        background-image: url("@/assets/img/login/botion/gee_btn_error.png");
    }
}
</style>
