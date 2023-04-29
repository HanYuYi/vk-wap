<script setup lang="ts">
import ApiSetting from "@/api/service"
import { ref, computed, unref, watch } from "vue"
import { useNow, useDateFormat, useDebounceFn } from "@vueuse/core"
import { formatNumberSplit } from "@/utils/numberUtils"
import { formatterYMD } from "@/utils/date"
import { useFreshStore } from "@/stores/fresh"
import { useRoute } from "vue-router"
import type { ActiveGetCallFriendsRecords } from "@/api/pojo/active/ActiveGetCallFriendsRecords"
import type { FieldInstance } from "vant"

const route = useRoute()
const freshStore = useFreshStore()

freshStore.paginationData.pageNum = 0

const show = ref(false)
const searchInputRef = ref<FieldInstance | null>(null)
const searchContent = ref("")

const finishedText = computed(() => {
    if (freshStore.list.length) {
        return "已经全部加载完毕"
    } else {
        if (searchContent.value.length) {
            return "暂无此用户"
        } else {
            return "暂无数据"
        }
    }
})

const reset = (): void => {
    freshStore.resetList()
    freshStore.paginationData.pageNum = 0
}

const onRefresh = (): void => {
    reset()
    getRecordsByParams()
}

const filterSearch = useDebounceFn(() => {
    reset()
    getRecordsByParams()
}, 500)

const activityType = [
    { id: 0, title: "邀请首存送" },
    { id: 1, title: "邀请周存送" },
    { id: 2, title: "返利无上限" }
] as const

// 活动类型：1 首存，2 周存，3 返利
const currentActivityType = ref(0)

// 返利类型
const giftType = [
    { id: 0, title: "邀请返利" },
    { id: 1, title: "受邀返利" }
]
// 返利类型：1 邀请 2 受邀
const currentGiftType = ref(0)

const titleIndex = ref(0)
const headTitleArr = ["邀请首存送返利记录", "邀请周存送返利记录", "返利无上限返利记录", "受邀返利记录"] as const

const headTitle = computed<typeof headTitleArr[number]>(() => {
    return headTitleArr[titleIndex.value]
})

const focusSearch = (): void => {
    searchInputRef.value.focus()
}

// 首存状态
const isFirstDepo = computed<boolean>(() => {
    return currentActivityType.value === 0 && currentGiftType.value === 0
})
// 邀请周存状态
const isInvitWeek = computed<boolean>(() => {
    return currentActivityType.value === 1 && currentGiftType.value === 0
})
// 受邀周存状态
const isInvitedWeek = computed<boolean>(() => {
    return currentActivityType.value === 1 && currentGiftType.value === 1
})
// 无限返利状态
const isNolimit = computed<boolean>(() => {
    return currentActivityType.value === 2 && currentGiftType.value === 0
})

// 改变页面标题
const changeTitle = (index: number): void => {
    titleIndex.value = index
}

const filterAcType = ref<typeof activityType[number][]>([])

// 改变返利类型
const changeGiftType = (index: number): void => {
    currentGiftType.value = index
    if (index == 0) {
        filterAcType.value = [...activityType]
        changeTitle(currentActivityType.value)
    } else {
        currentActivityType.value = 1
        filterAcType.value = activityType.filter((item: typeof activityType[number]) => item.id == 1)
        changeTitle(3)
    }
}
// 改变活动类型
const changeActivityType = (index: number): void => {
    // 当前是受邀类型，选择非周存，必须切换为邀请类型
    if (currentGiftType.value == 1) {
        if (index == 0) {
            return
        }
    }
    currentActivityType.value = index
    changeTitle(index)
}

const showWeek = ref(false)
const showDate = ref(false)
const YEAR = unref(useDateFormat(useNow(), "YYYY"))
const MONTH = unref(useDateFormat(useNow(), "MM"))
const DAY = unref(useDateFormat(useNow(), "DD"))
const minDate = new Date(`${Number(YEAR) - 10}/${MONTH}/${DAY}`)
const maxDate = new Date(`${Number(YEAR) + 10}/${MONTH}/${DAY}`)

// 将字符串日期转为数组
const changeDateStr = (str: string, icon: string = "/"): string[] => {
    return str.split(icon)
}

// 非周存活动的时间选择器绑定值
const chooseDay = ref<string[]>(changeDateStr(`${YEAR}/${MONTH}/${DAY}`))

const cancelDate = (): void => {
    showDate.value = false
    chooseDay.value = changeDateStr(`${YEAR}/${MONTH}/${DAY}`)
}

