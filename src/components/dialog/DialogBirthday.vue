<script setup lang="ts">
import { gsap } from "gsap"
import { HttpPlus } from "@/api/HttpPlus"
import ApiSetting from "@/api/service"
import { getRandomIntInclusive } from "@/utils/numberUtils"
import { ref } from "vue"
import { whenever } from "@vueuse/core"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { useSysStore } from "@/stores/system"
import { useWalletStore } from "@/stores/wallet"

const systemParams = useSysStore()
const walletStore = useWalletStore()
const router: Router = useRouter()

class UserTakeBirthPresent {
    amount: number
    money_type: number
}

const show = ref(false)

const birthPrizeData = ref<Partial<UserTakeBirthPresent>>({})

const showLight = ref(false)

const lightRotate = ref(false)

const COINS_NUM = 20

const showCoin = ref(true)

whenever(
    () => systemParams.showBirthGift,
    () => {
        show.value = true
    }
)

const close = (): void => {
    systemParams.showBirthGift = false
}

const jumpToUser = (): void => {
    show.value = false
    router.push("/user")
}

// 金元宝掉落动画，带重力加速度
const coinAnimation = (): void => {
    for (let i = 0; i < COINS_NUM; i++) {
        const time: number = getRandomIntInclusive(5, 10)

        const timer = setTimeout(() => {
            showCoin.value = true
            const left: number = getRandomIntInclusive(-170, 170)
            const top: number = getRandomIntInclusive(-100, -30)

            let yRam: number = getRandomIntInclusive(2, 4)

            let xRam: number
            if (left < 0) {
                xRam = -getRandomIntInclusive(3, 12)
            } else {
                xRam = getRandomIntInclusive(3, 12)
            }

            const obj: HTMLElement = document.querySelector(".coin.c" + (i + 1))

            gsap.to(obj, {
                x: left + "px",
                y: top + "px",
                duration: 0.3,
                onComplete: () => {
                    clearTimeout(timer)
                    // 获取当前偏移量
                    const XLimit = 170
                    const YLimit = 350

                    const interval = setInterval(() => {
                        yRam += 3

                        const arr: string[] = obj.style.transform.split("(")[1].split(")")[0].split(",")
                        const currentX = parseFloat(arr[0])
                        const currentY = parseFloat(arr[1])
                        let l = currentX + xRam
                        let t = currentY + yRam
                        if (l >= XLimit) {
                            xRam *= -0.8
                            l = XLimit
                        }
                        if (l <= -170) {
                            xRam *= -0.8
                            l = -170
                        }
                        if (t >= YLimit) {
                            yRam *= -0.8
                            xRam *= 0.8
                            t = YLimit
                        }
                        if (t <= 0) {
                            yRam *= -1
                            xRam *= 0.8
                            t = 0
                        }
                        if (Math.abs(xRam) < 1) {
                            xRam = 0
                        }
                        if (Math.abs(yRam) < 1) {
                            yRam = 0
                        }
                        if (xRam === 0 && yRam == 0 && t === YLimit) {
                            clearInterval(interval)
                        } else {
                            obj.style.transform = `translate(${l}px, ${t}px)`
                        }
                    }, 30)
                }
            })
        }, time * 100)
    }
}

const openGift = async (): Promise<void> => {
    if (systemParams.dialogData?.type === 6 && systemParams.dialogData?.id) {
        HttpPlus.setUrlOptions(ApiSetting.index.takeBirthPresent)
        const res = await HttpPlus.sendHttpRequest<UserTakeBirthPresent, { id: number }>({
            id: systemParams.dialogData?.id
        })

        if (res.status === 1) {
            birthPrizeData.value = res.data
            showLight.value = true

            const timer = setTimeout(() => {
                lightRotate.value = true
                clearTimeout(timer)
            }, 400)

            const { money_type } = res.data

            money_type === 1 ? walletStore.getUserMoney("NM") : walletStore.getUserVbMoney()
            coinAnimation()
        }
    }
}
</script>

