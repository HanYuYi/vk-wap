<script setup lang="ts">
import ApiSetting from "@/api/service"
import { ref } from "vue"
import { showToast } from "vant"
import { usePlaceImg } from "@/utils/globalImgs"
import { useRouter } from "vue-router"
import { useSysStore } from "@/stores/system"
import { useFreshStore } from "@/stores/fresh"
import type { VMallDelivery, Data } from "@/api/pojo/VMallDelivery"
import useClipboard from "vue-clipboard3"

const freshStore = useFreshStore()
const systemParams = useSysStore()
const { lazyPack140 } = usePlaceImg()
const router = useRouter()

const deliveryInfoList = ref<Data[]>([])

const goodsType = ref("entity")
// 快递详情
const deliDetail = ref<Data | null>(null)
// 快递详情弹窗状态，success：成功，fail:失败
const deliDioStatus = ref("success")
// 快递详情弹窗
const isShowDio = ref(false)

const { toClipboard } = useClipboard() //复制

const copy = async (text?: string): Promise<void> => {
    if (text) {
        try {
            await toClipboard(text)
            showToast({ className: "vk-toast-success", message: "复制成功", icon: "checked" })
        } catch (e: unknown) {
            console.error(e)
        }
    }
}

const transferStatus = (item: Data): void => {
    if (item.is_virtual == 1) {
        goodsType.value = "virtual"
    } else {
        goodsType.value = "entity"
    }
    // 修改快递地址
    if (item.status == 0) {
        if (item.is_lock == 1) {
            // 派发中
            deliDetail.value = item
            deliDioStatus.value = "sending"
            isShowDio.value = true
        } else {
            // 待派发
            // 修改账号
            if (item.is_virtual == 1) {
                systemParams.routeParams = { deStatus: "modifyAccount", ...item }
                router.push("/packageAddress")
            } else {
                // 修改快递地址
                systemParams.routeParams = { deStatus: "modify", ...item }
                router.push("/packageAddress")
            }
        }
    }
    // 派发失败
    if (item.status == 1) {
        deliDetail.value = item
        deliDioStatus.value = "fail"
        isShowDio.value = true
    }
    // 派发成功
    if (item.status == 2) {
        deliDetail.value = item
        deliDioStatus.value = "success"
        isShowDio.value = true
    }
}
/**
 * 下拉刷新
 */
const onRefresh = (): void => {
    freshStore.resetList()
    getRecordsByParams()
}

const getRecordsByParams = (): void => {
    freshStore.getList<VMallDelivery, {}>({
        url: ApiSetting.user.deliverInfo,
        params: {},
        limit: true
    })
    deliveryInfoList.value = freshStore.list as Data[]
}

freshStore.resetList()
</script>

