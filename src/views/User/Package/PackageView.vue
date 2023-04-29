<script setup lang="ts">
import LoadingSvga from "@/assets/svga/delivery.svga?url"
import DialogRedbag from "./DialogRedbag.vue"
import DialogAddress from "./DialogAddress.vue"
import ApiSetting from "@/api/service"
import { checkUrl } from "@/composable/validate"
import { formatNumberSplit } from "@/utils/numberUtils"
import { usePlaceImg } from "@/utils/globalImgs"
import { ref, computed, watch, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { useSysStore } from "@/stores/system"
import { useFreshStore } from "@/stores/fresh"
import { showToast } from "vant"
import type { CheckboxGroupInstance } from "vant"
import type { UserSteamGetUserPackage } from "@/api/pojo/UserSteamGetUserPackage"
import type { UserSteamGetSteamStock, ListItem } from "@/api/pojo/UserSteamGetSteamStock"
import type { UserSteamPackageToSteam } from "@/api/pojo/UserSteamPackageToSteam"
import { HttpPlus } from "@/api/HttpPlus"
import type { UserSteamSteamToPackage } from "@/api/pojo/UserSteamSteamToPackage"
import type { UserSteamGetSteamTradeStatus } from "@/api/pojo/UserSteamGetSteamTradeStatus"
import type { UserSteamGetUserSteamInfo } from "@/api/pojo/UserSteamGetUserSteamInfo"
import type { IndexGetUserInfo } from "@/api/pojo/IndexGetUserInfo"

const freshStore = useFreshStore()
const systemParams = useSysStore()
const router = useRouter()
const { lazyGoods } = usePlaceImg()

// 仅userInfo.uuid存在时展示，切换会自动改变gameTypeList
const pageNavList = [
    { id: 1, name: "我的背包" },
    { id: 2, name: "Steam库存" },
    { id: 3, name: "交易URL设置" }
] as const

const isShowFixedCar = ref(false)
const activeType = ref<0 | typeof pageNavList[number]["id"]>(0)

// 实际展示的分类
const gameTypeListTabs = [
    { id: 0, name: "待处理" },
    { id: 570, name: "DOTA2" },
    { id: 730, name: "CSGO" }
] as const

const gameTypeList = computed(() => {
    if (activeType.value === 0) {
        return gameTypeListTabs
    }
    if (activeType.value === 1) {
        return gameTypeListTabs.slice(1, gameTypeListTabs.length)
    }
    return []
})

const active = ref<typeof gameTypeListTabs[number]["id"]>(0)

const userQuoteList = ref<UserSteamPackageToSteam["data"]>([])
const steamQuoteList = ref([])
const checked = ref<ListItem["id"][]>([])
const selectAll = ref(false)
const chooseItem = ref<Partial<ListItem>>({})
const showRight = ref(false)
const showType = ref("discount")
const checkboxGroupRef = ref<CheckboxGroupInstance | null>(null)

freshStore.resetList()

type FreshStoreList = UserSteamGetUserPackage["list"] | UserSteamGetSteamStock["list"]

const freshStoreList = ref<FreshStoreList>([])

const quoteList = computed(() => {
    if (activeType.value === 0) {
        return userQuoteList.value
    }
    if (activeType.value === 1) {
        return steamQuoteList.value
    }
    return []
})

const choose = (item: { id: ListItem["id"] }): void => {
    if (gameId.value != 0) return
    if (!checked.value[0]) {
        checked.value = []
    } else {
        const arr: ListItem["id"][] = []
        arr.push(item.id)
        checked.value = arr
    }
}

const tapSelectAll = (checked: boolean): void => {
    checkboxGroupRef.value[1]?.toggleAll(checked)
}

//分类下的id
const gameId = computed(() => {
    return gameTypeList.value[active.value]?.id ?? 0
})

// 折现
const discounting = (): void => {
    if (!checked.value.length) {
        showToast({
            className: "vk-toast-fail",
            message: "请先选择实物",
            icon: "warning"
        })
        return
    }
    if (checked.value.length > 1) {
        showToast({
            className: "vk-toast-fail",
            message: "只能选择单个物品折现",
            icon: "warning"
        })
        return
    }

    const list = freshStore.list as ListItem[]
    const item = list.find((item) => item.id === checked.value[0])
    if (item?.can_change != 1) {
        showToast({
            className: "vk-toast-fail",
            message: "此物品不能折现",
            icon: "warning"
        })
        return
    }
    chooseItem.value = item
    showType.value = "discount"
    showRight.value = true
}

const discountBtnLoading = ref(false)

// 确认折现
const toDiscounting = async (): Promise<void> => {
    if (checked.value.length) {
        discountBtnLoading.value = true
        HttpPlus.setUrlOptions(ApiSetting.user.itemExchange)
        const res = await HttpPlus.sendHttpRequest<{}, { id: ListItem["id"] }>({
            id: checked.value[0]
        })
        discountBtnLoading.value = false

        if (res.status === 1) {
            showRight.value = false
            finish()
            showToast({
                className: "vk-toast-success",
                message: "折现成功",
                icon: "checked"
            })
            chooseItem.value = {}
        }
    }
}

const userInfo = systemParams.userInfo as IndexGetUserInfo

// 取出
const handlePackageToSteam = async (): Promise<void> => {
    if (!userInfo.uuid) {
        showToast({
            className: "vk-toast-fail",
            message: "您还未绑定Steam",
            icon: "warning"
        })
        return
    }
    if (!checked.value.length) {
        showToast({
            className: "vk-toast-fail",
            message: "请至少选择一个饰品",
            icon: "warning"
        })
        return
    }

    HttpPlus.setUrlOptions(ApiSetting.user.packageToSteam)
    const res = await HttpPlus.sendHttpRequest<UserSteamPackageToSteam["data"], { ids: string }>({
        ids: checked.value.join(",")
    })

    if (res.status === 1) {
        userQuoteList.value = res.data
        userQuoteListInit(1, res.data)
    }
}

const userQuoteListInit = <T extends { tradeofferid: number; url: string }[]>(type: number, list: T): void => {
    list.forEach(async (item: T[number]) => {
        HttpPlus.setUrlOptions(ApiSetting.user.checkSteamTradeStatus)
        const res = await HttpPlus.sendHttpRequest<UserSteamGetSteamTradeStatus, { trade_id: number }>({
            trade_id: item.tradeofferid
        })

        if (res.status === 1) {
            if (res.data.is_cancel == 1 || res.data.is_success == 1) {
                if (type === 1) {
                    userQuoteList.value.forEach(function (v: UserSteamPackageToSteam["data"][number], i: number) {
                        if (item.tradeofferid === v.tradeofferid) {
                            userQuoteList.value.splice(i, 1)
                        }
                    })
                    if (res.data.is_success == 1) {
                        loadPackageData()
                    }
                }
                if (type === 2) {
                    steamQuoteList.value = []
                    if (res.data.is_success == 1) {
                        loadStreamData()
                    }
                }
            }
            if (res.data.is_confirm == 1) {
                item.url = res.data.url
                if (type === 1) {
                    userQuoteList.value.sort()
                }
                if (type === 2) {
                    steamQuoteList.value.sort()
                }
            }
        }
    })
}

// 存入
const handleSteamToPackage = async (): Promise<void> => {
    if (!checked.value.length) {
        showToast({
            className: "vk-toast-fail",
            message: "请至少选择一个饰品",
            icon: "warning"
        })
        return
    }

    const params = {
        ids: checked.value.join(","),
        game_id: gameId.value
    }
    HttpPlus.setUrlOptions(ApiSetting.user.steamToPackage)
    const res = await HttpPlus.sendHttpRequest<UserSteamSteamToPackage["data"], typeof params>(params)
    if (res.status === 1) {
        steamQuoteList.value = res.data
        userQuoteListInit(1, res.data)
    }
}

const showRed = ref(false)
const redBagMoney = ref(0)
// 打开
const openRed = async (): Promise<void> => {
    if (!checked.value.length) {
        showToast({
            className: "vk-toast-fail",
            message: "请先选择物品",
            icon: "warning"
        })
        return
    }

    const list = freshStore.list as ListItem[]
    const item = list.find((item) => item.id === checked.value[0])
    if (!("can_open" in item) || !item?.can_open) {
        showToast({
            className: "vk-toast-fail",
            message: "此物品不可打开",
            icon: "warning"
        })
        return
    }
    // is_money: 3， 虚拟物品
    if (item?.is_money === 3) {
        // 添加平台账号
        systemParams.routeParams = { deStatus: "account", ...item }
        router.push("/packageAddress")
    } else {
        HttpPlus.setUrlOptions(ApiSetting.user.openPackage)
        const res = await HttpPlus.sendHttpRequest<{}, { id: number }>({ id: checked.value[0] })

        if (res.status === 1) {
            if (item.is_money === 2) {
                showToast({
                    className: "vk-toast-success",
                    message: res.message,
                    icon: "checked"
                })
            } else {
                showRed.value = true
            }
            finish()
            redBagMoney.value = item.money
        }
    }
}

const finish = (): void => {
    const list = freshStore.list as { id: number }[]
    const index = list.findIndex((item) => item.id === checked.value[0])
    freshStore.list.splice(index, 1)
    checked.value = []
}

// 绑定steam
const handleToBindSteam = (): void => {
    window.open("/steam", "_blank")
}

const showAddressDio = ref(false)
// 快递到家
const sendHome = async (): Promise<void> => {
    if (!checked.value.length) {
        showToast({
            className: "vk-toast-fail",
            message: "请先选择实物",
            icon: "warning"
        })
        return
    }
    if (checked.value.length > 1) {
        showToast({
            className: "vk-toast-fail",
            message: "只能选择单个物品",
            icon: "warning"
        })
        return
    }

    const list = freshStore.list as ListItem[]
    const item = list.find((item) => item.id === checked.value[0])
    if (!item?.can_delivery) {
        showToast({
            className: "vk-toast-fail",
            message: "此物品不支持快递",
            icon: "warning"
        })
        return
    }
    await freshStore.checkAddress()
    if (!freshStore.userAddress) {
        // 首次添加地址
        systemParams.routeParams = { deStatus: "add", id: checked.value[0] }
        router.push("/packageAddress")
    } else {
        // 以前填写过地址
        showAddressDio.value = true
    }
}

const loadPageData = (): void => {
    if (activeType.value === 0) {
        // 当前在我的背包大类中切换
        freshStore.resetList()
        freshStoreList.value = []
        loadPackageData()
    }
    if (activeType.value === 1) {
        // 当前在Steam库存大类中切换
        freshStore.resetList()
        freshStoreList.value = []
        loadStreamData()
    }
}

const steamJumpUrl = ref("")
const steamTradeUrl = ref("")

const loadSteamInfo = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.user.getUserSteamInfo)
    const res = await HttpPlus.sendHttpRequest<UserSteamGetUserSteamInfo>()
    if (res.status === 1) {
        steamJumpUrl.value = res.data.steam_url
        steamTradeUrl.value = res.data.trade_url
    }
}

