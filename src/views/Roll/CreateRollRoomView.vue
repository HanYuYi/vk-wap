<script setup lang="ts">
import ApiSetting from "@/api/service"
import { formatterStr } from "@/composable/validate"
import { formatterYMD, formatterHMS } from "@/utils/date"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { useNow, useDateFormat } from "@vueuse/core"
import { showToast } from "vant"
import { ref, unref, watch, computed, reactive } from "vue"
import { useSysStore } from "@/stores/system"
import { HttpPlus } from "@/api/HttpPlus"
import type { RollCreateCheck } from "@/api/pojo/RollCreateCheck"
import type { RollUserPackage } from "@/api/pojo/RollUserPackage"

const systemParams = useSysStore()
const router: Router = useRouter()

// 将字符串日期转为数组
const changeDateStr = (str: string): string[] => {
    return str.split("/")
}

const startMaxDay = ref(0)
const endMaxDays = ref(0)
const YEAR = unref(useDateFormat(useNow(), "YYYY"))
const MONTH = unref(useDateFormat(useNow(), "MM"))
const DAY = unref(useDateFormat(useNow(), "DD"))
const HOUR = unref(useDateFormat(useNow(), "HH"))
const MINUTE = unref(useDateFormat(useNow(), "mm"))
let minDate = new Date(`${YEAR}/${MONTH}/${DAY}`)
let maxDate = new Date(`${Number(YEAR) + 10}/${MONTH}/${DAY}`)

watch(endMaxDays, (val: number) => {
    if (val) {
        if (dayMode.value === 2) {
            maxDate = new Date(`${YEAR}/${MONTH}/${Number(DAY) + val}`)
        }
    }
})
watch(startMaxDay, (val) => {
    if (val) {
        if (dayMode.value === 1) {
            maxDate = new Date(`${YEAR}/${MONTH}/${Number(DAY) + val}`)
        }
    }
})

const currentDate = ref(changeDateStr(`${YEAR}/${MONTH}/${DAY}`))
const currentTime = ref(changeDateStr(`${HOUR}/${MINUTE}`))
const showBottom = ref(false)
const dayMode = ref(1) // 1 开始时间 2 结束时间
const timeStart = ref("")
const timeEnd = ref("")

watch(dayMode, (val: number) => {
    if (val === 1) {
        maxDate = new Date(`${YEAR}/${MONTH}/${Number(DAY) + startMaxDay.value}`)
    }
    if (val === 2) {
        maxDate = new Date(`${YEAR}/${MONTH}/${Number(DAY) + endMaxDays.value}`)
    }
})

// 选择日期
const selectTime = (type: number): void => {
    dayMode.value = type
    if (type === 1 && timeStart.value) {
        const data: string[] = timeStart.value.split(" ")
        currentDate.value = changeDateStr(data[0])
        currentTime.value = data[1].split(":")
    }
    if (type === 2 && timeEnd.value) {
        const data: string[] = timeEnd.value.split(" ")
        currentDate.value = changeDateStr(data[0])
        currentTime.value = data[1].split(":")
    }
    showBottom.value = true
}

const onConfirm = (): void => {
    if (dayMode.value === 1) {
        const date = `${currentDate.value.join("/")} ${currentTime.value.join(":")}`
        if (new Date(date).getTime() < new Date().getTime() - 60 * 1000) {
            showToast({
                className: "vk-toast-fail",
                message: "您选择的时间不能小于当前时间",
                icon: "warning"
            })
            const YEAR = unref(useDateFormat(useNow(), "YYYY"))
            const MONTH = unref(useDateFormat(useNow(), "MM"))
            const DAY = unref(useDateFormat(useNow(), "DD"))
            const HOUR = unref(useDateFormat(useNow(), "HH"))
            const MINUTE = unref(useDateFormat(useNow(), "mm"))
            timeStart.value = `${YEAR}/${MONTH}/${DAY} ${HOUR}:${MINUTE}`
        } else {
            timeStart.value = date
        }
    }
    if (dayMode.value === 2) {
        const date = `${currentDate.value.join("/")} ${currentTime.value.join(":")}`
        if (new Date(date).getTime() < new Date(timeStart.value).getTime() + 60 * 60 * 1000) {
            showToast({
                className: "vk-toast-fail",
                message: "结束时间不能低于开始时间一小时",
                icon: "warning"
            })
            const start = timeStart.value.split(" ")
            const hourMinu = start[1].split(":")
            timeEnd.value = `${start[0]} ${Number(hourMinu[0]) + 1}:${hourMinu[1]}`
        } else {
            timeEnd.value = date
        }
    }
    showBottom.value = false
}
const onCancel = (): void => {
    showBottom.value = false
    if (timeStart.value && dayMode.value === 1) {
        const data = timeStart.value.split(" ")
        currentDate.value = changeDateStr(data[0])
        currentTime.value = data[1].split(":")
    } else if (timeEnd.value && dayMode.value === 2) {
        const data = timeEnd.value.split(" ")
        currentDate.value = changeDateStr(data[0])
        currentTime.value = data[1].split(":")
    } else {
        currentDate.value = changeDateStr(`${YEAR}/${MONTH}/${DAY}`)
        currentTime.value = changeDateStr(`${HOUR}/${MINUTE}`)
    }
}