<template>
    <div class="package-page bg-light-green">
        <HeaderBar>
            <div class="header_title">派发信息</div>
        </HeaderBar>

        <PullRefresh @on-refresh="onRefresh">
            <div class="expand-page font-classic relative">
                <ListLazy
                    :finishedText="!freshStore.listLoading && !deliveryInfoList.length ? '暂无数据' : '已经全部加载完毕'"
                    @load="getRecordsByParams"
                >
                    <div class="list_box hstack" v-for="(item, index) in deliveryInfoList" :key="index">
                        <div class="img_box flex-center">
                            <img
                                v-lazy="{
                                    src: item?.icon_url,
                                    error: lazyPack140,
                                    loading: lazyPack140
                                }"
                                alt=""
                            />
                        </div>
                        <div class="center-block flex flex-col justify-between">
                            <div class="name van-multi-ellipsis--l2">
                                {{ item.goods_name }}
                            </div>
                            <div class="time">兑换时间:{{ item.create_date }}</div>
                        </div>
                        <div class="right-block flex flex-col justify-between">
                            <div class="status">
                                <span class="text-#00bf6d" v-if="item.status == 0">
                                    {{ item.is_lock == 1 ? "派发中" : "待派发" }}
                                </span>
                                <span class="text-#f80000" v-if="item.status == 1">派发失败</span>
                                <span class="text-#00bf6d" v-if="item.status == 2">派发成功</span>
                            </div>
                            <div class="btn-detail">
                                <div @click="transferStatus(item)" class="btn-deli hstack">
                                    <span v-if="item.is_lock == 0 && item.status == 0">
                                        {{ item.is_virtual == 1 ? "修改账号" : "修改地址" }}
                                    </span>
                                    <span v-else>查看详情</span>
                                    <i class="right-arrow"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </ListLazy>
                <van-loading v-if="freshStore.listLoading" color="#444" class="ab-center" type="spinner" />
            </div>
        </PullRefresh>
        <van-dialog teleport="body" confirm-button-text="知道了" v-model:show="isShowDio" class="bg-white!">
            <div class="vbprize_got_dialog_box">
                <div class="title red" style="margin-bottom: 0.06rem">
                    {{ deliDioStatus == "sending" ? "派发中" : deliDioStatus == "success" ? "派发成功" : "派发失败" }}
                </div>
                <div class="confirm-goods-form">
                    <template v-if="goodsType == 'entity'">
                        <div class="line">
                            <div class="label link">收货人姓名</div>
                            <div class="desc">{{ deliDetail?.receive }}</div>
                        </div>
                        <div class="line">
                            <div class="label link">手机号码</div>
                            <div class="desc">{{ deliDetail?.phone }}</div>
                        </div>
                        <div class="line">
                            <div class="label link">收货地址</div>
                            <div class="desc">
                                {{ deliDetail?.province }}, {{ deliDetail?.city }}
                                <br />
                                {{ deliDetail?.address }}
                            </div>
                        </div>
                        <template v-if="deliDioStatus == 'success' || deliDioStatus == 'sending'">
                            <div class="line">
                                <div class="label link">快递公司</div>
                                <div class="desc">
                                    {{ deliDetail && deliDetail.express_name ? deliDetail.express_name : "暂无" }}
                                </div>
                            </div>
                            <div class="line">
                                <div class="label link">快递单号</div>
                                <div class="desc d-flex align-center">
                                    <span class="deli-code van-ellipsis">
                                        {{ deliDetail && deliDetail.express_no ? deliDetail.express_no : "暂无" }}
                                    </span>
                                    <span v-if="deliDetail.express_no" @click="copy(deliDetail?.express_no)" class="copy-btn">
                                        复制
                                    </span>
                                </div>
                            </div>
                        </template>
                        <div class="line" v-else>
                            <div class="label link">失败原因</div>
                            <div class="desc red">{{ deliDetail?.remark }}</div>
                        </div>
                    </template>
                    <template v-if="goodsType == 'virtual'">
                        <div class="line">
                            <span class="label link">账号信息</span>
                            <span class="desc">{{ deliDetail?.secret }}</span>
                        </div>
                        <div class="line" v-if="deliDioStatus == 'fail'">
                            <span class="label link">失败原因</span>
                            <span class="desc red">{{ deliDetail?.remark }}</span>
                        </div>
                    </template>
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss" scoped>
.list_box {
    margin: auto;
    margin-left: 15px;
    padding-right: 15px;
    width: 360px;
    font-size: 15px;
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: solid 1px #c6d0db;
    .img_box {
        width: 100px;
        height: 60px;
        text-align: center;
        position: relative;
        img {
            max-width: 100%;
            height: 100%;
        }
    }
    .center-block {
        flex: 1;
        height: 60px;
        padding: 0 20px 0 10px;
        .name {
            max-width: 150px;
            margin-top: -2px;
            line-height: 1.3;
            font-size: 15px;
        }
        .time {
            color: #7c839f;
            font-size: 14px;
        }
    }
    .right-block {
        height: 60px;
        font-size: 15px;
        text-align: right;
    }
    .right-arrow {
        width: 0.09rem;
        height: 0.13rem;
        background: url("@/assets/img/btn-game-date-right.png") center no-repeat;
        background-size: 100% 100%;
        display: inline-block;
        vertical-align: middle;
        margin-left: 0.1rem;
    }
}
.vbprize_got_dialog_box {
    text-align: center;
    color: #262933;
    padding: 0.18rem 0.2rem;
    font-size: 0.15rem;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;

    &.exchang_before {
        line-height: 1.9;
        padding-top: 0.24rem;
        padding-bottom: 0.24rem;
    }

    .img_box {
        height: 0.7rem;
        margin: 0.06rem auto;

        img {
            max-width: 100%;
            max-height: 100%;
        }
    }

    .confirm-goods-form {
        .line {
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }

        .label {
            text-align: right;
            width: 0.8rem;
        }

        .desc {
            margin-top: 0.02rem;
            margin-left: 0.2rem;
            width: 1.54rem;
            text-align: left;
        }

        .copy-btn {
            color: #e31212;
            text-decoration: underline;
            margin-left: 0.06rem;
        }
    }

    .link {
        color: #7c839f;
        margin-top: 0.02rem;

        a {
            color: #e31212;
            text-decoration: underline;
        }
    }
}
</style>
