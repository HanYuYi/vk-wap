<script setup lang="ts">
import { ref } from "vue"
import { whenever } from "@vueuse/core"
import { useRoute, useRouter } from "vue-router"
import type { Router, RouteLocationNormalizedLoaded } from "vue-router"
import { useSysStore } from "@/stores/system"

const systemParams = useSysStore()
const router: Router = useRouter()
const route: RouteLocationNormalizedLoaded = useRoute()

const show = ref(false)

whenever(
    () => systemParams.showRegisterGift,
    () => {
        show.value = true
    }
)

const close = (): void => {
    systemParams.showRegisterGift = false
}

const getRegisterRed = (): void => {
    if (systemParams.dialogData?.type === 7 && systemParams.dialogData?.code) {
        const timer = setTimeout(() => {
            clearTimeout(timer)
            systemParams.showRegisterGift = false
        }, 250)

        if (route.name === "/redeemcode") {
            router.replace(`/redeemcode?code=${systemParams.dialogData?.code}`)
        } else {
            router.push(`/redeemcode?code=${systemParams.dialogData?.code}`)
        }
    }
}
</script>

<template>
    <div v-if="systemParams.showRegisterGift">
        <van-dialog
            teleport="body"
            close-on-click-overlay
            v-model:show="show"
            :show-confirm-button="false"
            @close="close"
            className="register-gift-diolog"
        >
            <div class="close" @click="show = false"></div>
            <div class="redbag-wraper">
                <div>威客电竞欢迎你</div>
                <div class="text-34px mt-10px leading-normal">{{ systemParams.dialogData?.reg_bonus }}元</div>
                <div class="leading-normal">现金红包请笑纳</div>
                <div class="tri">
                    <span>充值{{ systemParams.dialogData?.pay_money }}元，更有额外惊喜！</span>
                </div>
                <div class="btn" @click="getRegisterRed"></div>
            </div>
            <div class="whitespace-nowrap mt-24px">您的兑换码为：{{ systemParams.dialogData?.code }}</div>
        </van-dialog>
    </div>
</template>

<style lang="scss">
.register-gift-diolog {
    width: 291px;
    text-align: center;
    padding-top: 1px;
    margin: auto;
    max-width: 100vw;
    overflow: visible;
    color: #f8d863;
    font-size: 15px;
    .close {
        position: absolute;
        width: 20px;
        height: 20px;
        background: url("@/assets/img/home/registerRedPacket/close.png") no-repeat center;
        background-size: contain;
        right: 0;
        top: 0;
    }
    .redbag-wraper {
        width: 291px;
        height: 343px;
        background: url("@/assets/img/home/registerRedPacket/bg.png") no-repeat center;
        background-size: contain;
        padding-top: 55px;
        .btn {
            margin: 0.2rem auto 0;
            width: 0.745rem;
            height: 0.75rem;
            background: url("@/assets/img/home/registerRedPacket/btn-normal.png") no-repeat;
            background-size: contain;
            transition: background 0.2s;
            cursor: pointer;

            &:active {
                background: url("@/assets/img/home/registerRedPacket/btn-hover.png") no-repeat;
                background-size: contain;
            }
        }
        .tri {
            background: #ffd74c;
            position: relative;
            height: 0.3rem;
            max-width: 2.05rem;
            margin: 0.1rem auto 0;

            span {
                color: #de340d;
                line-height: 0.3rem;
            }

            &::before,
            &::after {
                content: "";
                position: absolute;
                top: 0;
                width: 0;
                height: 0;
                border: 0.15rem solid;
            }

            &::before {
                left: -0.3rem;
                border-color: transparent #ffd74c transparent transparent;
            }

            &::after {
                right: -0.3rem;
                border-color: transparent transparent transparent #ffd74c;
            }
        }
    }
}
</style>