const desc = ref("")
const winner = ref("")
const password = ref("")
const showPwdSet = ref(false)
const showLeverSet = ref(true)

const levelLimitStr = ref("")
const showLevelPop = ref(false)

const selectedLevel = ref<number[]>([])

type Columns = [{ text: number; value: number }[], { text: number; value: number }[]]

const columns = reactive<Columns>([[], []])

const prices = ref(0)

const showCreateRoomMain = ref(true)

const creBtnDis = computed<boolean>(() => {
    let res: boolean = !unref(timeStart) || !unref(timeEnd) || !unref(winner)
    if (unref(showLeverSet)) {
        res = res || !levelLimitStr.value
        return res
    }
    return res
})

const openLevelPop = (): void => {
    if (selectedLevel.value.length) {
        const left: number = selectedLevel.value[0]
        const right: number = selectedLevel.value[1]
        if (left > right) {
            selectedLevel.value = []
            selectedLevel.value.push(right)
            selectedLevel.value.push(left)
        }
    }
    showLevelPop.value = true
}

const confirmLevel = (): void => {
    showLevelPop.value = false
    if (selectedLevel.value.length) {
        let left = selectedLevel.value[0] ?? 0
        let right = selectedLevel.value[1] ?? 0
        if (!left && !right) {
            selectedLevel.value = []
            return
        }
        if (left > right) {
            levelLimitStr.value = `VIP ${right}~${left}`
        } else {
            levelLimitStr.value = `VIP ${left}~${right}`
        }
    }
}

// 获取设置限制
const checkUserCreate = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.roll.createCheck)
    const res = await HttpPlus.sendHttpRequest<RollCreateCheck>()

    if (res.status === 1) {
        const { vip_level, lever, haspass, max_day, start_max } = res.data
        if (vip_level.length) {
            const arr = vip_level.map((num: number) => {
                return {
                    text: num,
                    value: num
                }
            })
            columns[0] = arr
            columns[1] = arr
        }
        showLeverSet.value = Boolean(lever)
        showPwdSet.value = Boolean(haspass)
        if (start_max) {
            startMaxDay.value = start_max * 1
        }
        if (max_day) {
            endMaxDays.value = max_day * 1
        }
    }
}

const active = ref(0)

watch(active, () => {
    getPrizes()
})

// 饰品
const TYPE_NAV_LIST = [
    {
        id: 570,
        type: "DOTA2"
    },
    {
        id: 730,
        type: "CSGO"
    },
    {
        id: 0,
        type: "其他"
    }
] as const

const gameId = computed<typeof TYPE_NAV_LIST[number]["id"]>(() => TYPE_NAV_LIST[active.value]?.id ?? 570)

const FILTER_TYPE_LIST = [
    {
        type: "time",
        name: "按时间"
    },
    {
        type: "price",
        name: "按价格"
    }
]

type FilterTypeMode = 0 | 1

const filterTypeMode = ref<FilterTypeMode>(0)

const descType = ref<FilterTypeMode>(0)

const sortType = computed(() => FILTER_TYPE_LIST[filterTypeMode.value]?.type ?? "time")

const changeFilter = (x: FilterTypeMode): void => {
    if (x === filterTypeMode.value) {
        if (descType.value === 1) {
            descType.value = 0
        } else {
            descType.value = 1
        }
    } else {
        filterTypeMode.value = x
        descType.value = 0
    }
    getPrizes()
}

