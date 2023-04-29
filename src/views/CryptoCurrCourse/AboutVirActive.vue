<script setup lang="ts">
import Img1 from "@/assets/img/virtualCoiCourse/usdtdeposit.jpg"
import Img2 from "@/assets/img/virtualCoiCourse/goodluckupgrade.jpg"
import Img3 from "@/assets/img/virtualCoiCourse/richpay.jpg"

const ACTIVE_LIST = [
    {
        title: "USDT三重好礼",
        url: "/usdtdeposit",
        img: Img1,
        desc: "全新注册会员首存送58%，全新注册会员续存送68%，全新注册会员三存送40%"
    },
    {
        title: "虚拟币存送再升级",
        url: "/goodluckupgrade",
        img: Img2,
        desc: "在规定时间内首充并使用虚拟币进行存款，笔笔都送好运金，最高588元"
    },
    {
        title: "V富通2.0",
        url: "/richpay",
        img: Img3,
        desc: "年利率加码翻倍最高32%  存取快  收益稳  转账红包天天领"
    }
]
</script>

<template>
    <div class="about-vir-active">
        <ul>
            <li v-for="(item, index) in ACTIVE_LIST" :key="index">
                <h3 class="title">
                    <span>{{ item.title }}</span>
                </h3>

                <img :src="item.img" alt="" />

                <p class="desc">{{ item.desc }}</p>

                <router-link :to="item.url" class="to-active">立即参加</router-link>
            </li>
        </ul>

        <p class="more">更多虚拟币精彩活动，敬请期待</p>
    </div>
</template>

<style lang="less" scoped>
.about-vir-active {
    margin-top: 0.165rem;
    ul {
        li {
            width: 365px;
            padding: 0 0.155rem;
            height: 3.615rem;
            margin: 0.075rem auto 0;
            background-image: url("@/assets/img/virtualCoiCourse/course_bg_big.png");
            background-size: 100% 100%;
            overflow: hidden;

            .title {
                margin-top: 0.155rem;
                font-size: 0.15rem;
                line-height: 0.15rem;
                text-align: center;
                font-weight: normal;
                color: #fff;
                span {
                    margin: 0 auto;
                    position: relative;
                    &:before,
                    &:after {
                        position: absolute;
                        top: 0.01rem;
                        content: "";
                        width: 0.18rem;
                        height: 0.13rem;
                        background-size: 100% 100%;
                    }
                    &:before {
                        background-image: url("@/assets/img/virtualCoiCourse/vir-active_title_left.png");
                        left: -0.23rem;
                    }
                    &:after {
                        right: -0.23rem;
                        background-image: url("@/assets/img/virtualCoiCourse/vir-active_title_left.png");
                    }
                }
            }

            img {
                display: block;
                width: 100%;
                margin: 0.135rem auto 0;
                pointer-events: none;
            }

            .desc {
                font-size: 0.15rem;
                margin-top: 0.115rem;
                line-height: 0.175rem;
                color: #fff;
            }

            .to-active {
                display: block;
                margin: 0.135rem auto 0;
                width: 1.43rem;
                height: 0.47rem;
                background-image: url("@/assets/img/virtualCoiCourse/selector_btn_bg.png");
                background-size: 100% 100%;
                font-size: 0.15rem;
                line-height: 0.45rem;
                text-align: center;
                color: #fff;
                &:active {
                    color: #001fd3;
                    background-image: url("@/assets/img/virtualCoiCourse/selector_btn_bg_active.png");
                }
            }
        }
    }
    .more {
        margin: 0.12rem 0 0.2rem;
        text-align: center;
        font-size: 0.12rem;
        line-height: 0.12rem;
        color: #001fd3;
    }
}
</style>
