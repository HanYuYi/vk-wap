<script setup lang="ts">
import ApiSetting from "@/api/service"
import RollPlayer from "./RollPlayer.vue"
import { useRoute, useRouter } from "vue-router"
import type { RouteLocationNormalizedLoaded, Router } from "vue-router"
import { useFreshStore } from "@/stores/fresh"
import type { RollGetRoomApplyList } from "@/api/pojo/RollGetRoomApplyList"

const freshStore = useFreshStore()
const route: RouteLocationNormalizedLoaded = useRoute()
const router: Router = useRouter()

/**
 * 下拉刷新
 */
const onRefresh = (): void => {
    freshStore.resetList()
    loadRollPlayerList()
}

const loadRollPlayerList = async (): Promise<void> => {
    const params = {
        room_id: route.query.id
    }

    await freshStore.getList<RollGetRoomApplyList, typeof params>({
        url: ApiSetting.roll.getRoomPlayerList,
        params
    })
}

if (!route.query.id) {
    router.back()
}
freshStore.resetList()
</script>

<template>
    <div class="rollplayer-page bg-#e8f1ef font-classic">
        <HeaderBar>
            <div class="header_title">参与玩家</div>
        </HeaderBar>

        <PullRefresh @on-refresh="onRefresh">
            <div class="expand-page py-10px px-12px text-12px text-old-text">
                <ListLazy
                    :finishedText="!freshStore.listLoading && !freshStore.list.length ? '暂无数据' : '已经全部加载完毕'"
                    @load="loadRollPlayerList"
                >
                    <RollPlayer :items="freshStore.list" />
                </ListLazy>
                <van-loading v-if="freshStore.listLoading" color="#444" class="ab-center" type="spinner" />
            </div>
        </PullRefresh>
    </div>
</template>

<style lang="scss" scoped>
.rollplayer-page {
    line-height: 1.6;
}
:deep(.van-list__finished-text) {
    clear: both;
}
</style>
