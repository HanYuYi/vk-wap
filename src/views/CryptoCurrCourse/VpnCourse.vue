<script setup lang="ts">
import Img1 from "@/assets/img/virtualCoiCourse/vpn_1.png"
import Img2 from "@/assets/img/virtualCoiCourse/vpn_2.png"
import Img3 from "@/assets/img/virtualCoiCourse/vpn_3.png"
import Img4 from "@/assets/img/virtualCoiCourse/vpn_4.png"
import Img5 from "@/assets/img/virtualCoiCourse/vpn_5.png"

import { Pagination } from "swiper"
import { ref } from "vue"

const swiperIndex = ref(0)
const SWIPER_LIST = [
    {
        img: Img1,
        desc: "点击下载快橙，选择IOS或安卓客户端进行安装"
    },
    {
        img: Img2,
        desc: "点击下载之后，将自动跳转到注册页面，进行注册"
    },
    {
        img: Img3,
        desc: "完成安装后，点击购买订阅，选择对应的使用天数进行充值"
    },
    {
        img: Img4,
        desc: "充值后，点击主页，即可选择地区线路"
    },
    {
        img: Img5,
        desc: "最后点击登陆，即可成功跳转IP地址"
    }
]

const onSlideChange = (swiper: { realIndex: number }): void => {
    swiperIndex.value = swiper.realIndex
}
</script>

<template>
    <div class="vpn-course">
        <p class="step-desc">{{ swiperIndex + 1 }}.{{ SWIPER_LIST[swiperIndex].desc }}。</p>
        <swiper
            :modules="[Pagination]"
            :pagination="{
                el: '.banner-custom-pagination',
                clickable: true
            }"
            @slideChange="onSlideChange"
            class="vpn-swiper"
        >
            <swiper-slide
                v-for="(item, index) in SWIPER_LIST"
                :key="index"
                :style="{ backgroundImage: `url(${item.img})` }"
            ></swiper-slide>
        </swiper>
        <div class="swiper-pagination banner-custom-pagination"></div>
        <h3 class="step-title">步骤{{ swiperIndex + 1 }}/{{ SWIPER_LIST.length }}</h3>
    </div>
</template>

<style lang="scss" scoped>
.vpn-course {
    width: 3.56rem;
    height: 5.71rem;
    margin: 0.165rem auto 0;
    background-image: url("@/assets/img/virtualCoiCourse/course_bg.png");
    background-size: 100% 100%;
    overflow: hidden;
    position: relative;

    .step-title {
        font-weight: normal;
        margin-top: 0.12rem;
        font-size: 0.15rem;
        line-height: 0.15rem;
        text-align: center;
        color: #fff;
    }

    .vpn-swiper {
        width: 3.25rem;
        height: 4.6rem;
        margin: 0.14rem auto 0;
        .swiper-wrapper {
            .swiper-slide {
                background-size: 100% auto;
            }
        }
    }

    .swiper-pagination {
        width: 100%;
        line-height: 0.08rem;
        bottom: 0.775rem;
        :deep(.swiper-pagination-bullet) {
            opacity: 1;
            width: 0.08rem;
            height: 0.08rem;
            box-sizing: border-box;
            border: solid 2px #001fd3;
            background-color: transparent;
            margin: 0 0.05rem;
            &.swiper-pagination-bullet-active {
                background-color: #001fd3;
            }
        }
    }

    .step-desc {
        margin: 0.165rem 0.16rem 0 0.16rem;
        font-size: 0.15rem;
        line-height: 0.17rem;
        color: #fff;
    }
}
</style>
