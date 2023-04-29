<script setup lang="ts">
import { useSysStore } from "@/stores/system"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { ref, computed } from "vue"
import { whenever } from "@vueuse/core"

const router: Router = useRouter()
const systemParams = useSysStore()

const show = ref(false)
const step = ref(1)
const bgTran = ref(false) // overlay背景是否透明

const isShowDio = computed(() => {
    return Boolean(systemParams.isLogin && systemParams.userInfo.first_login)
})

whenever(isShowDio, () => {
    step.value = 1
    show.value = true
})

const overlayClass = computed(() => {
    if (bgTran.value) {
        return "instro_dialog bg-transparent"
    }
    return "instro_dialog"
})

const toNext = (): void => {
    if (step.value === 7) {
        show.value = false
        step.value = 0
        systemParams.loadHotSpot = true
    } else {
        step.value++
    }
}

const jumpMyPage = (): void => {
    let markVal = step.value
    step.value = 0
    bgTran.value = true

    const timer = setTimeout(() => {
        bgTran.value = false
        markVal++
        step.value = markVal
        clearTimeout(timer)
    }, 800)

    router.push("/user")
    systemParams.showDraw = true
}

const toDeposit = (): void => {
    let markVal = step.value
    step.value = 0
    bgTran.value = true
    systemParams.showDraw = false
    bgTran.value = false
    markVal++
    step.value = markVal
}
</script>

<template>
    <div v-if="show">
        <van-overlay :class-name="overlayClass" :z-index="9999" :show="show">
            <section class="instro_start" v-show="step === 1">
                <img class="mt-75px mb-10px w-300px h-210px" src="@/assets/img/instro/1.png" alt="" />
                <div class="instro_btn" @click="toNext"></div>
            </section>
            <section class="instro_home" v-show="step === 2">
                <div class="instro_btn next-btn mt-80px!" @click="toNext"></div>
                <img class="w-318px h-217px mb-10px ml-20px mt--50px" src="@/assets/img/instro/2.png" alt="" />
                <div class="nav_list_wrapper">
                    <div class="home_nav_list w-375px h-335.5px"></div>
                </div>
            </section>
            <section class="instro_tabbar_my" v-show="step === 3">
                <div class="tabbar-my-img" @click="jumpMyPage"></div>
                <img class="absolute w-201.6px h-58.2px right-40px bottom-60px" src="@/assets/img/instro/to-my.png" alt="" />
            </section>
            <section class="instro_my" v-show="step === 4">
                <div class="youhui_btn"></div>
                <img class="ml-70px w-284px h-119px" src="@/assets/img/instro/4.png" alt="" />
                <div class="instro_btn next-btn mt--50px!" @click="toNext"></div>
            </section>
            <section v-show="step === 5">
                <img class="mt-333px ml-50px w-261px h-141px" src="@/assets/img/instro/5.png" alt="" />
                <div class="instro_btn next-btn mt--67px! ml-200px!" @click="toNext"></div>
                <div class="vkgameapp_btn"></div>
            </section>
            <section class="text-left" v-show="step === 6">
                <div class="user_btn" @click="toDeposit"></div>
                <img class="w-179px h-60px mt-6px ml-60px" src="@/assets/img/instro/6.png" alt="" />
            </section>
            <section v-show="step === 7">
                <div class="deposit_btn"></div>
                <img class="mt--230px ml-100px w-233px h-163px align-middle" src="@/assets/img/instro/7.png" alt="" />
                <div class="instro_btn endbtn mt--230px! ml-160px!" @click="toNext"></div>
            </section>
        </van-overlay>
    </div>
</template>

<style lang="scss" scoped>
.instro_dialog {
    text-align: center;
    .instro_btn {
        margin: 0 auto;
        width: 78px;
        height: 78px;
        background: url("@/assets/img/instro/start_nor.png") no-repeat center;
        background-size: 100% 100%;
        cursor: pointer;
        animation: scale95 0.3s linear alternate infinite;
        &:active {
            background-image: url("@/assets/img/instro/start_hov.png");
        }
        &.next-btn {
            background-image: url("@/assets/img/instro/next_nor.png");
            &:active {
                background-image: url("@/assets/img/instro/next_hov.png");
            }
        }
        &.endbtn {
            background-image: url("@/assets/img/instro/know_nor.png");

            &:active {
                background-image: url("@/assets/img/instro/know_hov.png");
            }
        }
    }
    .home_nav_list {
        background: url("@/assets/img/instro/first.png") no-repeat center;
        background-size: 100% 100%;
    }
    .tabbar-my-img {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 0.75rem;
        height: 0.49rem;
        background: url("@/assets/img/instro/my.png") no-repeat;
        background-size: 100% 100%;
        animation: scale95 0.5s linear alternate infinite;
    }
    .youhui_btn {
        margin: 2.79rem 0 0 0.04rem;
        width: 1.46rem;
        height: 0.46rem;
        background: url("@/assets/img/instro/youhui.png") no-repeat;
        background-size: 100% 100%;
    }
    .vkgameapp_btn {
        margin-left: 0.05rem;
        width: 1.46rem;
        height: 0.46rem;
        background: url("@/assets/img/instro/vkgameapp.png") no-repeat;
        background-size: 100% 100%;
    }
    .user_btn {
        margin: 4.34rem 0 0 0.05rem;
        width: 1.46rem;
        height: 0.46rem;
        background: url("@/assets/img/instro/user.png") no-repeat;
        background-size: 100% 100%;
        animation: scale95 0.5s linear alternate infinite;
    }
    .deposit_btn {
        margin: 4.88rem 0 0 0.18rem;
        width: 0.86rem;
        height: 0.81rem;
        background: url("@/assets/img/instro/deposit.png") no-repeat;
        background-size: 100% 100%;
    }
}
</style>