const selectedRollItems = ref<PrizeListItem[]>([])
const curSelectNum = ref(0)
const selectAll = ref(false)

// 饰品选择
const tapImg = ref(false)

const handleItemSelect = (item: PrizeListItem): void => {
    tapImg.value = true
    item.selected = !item.selected
    if (item.selected) {
        curSelectNum.value++
        selectedRollItems.value.push(item)
    } else {
        curSelectNum.value--
        selectedRollItems.value = selectedRollItems.value.filter((ele: PrizeListItem) => ele.id !== item.id)
    }
    selectAll.value = Boolean(curSelectNum.value === prizeList.value.length)
}

const chooseAll = (checked: boolean): void => {
    if (checked) {
        prizeList.value = prizeList.value.map((item: PrizeListItem) => {
            return {
                ...item,
                selected: true
            }
        })
        selectedRollItems.value = []
        selectedRollItems.value = prizeList.value
        curSelectNum.value = prizeList.value.length
    } else {
        if (tapImg.value) {
            return
        }
        prizeList.value = prizeList.value.map((item: PrizeListItem) => {
            return {
                ...item,
                selected: false
            }
        })
        selectedRollItems.value = []
        curSelectNum.value = 0
    }
}

const save = (): void => {
    showCreateRoomMain.value = true
    prices.value = 0
    selectedRollItems.value.forEach((item: PrizeListItem) => {
        let num2 = 0
        num2 += item.price * 1
        prices.value += num2
    })
    prices.value = parseFloat(prices.value.toFixed(2))
}

const creBtnLoading = ref(false)

const createRollRoom = async (): Promise<void> => {
    const ids: PrizeListItem["id"][] = selectedRollItems.value.map((item: PrizeListItem) => {
        return item.id
    })
    let baseParams = {
        ids: ids.join(","),
        start: unref(timeStart),
        end: unref(timeEnd),
        win: unref(winner),
        desc: unref(desc),
        password: unref(password)
    }
    const params: Partial<{ min_lever: number; max_lever: number }> = {}
    if (showLeverSet.value) {
        const left = selectedLevel.value[0] ?? 0
        const right = selectedLevel.value[1] ?? 0
        if (left > right) {
            params.min_lever = right
            params.max_lever = left
        } else {
            params.min_lever = left
            params.max_lever = right
        }
    }
    const mergeParams = { ...baseParams, ...params }
    creBtnLoading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.roll.createRoom)
        const res = await HttpPlus.sendHttpRequest<{}, typeof mergeParams>(mergeParams)
        creBtnLoading.value = false

        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: res.message,
                icon: "checked"
            })
            const timer = setTimeout(() => {
                clearTimeout(timer)
                router.push("/roll")
            }, 300)
        }
    } catch (error: unknown) {
        creBtnLoading.value = false
        throw error
    }
}

type RollUserPackageItem = RollUserPackage["data"]

type PrizeListItem = RollUserPackageItem[number] & { selected: boolean }

const prizeList = ref<Array<PrizeListItem>>([])

// 获取饰品列表
const getPrizes = async (): Promise<void> => {
    systemParams.PageLoading = true
    prizeList.value = []
    curSelectNum.value = 0

    const params = {
        game_id: unref(gameId),
        name: "",
        sort: unref(sortType),
        desc: unref(descType)
    }
    HttpPlus.setUrlOptions(ApiSetting.roll.getCreateUserPackage)
    const res = await HttpPlus.sendHttpRequest<RollUserPackageItem, typeof params>(params)
    systemParams.PageLoading = false

    if (res.status === 1) {
        if (res.data.length) {
            prizeList.value = res.data.map((item: RollUserPackageItem[number]) => {
                const choose = selectedRollItems.value.find((ele: any) => ele.id === item.id)
                if (choose) {
                    curSelectNum.value++
                    return {
                        ...item,
                        selected: true
                    }
                } else {
                    return {
                        ...item,
                        selected: false
                    }
                }
            })
            selectAll.value = Boolean(curSelectNum.value === prizeList.value.length)
        } else {
            selectAll.value = false
        }
    }
}

checkUserCreate()
getPrizes()
</script>

