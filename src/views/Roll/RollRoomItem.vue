<script setup lang="ts">
import { useDateFormat } from "@vueuse/core"
import { usePlaceImg } from "@/utils/globalImgs"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import type { List } from "@/api/pojo/RollGetList"
import { reactive } from "vue"

const { GrayAvatar, lazyPack140 }: Record<string, string> = usePlaceImg()
const router: Router = useRouter()

type PropsItem = Omit<List, "tags">
type PropsItemTags = { tags: Array<List["tags"]> }
/**
 * Props
 */

interface Props {
    item: PropsItem & PropsItemTags
}

const props = defineProps<Props>()

const item = reactive(props.item)

const formatDate = (time: number | string): string => {
    return useDateFormat(Number(time), "YYYY/MM/DD HH:mm").value
}

const toRollRoomDetail = (item: List): void => {
    if (item.is_del == 1 || item.is_hide == 1) {
        return
    }
    router.push(`/rollroom?id=${item.id}`)
}
</script>

<template>
    <div class="roll_list_box" v-if="Object.keys(item).length" @click="toRollRoomDetail(item)">
        <div class="roll_room_headimg">
            <img
                v-lazy="{
                    src: item?.head_image,
                    error: GrayAvatar,
                    loading: GrayAvatar
                }"
                alt=""
            />
        </div>
        <div class="roll_room_info van-hairline--bottom">
            <div class="roll_user_info">
                <span class="user_name van-ellipsis">{{ item.username }}</span>
                <span class="user_level" :style="{ color: item.color }">VIP.{{ item.user_lever }}</span>
                <span class="has_pwd" v-if="item.has_pass"></span>
            </div>
            <div class="user_actors">
                <span
                    class="tag_box"
                    v-for="(tag, index) in item.tags"
                    :key="tag.id"
                    v-show="index < 4"
                    :style="{
                        background: 'linear-gradient(#' + tag.background_app + ', #' + tag.border_app + ')'
                    }"
                >
                    {{ tag.tag_name }}
                </span>
            </div>
            <div class="roll_time">ROLL时间: {{ formatDate(item.end_time * 1000) }}</div>
            <div class="roll_room_items clearfix">
                <div class="roll_room_item_box" v-for="(steamitem, index) in item.items" :key="index">
                    <img
                        v-lazy="{
                            src: steamitem.icon_url,
                            error: lazyPack140,
                            loading: lazyPack140
                        }"
                        :alt="steamitem.market_name"
                    />
                    <div class="total_mask" v-if="index === 3">共{{ item.count }}件</div>
                </div>
            </div>
            <div class="roll_room_total">
                <div class="roll_room_items_price">￥{{ item.price }}</div>
                <div class="roll_room_player">{{ item.apply_total }}人参与</div>
            </div>
        </div>
        <div
            class="list_box_mask"
            v-if="item.is_del == 1 || item.is_end == 1 || item.is_hide == 1"
            :class="{
                locked: item.is_hide == 1,
                end: item.is_end == 1,
                cancel: item.is_del == 1
            }"
        >
            <div class="masker_wrapper">
                <span></span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.clearfix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
}
.user_actors {
    height: 0.2rem;
    line-height: 0.2rem;
    .tag_box {
        display: inline-block;
        height: 0.192rem;
        font-size: 0.12rem;
        line-height: 0.192rem;
        padding: 0 0.062rem;
        margin-right: 0.03rem;
        vertical-align: middle;
        border-radius: 0.3rem;
        color: #fff;
    }
}
.roll_list_box {
    line-height: 1.6;
    box-sizing: border-box;
    padding: 0.2rem 0 0 0.15rem;
    display: flex;
    font-size: 0.14rem;
    position: relative;
    .roll_room_headimg {
        flex: 1;
        box-sizing: border-box;
        padding: 0.06rem 0.1rem 0 0;
        img {
            width: 0.47rem;
            height: 0.47rem;
            border-radius: 50%;
        }
    }
    .roll_room_info {
        flex: 6;
        box-sizing: border-box;
        padding-right: 0.15rem;
        .roll_user_info {
            height: 0.3rem;
            line-height: 0.3rem;
            .user_name {
                font-size: 0.16rem;
                display: inline-block;
                max-width: 1.6rem;
                vertical-align: middle;
                font-weight: bold;
            }
            .user_level {
                margin-left: 0.15rem;
                display: inline-block;
                vertical-align: middle;
            }
            .has_pwd {
                display: inline-block;
                margin-left: 0.1rem;
                width: 0.11rem;
                height: 0.12rem;
                background: url("@/assets/img/template/july/roll/icon-haspwd.png") no-repeat center;
                background-size: 100% 100%;
            }
        }
        .user_actors {
            padding-bottom: 0.03rem;
        }
        .roll_time {
            color: #7c839f;
        }
        .roll_room_items {
            margin-top: 0.1rem;
            margin-right: -0.06rem;
            .roll_room_item_box {
                float: left;
                width: 0.67rem;
                height: 0.45rem;
                margin-right: 0.06rem;
                position: relative;
                text-align: center;
                background-color: rgba(0, 0, 0, 0.4);
                img {
                    height: 100%;
                    max-width: 100%;
                    &[lazy="error"],
                    &[lazy="loading"] {
                        width: 100%;
                    }
                }
                .total_mask {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    background-color: rgba(0, 0, 0, 0.5);
                }
            }
        }
        .roll_room_total {
            padding: 0.05rem 0;
            display: flex;
            justify-content: space-between;
            color: #7c839f;
            .roll_room_items_price {
                color: #e34d12;
                font-size: 0.16rem;
            }
        }
    }
    .list_box_mask {
        position: absolute;
        right: 0;
        top: 0;
        span {
            display: inline-block;
            width: 0.62rem;
            height: 0.355rem;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 100% 100%;
        }
        &.cancel {
            span {
                background-image: url("@/assets/img/template/july/roll/icon-cancel.png");
            }
        }
        &.end {
            span {
                background-image: url("@/assets/img/template/july/roll/icon-end.png");
            }
        }
        &.locked {
            span {
                background-image: url("@/assets/img/template/july/roll/icon-lock.png");
            }
        }
    }
}
</style>
