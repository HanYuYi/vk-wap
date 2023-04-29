<script setup lang="ts">
import { computed } from "vue"

/**
 * Props
 */
interface Props {
    num: string | number

    disable?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    num: 0,

    disable: false
})

const count = computed<string>(() => (Number(props.num) > 99 ? "99+" : Number(props.num) + ""))
</script>

<template>
    <div
        v-if="props.num > 0"
        class="vk-badge-wrapper"
        :class="{
            'vk-badgefull': Number(props.num) > 99,
            'vk-badge-wide': props.num.toString().length === 2
        }"
    >
        <span>{{ count }}</span>
    </div>
</template>

<style lang="scss" scoped>
.vk-badge-wrapper {
    min-width: 18px;
    height: 18px;
    box-sizing: border-box;
    padding: 1px 3px;
    border-radius: 14px;
    font-size: 12px;
    line-height: 1.2;
    color: white;
    background-color: #fc3e3e;
    margin-left: 5px;
    text-align: center;

    span {
        display: inline-block;
        transform: scale(0.9);
    }
}
</style>
