<script setup lang="ts">
import img1 from "@/assets/img/template/july/richpay/swiper_1.png"
import img2 from "@/assets/img/template/july/richpay/swiper_2.png"
import img3 from "@/assets/img/template/july/richpay/swiper_3.png"
import img4 from "@/assets/img/template/july/richpay/swiper_4.png"
import img5 from "@/assets/img/template/july/richpay/swiper_5.png"

import { ref } from "vue"

/**
 * Emits
 */
interface Emits {
    (e: "openrate"): void
}
const emit = defineEmits<Emits>()

let collapse = ref(true)

const BANNER_LIST = [
    {
        img: img1,
        title: "时时计息",
        tip: "每小时计算收益 最低一元起存",
        desc: "• 提款时将主钱包中可提资金转入V富通钱包，最低1元即可转入。<br>• 每一笔转入资金无论金额大小，每小时派息一次，持续派发七日。"
    },
    {
        img: img2,
        title: "存取无忧",
        tip: "本金利息随时提 收益无流水要求",
        desc: "• 您可24小时随时转出本金到主钱包，无任何流水要求。<br>• 您可24小时随时提利息收益到主钱包，提出收益无任何流水要求"
    },
    {
        img: img3,
        title: "超高利率",
        tip: "相比同类余额宝 高出15倍利率收益",
        desc: '• 为VIP用户的您提供最高16%的年利率基准收益。<br>• 翻倍券加持下最高可获得32%的利率收益，高于余额宝利率15倍<br><span style="color:#6842c0;text-decoration:underline;margin-top:.1rem;text-align:center;display:block;width:100%">查看VIP收益率表</span>'
    },
    {
        img: img4,
        title: "额外奖励",
        tip: "一周七天每天一次 现金翻倍券送不停",
        desc: "• 当日单笔存入≥1000元，且该笔资金存满6小时即可免费获得1次抽奖机会；参与抽奖可获得利息翻倍劵或现金红包等奖励，会员每日最多可获取1次抽奖机会，抽奖时间不限；每位会员抽奖次数最多可累计7次。（VIP0用户暂无此额外奖励）"
    },
    {
        img: img5,
        title: "资金安全",
        tip: "降低风控风险 安心游戏更畅爽",
        desc: "• 将资金从主钱包转入本钱包能最大程度避免因银行账户流水过高和交易频繁引发的银行风控风险，让您的游戏资金更安全。"
    }
]

const viewRate = (i: number): void => {
    if (i === 2) {
        emit("openrate")
    }
}
</script>

<template>
    <div class="main">
        <div class="richpay_head" :class="{ richpay_head_collapse: collapse }" @click="collapse = !collapse">
            V富通钱包五大特点和优势
            <i class="fold_icon" :class="{ open: !collapse }"></i>
        </div>
        <transition name="slide-fade">
            <div class="richpay_content" v-if="!collapse">
                <div class="table-panel w-324px mx-auto mb-19.5px border-1px border-transparent">
                    <van-swipe class="vrich_swipe" autoplay="3000" loop :stop-propagation="false" indicator-color="white">
                        <van-swipe-item class="home_swipe_item" v-for="(item, index) in BANNER_LIST" :key="index">
                            <img class="swiper_item_bg" :src="item.img" />
                            <div class="text-box">
                                <p class="title-tip leading-relaxed">
                                    <span>• {{ item.title }} •</span>
                                    <span>{{ item.tip }}</span>
                                </p>
                                <p class="desc" v-html="item.desc"></p>
                                <p class="click-area" @click="viewRate(index)"></p>
                            </div>
                        </van-swipe-item>
                    </van-swipe>
                </div>
            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
.vrich_swipe {
    width: 3.24rem;
    padding-bottom: 0.18rem;
    margin-top: 0.2rem;

    .swiper_item_bg {
        width: 3.24rem;
        height: 1.64rem;
        pointer-events: auto;
    }

    .text-box {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0.1rem;
        top: 0;
        border-radius: 0.1rem;

        .title-tip {
            color: #fff;
            margin-top: 0.02rem;

            span:nth-child(1) {
                font-size: 0.14rem;
                font-weight: bold;
                margin-right: 0.03rem;
            }
        }

        .desc {
            width: 1.8rem;
            color: #383bb2;
            line-height: 0.15rem;
            margin-left: 1.25rem;
            margin-top: 20%;
            transform: translateY(-50%);
            font-size: 0.12rem;
        }

        .click-area {
            position: absolute;
            height: 0.2rem;
            width: 1.2rem;
            bottom: 0.2rem;
            right: 0.5rem;
        }

        .check {
            color: #6842c0;
            text-decoration: underline;
        }
    }

    :deep(.van-swipe__indicators) {
        position: absolute;
        bottom: 0 !important;
        display: flex;
        align-items: center;

        .van-swipe__indicator {
            width: 0.07rem;
            height: 0.07rem;
            background-color: rgba(86, 162, 254, 0.8);
            margin-right: 0.12rem;
        }

        .van-swipe__indicator--active {
            width: 0.1rem;
            height: 0.1rem;
            position: relative;
            background: url("@/assets/img/template/july/richpay/dot.png");
            background-size: 100% 100%;
        }
    }
}
</style>
