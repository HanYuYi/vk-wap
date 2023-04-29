<script setup lang="ts">
import { HttpPlus } from "@/api/HttpPlus"
import ApiSetting from "@/api/service"
import { ref } from "vue"
import { whenever } from "@vueuse/core"
import { useSysStore } from "@/stores/system"
import { showToast } from "vant"

const systemParams = useSysStore()

const show = ref(false)

whenever(
    () => systemParams.showRechargeGift,
    () => {
        show.value = true
    }
)

const close = (): void => {
    systemParams.showRechargeGift = false
}

const getRechargeRed = async (): Promise<void> => {
    if (systemParams.dialogData?.type == 8 && systemParams.dialogData?.code) {
        HttpPlus.setUrlOptions(ApiSetting.user.redeemCode)
        const res = await HttpPlus.sendHttpRequest<{}, { coupon_num: number }>({
            coupon_num: systemParams.dialogData?.code
        })

        if (res.status === 1) {
            show.value = false
            showToast({ className: "vk-toast-success", message: "领取成功", icon: "checked" })
        }
    }
}
</script>

<template>
    <div v-if="systemParams.showRechargeGift">
        <van-dialog
            teleport="body"
            close-on-click-overlay
            v-model:show="show"
            :show-confirm-button="false"
            @close="close"
            className="recharge-gift-diolog"
        >
            <div class="close" @click="show = false"></div>
            <div class="des mt-275px">红包不停</div>
            <div class="money mt-10px text-35px leading-normal">{{ systemParams.dialogData?.deposit_bonus }}元</div>
            <div class="btn" @click="getRechargeRed"></div>
        </van-dialog>
    </div>
</template>

<style lang="scss">
.van-dialog.recharge-gift-diolog {
    top: 46%;
    max-width: 100vw;
    width: 375px;
    height: 502.5px;
    background: url("@/assets/img/home/rechargeRedPacket/bg.png") no-repeat center;
    background-size: contain;
    text-align: center;
    padding-top: 1px;
    margin: auto;
    color: #eea747;
    font-size: 15px;
    .close {
        position: absolute;
        width: 20px;
        height: 20px;
        right: 55px;
        top: 140px;
        background: url("@/assets/img/home/rechargeRedPacket/close.png") no-repeat center;
        background-size: contain;
    }
    .btn {
        margin: 40px auto 0;
        width: 133px;
        height: 50.5px;
        background: url("@/assets/img/home/rechargeRedPacket/btn-normal.png") no-repeat center;
        background-size: contain;
        transition: background 0.2s;
        cursor: pointer;
        &:active {
            background-image: url("@/assets/img/home/rechargeRedPacket/btn-hover.png");
        }
    }
}
</style>
