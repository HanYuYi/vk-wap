<script setup lang="ts">
import { HttpPlus } from "@/api/HttpPlus"
import ApiSetting from "@/api/service"
import { formatNumberSplit } from "@/utils/numberUtils"
import { useSysStore } from "@/stores/system"
import { showToast } from "vant"
import { computed, ref, unref } from "vue"

const systemParams = useSysStore()

/**
 * Props
 */
interface Props {
    headTitle: string

    BannerImg: string

    time: string

    desc?: string

    btnText?: string

    btnLoading?: boolean

    btnDisable?: boolean

    contentTitle?: string

    initData: Partial<{
        status: number

        status_tips: string

        status_tip: string

        amount: number | string

        active_id: number

        sumAmount: number | string

        bonus: number | string
    }>

    walletList?: { code: string; name: string }[]
}

const props = withDefaults(defineProps<Props>(), {
    initData: () => ({}),

    walletList: () => [],

    contentTitle: "活动内容"
})

/**
 * Emits
 */
interface Emits {
    (e: "open"): void

    (e: "transfer"): void
}

const emit = defineEmits<Emits>()

const walletIndex = ref(0)
const show = ref(false)
const confirmLoading = ref(false)

const walletCode = computed<string>(() => {
    if (props.walletList.length) {
        return props.walletList[walletIndex.value]?.code
    }
    return ""
})

const openDialog = (): void => {
    if (!systemParams.isLogin) {
        showToast({ className: "vk-toast-fail", message: "请您先登录", icon: "warning" })
    } else {
        if (props.initData.status !== 0) {
            showToast({
                className: "vk-toast-fail",
                message: props.initData.status_tips || props.initData.status_tip,
                icon: "warning"
            })
        } else {
            walletIndex.value = 0
            show.value = true
            emit("open")
        }
    }
}

const transfer = async (): Promise<void> => {
    confirmLoading.value = true
    try {
        const params = {
            from: "NM",
            to: unref(walletCode),
            money: props.initData.amount,
            active_id: props.initData.active_id
        }

        HttpPlus.setUrlOptions(ApiSetting.user.transferSubmit)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        confirmLoading.value = false

        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: `【${props.initData.sumAmount}】元本金 + 彩金已转入您的【${props.walletList[walletIndex.value].name}】!`,
                icon: "checked"
            })
            show.value = false
            emit("transfer")
        }
    } catch (error: unknown) {
        confirmLoading.value = false
        throw error
    }
}
</script>

<template>
    <div class="Active_universal_template bg-#e8f1ef font-classic text-#262933 leading-relaxed!">
        <HeaderBar>
            <div class="header_title">{{ props.headTitle }}</div>
        </HeaderBar>

        <div class="expand-page">
            <!-- 轮播图 -->
            <div class="topBanner w-full">
                <img class="w-full" :src="props.BannerImg" alt="" />
            </div>

            <div class="active_wrapper">
                <!-- 活动时间 -->
                <section>
                    <div class="section_title">活动时间</div>
                    <div class="section_content">
                        {{ props.time ? props.time : "即日起" }}
                    </div>
                </section>
                <!-- 活动内容 -->
                <section class="section_table">
                    <div class="section_title">{{ props.contentTitle }}</div>
                    <div class="section_content text-left" v-html="props.desc"></div>
                    <slot name="table"></slot>
                    <slot name="btndesc">
                        <div v-if="(props.initData.status == 0 || props.initData.status == 1) && props.initData.bonus > 0">
                            <span class="liushui">
                                {{ props.initData.status == 0 ? "当前可领取：" : "已领取："
                                }}{{ formatNumberSplit(props.initData.bonus, 0) }}元彩金
                            </span>
                        </div>
                    </slot>
                    <slot name="btn">
                        <div class="vk_comfire_btn">
                            <van-button
                                :disabled="props.btnDisable"
                                :btnLoading="props.btnLoading"
                                @click="openDialog"
                                class="vk-btn"
                                block
                            >
                                {{ props.btnText }}
                            </van-button>
                        </div>
                    </slot>
                </section>
                <slot name="other"></slot>
                <!-- 活动规则 -->
                <section>
                    <div class="section_title">活动规则</div>
                    <div class="section_content">
                        <slot name="rules"></slot>
                    </div>
                </section>
            </div>
        </div>

        <slot name="dialog">
            <van-dialog
                class="active-universal-dialog"
                :close-on-click-overlay="true"
                v-model:show="show"
                :show-confirm-button="false"
                get-container="body"
            >
                <div class="close" @click="show = false"></div>
                <div>
                    <div class="dialog_title">
                        本金+红利共：
                        <span class="text-#07f0bc">{{ formatNumberSplit(props.initData.sumAmount, 0) }}</span>
                        元
                    </div>
                    <div class="wallet_title">返利至</div>
                    <div class="wallet_box_wrapper" v-if="props.walletList.length">
                        <div
                            @click="walletIndex = i"
                            class="wallet_box"
                            :class="[`${item.code}`, { active: walletIndex === i }]"
                            v-for="(item, i) in props.walletList"
                            :key="i"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                    <div v-if="!props.walletList.length" class="wallet_box_wrapper">
                        <van-loading class="ab-center" type="spinner" />
                    </div>
                </div>
                <div class="vk_comfire_btn">
                    <van-button
                        :loading="confirmLoading"
                        @click="transfer"
                        class="h-36px primary-btn rounded-30px border-none text-15px text-#000"
                        block
                    >
                        确定
                    </van-button>
                </div>
            </van-dialog>
        </slot>
    </div>
