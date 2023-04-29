<script setup lang="ts">
import NewsItem from "./NewsItem.vue"
import ApiSetting from "@/api/service"
import { showImagePreview } from "vant"
import { useRoute, useRouter } from "vue-router"
import type { Router, RouteLocationNormalizedLoaded } from "vue-router"
import { useTimeAgo } from "./formatTime"
import { useDateFormat } from "@vueuse/core"
import { ref, computed, onMounted, nextTick, watch } from "vue"
import { useSysStore } from "@/stores/system"
import { usePlaceImg } from "@/utils/globalImgs"
import { useStartGame } from "@/composable/util"
import { HttpPlus } from "@/api/HttpPlus"
import type { InformationGetDetail } from "@/api/pojo/InformationGetDetail"

const systemParams = useSysStore()
const route: RouteLocationNormalizedLoaded = useRoute()
const router: Router = useRouter()
const { lazyNewLogo } = usePlaceImg()

const currentId = computed(() => Number(route.params.id))

const articleRef = ref<HTMLElement>(null)

const dateTimeFormatByNews = (time: number | string): string => {
    const timestamp = Number(time)
    const formatYMD: string = useDateFormat(timestamp, "YYYY[年]MM[月]DD[日]").value
    return useTimeAgo(timestamp, formatYMD)
}

const newsDetailsData = ref<Pick<InformationGetDetail, "recommend"> & { detail?: InformationGetDetail["detail"] | {} }>({
    detail: {},
    recommend: []
})

const matchTime = computed<[string[], string] | []>(() => {
    if ("match_time" in newsDetailsData.value.detail) {
        const arrDate: string[] = newsDetailsData.value.detail.match_time.split(" ")
        return [arrDate[0].split("-"), arrDate[1]]
    }
    return []
})

const getNewsDetailsData = async (): Promise<void> => {
    systemParams.PageLoading = true
    newsDetailsData.value.detail = {}
    newsDetailsData.value.recommend = []
    const params = { news_id: currentId.value }
    console.info("获取资讯详情入参：", params)

    HttpPlus.setUrlOptions(ApiSetting.vkNews.newsDetail)
    const res = await HttpPlus.sendHttpRequest<InformationGetDetail, typeof params>(params)
    systemParams.PageLoading = false

    if (res.status === 1 && res.data) {
        if (res.data.detail !== null) {
            newsDetailsData.value = res.data
            crawlAllPictures()
        } else {
            router.replace("/messages?id=1")
        }
    }
}

/**
 * 爬取详情所有图片,预览图片
 */
const crawlAllPictures = (): void => {
    nextTick(() => {
        const articleEl: HTMLElement = articleRef.value
        const imgSet = new Set<HTMLImageElement>(articleEl.getElementsByTagName("img"))
        if (imgSet.size) {
            for (const imgEl of imgSet) {
                imgEl.onclick = () => {
                    if (imgEl.nodeName.toLowerCase() === "img") {
                        const imgUriList = Array.from(imgSet).map((item: HTMLImageElement) => item.currentSrc)
                        showImagePreview({
                            images: imgUriList,
                            startPosition: Array.from(imgSet).indexOf(imgEl),
                            overlayStyle: { "background-color": "#000" },
                            loop: false
                        })
                    }
                }
            }
        }
    })
}

onMounted(() => {
    getNewsDetailsData()
})

watch(
    () => currentId.value,
    () => {
        if (!isNaN(currentId.value)) getNewsDetailsData()
    }
)
</script>

