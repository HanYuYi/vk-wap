<script setup lang="ts">
import { ref, watch, unref } from "vue"
import { useRouter } from "vue-router"
import { useSysStore } from "@/stores/system"
import { useFreshStore } from "@/stores/fresh"
import { showToast } from "vant"

const freshStore = useFreshStore()
const systemParams = useSysStore()
const router = useRouter()

/**
 * Props
 */
interface Props {
    show: boolean

    id: number
}
const props = withDefaults(defineProps<Props>(), {
    show: false,

    id: 0
})

const emit = defineEmits(["loadpackage"])

const show = ref(false)
watch(
    () => props.show,
    (val: Props["show"]) => {
        show.value = val
    }
)

// 编辑地址
const editAddress = (): void => {
    show.value = false
    systemParams.routeParams = { deStatus: "edit", id: unref(props.id) }
    router.push("/packageAddress")
}

// 继续使用
const reuse = async (): Promise<void> => {
    const res: boolean = await freshStore.confirmExpress({
        address_id: freshStore.userAddress?.id,
        package_id: unref(props.id)
    })
    if (res) {
        showToast({
            className: "vk-toast-success",
            message: "我们会尽快发货",
            icon: "checked"
        })
        emit("loadpackage")
    }
    show.value = false
}
</script>

<template>
    <div v-if="show">
        <van-dialog
            teleport="body"
            @confirm="reuse"
            @cancel="editAddress"
            cancel-button-text="编辑地址"
            confirm-button-text="继续使用"
            cancel-button-color="#7d839d"
            confirm-button-color="#00bf6d"
            showCancelButton
            close-on-click-overlay
            v-model:show="show"
            @close="$emit('close')"
            className="package-address-diolog"
        >
            <div class="vbprize_got_dialog_box">
                <div class="title text-17px text-oldText mb-6px">是否继续使用上次收货地址？</div>
                <div class="confirm-goods-form">
                    <div class="line">
                        <div class="label link">收货人姓名</div>
                        <div class="desc">{{ freshStore.userAddress?.receive }}</div>
                    </div>
                    <div class="line">
                        <div class="label link">手机号码</div>
                        <div class="desc">{{ freshStore.userAddress?.phone }}</div>
                    </div>
                    <div class="line">
                        <div class="label link">收货地址</div>
                        <div class="desc">
                            {{ freshStore.userAddress?.province }}, {{ freshStore.userAddress?.city }}
                            <br />
                            {{ freshStore.userAddress?.address }}
                        </div>
                    </div>
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss">
.package-address-diolog {
    width: 325px;
    border-radius: 0.09rem;
    background-color: #fff;
    line-height: 1.6;
    .vbprize_got_dialog_box {
        text-align: center;
        color: #262933;
        padding: 0.18rem 0.2rem;
        font-size: 0.15rem;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;

        &.exchang_before {
            line-height: 1.9;
            padding-top: 0.24rem;
            padding-bottom: 0.24rem;
        }

        .img_box {
            height: 0.7rem;
            margin: 0.06rem auto;

            img {
                max-width: 100%;
                max-height: 100%;
            }
        }

        .confirm-goods-form {
            .line {
                display: flex;
                justify-content: center;
                align-items: flex-start;
            }

            .label {
                text-align: right;
                width: 0.8rem;
            }

            .desc {
                margin-top: 0.02rem;
                margin-left: 0.2rem;
                width: 1.54rem;
                text-align: left;
            }

            .copy-btn {
                color: #e31212;
                text-decoration: underline;
                margin-left: 0.06rem;
            }
        }

        .link {
            color: #7c839f;
            margin-top: 0.02rem;

            a {
                color: #e31212;
                text-decoration: underline;
            }
        }
    }
}
</style>
