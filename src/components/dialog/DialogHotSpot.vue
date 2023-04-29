<script setup lang="ts">
import { HttpPlus } from "@/api/HttpPlus"
import ApiSetting from "@/api/service"
import { watch, ref } from "vue"
import { useNow, useDateFormat } from "@vueuse/core"
import { useSysStore } from "@/stores/system"
import { useRouter } from "vue-router"
import type { IndexGetWonderfulRecommendList } from "@/api/pojo/IndexGetWonderfulRecommendList"

const systemParams = useSysStore()
const router = useRouter()

const show = ref(false)

watch(show, (bool: boolean) => {
    systemParams.appRootBlur = bool
})

watch(
    () => systemParams.loadHotSpot,
    (bool: boolean) => {
        if (bool) init()
    }
)

const noReminderToday = ref(false)

// type: 1 图片  2 文本
// url_type: 0 无链接  1 内链  2 外链
const hotspotList = ref<IndexGetWonderfulRecommendList["data"]>([])

const singleData = ref({
    img_url: "",
    link: ""
})

// 点击今日热点图片
const handleToDetails = (item: IndexGetWonderfulRecommendList["data"][number]): void => {
    if (item.url_type === 0) return

    if (item.url_type === 1) {
        router.push(item.link_url)
    }

    if (item.url_type === 2 || item.url_type === 3) {
        window.open(item.link_url)
    }
    show.value = false
}

// 点击推荐活动图片跳转到活动详情页
const jump = (): void => {
    if (singleData.value.link) {
        router.push(singleData.value.link)
        show.value = false
    }
}

const close = (): void => {
    systemParams.loadHotSpot = false
    // 标记一个今天的时间戳，用于处理今日热点展示后今天不弹了
    if ("user_id" in systemParams.userInfo && noReminderToday.value) {
        systemParams.todayTimeStamp = `${systemParams.userInfo.user_id}___${useDateFormat(useNow(), "YYYYMMDD").value}`
    } else {
        systemParams.todayTimeStamp = null
    }
}

// 获取今日热点
const getHotspotList = async (): Promise<void> => {
    const hostpotKey: string = systemParams.todayTimeStamp
    const splitKey: string[] = hostpotKey ? hostpotKey.split("___") : []
    if (
        splitKey.length &&
        "user_id" in systemParams.userInfo &&
        +systemParams.userInfo.user_id === +splitKey[0] &&
        Number(useDateFormat(useNow(), "YYYYMMDD").value) <= Number.parseFloat(splitKey[1])
    ) {
        return
    }

    HttpPlus.setUrlOptions(ApiSetting.index.homePagePop.wonderfulRecommendList)
    const res = await HttpPlus.sendHttpRequest<IndexGetWonderfulRecommendList["data"]>()

    if (res.status === 1 && res.data && res.data.length) {
        hotspotList.value = res.data

        show.value = true
    }
}

const init = async (): Promise<void> => {
    // 先看有没有今天推荐的活动
    HttpPlus.setUrlOptions(ApiSetting.index.homePagePop.newRecommend)
    const res = await HttpPlus.sendHttpRequest<{ img_url: string; link: string }>()

    if (res.status === 1 && Object.keys(res.data).length) {
        singleData.value = res.data
        show.value = true
    } else {
        // 后台没有配置今日推荐的活动，就展示今日热点
        getHotspotList()
    }
}
</script>

<template>
    <div v-if="systemParams.loadHotSpot">
        <van-dialog
            teleport="body"
            close-on-click-overlay
            v-model:show="show"
            :show-confirm-button="false"
            @close="close"
            className="hotspot-diolog"
        >
            <div @click="show = false" class="close-btn"></div>
            <!-- 今日热点swiper -->
            <template v-if="hotspotList.length">
                <!-- 大于1张图片有轮播 -->
                <div class="relative" v-if="hotspotList.length > 1">
                    <!-- 轮播 -->
                    <van-swipe class="hotspot-swipe" loop autoplay="3500" :stop-propagation="false" indicator-color="white">
                        <van-swipe-item @click="handleToDetails(item)" v-for="(item, index) in hotspotList" :key="index">
                            <div v-if="item.type === 1" class="w-254px h-314.5px">
                                <img class="w-full h-full rounded-20px" :src="item.img_url" />
                            </div>
                            <div class="text-white px-6px" v-if="item.type === 2">
                                <div class="title text-24px leading-normal text-center" v-html="item.content_titile"></div>
                                <div
                                    class="desc indent-26px text-16px leading-tight max-h-240px overflow-y-auto"
                                    v-html="item.content_desc"
                                ></div>
                            </div>
                        </van-swipe-item>
                    </van-swipe>
                </div>
                <!-- 只有1张仅展示图片 -->
                <div v-for="(item, i) in hotspotList" :key="i" class="w-254px h-314.5px" v-else>
                    <img
                        class="w-full h-full rounded-20px"
                        @click="handleToDetails(item)"
                        v-if="item.img_url"
                        :src="item.img_url"
                        alt=""
                    />
                </div>
                <!-- 不在提醒 -->
                <div
                    class="footer-label flex-center mx-auto mt-20px text-15px text-white leading-30px w-max"
                    :class="{ 'footer-label-selected ': noReminderToday }"
                    @click="noReminderToday = !noReminderToday"
                >
                    <div class="circle"></div>
                    <div>今日不再提醒</div>
                </div>
            </template>
            <!-- 推荐活动，单张图片 -->
            <div v-else class="w-254px h-314.5px">
                <img class="w-full h-full" @click="jump" v-if="singleData.img_url" :src="singleData.img_url" alt="" />
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss">
.van-dialog.hotspot-diolog {
    width: 254px;
    border-radius: 0;
    overflow: visible;
    .hotspot-swipe {
        img {
            border-radius: 20px;
        }
        .van-swipe__indicators {
            bottom: 21px;

            .van-swipe__indicator {
                transition: width 0.4s;
                background: #fbfbfb;

                &.van-swipe__indicator--active {
                    width: 15px;
                    border-radius: 4px;
                    background: #fff;
                }
            }
        }
    }
    .close-btn {
        position: absolute;
        right: 0;
        top: -0.45rem;
        width: 0.15rem;
        height: 0.15rem;
        background: url("@/assets/img/template/july/close-btn.webp") no-repeat center;
        background-size: 100% 100%;
    }
    .footer-label {
        &.footer-label-selected {
            .circle {
                &::after {
                    transform: scale(1);
                }
            }
        }
        .circle {
            width: 20px;
            height: 20px;
            text-align: center;
            border: solid 1px #fff;
            border-radius: 50%;
            margin-right: 10px;
            position: relative;
            &::after {
                content: "";
                margin: 2px auto;
                display: block;
                border-radius: 50%;
                width: 14px;
                height: 14px;
                background-color: #00edad;
                transform: scale(0);
                transition: all 0.3s;
            }
        }
    }
}
</style>