const urlLoading = ref(false)

const handleSetSteamTradeUrl = async (): Promise<void> => {
    if (checkUrl(steamTradeUrl.value)) return

    urlLoading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.user.setSteamTradeUrl)
        const res = await HttpPlus.sendHttpRequest<{}, { url: string }>({
            url: steamTradeUrl.value
        })

        urlLoading.value = false
        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: res.message,
                icon: "checked"
            })
        }
    } catch (error: unknown) {
        urlLoading.value = false
        console.error(error)
    }
}

watch(activeType, (val: 0 | typeof pageNavList[number]["id"]) => {
    if (val === 0) {
        freshStore.resetList()
        freshStoreList.value = []
        loadPackageData()
    }
    if (val === 1) {
        freshStore.resetList()
        freshStoreList.value = []
        loadStreamData()
    }
    if (val === 2) {
        loadSteamInfo()
    }
})

watch(active, () => {
    loadPageData()
})

/**
 * 下拉刷新
 */
const onRefresh = (): void => {
    freshStore.resetList()
    freshStoreList.value = []
    if (activeType.value === 0) {
        loadPackageData()
    }
    if (activeType.value === 1) {
        loadStreamData()
    }
}

const lazyLoadList = (): void => {
    if (activeType.value === 0) {
        loadPackageData()
    }
    if (activeType.value === 1) {
        loadStreamData()
    }
}

