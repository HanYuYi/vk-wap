<script setup lang="ts">
import { useSysStore } from "@/stores/system"
import { ref, watch } from "vue"

const systemParams = useSysStore()

const show = ref(false)

watch(
    () => systemParams.isShowKFSelect,
    (val: boolean) => {
        show.value = val
    }
)

const close = (): void => {
    systemParams.appRootBlur = false
    systemParams.isShowKFSelect = false
}

const selectLine = (index: number): void => {
    // 切换到对应线路，打开客服窗口
    systemParams.KFListIndex = index
    close()
    systemParams.UpdateKFDialogShow(true)
}
</script>

<template>
    <van-dialog
        teleport="body"
        close-on-click-overlay
        :overlayStyle="{ background: 'rgba(0,0,0,.7)' }"
        v-model:show="show"
        :show-confirm-button="false"
        @close="close"
        className="home-diolog service-line-diolog"
    >
        <div class="overflow-hidden px-15px rounded-8px" :class="systemParams.KFUrlByList.length > 1 ? 'more' : 'single'">
            <h3 class="text-left mt-20px text-16px text-white leading-16px tracking-0.8px font-bold">客户服务中心</h3>
            <div class="text-left mt-7px text-14px leading-14px tracking-0.7px text-#acbae2">7*24h专业客服，为您服务</div>
            <ul class="mt-24.5px">
                <li class="mb-12px" v-for="(item, index) in systemParams.KFUrlByList" :key="index">
                    <button :class="index === 0 ? 'button_primary_2022' : 'button_plain_2022'" @click="selectLine(index)">
                        {{ item?.name }}
                    </button>
                </li>
            </ul>
        </div>
    </van-dialog>
</template>

<style lang="scss">
.service-line-diolog {
    background: transparent;
    padding-top: 18px;
    .van-dialog__content {
        &:before {
            pointer-events: none;
            position: absolute;
            content: "";
            right: 0;
            top: 0;
            width: 148px;
            height: 102px;
            background-image: url("@/assets/img/service_line_bg.png");
            background-size: 100% 100%;
        }
    }
    .single {
        height: 155.8px;
        background-image: url("@/assets/img/service_line_bg_1.png");
        background-size: 100% 100%;
    }
    .more {
        height: 208px;
        background-image: url("@/assets/img/service_line_bg_2.png");
        background-size: 100% 100%;
    }
}
</style>
