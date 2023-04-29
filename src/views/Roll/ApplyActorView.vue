<script setup lang="ts">
import ApiSetting from "@/api/service"
import { computed } from "vue"
import { showToast } from "vant"
import { ref } from "vue"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { formatterStr } from "@/composable/validate"
import { HttpPlus } from "@/api/HttpPlus"
import type { RollGetUserProfile } from "@/api/pojo/RollGetUserProfile"

const router: Router = useRouter()

type ApplyTags = RollGetUserProfile["applyTags"]

type ActorsItem = { isSelect?: boolean } & ApplyTags[number]

const actorsList = ref<Array<ActorsItem>>([])

const selectActorIds = computed(() => {
    const res: ActorsItem["id"][] = []
    const arr = actorsList.value.filter((item: ActorsItem) => item.isSelect)
    arr.forEach((item: ActorsItem) => {
        res.push(item.id)
    })
    return res
})

const choose = (item: ActorsItem): void => {
    actorsList.value = actorsList.value.map((ele: ActorsItem) => {
        if (ele.id === item.id) {
            return {
                ...ele,
                isSelect: !ele.isSelect
            }
        } else {
            return ele
        }
    })
}

// 表单
const contact = ref("")
const link = ref("")

const btnDisable = computed<boolean>(() => {
    return !contact.value || !link.value || !selectActorIds.value.length
})

const btnLoading = ref(false)

const onSubmit = async (): Promise<void> => {
    btnLoading.value = true
    try {
        const params = {
            tag_ids: selectActorIds.value.join(","),
            contact: contact.value,
            url: link.value
        }
        HttpPlus.setUrlOptions(ApiSetting.roll.applyRollTags)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        btnLoading.value = false

        if (res.status === 1) {
            showToast({
                className: "vk-toast-success",
                message: "申请成功",
                icon: "checked"
            })
            const timer = setTimeout(() => {
                clearTimeout(timer)
                router.push("/myroll")
            }, 300)
        }
    } catch (error: unknown) {
        btnLoading.value = false
        throw error
    }
}

const getUserProfile = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.roll.getUserProfile)
    const res = await HttpPlus.sendHttpRequest<RollGetUserProfile>()

    if (res.status === 1) {
        if (res.data.applyed == 1) {
            router.push("/myroll")
        }
        actorsList.value = res.data.applyTags.map((item: Omit<ActorsItem, "isSelect">) => {
            return { ...item, isSelect: false }
        })
    }
}

getUserProfile()
</script>

<template>
    <div class="rollactor-page bg-#e8f1ef font-classic">
        <HeaderBar>
            <div class="header_title">申请认证</div>
        </HeaderBar>

        <div class="expand-page">
            <div class="py-15px flex-center">
                <div
                    class="w-70px h-36px leading-36px text-center text-#7c839f mx-5px text-14px rounded-4px"
                    v-for="(item, index) in actorsList"
                    :class="{
                        'primary-btn': item?.isSelect,
                        'border border-#7c839f': !item?.isSelect
                    }"
                    @click="choose(item)"
                    :key="index"
                >
                    {{ item.tag_name }}
                </div>
            </div>
            <van-form input-align="right" @submit="onSubmit">
                <van-field
                    class="bg-transparent leading-40px"
                    v-model="contact"
                    name="contact"
                    label="联系方式"
                    :formatter="formatterStr"
                    placeholder="请输入您的联系方式，为认证ID"
                    clearable
                />
                <van-field
                    class="bg-transparent leading-40px"
                    v-model="link"
                    name="link"
                    label="认证链接"
                    :formatter="formatterStr"
                    placeholder="请输入您的认证链接，为认证ID"
                    clearable
                />
                <div class="mt-40px mb-10px mx-auto w-350px">
                    <van-button
                        :disabled="btnDisable"
                        :loading="btnLoading"
                        native-type="submit"
                        class="primary-btn h-30px leading-30px text-15px text-#000 rounded-30px"
                        block
                    >
                        提交申请
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>
