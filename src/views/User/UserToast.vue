<script setup lang="ts">
import { useCountDown } from "@vant/use"
import { useSysStore } from "@/stores/system"
import { useRouter } from "vue-router"
import { watch, unref } from "vue"

const systemParams = useSysStore()
const router = useRouter()

/**
 * Props
 */
interface Props {
    message: string

    btntxt?: string

    path?: string
}

const props = withDefaults(defineProps<Props>(), {
    btntxt: "个人中心",

    path: "/user"
})

const countDown = useCountDown({
    time: 4 * 1000,
    onFinish: () => {
        toMyPage()
    }
})
const countdownTime = countDown.current

watch(
    () => systemParams.showSuccessDio,
    (val: boolean) => {
        if (val) {
            countDown.start()
        }
    }
)

const toMyPage = (): void => {
    systemParams.showSuccessDio = false
    router.push(unref(props.path))
    countDown.reset()
}
</script>

<template>
    <div v-if="systemParams.showSuccessDio">
        <van-dialog
            :overlayStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }"
            teleport="body"
            :show-confirm-button="false"
            className="success-newdiolog"
            v-model:show="systemParams.showSuccessDio"
        >
            <div class="w-250px h-240px bg-white text-center py-28px px-10px">
                <img class="w-60px h-60px" src="@/assets/img/template/july/my/set/success.png" alt="" />
                <div class="text-18px text-#30403a font-bold leading-snug mt-6px mb-5px">
                    {{ props.message }}
                </div>
                <div class="text-12px text-#9da4a4 leading-relaxed">
                    <span class="text-#5ad8b5">{{ countdownTime.seconds }}S</span>
                    后自动跳转至{{ props.btntxt }}
                </div>
                <div
                    @click="toMyPage"
                    class="mt-25px m-auto w-140px h-40px bg-#f6f8f8 border border-#dcdcdd rounded-6px text-12px text-#939c99 text-center leading-40px"
                >
                    返回{{ props.btntxt }}
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss">
.van-dialog.success-newdiolog {
    width: 250px;
}
</style>
