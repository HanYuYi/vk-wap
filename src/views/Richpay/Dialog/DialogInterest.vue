<script setup lang="ts">
import { useWalletStore } from "@/stores/wallet"

const walletStore = useWalletStore()
</script>

<template>
    <div class="cus-withdrawal-interest">
        <p class="title flex">
            未提利息
            <MoneySplit class="mx-4px" :amount="walletStore.richpayInitData.wallet_info.interest_balance" />
            元， 您可以：
        </p>
        <p class="tip">
            提至主钱包无流水要求即可提款
            <br />
            提至V富通钱包继续累积收益(1元起)
        </p>
        <div class="btns-group">
            <button @click="$emit('richPayWithdrawInterest', 0)" class="richpay_btn">提至主钱包</button>
            <button @click="$emit('richPayWithdrawInterest', 1)" class="richpay_btn active">转回V富通钱包</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.cus-withdrawal-interest {
    padding: 0.3rem 0.44rem 0;
    font-size: 0.15rem;
    text-align: left;

    .title {
        color: #fff;
        line-height: 0.15rem;
        margin-top: 0.45rem;

        span {
            color: #83f9fd;
        }
    }

    .tip {
        color: #a1a3df;
        line-height: 0.24rem;
        margin-top: 0.2rem;
    }

    .btns-group {
        display: flex;
        justify-content: space-between;
        margin-top: 0.45rem;
    }
}
</style>
