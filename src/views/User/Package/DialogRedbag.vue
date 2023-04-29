<script setup lang="ts">
import { ref, watch } from "vue"

/**
 * Props
 */
interface Props {
    showRed: boolean

    money: number | string
}

const props = withDefaults(defineProps<Props>(), {
    showRed: false,

    money: 0
})

const show = ref(false)

watch(
    () => props.showRed,
    (val: Props["showRed"]) => {
        show.value = val
    }
)
</script>

<template>
    <div v-if="show">
        <van-dialog
            teleport="body"
            close-on-click-overlay
            v-model:show="show"
            :show-confirm-button="false"
            @close="$emit('close')"
            className="package-redbag-diolog"
        >
            <div class="mybag h-400px w-full relative overflow-hidden">
                <div class="mybag_bg1"></div>
                <div class="mybag_bg2">
                    <span>恭喜您获得</span>
                    <br />
                    <strong>{{ props.money }}</strong>
                    <span>元</span>
                </div>
                <div class="mybag_bg3"></div>
                <div class="mybag_btn" @click="$emit('close')"></div>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss">
@keyframes redup {
    0% {
        bottom: -1rem;
    }

    100% {
        bottom: 1.4rem;
    }
}

.package-redbag-diolog {
    width: 303.5px;
    line-height: 1.6;

    .mybag_bg1,
    .mybag_bg2,
    .mybag_bg3,
    .mybag_btn {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .mybag_bg1 {
        width: 3.035rem;
        height: 1.26rem;
        bottom: 1.7rem;
        background: url("@/assets/img/template/july/package/mybag_bg1.png") no-repeat;
        background-size: contain;
    }

    .mybag_bg2 {
        box-sizing: border-box;
        padding-top: 0.4rem;
        width: 2.925rem;
        height: 2.07rem;
        bottom: 1.4rem;
        background: url("@/assets/img/template/july/package/mybag_bg2.png") no-repeat;
        background-size: contain;
        animation: redup 0.5s linear;
        text-align: center;

        span {
            font-size: 0.24rem;
            letter-spacing: 0.02rem;
            color: #e5152d;
        }

        strong {
            font-weight: normal;
            font-size: 0.5rem;
            color: #e5152e;
            line-height: 1.2;
        }
    }

    .mybag_bg3 {
        width: 3.035rem;
        height: 2.355rem;
        bottom: 0;
        background: url("@/assets/img/template/july/package/mybag_bg3.png") no-repeat;
        background-size: contain;
    }

    .mybag_btn {
        width: 0.9rem;
        height: 1.2rem;
        bottom: 0.2rem;
        background: url("@/assets/img/template/july/package/mybag_btn.png") no-repeat;
        background-size: contain;
    }
}
</style>
