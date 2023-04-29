<script setup lang="ts">
import { useSysStore } from "@/stores/system"

const systemParams = useSysStore()

const close = (): void => {
    systemParams.appRootBlur = false
    systemParams.signDialogShow = false
}
</script>

<template>
    <van-dialog
        teleport="body"
        close-on-click-overlay
        v-model:show="systemParams.signDialogShow"
        :show-confirm-button="false"
        @close="close"
        className="sign-diolog"
    >
        <div class="top w-full h-190px relative"></div>
        <div class="bottom w-full h-190px px-20px pt-33px pb-24px bg-white text-center">
            <div class="vb-wrapper">
                <span class="plus-icon">+</span>
                <span class="bold">{{ systemParams.siginInPrize?.vb }}</span>
                <span class="text">V币</span>
            </div>
            <div class="sign-day text-14px">
                已连续签到
                <span class="day text-primary-green">{{ systemParams.siginInPrize?.day }}</span>
                天
            </div>
            <div class="confirm-btn primary-btn" @click="systemParams.signDialogShow = false">开心收下</div>
            <div class="sign-desc text-12px leading-normal text-left">
                首次签到赠送10V币，连续二次签到赠送20V币，连续三次或以上赠送30V币！
            </div>
        </div>
    </van-dialog>
</template>

<style lang="scss">
.sign-diolog {
    height: 380px;
    width: 276px;
    .top {
        background: url("@/assets/img/template/july/sign/top.png") no-repeat center;
        background-size: contain;
        bottom: -1.8px;
    }
    .sign-day {
        line-height: 1.71;
        color: #808684;

        .day {
            font-family: Roboto;
            font-weight: bold;
        }
    }
    .plus-icon {
        vertical-align: super;
        display: inline-block;
        font-size: 30px;
        line-height: 1.33;
        color: #ff4400;
    }

    .bold {
        font-size: 50px;
        line-height: 0.8;
        color: #ff4400;
        margin-left: 6px;
        margin-right: 6px;
        font-family: Roboto;
    }
    .vb-wrapper {
        font-size: 18px;
        font-weight: bold;
        line-height: 1.67;
        color: var(--vk-primary-text-color);
        position: absolute;
        top: 171px;
        left: 50%;
        transform: translateX(-50%);
    }
    .confirm-btn {
        margin: 15px auto 10px;
        width: 200px;
        height: 48px;
        box-sizing: border-box;
        line-height: 50px;
        border-radius: 24px;
        box-shadow: 0 1px 3px 0 rgba(25, 226, 188, 0.25);
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        color: #fff;
    }
    .sign-desc {
        color: var(--vk-light-text-color);
        font-family: "Avenir", Helvetica, Arial, sans-serif;
    }
}
</style>
