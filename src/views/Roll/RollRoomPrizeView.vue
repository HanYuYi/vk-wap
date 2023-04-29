<script setup lang="ts">
import RollPrizeItem from "./RollPrizeItem.vue"
import { useSysStore } from "@/stores/system"
import { useRouter, onBeforeRouteLeave } from "vue-router"
import type { Router } from "vue-router"
import type { RollView } from "@/api/pojo/RollView"

const router: Router = useRouter()
const systemParams = useSysStore()
const routeParams = systemParams.routeParams as { prize: RollView["items"] }

if (!("prize" in routeParams)) {
    router.back()
}
onBeforeRouteLeave(() => {
    systemParams.setRouteParams<{}>({})
})
</script>

<template>
    <div class="rollroom-prize-page bg-#e8f1ef font-classic">
        <HeaderBar>
            <div class="header_title">奖池</div>
        </HeaderBar>
        <div class="expand-page pl-12px py-10px">
            <RollPrizeItem :items="routeParams?.prize ?? []" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.roll_item_list {
    display: flex;
    flex-wrap: wrap;
    margin-right: 6px;
    :deep(.item_box) {
        width: 1.13rem;
        height: 0.75rem;
        margin: 0.06rem 0.06rem 0.06rem 0;
        text-align: center;
        position: relative;
        color: #f5f5f5;
        background-color: rgba(0, 0, 0, 0.4);
    }
}
</style>
