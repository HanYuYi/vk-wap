<script setup lang="ts">
import { useDateFormat } from "@vueuse/core"
import ApiSetting from "@/api/service"
import { ref } from "vue"
import { useFreshStore } from "@/stores/fresh"
import { useSysStore } from "@/stores/system"
import { HttpPlus } from "@/api/HttpPlus"
import type { UserSteamGetPackageRecord } from "@/api/pojo/UserSteamGetPackageRecord"

const systemParams = useSysStore()
const freshStore = useFreshStore()

const formatDate = (time: number | string): string => {
    return useDateFormat(Number(time), "MM/DD HH:mm").value
}

const loading = ref(false)
const list = ref<UserSteamGetPackageRecord["data"]>([])

const load = async (): Promise<void> => {
    loading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.user.getPackageRecord)
        const res = await HttpPlus.sendHttpRequest<UserSteamGetPackageRecord["data"]>()
        loading.value = false

        if (res.status === 1 && res.data.length) {
            list.value = res.data
        }
    } catch (error: unknown) {
        loading.value = false
        console.error(error)
    }
}

const onRefresh = async (): Promise<void> => {
    try {
        await load()
        freshStore.refreshLoading = false
    } catch (error: unknown) {
        freshStore.refreshLoading = false
        console.error(error)
    }
}

load()
</script>

<template>
    <div class="package-page bg-light-green font-classic">
        <HeaderBar>
            <div class="header_title">库存日志</div>
        </HeaderBar>
        <PullRefresh @on-refresh="onRefresh">
            <div class="expand-page px-12px pb-30px relative">
                <template v-if="!loading && list.length">
                    <div class="list_header hstack justify-between leading-42px text-#7c839f">
                        <div class="time_div">交易时间</div>
                        <div class="goods_div van-ellipsis">物品</div>
                        <div class="type_div van-ellipsis">类型</div>
                    </div>
                    <div class="list_block hstack justify-between leading-42px text-#262933" v-for="(item, i) in list" :key="i">
                        <div class="time_div">{{ formatDate(item?.time * 1000) }}</div>
                        <div class="goods_div text-left! text-#27bc74 text-15px van-ellipsis">
                            {{ item?.market_name }}
                        </div>
                        <div class="type_div van-ellipsis">
                            {{ item?.record_type_name }}
                        </div>
                    </div>
                </template>
                <van-loading v-if="loading" color="#444" class="ab-center" type="spinner" />
                <div class="package_no_data text-center" v-if="!loading && !list.length">
                    <img class="w-60% mt-150px" src="@/assets/img/template/july/package/no_data.png" alt="" />
                </div>
            </div>
        </PullRefresh>
        <div
            v-if="!loading && list.length"
            class="package_log_tips fixed bottom-0 left-0 right-0 w-full text-center text-#7c839f text-12px py-5px leading-relaxed"
        >
            近期10条记录，如有疑问，请及时联系
            <span class="text-#262933" @click="systemParams.UpdateKFDialogShow(true)">在线客服</span>
            。
        </div>
    </div>
</template>

<style lang="scss" scoped>
.time_div {
    width: 90px;
}
.goods_div {
    text-align: center;
    width: 142px;
}
.type_div {
    flex: 1;
    max-width: 124px;
    text-align: right;
}
</style>
