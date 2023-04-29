<script setup lang="ts">
import dayjs from "dayjs"
import ApiSetting from "@/api/service"
import { ref, computed, unref, watch, onBeforeUnmount } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useNow, useDateFormat } from "@vueuse/core"
import { formatterYMD } from "@/utils/date"
import { useFreshStore } from "@/stores/fresh"
import { useSysStore } from "@/stores/system"
import type { UserOrderList } from "@/api/pojo/UserOrderList"
import type { UserVCoinList } from "@/api/pojo/UserVCoinList"
import { HttpPlus } from "@/api/HttpPlus"

const freshStore = useFreshStore()
const systemParams = useSysStore()
const route = useRoute()
const router = useRouter()

const formatDate = (time: number | string): string => {
    return useDateFormat(Number(time), "YYYY/MM/DD HH:mm:ss").value
}

const show = ref(false)

watch(show, (val: boolean) => {
    // 弹层出来禁止页面滚动
    document.body.style.overflow = val ? "hidden" : ""
})

type BottomMode = "type" | "date" | "right"
const bottomMode = ref<BottomMode>("type")

const typeList = [
    { id: 0, title: "V币明细" },
    { id: 1, title: "现金明细" }
] as const

const typeIndex = ref<typeof typeList[number]["id"]>(1)

// vb明细的分类
const vbType = [
    { id: 0, title: "全部" },
    { id: 1, title: "收入" },
    { id: 2, title: "支出" }
]

// 现金明细的分类
const cashType = ref([{ id: 0, title: "全部" }])

const rightIndex = ref(0)

// 当前选中的是VB还是现金
const currentType = computed(() => typeList[typeIndex.value])

// 当前选中的右侧分类
const rightType = computed(() => {
    if (typeIndex.value === 0) {
        return vbType
    }
    if (typeIndex.value === 1) {
        return cashType.value
    }
    return []
})

const rightChoose = computed(() => rightType.value[rightIndex.value])

// 展开分类下拉选择
const expandBottom = (type: BottomMode): void => {
    // 如果从时间切换过来的，不需要关闭弹层，直接切换模式即可
    if (bottomMode.value === type) {
        show.value = !show.value
    } else {
        bottomMode.value = type
        if (!show.value) {
            show.value = !show.value
        }
    }
}

const selectType = (index: typeof typeList[number]["id"], type: BottomMode): void => {
    if (type === "type") {
        // 切换现金/vb时，右侧重置为全部
        typeIndex.value = index
        rightIndex.value = 0
    }
    if (type === "right") {
        rightIndex.value = index
    }
    show.value = false
    freshStore.resetList()
    loadTradeRecords()
}

// 日期模式以月为单位显示，默认是以天为单位
const dataModeMonth = ref(false)
// 以天为单位模式，当前高亮的是开始时间1，还是结束时间2
const dayMode = ref(1)

// 将字符串日期转为数组
const changeDateStr = (str: string): string[] => {
    return str.split("/")
}

const YEAR = unref(useDateFormat(useNow(), "YYYY"))
const MONTH = unref(useDateFormat(useNow(), "MM"))
const DAY = unref(useDateFormat(useNow(), "DD"))

const columnsType = ref(["year", "month", "day"])
const lastDayMonth = dayjs().endOf("month").format("YYYY/MM/DD")
const firstDayMonth = dayjs().startOf("month").format("YYYY/MM/DD")
const timeMonth = ref(`${YEAR}/${MONTH}`)
const timeDayStart = ref(firstDayMonth)
const timeDayEnd = ref(lastDayMonth)
const currentDate = ref(changeDateStr(firstDayMonth))
const minDate = new Date(`${Number(YEAR) - 2}/${MONTH}/${DAY}`)
let maxDate = new Date(`${YEAR}/${Number(MONTH) + 1}/${DAY}`)

if (Number(MONTH) === 12) {
    maxDate = new Date(`${Number(YEAR) + 1}/01/${DAY}`)
}

