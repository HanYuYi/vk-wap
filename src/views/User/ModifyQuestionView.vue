<script setup lang="ts">
import Block from "./block.vue"
import SuccessToast from "./UserToast.vue"
import ApiSetting from "@/api/service"
import { useSysStore } from "@/stores/system"
import { formatterStr } from "@/composable/validate"
import { computed, onBeforeMount, ref, watch } from "vue"
import { showToast } from "vant"
import { HttpPlus } from "@/api/HttpPlus"
import type { UserSafeQuestion } from "@/api/pojo/UserSafeQuestion"

const systemParams = useSysStore()

type SecurityQuestion = UserSafeQuestion["securityQuestion"]

type SecurityQuestionItem = SecurityQuestion[number]

type ColumnsItem = { text: SecurityQuestionItem["question"]; value: SecurityQuestionItem["ques_id"] }

// 是否校验通过
const showQuestions = ref(false)
const answerone = ref("")
const answertwo = ref("")
const quesone = ref<Partial<ColumnsItem>>({})
const questwo = ref<Partial<ColumnsItem>>({})

const headTitle = computed(() => {
    if ("has_question" in systemParams.userInfo && systemParams.userInfo.has_question) {
        if (!showQuestions.value) {
            return "验证密保"
        } else {
            return "修改密保"
        }
    }
    return "设置密保"
})

const btnText = computed(() => {
    if ("has_question" in systemParams.userInfo && systemParams.userInfo.has_question) {
        if (!showQuestions.value) {
            return "验证问题"
        } else {
            return "确认修改"
        }
    }
    return "保存"
})

// 之前已经有密保的
const existQues = ref<Partial<SecurityQuestionItem>>({})
const rand = ref(9999) // 有密保接口返回的，用于传参验证

const loadQuestionData = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.user.getSafeQuestion)
    const res = await HttpPlus.sendHttpRequest<UserSafeQuestion>()
    if (res.status === 1 && res.data) {
        if (res.data?.questionId) {
            rand.value = res.data?.rand
            existQues.value = res.data.securityQuestion.find(
                (item: SecurityQuestionItem) => item.ques_id === res.data?.questionId
            )
        }
        columns.value = res.data.securityQuestion.map((item: SecurityQuestionItem) => {
            return {
                text: item.question,
                value: item.ques_id
            }
        })
    }
}

const submitDisable = computed<boolean>(() => {
    if (Object.keys(existQues.value).length) {
        return !answerone.value
    }
    return !answerone.value || !answertwo.value || !Object.keys(quesone.value).length || !Object.keys(questwo.value).length
})
const submitLoading = ref(false)

const reset = (): void => {
    answerone.value = ""
    answertwo.value = ""
    quesone.value = {}
    questwo.value = {}
}

type SubmitParameters = {
    answerone: typeof answerone.value
    answertwo: typeof answertwo.value
}

const onSubmit = async (values: SubmitParameters): Promise<void> => {
    // 已经有了密保
    if (Object.keys(existQues.value).length && !showQuestions.value) {
        const params = {
            answer: answerone.value,
            rand: rand.value
        }
        submitLoading.value = true
        try {
            HttpPlus.setUrlOptions(ApiSetting.user.verifySafeQuestion)
            const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
            submitLoading.value = false
            if (res.status === 1) {
                answerone.value = ""
                showQuestions.value = true
            }
        } catch (error: unknown) {
            submitLoading.value = false
            console.error(error)
        }
    } else {
        if (quesone.value === questwo.value) {
            showToast({
                className: "vk-toast-fail",
                message: "问题1和问题2不能一样",
                icon: "warning"
            })
            return
        }
        const params = {
            question_id_1: quesone.value?.value,
            question_id_2: questwo.value?.value,
            answer_1: values.answerone,
            answer_2: values.answertwo
        }
        submitLoading.value = true
        try {
            HttpPlus.setUrlOptions(ApiSetting.user.setSafeQuestion)
            const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
            submitLoading.value = false
            if (res.status === 1) {
                if ("has_question" in systemParams.userInfo) systemParams.userInfo.has_question = true
                reset()
                systemParams.showSuccessDio = true
            }
        } catch (error: unknown) {
            submitLoading.value = false
            console.error(error)
        }
    }
}

// 展示题目
const quesType = ref(1) // 1：选中了第一题，2：选中了第二题
const show = ref(false)
const showPicker = ref(false) // 为了用vif清除picker缓存
const selectedId = ref<ColumnsItem["value"][]>([])

