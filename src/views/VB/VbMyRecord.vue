<script setup lang="ts">
import VbItem from "./VbItem.vue"
import ApiSetting from "@/api/service"
import { onBeforeUnmount, ref } from "vue"
import { useFreshStore } from "@/stores/fresh"
import type { VMallMyConvertList } from "@/api/pojo/VMallMyConvertList"

const freshStore = useFreshStore()

const loading = ref(false)

/**
 * 下拉刷新
 */
const onRefresh = (): void => {
    freshStore.resetList()
    init()
}

const init = async (): Promise<void> => {
    loading.value = true
    await freshStore.getList<VMallMyConvertList, {}>({
        url: ApiSetting.myConvertList,
        params: {},
        limit: true
    })
    loading.value = false
}

freshStore.resetList()
init()

onBeforeUnmount(() => freshStore.resetList())
</script>

<template>
    <div class="vbmarket-page bg-mypageColor">
        <HeaderBar>
            <div class="header_title">兑换记录</div>
            <template #right>
                <div class="text-#606161">
                    <router-link to="/vbrank">VIP兑换榜</router-link>
                </div>
            </template>
        </HeaderBar>
        <PullRefresh @on-refresh="onRefresh">
            <div class="expand-page p-12px w-full relative">
                <ListLazy :finishedText="!loading && !freshStore.list.length ? '' : '没有更多了'" @load="init">
                    <VbItem
                        :class="{ vb_block_last: index === freshStore.list.length - 1 }"
                        :data="item"
                        v-for="(item, index) in freshStore.list"
                        :key="index"
                    ></VbItem>
                </ListLazy>
                <div class="text-center" v-if="!loading && !freshStore.list.length">
                    <img class="w-200px h-180px mt-88px" src="@/assets/img/template/july/nolog.png" alt="" />
                    <div class="text-#aaaaab leading-normal">暂无兑换记录</div>
                </div>
                <van-loading v-if="loading" color="#444" class="ab-center" type="spinner" />
            </div>
        </PullRefresh>
    </div>
</template>

<style lang="scss" scoped>
:deep(.header-left) {
    width: 64.16px;
}
.vb_block {
    :deep(.img-wrapper) {
        box-shadow: 0 1px 2.5px 0 rgba(0, 0, 0, 0.05);
    }
}
</style>