watch(dataModeMonth, (val: boolean) => {
    if (val) {
        // 为true, 选择了月
        columnsType.value = ["year", "month"]
        currentDate.value = [YEAR, MONTH]
    } else {
        columnsType.value = ["year", "month", "day"]
        currentDate.value = [YEAR, MONTH, DAY]
    }
})

const changeDate = ({ selectedValues }: { selectedValues: string[] }): void => {
    if (dataModeMonth.value) {
        // 月模式
        timeMonth.value = selectedValues[0] + "/" + selectedValues[1]
    } else {
        // 日模式
        if (dayMode.value === 1) {
            timeDayStart.value = selectedValues[0] + "/" + selectedValues[1] + "/" + selectedValues[2]
        }
        if (dayMode.value === 2) {
            timeDayEnd.value = selectedValues[0] + "/" + selectedValues[1] + "/" + selectedValues[2]
            const start = new Date(timeDayStart.value)
            const end = new Date(timeDayEnd.value)
            if (start > end) {
                const cc = timeDayStart.value
                timeDayStart.value = timeDayEnd.value
                timeDayEnd.value = cc
                dayMode.value = 1
            }
        }
    }
}

// 重置时间
const handleReset = (): void => {
    timeMonth.value = `${YEAR}/${MONTH}`
    timeDayStart.value = firstDayMonth
    timeDayEnd.value = lastDayMonth
    if (dataModeMonth.value) {
        columnsType.value = ["year", "month"]
        currentDate.value = [YEAR, MONTH]
    } else {
        columnsType.value = ["year", "month", "day"]
        currentDate.value = changeDateStr(firstDayMonth)
    }
    show.value = false
    freshStore.resetList()
    loadTradeRecords()
}

// 确认时间
const confirm = (): void => {
    show.value = false
    freshStore.resetList()
    loadTradeRecords()
}

// 切换日期模式
const switchDateMode = (): void => {
    dataModeMonth.value = !dataModeMonth.value
}

// 选择日期
const selectTime = (type: 1 | 2): void => {
    dayMode.value = type
    if (type === 1 && currentDate.value.join("/") !== timeDayStart.value) {
        currentDate.value = changeDateStr(timeDayStart.value)
    }
    if (type === 2 && currentDate.value.join("/") !== timeDayEnd.value) {
        currentDate.value = changeDateStr(timeDayEnd.value)
    }
}

/**
 * 下拉刷新
 */
const onRefresh = (): void => {
    freshStore.resetList()
    loadTradeRecords()
}

if (route.query.type) {
    const type = Number(route.query.type)
    if (type === 0 || type === 1) {
        typeIndex.value = type
    }
}

// 获取V富通交易记录 前置条件判断
const loadTradeRecords = (): void => {
    const params = {
        status: 0,
        start_time: dataModeMonth.value ? timeMonth.value + "/01" : timeDayStart.value,
        end_time: dataModeMonth.value ? lastDayMonth : timeDayEnd.value
    }

    if (typeIndex.value === 0) {
        // vb
        freshStore.getList<UserVCoinList, typeof params & { type: number }>({
            url: ApiSetting.user.getVcoinList,
            params: { ...params, type: unref(rightChoose).id }
        })
    }
    if (typeIndex.value === 1) {
        // 现金
        freshStore.getList<UserOrderList, typeof params & { order_type: number }>({
            url: ApiSetting.user.getTradingRecordList,
            params: { ...params, order_type: unref(rightChoose).id }
        })
    }
}

class UserOrderTypeList extends Array {
    data: { id: number; title: string }[]
}
// 获取明细类型下的交易类型
const loadType = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.user.getTradingTypeList)
    const res = await HttpPlus.sendHttpRequest<UserOrderTypeList["data"]>()
    systemParams.PageLoading = false
    if (res.status === 1 && res.data.length) {
        cashType.value = res.data
    }
}

freshStore.resetList()
loadType()

onBeforeUnmount(() => {
    freshStore.resetList()
})
</script>

