<script setup lang="ts">
import { ref } from "vue"
import { formatterStr } from "@/composable/validate"
import { useRoute, useRouter } from "vue-router"
import type { RouteLocationNormalizedLoaded, Router } from "vue-router"
import ApiSetting from "@/api/service"
import { showToast } from "vant"
import { HttpPlus } from "@/api/HttpPlus"

const route: RouteLocationNormalizedLoaded = useRoute()
const router: Router = useRouter()

const code = ref("")
const submitLoading = ref(false)

if (route.query?.code) {
    code.value = route.query?.code as string
}

const onSubmit = async (values: { code: string }): Promise<void> => {
    const params = {
        coupon_num: values.code
    }
    submitLoading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.user.redeemCode)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        submitLoading.value = false

        if (res.status === 1) {
            code.value = ""
            showToast({
                className: "vk-toast-success",
                message: res.message,
                icon: "checked"
            })
            const timer = setTimeout(() => {
                clearTimeout(timer)
                router.back()
            }, 1000)
        }
    } catch (error: unknown) {
        submitLoading.value = false
        console.error(error)
    }
}
</script>

<template>
    <div class="redeemcode-page bg-mypageColor">
        <HeaderBar>
            <div class="header_title">兑换码</div>
        </HeaderBar>
        <div class="expand-page px-12px">
            <div font-bold leading-40px>输入兑换码</div>
            <van-form class="userset-form" @submit="onSubmit">
                <div class="input_box">
                    <van-field
                        :border="false"
                        v-model="code"
                        type="digit"
                        clearable
                        :formatter="formatterStr"
                        name="code"
                        autocomplete="off"
                        placeholder="请输入兑换码，领取您的专属福利!"
                    />
                </div>
                <div class="mt-24px">
                    <van-button
                        class="button_primary_2022 border-none h-45px! leading-45px! font-bold text-white!"
                        :class="{
                            'from-#d7dede! to-#d0d8d6! bg-gradient-to-r! opacity-100!': !code
                        }"
                        block
                        :disabled="!code"
                        :loading="submitLoading"
                        native-type="submit"
                    >
                        立即兑换
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "common.scss";
.userset-form .input_box {
    &::after {
        content: none;
    }
}
.redeemcode-page {
    color: var(--vk-primary-text-color);
}
</style>
