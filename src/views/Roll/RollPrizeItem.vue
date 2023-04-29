<script setup lang="ts">
import ApiSetting from "@/api/service"
import { useSysStore } from "@/stores/system"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { usePlaceImg } from "@/utils/globalImgs"
import type { RollView } from "@/api/pojo/RollView"
import { HttpPlus } from "@/api/HttpPlus"
import type { IndexSteamItemDetail } from "@/api/pojo/IndexSteamItemDetail"

const { lazyPack140 } = usePlaceImg()
const router: Router = useRouter()
const systemParams = useSysStore()

/**
 * Props
 */
interface Props {
    items: RollView["items"]
}

const props = withDefaults(defineProps<Props>(), {
    items: () => []
})

type Item = Props["items"][number]

// 奖品详情
const handleShowItemDetail = async (item: Item): Promise<void> => {
    if (item.game_id === 0) {
        return
    } else if (item.itemDetailData) {
        systemParams.routeParams = {
            ...item.itemDetailData
        }
        router.push("/rollroom/prizeDetail")
    } else if (item.steam_item_id) {
        const params = {
            item_id: item.steam_item_id,
            exchange: 0,
            game_id: item.game_id
        }
        systemParams.PageLoading = true
        HttpPlus.setUrlOptions(ApiSetting.user.getSteamItemDetail)
        const res = await HttpPlus.sendHttpRequest<IndexSteamItemDetail, typeof params>(params)
        systemParams.PageLoading = false

        if (res.status === 1) {
            systemParams.routeParams = {
                ...res.data
            }
            router.push("/rollroom/prizeDetail")
        }
    }
}
</script>

<template>
    <div class="roll_item_list">
        <div
            class="item_box"
            v-for="(item, index) in props.items"
            :key="index"
            v-show="index < 8"
            @click="handleShowItemDetail(item)"
        >
            <img
                v-lazy="{
                    src: item?.icon_url,
                    error: lazyPack140,
                    loading: lazyPack140
                }"
                alt=""
            />
            <div class="item_price" v-if="item.price">{{ item.price }}</div>
            <div class="item_name van-ellipsis">{{ item.market_name }}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.roll_item_list {
    .item_box {
        width: 0.83rem;
        height: 0.55rem;
        margin: 0.04rem 0.06rem 0.04rem 0;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.4);
        position: relative;
        color: #fff;
        float: left;
        &:nth-child(4n) {
            margin-right: 0;
        }
        img {
            height: 100%;
            max-width: 100%;
        }
        .item_name {
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.6);
            padding: 1px 4px;
        }
        .item_price {
            position: absolute;
            top: 0.03rem;
            right: 0;
            padding: 0 0.06rem 0 0.08rem;
            background-color: rgba(0, 0, 0, 0.5);
            border-top-left-radius: 0.3rem;
            border-bottom-left-radius: 0.3rem;
        }
    }
}
</style>
