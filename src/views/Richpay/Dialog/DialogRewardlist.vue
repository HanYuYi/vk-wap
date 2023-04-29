<script setup lang="ts">
import type { RecordsPage } from "@/views/Richpay/RichpayView.vue"

/**
 * Props
 */

interface Props {
    recordsPage: Omit<RecordsPage, "page_size"> | {}

    loading: boolean
}

withDefaults(defineProps<Props>(), {
    recordsPage: () => ({}),

    loading: false
})
</script>

<template>
    <div class="cus-winning-record">
        <p class="record-title">
            <span>抽中奖品</span>
            <span>获得日期</span>
            <span>状态</span>
        </p>
        <p class="record-item" v-for="(item, i) in recordsPage.records" :key="i">
            <span>{{ item.name }}</span>
            <span>{{ item.time }}</span>
            <router-link v-if="item.status == 3" to="/package?from=richpay">{{ item.status_cn }}</router-link>
            <span v-else>{{ item.status_cn }}</span>
        </p>

        <p class="none-record" v-if="!recordsPage.records.length && !loading">暂无数据</p>

        <p class="record-page-control" v-if="recordsPage.records.length">
            <span class="left" @click="$emit('recordPageChange', -1)"></span>
            {{ recordsPage.currentPage }}/{{ recordsPage.maxPage }}
            <span class="right" @click="$emit('recordPageChange', +1)"></span>
        </p>
    </div>
</template>

<style lang="scss" scoped>
.cus-winning-record {
    overflow: hidden;

    .record-title,
    .record-item {
        width: 3.09rem;
        height: 0.4rem;
        margin: 0.15rem auto 0;
        font-size: 0.15rem;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(130, 167, 242, 0.3);

        span,
        a {
            display: block;
            text-align: center;
            white-space: nowrap;
        }

        span:nth-child(1) {
            width: 35%;
        }

        span:nth-child(2) {
            width: 45%;
        }

        span,
        a:nth-child(3) {
            width: 20%;
            text-align: center;
        }

        .can-use,
        a {
            color: #83f9fd;
            text-decoration: underline;
        }
    }

    .record-item {
        margin-top: 0rem;
        color: #ffffff;
    }

    .none-record {
        margin-top: 1rem;
        margin-bottom: 0.2rem;
        color: #ffffff;
    }

    .record-page-control {
        width: 1.2rem;
        height: 0.4rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        left: calc((100% - 1.2rem) / 2);
        bottom: -0.08rem;
        font-size: 0.12rem;
        color: #fff;
    }

    .left {
        display: inline-block;
        width: 0.14rem;
        height: 0.215rem;
        cursor: pointer;
        background: url("@/assets/img/template/july/richpay/btn_normal_l.png");

        &:active {
            background: url("@/assets/img/template/july/richpay/btn_hover_l.png");
            background-size: 100% 100%;
        }

        background-size: 100% 100%;
    }

    .right {
        display: inline-block;
        width: 0.14rem;
        height: 0.215rem;
        cursor: pointer;
        background: url("@/assets/img/template/july/richpay/btn_normal_r.png");

        &:active {
            background: url("@/assets/img/template/july/richpay/btn_hover_r.png");
            background-size: 100% 100%;
        }

        background-size: 100% 100%;
    }
}
</style>
