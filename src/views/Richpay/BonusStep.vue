<script setup lang="ts">
import { ref } from "vue"
import type { SwipeInstance } from "vant"

let collapse = ref(true)
const currentIndex = ref(0)
const swipeRef = ref<SwipeInstance>(null)

const STEP_LIST = [
    "将主钱包中完成提款流水要求的资金转入威客V富通钱包，转入资金最低1元起。",
    [
        "A.单笔资金每小时派息一次，会持续派发七日，利息收益自动加入“未提利息”",
        "B.若当日单笔存入≥1000元，且该笔资金存满6小时即可免费获得1次抽奖机会。会员每日最多可获取1次抽奖机会，抽奖次数最多可累计7次。"
    ],
    ["A.当“未提利息”有额度时，您可随时点击“提息”提出收益;", "B.当已获得抽奖机会时，您可点击“立即抽奖”。"],
    [
        "A.您可将收益提至主钱包，也可提至V富通钱包继续收息。",
        "B1.若抽中现金自动加入主钱包，1倍流水即可提款；",
        "B2.若抽中翻倍券并使用，使用后当日内所有利息收益翻倍。"
    ]
]

const changeSwipe = (index: number): void => {
    currentIndex.value = index
}
</script>

<template>
    <div class="main">
        <div class="richpay_head" :class="{ richpay_head_collapse: collapse }" @click="collapse = !collapse">
            V富通钱包获取收益步骤
            <i class="fold_icon" :class="{ open: !collapse }"></i>
        </div>
        <transition name="slide-fade">
            <div class="richpay_content" v-if="!collapse">
                <div class="table-panel">
                    <i class="index-icon">{{ currentIndex + 1 }}</i>
                    <van-swipe
                        ref="swipeRef"
                        class="vrich-step"
                        loop
                        :autoplay="3000"
                        :stop-propagation="false"
                        @change="changeSwipe"
                        :show-indicators="false"
                    >
                        <van-swipe-item class="home_swipe_item" v-for="(item, index) in STEP_LIST" :key="index">
                            <ul>
                                <template v-if="typeof item === 'string'">
                                    {{ item }}
                                </template>
                                <template v-else>
                                    <li v-for="(txt, i) in item" :key="i">{{ txt }}</li>
                                </template>
                            </ul>
                        </van-swipe-item>
                    </van-swipe>
                    <div class="point-group">
                        <i class="prev" @click="swipeRef.prev()"></i>
                        <i class="next" @click="swipeRef.next()"></i>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
.table-panel {
    border-top: 1px solid transparent;
    margin: 0 auto 0.195rem;
    width: 3rem;
    padding-bottom: 0.065rem;
    position: relative;

    .index-icon {
        position: absolute;
        z-index: 1;
        left: calc((100% - 0.47rem) / 2);
        top: 0.06rem;
        width: 0.47rem;
        height: 0.36rem;
        background: url("@/assets/img/template/july/richpay/step_icon.png");
        background-size: 100% 100%;
        font-size: 0.15rem;
        font-weight: bold;
        line-height: 0.36rem;
        text-align: center;
        color: #4046cb;
    }

    .vrich-step {
        width: 2.8rem;
        height: 1.7rem;
        background: #4046cb;
        margin: 0.25rem auto 0;

        .home_swipe_item {
            ul {
                width: calc(100% - 0.28rem);
                height: calc(100% - 0.4rem);
                margin: 20px auto;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-content: center;
                flex-wrap: wrap;
                font-size: 0.15rem;
                line-height: 0.19rem;
                color: #fff;
            }
        }
    }

    .point-group {
        position: absolute;
        width: 3.35rem;
        height: 0;
        left: -0.175rem;
        top: 1.05rem;
        display: flex;
        justify-content: space-between;

        i {
            display: inline-block;
            width: 0.15rem;
            height: 0.22rem;

            &.prev {
                background: url("@/assets/img/template/july/richpay/step_prev.png");
                background-size: 100% 100%;
            }

            &.next {
                background: url("@/assets/img/template/july/richpay/step_next.png");
                background-size: 100% 100%;
            }
        }
    }
}
</style>