<template>
    <div v-if="systemParams.showBirthGift">
        <van-dialog
            teleport="body"
            close-on-click-overlay
            v-model:show="show"
            :show-confirm-button="false"
            @close="close"
            className="birth-gift-diolog"
        >
            <div class="relative w-320px pt-20px">
                <div class="bag-wrapper pt-152px text-center text-white text-14px">
                    <div
                        class="text-wrapper w-264px m-auto pl-26px pr-20px"
                        :class="{
                            'text-opened': showLight
                        }"
                    >
                        <div class="before-open">
                            <div class="font-bold text-40px mb-10px">生日大礼包</div>
                            <div>
                                亲爱的，今天是您的生日，
                                <br />
                                给您准备了生日礼物哦！
                            </div>
                        </div>
                        <div class="after-open">
                            <div class="text-50px mb-0 font-bold">
                                {{ birthPrizeData.amount ? birthPrizeData.amount : "-" }}
                            </div>
                            <div class="text-30px mb-5px">恭喜您!</div>
                            <div class="text-16px mb-6.1px">
                                获得{{ birthPrizeData.amount ? birthPrizeData.amount : "-"
                                }}{{ birthPrizeData.money_type == 1 ? "元" : "VB" }}红包
                            </div>
                            <div class="get_prize_tips">
                                赶快到
                                <span class="text-#efc165" @click="jumpToUser">个人中心</span>
                                我的账户查看吧！
                            </div>
                        </div>
                    </div>
                    <div class="open-btn-wrapper" v-if="!showLight">
                        <div class="open-btn-img" @click="openGift"></div>
                    </div>
                </div>
                <div
                    class="light_box"
                    :class="{
                        show: showLight,
                        animate: lightRotate
                    }"
                ></div>
                <div class="coins_box">
                    <div class="coin" :class="['c' + n]" v-for="n in COINS_NUM" :key="n" v-show="showCoin"></div>
                </div>
                <div class="dialog_close_btn" @click="show = false"></div>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss">
.birth-gift-diolog {
    overflow: visible;
    width: 320px;
    .coins_box {
        position: absolute;
        z-index: 3;
        width: 200px;
        height: 60px;
        top: 122px;
        left: 62px;
        .coin {
            position: absolute;
            width: 50px;
            height: 50px;
            left: 72px;
            top: 0;
            background: url("@/assets/img/home/birthprize/icon-bg1.png") no-repeat center;
            background-size: contain;
            &:nth-child(2n) {
                background-image: url("@/assets/img/home/birthprize/icon-bg2.png");
            }
            &:nth-child(3n) {
                background-image: url("@/assets/img/home/birthprize/icon-bg3.png");
            }
            &:nth-child(4n) {
                background-image: url("@/assets/img/home/birthprize/icon-bg4.png");
            }
        }
    }
    .bag-wrapper {
        width: 320px;
        height: 460px;
        position: relative;
        background: url("@/assets/img/home/birthprize/birth_prize_bg.png") no-repeat center top;
        background-size: 100% auto;
        z-index: 2;
        line-height: 1.6;
        .text-wrapper {
            .after-open {
                display: none;
                opacity: 0;
            }
            &.text-opened {
                .before-open {
                    display: none;
                }
                .after-open {
                    display: block;
                    animation: 0.6s fade_in ease-in forwards;
                    animation-delay: 0.2s;
                }
            }
        }
    }
    .light_box {
        width: 340px;
        height: 340px;
        background: url("@/assets/img/home/birthprize/bg_light.png") no-repeat center;
        background-size: contain;
        transform: scale3d(0.2, 0.2, 0.2);
        transition: all 0.4s;
        position: absolute;
        top: -52px;
        left: -17px;
        &.show {
            transform: scale3d(1, 1, 1);
        }

        &.animate {
            transition: none;
            animation: 10s rotate360 linear infinite;
        }
    }
    .dialog_close_btn {
        position: absolute;
        width: 0.42rem;
        height: 0.42rem;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        background: url("@/assets/img/home/birthprize/btn_close_bg.png") no-repeat center;
        background-size: 100% 100%;
        z-index: 3;
    }
    .open-btn-wrapper {
        margin: auto;
        position: relative;
        left: 3px;
        width: 264px;
        height: 80px;
        background: url("@/assets/img/home/birthprize/open_bg.png") no-repeat center;
        background-size: contain;
        padding-top: 20px;
        .open-btn-img {
            margin: auto;
            width: 66px;
            height: 66px;
            background: url("@/assets/img/home/birthprize/btn-open-normal.png") no-repeat center;
            background-size: 100% auto;
            &:active {
                background-image: url("@/assets/img/home/birthprize/btn-open-hover.png");
            }
        }
    }
}
</style>
