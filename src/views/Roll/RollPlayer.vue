<script setup lang="ts">
import { usePlaceImg } from "@/utils/globalImgs"
import type { RollGetRoomWinList } from "@/api/pojo/RollGetRoomWinList"

const { GrayAvatar, lazyPack140 } = usePlaceImg()

/**
 * Props
 */
interface Props {
    items: RollGetRoomWinList["data"]

    showPrize?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],

    showPrize: false
})
</script>

<template>
    <div class="player_list_box" v-for="(item, index) in props.items" :key="index">
        <div class="user_img_box">
            <img
                v-lazy="{
                    src: item?.head_image,
                    error: GrayAvatar,
                    loading: GrayAvatar
                }"
                alt=""
            />
            <div class="user_level" :style="{ borderColor: item.color, color: item.color }">VIP.{{ item.user_lever }}</div>
        </div>
        <div class="user_name van-ellipsis">{{ item.username }}</div>
        <div v-if="props.showPrize" class="roll_item_box">
            <img
                v-lazy="{
                    src: item?.icon_url,
                    error: lazyPack140,
                    loading: lazyPack140
                }"
                alt=""
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.player_list_box {
    float: left;
    width: 0.876rem;
    box-sizing: border-box;
    margin-bottom: 0.12rem;
    padding: 0 0.058rem;
    .user_img_box {
        position: relative;
        width: 100%;
        height: 0.7rem;
        text-align: center;
        img {
            border-radius: 50%;
            height: 100%;
            width: 0.7rem;
        }
        .user_level {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: -0.04rem;
            text-align: center;
            border: 1px solid;
            width: 0.43rem;
            border-radius: 0.3rem;
            background-color: #fff;
            line-height: normal;
        }
    }
    .user_name {
        margin-top: 0.1rem;
        text-align: center;
    }
    .roll_item_box {
        margin-top: 0.05rem;
        height: 0.51rem;
        text-align: center;
        img {
            height: 100%;
            max-width: 100%;
        }
    }
}
</style>
