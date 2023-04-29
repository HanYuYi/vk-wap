<script setup lang="ts">
import VbItem from "./VbItem.vue"
import ApiSetting from "@/api/service"
import { ref } from "vue"
import { useFreshStore } from "@/stores/fresh"
import { usePlaceImg } from "@/utils/globalImgs"
import type { ConvertTopItem, VmallGetConvertTop } from "@/api/pojo/VmallGetConvertTop"
import { HttpPlus } from "@/api/HttpPlus"

const { lazyGoods, GrayAvatar } = usePlaceImg()
const freshStore = useFreshStore()

const loading = ref(false)
const list = ref<ConvertTopItem[]>([])

/**
 * 下拉刷新
 */
const onRefresh = async (): Promise<void> => {
    try {
        await init()
        freshStore.refreshLoading = false
    } catch (error) {
        freshStore.refreshLoading = false
    }
}

const init = async (): Promise<void> => {
    loading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.getConvertTop)
        const res = await HttpPlus.sendHttpRequest<VmallGetConvertTop["data"]>()

        loading.value = false
        if (res.status === 1 && res.data.length) {
            list.value = res.data
        }
    } catch (e: unknown) {
        loading.value = false
        throw e
    }
}

init()
</script>

<template>
    <div class="vbmarket-page bg-mypageColor">
        <HeaderBar>
            <div class="header_title">VIP兑换榜</div>
        </HeaderBar>

        <PullRefresh @on-refresh="onRefresh">
            <div class="expand-page p-12px w-full relative">
                <VbItem :class="{ vb_block_last: index === list.length - 1 }" v-for="(item, index) in list" :key="index">
                    <div class="flex-1 hstack">
                        <div class="avatar-wrapper w-60px h-60px overflow-hidden">
                            <img
                                class="max-w-60px max-h-60px"
                                v-lazy="{
                                    src: item?.head_image,
                                    error: GrayAvatar,
                                    loading: GrayAvatar
                                }"
                                alt=""
                            />
                        </div>
                        <div class="h-60px ml-12px text-12px leading-normal font-bold">
                            <div class="hstack text-14px text-#30403a leading-20px mt-2.5px">
                                <div>{{ item?.username }}</div>
                                <div class="vip relative top--2px ml-5px" :class="`vip${item?.user_lever}`"></div>
                            </div>
                            <div class="text-#9aa3a0 mt-1.5px">兑换了</div>
                            <div class="text-#666c6a mt-2px">
                                {{ item?.goods_name }}
                            </div>
                        </div>
                    </div>
                    <div class="img-wrapper overflow-hidden w-60px h-60px flex-center rounded-10px border border-#dcdddd">
                        <img
                            class="max-w-60px max-h-60px"
                            v-lazy="{
                                src: item?.goods_pic,
                                error: lazyGoods,
                                loading: lazyGoods
                            }"
                            alt=""
                        />
                    </div>
                </VbItem>
                <div class="leading-50px text-#969799 text-14px text-center" v-if="!loading && list.length">没有更多了</div>
                <div class="text-center" v-if="!loading && !list.length">
                    <img class="w-200px h-180px mt-88px" src="@/assets/img/template/july/nolog.png" alt="" />
                    <div class="text-#aaaaab leading-normal">暂无兑换记录</div>
                </div>
                <van-loading v-if="loading" color="#444" class="ab-center" type="spinner" />
            </div>
        </PullRefresh>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/style/vip.scss";
.avatar-wrapper {
    border-radius: 50%;
}
</style>
