<script setup lang="ts">
import { useFreshStore } from "@/stores/fresh"
import ApiSetting from "@/api/service"
import { useFetch } from "@/composable/useFetch"
import { whenever } from "@vueuse/core"
import { computed, ref, onUnmounted } from "vue"
import PullRefresh from "@/components/PullRefresh.vue"
import ListLazy from "@/components/ListLazy.vue"
import NewsItem from "./NewsItem.vue"
import type { InformationGetList } from "@/api/pojo/InformationGetList"
import type { InformationGetCategories } from "@/api/pojo/InformationGetCategories"
import type { InformationGetBanner } from "@/api/pojo/InformationGetBanner"
import { HttpPlus } from "@/api/HttpPlus"

interface NewsPageType {
    activeType: number
}

const freshStore = useFreshStore()

freshStore.resetList()

const activeType = ref(0)

type BannerItem = InformationGetBanner["big"][number]

const bannerList = ref<Array<BannerItem & { img: BannerItem["banner"]; wap_url: BannerItem["redirect_link"] }>>([])

// 资讯类型, 同时启用pageLoading
const { data: newsTypeList } = useFetch<InformationGetCategories["data"], {}>(ApiSetting.vkNews.newsType, {}, true)

// 资讯轮播，写在函数里面的http请求，不使用useFetch, 因为作用域在函数内部，无法使响应式数据同步到模板和组件根作用域scrpt中
const getBanner = async (): Promise<void> => {
    bannerList.value = []

    HttpPlus.setUrlOptions(ApiSetting.vkNews.banner)
    const res = await HttpPlus.sendHttpRequest<InformationGetBanner>()

    if (res.status === 1 && res.data && res.data.big.length) {
        bannerList.value = res.data.big.map((item: BannerItem) => {
            // return { ...item, img: item.banner, wap_url: `/news/news/${item.id}` }
            return { ...item, img: item.banner, wap_url: `${item.redirect_link}` }
        })
    }
}

getBanner()

const activeTypeId = computed<BannerItem["id"] | null>(() =>
    newsTypeList.value ? newsTypeList.value[activeType.value].id : null
)

whenever(activeTypeId, (val?: BannerItem["id"], oldVal?: BannerItem["id"]) => {
    if (val && oldVal) {
        freshStore.resetList()
    }
})

/**
 * 下拉刷新
 */
const onRefresh = (): void => {
    freshStore.resetList()
    if (activeType.value === 0) {
        getBanner()
    }
    getNewsList()
}

// 获取列表详情
const getNewsList = (): void => {
    const params = {
        category: activeTypeId.value
    }

    freshStore.getList<InformationGetList, typeof params>({ url: ApiSetting.vkNews.newsList, params })
}

// 组件卸载后，下拉刷新和懒加载组件的状态重置
onUnmounted(() => {
    freshStore.resetList()
})

defineExpose({
    activeType
})
</script>

<template>
    <div class="news-content-wrapper bg-pageColor">
        <van-tabs
            class="news-tab"
            background="#f8fcfe"
            v-if="newsTypeList"
            animated
            sticky
            offset-top="0.44rem"
            v-model:active="activeType"
        >
            <van-tab title-class="px-10px!" v-for="(item, id) in newsTypeList" :key="id">
                <template #title>
                    <span class="block" :class="`news-tab-item-${id}`">{{ item.name }}</span>
                </template>
                <PullRefresh @on-refresh="onRefresh">
                    <!-- banner, 仅热门展示-->
                    <div class="mt-8px" v-show="activeType === 0">
                        <BannerJump class="news-banner h-195px m-auto w-345px" :banner-list="bannerList" :showDesc="true" />
                        <div v-if="!bannerList.length" class="news-banner-place w-345px h-195px m-auto"></div>
                    </div>
                    <!-- 资讯展示 -->
                    <div class="list">
                        <ListLazy @load="getNewsList">
                            <NewsItem v-for="(item, index) in freshStore.list" :key="index" :data="item" />
                        </ListLazy>
                    </div>
                </PullRefresh>
            </van-tab>
        </van-tabs>
    </div>
</template>

<style lang="scss" scoped>
.news-banner-place {
    background: url("@/assets/defaultimg/pack_140.png") no-repeat center;
    background-size: cover;
}
</style>
