<script setup lang="ts">
import { useSysStore } from "@/stores/system"
import { useStartGame } from "@/composable/util"
import { usePlaceImg } from "@/utils/globalImgs"
import { useTimeAgo } from "./formatTime"
import { useDateFormat } from "@vueuse/core"
import type { List } from "@/api/pojo/InformationGetList"
import { reactive } from "vue"

const { lazyPack140 } = usePlaceImg()

/**
 * Props
 */
type BaseProps = Omit<List, "category" | "is_hot" | "match_name" | "create_time" | "iasdk2" | "read_count">

interface Props {
    data: {
        redirect_link?: string
    } & BaseProps
}

const props = defineProps<Props>()

const data = reactive(props.data)

const systemParams = useSysStore()

const dateTimeFormatByNews = (time: string | number): string => {
    const timestamp = Number(time)
    const formatYMD: string = useDateFormat(timestamp, "YYYY[年]MM[月]DD[日]").value
    return useTimeAgo(timestamp, formatYMD)
}

// 跳转赛事投注
const handleToGame = (url: string): void => {
    useStartGame(
        {
            url: url,
            isNeedLogin: true,
            isCheckName: false,
            changeFlag: systemParams.userInfo.change_flag
        },
        systemParams.isLogin,
        true
    )
}
</script>

<template>
    <div class="news-item">
        <!-- 列表分三种类型：1：单图   0：无图    3：三张图-->
        <router-link v-if="data.type === 1" :to="`/news/news/${data.id}`" class="single-img flex">
            <div class="img-box">
                <img
                    v-lazy="{
                        src: data.images ? data.images[0] : '',
                        error: lazyPack140,
                        loading: lazyPack140
                    }"
                    alt=""
                />
            </div>
            <div class="data-box flex-1 flex flex-col justify-between h-61px">
                <h4 v-html="data.title"></h4>
                <div class="bottom-info">
                    <i class="tag" :style="{ background: data.tag_color }">{{ data.tag }}</i>
                    <a v-if="data.is_recommend" @click.prevent="handleToGame(data.redirect_link)" class="match-link">
                        <p>{{ data.team_a_name }}</p>
                        <em>VS</em>
                        <p>{{ data.team_b_name }}</p>
                    </a>
                    <small v-if="!data.is_recommend" class="new-info time">{{ dateTimeFormatByNews(data.timestamp) }}</small>
                    <small v-if="!data.is_recommend && !data.is_hide_read" class="new-info read">
                        <i class="views"></i>
                        {{ data.read_count }}
                    </small>
                </div>
            </div>
        </router-link>

        <router-link v-if="data.type === 0" :to="`/news/news/${data.id}`" class="no-img">
            <h4 v-html="data.title"></h4>
            <div class="bottom-info">
                <i class="tag" :style="{ background: data.tag_color }">{{ data.tag }}</i>
                <a v-if="data.is_recommend" @click.prevent="handleToGame(data.redirect_link)" class="match-link">
                    <p>{{ data.team_a_name }}</p>
                    <em>VS</em>
                    <p>{{ data.team_b_name }}</p>
                </a>
                <small v-else class="new-info time">{{ dateTimeFormatByNews(data.timestamp) }}</small>
                <small v-if="!data.is_hide_read" class="new-info read">
                    <i class="views"></i>
                    {{ data.read_count }}
                </small>
            </div>
        </router-link>

        <router-link v-if="data.type === 3" :to="`/news/news/${data.id}`" class="three-img">
            <h4 v-html="data.title"></h4>
            <div class="img-line">
                <div v-for="(imgUri, imgKey) in data.images" :key="imgKey" class="img-box">
                    <img
                        v-lazy="{
                            src: imgUri,
                            error: lazyPack140,
                            loading: lazyPack140
                        }"
                        alt=""
                    />
                </div>
            </div>
            <div class="bottom-info">
                <i class="tag" :style="{ background: data.tag_color }">{{ data.tag }}</i>
                <a v-if="data.is_recommend" @click.prevent="handleToGame(data.redirect_link)" class="match-link">
                    <p>{{ data.team_a_name }}</p>
                    <em>VS</em>
                    <p>{{ data.team_b_name }}</p>
                </a>
                <small v-else class="new-info time">{{ dateTimeFormatByNews(data.timestamp) }}</small>
                <small v-if="!data.is_hide_read" class="new-info read">
                    <i class="views"></i>
                    {{ data.read_count }}
                </small>
            </div>
        </router-link>
    </div>
</template>

<style lang="scss" scoped>
// 多行文本省略号
@mixin line-txt-ellipsis($num: 2) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: $num;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
}
.news-item {
    padding: 15px 0;
    border-bottom: 1px solid #c6d0db;
    h4 {
        font-size: 15px;
        line-height: 17.5px;
        color: var(--vk-old-text-color);
        font-weight: bold;
    }
    &:last-child {
        border: 0;
    }
    .img-box {
        width: 108px;
        height: 61px;
        overflow: hidden;
        margin-right: 10px;

        img {
            width: inherit;

            &[lazy="error"],
            &[lazy="loading"] {
                width: inherit;
                height: inherit;
            }
        }
    }

    .match-link {
        display: flex;
        font-size: 12px;
        line-height: 15px;

        p {
            line-height: 15px;
            max-width: 60px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        * {
            height: 15px;
            border-bottom: 1px solid var(--vk-old-text-color);
        }
    }

    .tag {
        display: inline-block;
        border-radius: 3px;
        font-size: 12px;
        line-height: 15px;
        padding: 0 6px;
        color: var(--vk-old-text-color);
        margin-right: 10px;
        height: 16px;
    }

    .new-info {
        color: var(--vk-old-text-color);
        font-size: 12px;

        &.time {
            width: 80px;
        }

        &.read {
            color: #7c839f;
        }

        .views {
            display: inline-block;
            width: 17px;
            height: 9px;
            margin-right: 10px;
            background: url("@/assets/img/template/july/news/news_view.png");
            background-size: 100% 100%;
        }
    }

    .single-img {
        .data-box {
            h4 {
                height: 33px;
                @include line-txt-ellipsis();
            }
            .bottom-info {
                display: flex;
                align-items: baseline;

                & > * {
                    flex-grow: 0;
                }

                .match-link {
                    margin-top: 2.5px;
                }

                .time {
                    white-space: nowrap;
                    flex-grow: 1;
                }
            }
        }
    }

    .no-img {
        h4 {
            height: 33px;
            @include line-txt-ellipsis();
        }

        .bottom-info {
            margin-top: 10px;
            display: flex;

            .tag {
                flex-grow: 0;
            }

            .match-link {
                flex-grow: 1;

                p {
                    max-width: 72px;
                }
            }

            .time {
                flex-grow: 1;
                line-height: 15px;
            }

            .read {
                line-height: 15px;
            }
        }
    }

    .three-img {
        h4 {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
        .img-line {
            display: flex;
            margin-top: 10px;

            .img-box {
                &:last-child {
                    margin-right: 0;
                }
            }
        }
        .bottom-info {
            margin-top: 10px;
            display: flex;

            .tag,
            .new-info {
                flex-grow: 0;
                line-height: 15px;
            }

            .time {
                flex-grow: 1;
            }

            .match-link {
                flex-grow: 1;

                p {
                    max-width: 72px;
                }
            }
        }
    }
}
</style>
