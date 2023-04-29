<script setup lang="ts">
import { useRouter } from "vue-router"
import type { Router, NavigationFailure } from "vue-router"
import { useSysStore } from "@/stores/system"
import { useLoginStore } from "@/stores/loginRegister"

const systemParams = useSysStore()
const loginStore = useLoginStore()
const router: Router = useRouter()

const close = (): void => {
    systemParams.appRootBlur = false
    loginStore.showRegLeaveDialog = false
}

const back = (): void | Promise<NavigationFailure | void | undefined> => {
    close()

    if (!window.history.state) {
        return router.push("/")
    }

    router.back()
}
</script>

<template>
    <van-dialog
        teleport="body"
        close-on-click-overlay
        v-model:show="loginStore.showRegLeaveDialog"
        :show-confirm-button="false"
        @close="close"
        className="register-leave-diolog"
    >
        <div class="top">
            <div class="font-bold text-17px text-center text-white mt-15px">完成注册可享受以下优惠</div>
            <div class="desc" v-html="loginStore.loginRegModelData.registerLeaveTips"></div>
            <div class="mx-22.5px flex justify-between">
                <van-button @click="back" class="button_plain_2022 h-45px! leading-45px! w-137px!" block>忍痛放弃</van-button>
                <van-button
                    @click="loginStore.showRegLeaveDialog = false"
                    class="button_primary_2022 border-none h-45px! leading-45px! w-137px!"
                    block
                >
                    继续注册
                </van-button>
            </div>
        </div>
        <div class="bottom flex justify-between">
            <div class="tnc mt-20px"></div>
            <div class="dawnbattle mt-20px"></div>
        </div>
    </van-dialog>
</template>

<style lang="scss">
.register-leave-diolog {
    width: 327px;
    border-radius: 8px;
    top: 50%;
    .top {
        padding-bottom: 15px;
        background: url("@/assets/img/login/leave_top_bg.png") no-repeat center top;
        background-size: 100% auto;
        background-color: #222432;
        overflow: hidden;
        .desc {
            margin: 0.2rem 0.25rem 0.2rem;

            p {
                text-align: left;
                margin-top: 0.05rem;
                font-size: 0.14rem;
                line-height: 0.19rem;
            }
        }
    }
    .bottom {
        height: 89px;
        margin-top: 8px;
        background: url("@/assets/img/login/leave_bottom_bg.png") no-repeat center;
        background-size: 100% 100%;
        padding: 0 32px;
        .tnc {
            width: 1.19rem;
            height: 0.5rem;
            background-image: url("@/assets/img/login/leava_tnc.png");
            background-size: 100% 100%;
        }

        .dawnbattle {
            width: 1.085rem;
            height: 0.5rem;
            background-image: url("@/assets/img/login/leave_dawnbattle.png");
            background-size: 100% 100%;
        }
    }
}
</style>
