<script setup lang="ts">
import videoPlacehold from "@/assets/img/active/general/dcWallet/dc_video_cover.jpg"
import Img1 from "@/assets/img/active/general/dcWallet/advantage_1.png"
import Img2 from "@/assets/img/active/general/dcWallet/advantage_2.png"
import Img3 from "@/assets/img/active/general/dcWallet/advantage_3.png"
import Img4 from "@/assets/img/active/general/dcWallet/advantage_4.png"
import Img5 from "@/assets/img/active/general/dcWallet/advantage_5.png"
import Img6 from "@/assets/img/active/general/dcWallet/advantage_6.png"
import Img7 from "@/assets/img/active/general/dcWallet/advantage_7.png"
import Img8 from "@/assets/img/active/general/dcWallet/advantage_8.png"

import DPlayer from "dplayer"
import { nextTick, ref } from "vue"
import { useSysStore } from "@/stores/system"
import type { DPlayer as DPlayerType } from "@/types"

const systemParams = useSysStore()

const videoTutorialRef = ref<HTMLDivElement | null>(null)
const playerInstance = ref<DPlayerType | null>(null)
const advantageList = [
    {
        icon: Img1,
        title: "稳定代币",
        desc: "锚定USDT, 帮助用户实现RMB与数字货币的双向兑换，自由参与数字资产交易与投资。"
    },
    {
        icon: Img2,
        title: "资金安全",
        desc: "DC钱包采用金融级别运维风控系统，多维防护，确保资产安全。"
    },
    {
        icon: Img3,
        title: "全球通用",
        desc: "USDT币使用区块链技术具有高度匿名的特性，交易无迹可寻；世界范围内已有上千家大型商户支持USDT币，全球支付无障碍。"
    },
    {
        icon: Img4,
        title: "去中心化",
        desc: "RMB与USDT兑换，从平台提至DC钱包，有效保护银行卡流水，确保资金链不受银行风控，保护个人银行卡及资产安全。"
    },
    {
        icon: Img5,
        title: "简单 安全",
        desc: "遵从“极致简单”的产品设计理念，小白用户也能快速入手。<br>多重保护技术保障您的数字资产安全，放心管理您的钱包。"
    },
    {
        icon: Img6,
        title: "丰富优惠",
        desc: "丰富的活动内容，享受良好使用体验的同时领取各类豪礼。<br>7x24H在线客服 随时解答您的问题，为您的流畅使用保驾护航。"
    },
    {
        icon: Img7,
        title: "省心",
        desc: "不存在任何第三方费用，提币手续费用远低于各类型交易所。<br>严格的风控和24小时人工服务，为您打造无扰OTC交易环境。"
    },
    {
        icon: Img8,
        title: "极速",
        desc: "全新模式与强大生态伙伴，为您带来未曾有过的交易速度。"
    }
]

const initVideoTutorial = (): void => {
    nextTick(() => {
        const videoContainer: HTMLDivElement = videoTutorialRef.value
        playerInstance.value = new DPlayer({
            container: videoContainer,
            theme: "#07f1b7",
            video: {
                url: systemParams.mediaPath.dcwallet,
                pic: videoPlacehold
            }
        })

        playerInstance.value.on("resize", () => {
            if ([...videoContainer.classList].includes("dplayer-fulled")) {
                videoContainer.classList.add("full-screen")
            } else {
                videoContainer.classList.remove("full-screen")
            }
        })
    })
}

initVideoTutorial()
</script>

<template>
    <div class="font-classic leading-relaxed">
        <HeaderBar>
            <div class="header_title">DC钱包‧数字资产专家</div>
        </HeaderBar>
        <div class="expand-page dcWallet-page">
            <dl class="video-tutorial">
                <dt></dt>
                <dd>
                    <div ref="videoTutorialRef" class="video-wrapper"></div>
                </dd>
            </dl>

            <dl class="advantage">
                <dt></dt>
                <dd>
                    <ul>
                        <li v-for="(item, index) in advantageList" :key="index">
                            <i :style="{ backgroundImage: `url(${item.icon})` }"></i>
                            <h4>{{ item.title }}</h4>
                            <p v-html="item.desc"></p>
                        </li>
                    </ul>
                </dd>
            </dl>

            <div class="bottom-bar">
                <a href="https://dcfu.top/" target="_blank"></a>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dcWallet-page {
    background-image: url("@/assets/img/active/general/dcWallet/banner.png"), url("@/assets/img/active/general/dcWallet/bg.jpg") !important;
    background-repeat: no-repeat, no-repeat !important;
    background-position: center top, center 5.054rem !important;
    background-size: 100% auto, 100% auto !important;
    overflow: hidden;
    padding-bottom: 0.755rem;
    .video-tutorial {
        margin-top: 5.055rem;
        overflow: hidden;

        dt {
            margin-top: 0.35rem;
            height: 0.59rem;
            background: url("@/assets/img/active/general/dcWallet/tutorial_title.png") no-repeat center top;
            background-size: auto 100%;
        }

        dd {
            margin: 0.08rem auto 0;
            width: 3.75rem;
            height: 2.3rem;
            background: url("@/assets/img/active/general/dcWallet/video_bg.png") no-repeat center top;
            background-size: 100% 100%;
            overflow: hidden;

            .video-wrapper {
                width: 3.4rem;
                height: 1.95rem;
                margin: 0.16rem auto 0;

                :deep(video) {
                    object-fit: contain;
                }

                &.full-screen {
                    width: 100%;
                    height: 100%;
                    margin: 0 auto 0;
                }

                :deep(.dplayer-menu) {
                    width: 0;
                    pointer-events: none;
                }
            }
        }
    }
    .advantage {
        margin-top: 0.225rem;
        dt {
            height: 0.59rem;
            background: url("@/assets/img/active/general/dcWallet/advantage_title.png") no-repeat center top;
            background-size: auto 100%;
        }
        dd {
            ul {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                width: 3.58rem;
                margin: 0.2rem auto 0;
                li {
                    margin-bottom: 0.08rem;
                    width: 1.75rem;
                    height: 2.5rem;
                    background: url("@/assets/img/active/general/dcWallet/advantage_bg.png") no-repeat;
                    background-size: 100% 100%;
                    i {
                        display: block;
                        height: 1rem;
                        background-repeat: no-repeat;
                        background-position: center center;
                        background-size: auto 0.73rem;
                    }
                    h4 {
                        font-size: 0.18rem;
                        line-height: 0.18rem;
                        text-align: center;
                        color: #fff;
                    }
                    p {
                        margin: 0.085rem 0.1rem 0;
                        font-size: 0.13rem;
                        line-height: 0.18rem;
                        color: #9698d6;
                    }
                }
            }
        }
    }

    .bottom-bar {
        position: fixed;
        width: 100%;
        height: 0.6rem;
        left: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        background-image: url("@/assets/img/active/general/dcWallet/dc_logo.png"),
            url("@/assets/img/active/general/dcWallet/dc_title.png");
        background-repeat: no-repeat, no-repeat;
        background-position: 0.12rem center, 0.66rem center;
        background-size: 0.44rem auto, 1.535rem auto;
        text-align: right;
        a {
            display: inline-block;
            margin: 0.075rem 0.115rem 0 0;
            width: 0.935rem;
            height: 0.445rem;
            background: url("@/assets/img/active/general/dcWallet/download_link.png") no-repeat;
            background-size: 100% 100%;
        }
    }
}
</style>
<style>
@import "@/assets/style/dplayer.css";
</style>