// 请求背包
const loadPackageData = async (): Promise<void> => {
    const params = {
        game_id: gameId.value
    }

    freshStore.listLoading = true
    await freshStore.getList<UserSteamGetUserPackage, typeof params>({
        url: ApiSetting.user.getUserPackage,
        params,
        limit: true
    })

    freshStoreList.value = freshStore.list as UserSteamGetUserPackage["list"]
}
// 请求stream
const loadStreamData = async (): Promise<void> => {
    freshStore.listLoading = true

    const params = { game_id: gameId.value }

    await freshStore.getList<UserSteamGetSteamStock, typeof params>({
        url: ApiSetting.user.getSteamStock,
        params,
        limit: true
    })

    freshStoreList.value = freshStore.list as UserSteamGetSteamStock["list"]
}

onBeforeUnmount(() => {
    freshStore.resetList()
    freshStoreList.value = []
})
</script>

<template>
    <div class="package-page bg-light-green">
        <HeaderBar :class="{ 'header-wide': isShowFixedCar }">
            <div class="header_title">我的背包</div>
            <template #right>
                <!-- 小车动效 -->
                <div class="top-icon overflow-hidden">
                    <SvgaPlayer
                        v-if="!isShowFixedCar"
                        @click="router.push(`/deliveryInfo`)"
                        class="ab-center w-55px h-44px left--2px"
                        :url="LoadingSvga"
                        :loop="1.5"
                        @finish="isShowFixedCar = true"
                        @svgaError="isShowFixedCar = true"
                    />
                </div>
                <div v-if="isShowFixedCar" @click="router.push(`/deliveryInfo`)" class="top-icon delivery_icon"></div>
                <div @click="router.push(`/packagelog`)" class="top-icon log_icon"></div>
            </template>
        </HeaderBar>

        <div class="expand-page font-classic">
            <van-tabs
                v-if="userInfo.uuid"
                class="van-hairline--bottom fixed! top-0.44rem w-full z-10"
                v-model:active="activeType"
                background="#e8f1ef"
                :ellipsis="false"
            >
                <van-tab v-for="(tab, i) in pageNavList" :key="i" :title="tab.name"></van-tab>
            </van-tabs>
            <div class="list" :class="{ 'pt-44px': userInfo.uuid }">
                <!-- 交易URL设置 -->
                <div v-if="activeType === 2">
                    <div class="py-10px px-12px text-#7c839f text-14px leading-relaxed">
                        <div class="trade_url_tips">
                            请将Steam官网的个人交易URL填写到下方输入框，并点击保存。
                            <a class="text-#262933" :href="steamJumpUrl" target="_blank">点击查看Steam交易URL</a>
                        </div>
                        <div class="trade_url_save_box mt-20px">
                            <div class="title">Steam交易URL</div>
                            <textarea v-model="steamTradeUrl"></textarea>
                        </div>
                        <div class="save_steam_url mt-20px">
                            <van-button
                                :disabled="!steamTradeUrl"
                                :loading="urlLoading"
                                @click="handleSetSteamTradeUrl"
                                class="button_primary_2022 rounded-30px! border-none h-30px! leading-30px! text-15px!"
                                rounded
                                block
                            >
                                保存修改
                            </van-button>
                        </div>
                    </div>
                </div>
                <!-- 我的背包、Steam库存 -->
                <div v-else>
                    <van-tabs
                        sticky
                        :offset-top="userInfo.uuid ? '0.88rem' : '0.44rem'"
                        v-model:active="active"
                        background="#e8f1ef"
                        :ellipsis="false"
                    >
                        <van-tab v-for="(tab, i) in gameTypeList" :key="i" :title="tab.name">
                            <PullRefresh @on-refresh="onRefresh">
                                <div class="inner_list">
                                    <div class="quote_list">
                                        <div
                                            class="quote_list_box hstack py-10px px-12px whitespace-nowrap leading-normal text-12px text-#7c839f"
                                            v-for="(item, index) in quoteList"
                                            :key="index"
                                        >
                                            <div class="img_box w-45px h-45px text-center">
                                                <img
                                                    class="max-w-45px max-h-45px rounded-1/2"
                                                    v-lazy="{
                                                        src: item?.robot_img,
                                                        error: lazyGoods,
                                                        loading: lazyGoods
                                                    }"
                                                    alt=""
                                                />
                                            </div>
                                            <div class="quote_content ml-5px w-206px hstack flex-wrap">
                                                <div class="quote_info hstack text-16px whitespace-nowrap h-25px leading-25px">
                                                    <div class="quote_name text-#262933 w-80px van-ellipsis">
                                                        {{ item?.account }}
                                                    </div>
                                                    <div class="quote_code text-#27bc74 ml-10px w-116px">
                                                        安全码:
                                                        <span>{{ item?.safe_code }}</span>
                                                    </div>
                                                </div>
                                                <p class="quote_tips leading-20px" v-if="item.url">
                                                    报价发送成功，300秒内未处理自动取消
                                                </p>
                                            </div>
                                            <div
                                                class="quote_btn w-80px h-36px leading-36px text-center ml-5px hstack h-full"
                                                :class="{
                                                    'primary-btn ml-15px! rounded-30px': item.url
                                                }"
                                            >
                                                <p class="block mx-auto" v-if="!item.url">交易报价排队中...</p>
                                                <router-link
                                                    class="block mx-auto text-#262933 text-14px font-bold"
                                                    :to="item.url"
                                                    v-else
                                                >
                                                    前往处理
                                                </router-link>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="list_content pl-22px pb-44px">
                                        <ListLazy
                                            :finishedText="!freshStore.listLoading && !freshStore.list.length ? '' : '没有更多了'"
                                            @load="lazyLoadList"
                                        >
                                            <van-checkbox-group
                                                ref="checkboxGroupRef"
                                                v-if="freshStore.list && freshStore.list.length"
                                                v-model="checked"
                                                :max="gameId === 0 ? 1 : 0"
                                            >
                                                <van-checkbox
                                                    @click="choose(item)"
                                                    :name="item.id"
                                                    :key="i"
                                                    v-for="(item, i) in freshStoreList"
                                                    class="mt-16px"
                                                >
                                                    <div
                                                        class="flex w-311px van-hairline--bottom pb-10px h-80px overflow-hidden relative"
                                                    >
                                                        <div class="img_box h-70px w-105px flex-center relative">
                                                            <div
                                                                v-if="'expire_days' in item && item.expire_days"
                                                                class="time-block hstack absolute top-0 left-0 w-full h-15px pl-4px text-white"
                                                            >
                                                                <img
                                                                    class="time-img w-10px h-10px"
                                                                    src="~@/assets/img/template/july/package/time.png"
                                                                    alt=""
                                                                />
                                                                <div class="time-text">
                                                                    {{ "expire_days" in item && item.expire_days }}天
                                                                </div>
                                                            </div>
                                                            <img
                                                                class="max-h-70px max-w-105px"
                                                                v-lazy="{
                                                                    src: item?.icon_url,
                                                                    error: lazyGoods,
                                                                    loading: lazyGoods
                                                                }"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div class="item_info ml-10px text-#7c839f text-14px">
                                                            <div
                                                                class="item_name text-16px h-25px leading-25px text-#262933 max-w-205px van-ellipsis"
                                                            >
                                                                {{ "market_name" in item ? item.market_name : "" }}
                                                            </div>
                                                            <div
                                                                class="item_price mt-5px h-20px leading-20px"
                                                                :style="
                                                                    ((activeType === 0 && !item.can_change) ||
                                                                        (activeType === 1 &&
                                                                        Number(item?.money) != 0 &&
                                                                        'is_expire' in item
                                                                            ? item?.is_expire === 1
                                                                            : 0)) &&
                                                                    'visibility: hidden'
                                                                "
                                                            >
                                                                本站折现：
                                                                <span text="#e34d12">
                                                                    ￥{{ item.tmoney || ("fmoney" in item ? item.fmoney : 0) }}
                                                                </span>
                                                            </div>
                                                            <div class="item_price_steam h-20px leading-20px">
                                                                市场估价：
                                                                <span class="line-through">
                                                                    ￥{{ formatNumberSplit("price" in item ? item.price : 0) }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </van-checkbox>
                                            </van-checkbox-group>
                                        </ListLazy>
                                    </div>
                                    <van-loading v-if="freshStore.listLoading" color="#444" class="ab-center" type="spinner" />
                                    <div
                                        class="package_no_data text-center"
                                        v-if="!freshStore.listLoading && !freshStore.list.length"
                                    >
                                        <img class="w-60% mt-100px" src="@/assets/img/template/july/package/no_data.png" alt="" />
                                    </div>
                                </div>
                            </PullRefresh>
                        </van-tab>
                    </van-tabs>
                    <!-- 底部按钮 -->
                    <div
                        class="package_bottom fixed bg-#e8f1ef bottom-0 left-0 w-full hstack h-42px text-#7c839f"
                        v-if="activeType !== 3"
                    >
                        <div class="btn_box right-border flex-center" v-if="gameId != 0 && freshStore.list.length">
                            <van-checkbox @change="tapSelectAll" v-model="selectAll">全选</van-checkbox>
                        </div>
                        <div class="btn_box right-border" v-if="activeType === 0 && freshStore.list.length" @click="discounting">
                            折现
                        </div>
                        <div
                            class="btn_box"
                            v-if="activeType === 0 && userInfo.uuid && gameId != 0 && freshStore.list.length"
                            @click="handlePackageToSteam"
                        >
                            取出
                        </div>
                        <div class="btn_box" v-if="activeType === 0 && !userInfo.uuid && gameId != 0" @click="handleToBindSteam">
                            绑定Steam
                        </div>
                        <div class="btn_box" v-if="activeType === 1 && freshStore.list.length" @click="handleSteamToPackage">
                            存入
                        </div>
                        <div
                            class="btn_box right-border"
                            v-if="activeType === 0 && gameId == 0 && freshStore.list.length"
                            @click="openRed"
                        >
                            打开
                        </div>
                        <div
                            class="btn_box text-#00bf6d"
                            v-if="activeType === 0 && gameId == 0 && freshStore.list.length"
                            @click="sendHome"
                        >
                            快递到家
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 右侧弹出/折现 -->
        <van-popup v-model:show="showRight" position="right" :style="{ width: '100%', height: '100%', background: '#e8f1ef' }">
            <HeaderBar>
                <div class="header_title" v-if="showType === 'discount'">折现</div>
            </HeaderBar>
            <div class="inner_page_body text-center">
                <div class="redeem_tips text-10px text-#7c839f py-24px px-18px leading-relaxed text-left">
                    亲爱的威客会员：
                    <br />
                    <!-- steam物品 -->
                    <template v-if="chooseItem.game_id > 0">
                        由于物品价格在市场中波动频繁，本站的折现服务主体是免费赠与用户奖品，价格将会低于市场估价结算。如果您不接受本站的折现价格，对应的奖品可选择取回三方背包。
                    </template>
                    <!-- 实物 -->
                    <template v-if="chooseItem.game_id == 0 && chooseItem.is_virtual == 0">
                        由于物品价格在市场中波动频繁，本站的折现服务主体是免费赠与用户奖品，价格将会低于市场估价结算。如果您不接受本站的折现价格，对应的奖品可选择快递到家。
                    </template>
                    <!-- 虚拟物品 -->
                    <template v-if="chooseItem.game_id == 0 && chooseItem.is_virtual == 1">
                        由于物品价格在市场中波动频繁，本站的折现服务主体是免费赠与用户奖品，价格将会低于市场估价结算。
                    </template>
                </div>
                <img
                    class="max-h-160px mb-20px"
                    v-lazy="{
                        src: chooseItem?.icon_url,
                        error: lazyGoods,
                        loading: lazyGoods
                    }"
                    alt=""
                />
                <div class="content_right text-12px text-#7c839f leading-relaxed">
                    <h3 class="font-bold text-15px text-#262933 break-words mx-20px">
                        {{ chooseItem.name }}
                    </h3>
                    <div>
                        市场估价：￥
                        <em class="text-15px">{{ chooseItem.money }}</em>
                    </div>
                    <!-- 只有steam物品展示溢价 -->
                    <div v-if="chooseItem.game_id > 0">
                        {{ chooseItem.discount }}%溢价：￥
                        <em class="text-15px">{{ chooseItem.discount_money }}</em>
                    </div>
                    <div>
                        本站折现价：
                        <em class="text-#e34d12 text-15px">￥{{ chooseItem.tmoney }}</em>
                    </div>
                </div>
                <div class="w-325px translate-x--1/2 left-50% h-40px leading-40px text-#262933 absolute bottom-40px">
                    <van-button
                        block
                        :loading="discountBtnLoading"
                        @click="toDiscounting"
                        class="primary-btn rounded-20px text-17px"
                    >
                        确认折现
                    </van-button>
                </div>
            </div>
        </van-popup>
        <!-- 打开红包 -->
        <DialogRedbag :money="redBagMoney" :showRed="showRed" @close="showRed = false" />
        <!-- 是否继续使用上次收货地址 -->
        <DialogAddress :show="showAddressDio" :id="checked[0]" @close="showAddressDio = false" @loadpackage="loadPageData" />
    </div>