</template>

<style lang="scss" scoped>
.Active_universal_template {
    .section_table {
        text-align: center;

        .section_title {
            text-align: left;
        }

        :deep(.vk_comfire_btn) {
            width: 0.95rem;
            margin: 5px auto 0;
            .vk-btn {
                border-radius: 30px;
                height: 0.4rem;
                font-size: 0.15rem;
                font-weight: 600;
                color: #000;
                background: linear-gradient(to right, #07e9f1, #07f1b7);
                box-shadow: 0px 2px 6px 0px rgb(0 0 0 / 35%);
                border: none;
                &.van-button--disabled {
                    background: rgba(124, 131, 159, 0.1);
                    color: #53586b;
                    opacity: 1;
                }
            }
        }

        :deep(table) {
            margin-top: 0.08rem;
            width: 100%;
            line-height: 0.27rem;
            font-size: 0.12rem;
            border-top: #333548 1px solid;
            border-right: #333548 1px solid;
            margin-bottom: 0.1rem;
            .bold-red {
                font-size: 0.2rem !important;
                color: #e34d12 !important;
                font-family: vkfont;
            }

            th {
                font-size: 0.17rem;
                color: #27bc74;
                height: 0.47rem;
                padding-top: 0.05rem;
                padding-bottom: 0.04rem;
                font-weight: bold;
            }

            td {
                font-size: 0.15rem;
                color: #262933;
                height: 0.35rem;
            }

            th,
            td {
                line-height: normal;
                box-sizing: border-box;
                text-align: center;
                border-left: #333548 1px solid;
                border-bottom: #333548 1px solid;

                &.no_boder {
                    border: none;
                }
            }
        }
    }
    :deep(ol) {
        padding-left: 0.15rem;
        list-style: decimal;

        li {
            list-style: decimal;
            margin-bottom: 0.05rem;

            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }
    .active_wrapper {
        padding: 0 0.15rem 0.1rem;
        .date_time {
            margin-top: 0.2rem;
            margin-bottom: 0.3rem;
            .section_title {
                font-size: 0.17rem;
                line-height: 0.17rem;
            }
            .section_content {
                line-height: 0.15rem;
                margin-bottom: 0;
            }
        }
        .desc_temp {
            .section_content {
                line-height: 0.19rem;
            }
        }
        .active_rule {
            margin-top: 0.3rem;
            .section_content {
                width: calc(100% - 0.17rem);
                margin-top: 0;
                margin-left: 0.17rem;
                li {
                    font-size: 0.15rem;
                    line-height: 0.21rem;
                    margin-top: 0.06rem;
                    list-style: decimal;
                    &:first-child {
                        margin-top: 0.07rem;
                    }
                }
            }
        }
    }
    section {
        margin-top: 0.2rem;
        margin-bottom: 0.2rem;
        font-size: 0.14rem;
        .section_title {
            font-weight: bold;
            font-size: 0.17rem;
            line-height: 0.17rem;
        }
        .section_content {
            margin-top: 0.1rem;
            p {
                margin-bottom: 0.05rem;
            }
            .liushui {
                margin-top: 0.3rem;
                font-size: 0.15rem;
                line-height: 0.15rem;
            }
        }
        .error_tip {
            text-align: center;
            color: #e34d12;
        }
    }
    .notice_color {
        color: #7c839f;
    }
    .warning_color {
        color: #e34d12;
    }
}
</style>
<style lang="scss">
.active-universal-dialog {
    top: 50%;
    width: 3.45rem;
    box-sizing: border-box;
    padding: 0.2rem 0.2rem 0.3rem;
    border-radius: 0.05rem;
    background-color: #262933;
    font-size: 0.16rem;
    color: #ffffff;
    text-align: center;
    input {
        color: white;
    }
    .close {
        width: 0.44rem;
        height: 0.44rem;
        background: url("@/assets/img/template/july/leftnav_closeicon.png") no-repeat center center;
        background-size: 0.2rem 0.2rem;
        position: absolute;
        top: 0;
        right: 0;
    }
    .dialog_title {
        margin-top: 0.1rem;
        text-align: left;
    }
    .wallet_title {
        text-align: left;
        margin-bottom: 0.1rem;
    }
    .wallet_box_wrapper {
        min-height: 1.39rem;
        font-size: 0.13rem;
        display: inline-block;
        margin-bottom: 0.15rem;
        padding: 0 0.2rem;
        text-align: left;
        display: flex;
        flex-wrap: wrap;
        .wallet_box {
            margin-right: 0.12rem;
            margin-bottom: 0.11rem;
            &:nth-child(2n + 2) {
                margin-right: 0;
            }
        }
    }
    .vk_comfire_btn {
        margin: auto;
        width: 2.95rem;
    }
}
</style>