<template>
    <div class="tradrecord-page bg-light-green">
        <HeaderBar>
            <div class="header_title">交易记录</div>
        </HeaderBar>
        <div class="expand-page">
            <!-- 筛选条件 -->
            <div
                class="record_filter van-hairline--bottom relative px-12px h-44px text-14px text-light-text hstack justify-between w-full"
            >
                <!-- 分类选择 -->
                <div
                    class="type_filter h-full leading-44px"
                    :class="{ 'filter-seleted': show && bottomMode === 'type' }"
                    @click="expandBottom('type')"
                >
                    <span>{{ currentType.title }}</span>
                    <i class="triangle_icon"></i>
                </div>
                <!-- 日期选择 -->
                <div
                    class="data_filter h-full leading-44px"
                    :class="{ 'filter-seleted': show && bottomMode === 'date' }"
                    @click="expandBottom('date')"
                >
                    <span v-if="dataModeMonth">{{ timeMonth }}</span>
                    <span v-else>
                        <template v-if="timeDayStart === firstDayMonth && timeDayEnd === lastDayMonth">本月</template>
                        <template v-else>{{ timeDayStart }}-{{ timeDayEnd }}</template>
                    </span>
                    <i class="triangle_icon"></i>
                </div>
                <!-- 细分 -->
                <div
                    class="type_filter h-full leading-44px"
                    :class="{ 'filter-seleted': show && bottomMode === 'right' }"
                    @click="expandBottom('right')"
                >
                    <span>{{ rightChoose.title }}</span>
                    <i class="triangle_icon"></i>
                </div>
                <!-- 下拉 -->
                <div v-show="show" class="richRecordPopup">
                    <div class="mask" @click="show = false"></div>
                    <transition name="van-slide-down">
                        <div
                            class="pop-wrapper overflow-x-scroll absolute w-full hstack bg-lightGreen px-20px py-14px"
                            v-show="show && bottomMode === 'type'"
                        >
                            <div class="hstack">
                                <div
                                    class="list_box h-38px w-80px flex-center border-1px border-light-text text-light-text text-16px mr-5px rounded-6px"
                                    :class="{
                                        'border-none text-old-text! primary-btn': typeIndex === index
                                    }"
                                    v-for="(item, index) in typeList"
                                    :key="index"
                                    @click="selectType(index, 'type')"
                                >
                                    {{ item.title }}
                                </div>
                            </div>
                        </div>
                    </transition>
                    <transition name="van-slide-down">
                        <div class="pop-wrapper absolute w-full bg-lightGreen pt-15px" v-show="show && bottomMode === 'date'">
                            <div class="px-12px">
                                <div
                                    @click="switchDateMode"
                                    class="date-select-btn h-30px w-116px hstack rounded-30px px-18px bg-#c6d0db text-14px text-old-text"
                                >
                                    <span class="mr-6px">按{{ dataModeMonth ? "月" : "日" }}选择</span>
                                    <i class="change_icon"></i>
                                </div>
                                <div
                                    class="text-#27bc74 border-#27bc74 border-solid mt-20px h-30px leading-30px text-16px text-center"
                                    style="border-bottom-width: 1px"
                                    v-if="dataModeMonth"
                                >
                                    {{ timeMonth }}
                                </div>
                                <div
                                    class="date-box flex-center mt-20px h-30px leading-30px text-16px text-center text-#7c839f"
                                    v-else
                                >
                                    <div
                                        class="startTime betTime"
                                        :class="{ 'data-selected': dayMode === 1 }"
                                        @click="selectTime(1)"
                                    >
                                        {{ timeDayStart }}
                                    </div>
                                    <div class="to">至</div>
                                    <div
                                        class="endTime betTime"
                                        :class="{ 'data-selected': dayMode === 2 }"
                                        @click="selectTime(2)"
                                    >
                                        {{ timeDayEnd }}
                                    </div>
                                </div>
                            </div>
                            <div class="date_select_view my-10px">
                                <van-date-picker
                                    class="richpay-date-picker"
                                    v-model="currentDate"
                                    :formatter="formatterYMD"
                                    @change="changeDate"
                                    title="选择日期"
                                    option-height="0.34rem"
                                    :show-toolbar="false"
                                    :min-date="minDate"
                                    :max-date="maxDate"
                                    :columns-type="columnsType"
                                />
                            </div>
                            <div class="hstack">
                                <div class="btn reset-btn flex-1">
                                    <van-button
                                        @click="handleReset"
                                        class="h-50px leading-50px text-18px bg-#c6d0db border-none rounded-none"
                                        block
                                    >
                                        重置
                                    </van-button>
                                </div>
                                <div class="btn confirm-btn flex-1">
                                    <van-button
                                        @click="confirm"
                                        class="h-50px leading-50px text-18px primary-btn border-none rounded-none"
                                        block
                                    >
                                        确定
                                    </van-button>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <transition name="van-slide-down">
                        <div
                            class="pop-wrapper overflow-x-scroll absolute w-full hstack bg-lightGreen px-20px py-14px"
                            v-show="show && bottomMode === 'right'"
                        >
                            <div class="hstack">
                                <div
                                    class="list_box h-38px w-80px flex-center border-1px border-light-text text-light-text text-16px mr-5px rounded-6px"
                                    :class="{
                                        'border-none text-old-text! primary-btn': rightIndex === index
                                    }"
                                    v-for="(item, index) in rightType"
                                    :key="index"
                                    @click="selectType(index, 'right')"
                                >
                                    {{ item.title }}
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
            <!-- 交易记录 -->
            <PullRefresh @on-refresh="onRefresh">
                <div class="list font-classic">
                    <ListLazy v-if="!systemParams.PageLoading" @load="loadTradeRecords">
                        <div
                            class="list_box hstack justify-between text-14px text-#c6d0db pt-6px van-hairline--bottom"
                            v-for="(item, index) in freshStore.list"
                            @click="
                                () => {
                                    if (item?.id) {
                                        router.push(`/tradingrecord/detail?id=${item.id}`)
                                    }
                                }
                            "
                            :key="index"
                        >
                            <div class="item-left max-w-230px">
                                <div class="record_type h-30px leading-30px text-oldText van-ellipsis">
                                    {{ item?.title ?? item?.description ?? "" }}
                                </div>
                                <div class="record_time text-12px h-30px leading-30px text-#c6d0db" v-if="currentType.id == 1">
                                    {{ formatDate(item?.time * 1000) }}
                                </div>
                                <div class="record_time text-12px h-30px leading-30px text-#c6d0db" v-if="currentType.id == 0">
                                    {{ item.order_no }}
                                </div>
                            </div>
                            <div
                                class="item-right text-right text-#7c839f"
                                :class="{
                                    success: item.status === 1 || (currentType.id == 0 && item.type == 1),
                                    negative: currentType.id == 0 && item.type == 2,
                                    warning: item.status === 2
                                }"
                            >
                                <div class="record_money h-30px leading-30px" v-if="currentType.id == 1">
                                    {{ (item.operations === 1 ? "+" : "-") + item.amount }}
                                </div>
                                <div class="record_money h-30px leading-30px" v-if="currentType.id == 0">
                                    {{ (item.type === 1 ? "+" : "-") + item.amount }}
                                </div>
                                <div class="record_time text-12px h-30px leading-30px text-#c6d0db" v-if="currentType.id == 0">
                                    {{ formatDate(item?.time * 1000) }}
                                </div>
                                <div
                                    class="record_status text-12px h-30px leading-30px"
                                    v-if="'status' in item && item.status === 1"
                                >
                                    交易成功
                                </div>
                                <div
                                    class="record_status text-12px h-30px leading-30px"
                                    v-if="'status' in item && item.status === 0"
                                >
                                    交易中...
                                </div>
                                <div
                                    class="record_status text-12px h-30px leading-30px"
                                    v-if="'status' in item && item.status === 2"
                                >
                                    交易失败
                                </div>
                            </div>
                        </div>
                    </ListLazy>
                </div>
            </PullRefresh>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/style/recordold.scss";
.tradrecord-page {
    .item-right {
        &.success {
            color: #27bc74;
        }

        &.negative,
        &.warning {
            color: #e31212;
        }

        &.warning .record_money {
            text-decoration: line-through;
        }

        &.trading {
            color: #e34d12;
        }
    }
}
</style>
