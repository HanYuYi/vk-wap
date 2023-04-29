<script setup lang="ts">
import { formatNumberSplit } from "@/utils/numberUtils"
import ApiSetting from "@/api/service"
import { ref } from "vue"
import { useRoute } from "vue-router"
import type { RouteLocationNormalizedLoaded } from "vue-router"
import { useSysStore } from "@/stores/system"
import { useFreshStore } from "@/stores/fresh"
import { useWalletStore } from "@/stores/wallet"
import { usePlaceImg } from "@/utils/globalImgs"
import { showToast } from "vant"
import { HttpPlus } from "@/api/HttpPlus"
import type { VmallGetGoodsType } from "@/api/pojo/VmallGetGoodsType"
import type { ListItem } from "@/api/pojo/VmallGetGoodsList"
import type { VmallGetGoodsList } from "@/api/pojo/VmallGetGoodsList"
import type { VmallConvertGoods } from "@/api/pojo/VmallConvertGoods"

const { lazyGoods } = usePlaceImg()

const systemParams = useSysStore()
const walletStore = useWalletStore()
const freshStore = useFreshStore()
const route: RouteLocationNormalizedLoaded = useRoute()

const showBottom = ref(false)
const activeKey = ref(0)

type TypesList = VmallGetGoodsType["types"]
type TypesItem = TypesList[number] & { list?: ListItem[] }

const typesList = ref<Array<TypesItem>>([])
const listLoading = ref(false)

// 获取奖品
const getGoods = async (isReset: boolean = false): Promise<void> => {
    listLoading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.getGoodsList)
        const res = await HttpPlus.sendHttpRequest<VmallGetGoodsList>()
        listLoading.value = false

        if (res.status === 1 && res.data) {
            // 解决兑换时数据重复
            if (isReset) {
                typesList.value.forEach((type: TypesItem) => {
                    type.list = []
                })
            }

            const disCount: ListItem[] = res.data.list.filter((item: ListItem) => item.can_discount === 1)

            typesList.value.forEach((type: TypesItem, index: number) => {
                if (index === 0) {
                    type.list = [...res.data.list]
                } else if (index === typesList.value.length - 1 && disCount.length) {
                    type.list = disCount
                } else {
                    res.data.list.forEach((item: ListItem) => {
                        if (type.type_id === item.type_id) {
                            type.list.push(item)
                        }
                    })
                }
            })
        }
    } catch (error: unknown) {
        listLoading.value = false
        throw error
    }
}

// 获取分类
const getTypes = async (): Promise<void> => {
    systemParams.PageLoading = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.getGoodsType)
        const res = await HttpPlus.sendHttpRequest<VmallGetGoodsType>()
        systemParams.PageLoading = false

        if (res.status === 1 && res.data) {
            typesList.value = res.data.types.map((item: any) => {
                return { ...item, list: [] }
            })
            if (route.query.type) {
                activeKey.value = Number(route.query.type)
            }
            if (res.data.is_login) {
                walletStore.getUserVbMoney()
            }
            getGoods()
        }
    } catch (e: unknown) {
        systemParams.PageLoading = false
        throw e
    }
}

/**
 * 下拉刷新
 */
const onRefresh = async (): Promise<void> => {
    try {
        await getTypes()
        freshStore.refreshLoading = false
    } catch (error) {
        freshStore.refreshLoading = false
    }
}

// 判断是不是特殊商品，是的话，name和url使用接口返回的
const isSpeclGood = (item: VmallConvertGoods): VmallConvertGoods["jump_tips"] => {
    return item.jump_url && item.jump_tips
}

