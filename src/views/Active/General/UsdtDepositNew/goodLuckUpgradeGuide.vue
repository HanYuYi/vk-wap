<script setup lang="ts">
import depo1 from "@/assets/img/active/general/goodLuckUpgrade/deposit_1.png"
import depo11 from "@/assets/img/active/general/goodLuckUpgrade/deposit_1_1.png"
import depo2 from "@/assets/img/active/general/goodLuckUpgrade/deposit_2.png"
import depo3 from "@/assets/img/active/general/goodLuckUpgrade/deposit_3.png"
import depo4 from "@/assets/img/active/general/goodLuckUpgrade/deposit_4.png"
import depo5 from "@/assets/img/active/general/goodLuckUpgrade/deposit_5.jpg"
import depo6 from "@/assets/img/active/general/goodLuckUpgrade/deposit_6.jpg"
import depo7 from "@/assets/img/active/general/goodLuckUpgrade/deposit_7.jpg"
import depo8 from "@/assets/img/active/general/goodLuckUpgrade/deposit_8.jpg"
import depo9 from "@/assets/img/active/general/goodLuckUpgrade/deposit_9.jpg"
import depo91 from "@/assets/img/active/general/goodLuckUpgrade/deposit_9_1.jpg"
import depo110 from "@/assets/img/active/general/goodLuckUpgrade/deposit_10.jpg"
import depo111 from "@/assets/img/active/general/goodLuckUpgrade/deposit_11.png"

import { ref } from "vue"
import { Navigation } from "swiper"

const swiperIndex = ref(0)
const onSlideChange = ({ realIndex }: { realIndex: number }): void => {
    swiperIndex.value = realIndex
}

const swiperData = [
    {
        imgs: [depo1, depo11],
        desc: "点击“我的-充值”，或点击“账户-充值”；"
    },
    {
        imgs: [depo2],
        desc: "输入充值金额，选择充值线路，点击“立即充值”按钮；"
    },
    {
        imgs: [depo3],
        desc: "选择充值币种， 请务必正确选择币种，否则可能导致支付错误，无法上分；"
    },
    {
        imgs: [depo4],
        desc: "复制支付链接或保存二维码后，进入币安交易平台，进入后续支付流程："
    },
    {
        imgs: [depo5],
        desc: "点击资产->资金账户->提现。"
    },
    {
        imgs: [depo6],
        desc: "在[链上提现] 中选择USDT- ERC20 后点击 [地址薄]。"
    },
    {
        imgs: [depo7],
        desc: "点击[添加地址]。"
    },
    {
        imgs: [depo8],
        desc: "使用页面中的扫码功能扫描刚刚保存在相册中的二维码，勾选[将该账户设置为免认证账户]后保存。"
    },
    {
        imgs: [depo9, depo91],
        desc: "在【资金账户】中点击【提现】，【提现】页面中选择【USDT】。"
    },
    {
        imgs: [depo110],
        desc: "选择【ERC20】后在地址簿中选择刚刚添加的平台存款地址并输入提现金额后点击【提交】（提现金额=存款页面显示的转入USDT数+手续费）。"
    },
    {
        imgs: [depo111],
        desc: "在第 ④ 步骤完成交易后，将交易ID粘贴至VKGAME“支付信息”页面的“区块链交易ID”输入框内，点击“支付完成”；"
    }
]
</script>

<template>
    <div class="guide-container">
        <h1>虚拟币存款教程</h1>
        <div class="guide-main">
            <div class="step-desc">
                <span>步骤{{ swiperIndex + 1 }}/{{ swiperData.length }} :</span>
                {{ swiperData[swiperIndex].desc }}
            </div>
            <swiper @slideChange="onSlideChange" :modules="[Navigation]" navigation autoHeight class="my-swiper deposit-swiper">
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
