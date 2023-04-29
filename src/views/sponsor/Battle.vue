<script setup lang="ts">
import kgImg from "@/assets/img/sponsor/battle/team/Keen-Gaming.png"
import ccImg from "@/assets/img/sponsor/battle/team/CDEC-Gaming.png"
import EHOMEImg from "@/assets/img/sponsor/battle/team/EHOME.png"
import NewbeeImg from "@/assets/img/sponsor/battle/team/Newbee.png"
import VGPImg from "@/assets/img/sponsor/battle/team/VGP.png"
import TeAdImg from "@/assets/img/sponsor/battle/team/Team-Adroit.png"
import TeAmImg from "@/assets/img/sponsor/battle/team/Team-Amplfy.png"
import T1Img from "@/assets/img/sponsor/battle/team/T1.png"
import FGImg from "@/assets/img/sponsor/battle/team/FTD-Guys.png"
import TSImg from "@/assets/img/sponsor/battle/team/Team-Serenity.png"
import SAGImg from "@/assets/img/sponsor/battle/team/SAG.png"
import IGImg from "@/assets/img/sponsor/battle/team/iG-Vitality.png"

import { onMounted, nextTick } from "vue"
import { animateCSS } from "@/composable/util"

const table = [
    { num: "1ST", label: "冠军", bonus: "¥275,000" },
    { num: "2ND", label: "亚军", bonus: "¥135,000" },
    { num: "3RD", label: "季军", bonus: "¥60,000" },
    { num: "4TH", label: "殿军", bonus: "¥30,000" }
] as const

const work = [
    {
        key: "xzs",
        title: "小组赛",
        desc: "8支战队分成两组进行GSL，前两名晋级淘汰赛，后两名直接淘汰。"
    },
    {
        key: "tts",
        title: "淘汰赛",
        desc: "小组赛晋级战队与直邀战队进行八强双败淘汰赛，除总决赛为BO5以外其余BO3 。"
    }
] as const

const teams = [
    {
        title: "Keen-Gaming",
        img: kgImg
    },
    {
        title: "CDEC-Gaming",
        img: ccImg
    },
    {
        title: "EHOME",
        img: EHOMEImg
    },
    {
        title: "Newbee",
        img: NewbeeImg
    },
    {
        title: "VGP",
        img: VGPImg
    },
    {
        title: "Team-Adroit",
        img: TeAdImg
    },
    {
        title: "Team-Amplfy",
        img: TeAmImg
    },
    {
        title: "T1",
        img: T1Img
    },
    {
        title: "FTD-Guys",
        img: FGImg
    },
    {
        title: "Team-Serenity",
        img: TSImg
    },
    {
        title: "SAG",
        img: SAGImg
    },
    {
        title: "iG-Vitality",
        img: IGImg
    }
] as const

onMounted(async () => {
    await nextTick()
    animateCSS(".slogan", "animate-zoom-in")
    animateCSS(".battle-desc-block", "animate-fade-in-up")
    animateCSS(".battle-bonus-block", "animate-fade-in-up")
    animateCSS(".battle-work-block", "animate-fade-in-up")
    animateCSS(".battle-member-block", "animate-fade-in-up")
})
</script>

