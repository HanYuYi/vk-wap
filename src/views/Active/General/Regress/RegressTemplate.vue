<script setup lang="ts">
import { computed } from "vue"
import { useSysStore } from "@/stores/system"

const systemParams = useSysStore()

/**
 * Props
 */
interface Props {
    btnLoading: boolean

    btnStatus: number

    activeType: number

    activeTime?: string

    tableTitle: { label: string }[]

    tableData: { first: string; second: string }[]
}

const props = defineProps<Props>()

const btnText = computed(() => {
    if (props.btnStatus == 1) {
        return "已领取"
    }
    return "立即领取"
})

const disBtn = computed<boolean>(() => {
    if (systemParams.isLogin) {
        // 1 已领取 2 未满足条件
        if (props.activeType == 1) {
            return props.btnStatus == 1 || props.btnStatus == 2
        }
        if (props.activeType == 2) {
            return props.btnStatus == 1
        }
        if (props.activeType == 3) {
            return props.btnStatus == 1
        }
    }
    return false
})
</script>

<template>
    <div>
        <!-- 活动时间 -->
        <div class="regress-title-wrapper text-center title-time">
            <span>活动时间</span>
        </div>
        <div class="regress-table-wrapper text-center title-time">
            {{ props.activeTime }}
        </div>
        <!-- 活动内容 -->
        <div class="regress-title-wrapper text-center">
            <span>活动内容</span>
        </div>
        <div class="regress-table-wrapper">
            <div class="table-desc">
                <slot name="desc"></slot>
            </div>
            <table width="100%" border="0" cellspacing="0" class="text-center">
                <thead>
                    <tr>
                        <th v-for="(item, i) in props.tableTitle" :key="i">{{ item.label }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in props.tableData" :key="i">
                        <td>{{ item.first }}</td>
                        <td class="text-#0ee9e5">{{ item.second }}</td>
                        <slot v-if="i === 0" name="rowspan"></slot>
                    </tr>
                </tbody>
            </table>
        </div>
        <slot></slot>
        <div class="regress-btn btn-loading-wrapper" v-if="props.btnLoading">
            <van-loading class="ab-center" type="spinner" />
        </div>
        <div v-else @click="$emit('getbonus', disBtn)" class="regress-btn join-btn" :class="{ 'btn-disable': disBtn }">
            {{ btnText }}
        </div>
        <!-- 活动规则 -->
        <div class="regress-title-wrapper text-center">
            <span>活动规则</span>
        </div>
        <div class="regress-table-wrapper gz-content">
            <slot name="gz"></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "regress.scss";
.regress-title-wrapper {
    margin: 0.3rem auto 0;
    font-size: 0.16rem;
    font-weight: bold;
    letter-spacing: 0.0122rem;
    text-shadow: 0px 0.01rem 0.02rem rgba(0, 0, 0, 0.65);

    &.title-time {
        margin-top: 0;
    }

    span {
        line-height: 1;
        width: fit-content;
        position: relative;

        &::before {
            content: "";
            position: absolute;
            top: -0.01rem;
            left: -0.33rem;
            background: url("@/assets/img/active/general/regress/title-bg.png") no-repeat center;
            background-size: 100% 100%;
            width: 0.2rem;
            height: 0.2rem;
        }

        &::after {
            content: "";
            position: absolute;
            top: -0.01rem;
            right: -0.33rem;
            background: url("@/assets/img/active/general/regress/title-bg.png") no-repeat center;
            background-size: 100% 100%;
            width: 0.2rem;
            height: 0.2rem;
        }
    }
}

.regress-table-wrapper {
    width: 3.45rem;
    margin: 0.13rem auto 0;
    box-sizing: border-box;
    padding: 0.14rem 0.2rem;
    font-size: 0.15rem;
    line-height: 1.33;
    border-radius: 0.05rem;
    border: solid 0.01rem #0ee9e5;
    background-color: rgba(0, 55, 81, 0.8);
    overflow: hidden;
    .table-desc {
        margin-bottom: 0.12rem;
    }
    &.title-time {
        line-height: 1;
    }
    &.gz-content {
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
        padding-left: 0.24rem;
        padding-right: 0.24rem;
    }
}
</style>