// 关闭选择弹窗前状态初始化
const resetType = (): void => {
    chooseDay.value = changeDateStr(`${YEAR}/${MONTH}/${DAY}`)
    const lastWeekMs = new Date().getTime() - 7 * 24 * 60 * 60 * 1000
    initWeekData(new Date(lastWeekMs), "lastWeek")
    show.value = false
}

const confirmQuery = (): void => {
    show.value = false
    onRefresh()
}

// 计算一年有几个标准周，52周364天，53周371天
const getISOWeeks = (y: number): 53 | 52 => {
    let d, isLeap

    d = new Date(y, 0, 1)
    isLeap = new Date(y, 1, 29).getMonth() === 1

    // check for a Jan 1 that's a Thursday or a leap year that has a
    // Wednesday jan 1. Otherwise it's 52
    return d.getDay() === 4 || (isLeap && d.getDay() === 3) ? 53 : 52
}

// 计算一年的第一周第一天是哪一号（第一周必须包含第一个周四）
const getFirstDateNum = (yearNum: number): { flag: string; whichDay: number; FDinYear: Date } => {
    let FDinYear: Date
    // 标记今年第一周第一天是从去年开始算，还是今年开始算，默认从今年开始算（this/last）
    let flag = "thisYear"
    // 每年的1号
    const firstDay = new Date(yearNum, 0, 1)
    // 计算第一天是一周中的第几天, 0是星期天，6是星期六
    let dayInFirstWeek = firstDay.getDay()
    let nextMondayFistWeek
    if (dayInFirstWeek == 0) {
        // 星期天置为7
        dayInFirstWeek = 7
    }
    // 如果上一年是闰年53个周，那么今年从第二个周一开始算第一周；否则从去年的最后一个周一开始算
    if (dayInFirstWeek > 4) {
        // 如果1号后包含今年第一个星期四，则1号属于今年第一周，实际第一周第一天是去年的最后一个周一；否则实际的第一周第一天是今年第二个周一
        FDinYear = new Date(firstDay.getTime() + (8 - dayInFirstWeek) * (24 * 60 * 60 * 1000))
        flag = "thisYear"
    } else {
        FDinYear = new Date(firstDay.getTime() - (dayInFirstWeek - 1) * (24 * 60 * 60 * 1000))
        nextMondayFistWeek = new Date(firstDay.getTime() + (8 - dayInFirstWeek) * (24 * 60 * 60 * 1000))
        flag = "lastYear"
    }
    // 实际每年第一周的第一天是一个月中的几号
    let whichDay = FDinYear.getDate()
    if (flag == "lastYear") {
        // 如果今年的第一周第一天从去年开始算，计算的时候不能从去年开始，否则会计算出负数
        whichDay = nextMondayFistWeek.getDate()
    }
    return { whichDay, FDinYear, flag }
}

// 原来的计算方式是以每年的1月1号为第一周，实际有的年份是53周
const getWeekInYear = (date: Date, whichDay: number, flag: string): number => {
    const d1 = new Date(date)
    const d2 = new Date(date)
    d2.setMonth(0)
    d2.setDate(whichDay)
    const rq: number = d1.getTime() - d2.getTime()
    const days = Math.ceil(rq / (24 * 60 * 60 * 1000)) + 1
    let num = Math.ceil(days / 7)
    if (flag == "lastYear") {
        num += 1
    }
    return num
}

// 根据选择的第XX周计算该周的开始时间和结束时间
const getDayBeEnd = (
    [yearNum, weekNum]: [number | string, number | string],
    format: string = "YYYY-MM-DD"
): { startDay: string; endDay: string } => {
    const FirstDateNum = getFirstDateNum(Number(yearNum))
    const startDayMS = new Date(FirstDateNum.FDinYear).getTime() + (Number(weekNum) - 1) * 7 * (24 * 60 * 60 * 1000)
    const endDayMS = startDayMS + 6 * (24 * 60 * 60 * 1000)
    const startDay = unref(useDateFormat(new Date(startDayMS), format))
    const endDay = unref(useDateFormat(new Date(endDayMS), format))
    return { startDay, endDay }
}

// 周存时间区间，2022-第X周
const WeekSelected = ref<string[]>([])
// 选择周数后对应的开始时间
const weekStart = ref("")
// 选择周数后对应的结束时间
const weekEnd = ref("")

const setWeekStatus = (YearNum: number, WeekNum: number): void => {
    WeekSelected.value.push(YearNum.toString())
    WeekSelected.value.push(WeekNum.toString())
    const dayBeEnd = getDayBeEnd([YearNum, WeekNum])
    weekStart.value = dayBeEnd.startDay
    weekEnd.value = dayBeEnd.endDay
}

