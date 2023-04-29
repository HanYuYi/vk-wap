<script setup lang="ts">
import { useWalletStore } from "@/stores/wallet"
const walletStore = useWalletStore()
</script>

<template>
    <div class="cus-rate overflow-hidden">
        <div class="list-box">
            <p v-for="(item, i) in walletStore.richpayInitData.vip_year_conf" :key="i">
                <span>{{ item.vip_name }}</span>
                <span>{{ item.vip_apr ? item.vip_apr + "%" : "-" }}</span>
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.cus-rate {
    .list-box {
        width: calc(100% - 0.2rem);
        height: 2.24rem;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        margin: 0.3rem auto 0;
        font-size: 0.15rem;
        align-items: center;
        position: relative;

        p {
            width: 1.03rem;
            box-sizing: border-box;
            height: 0.32rem;
            line-height: 0.32rem;
            display: flex;
            justify-content: space-between;

            span:nth-child(1) {
                color: #fff;
            }

            span:nth-child(2) {
                color: #83f9fd;
            }
        }

        &:before {
            position: absolute;
            content: "";
            width: 1px;
            height: calc(2.24rem - 0.17rem);
            top: 0.085rem;
            left: calc(100% / 2);
            background: rgba(131, 249, 253, 0.25);
        }
    }
}
</style>
