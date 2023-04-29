<script setup lang="ts">
import spon1 from "@/assets/img/sponsor/sponsor_1.jpg"
import spon2 from "@/assets/img/sponsor/sponsor_2.jpg"
import spon3 from "@/assets/img/sponsor/sponsor_3.jpg"
import spon4 from "@/assets/img/sponsor/sponsor_4.jpg"
import spon5 from "@/assets/img/sponsor/sponsor_5.jpg"
import qy1 from "@/assets/img/sponsor/player_rights_1.jpg"
import qy2 from "@/assets/img/sponsor/player_rights_2.jpg"
import qy3 from "@/assets/img/sponsor/player_rights_3.jpg"
import qy4 from "@/assets/img/sponsor/player_rights_4.jpg"

import { useSysStore } from "@/stores/system"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { animateCSS } from "@/composable/util"
import { Autoplay, Navigation, Pagination } from "swiper"
import { computed, nextTick, onMounted, ref } from "vue"
import { useEventListener } from "@vueuse/core"
import ApiSetting from "@/api/service"
import { useFetch } from "@/composable/useFetch"
import { IndexGetVkstyleList } from "@/api/pojo/IndexGetVkstyleList"

const systemParams = useSysStore()
const router: Router = useRouter()

const qySwiIndex = ref(0)
const videoStatus = ref(0)
const showBtn = ref(false)
const videoRef = ref<HTMLVideoElement>(null)

const sponsorList = [
    { index: 1, img: spon1 },
    { index: 2, img: spon2 },
    { index: 3, img: spon3 },
    { index: 4, img: spon4 },
    { index: 5, img: spon5 }
]

const qyList = [
    { index: 1, img: qy1 },
    { index: 2, img: qy2 },
    { index: 3, img: qy3 },
    { index: 4, img: qy4 }
]

const qytitle = computed(() => {
    const title = ["威客公主 空降伴游", "私人订制 海岛畅游", "节日礼品 惊喜不断", "精美礼品 随心换购"]
    return title[qySwiIndex.value]
})

const { data: activeList } = useFetch<IndexGetVkstyleList["data"], {}>(ApiSetting.getVkStyleList, {}, false)

// 播放、暂停控制
const playPause = (): void => {
    const myVideo = videoRef.value
    if (myVideo.paused) {
        videoStatus.value = 1
        showBtn.value = true
        myVideo.play()
        const timer = setTimeout(() => {
            showBtn.value = false
            clearTimeout(timer)
        }, 1000)
    } else {
        videoStatus.value = 0
        showBtn.value = true
        myVideo.pause()
    }
}

const onSlideChange = (swiper: { realIndex: number }): void => {
    qySwiIndex.value = swiper.realIndex
}

// 点击了活动swiper跳转到优惠活动详情页
const clickAC = (swiper: unknown, e: TouchEvent): void => {
    const target = e.target as HTMLImageElement
    if (target?.dataset?.url) {
        router.push(target?.dataset?.url)
    }
}

onMounted(async () => {
    await nextTick()
    const myVideo = videoRef.value
    useEventListener(myVideo, "play", () => {
        videoStatus.value = 1
    })
    useEventListener(myVideo, "pause", () => {
        videoStatus.value = 0
    })
    animateCSS(".banner-warpper", "animate-zoom-in")
    animateCSS(".vkstyle-brand-block", "animate-fade-in-up")
    animateCSS(".vkstyle-moment-block", "animate-fade-in-up")
    animateCSS(".vkstyle-effort-block", "animate-fade-in-up")
})
</script>

