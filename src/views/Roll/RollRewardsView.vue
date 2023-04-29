<script setup lang="ts">
import ApiSetting from "@/api/service"
import RollPlayer from "./RollPlayer.vue"
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useFreshStore } from "@/stores/fresh"
import { HttpPlus } from "@/api/HttpPlus"
import type { RollGetRoomWinList } from "@/api/pojo/RollGetRoomWinList"

const freshStore = useFreshStore()
const route = useRoute()

/**
 * 下拉刷新
 */
const onRefresh = async (): Promise<void> => {
    try {
        await loadRoomAwardsPlayerList()
        freshStore.refreshLoading = false
    } catch (error: unknown) {
        freshStore.refreshLoading = false
        throw error
    }
}

const winPlayerList = ref([])
// 获取获奖名单
const loadRoomAwardsPlayerList = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.roll.getRoomAwardsPlayerList)
    const res = await HttpPlus.sendHttpRequest<RollGetRoomWinList["data"], { room_id: string }>({
        room_id: route.query.id as string
    })

    if (res.status === 1 && res.data.length) {
        winPlayerList.value = res.data
    }
}

loadRoomAwardsPlayerList()
</script>

<template>
    <div class="rollrewards-page bg-#e8f1ef font-classic">
        <HeaderBar>
            <div class="header_title">获奖名单</div>
        </HeaderBar>
        <PullRefresh @on-refresh="onRefresh">
            <div class="expand-page py-10px px-12px text-12px text-old-text">
                <RollPlayer showPrize :items="winPlayerList" />
            </div>
        </PullRefresh>
    </div>
</template>