<template>
    <div class="battle-page">
        <HeaderBar>
            <div class="header_title">黎明之战官方赞助商</div>
        </HeaderBar>
        <!-- 主内容 -->
        <section class="battle-section">
            <img src="@/assets/img/sponsor/battle/slogan.png" class="slogan" alt="" />
            <!-- 赛事简介 -->
            <div class="battle-desc-block">
                <div class="battle-title title-desc">
                    <div class="title-text">赛事简介</div>
                </div>
                <img src="@/assets/img/sponsor/battle/logo.png" class="logo" alt="" />
                <div class="battle-desc">
                    <ol>
                        <li>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;威客黎明之战为亚洲DOTA2职业队伍提供了友好切磋的机会，通过本次赛事让各大职业战队在新赛季进行尝试与磨合，为全球DOTA2爱好者们带来了一场视觉盛宴！该赛事邀请12支亚洲顶级队伍，赛事总奖金为50万元，最终由来自东南亚的Major队伍Team
                            Adroit获得总冠军。
                        </li>
                    </ol>
                </div>
            </div>
            <!-- 比赛奖金 -->
            <div class="battle-bonus-block">
                <div class="battle-title title-bonus">
                    <div class="title-text">比赛奖金</div>
                </div>
                <img src="@/assets/img/sponsor/battle/bonus.png" class="bonus-img" alt="" />
                <div class="bonus-table-wrapper flex-center">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tbody>
                            <tr v-for="(item, i) in table" :key="i">
                                <td>{{ item.num }}</td>
                                <td>{{ item.label }}</td>
                                <td>{{ item.bonus }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- 赛事赛制 -->
            <div class="battle-work-block">
                <div class="battle-title title-work">
                    <div class="title-text">赛事赛制</div>
                </div>
                <div class="work-line" :class="`work-line-${item.key}`" v-for="(item, i) in work" :key="i">
                    <div class="up">
                        <span class="up-title" :class="`title-${item.key}`">{{ item.title }}</span>
                        :
                    </div>
                    <div class="down">{{ item.desc }}</div>
                </div>
            </div>
            <!-- 参赛战队 -->
            <div class="battle-member-block">
                <div class="battle-title title-team">
                    <div class="title-text">参赛战队</div>
                </div>
                <div class="team-wrapper flex flex-wrap">
                    <div class="team-block" v-for="(item, i) in teams" :key="i">
                        <div class="team-logo-wrapper">
                            <div
                                class="team-logo"
                                :style="{
                                    backgroundImage: `url(${item.img})`
                                }"
                            ></div>
                        </div>
                        <div class="team-name">{{ item.title }}</div>
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
.battle-page {
    .battle-section {
        background: url("@/assets/img/sponsor/battle/bg.png") no-repeat center;
        background-size: contain;
        width: 100%;
        position: relative;
        min-height: 1466px;
        box-sizing: border-box;
        padding-top: 30px;
        color: #fff;

        .slogan {
            width: 345.5px;
            height: 118px;
            margin: auto;
            display: block;
        }

        .battle-title {
            margin: auto;
            width: 375px;
            height: 58.5px;
            line-height: 58.5px;
            background: url("@/assets/img/sponsor/battle/title-bg.png") no-repeat center;
            background-size: 100% 100%;
            font-size: 16px;
            color: #07f1b7;
            font-weight: 600;
            line-height: 1.14;
            letter-spacing: 0.8px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;

            .title-text {
                width: 36px;
                text-align: center;
            }

            &.title-desc {
                margin-top: 23.5px;
            }

            &.title-bonus {
                margin-top: 27px;
                margin-bottom: 15px;
            }

            &.title-work {
                margin-top: 30px;
                margin-bottom: 11.5px;
            }

            &.title-team {
                margin-top: 21px;
                margin-bottom: 10px;
            }
        }

        .logo {
            margin: 14px auto 0;
            width: 148.5px;
            height: 112.5px;
            display: block;
        }

        .battle-desc {
            width: 100%;
            margin: auto;
            box-sizing: border-box;
            padding: 0 23px;
            font-size: 12px;
            color: #fff;
            line-height: 1.5;
        }

        .bonus-img {
            width: 375px;
            height: 28px;
            display: block;
            margin: auto;
        }

        .bonus-table-wrapper {
            margin: 6.5px auto 0;
            width: 347px;
            height: 195.5px;
            background: url("@/assets/img/sponsor/battle/table-bg.png") no-repeat center;
            background-size: 100% 100%;

            table {
                margin: auto;
                text-align: center;

                td {
                    width: 33.333%;
                    font-size: 14px;
                    font-weight: bold;
                    line-height: 1.32;
                    color: #e1e1e1;
                    line-height: 32px;

                    &:first-of-type {
                        color: #07f1b8;
                    }
                }
            }
        }

        .work-line {
            width: 100%;
            box-sizing: border-box;
            padding: 0 13.5px;
            font-size: 12px;
            line-height: 1.5;
            margin: 0 auto 15px;

            &.work-line-xzs {
                white-space: nowrap;
            }

            .down {
                margin-top: 8px;
            }

            .up-title {
                display: inline-block;
                width: 58px;
                text-align: center;
                line-height: 20px;
                font-weight: 600;
                font-size: 15px;
                height: 20px;
                box-sizing: border-box;
                border-radius: 2.5px;
                margin-right: 7px;
                color: #1e3259;

                &.title-xzs {
                    background-image: linear-gradient(to right, #ff8e00, #ff6100);
                }

                &.title-tts {
                    background-image: linear-gradient(to right, #07f1b7, #07e9f1);
                }
            }
        }

        .team-wrapper {
            .team-block {
                margin-left: 13px;
                margin-bottom: 17px;
                text-align: center;
                font-size: 12px;
                line-height: 1;

                .team-logo-wrapper {
                    width: 78px;
                    height: 78px;
                    background: url("@/assets/img/sponsor/battle/team-logo-bg.png") no-repeat center;
                    background-size: 100% 100%;
                    margin-bottom: 8.5px;

                    .team-logo {
                        width: 78px;
                        height: 78px;
                        display: block;
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: cover;
                    }
                }
            }
        }
    }
}
</style>