const initWeekData = (CDate = new Date(), flag = ""): void => {
    // 根据今天当前时间计算属于今年的哪一周，对周UI组件初始化
    let YearNumber: number = CDate.getFullYear()
    const MaxWN: 53 | 52 = getISOWeeks(YearNumber)
    const FirstDateNum = getFirstDateNum(YearNumber)
    let currentWeekNum: number = getWeekInYear(CDate, FirstDateNum.whichDay, FirstDateNum.flag)
    if (currentWeekNum < 1) {
        YearNumber -= 1
        currentWeekNum = getISOWeeks(YearNumber)
    }
    if (currentWeekNum > MaxWN) {
        YearNumber += 1
        currentWeekNum = 1
    }
    setWeekStatus(YearNumber, currentWeekNum)
}
// 查询返利记录
const getRecordsByParams = (): void => {
    const active_type = currentActivityType.value + 1

    const params = {
        active_type,
        type: currentGiftType.value + 1,
        date: active_type == 2 ? weekStart.value : chooseDay.value.join("-"),
        username: searchContent.value
    }

    freshStore.getList<ActiveGetCallFriendsRecords, typeof params>({
        url: ApiSetting.active.callFriends.records,
        params
    })
}

type WeeksArrItem = { text: string; value: string }
const weeksArr = ref<Array<WeeksArrItem & { children: WeeksArrItem[] }>>([])

// 选择了一个时间区间，XX年第XX周 ['2022', '26']
watch(WeekSelected, (val: string[]) => {
    const yearNum: string = val[0]
    const weekNum: string = val[1]
    const dayBeEnd = getDayBeEnd([yearNum, weekNum])
    weekStart.value = dayBeEnd.startDay
    weekEnd.value = dayBeEnd.endDay
})

// 生成年-周的数组
const init = (): void => {
    // 对应的年份有 52/53 周
    let weekAmount: 53 | 52
    // 起始年份
    const startYear = 2022
    // 起始年份，暂定今年
    let EndYear: number = new Date().getFullYear()
    for (let i = startYear; i <= EndYear; i++) {
        const Father: WeeksArrItem & { children: WeeksArrItem[] } = {
            text: i + "年",
            value: i + "",
            children: []
        }

        weeksArr.value.push(Father)
        weekAmount = getISOWeeks(i)
        for (let j = 1; j <= weekAmount; j++) {
            const dayBeginEnd = getDayBeEnd([i, j], "MM-DD")
            Father.children.push({
                text: "第" + j + "周" + "(" + dayBeginEnd.startDay + " 至 " + dayBeginEnd.endDay + ")",
                value: j + ""
            })
        }
    }
    const lastWeekMs = new Date().getTime() - 7 * 24 * 60 * 60 * 1000
    initWeekData(new Date(lastWeekMs), "lastWeek")
}

if (route.query.tab) {
    titleIndex.value = Number(route.query.tab)
    currentActivityType.value = Number(route.query.tab)
}
init()
filterAcType.value = [...activityType]
reset()
</script>

