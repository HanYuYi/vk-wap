<script setup lang="ts">
import useClipboard from "vue-clipboard3"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { useSysStore } from "@/stores/system"
import { onMounted, nextTick } from "vue"
import { showToast } from "vant"

const systemParams = useSysStore()
const router: Router = useRouter()
const { toClipboard } = useClipboard()

onMounted(() => {
    nextTick(() => {
        const copyDom: HTMLElement = document.getElementById("copyBtn")
        const bagDom: HTMLElement = document.getElementById("bagBtn")
        if (copyDom) {
            copyDom.addEventListener("click", async () => {
                await toClipboard(systemParams.routeParams?.copy)
                showToast({
                    className: "vk-toast-success",
                    message: "快递单号复制成功",
                    icon: "checked"
                })
            })
        }
        if (bagDom) {
            if (systemParams.routeParams?.jump_wap.url) {
                bagDom.addEventListener("click", () => {
                    router.push(`${systemParams.routeParams?.jump_wap.url}`)
                })
            }
        }
    })
})
</script>

<template>
    <div class="message-page bg-light-green">
        <HeaderBar>
            <div class="header_title">
                {{ systemParams.routeParams.headtit ?? "详情" }}
            </div>
        </HeaderBar>
        <div class="expand-page pt-18px px-12px leading-relaxed">
            <h5 class="detail_title text-16px text-center text-oldText font-bold" v-html="systemParams.routeParams?.title"></h5>
            <p class="detail_time text-#c6d0db text-center text-12px mt-5px">
                {{ systemParams.routeParams?.time }}
            </p>
            <p class="detail_text text-#7c839f mt-18px" v-html="systemParams.routeParams?.content"></p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
:deep(.theme-text) {
    color: #e34d12;
    text-decoration: underline;
    &.copy-text {
        margin-left: 0.1rem;
    }
}
</style>
