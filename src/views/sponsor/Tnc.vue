<script setup lang="ts">
import CARLOPIC from "@/assets/img/sponsor/tnc/1.png"
import YOWEPIC from "@/assets/img/sponsor/tnc/2.png"
import KRISHPIC from "@/assets/img/sponsor/tnc/3.png"
import MAVISPIC from "@/assets/img/sponsor/tnc/4.png"
import BOKPIC from "@/assets/img/sponsor/tnc/5.png"
import ESL from "@/assets/img/sponsor/tnc/team/1.png"
import ESLT from "@/assets/img/sponsor/tnc/team/title-1.png"
import ONE from "@/assets/img/sponsor/tnc/team/2.png"
import ONET from "@/assets/img/sponsor/tnc/team/title-2.png"
import MDL from "@/assets/img/sponsor/tnc/team/3.png"
import MDLT from "@/assets/img/sponsor/tnc/team/title-3.png"
import Ham from "@/assets/img/sponsor/tnc/team/4.png"
import HamT from "@/assets/img/sponsor/tnc/team/title-4.png"
import Major from "@/assets/img/sponsor/tnc/team/5.png"
import MajorT from "@/assets/img/sponsor/tnc/team/title-5.png"
import MUMBA from "@/assets/img/sponsor/tnc/team/6.png"
import MUMBAIT from "@/assets/img/sponsor/tnc/team/title-6.png"
import WESG from "@/assets/img/sponsor/tnc/team/7.png"
import WESGT from "@/assets/img/sponsor/tnc/team/title-7.png"

import { useSysStore } from "@/stores/system"
import { animateCSS } from "@/composable/util"
import { ref, onMounted, nextTick } from "vue"

const systemParams = useSysStore()

const memArr = [
    { img: CARLOPIC, name: "CARLO" },
    { img: YOWEPIC, name: "YOWE" },
    { img: KRISHPIC, name: "KRISH" },
    { img: MAVISPIC, name: "MAVIS" },
    { img: BOKPIC, name: "BOK" }
] as const

const team = [
    {
        img: ESL,
        titleimg: ESLT,
        title: "ESL One泰国"
    },
    {
        img: ONE,
        titleimg: ONET,
        title: "ONE Esports SEA League"
    },
    {
        img: MDL,
        titleimg: MDLT,
        title: "MDL Chengdu Major"
    },
    {
        img: Ham,
        titleimg: HamT,
        title: "ESL One Hamburg 2019"
    },
    {
        img: Major,
        titleimg: MajorT,
        title: "EPICENTER Major"
    },
    {
        img: MUMBA,
        titleimg: MUMBAIT,
        title: "ESL One MUMBAI"
    },
    {
        img: WESG,
        titleimg: WESGT,
        title: "WESG 2018"
    }
] as const

onMounted(async () => {
    await nextTick()
    animateCSS(".winner", "animate-bounce-in-down")
    animateCSS(".tnc-gxsp", "animate-fade-in-up")
    animateCSS(".tnc-team", "animate-fade-in-up")
    animateCSS(".tnc-member", "animate-fade-in-up")
})
</script>

