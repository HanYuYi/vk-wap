<script setup lang="ts">
import { useRoute } from "vue-router"
import type { RouteLocationNormalizedLoaded } from "vue-router"
import { useBottomImg } from "@/utils/globalImgs"

const route: RouteLocationNormalizedLoaded = useRoute()
const { yhImg, yhActiveImg, NewsImg, NewsActiveImg, ZzImg, ZzActiveImg, MyImg, MyActiveImg, LiveGif }: Record<string, string> =
    useBottomImg()

const BottomTabList = [
    {
        key: "discovery",
        label: "优惠",
        icon: yhImg,
        acicon: yhActiveImg,
        path: "/discovery"
    },
    {
        key: "news",
        label: "资讯",
        icon: NewsImg,
        acicon: NewsActiveImg,
        badgeIcon: LiveGif,
        path: "/news"
    },
    {
        key: "home",
        label: "",
        path: "/"
    },
    {
        key: "sponsor",
        label: "赞助",
        icon: ZzImg,
        acicon: ZzActiveImg,
        path: "/sponsor"
    },
    {
        key: "userhome",
        label: "我的",
        icon: MyImg,
        acicon: MyActiveImg,
        path: "/user"
    }
]
</script>

<template>
    <van-tabbar
        :border="false"
        :safe-area-inset-bottom="false"
        route
        class="bottom-wrapper h-58.5px! bg-transparent text-center justify-between"
    >
        <van-tabbar-item
            replace
            :to="tab.path"
            :name="tab.key"
            :class="[`bottom-${tab.key}`, { 'animate-bounce-in': tab.key == route.name && tab.key != 'home' }]"
            v-for="(tab, index) in BottomTabList"
            :key="index"
        >
            <img v-if="tab.icon" class="w-34px h-34px" :src="tab.key == route.name ? tab.acicon : tab.icon" />
            <img :class="`badge-img-${tab.key}`" :src="tab.badgeIcon" v-if="tab.badgeIcon && tab.key != route.name" alt="" />
            <span v-if="tab.icon" class="mt--4px">{{ tab.label }}</span>
        </van-tabbar-item>
    </van-tabbar>
</template>

<style lang="scss" scoped>
.bottom-wrapper {
    -webkit-font-smoothing: antialiased;
    position: fixed;
    transform: translate3d(0, 0, 0);
    z-index: 555;
    background-image: url("@/assets/img/template/july/home/bottom/bg.png");
    background-repeat: no-repeat;
    background-position: center top;
    background-size: contain;
    .van-tabbar-item {
        flex: 0.2;
        font-size: 10px;
        &:nth-of-type(2) {
            position: relative;
            right: 24px;
        }

        &:nth-of-type(4) {
            position: relative;
            left: 24px;
        }
        :deep(.van-tabbar-item__text) {
            display: flex;
            flex-direction: column;
            color: #4b566b;
            margin-top: 2px;
            position: relative;
        }
    }
    .van-tabbar-item--active {
        background-color: transparent;
        :deep(.van-tabbar-item__text) {
            color: #222;
            font-weight: bold;
        }
    }
}
.bottom-home {
    width: 66px;
    height: 66px;
    background: url("@/assets/img/template/july/home/home.png") no-repeat center;
    background-size: 100% 100%;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 !important;

    img {
        opacity: 0;
    }
}
.badge-img-news {
    width: 16px;
    height: 10px;
    position: absolute;
    top: 6.5px;
    right: -9px;
}
</style>