</template>

<style lang="scss" scoped>
.com-header.header-wide {
    :deep(.header-left) {
        width: 63px;
    }
}
.list {
    position: relative;
    min-height: calc(100vh - 88px);
    min-height: calc(var(--vh) * 100 - 88px);
}
.inner_list {
    position: relative;
    min-height: calc(100vh - 132px);
    min-height: calc(var(--vh) * 100 - 132px);
    .time-block {
        background-image: linear-gradient(to right, #181819, rgba(24, 24, 25, 0.01));
        .time-text {
            font-size: 0.2rem;
            transform: scale(0.5);
            transform-origin: 0 center;
            margin-left: 0.04rem;
        }
    }
}
.list_content {
    .van-checkbox-group {
        .van-checkbox {
            justify-content: space-between;
        }
    }
}
.trade_url_save_box {
    textarea {
        border: none;
        box-sizing: border-box;
        background-color: #c6d0db;
        width: 100%;
        height: 0.84rem;
        color: #262933;
        padding: 0.1rem 0.08rem;
        margin-top: 0.1rem;
        resize: none;
    }
}
.package_bottom {
    .btn_box {
        flex: 1;
        text-align: center;
        height: 100%;
        font-size: 18px;
        line-height: 42px;
        border-top: solid 1px #c6d0db;
        &.right-border {
            border-right: solid 1px #c6d0db;
        }
    }
}
</style>