<template>
    <div class="tnc-page">
        <HeaderBar>
            <div class="header_title">TNC战队官方赞助商</div>
        </HeaderBar>
        <!-- 主内容 -->
        <section class="tnc-section">
            <div class="winner"></div>
            <div class="display">
                <!-- 官宣视频 -->
                <div class="tnc-gxsp">
                    <div class="tnc-title title-sp"></div>
                    <div class="media-wrapper flex-center">
                        <div class="inner-wrapper flex-center">
                            <div class="actual-size">
                                <video ref="videoRef" loop playsinline controls poster="@/assets/img/sponsor/poster.jpg">
                                    <source :src="systemParams.mediaPath.tnc" type="video/mp4" />
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 战队介绍 -->
                <div class="tnc-team select-none">
                    <div class="tnc-title title-team"></div>
                    <div class="team-wrapper">
                        <Vue3Marquee :pauseOnClick="true">
                            <ul class="ul-item">
                                <li class="li-item hstack flex-col" v-for="(item, index) in team" :key="index">
                                    <img class="team-img" :src="item.img" alt="" />
                                    <div class="title">{{ item.title }}</div>
                                    <img class="title-img" :src="item.titleimg" alt="" />
                                </li>
                            </ul>
                        </Vue3Marquee>
                    </div>
                    <div class="team-desc-wrapper">
                        <ol>
                            <li>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TNC战队全名为TNC Pro
                                Team，成立于2013年，在2015年东南亚赛区开始崭露头角，以黑马之姿多次冲进TI，在各大国际赛事舞台上掀起一股热潮并斩获多个联赛冠军。在经历了几年的磨砺和沉淀之后，TNC现已成为东南亚赛区的头名代表战队。
                            </li>
                        </ol>
                    </div>
                </div>
                <!-- 战队成员 -->
                <div class="tnc-member">
                    <div class="tnc-title title-mem"></div>
                    <div class="mem-wrapper flex flex-wrap">
                        <div class="mem-block" v-for="(item, i) in memArr" :key="i">
                            <img class="avatar" :src="item.img" alt="" />
                            <div class="mem-name">{{ item.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.animate__animated {
    animation-timing-function: ease-in-out;
}
.tnc-page {
    background-color: #416bb8;
    .tnc-section {
        background-image: url("@/assets/img/sponsor/tnc/bg.png");
        background-repeat: no-repeat;
        background-position: center top;
        background-size: contain;
        width: 100%;
        min-height: 980px;
        position: relative;
        padding-top: 258px;
        padding-bottom: 25px;
        box-sizing: border-box;
        position: relative;

        .winner {
            position: absolute;
            pointer-events: none;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 311px;
            background: url("@/assets/img/sponsor/tnc/banner.png") no-repeat center top;
            background-size: contain;
        }

        .display {
            position: relative;
        }

        .tnc-title {
            margin: auto;
            width: 347px;
            height: 28px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;

            &.title-sp {
                background-image: url("@/assets/img/sponsor/tnc/title-sp.png");
            }

            &.title-team {
                margin-top: 27px;
                margin-bottom: 15px;
                background-image: url("@/assets/img/sponsor/tnc/title-team.png");
            }

            &.title-mem {
                margin-top: 30px;
                background-image: url("@/assets/img/sponsor/tnc/title-member.png");
            }
        }

        .media-wrapper {
            margin: auto;
            width: 348px;
            height: 189px;
            background: url("@/assets/img/sponsor/tnc/video-bg.png") no-repeat center;
            background-size: 100% 100%;

            .inner-wrapper {
                width: 331px;
                height: 167px;
                background-image: linear-gradient(to right, #f95d50, #ffd57e);
            }

            .actual-size {
                width: 326px;
                height: 162px;
                background: #000000;

                video {
                    max-width: 100%;
                    max-height: 100%;
                    width: 100%;
                }
            }
        }

        .tnc-team {
            ul {
                list-style: none;
                padding: 0;
                margin: 0 auto;

                &.ul-item {
                    display: flex;

                    .li-item {
                        width: 144px;
                        height: 118px;
                        line-height: 1.46;
                        color: #fff;
                        margin-right: 5px;
                        text-align: center;
                        font-size: 12px;
                    }
                }
            }
            .team-img {
                width: 133px;
                height: 87px;
            }

            .title-img {
                width: 85.5px;
                height: 11.5px;
            }
        }
        .team-wrapper {
            margin: auto;
            width: 347px;
            height: 118px;
            overflow: hidden;
            box-sizing: border-box;
        }

        .team-desc-wrapper {
            margin: 19px auto 0;
            width: 347px;
            height: 126px;
            box-sizing: border-box;
            padding: 20px 22px;
            background: url("@/assets/img/sponsor/tnc/team-bg.png") no-repeat center;
            background-size: 100% 100%;
            font-size: 12px;
            color: #fff;
            line-height: 1.5;
        }

        .mem-wrapper {
            margin: 12px auto 0;

            .mem-block {
                width: 115px;
                height: 178.5px;
                background: url("@/assets/img/sponsor/tnc/mem-bg.png") no-repeat center;
                background-size: 100% 100%;
                margin-right: 8px;
                margin-bottom: 15px;
                position: relative;

                &:nth-child(1) {
                    margin-left: 68px;
                }

                &:nth-child(2) {
                    margin-right: 0;
                }

                &:nth-child(3) {
                    margin-left: 6px;
                }

                &:last-child {
                    margin-right: 0;
                }
            }

            .avatar {
                width: 107px;
                height: 178px;
                margin-left: 6px;
            }

            .mem-name {
                width: 100%;
                font-size: 14px;
                font-weight: 600;
                color: #fff;
                line-height: 2.24;
                position: absolute;
                text-align: center;
                bottom: 2px;
            }
        }
    }
}
</style>
