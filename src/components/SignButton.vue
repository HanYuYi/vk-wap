<script setup lang="ts">
import { unref, computed } from "vue"
import { useSysStore } from "@/stores/system"

const systemParams = useSysStore()

const isSigned = computed<boolean>(() => systemParams.userInfo.has_sign)

const text = computed<string>(() => {
    if (systemParams.userInfo.continue_sign > 1) {
        return systemParams.userInfo.has_sign ? `连续${systemParams.userInfo.continue_sign}天` : "签到"
    } else {
        return systemParams.userInfo.has_sign ? "已签到" : "签到"
    }
})

// 打开签到弹窗
const toSign = (): void => {
    if (!unref(isSigned)) {
        systemParams.handleSign()
    }
}
</script>

<template>
    <div
        @click="toSign"
        class="vk-sign-btn hstack"
        :class="{
            'vk-signed-btn': isSigned,
            'van-haptics-feedback ': !isSigned
        }"
    >
        <div class="sign-icon" :class="{ 'signed-icon': isSigned }"></div>
        <div class="sign-text">{{ text }}</div>
    </div>
</template>

<style lang="scss" scoped>
.vk-sign-btn {
    border-radius: 17px;
    box-sizing: border-box;
    background: linear-gradient(to right, #8898ac, #5e6c82);
    color: #fff;
    font-size: 12px;
    font-weight: 600;

    &.vk-signed-btn {
        background: linear-gradient(to right, #c6cedc, #adb9d0);
    }
}

.sign-icon {
    width: 19px;
    height: 19px;
    background: url("@/assets/img/template/july/home/draw/sign-icon.png") no-repeat center;
    background-size: contain;

    &.signed-icon {
        background-image: url("@/assets/img/template/july/home/draw/signed-icon.png");
    }
}

.sign-text {
    white-space: nowrap;
    margin-left: 4px;
    line-height: 1.2;
}
</style>