<template>
    <div class="vkstyle-page">
        <HeaderBar>
            <div class="header_title">威客风采</div>
        </HeaderBar>
        <!-- 主内容 -->
        <section class="vkstyle-section">
            <div class="banner-warpper">
                <swiper
                    :modules="[Autoplay, Navigation, Pagination]"
                    :autoplay="{
                        delay: 4000,
                        disableOnInteraction: false
                    }"
                    :pagination="{
                        el: '.banner-custom-pagination',
                        clickable: true,
                        bulletClass: 'swiper-pagination-bullet banner-pagination-bullet',
                        horizontalClass: 'swiper-pagination-horizontal banner-pagination-horizontal'
                    }"
                    loop
                    navigation
                    class="banner-swiper w-312px h-175px m-auto"
                >
                    <swiper-slide v-for="(item, i) in sponsorList" :key="i">
                        <img
                            :data-index="item.index"
                            class="w-312px h-175px absolute left-50% translate-x--50%"
                            :src="item.img"
                            alt=""
                        />
                    </swiper-slide>
                </swiper>
                <div className="banner-custom-pagination swiper-pagination"></div>
            </div>
            <!-- 标题,品牌介绍 -->
            <div class="vkstyle-brand-block">
                <div class="beau-title title-brand"></div>
                <div class="brand-content">
                    <div class="desc-wrapper hstack justify-between">
                        <div class="desc-img"></div>
                        <div class="desc-text">
                            <ol>
                                <li>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VKGAME集团成立于2016年5月，是一个集于全球热门的电竞体育赛事于一体的大型综合线上娱乐平台，内含体育博彩、电子竞技、真人娱乐场、老虎机、棋牌等娱乐游戏，为全球用户提供最安全最流畅的游戏体验。威客电竞秉持着”专业
                                    安全
                                    创新“的基本理念，全方位满足不同用户场景，服务当下热门的电竞体育游戏用户，致力于向全球用户提供满意的产品和服务。
                                </li>
                                <li>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;截止2021年，威客电竞注册用户已达千万，覆盖全球众多国家和地区，现已逐渐成长为全球行业领先品牌。
                                </li>
                            </ol>
                        </div>
                    </div>
                    <div class="brand-text-img"></div>
                </div>
            </div>
            <!-- 标题,精彩时刻 -->
            <div class="vkstyle-moment-block">
                <div class="beau-title title-moment"></div>
                <div class="media-wrapper">
                    <div class="actual-size">
                        <video
                            ref="videoRef"
                            playsinline
                            controls
                            :class="{ brightness: !videoStatus }"
                            poster="@/assets/img/sponsor/poster.jpg"
                        >
                            <source :src="systemParams.mediaPath.vkstyle" type="video/mp4" />
                        </video>
                        <div
                            class="video-btn"
                            :class="[videoStatus ? 'pause' : 'play', { 'video-btn-show': showBtn }]"
                            @click="playPause"
                        ></div>
                    </div>
                </div>
            </div>
            <!-- 标题,数据成就 -->
            <div class="vkstyle-effort-block">
                <div class="beau-title title-chengjiu"></div>
                <div class="chengjiu-img"></div>
            </div>
            <!-- 标题,玩家收益 -->
            <div class="beau-title title-shouyi"></div>
            <div class="quanyi-wrapper" :data-title="qytitle">
                <swiper
                    @slideChange="onSlideChange"
                    :modules="[Autoplay, Pagination]"
                    :autoplay="{
                        delay: 4000,
                        disableOnInteraction: false
                    }"
                    :pagination="{
                        el: '.qy-custom-pagination',
                        clickable: true,
                        bulletClass: 'swiper-pagination-bullet qy-pagination-bullet',
                        horizontalClass: 'swiper-pagination-horizontal qy-pagination-horizontal'
                    }"
                    loop
                    class="qy-swiper w-330px h-186px m-auto"
                >
                    <swiper-slide v-for="(item, i) in qyList" :key="i">
                        <img class="qy-img w-330px h-186px" :src="item.img" alt="" />
                    </swiper-slide>
                </swiper>
                <div className="qy-custom-pagination swiper-pagination"></div>
            </div>
            <!-- 标题,优惠活动 -->
            <div class="beau-title title-youhui"></div>
            <div class="huodong-wrapper">
                <swiper
                    v-if="activeList"
                    @click="clickAC"
                    :modules="[Autoplay, Pagination]"
                    :autoplay="{
                        delay: 4000,
                        disableOnInteraction: false
                    }"
                    :pagination="{
                        el: '.active-custom-pagination',
                        clickable: true,
                        bulletClass: 'swiper-pagination-bullet active-pagination-bullet',
                        horizontalClass: 'swiper-pagination-horizontal active-pagination-horizontal'
                    }"
                    loop
                    class="huodong-swiper w-323px h-185px m-auto"
                >
                    <swiper-slide v-for="(item, i) in activeList" :key="i">
                        <img :data-url="item.url" class="huodong-img w-323px h-185px" :src="item.image_path" alt="" />
                    </swiper-slide>
                </swiper>
                <div className="active-custom-pagination swiper-pagination"></div>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.animate__animated {
    animation-timing-function: ease-in-out;
}
.vkstyle-page {
    .vkstyle-section {
        background-color: #151a24;
        margin: 0 auto;
        width: 100%;
        padding: 8px 0 0;
        height: 1936px;
        background-image: url("@/assets/img/sponsor/vkstyle/bg.jpg");
        background-repeat: no-repeat;
        background-position: center top;
        background-size: cover;
        position: relative;
        .beau-title {
            margin: 27px auto 10px;
            width: 347px;
            height: 56px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;

            &.title-brand {
                background-image: url("@/assets/img/sponsor/vkstyle/title-brand.png");
            }

            &.title-moment {
                background-image: url("@/assets/img/sponsor/vkstyle/title-moment.png");
            }

            &.title-chengjiu {
                margin-bottom: 24px;
                background-image: url("@/assets/img/sponsor/vkstyle/title-chengjiu.png");
            }

            &.title-shouyi {
                margin-bottom: 13px;
                background-image: url("@/assets/img/sponsor/vkstyle/title-shouyi.png");
            }

            &.title-youhui {
                margin-bottom: 13px;
                background-image: url("@/assets/img/sponsor/vkstyle/title-youhui.png");
            }
        }
        .brand-content {
            margin: auto;
            width: 347px;
            height: 422px;
            background: url("@/assets/img/sponsor/vkstyle/brand-bg.png") no-repeat center;
            background-size: 100% 100%;
            box-sizing: border-box;
            padding: 18px 18px 18px 7px;

            .desc-wrapper {
                font-size: 12px;
                color: #fff;

                .desc-img {
                    width: 7.5px;
                    height: 172.5px;
                    background: url("@/assets/img/sponsor/vkstyle/desc.png") no-repeat center;
                    background-size: 100% 100%;
                }

                .desc-text {
                    width: 302.5px;
                    line-height: 1.5;

                    li {
                        margin-bottom: 6px;

                        &:last-child {
                            margin-bottom: 0;
                        }
                    }
                }
            }

            .brand-text-img {
                margin: 12px auto 0;
                width: 331px;
                height: 192px;
                background: url("@/assets/img/sponsor/vkstyle/brand-text.png");
                background-size: 100% 100%;
            }
        }
        .media-wrapper {
            margin: auto;
            width: 347px;
            height: 203.5px;
            box-sizing: border-box;
            padding-top: 9px;
            position: relative;

            .actual-size {
                margin: auto;
                width: 329px;
                height: 185px;
                background: #000000;

                &::after {
                    user-select: none;
                    pointer-events: none;
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 347px;
                    height: 203.5px;
                    background: url("@/assets/img/sponsor/vkstyle/media-bg.png") no-repeat center top;
                    background-size: cover;
                }

                video {
                    max-width: 100%;
                    max-height: 100%;
                    width: 100%;

                    &.brightness {
                        filter: brightness(0.5);
                    }
                }

                .video-btn {
                    position: absolute;
                    width: 54.5px;
                    height: 25.5px;
                    bottom: 88.75px;
                    right: 141.75px;
                    cursor: pointer;
                    background: url("@/assets/img/sponsor/btn-play.png") no-repeat center;
                    background-size: 100% 100%;
                    opacity: 0;
                    transition: opacity 0.5s;

                    &.pause {
                        background-image: url("@/assets/img/sponsor/btn-pause.png");
                    }

                    &.video-btn-show {
                        opacity: 1;
                    }
                }
            }
        }
        .chengjiu-img {
            margin: auto;
            width: 347px;
            height: 161.5px;
            background: url("@/assets/img/sponsor/vkstyle/chengjiu.png") no-repeat center;
            background-size: 100% 100%;
        }
        .quanyi-wrapper {
            margin: auto;
            width: 347px;
            height: 213.5px;
            background: url("@/assets/img/sponsor/vkstyle/quanyi-wrapper.png") no-repeat center;
            background-size: 100% 100%;
            box-sizing: border-box;
            padding-top: 14px;
            position: relative;

            &::after {
                content: attr(data-title);
                color: #fff;
                font-size: 15px;
                font-weight: 600;
                line-height: 30px;
                position: absolute;
                box-sizing: border-box;
                padding-left: 11px;
                left: 8px;
                bottom: -1px;
                width: 169.5px;
                height: 30px;
                background: url("@/assets/img/sponsor/vkstyle/select.png") no-repeat center;
                background-size: 100% 100%;
                z-index: 1;
            }

            .qy-swiper {
                width: 330px;
                height: 186px;

                .qy-img {
                    width: 330px;
                    height: 186px;
                }
            }
        }
        .huodong-wrapper {
            margin: auto;
            width: 347px;
            height: 213.5px;
            background: url("@/assets/img/sponsor/vkstyle/youhui-wrapper.png") no-repeat center;
            background-size: contain;
            box-sizing: border-box;
            padding-top: 14px;
            position: relative;

            .huodong-swiper {
                width: 323px;
                height: 185px;
            }

            .huodong-img {
                width: 323px;
                height: 185px;
            }
        }
    }
    .banner-warpper {
        margin: auto;
        width: 347px;
        height: 186.5px;
        background: url("@/assets/img/sponsor/vkstyle/banner.png") no-repeat center;
        background-size: 100% 100%;
        position: relative;
        margin-bottom: 5.5px;
    }
    :deep(.swiper-button-prev) {
        margin-top: -26px;
        left: -4px;
        color: transparent;
        background: none;
    }

    :deep(.swiper-button-next) {
        margin-top: -26px;
        right: -4px;
        color: transparent;
        background: none;
    }
    .banner-custom-pagination {
        &.banner-pagination-horizontal {
            bottom: -7px;
            right: 6px;
            left: unset;
            text-align: right;
        }
    }

    .qy-custom-pagination {
        &.qy-pagination-horizontal {
            text-align: right;
            bottom: 0;
            padding-right: 6px;
        }
    }

    .active-custom-pagination {
        &.active-pagination-horizontal {
            text-align: right;
            bottom: -7px;
            padding-right: 6px;
        }
    }

    :deep(.swiper-pagination) {
        .swiper-pagination-bullet {
            border-radius: 0;
            opacity: 1;
        }
        .banner-pagination-bullet,
        .active-pagination-bullet {
            margin: 0 0 0 10px;
            width: 10px;
            height: 10px;
            background: url("@/assets/img/sponsor/vkstyle/point.png") no-repeat center;
            background-size: 100% 100%;
            &.swiper-pagination-bullet-active {
                background-image: url("@/assets/img/sponsor/vkstyle/point-active.png");
            }
        }
        .qy-pagination-bullet {
            margin: 0 0 0 9px;
            background-color: #fff;
            width: 9px;
            height: 9px;
            background: url("@/assets/img/sponsor/vkstyle/qy-docs.png") no-repeat center;
            background-size: 100% 100%;
            &.swiper-pagination-bullet-active {
                background-image: url("@/assets/img/sponsor/vkstyle/qy-docs-active.png");
            }
        }
    }
}
</style>