const columns = ref<ColumnsItem[]>([])

watch(show, (val: boolean) => {
    let timer: number
    if (!val) {
        timer = setTimeout(() => {
            clearTimeout(timer)
            showPicker.value = false
        }, 300)
    } else {
        showPicker.value = true
    }
})

const showQues = (type: number): void => {
    selectedId.value = []
    quesType.value = type
    if (type === 1) {
        if (Object.keys(quesone.value).length) {
            selectedId.value.push(quesone.value?.value)
        }
        show.value = true
    }
    if (type === 2) {
        if (Object.keys(questwo.value).length) {
            selectedId.value.push(questwo.value?.value)
        }
        show.value = true
    }
}
const onCancel = (): void => {
    show.value = false
}

const onConfirm = (): void => {
    const select = columns.value.find((item: ColumnsItem) => item.value === selectedId.value[0])
    if (select) {
        if (quesType.value === 1) {
            quesone.value = select
        }
        if (quesType.value === 2) {
            questwo.value = select
        }
    }
    show.value = false
}

onBeforeMount(() => loadQuestionData())
</script>

<template>
    <div class="personal-page bg-mypageColor">
        <HeaderBar>
            <div class="header_title">{{ headTitle }}</div>
        </HeaderBar>
        <div class="expand-page py-12px">
            <van-form label-width="0.64rem" class="userset-form" @submit="onSubmit">
                <van-cell-group class="bg-transparent!" inset>
                    <template v-if="systemParams.userInfo.has_question && !showQuestions">
                        <div>
                            <Block
                                class="m-0! px-16px!"
                                :title="'问题一'"
                                :titleLable="existQues?.question"
                                :showlabel="false"
                                :disable="true"
                            ></Block>
                            <div class="input_box">
                                <van-field
                                    :border="false"
                                    v-model="answerone"
                                    clearable
                                    name="answerone"
                                    label="答案"
                                    :formatter="formatterStr"
                                    placeholder="请输入答案"
                                />
                            </div>
                        </div>
                    </template>
                    <template v-if="showQuestions || !systemParams.userInfo.has_question">
                        <div>
                            <Block
                                @click="showQues(1)"
                                class="m-0! px-16px!"
                                :title="'问题一'"
                                :titleLable="quesone?.text ? quesone?.text : '请选择密保问题'"
                                :showlabel="false"
                            ></Block>
                            <div class="input_box">
                                <van-field
                                    :border="false"
                                    v-model="answerone"
                                    clearable
                                    name="answerone"
                                    label="答案"
                                    :formatter="formatterStr"
                                    placeholder="请输入答案"
                                />
                            </div>
                        </div>
                        <div>
                            <Block
                                @click="showQues(2)"
                                class="mx-0! px-16px! mt-12px"
                                :title="'问题二'"
                                :titleLable="questwo?.text ? questwo?.text : '请选择密保问题'"
                                :showlabel="false"
                            ></Block>
                            <div class="input_box">
                                <van-field
                                    :border="false"
                                    v-model="answertwo"
                                    clearable
                                    name="answertwo"
                                    label="答案"
                                    :formatter="formatterStr"
                                    placeholder="请输入答案"
                                />
                            </div>
                        </div>
                    </template>
                </van-cell-group>
                <div class="mt-20px w-351px m-auto">
                    <van-button
                        block
                        :disabled="submitDisable"
                        :loading="submitLoading"
                        class="button_primary_2022 border-none h-45px! leading-45px! font-bold text-white!"
                        :class="{
                            'from-#d7dede! to-#d0d8d6! bg-gradient-to-r! opacity-100!': submitDisable
                        }"
                        native-type="submit"
                    >
                        {{ btnText }}
                    </van-button>
                </div>
            </van-form>
        </div>
        <van-popup
            :overlayStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }"
            round
            teleport="body"
            class="question-overpop"
            v-model:show="show"
            position="bottom"
        >
            <template v-if="showPicker">
                <van-picker
                    @confirm="onConfirm"
                    @cancel="onCancel"
                    v-model="selectedId"
                    title="选择密保问题"
                    :columns="columns"
                />
            </template>
        </van-popup>
        <SuccessToast message="密保设置成功!" />
    </div>
</template>

<style lang="scss" scoped>
@import "common.scss";
</style>
<style lang="scss">
.van-dialog.success-newdiolog {
    border-radius: 12px;
}
</style>
