<script setup lang="ts">
import VirCourse from "./VirCourse.vue"
import VpnCourse from "./VpnCourse.vue"
import AboutVirActive from "./AboutVirActive.vue"
import { ref } from "vue"

const tabIndex = ref(0)
const TABS = ["数字货币<br>使用教程", "VPN下载<br>使用教程", "数字货币相<br>关活动介绍"]
</script>

<template>
    <div class="font-classic leading-relaxed bg-#1e1941">
        <HeaderBar>
            <div class="header_title">数字币钱包存取款教程</div>
        </HeaderBar>
        <div class="expand-page virtual-coin-course" :class="{ 'has-fixed': tabIndex < 2 }">
            <div class="usdt-rotate">
                <div class="big-bg"></div>
                <div class="big-usdt"></div>
            </div>

            <ul class="tab">
                <li
                    v-for="(txt, index) in TABS"
                    :key="index"
                    @click="tabIndex = index"
                    :class="{ active: tabIndex === index }"
                    v-html="txt"
                ></li>
            </ul>

            <VirCourse v-if="tabIndex === 0" />
            <VpnCourse v-if="tabIndex === 1" />
            <AboutVirActive v-if="tabIndex === 2" />

            <!-- 底部固定栏-->
            <div v-if="tabIndex < 2" class="left-info">
                <template v-if="tabIndex === 0">
                    <div class="logo-head">
                        <div class="favicon okex"></div>
                        <div class="txt">
                            <div class="name">欧易OKX APP</div>
                            <div class="desc">移动交易，随时随地</div>
                        </div>
                    </div>
                    <a href="https://vkgame.live/okex.php" target="_blank">下载欧易</a>
                </template>
                <template v-if="tabIndex === 1">
                    <div class="logo-head">
                        <div class="favicon booster"></div>
                        <div class="txt">
                            <div class="name">快橙APP</div>
                            <div class="desc">永远能连上的VPN</div>
                        </div>
                    </div>
                    <a href="https://vkgame.live/vpn.php" target="_blank">下载快橙</a>
                </template>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.virtual-coin-course {
    padding-top: 0.46rem;
    background-image: url("@/assets/img/virtualCoiCourse/banner.png"), url("@/assets/img/virtualCoiCourse/grid_bg.png"),
        linear-gradient(to top right, #100d25, #1e1941) !important;
    background-size: 100% auto, 100% auto, 100% 100% !important;
    background-repeat: no-repeat, repeat, repeat !important;
    overflow: hidden;
    position: relative;
    &.has-fixed {
        padding-bottom: 0.765rem;
    }

    .usdt-rotate {
        position: absolute;
        top: 0.025rem;
        right: 0.3rem;
        width: 1.7rem;
        height: 1.7rem;
        .big-bg {
            width: inherit;
            height: inherit;
            background: url("@/assets/img/virtualCoiCourse/usdt_icon_rotate.png");
            background-size: 100% 100%;
            animation: 20s usdtRotate linear infinite;
        }
        .big-usdt {
            width: 0.75rem;
            height: 0.75rem;
            position: absolute;
            top: 0.475rem;
            left: 0.475rem;
            background: url("@/assets/img/virtualCoiCourse/usdt_icon.png");
            background-size: 100% 100%;
        }
        @keyframes usdtRotate {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    }

    .tab {
        width: 3.455rem;
        margin: 2.78rem auto 0;
        display: flex;
        justify-content: space-between;
        li {
            width: 1.125rem;
            height: 0.39rem;
            font-size: 0.15rem;
            line-height: 0.16rem;
            font-weight: bold;
            color: #fff;
            text-shadow: 0 0.01rem 0.03rem rgba(7, 3, 76, 0.7);
            background-image: url("@/assets/img/virtualCoiCourse/tab_item.png");
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            &.active {
                background-image: url("@/assets/img/virtualCoiCourse/tab_item_hover.png");
                background-size: 100% 100%;
            }
        }
    }

    .left-info {
        position: fixed;
        z-index: 11;
        left: 0;
        bottom: 0;
        width: 100vw;
        padding: 0 0.15rem;
        height: 0.64rem;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .logo-head {
            display: flex;
            justify-content: space-between;
            .favicon {
                width: 0.4rem;
                height: 0.4rem;
                background-size: 100% 100%;
                &.okex {
                    background-image: url("@/assets/img/virtualCoiCourse/okex_faviocn.png");
                }
                &.booster {
                    background-image: url("@/assets/img/virtualCoiCourse/booster_favicon.png");
                }
            }
            .txt {
                margin: 0.03rem 0 0 0.1rem;
                line-height: 0.175rem;
                height: 0.33rem;
                font-size: 0.15rem;
                color: #001fd3;
                .name {
                    display: block;
                }
                .desc {
                }
            }
        }
        & > a {
            //margin-top: 0.18rem;
            display: block;
            width: 0.8rem;
            height: 0.28rem;
            border-radius: 0.14rem;
            background-color: #001fd3;
            font-size: 0.15rem;
            text-align: center;
            line-height: 0.28rem;
            color: #fff;
        }
    }
}
</style>
