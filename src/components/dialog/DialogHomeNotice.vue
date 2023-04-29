<script lang="ts">
import { ref, defineComponent } from "vue"
import type { PropType } from "vue"
import { useSysStore } from "@/stores/system"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import type { IndexIndexV2 } from "@/api/pojo/IndexIndexV2"

export default defineComponent({
    props: {
        selectNotice: Object as PropType<Partial<IndexIndexV2["notice"][0]>>
    },

    setup() {
        const router: Router = useRouter()
        const systemParams: ReturnType<typeof useSysStore> = useSysStore()

        const show = ref<boolean>(false)

        return {
            show,
            router,
            systemParams
        }
    }
})
</script>

<template>
    <van-dialog teleport="body" v-model:show="show" :show-confirm-button="false" className="home-diolog bg-white!">
        <div
            class="gg-close"
            @click="
                () => {
                    systemParams.appRootBlur = false
                    show = false
                }
            "
        ></div>
        <div class="gg-wrapper">
            <div class="title">{{ selectNotice.title }}</div>
            <div class="time font-robot">{{ selectNotice.create_time }}</div>
            <div class="content" v-html="selectNotice.content_cn"></div>
            <div class="btn primary-btn" @click.stop="router.push({ path: '/messages', query: { id: 1 } })">查看更多</div>
        </div>
    </van-dialog>
</template>

<style lang="scss">
$maincolor: #222;
.van-dialog.home-diolog {
    .gg-wrapper {
        width: 100%;
        padding: 19px 15px 28px;

        .title {
            font-size: 17px;
            font-weight: bold;
            color: $maincolor;
        }

        .time {
            margin-top: 2px;
            font-size: 12px;
            color: #b4b4b4;
        }

        .content {
            margin-top: 8px;
            text-align: left;
            color: #4b566b;
            font-size: 14px;
            line-height: 1.6;
            max-height: 200px;
            overflow: hidden;
            overflow-y: scroll;
        }

        .btn {
            margin-top: 19px;
            width: 100%;
            height: 44px;
            border-radius: 4px;
            font-size: 15px;
            color: $maincolor;
            line-height: 44px;
        }
    }
}
</style>
