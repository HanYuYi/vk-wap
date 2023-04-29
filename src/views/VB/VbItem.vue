<script setup lang="ts">
import { usePlaceImg } from "@/utils/globalImgs"
import { reactive } from "vue"

const { lazyGoods } = usePlaceImg()

/**
 * Props
 */
interface Props {
    data?:
        | {
              goods_pic: string

              goods_name: string

              show_time: string
          }
        | {}
}

const props = withDefaults(defineProps<Props>(), {
    data: () => ({})
})

const data = reactive(props.data)
</script>

<template>
    <div class="vb_block hstack h-100px px-16px relative">
        <slot>
            <div class="img-wrapper overflow-hidden w-60px h-60px flex-center rounded-10px border border-#dcdddd">
                <img
                    class="max-w-60px max-h-60px"
                    v-lazy="{
                        src: data?.goods_pic,
                        error: lazyGoods,
                        loading: lazyGoods
                    }"
                    alt=""
                />
            </div>
            <div class="h-60px ml-12px">
                <div class="text-14px text-#30403a font-bold leading-24px mt-4px">
                    {{ data?.goods_name }}
                </div>
                <div class="text-12px text-#9da4a4 leading-20px mt-8px">
                    {{ data?.show_time }}
                </div>
            </div>
        </slot>
    </div>
</template>

<style lang="scss" scoped>
.vb_block {
    box-shadow: 0 2px 6px 0 rgba(52, 166, 202, 0.05);
    border-bottom: #e5e6e6 1px solid;
    background-color: white;
    &:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
    &:last-child {
        border-bottom: none;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
    &.vb_block_last {
        border-bottom: none;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
}
</style>