<template>
    <div class="font-classic leading-relaxed">
        <HeaderBar>
            <div class="header_title">{{ headTitle }}</div>
            <template #right>
                <div @click="show = true" class="top-icon draw-icon"></div>
            </template>
        </HeaderBar>
        <div class="expand-page CallFriendsRecords bg-#e8f1ef pt-40px relative" :class="{ 'pt-97px': currentGiftType != 1 }">
            <div class="fixed top-44px left-0 right-0 bg-#e8f1ef z-2" :class="{ 'pt-15px': currentGiftType != 1 }">
                <div class="search-bar" @click="focusSearch" v-if="currentGiftType != 1">
                    <div class="search_btn"></div>
                    <van-field
                        autofocus
                        ref="searchInputRef"
                        class="leading-20px"
                        v-model="searchContent"
                        placeholder="搜索用户名"
                        clearable
                        @update:model-value="filterSearch"
                    />
                </div>
                <section class="record-titlegroup">
                    <div class="title-wrapper">
                        <div v-if="!isInvitedWeek">用户名</div>
                        <div v-if="isFirstDepo">首存金额</div>
                        <div v-if="isNolimit">昨日投注金额</div>
                        <div v-if="isFirstDepo || isNolimit">今日已获返利</div>
                        <div :class="{ 'flex-1!': isInvitedWeek }" v-if="isInvitWeek || isInvitedWeek">周累存额</div>
                        <div :class="{ 'flex-1!': isInvitedWeek }" v-if="isInvitWeek || isInvitedWeek">周累返利</div>
                        <div :class="{ 'flex-1!': isInvitedWeek }" v-if="!isNolimit">累计返利</div>
                        <div v-if="isNolimit">15天累计返利</div>
                    </div>
                </section>
            </div>

            <!--交易记录-->
            <PullRefresh @on-refresh="onRefresh">
                <section class="records_list">
                    <ListLazy :finishedText="finishedText" @load="getRecordsByParams">
                        <div class="list_box" v-for="item in freshStore.list" :key="item.id">
                            <div class="up">
                                <div class="username" v-if="!isInvitedWeek">
                                    {{ item.invitee_name }}
                                </div>
                                <div :class="{ 'flex-1! text-left!': isInvitedWeek }" class="money">
                                    <template v-if="isFirstDepo">{{ formatNumberSplit(item.first_deposit) }}元</template>
                                    <template v-if="isInvitWeek || isInvitedWeek">
                                        {{ formatNumberSplit(item.total_deposit) }}元
                                    </template>
                                    <template v-if="isNolimit">{{ formatNumberSplit(item.total_bet_amount) }}元</template>
                                </div>
                                <div :class="{ 'flex-1!': isInvitedWeek }" class="profit-today maincolor">
                                    <template v-if="isFirstDepo">{{ formatNumberSplit(item.active_one_rebate) }}元</template>
                                    <template v-if="isInvitWeek || isInvitedWeek">
                                        {{ formatNumberSplit(item.active_two_rebate) }}元
                                    </template>
                                    <template v-if="isNolimit">{{ formatNumberSplit(item.active_three_rebate) }}元</template>
                                </div>
                                <div :class="{ 'flex-1!': isInvitedWeek }" class="profit-total">
                                    <div class="total maincolor">{{ formatNumberSplit(item.total_amount) }}元</div>
                                </div>
                            </div>
                            <div class="date">{{ item.date }}</div>
                        </div>
                    </ListLazy>
                </section>
            </PullRefresh>
        </div>

        <van-popup v-model:show="show" class="callfriendspopup" position="bottom" teleport="body" :style="{ height: '100%' }">
            <div class="proxy-select-page w-full h-full py-13px px-15px text-#7c839f text-12px">
                <div class="p-title">筛选</div>
                <div class="psg-block">
                    <div>时间</div>
                    <template v-if="currentActivityType == 1">
                        <div class="time-custom" @click="showWeek = true">
                            <span class="time">{{ weekStart }}</span>
                            <span class="mx-6px" v-if="weekEnd">至</span>
                            <span class="time">{{ weekEnd }}</span>
                        </div>
                        <van-popup v-model:show="showWeek" position="bottom">
                            <van-picker
                                v-model="WeekSelected"
                                class="callfriends-picker"
                                :columns="weeksArr"
                                @cancel="showWeek = false"
                                @confirm="showWeek = false"
                            />
                        </van-popup>
                    </template>
                    <template v-else>
                        <div class="time-custom" @click="showDate = true">
                            <span class="time">{{ chooseDay.join("-") }}</span>
                        </div>
                        <van-popup @click-overlay="cancelDate" v-model:show="showDate" position="bottom">
                            <van-date-picker
                                :formatter="formatterYMD"
                                v-model="chooseDay"
                                :min-date="minDate"
                                :max-date="maxDate"
                                @cancel="cancelDate"
                                @confirm="showDate = false"
                            />
                        </van-popup>
                    </template>
                </div>
                <div class="psg-block">
                    <div>返利类型</div>
                    <div class="btn-group">
                        <div
                            @click="changeGiftType(index)"
                            :class="{ 'active-btn': item.id == currentGiftType }"
                            v-for="(item, index) in giftType"
                            :key="index"
                            class="btn"
                        >
                            {{ item.title }}
                        </div>
                    </div>
                </div>
                <div class="psg-block">
                    <div>活动类型</div>
                    <div class="btn-group">
                        <div
                            @click="changeActivityType(index)"
                            :class="{ 'active-btn': item.id == currentActivityType }"
                            v-for="(item, index) in filterAcType"
                            :key="index"
                            class="btn"
                        >
                            {{ item.title }}
                        </div>
                    </div>
                </div>
                <div class="bottom-block">
                    <div @click="resetType" class="btn btn-cancel">取消</div>
                    <div @click="confirmQuery" class="btn btn-confirm">确定</div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<style lang="scss" scoped>
