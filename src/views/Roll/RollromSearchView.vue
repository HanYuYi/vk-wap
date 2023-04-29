<script setup lang="ts">
import RollRoomItem from "./RollRoomItem.vue"
import ApiSetting from "@/api/service"
import { showToast } from "vant"
import { nextTick, onMounted, ref } from "vue"
import { useSysStore } from "@/stores/system"
import type { RollGetList } from "@/api/pojo/RollGetList"
import { HttpPlus } from "@/api/HttpPlus"
import type { FieldInstance } from "vant"

const systemParams = useSysStore()

const rollRoomId = ref("")
const rollRoomList = ref<RollGetList["list"]>([])
const searchInputRef = ref<FieldInstance | null>(null)

const getRollRoomList = async () => {
    if (!rollRoomId.value || typeof Number(rollRoomId.value) !== "number") {
        return showToast({
            className: "vk-toast-fail",
            message: "请输入数字",
            icon: "warning"
        })
    }
    rollRoomList.value = []
    let data = {
        room_id: rollRoomId.value
    }
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.roll.getRollRoomList)
    const res = await HttpPlus.sendHttpRequest<RollGetList, typeof data>(data)
    systemParams.PageLoading = false

    if (res.status === 1) {
        if (res.data.list.length) {
            rollRoomList.value = res.data.list
        } else {
            showToast({
                className: "vk-toast-fail",
                message: "此房间号不存在，请确认输入是否正确",
                icon: "warning"
            })
        }
    }
}

onMounted(async (): Promise<void> => {
    await nextTick()
    if (searchInputRef.value) {
        searchInputRef.value?.focus()
    }
    const input: HTMLInputElement = document.querySelector(".van-field__control")
    if (input) {
        input.focus()
    }
})
</script>

<template>
    <div class="rollsearch-page bg-#e8f1ef font-classic">
        <HeaderBar @search="getRollRoomList">
            <van-field
                class="input py-0 px-10px w-285px h-36px leading-36px rounded-20px text-14px bg-#666"
                autocomplete="off"
                ref="searchInputRef"
                autofocus
                type="digit"
                clearable
                v-model="rollRoomId"
                placeholder="请输入房间号"
            />
        </HeaderBar>
        <div class="expand-page">
            <roll-room-item v-for="item in rollRoomList" :key="item.id" :item="item"></roll-room-item>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.rollsearch-page {
    .input {
        :deep(.van-field__control) {
            color: white;
            font-weight: bold;
        }
    }
}
</style>
