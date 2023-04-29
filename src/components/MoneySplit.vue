<script setup lang="ts">
import { formatNumberSplit } from "@/utils/numberUtils"
import { computed } from "vue"

/**
 * Props
 */
interface Props {
    amount?: number | string

    diglen?: number

    showSymbol?: boolean

    showSuffix?: boolean

    suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
    amount: 0,

    diglen: 2,

    showSymbol: false,

    showSuffix: false,

    suffix: "%"
})

const moneyArr = computed<string[]>(() => formatNumberSplit(Number(props.amount)).split("."))
</script>

<template>
    <div class="MoneySplit font-robot">
        <template v-if="props.showSymbol">
            <slot name="symbol">￥</slot>
        </template>
        <template v-if="props.diglen > 0">
            <span class="big-num">{{ moneyArr[0] }}.</span>
            <span class="small-num">
                {{ moneyArr[1] }}
                <i class="suffix" v-if="props.showSuffix">{{ props.suffix }}</i>
            </span>
        </template>
        <template v-else>
            <span class="big-num">
                {{ moneyArr[0] }}
                <i class="suffix" v-if="props.showSuffix">{{ props.suffix }}</i>
            </span>
        </template>
    </div>
</template>