<template>
    <div class="createroll-page bg-#e8f1ef font-classic">
        <HeaderBar>
            <div class="header_title">
                {{ showCreateRoomMain ? "创建房间" : "添加饰品" }}
            </div>
        </HeaderBar>
        <!--创建房间所填各项-->
        <div class="expand-page py-15px text-#262933" v-show="showCreateRoomMain">
            <div class="edit_box">
                <p class="px-12px h-25px text-17px font-bold leading-relaxed">房间概况</p>
                <van-field
                    class="bg-transparent"
                    v-model="desc"
                    clearable
                    rows="4"
                    autosize
                    type="textarea"
                    :formatter="formatterStr"
                    maxlength="256"
                    placeholder="活动说明最多不能超过256字"
                    show-word-limit
                    autocomplete="off"
                />
            </div>
            <div class="date-box flex-center mt-10px h-30px leading-30px text-16px text-#7c839f">
                <div
                    class="startTime betTime w-160px! text-#000 time_show_box text-center"
                    :class="{ 'pl-10px text-left!': timeStart }"
                    @click="selectTime(1)"
                >
                    <span>{{ timeStart ? timeStart : "开始时间" }}</span>
                </div>
                <div class="to">至</div>
                <div
                    class="endTime betTime w-160px! text-#000 time_show_box text-center"
                    :class="{ 'pl-10px text-left!': timeEnd }"
                    @click="selectTime(2)"
                >
                    <span>{{ timeEnd ? timeEnd : "结束时间" }}</span>
                </div>
            </div>
            <div class="van-hairline--bottom">
                <van-field
                    class="bg-transparent leading-40px"
                    :border="false"
                    input-align="right"
                    v-model="winner"
                    :formatter="formatterStr"
                    clearable
                    type="digit"
                    label="中奖人数"
                    placeholder="输入中奖人数"
                    autocomplete="off"
                />
            </div>
            <div class="van-hairline--bottom">
                <van-field
                    class="bg-transparent leading-40px"
                    :border="false"
                    v-if="showPwdSet"
                    input-align="right"
                    v-model="password"
                    :formatter="formatterStr"
                    clearable
                    type="password"
                    label="房间密码"
                    placeholder="请设置房间密码"
                    autocomplete="off"
                />
            </div>

            <div class="hstack" :class="{ 'pr-16px': levelLimitStr.length }">
                <van-field
                    class="bg-transparent leading-40px"
                    :border="false"
                    v-if="showLeverSet"
                    input-align="right"
                    v-model="levelLimitStr"
                    :formatter="formatterStr"
                    label="等级限制"
                    placeholder="设置等级限制"
                    @click="openLevelPop"
                    autocomplete="off"
                />
                <van-icon
                    color="#c8c9cc"
                    size="16"
                    @click="
                        () => {
                            levelLimitStr = ''
                            selectedLevel = []
                        }
                    "
                    v-if="levelLimitStr.length"
                    name="clear"
                />
            </div>
            <!--添加饰品-->
            <section class="create_room_addItems section van-hairline--bottom van-hairline--top">
                <div class="section_top">
                    <h5 class="section_title font-bold">添加饰品</h5>
                    <div class="items_price_total">
                        总价值：
                        <span>￥{{ prices }}</span>
                    </div>
                </div>
                <div class="addItems_list">
                    <div class="items_box add_btn_box" @click="showCreateRoomMain = false">+</div>
                    <!--已选择的饰品-->
                    <div class="items_box" v-for="(item, index) in selectedRollItems" :key="index">
                        <img :src="item.icon_url" alt="" />
                        <div class="item_price">{{ item.price }}</div>
                        <div class="item_name van-ellipsis">{{ item.market_name }}</div>
                    </div>
                </div>
            </section>
            <!-- 创建 -->
            <div class="create_room_btn">
                <div class="w-345px mx-auto">
                    <van-button
                        :disabled="creBtnDis"
                        :loading="creBtnLoading"
                        @click="createRollRoom"
                        class="primary-btn h-30px leading-30px rounded-30px"
                        block
                    >
                        创建
                    </van-button>
                </div>
            </div>
        </div>
        <!--添加饰品-->
        <div class="expand-page text-#262933" v-show="!showCreateRoomMain">
            <van-tabs background="#e8f1ef" v-model:active="active">
                <van-tab :key="index" v-for="(item, index) in TYPE_NAV_LIST" :title="item.type"></van-tab>
            </van-tabs>
            <!--时间 价格 筛选-->
            <div class="item_filter_nav" v-if="prizeList.length">
                <van-checkbox @click="tapImg = false" @change="chooseAll" v-model="selectAll">全选</van-checkbox>
                <div
                    class="filter_nav_box by_price"
                    v-for="(item, index) in FILTER_TYPE_LIST"
                    :class="{ selected: index === filterTypeMode }"
                    :key="index"
                    @click="changeFilter(index === 0 || index === 1 ? index : 0)"
                >
                    <span
                        class="filter_icon"
                        :class="{
                            top: descType === 1,
                            bottom: descType === 0
                        }"
                    ></span>
                    <span>{{ item.name }}</span>
                </div>
            </div>
            <!--饰品列表-->
            <div class="package_item_list">
                <div class="package_no_data" v-show="!prizeList.length">
                    <img src="@/assets/img/template/july/package/no_data.png" alt="" />
                    <p>您的背包空空如也！</p>
                    <p>
                        前往
                        <router-link to="/package" class="to_package">我的背包</router-link>
                        添加饰品
                    </p>
                </div>
                <div class="roll_item_combox" v-show="prizeList.length">
                    <div
                        class="item_box"
                        :class="{ selected: item?.selected }"
                        @click="handleItemSelect(item)"
                        v-for="(item, index) in prizeList"
                        :key="index"
                    >
                        <img :src="item?.icon_url" alt="" />
                        <div class="item_price">{{ item.price }}</div>
                        <div class="item_name van-ellipsis">{{ item.market_name }}</div>
                        <div class="item_box_select_mask">
                            <img class="ab-center" src="@/assets/img/template/july/finance/icon-hook.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="create_room_btn">
                <div class="w-345px mx-auto">
                    <van-button @click="save" class="primary-btn h-30px leading-30px rounded-30px" block>保存</van-button>
                </div>
            </div>
        </div>
        <!-- 底部弹出日期 -->
        <van-popup @closed="onCancel" v-model:show="showBottom" position="bottom">
            <div v-if="showBottom">
                <van-picker-group title="请选择" :tabs="['选择日期', '选择时间']" @confirm="onConfirm" @cancel="onCancel">
                    <van-date-picker :formatter="formatterYMD" v-model="currentDate" :min-date="minDate" />
                    <van-time-picker :formatter="formatterHMS" v-model="currentTime" />
                </van-picker-group>
            </div>
        </van-popup>
        <!-- 底部弹出 -->
        <van-popup v-model:show="showLevelPop" position="bottom">
            <van-picker
                @confirm="confirmLevel"
                @cancel="showLevelPop = false"
                v-model="selectedLevel"
                title="等级限制"
                :columns="columns"
            >
                <template #columns-top>
                    <div class="date-box flex-center mt-10px h-30px leading-30px text-15px text-#7c839f">
                        <div class="startTime betTime w-100px! text-center">
                            <span>{{ typeof selectedLevel[0] === "number" ? selectedLevel[0] : "等级下限" }}</span>
                        </div>
                        <div class="to">至</div>
                        <div class="endTime betTime w-100px! text-center">
                            <span>{{ typeof selectedLevel[1] === "number" ? selectedLevel[1] : "等级上限" }}</span>
                        </div>
                    </div>
                </template>
            </van-picker>
        </van-popup>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/style/recordold.scss";