// 计算VB兑换按钮是否置灰
const vbExBtnDisable = (item: ListItem): boolean => {
    if (systemParams.isLogin) {
        if (walletStore.userVbMoney < item.convert_price) {
            showToast({
                className: "vk-toast-fail",
                message: "您的V币数量不足",
                icon: "warning"
            })
            return true
        }
        if ("user_lever" in systemParams.userInfo && systemParams.userInfo.user_lever < item.need_level) {
            showToast({
                className: "vk-toast-fail",
                message: "当前等级不足，不可领取",
                icon: "warning"
            })
            return true
        }
        // 不是S12选票/世界杯选票等特殊商品，页面左边的兑换次数为0时，所有普通商品兑换按钮置灰
        if (!item.spec_goods && "vmall_day_times" in systemParams.userInfo && systemParams.userInfo.vmall_day_times == 0) {
            showToast({
                className: "vk-toast-fail",
                message: "今日兑换次数已用完，请明日再来",
                icon: "warning"
            })
            return true
        }
        // 是S12/世界杯等特殊商品，看单个商品的兑换次数是否是0
        if (item.spec_goods && item.spec_times == 0) {
            showToast({
                className: "vk-toast-fail",
                message: "当前商品兑换次数已用完",
                icon: "warning"
            })
            return true
        }
        return false
    }
    return false
}

const exchangeBeforeDio = ref(false)
const preGoods = ref<Partial<ListItem>>({})
// 点击了商品格子
const tapGood = (item: ListItem): void => {
    if (!systemParams.isLogin) {
        showToast({
            className: "vk-toast-fail",
            message: "请您先登录",
            icon: "warning"
        })
        return
    }
    // 按钮置灰直接返回
    if (vbExBtnDisable(item)) {
        return
    }
    // 次数不够,-1是无限次
    if (
        (!item.spec_goods && "vmall_day_times" in systemParams.userInfo && systemParams.userInfo.vmall_day_times == 0) ||
        (item.spec_goods && item.spec_times == 0)
    ) {
        showToast({
            className: "vk-toast-fail",
            message: "本日兑换次数已用完，请明日再来。",
            icon: "warning"
        })
        return
    }
    preGoods.value = item
    exchangeBeforeDio.value = true
}

const conversionGoodsInfo = ref<Partial<VmallConvertGoods>>({})
const showDialog = ref(false)
const conveResult = ref<"cash" | "entity">("cash")

const reset = (): void => {
    conveResult.value = "cash"
    conversionGoodsInfo.value = {}
}

// 确认兑换
const confirm = async (): Promise<void> => {
    exchangeBeforeDio.value = false
    if (preGoods.value.goods_id) {
        HttpPlus.setUrlOptions(ApiSetting.convertGoods)
        const res = await HttpPlus.sendHttpRequest<VmallConvertGoods, { goods_id: number }>({
            goods_id: preGoods.value.goods_id
        })
        getGoods(true)
        if (res.status === 1 && res.data) {
            if (typeof res.data.level === "number" && "user_lever" in systemParams.userInfo) {
                systemParams.userInfo.user_lever = res.data.level
            }
            conversionGoodsInfo.value = res.data
            walletStore.getUserVbMoney()
            if (res.data.is_cash === 1) {
                conveResult.value = "cash"
                showDialog.value = true
            } else {
                conveResult.value = "entity"
                showDialog.value = true
            }
        }
    }
}

getTypes()
</script>