.maincolor {
    color: #26bc74;
}
.callfriends-picker {
    :deep(.van-picker-column) {
        &:nth-child(2) {
            flex: 2;
        }
    }
}
.CallFriendsRecords {
    .search-bar {
        display: flex;
        border-radius: 0.1rem;
        overflow: hidden;
        align-items: center;
        width: 92vw;
        height: 0.4rem;
        background-color: #fff;
        margin: 0 auto;
        box-sizing: border-box;
        padding-left: 0.15rem;
    }
    .search_btn {
        display: inline-block;
        vertical-align: middle;
        width: 0.24rem;
        height: 100%;
        background: url("@/assets/img/active/invitefriends/search.png") no-repeat center center;
        background-size: contain;
    }
    .record-titlegroup {
        width: 100%;
        margin-top: 0.02rem;
        border-bottom: solid 1px #7c839f;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.14rem;
        color: #7c839f;
        .title-wrapper {
            width: 100%;
            height: 100%;
            margin: auto;
            width: 92vw;
            display: flex;
            justify-content: space-between;
            box-sizing: border-box;
            div {
                &:first-child {
                    flex: 0.2;
                    text-align: left;
                }
                &:nth-child(2) {
                    flex: 0.3;
                    text-align: center;
                }
                &:nth-child(3) {
                    flex: 0.3;
                    text-align: center;
                }
                &:last-child {
                    flex: 0.3;
                    text-align: right;
                }
            }
        }
    }
    .records_list {
        position: relative;
        min-height: calc(100vh - 141px);
        min-height: calc(var(--vh) * 100 - 141px);
        overflow-x: hidden;
        overflow-y: auto;
        .list_box {
            margin: auto;
            width: 92vw;
            font-size: 0.12rem;
            line-height: 1.83;
            color: #989ea1;
            box-sizing: border-box;
            padding-top: 0.15rem;
            border-bottom: solid 1px #c6d0db;
            .date {
                text-align: right;
                line-height: 2.6;
                min-height: 0.3rem;
            }
            .up {
                display: flex;
                justify-content: space-between;
            }
            .username {
                font-size: 0.15rem;
                color: #2e3039;
                flex: 0.2;
                text-align: left;
                line-height: 1;
            }
            .money {
                line-height: 1.4;
                flex: 0.3;
                text-align: center;
            }
            .profit-today {
                line-height: 1.4;
                flex: 0.3;
                text-align: center;
            }
            .profit-total {
                flex: 0.3;
                text-align: right;
                .total {
                    font-size: 0.15rem;
                    line-height: 1;
                }
            }
        }
    }
}
</style>
<style lang="scss">
.van-popup.callfriendspopup {
    background: #e8f1ef;
    line-height: 1.6;
    .p-title {
        font-size: 0.14rem;
        margin-left: 0.15rem;
        margin-bottom: 0.14rem;
    }
    .psg-block {
        width: 100%;
        box-sizing: border-box;
        background: #fff;
        border-radius: 0.1rem;
        padding: 0.15rem;
        margin-bottom: 0.15rem;
        .time-date {
            padding: 0;
        }
        .vux-cell-box {
            &::before {
                content: none;
            }
        }
        .time-custom {
            margin-top: 0.1rem;
            .time {
                color: #262933;
                border-bottom: solid 0.01rem #262933;
            }
        }
        .btn-group {
            margin-top: 0.15rem;
            display: flex;
            width: 100%;
            .btn {
                box-sizing: border-box;
                width: 1rem;
                height: 0.4rem;
                border-radius: 0.06rem;
                line-height: 0.4rem;
                text-align: center;
                font-size: 0.14rem;
                border: solid 0.01rem #7c839f;
                margin-right: 0.08rem;
            }
            .active-btn {
                background-image: linear-gradient(to right, #07e9f1, #07f1b7);
                font-weight: bold;
                color: #262933;
                border: none;
            }
        }
    }
    .bottom-block {
        width: 100%;
        padding: 0 0.14rem;
        margin: 0.3rem auto;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        .btn {
            width: 1.5rem;
            height: 0.4rem;
            border-radius: 0.4rem;
            text-align: center;
            line-height: 0.4rem;
            color: #262933;
            font-weight: bold;
            font-size: 0.16rem;
            box-sizing: border-box;
        }
        .btn-cancel {
            border: solid 0.01rem #07f1b7;
        }
        .btn-confirm {
            background-image: linear-gradient(to right, #07e9f1, #07f1b7);
        }
    }
}
</style>
