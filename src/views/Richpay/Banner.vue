<template>
    <div class="richpay-banner w-screen h-236.5px relative m-auto">
        <div class="banner-main absolute w-full h-250px z-2"></div>
        <!-- banner-logo-->
        <div class="banner-logo z-4 w-63px h-57.5px absolute left-12px top-8px"></div>
        <!-- banner-亮边-->
        <div class="banner-side-line1 absolute"></div>
        <div class="banner-side-line2 absolute"></div>
        <div class="banner-side-line3 absolute"></div>
        <!-- banner-coin-->
        <div class="banner-coin1 absolute"></div>
        <div class="banner-coin2 absolute"></div>
        <!-- banner-num-->
        <div class="banner-num absolute"></div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@keyframes side-line {
    0% {
        opacity: 0;
    }

    70% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
@keyframes banner-coin {
    0% {
        transform: scale(1, 1);
    }

    100% {
        transform: scale(1.5, 1.5);
    }
}
@keyframes banner-num {
    0% {
        transform: scale(0.9, 0.9);
    }

    100% {
        transform: scale(1.1, 1.1);
    }
}
.richpay-banner {
    .banner-main {
        background: url("@/assets/img/template/july/richpay/banner.png") no-repeat;
        background-size: 100% 100%;
    }
    .banner-logo {
        background: url("@/assets/img/template/july/richpay/banner_logo.png") no-repeat;
        background-size: 100% 100%;
    }
    .banner-side-line1,
    .banner-side-line2,
    .banner-side-line3 {
        z-index: 3;
        width: 3.75rem;
        height: 2.5rem;
    }
    .banner-side-line1 {
        background: url("@/assets/img/template/july/richpay/banner_side_line1.png") no-repeat;
        background-size: 100% 100%;
        animation: side-line 5s infinite;
    }

    .banner-side-line2 {
        background: url("@/assets/img/template/july/richpay/banner_side_line2.png") no-repeat;
        background-size: 100% 100%;
        animation: side-line 5s infinite;
    }

    .banner-side-line3 {
        background: url("@/assets/img/template/july/richpay/banner_side_line3.png") no-repeat;
        background-size: 100% 100%;
        animation: side-line 5s infinite;
    }
    .banner-coin1,
    .banner-coin2 {
        z-index: 1;

        &:before {
            position: absolute;
            content: "";
            width: inherit;
            height: inherit;
            animation: banner-coin 1s linear infinite alternate;
        }
    }

    .banner-coin1 {
        width: 0.48rem;
        height: 0.48rem;
        background: url("@/assets/img/template/july/richpay/banner_icon1.png") no-repeat;
        background-size: 100% 100%;
        left: 0.26rem;
        top: 1.755rem;

        &:before {
            background: url("@/assets/img/template/july/richpay/banner_icon1_c.png") no-repeat;
            background-size: 100% 100%;
        }
    }

    .banner-coin2 {
        width: 0.175rem;
        height: 0.175rem;
        background: url("@/assets/img/template/july/richpay/banner_icon2.png") no-repeat;
        background-size: 100% 100%;
        right: 0.3rem;
        top: 1.385rem;

        &:before {
            background: url("@/assets/img/template/july/richpay/banner_icon2_c.png") no-repeat;
            background-size: 100% 100%;
        }
    }
    .banner-num {
        z-index: 3;
        width: 0.56rem;
        height: 0.3rem;
        background: url("@/assets/img/template/july/richpay/banner_num.png") no-repeat;
        background-size: 100% 100%;
        left: 2.17rem;
        top: 1.5rem;
        animation: banner-num 0.6s linear infinite alternate;
    }
}
</style>