.createroll-page {
    .create_room_addItems {
        line-height: 1.6;
        padding: 0.18rem 0.12rem 0.1rem;
        overflow-x: hidden;
        margin-bottom: 0.7rem;
        .section_top {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 0.14rem;
            .section_title {
                font-size: 0.16rem;
            }
            .items_price_total {
                span {
                    color: #e34d12;
                }
            }
        }
        .addItems_list {
            margin-top: 0.06rem;
            margin-right: -0.06rem;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            .items_box {
                width: 0.83rem;
                height: 0.55rem;
                margin: 0.04rem 0.06rem 0.04rem 0;
                box-sizing: border-box;
                text-align: center;
                background-color: rgba(0, 0, 0, 0.4);
                position: relative;
                color: #fff;
                img {
                    height: 100%;
                    max-width: 100%;
                }
                .item_name,
                .item_price {
                    position: absolute;
                    height: 0.2rem;
                    line-height: 0.2rem;
                    background-color: rgba(0, 0, 0, 0.5);
                }
                .item_name {
                    width: 100%;
                    bottom: 0;
                    left: 0;
                    text-align: center;
                    box-sizing: border-box;
                    padding: 0 4px;
                }
                .item_price {
                    top: 0.03rem;
                    right: 0;
                    padding: 0 0.06rem 0 0.08rem;
                    border-top-left-radius: 0.3rem;
                    border-bottom-left-radius: 0.3rem;
                }
            }
            .add_btn_box {
                border: 1px dashed #7c839f;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.4rem;
                color: #27bc74;
                border-radius: 0.04rem;
                background: none;
            }
        }
    }
    .create_room_btn {
        position: fixed;
        z-index: 5;
        background: #e8f1ef;
        width: 100%;
        bottom: 0;
        box-sizing: border-box;
        padding: 0.15rem;
    }
    .package_item_list {
        margin-top: 0.1rem;
        padding: 0 0.12rem;
        overflow-x: hidden;
        overflow-y: auto;
        height: calc(100% - 1rem);

        .roll_item_combox {
            padding-bottom: 0.7rem;
            display: flex;
            flex-wrap: wrap;
            margin-right: -0.06rem;
        }
        .item_box {
            width: 1.13rem;
            height: 0.75rem;
            margin: 0.06rem 0.06rem 0.06rem 0;
            text-align: center;
            position: relative;
            color: #f5f5f5;
            background-color: rgba(0, 0, 0, 0.4);
            img {
                height: 100%;
                max-width: 100%;
            }
            .item_price {
                top: 0.03rem;
                right: 0;
                padding: 0 0.06rem 0 0.08rem;
                background-color: rgba(0, 0, 0, 0.5);
                border-top-left-radius: 0.3rem;
                border-bottom-left-radius: 0.3rem;
                position: absolute;
                height: 0.2rem;
                line-height: 0.2rem;
                font-size: 0.14rem;
            }
            .item_name {
                width: 100%;
                bottom: 0;
                left: 0;
                text-align: center;
                background-color: rgba(0, 0, 0, 0.5);
                padding: 0 4px;
                position: absolute;
                height: 0.2rem;
                line-height: 0.2rem;
                font-size: 0.14rem;
            }
            .item_box_select_mask {
                display: none;
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                text-align: center;
                background-color: rgba(0, 0, 0, 0.5);
                img {
                    width: 0.25rem;
                    height: 0.25rem;
                }
            }
            &.selected {
                .item_box_select_mask {
                    display: block;
                }
            }
        }
        .package_no_data {
            text-align: center;
            width: 100%;
            padding-top: 0.3rem;
            font-size: 0.14rem;
            color: #7c839f;
            img {
                width: 40%;
                margin-bottom: 0.2rem;
            }
            p {
                height: 0.4rem;
                line-height: 0.4rem;
                .to_package {
                    line-height: normal;
                    display: inline-block;
                    vertical-align: middle;
                    padding: 0.06rem 0.08rem;
                    border: 1px solid #7c839f;
                    border-radius: 0.3rem;
                    margin: 0 0.05rem;
                }
            }
        }
    }
    .item_filter_nav {
        padding: 0.1rem 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #7c839f;
        font-size: 0.16rem;
        height: 0.26rem;
        .filter_nav_box {
            .filter_icon {
                display: inline-block;
                width: 12px;
                height: 4px;
                vertical-align: middle;
                position: relative;
                margin-right: 0.06rem;
                &:after,
                &:before {
                    content: "";
                    border: 5px solid transparent;
                    position: absolute;
                    left: 0;
                }
                &:after {
                    border-top-color: #7c839f;
                    top: 4px;
                }
                &:before {
                    border-bottom-color: #7c839f;
                    bottom: 4px;
                }
            }
            &.selected {
                color: #262933;
                .filter_icon {
                    &.top {
                        &:before {
                            border-bottom-color: #07f1b7;
                        }
                    }
                    &.bottom {
                        &:after {
                            border-top-color: #07f1b7;
                        }
                    }
                }
            }
        }
    }
}
</style>