<template>
    <div class="vbmarket-page bg-mypageColor">
        <HeaderBar @tolog="showBottom = true">
            <div class="header_title">V币商城</div>
        </HeaderBar>
        <div class="expand-page w-full relative">
            <van-tabs
                ref="tabs"
                class="vbmarket-tabs"
                v-model:active="activeKey"
                v-if="typesList.length"
                animated
                sticky
                swipeable
                offset-top="0.44rem"
                background="#ffffff"
            >
                <van-tab title-class="px-26px!" :title="type?.type_name" :name="key" v-for="(type, key) in typesList" :key="key">
                    <PullRefresh @on-refresh="onRefresh">
                        <div class="list flex flex-wrap justify-center relative" :class="{ list_login: systemParams.isLogin }">
                            <van-loading v-if="listLoading" class="ab-center" type="spinner" />
                            <div
                                class="item-good px-10px"
                                @click="tapGood(item)"
                                v-for="(item, index) in type.list ?? []"
                                :key="index"
                                v-else
                            >
                                <!-- 倒计时 -->
                                <div class="countdown-wrapper absolute top-0 left-0" v-if="item.show_last_text">
                                    <span class="time">{{ item.show_last_text }}</span>
                                </div>
                                <!-- 商品图片 -->
                                <img
                                    class="max-h-66.5px mx-auto block mt-27px"
                                    v-lazy="{
                                        src: item.goods_pic,
                                        error: lazyGoods,
                                        loading: lazyGoods
                                    }"
                                    alt=""
                                />
                                <!-- vip等级 -->
                                <div class="vip-wrapper mt-9px mx-auto h-20px leading-18px px-5px rounded-20px">
                                    <img class="w-8px h-8px mr-1px" src="@/assets/img/template/july/vbmarket/larger.png" alt="" />
                                    <span class="vip-text">VIP{{ item.need_level }}</span>
                                </div>
                                <!-- 商品名字 -->
                                <div class="hstack mt-12px">
                                    <!-- 免费 -->
                                    <div
                                        v-if="item.new_discount_percent"
                                        class="free-wrapper"
                                        :class="{
                                            discount: item.new_discount_percent != '免费'
                                        }"
                                    >
                                        {{ item.new_discount_percent }}
                                    </div>
                                    <!-- 名称 -->
                                    <div
                                        class="ml-5px text-14px font-bold van-ellipsis max-w-110px"
                                        :class="{ 'max-w-full! ml-0!': !item.new_discount_percent }"
                                        v-if="item.goods_name"
                                    >
                                        {{ item.goods_name }}
                                    </div>
                                </div>
                                <!-- 商品价格 -->
                                <div class="hstack mt-8px font-robot">
                                    <img class="w-16px h-16px" src="@/assets/img/template/july/vbmarket/vb.png" alt="" />
                                    <div class="leading-20px ml-4px text-16px font-bold text-#30403a">
                                        {{ formatNumberSplit(item.convert_price, 0) }}
                                    </div>
                                    <div class="line-through leading-20px text-12px ml-6px" v-if="item.old_price">
                                        {{ formatNumberSplit(item.old_price, 0) }}
                                    </div>
                                </div>
                            </div>
                            <div class="item-good opacity-0" v-if="type.list.length && type.list.length % 2 != 0"></div>
                            <div
                                class="no-more block m-auto text-12px text-#b3b9b9 leading-normal relative"
                                v-if="!listLoading && type.list.length"
                            >
                                没有更多了
                            </div>
                            <div class="mx-auto mt-44px text-center" v-if="!listLoading && !type.list.length">
                                <img
                                    class="w-200px h-180px text-white text-11px font-bold"
                                    src="@/assets/img/template/july/vbmarket/no-goods.png"
                                    alt=""
                                />
                                <div class="text-#aaaaab mt-5px">暂无商品</div>
                            </div>
                        </div>
                    </PullRefresh>
                </van-tab>
            </van-tabs>
        </div>
        <div
            v-if="systemParams.isLogin"
            class="bottom-wrapper px-12px hstack justify-between text-12px text-#808684 fixed bottom-0 left-0 right-0 w-full h-48px bg-white"
        >
            <div class="hstack">
                <div>
                    我的V币余额:
                    <span class="text-16px font-robot font-bold text-#30403a">
                        {{ formatNumberSplit(walletStore.userVbMoney, 0) }}
                    </span>
                </div>
                <div class="ml-20px" v-if="walletStore.vbExchageTimesToday >= 0">
                    今日还可兑换
                    <span class="font-robot text-#5ad8b5 text-16px font-bold mx-3px">{{ walletStore.vbExchageTimesToday }}</span>
                    次
                </div>
            </div>
            <router-link
                to="/myvb"
                class="w-72px h-34px leading-34px rounded-6px border border-#a5e3d2 text-center text-12px text-#5ad8b5 font-bold"
            >
                我的兑换
            </router-link>
        </div>
        <!-- 兑换规则 -->
        <van-popup
            teleport="body"
            v-model:show="showBottom"
            class="vbmarket-bottom-popup"
            round
            position="bottom"
            :style="{ maxHeight: '80%' }"
        >
            <div class="top absolute w-full top-0 left-0 right-0 pt-18px bg-white px-20px">
                <div class="flex-center h-24px leading-24px text-18px text-newText text-center relative">
                    <div class="font-bold">兑换规则</div>
                    <img
                        @click="showBottom = false"
                        class="w-24px h-24px absolute right-0"
                        src="@/assets/img/template/july/my/set/icon/clear-icon.png"
                        alt=""
                    />
                </div>
            </div>
            <div class="content w-full max-h-456px overflow-y-scroll">
                <div class="text-12px text-#808181 leading-normal pl-20px">
                    <ol>
                        <li>
                            威客VIP会员可在V币商城进行现金投注额兑换和实物礼品兑换，V币所兑换的现金将自动添加至会员的主钱包中，兑换现金需完成全站一倍有效流水。
                        </li>
                        <li>
                            V币商城兑换实物或虚拟奖品，可在个人中心-我的背包中自行操作折现或快递到家。首次快递到家，则需要先完成填写个人收货地址信息，工作人员将在信息提交后的一周内派发兑换物。
                        </li>
                        <li>
                            快递到家提交成功后，可在快递信息图标点击查看订单详情，如有订单信息错误，该订单还在待派发状态，则可重新修改地址信息，若该订单状态已派发，则无法修改。
                        </li>
                        <li>V币兑换所有的实物礼品寄送地区仅限中国大陆地区，VKGAME不处理跨国邮寄礼品之事宜。</li>
                        <li>V币兑换的礼品以VKGAME平台上的资料为准，如遇不可抗力因素，V币保留更换其它等值奖项的权利。</li>
                        <li>
                            对于存在作弊、不良交易、不良注册、发送垃圾消息、欺诈等不良行为的账号及其相关联的账号，以及已被冻结的账号及其相关联的账号，VKGAME有权对其做扣除V币处理。此活动最终解释权归VKGAME所有。
                        </li>
                    </ol>
                </div>
            </div>
        </van-popup>
        <!-- 兑换提醒弹窗 -->
        <van-dialog
            teleport="body"
            close-on-click-overlay
            v-model:show="exchangeBeforeDio"
            :show-confirm-button="false"
            className="vbmarket-dialog"
        >
            <div class="text-#30403a font-bold leading-24px text-18px">兑换物品</div>
            <div class="text-#606666 text-14px leading-24px mt-2px">
                {{ preGoods?.goods_name }}
            </div>
            <!-- 商品价格 -->
            <div class="hstack mt-4px mt-15px flex-center font-robot">
                <img class="w-22px h-22px" src="@/assets/img/template/july/vbmarket/vb.png" alt="" />
                <div class="leading-34px ml-4px text-24px font-bold text-#30403a">
                    {{ formatNumberSplit(preGoods?.convert_price, 0) }}
                </div>
            </div>
            <div class="flex-center mt-15px">
                <div class="btn" @click="exchangeBeforeDio = false">取消</div>
                <div class="btn primary-btn ml-10px border-transparent text-white!" @click="confirm">确认</div>
            </div>
        </van-dialog>
        <!-- 兑换成功 -->
        <van-dialog
            teleport="body"
            close-on-click-overlay
            v-model:show="showDialog"
            :show-confirm-button="false"
            className="vbmarket-dialog"
            @closed="reset"
        >
            <div class="text-#30403a font-bold leading-24px text-18px">兑换成功</div>
            <div class="w-80px h-80px flex-center m-auto mt-10px mb-6px">
                <img
                    class="max-w-80px max-h-80px"
                    v-lazy="{
                        src: conversionGoodsInfo.goods_pic,
                        error: lazyGoods,
                        loading: lazyGoods
                    }"
                    alt=""
                />
            </div>
            <div class="text-#606666 text-14px leading-24px">
                {{ conversionGoodsInfo?.goods_name }}
            </div>
            <div class="text-12px text-#9da4a4 leading-24px mt-2px">
                您可在
                <span class="text-#5ad8b5" v-if="conveResult === 'entity'">
                    <router-link :to="`/package?gametype=0&&id=${conversionGoodsInfo.package_id}`">【背包】</router-link>
                </span>
                <span class="text-#5ad8b5" v-if="conveResult === 'cash'">
                    <template v-if="isSpeclGood(conversionGoodsInfo)">
                        <router-link :to="conversionGoodsInfo.jump_url">{{ conversionGoodsInfo.jump_tips }}</router-link>
                    </template>
                    <template v-else><router-link to="/user">【个人中心】</router-link></template>
                </span>
                查看
            </div>
            <div
                @click="showDialog = false"
                class="mx-auto mt-16px w-160px h-40px rounded-6px primary-btn text-center leading-40px text-white font-bold text-14px"
            >
                知道了
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss" scoped>
.vbmarket-page {
    .bottom-wrapper {
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
    }
    .no-more {
        &::before {
            content: "";
            position: absolute;
            display: block;
            top: 8px;
            left: -48px;
            width: 40px;
            height: 1px;
            background-color: #c0c6c6;
        }
        &::after {
            content: "";
            position: absolute;
            display: block;
            top: 8px;
            right: -47px;
            width: 40px;
            height: 1px;
            background-color: #c0c6c6;
        }
    }
    .vbmarket-tabs {
        :deep(.van-tabs__nav--line.van-tabs__nav--complete) {
            padding-left: 0;
            padding-right: 0;
        }
        :deep(.van-tabs__line) {
            width: 28px;
            height: 4px;
            background-image: linear-gradient(to right, #72ecbe 0%, #edfff6 100%);
            bottom: 0.2rem;
        }
    }
    .list {
        position: relative;
        min-height: 300px;
        padding: 12px;
        padding-bottom: 12px;
        &.list_login {
            padding-bottom: 60px;
        }
        .item-good {
            width: 170px;
            height: 194px;
            border-radius: 8px;
            box-shadow: 0 2px 6px 0 rgba(52, 166, 202, 0.05);
            background-color: #fff;
            margin-bottom: 12px;
            position: relative;
            margin-right: 10px;
            &:nth-child(even) {
                margin-right: 0;
            }
            .countdown-wrapper {
                width: 80px;
                height: 21px;
                line-height: 21px;
                padding-left: 22px;
                padding-top: 1px;
                color: #fff;
                font-size: 11px;
                background: url("@/assets/img/template/july/vbmarket/cd-label.png") no-repeat center;
                background-size: 100% 100%;
                .time {
                    display: inline-block;
                    transform: scale(0.86);
                    transform-origin: left top;
                    white-space: nowrap;
                }
            }
            .vip-wrapper {
                width: fit-content;
                box-shadow: 0 1px 3px 0 rgba(165, 227, 210, 0.25);
                border: solid 1px #a5e3d2;
                background-color: #f5fdfb;
                font-size: 11px;
                color: #11bd9e;
                .vip-text {
                    display: inline-block;
                    font-weight: bold;
                }
            }
            .free-wrapper {
                width: 30px;
                height: 16px;
                background: url("@/assets/img/template/july/vbmarket/free.png") no-repeat center;
                background-size: 100% 100%;
                text-align: center;
                line-height: 16px;
                font-size: 11px;
                color: white;
                &.discount {
                    width: 26px;
                    height: 16px;
                    background-image: url("@/assets/img/template/july/vbmarket/discount-label.png");
                }
            }
        }
    }
}
</style>
<style lang="scss">
.van-popup.vbmarket-bottom-popup {
    line-height: 20px;
    font-family: -apple-system-font, "Helvetica Neue", sans-serif;
    padding: 60px 24px 16px;
    overflow: hidden;
    ol {
        li {
            list-style-type: decimal;
            margin-top: 0.14rem;
            &:first-child {
                margin-top: 0;
            }
        }
    }
}
.van-dialog.vbmarket-dialog {
    background-color: #ffffff;
    width: 250px;
    border-radius: 12px;
    min-height: 180px;
    padding: 18px 16px;
    text-align: center;
    .btn {
        width: 104px;
        height: 40px;
        line-height: 38px;
        text-align: center;
        border-radius: 6px;
        border: solid 1px #a5e3d2;
        color: #5ad8b5;
        font-weight: bold;
        font-size: 14px;
    }
}
</style>
