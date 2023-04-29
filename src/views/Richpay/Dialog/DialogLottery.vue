<script setup lang="ts">
import type { RichPayLottery } from "@/api/pojo/RichPayLottery"

/**
 * Props
 */
interface Props {
    lotteryData: Omit<RichPayLottery, "coupon_id"> | {}
}

withDefaults(defineProps<Props>(), {
    lotteryData: () => ({})
})
</script>

<template>
    <div class="cus-luck-draw">
        <!-- 红包-->
        <div class="award-type-1" v-if="lotteryData.type == 1">
            <div class="award-img">
                <p class="amount">
                    {{ lotteryData.gift_price && (+lotteryData.gift_price).toFixed(1) }}
                    <span>元</span>
                </p>
            </div>
            <button class="richpay_btn active" @click="$emit('close')">知道了</button>
            <p class="award-notice">
                <span>*</span>
                {{ lotteryData.message }}
            </p>
        </div>

        <!-- 翻倍券-->
        <div class="award-type-2" v-if="lotteryData.type == 2">
            <div class="award-img" :class="`fbq` + lotteryData.coupon_value.toString().replace('.', '_')"></div>
            <div class="btns-group">
                <button class="richpay_btn" @click="$emit('richPaySavePrize', 1)">加入我的背包</button>
                <button class="richpay_btn active" @click="$emit('richPaySavePrize', 2)">立即使用</button>
            </div>
            <p class="award-notice">
                <span>*</span>
                {{ lotteryData.message }}
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.cus-luck-draw {
    padding: 0.3rem 0.23rem 0;
    font-size: 0.15rem;
    text-align: left;

    .award-type-1 {
        text-align: center;

        .award-img {
            width: 2.21rem;
            height: 1.34rem;
            margin: 0 auto;
            overflow: hidden;
            background: url("@/assets/img/template/july/richpay/red_pack.png");
            background-size: 100% 100%;

            .amount {
                line-height: 1.6;
                margin-top: 0.94rem;
                font-size: 0.18rem;
                font-weight: bold;
                text-align: center;
                color: #fcfbb8;

                span {
                    font-size: 0.12rem;
                }
            }
        }

        .richpay_btn {
            margin-top: 0.25rem;
        }
    }

    .award-type-2 {
        text-align: center;

        .award-img {
            width: 2.21rem;
            height: 1.34rem;
            margin: 0 auto;
            overflow: hidden;

            &.fbq1_1 {
                background: url("@/assets/img/template/july/richpay/fbq_1.1.png");
                background-size: 100% 100%;
            }

            &.fbq1_5 {
                background: url("@/assets/img/template/july/richpay/fbq_1.5.png");
                background-size: 100% 100%;
            }

            &.fbq2 {
                background: url("@/assets/img/template/july/richpay/fbq_2.png");
                background-size: 100% 100%;
            }
        }

        .btns-group {
            margin-top: 0.22rem;
            display: flex;
            justify-content: space-between;
        }
    }

    .award-notice {
        margin-top: 0.17rem;
        font-size: 0.15rem;
        line-height: 0.15rem;
        text-align: center;
        color: #a1a3df;

        span {
            font-size: 30px;
            color: #83f9fd;
            margin-right: 0.07rem;
            vertical-align: -webkit-baseline-middle;
        }
    }
}
</style>
