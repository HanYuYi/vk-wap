<script setup lang="ts">
import dayjs from "dayjs"
import ApiSetting from "@/api/service"
import { ref, computed, unref, watch } from "vue"
import { useNow, useDateFormat } from "@vueuse/core"
import { formatterYMD } from "@/utils/date"
import { useFreshStore } from "@/stores/fresh"
import type { RichPayGetOrderList } from "@/api/pojo/active/RichPayGetOrderList"
import type { InferArray } from "@/types"

const freshStore = useFreshStore()

const show = ref(false)
const bottomMode = ref("type")
const typeIndex = ref(0)

const typeList = [
    { id: 0, title: "全部" },
    { id: 3, title: "提息" },
    { id: 1, title: "转入" },
    { id: 2, title: "转出" },
    { id: 4, title: "红包" }
]

// 当前选中的分类
const currentType = computed<InferArray<typeof typeList>>(() => typeList[typeIndex.value])

// 展开分类下拉选择
const expandTypeBottom = (): void => {
    // 如果从时间切换过来的，不需要关闭弹层，直接切换模式即可
    if (bottomMode.value === "type") {
        show.value = !show.value
    } else {
        bottomMode.value = "type"
        if (!show.value) {
            show.value = !show.value
        }
    }
}

const selectType = (item: InferArray<typeof typeList>, index: number): void => {
    typeIndex.value = index
    show.value = false
    freshStore.resetList()
    loadTradeRecords()
}

// 日期模式以月为单位显示，默认是以天为单位
const dataModeMonth = ref(false)

// 以天为单位模式，当前高亮的是开始时间1，还是结束时间2
const dayMode = ref(1)

const YEAR: string = unref(useDateFormat(useNow(), "YYYY"))
const MONTH: string = unref(useDateFormat(useNow(), "MM"))
const DAY: string = unref(useDateFormat(useNow(), "DD"))

const columnsType = ref(["year", "month", "day"])
const timeMonth = ref(`${YEAR}/${MONTH}`)
const timeDayStart = ref(`${YEAR}/${MONTH}/${DAY}`)
const timeDayEnd = ref(`${YEAR}/${MONTH}/${DAY}`)
const currentDate = ref([YEAR, MONTH, DAY])
const minDate: Date = new Date(`${Number(YEAR) - 2}/${MONTH}/${DAY}`)
const maxDate: Date = new Date()
const lastDayMonth: string = dayjs().endOf("month").format("YYYY/MM/DD")

watch(dataModeMonth, (val?: boolean) => {
    if (val) {
        // 为true, 选择了月
        columnsType.value = ["year", "month"]
        currentDate.value = [YEAR, MONTH]
    } else {
        columnsType.value = ["year", "month", "day"]
        currentDate.value = [YEAR, MONTH, DAY]
    }
})

watch(currentDate, (val?: string[]) => {
    if (dataModeMonth.value) {
        timeMonth.value = val[0] + "/" + val[1]
    } else {
        if (dayMode.value === 1) {
            timeDayStart.value = val[0] + "/" + val[1] + "/" + val[2]
        }
        if (dayMode.value === 2) {
            timeDayEnd.value = val[0] + "/" + val[1] + "/" + val[2]
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
})

// 重置时间
const handleReset = (): void => {
    timeMonth.value = `${YEAR}/${MONTH}`
    timeDayStart.value = `${YEAR}/${MONTH}/${DAY}`
    timeDayEnd.value = `${YEAR}/${MONTH}/${DAY}`
    if (dataModeMonth.value) {
        columnsType.value = ["year", "month"]
        currentDate.value = [YEAR, MONTH]
    } else {
        columnsType.value = ["year", "month", "day"]
        currentDate.value = [YEAR, MONTH, DAY]
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

// 展开时间下拉选择
const expandTimeBottom = (): void => {
    if (bottomMode.value === "date") {
        show.value = !show.value
    } else {
        bottomMode.value = "date"
        if (!show.value) {
            show.value = !show.value
        }
    }
}

// 切换日期模式
const switchDateMode = (): void => {
    dataModeMonth.value = !dataModeMonth.value
}

// 选择日期
const selectTime = (type: number): void => {
    dayMode.value = type
}

/**
 * 下拉刷新
 */
const onRefresh = (): void => {
    freshStore.resetList()
    loadTradeRecords()
}

// 获取V富通交易记录 前置条件判断
const loadTradeRecords = (): void => {
    const params = {
        order_type: unref(currentType).id, // 0全部，1转入，2转出，3提息  默认0
        start_time: dataModeMonth.value ? timeMonth.value + "/01" : timeDayStart.value,
        end_time: dataModeMonth.value ? lastDayMonth : timeDayEnd.value
    }

    freshStore.getList<RichPayGetOrderList, typeof params>({
        url: ApiSetting.richPayGetOrderList,
        params
    })
}
</script>

<template>
    <div class="richpay-record-page bg-lightGreen">
        <HeaderBar>
            <div class="header_title">V富通钱包交易记录</div>
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
                    @click="expandTypeBottom"
                >
                    <span>{{ currentType.title }}</span>
                    <i class="triangle_icon"></i>
                </div>
                <!-- 日期选择 -->
                <div
                    class="data_filter h-full leading-44px"
                    :class="{ 'filter-seleted': show && bottomMode === 'date' }"
                    @click="expandTimeBottom"
                >
                    <span v-if="dataModeMonth">{{ timeMonth }}</span>
                    <span v-else>{{ timeDayStart }}-{{ timeDayEnd }}</span>
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
                                    @click="selectType(item, index)"
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
                </div>
            </div>
            <!-- 交易记录 -->
            <PullRefresh @on-refresh="onRefresh">
                <div class="list">
                    <ListLazy @load="loadTradeRecords">
                        <div
                            class="list_box hstack justify-between text-14px text-#999ea1 py-12px van-hairline--bottom"
                            v-for="(item, index) in freshStore.list"
                            :key="index"
                        >
                            <div class="item-left">
                                <span class="text-#2e3039 text-15px mb-17px inline-block">{{ item.status_cn }}</span>
                                <br />
                                <span class="text-12px">流水号：{{ item.order_no }}</span>
                            </div>
                            <div class="item-right text-right">
                                <span
                                    class="text-15px mb-17px inline-block"
                                    :class="(item.is_show_color === 1 || item.is_show_color === 2) && 'text-#27bc74'"
                                >
                                    {{ item.amount }}
                                </span>
                                <br />
                                <span class="text-12px">{{ item.time }}</span>
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
</style>
