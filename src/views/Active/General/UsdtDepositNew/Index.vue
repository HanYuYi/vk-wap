<script setup lang="ts">
import Img1 from "@/assets/img/active/general/goodLuckUpgrade/guide_1.png"
import Img2 from "@/assets/img/active/general/goodLuckUpgrade/guide_2.png"
import Img3 from "@/assets/img/active/general/goodLuckUpgrade/guide_3.png"
import Img4 from "@/assets/img/active/general/goodLuckUpgrade/guide_4.png"
import Img5 from "@/assets/img/active/general/goodLuckUpgrade/guide_5.png"

import goodLuckUpgradeActive from "./goodLuckUpgradeActive.vue"
import goodLuckUpgradeGuide from "./goodLuckUpgradeGuide.vue"
import goodLuckUpgradeBuy from "./goodLuckUpgradeBuy.vue"

import { reactive, ref } from "vue"

const themeVars = reactive({
    TabsLineHeight: "50px"
})

const activeIndex = ref(0)
const guideRouter = [Img1, Img2, Img3, Img4, Img5]
</script>

<template>
    <div class="font-classic leading-relaxed">
        <HeaderBar>
            <div class="header_title">虚拟币存送再升级</div>
        </HeaderBar>
        <div class="expand-page virtual-deposit-page">
            <div class="deposit-section">
                <img src="@/assets/img/active/general/goodLuckUpgrade/banner.jpg" alt="" />
            </div>

            <div class="deposit-article">
                <van-config-provider :theme-vars="themeVars">
                    <van-tabs
                        line-width="0"
                        title-inactive-color="white"
                        title-active-color="white"
                        v-model:active="activeIndex"
                        class="active-tab"
                    >
                        <van-tab title="充值添彩头"></van-tab>
                        <van-tab title="虚拟币存款教程"></van-tab>
                        <van-tab title="虚拟币买币教程"></van-tab>
                    </van-tabs>
                </van-config-provider>

                <!-- 充值添彩头活动-->
                <goodLuckUpgradeActive v-show="activeIndex === 0"></goodLuckUpgradeActive>

                <div v-show="activeIndex === 1 || activeIndex === 2" class="guide-panel">
                    <h2>
                        本教程以威客App及欧易App为例，
                        <a href="https://www.okex.com">下载欧易App</a>
                        <br />
                        如需了解其他虚拟币平台，请
                        <router-link to="/guide/cryptocurrency">点击查看更多</router-link>
                    </h2>

                    <!-- 虚拟币存款教程-->
                    <goodLuckUpgradeGuide v-if="activeIndex === 1"></goodLuckUpgradeGuide>
                    <!-- 虚拟币买币教程-->
                    <goodLuckUpgradeBuy v-if="activeIndex === 2"></goodLuckUpgradeBuy>

                    <!-- 注意事项-->
                    <dl class="note">
                        <dt>【注意事项】</dt>
                        <dd>
                            <ul>
                                <li>操作时请尽快完成[购买USDT]与[平台USDT存款]步骤，以免长时间未完成操作导致二维码失效。</li>
                                <li>
                                    请购买与存款页面所相对应的USDT类型，如在存款页面选择ERC20则购买时也选择ERC20，不同类型转账将导致失败。
                                </li>
                                <li>转出时需要支付少量手续费，请在买币前联系对应交易平台客服了解手续费数量。</li>
                                <li>若三次取消交易当日将无法再进行买入。</li>
                                <li>如遇交易平台无法打开时建议尝试更换浏览器或开启VPN进行操作。</li>
                                <li>进行任意交易前请确认好信息。</li>
                                <li>
                                    本使用说明为热门交易平台功能介绍，不负责担保任何交易结果，使用中若遇到操作、账户类的问题，请在交易平台[帮助中心]联系[在线客服]。
                                </li>
                                <li>若交易平台的内容有所变更，一切以交易平台官方信息为准。</li>
                            </ul>
                        </dd>
                    </dl>

                    <!-- 虚拟币相关内容-->
                    <dl class="guide-footer">
                        <dt></dt>
                        <dd>
                            <ul>
                                <li
                                    v-for="(item, index) in guideRouter"
                                    :key="index"
                                    :style="{
                                        'background-image': `url(${item})`,
                                        'background-size': '100% 100%'
                                    }"
                                >
                                    <router-link :to="`/guide/cryptocurrency?id=${index}`"></router-link>
                                </li>
                            </ul>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.virtual-deposit-page {
    :deep(.van-tab) {
        background: #32705d;
        &:first-child {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
        }
        &:nth-child(2) {
            margin: 0 1px;
        }
        &:nth-child(3) {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
        }
    }
    :deep(.van-tab--active) {
        background: #50a08b;
    }
    .deposit-section {
        width: 100%;
        height: 144px;
        img {
            width: 100%;
            max-height: 144px;
        }
    }
    .deposit-article {
        overflow: hidden;
        background: url("@/assets/img/active/general/goodLuckUpgrade/bg.jpg") no-repeat repeat;
        background-size: 100% auto;
        .active-tab {
            margin: 0.2rem 0.1rem 0;
            a {
                height: 0.38rem;
                line-height: 0.38rem;
                background: #32705d;
                color: #ffffff;
                font-size: 0.15rem;
                &.vux-button-tab-item-first,
                &.vux-button-tab-item-first:after {
                    border-top-left-radius: 0.05rem;
                    border-bottom-left-radius: 0.05rem;
                    border: 0;
                }
                &.vux-button-tab-item-middle {
                    margin: 0 1px;
                    &:after {
                        border: 0;
                    }
                }
                &.vux-button-tab-item-last,
                &.vux-button-tab-item-last:after {
                    border-top-right-radius: 0.05rem;
                    border-bottom-right-radius: 0.05rem;
                    border: 0;
                }
                &.vux-button-group-current {
                    background: #50a08b;
                }
            }
        }
    }
    .guide-panel {
        overflow: hidden;
        h2 {
            font-size: 0.13rem;
            text-align: center;
            color: #3a4040;
            margin: 0.1rem 0.18rem 0.1rem;
            line-height: 0.3rem;
            font-weight: normal;

            a {
                color: #006cb4;
                text-decoration: underline;
            }
        }
    }
    .note {
        margin: 0 0.18rem 0.15rem 0.38rem;
        font-size: 0.15rem;
        line-height: 0.22rem;
        color: #3a4040;
        dd {
            ul {
                li {
                    position: relative;
                    list-style: initial;
                    &::marker {
                        position: absolute;
                        display: inline-block;
                        width: 0.3rem;
                        height: 0.18rem;
                        content: "·\00A0\00A0";
                        font-size: 0.18rem;
                        line-height: 0.18rem;
                        margin-right: 0.2rem;
                    }
                }
            }
        }
    }
    .guide-footer {
        overflow: hidden;
        height: 2.06rem;
        background-image: linear-gradient(to right, #40b59a, #116e66);
        dt {
            width: 2.295rem;
            height: 0.165rem;
            background-image: url("@/assets/img/active/general/goodLuckUpgrade/guide_title.png");
            background-size: 100% 100%;
            font-size: 0.17rem;
            line-height: 0.12rem;
            text-align: center;
            color: #ffffff;
            margin: 0.2rem auto;
        }
        dd {
            margin: 0 0.42rem 0 0.53rem;
            ul {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                li {
                    width: 1.3rem;
                    height: 0.3rem;
                    margin-bottom: 0.2rem;
                    a {
                        display: block;
                        width: inherit;
                        height: inherit;
                    }
                }
            }
        }
    }
}
</style>
