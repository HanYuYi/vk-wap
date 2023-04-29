<script setup lang="ts">
import buy1 from "@/assets/img/active/general/goodLuckUpgrade/buy_1.jpg"
import buy2 from "@/assets/img/active/general/goodLuckUpgrade/buy_2.jpg"
import buy21 from "@/assets/img/active/general/goodLuckUpgrade/buy_2_1.jpg"
import buy3 from "@/assets/img/active/general/goodLuckUpgrade/buy_3.jpg"
import buy4 from "@/assets/img/active/general/goodLuckUpgrade/buy_4.jpg"

import { ref } from "vue"
import { Navigation } from "swiper"

const swiperIndex = ref(0)

const onSlideChange = ({ realIndex }: { realIndex: number }): void => {
    swiperIndex.value = realIndex
}

const swiperData = [
    {
        imgs: [buy1],
        desc: "在首页的[更多]中联系客服咨询转账手续费，然后至欧易APP首页点击【购买数字货币】。"
    },
    {
        imgs: [buy2, buy21],
        desc: "在【购买】页面中选择泰达币，输入购买金额，点击【购买USDT】，弹出购买方式，选择其中一种购买方式后点击【确认购买】。"
    },
    {
        imgs: [buy3],
        desc: "订单生成后，请确认购买数量和购买方式无误后，点击【下一步】。"
    },
    {
        imgs: [buy4],
        desc: "获得转账信息，需要在页面上规定的时间内完成转账，完成后点击【我已完成转账】即可，稍等片刻您的虚拟币会到账。"
    }
]
</script>

<template>
    <div class="guide-container">
        <h1>虚拟币买币教程</h1>
        <div class="guide-main">
            <div class="step-desc">
                <span>步骤{{ swiperIndex + 1 }}/{{ swiperData.length }} :</span>
                {{ swiperData[swiperIndex].desc }}
            </div>
            <swiper @slideChange="onSlideChange" :modules="[Navigation]" navigation autoHeight class="my-swiper buy-swiper">
                <swiper-slide v-for="(item, index) in swiperData" :key="index">
                    <div class="guide-content">
                        <img v-for="(obj, i) in item.imgs" :key="i" :src="obj" alt="" />
                    </div>
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "usdtdepositnew.scss";
</style>
