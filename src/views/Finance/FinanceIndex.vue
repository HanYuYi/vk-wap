<script setup lang="ts">
import { ref } from "vue"
import type { RouteLocationNormalizedLoaded, Router } from "vue-router"
import { useRoute, useRouter } from "vue-router"
import { useSysStore } from "@/stores/system"
import { useWalletStore } from "@/stores/wallet"
import type { InferArray } from "@/types"

const walletStore = useWalletStore()
const systemParams = useSysStore()
const router: Router = useRouter()
const route: RouteLocationNormalizedLoaded = useRoute()

const active = ref(0)
const NAV = [
    {
        key: "tranfer",
        name: "转账",
        path: "/finance"
    },
    {
        key: "deposit",
        name: "充值",
        path: "/finance/deposit"
    },
    {
        key: "withdraw",
        name: "提现",
        path: "/finance/withdraw"
    }
]

if (route.name) {
    active.value = NAV.findIndex((item: InferArray<typeof NAV>) => item.key === route.name)
}
if (systemParams.isLogin) {
    walletStore.getUserMoney("NM")
}
</script>

<template>
    <div class="finance-page bg-light-green">
        <HeaderBar @tolog="router.push('/tradingrecord')">
            <div class="header_title">账户</div>
        </HeaderBar>

        <div class="expand-page font-classic relative">
            <van-tabs background="#e8f1ef" v-model:active="active" animated>
                <van-tab replace :to="item.path" v-for="(item, index) in NAV" :title="item.name" :key="index"></van-tab>
            </van-tabs>
            <div class="page-view px-15px pt-12px pb-24px">
                <RouterView></RouterView>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-view {
    position: relative;
    height: calc(100vh - 88px);
    height: calc(var(--vh) * 100 - 88px);
    line-height: 1.6;
    color: #262933;

    :deep(.MoneySplit) {
        .small-num {
            font-size: 18px;
        }
    }
}
:deep(.currency_icon) {
    display: inline-block;
    width: 0.14rem;
    height: 0.14rem;
    background: url("@/assets/img/template/july/finance/icon-yuan.png") no-repeat center;
    background-size: contain;
    margin-right: 0.02rem;
}
:deep(.main_wallet_box) {
    width: 100%;
    height: 100px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-image: url("@/assets/img/template/july/finance/main_wallet_box_bg.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    box-shadow: 0 0 12px 3px rgba(0, 0, 0, 0.3);
    color: #fff;
    border-radius: 0.06rem;

    .MoneySplit {
        :deep(.small-num) {
            font-size: 18px;
        }
    }
    .main_wallet_box_left {
        height: 0.7rem;
    }

    .wallet_name {
        height: 0.34rem;
        line-height: 0.34rem;
        font-size: 0.18rem;
        font-weight: bold;

        .wallet_icon {
            display: inline-block;
            vertical-align: middle;
            height: 100%;
            width: 0.28rem;
            background: url("@/assets/img/template/july/finance/icon-wallet.png") no-repeat center;
            background-size: contain;
            margin-right: 0.1rem;
        }

        span {
            display: inline-block;
            vertical-align: middle;
        }
    }

    .wallet_number {
        height: 0.34rem;
        font-size: 0.24rem;
        font-weight: bold;
        white-space: nowrap;

        .num {
            height: 100%;
            white-space: nowrap;

            .float {
                font-size: 0.18rem;
            }
        }
    }

    .main_wallet_box_refresh_btn {
        margin-left: 5px;
        width: 0.32rem;
        height: 0.32rem;
        background: url("@/assets/img/template/july/finance/btn-refresh-normal.png") no-repeat center;
        background-size: contain;

        &:active {
            background: url("@/assets/img/template/july/finance/btn-refresh-pressed.png") no-repeat center;
            background-size: contain;
        }
    }

    &.vb {
        margin-top: 0.1rem;
        background: url("@/assets/img/template/july/finance/vcoin_bg.png") no-repeat;
        background-size: 100% 100%;

        .wallet_number {
            .currency_icon {
                width: 0.18rem;
                height: 0.15rem;
                background: url("@/assets/img/template/july/finance/vb.png") no-repeat center;
                background-size: contain;
            }
        }
    }
}
</style>
<style lang="scss">
@import "finance.scss";
.deposit-overpop {
    .inner_page_body {
        padding-top: 20px;
        background-color: #e8f1ef;
        min-height: calc(100vh - 44px);
        min-height: calc(var(--vh) * 100 - 44px);
        color: #262933;
        line-height: 1.6;

        &.deposit_qrcode {
            padding-top: 0.5rem;
            text-align: center;
            color: #262933;

            .qrcode_tips {
                font-size: 14px;
            }

            .qrcode_img {
                width: 50%;
                min-height: 1.2rem;
                margin: 0.3rem auto 0;

                img {
                    width: 100%;
                }
            }

            .deposit_money {
                font-size: 0.3rem;
                margin-top: 0.5rem;
            }

            .qrcode_subtitle {
                font-size: 0.14rem;
                color: #7c839f;
            }
        }

        .warning {
            color: #cf3126;
        }

        .comfire_box {
            padding: 0 0.05rem;
            background-color: #fff;

            .dialog_input_box_wrapper {
                padding: 0.12rem 0;
                font-size: 0.16rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }

        .confirm_deposit_tips {
            padding: 0 0.05rem;
            line-height: 0.22rem;
            margin-top: 0.1rem;
            color: #7c839f;
            font-size: 12px;
        }
    }
}
</style>