<template>
    <div class="news-details bg-pageColor px-12px">
        <!-- 头部 -->
        <HeaderBar>
            <div class="header_title">资讯详情</div>
        </HeaderBar>
        <!-- 资讯详情-->
        <div class="news-details-content pt-15px">
            <dl class="detailed">
                <dt>
                    <h3 v-html="newsDetailsData.detail.title"></h3>
                    <div class="detailed-info">
                        <i class="tag" :style="{ background: newsDetailsData.detail.tag_color }">
                            {{ newsDetailsData.detail.tag }}
                        </i>
                        <small class="new-info time">{{ dateTimeFormatByNews(newsDetailsData.detail.timestamp) }}</small>
                        <small
                            v-if="JSON.stringify(newsDetailsData.detail) !== '{}' && !newsDetailsData.detail.is_hide_read"
                            class="new-info read"
                        >
                            <i class="views"></i>
                            {{ newsDetailsData.detail.read_count }}
                        </small>
                    </div>
                </dt>
                <dd ref="articleRef" v-html="newsDetailsData.detail.content"></dd>
            </dl>
            <!-- 赛事推荐-->
            <dl v-if="newsDetailsData.detail.is_recommend" class="match-recommend">
                <dt class="title-headquarters">赛事推荐</dt>
                <dd class="panel">
                    <p class="date">
                        {{ matchTime.length ? `${matchTime[0][1]}-${matchTime[0][2]}` : "" }}
                        <b>{{ matchTime[1] }}</b>
                    </p>

                    <div class="pk-team">
                        <div class="team-logo">
                            <div class="left">
                                <img
                                    v-lazy="{
                                        src: newsDetailsData.detail.team_a_logo,
                                        error: lazyNewLogo,
                                        loading: lazyNewLogo
                                    }"
                                    alt=""
                                />
                            </div>
                            <div class="center">
                                <h4 class="title">{{ newsDetailsData.detail.match_name }}</h4>
                                <em>VS</em>
                            </div>
                            <div class="right">
                                <img
                                    v-lazy="{
                                        src: newsDetailsData.detail.team_b_logo,
                                        error: lazyNewLogo,
                                        loading: lazyNewLogo
                                    }"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div class="team-record">
                            <div class="left">
                                <span :title="newsDetailsData.detail.team_a_name">{{ newsDetailsData.detail.team_a_name }}</span>
                                <!-- <small style="text-align: right">{{ newsDetailsData.detail.team_a_odds }}</small>-->
                            </div>
                            <div class="right">
                                <!-- <small>{{ newsDetailsData.detail.team_b_odds }}</small>-->
                                <span :title="newsDetailsData.detail.team_b_name">{{ newsDetailsData.detail.team_b_name }}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        @click="
                            () => {
                                useStartGame(
                                    {
                                        url: newsDetailsData.detail.redirect_link,
                                        isNeedLogin: true,
                                        isCheckName: false,
                                        changeFlag: systemParams.userInfo.change_flag
                                    },
                                    systemParams.isLogin,
                                    true
                                )
                            }
                        "
                        class="join-btn button_primary_2022"
                    >
                        立即投注
                    </button>
                </dd>
            </dl>
            <!-- 推荐阅读-->
            <dl v-if="newsDetailsData.recommend.length && !systemParams.PageLoading" class="read-recommend">
                <dt class="title-headquarters">推荐阅读</dt>
                <dd class="panel">
                    <news-item v-for="(item, index) in newsDetailsData.recommend" :key="index" :data="item" />
                </dd>
            </dl>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.news-details-content {
    font-size: 12px;
    min-height: calc(100vh - 44px);
    min-height: calc(var(--vh) * 100 - 44px);
    .detailed {
        dt {
            h3 {
                font-size: 15px;
                line-height: 17.5px;
                color: var(--vk-old-text-color);
                font-weight: bold;
            }

            .detailed-info {
                margin-top: 10px;
                line-height: 1.6;

                .tag {
                    display: inline-block;
                    border-radius: 3px;
                    font-size: 12px;
                    line-height: 15px;
                    padding: 0 6px;
                    color: var(--vk-old-text-color);
                    margin-right: 9px;
                    height: 15px;
                }

                .new-info {
                    color: var(--vk-old-light-text-color);
                    font-size: 12px;

                    &.time {
                        margin-right: 10px;
                    }

                    &.read {
                        .views {
                            display: inline-block;
                            width: 17px;
                            height: 11px;
                            margin-right: 10px;
                            background: url("@/assets/img/template/july/news/news_view.png");
                            background-size: 100% 100%;
                        }
                    }
                }
            }
        }

        dd {
            padding: 15px 0;
            margin-top: 15px;
            border-top: 1px solid #c6d0db;

            :deep(p) {
                color: var(--vk-old-light-text-color);
                font-size: 12px;
                line-height: 1.6;

                span {
                    color: var(--vk-old-light-text-color);
                    font-size: 12px;
                }
            }

            :deep(*) {
                max-width: 100%;
            }
        }
    }
    .match-recommend {
        overflow: hidden;
        padding: 15px 0 12px;
        border-top: 1px solid #c6d0db;

        .title-headquarters {
            font-size: 15px;
            line-height: 17.5px;
            color: var(--vk-old-text-color);
            font-weight: bold;
        }

        .panel {
            margin: 5px auto 0;
            width: 349.5px;
            height: 203.5px;
            background: url("@/assets/img/template/july/news/new_details_match.png") no-repeat;
            background-size: 100% 100%;
            overflow: hidden;

            .date {
                margin-top: 6px;
                font-family: Roboto;
                font-size: 12px;
                line-height: 28px;
                text-align: center;
                color: #acbae2;

                b {
                    color: #ffffff;
                }
            }

            .pk-team {
                margin-top: 8px;

                .team-logo {
                    width: 249px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;

                    .left,
                    .right {
                        margin-top: 12px;
                        width: 52px;
                        height: 52px;
                        background: url("@/assets/img/template/july/news/team_logo_bg.png") no-repeat;
                        background-size: 100% 100%;
                        border-radius: 50%;
                        overflow: hidden;
                        text-align: center;
                        line-height: 52px;
                        box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.54);

                        img {
                            width: 40px;
                            vertical-align: middle;
                        }
                    }

                    .center {
                        max-width: 130px;
                        text-align: center;

                        .title {
                            width: inherit;
                            font-weight: normal;
                            font-size: 12px;
                            line-height: 12px;
                            text-align: center;
                            color: #acbae2;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }

                        em {
                            display: block;
                            margin-top: 22px;
                            font-size: 14px;
                            line-height: 14px;
                            text-align: center;
                            color: #6e7ba0;
                            font-weight: bold;
                        }
                    }
                }

                .team-record {
                    width: 283px;
                    height: 25px;
                    margin: 4px auto 0;
                    border-radius: 4px;
                    border: solid 1px #515765;
                    box-sizing: border-box;
                    background-color: #272a37;
                    position: relative;
                    display: flex;

                    &:before {
                        position: absolute;
                        top: 0;
                        left: 50%;
                        content: "";
                        width: 1px;
                        height: 100%;
                        background: #515765;
                    }

                    .left,
                    .right {
                        width: 50%;
                        font-family: Roboto;
                        line-height: 24px;
                        span {
                            //margin-right: 0.05rem;
                            display: inline-block;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            width: 100%;
                            font-size: 14px;
                            color: #acbae2;
                            text-align: center;
                        }

                        small {
                            font-size: 15px;
                            width: 20px;
                            color: #ffffff;
                        }
                    }

                    .right {
                        span {
                            margin-right: 0;
                        }
                    }
                }
            }

            .join-btn {
                display: block;
                width: 120px;
                height: 40px;
                line-height: 40px;
                color: #1e1e1e;
                margin: 9px auto 0;
                border-radius: 20px;
                font-size: 15px;
                font-weight: bold;
            }
        }
    }

    .read-recommend {
        padding: 15px 0;
        border-top: 1px solid #c6d0db;
        overflow: hidden;

        .title-headquarters {
            font-size: 15px;
            line-height: 17.5px;
            color: var(--vk-old-text-color);
            font-weight: bold;
        }
    }
}
</style>
