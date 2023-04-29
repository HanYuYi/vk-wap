<script setup lang="ts">
import { Navigation, Pagination } from "swiper"
import { ref } from "vue"

const swiperIndex = ref(0)

const onSlideChange = ({ realIndex }: { realIndex: number }): void => {
    swiperIndex.value = realIndex
}
</script>

<template>
    <div class="table-block tggn">
        <div class="rect"></div>
        <div class="main-title">推广攻略</div>
        <div class="tg-title">
            <span class="num">1.</span>
            <span class="text">如何推广</span>
        </div>
        <div class="t-desc">
            网站每一位用户都拥有个人专属推广链接及推广邀请码，可通过QQ、微博、微信、浏览器等多种方式将推广链接或邀请码分享给好友进行注册。
        </div>
        <div class="tg-title tg-title-mt">
            <span class="num">2.</span>
            <span class="text">如何使用</span>
        </div>
        <div class="t-desc" v-if="swiperIndex == 0">01.进入推广分享页面，复制推广链接或邀请码。</div>
        <div class="t-desc" v-if="swiperIndex == 1">
            02.把推广链接或邀请码 发给好友，若好友使用推广链接跳转注册页面时，则无需填写邀请码进行注册。
        </div>
        <div class="t-desc" v-if="swiperIndex == 2">03.进入推广分享页面，复制二维码。</div>
        <div class="t-desc" v-if="swiperIndex == 3">04.把二维码发送给好友，好友扫描您的推广二维码进行注册。</div>
        <div class="swiper-box">
            <swiper
                @slideChange="onSlideChange"
                :modules="[Navigation, Pagination]"
                :pagination="{
                    el: '.banner-custom-pagination',
                    clickable: true
                }"
                loop
                navigation
                class="banner-swiper w-312px h-175px m-auto"
            >
                <swiper-slide>
                    <img src="@/assets/img/active/invitefriends/step/1.jpg" alt="" />
                </swiper-slide>
                <swiper-slide>
                    <img src="@/assets/img/active/invitefriends/step/2.jpg" alt="" />
                </swiper-slide>
                <swiper-slide>
                    <img src="@/assets/img/active/invitefriends/step/3.jpg" alt="" />
                </swiper-slide>
                <swiper-slide>
                    <img src="@/assets/img/active/invitefriends/step/4.jpg" alt="" />
                </swiper-slide>
            </swiper>
            <div class="swiper-pagination banner-custom-pagination"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "callfriends.scss";
.swiper-box {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0.1rem;
    margin-bottom: 0.2rem;
    width: 3.22rem;
    height: 2rem;
}
.swiper {
    width: 100%;
    height: 100%;
    img {
        width: 3.21rem;
        height: 2rem;
    }
}
:deep(.swiper-pagination) {
    bottom: -0.3rem;
    .swiper-pagination-bullet {
        background: #bf9854;
        margin: 0 0.04rem;
    }
}
:deep(.swiper-button-prev) {
    margin-top: 0;
    background-image: url("@/assets/img/active/invitefriends/btn-left.png");
    width: 0.22rem;
    height: 0.22rem;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    &::after {
        display: none;
    }
}
:deep(.swiper-button-next) {
    margin-top: 0;
    background-image: url("@/assets/img/active/invitefriends/btn-right.png");
    width: 0.22rem;
    height: 0.22rem;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    &::after {
        display: none;
    }
}
.tggn {
    .t-desc {
        min-height: 0.68rem;
    }
}
.tg-title {
    align-self: flex-start;
    font-weight: bold;
    margin-left: 0.12rem;
    .num {
        color: #bf9854;
        font-size: 0.24rem;
        display: inline-block;
        font-weight: bold;
    }
    .text {
        width: 0.95rem;
        height: 0.24rem;
        display: inline-block;
        vertical-align: top;
        position: relative;
        top: 0.05rem;
        background-color: #bf9854;
        text-align: center;
        line-height: 0.24rem;
        color: #080f26;
        font-size: 0.17rem;
        margin-left: 0.04rem;
    }
}
.tg-title-mt {
    margin-top: 0.06rem;
}
</style>
