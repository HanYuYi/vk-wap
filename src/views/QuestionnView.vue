<script setup lang="ts">
import ApiSetting from "@/api/service"
import { onBeforeMount, ref, computed } from "vue"
import { useSysStore } from "@/stores/system"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { showToast } from "vant"
import { formatterStr } from "@/composable/validate"
import useClipboard from "vue-clipboard3"
import { HttpPlus } from "@/api/HttpPlus"
import type { Data, ActiveGetSurveyGammaInit } from "@/api/pojo/active/ActiveGetSurveyGammaInit"
import type { ActiveSurveyGammaJoin } from "@/api/pojo/active/ActiveSurveyGammaJoin"

const router: Router = useRouter()
const systemParams = useSysStore()

const { toClipboard } = useClipboard()

const doCopy = async (text?: string): Promise<void> => {
    if (text) {
        try {
            await toClipboard(text)
            showToast({ className: "vk-toast-success", message: "复制成功", icon: "checked" })
        } catch (e: unknown) {
            console.error(e)
            throw e
        }
    }
}

const submitting = ref(false)
const continueDio = ref(false)
const isSubmitNow = ref(false) // 是否直接提交
const submitLoading = ref(false)
const lastFocus = ref(false)
const load = ref(false)
const quesObj = ref<ActiveGetSurveyGammaInit>(null)
const isFirst = ref(true)
const firstYes = ref(false) // 首次问卷第二题选择的是（是否在其他平台游戏过，默认没有）
const isFinished = ref(false) // 本月是否结束答题
const answerPicked = ref(0) // 单选
const answerSelected = ref<number[]>([]) // 多选
const otherText = ref("") // 用户输入的其他建议
const lastAdvice = ref("") // 最后一题输入框

type AnsweredItem = {
    empty: boolean
    answered: number | number[] | string
    advice: string
} & Pick<Data, "no" | "type" | "vCoin">

const answeredArr = ref<AnsweredItem[]>([]) // 用户回答过的所有问题，用于向接口提交
const qrcodeImg = ref("")
const link = ref("")
const vCoinS = ref(0) // 提交问卷或初始化时获得的V币总数
const step = ref(0)
const introText = ref("让我们<br/>聆听您的心声<br/>威客有奖问卷调查，您的意见和建议对我们非常重要")
const isValid = ref(1) // 1 有效问卷 0 无效问卷 10秒内答完所有问题就是无效问卷
const StartTimeStamp = ref<number>(null) // 答题开始时间戳
const EndTimeStamp = ref<number>(null) // 结束答题时间戳

const submitType = computed(() => {
    if (isFirst.value) {
        return firstYes.value ? 2 : 1
    } else {
        return 3
    }
})

const VBTotal = computed<number>(() => {
    let value = 0
    if (question.value.length) {
        question.value.forEach((item: Data) => {
            value = value + item.vCoin
        })
    }
    return value
})

// 已经回答题目列表
const answeredHistoryList = computed<Array<AnsweredItem | Partial<Data>>>(() => {
    const hisList: Array<AnsweredItem> = answeredArr.value.filter((item: AnsweredItem) => !item.empty)

    const hasCurrent = hisList.find((item: AnsweredItem) => "no" in singleQues.value && item.no === singleQues.value.no)

    const singleQuesList: Array<Data> = []

    if (isAnsweredNow.value && !hasCurrent && "no" in singleQues.value) {
        singleQuesList.push(singleQues.value)
    }
    return [...hisList, ...singleQuesList]
})

// 当前已经答题数量
const answeredNumNow = computed<number>(() => {
    return answeredHistoryList.value.length
})

// 已答题目可获得的V币数量
const answeredListVB = computed<number>(() => {
    let value: number = 0
    if (answeredHistoryList.value.length) {
        answeredHistoryList.value.forEach((item: AnsweredItem | Partial<Data>) => {
            value = value + item.vCoin
        })
    }
    return value
})

// 答题进度条
const stepWidthProgress = computed<number>(() => {
    return (answeredNumNow.value * 2.06) / totalQusNum.value
})

// 当前一共几题
const totalQusNum = computed<number>(() => {
    return question.value.length
})

// 当前题目分类
const question = computed<Data[]>(() => {
    if (quesObj.value && quesObj.value?.data && quesObj.value?.data.length) {
        if (isFirst.value) {
            return firstYes.value ? quesObj.value.data[0] : quesObj.value.data[1]
        } else {
            return quesObj.value.data[0]
        }
    }
    return []
})

// 当前是否答题
const isAnsweredNow = computed<boolean>(() => {
    // 如果当前题目是单选
    if ("type" in singleQues.value && singleQues.value?.type === 1 && answerPicked.value) {
        const other = singleQues.value.answer.find((item: Data["answer"][number]) => item.value.includes("其他"))
        if (other && other.key === answerPicked.value) {
            return Boolean(otherText.value)
        }
        return true
    }
    // 如果当前题目是多选
    if ("type" in singleQues.value && singleQues.value?.type === 2 && answerSelected.value.length) {
        return true
    }
    // 如果当前题目是填空
    if ("type" in singleQues.value && singleQues.value?.type === 3 && lastAdvice.value.length) {
        return true
    }
    return false
})

// 当前在第几题
const singleQues = computed<Data | {}>(() => {
    return question.value.length && step.value ? question.value[step.value - 1] : {}
})
// 当前题目标题
const quesTitle = computed<string>(() => {
    if ("no" in singleQues.value) {
        return singleQues.value.no + "、" + singleQues.value.question
    }
    return ""
})
// 当前题目是单选还是多选
const selectText = computed<string>(() => {
    let deText = "单选"
    if ("type" in singleQues.value) {
        if (singleQues.value?.type === 2) {
            deText = "多选"
        }
        if (singleQues.value?.type === 3) {
            deText = "填空题"
        }
    }
    return deText
})
// 当前题目价值多少VB
const currVBCoin = computed<number>(() => {
    let value = 0
    if ("vCoin" in singleQues.value && singleQues.value?.vCoin) {
        value = singleQues.value?.vCoin
    }
    return value
})

const init = async (): Promise<void> => {
    load.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.questionnaire.init)
        const res = await HttpPlus.sendHttpRequest<ActiveGetSurveyGammaInit>()
        load.value = false

        if (res.status === 1 && res.data && !Array.isArray(res.data)) {
            quesObj.value = res.data
            isFirst.value = res.data.is_first
            isFinished.value = res.data.is_finish_this_month

            if (res.data.share_qr_code) {
                qrcodeImg.value = res.data.share_qr_code
            }
            if (res.data.share_url) {
                link.value = res.data.share_url
            }
            if (res.data.v_coin) {
                vCoinS.value = res.data.v_coin
            }
        }
    } catch (error: unknown) {
        load.value = false
        throw error
    }
}

// 开始答题
const startAns = (): void => {
    if (systemParams.isLogin) {
        step.value++
        StartTimeStamp.value = Date.now()
    } else {
        showToast({ className: "vk-toast-fail", message: "请您先登录", icon: "warning" })
    }
}
// 点击了上一题
const prevQues = (): void => {
    if (step.value <= 1) {
        return
    }
    step.value--
    const item = answeredArr.value.find((item: AnsweredItem) => "no" in singleQues.value && item.no === singleQues.value.no)
    if (item && item?.type === 1 && typeof item.answered === "number") {
        // 上一题是单选
        answerPicked.value = item.answered
    }
    if (item && item?.type === 2 && typeof item.answered === "number" && Array.isArray(item.answered)) {
        // 上一题是多选
        answerSelected.value = item.answered
    }
    if (item && item?.type === 3) {
        lastAdvice.value = item.advice
    }
    const timer = setTimeout(() => {
        if (item && item?.advice.length) {
            otherText.value = item.advice
        }
        clearTimeout(timer)
    }, 100)
}
// 点击了下一题
const nextQues = (): boolean => {
    // if (
    //   (this.singleQues.type === 1 && !this.answerPicked) ||
    //   (this.singleQues.type === 2 && !this.answerSelected.length)
    // ) {
    //   this.$vux.toast.show({
    //     text: '请您先填写完答案后，再点击下一题',
    //     type: 'warn'
    //   })
    //   return false
    // }
    // 第2个题目必须填写，其他题目可填
    if (isFirst.value && "no" in singleQues.value && singleQues.value.no === 2 && !answerPicked.value) {
        showToast({ className: "vk-toast-fail", message: "请先完成第二题", icon: "warning" })
        return false
    }
    // if (!this.lastAdvice) {
    //   this.$vux.toast.show({
    //     text: '内容不能为空',
    //     type: 'warn'
    //   })
    //   return false
    // }
    if (lastAdvice.value && lastAdvice.value.length < 15) {
        showToast({ className: "vk-toast-fail", message: "字数不能少于15个字", icon: "warning" })
        return false
    }
    // 检查其他选中状态，是否为空
    if ("answer" in singleQues.value) {
        const other = singleQues.value.answer.find((item: Data["answer"][number]) => item.value.includes("其他"))
        if (other) {
            if (answerSelected.value.includes(other.key) || answerPicked.value === other.key) {
                const value = otherText.value
                if (!value) {
                    showToast({ className: "vk-toast-fail", message: "请填写内容或取消勾选“其他”", icon: "warning" })
                    return false
                }
                if (value.length < 2) {
                    showToast({ className: "vk-toast-fail", message: "内容不能小于2个字", icon: "warning" })
                    return false
                }
                if (value.length > 14) {
                    showToast({ className: "vk-toast-fail", message: "内容不能大于14个字", icon: "warning" })
                    return false
                }
            }
        }
    }
    const item = answeredArr.value.find((item: any) => "no" in singleQues.value && item.no === singleQues.value.no)
    if ("no" in singleQues.value && "type" in singleQues.value && "vCoin" in singleQues.value) {
        // 之前已经回答过题目的，更新以前的记录
        if (!item) {
            answeredArr.value.push({
                no: singleQues.value.no,
                answered:
                    singleQues.value.type === 1
                        ? answerPicked.value
                        : singleQues.value.type === 2
                        ? answerSelected.value
                        : lastAdvice.value,
                type: singleQues.value.type,
                advice: otherText.value,
                vCoin: singleQues.value.vCoin,
                empty:
                    (singleQues.value.type === 1 && answerPicked.value === null) ||
                    (singleQues.value.type === 2 && !answerSelected.value.length) ||
                    (singleQues.value.type === 3 && !lastAdvice.value.length)
            })
        } else {
            // 之前题目存在，但是首次问卷第二题切换后，会更换题目，后面的题目全部清空重新回答
            if (isFirst.value && item.no === 2 && item.answered !== answerPicked.value) {
                answeredArr.value = answeredArr.value.slice(0, 1)
                answeredArr.value.push({
                    no: singleQues.value.no,
                    answered:
                        singleQues.value.type === 1
                            ? answerPicked.value
                            : singleQues.value.type === 2
                            ? answerSelected.value
                            : lastAdvice.value,
                    type: singleQues.value.type,
                    vCoin: singleQues.value.vCoin,
                    advice: otherText.value,
                    empty:
                        (singleQues.value.type === 1 && answerPicked.value === null) ||
                        (singleQues.value.type === 2 && !answerSelected.value.length) ||
                        (singleQues.value.type === 3 && !lastAdvice.value.length)
                })
            } else {
                answeredArr.value = answeredArr.value.map((item: any) => {
                    if ("no" in singleQues.value && "type" in singleQues.value && item.no === singleQues.value.no) {
                        return {
                            ...item,
                            answered:
                                singleQues.value.type === 1
                                    ? answerPicked.value
                                    : singleQues.value.type === 2
                                    ? answerSelected.value
                                    : lastAdvice.value,
                            advice: otherText.value,
                            empty:
                                (singleQues.value.type === 1 && answerPicked.value === null) ||
                                (singleQues.value.type === 2 && !answerSelected.value.length) ||
                                (singleQues.value.type === 3 && !lastAdvice.value.length)
                        }
                    } else {
                        return item
                    }
                })
            }
        }
        // 当前是第二题，进入下一题前，设置firstYes的值，根据是否展示不同的题目
        if (singleQues.value.no === 2) {
            if (answerPicked.value === 1) {
                firstYes.value = true
            } else {
                firstYes.value = false
            }
        }
        if (!submitting.value) {
            step.value++
            answerPicked.value = null
            answerSelected.value = []
            otherText.value = ""
            // 翻页后看看之前有没有记录
            const haveRecord = answeredArr.value.find((item: any) => "no" in singleQues.value && item.no === singleQues.value.no)
            if (haveRecord) {
                if (singleQues.value.type === 1 && typeof haveRecord.answered === "number") {
                    answerPicked.value = haveRecord.answered
                }
                if (
                    singleQues.value.type === 2 &&
                    typeof haveRecord.answered === "number" &&
                    Array.isArray(haveRecord.answered)
                ) {
                    answerSelected.value = haveRecord.answered
                }
                if (haveRecord.advice.length) {
                    otherText.value = haveRecord.advice
                }
            }
        }
    }
}

// 把答案数组转为字符串
const transAnswer = (item: AnsweredItem): AnsweredItem["answered"] => {
    if (!isSubmitNow.value && item.empty) {
        continueDio.value = true
        return ""
    }
    if (item.type === 1) {
        return item.answered ? item.answered.toString() : ""
    }
    if (item.type === 2 && Array.isArray(item.answered)) {
        return item.answered.length ? item.answered.sort().join() : ""
    }
    if (item.type === 3) {
        return item.answered ? item.answered : ""
    }
}

// 继续答题
const ansAgain = (): void => {
    continueDio.value = false
    isSubmitNow.value = false
    // 第一个没回答题目的索引
    const index = answeredArr.value.findIndex((item: AnsweredItem) => item.empty)
    if (index !== -1) {
        step.value = answeredArr.value[index].no
    }
}

// 直接提交
const finishAns = (): void => {
    isSubmitNow.value = true
    continueDio.value = false
    submit()
}
const reset = (): void => {
    StartTimeStamp.value = null
    EndTimeStamp.value = null
    step.value = 0
    isSubmitNow.value = false
    continueDio.value = false
    answerPicked.value = null
    answerSelected.value = []
    answeredArr.value = []
    otherText.value = ""
    lastAdvice.value = ""
    init()
}

// 提交问卷
const submit = async (): Promise<void> => {
    submitting.value = true
    if (submitLoading.value) {
        return
    }
    const ques = nextQues()
    submitting.value = false
    if (ques === false) {
        return
    }
    EndTimeStamp.value = Date.now()
    if (EndTimeStamp.value && StartTimeStamp.value) {
        const diff = EndTimeStamp.value - StartTimeStamp.value
        if (diff <= 10 * 1000) {
            isValid.value = 0
        } else {
            isValid.value = 1
        }
    }
    // 如果已经回答了全部题目，直接提交即可
    if (totalQusNum.value === answeredNumNow.value) {
        isSubmitNow.value = true
    }

    // 开始提交
    const params: { is_valid: number; type: number; [propName: string]: AnsweredItem["answered"] } = {
        is_valid: isValid.value,
        type: submitType.value
    }
    for (let i = 0; i < 9; i++) {
        params[`question_${i + 1}`] = transAnswer(answeredArr.value[i])
        params[`question_${i + 1}_other`] = answeredArr.value[i].advice
    }
    if (continueDio.value) {
        return
    }
    submitLoading.value = true

    try {
        HttpPlus.setUrlOptions(ApiSetting.questionnaire.submit)
        const res = await HttpPlus.sendHttpRequest<ActiveSurveyGammaJoin, typeof params>(params)
        submitLoading.value = false

        if (res.status === 1 && res.data) {
            const { shareQrCode, shareUrl, vCoins } = res.data
            if (shareQrCode) {
                qrcodeImg.value = shareQrCode
            }
            if (shareUrl) {
                link.value = shareUrl
            }
            if (vCoins) {
                vCoinS.value = vCoins
            }
            reset()
            showToast({ className: "vk-toast-success", message: "提交成功，感谢您的参与!", icon: "checked" })
        }
    } catch (e: unknown) {
        submitLoading.value = false
        throw e
    }
}

onBeforeMount(() => {
    init()
})
</script>

<template>
    <div class="questionnaire-page bg-#010235">
        <HeaderBar>
            <div class="header_title">威客电竞用户调查问卷</div>
        </HeaderBar>

        <div class="expand-page">
            <!-- 主内容 -->
            <section class="content-wrapper">
                <div class="block-wrapper first-screen" :class="{ 'pb-30px': isFinished }" v-if="step === 0 && !load">
                    <div class="label-img" v-if="isFirst"></div>
                    <!-- 本月已完成问卷 -->
                    <template v-if="isFinished">
                        <div class="finished-block text-center">
                            <div class="top-text">
                                恭喜您完成本月的调查问卷，下月问卷将于
                                <span class="theme-text">次月1号</span>
                                重新开启
                            </div>
                            <div class="big-text">
                                此次问卷共获得
                                <span class="theme-text">{{ vCoinS }}</span>
                                V币
                            </div>
                            <div class="qr-wrapper flex-center">
                                <img class="qr-img" v-if="qrcodeImg" :src="qrcodeImg" alt="" />
                            </div>
                            <div class="btn next-btn" @click="router.push('/seo')">分享邀请二维码</div>
                            <div class="input-wrapper hstack justify-between">
                                <div class="link van-ellipsis">{{ link }}</div>
                                <div class="copy-btn" @click="doCopy(link)">复制</div>
                            </div>
                        </div>
                    </template>
                    <!-- 开始答题 -->
                    <template v-else>
                        <div class="center-block flex-center text-center">
                            <div class="desc-intro" v-html="introText"></div>
                        </div>
                        <div @click="startAns" class="start-btn"></div>
                    </template>
                </div>
                <div class="answer-wrapper block-wrapper" v-if="step > 0 && !load">
                    <div class="label-img" v-if="isFirst"></div>
                    <div class="header-wrapper flex-center">
                        <div class="text">已答题</div>
                        <div class="progress-wrapper">
                            <div class="step-width flex-center" :style="{ width: `${stepWidthProgress}rem` }">
                                <span>{{ answeredNumNow }}/{{ totalQusNum }}</span>
                            </div>
                        </div>
                        <div class="theme-text bold">+{{ answeredListVB }}V币</div>
                    </div>
                    <div class="core-wrapper" v-if="'question' in singleQues && singleQues.question">
                        <div class="ask-line">
                            {{ quesTitle }}
                            <span>({{ selectText }})</span>
                            <span class="theme-text">{{ currVBCoin }}V币</span>
                        </div>
                        <div v-if="'type' in singleQues && singleQues.type === 3" class="answer-block">
                            <van-field
                                :formatter="formatterStr"
                                class="otherForm lastForm blockk"
                                @blur="lastFocus = false"
                                @focus="lastFocus = true"
                                :class="{ 'block-selected': lastFocus }"
                                :placeholder="'example' in singleQues ? singleQues.example : ''"
                                maxlength="100"
                                v-model="lastAdvice"
                                label-width="0"
                            />
                        </div>
                        <div v-else class="answer-block hstack flex-col">
                            <label
                                :class="{
                                    'block-selected':
                                        ('type' in singleQues && singleQues.type === 1 && item.key === answerPicked) ||
                                        ('type' in singleQues && singleQues.type === 2 && answerSelected.includes(item.key))
                                }"
                                :for="item.value"
                                class="blockk hstack justify-between"
                                v-for="(item, index) in 'answer' in singleQues ? singleQues.answer : []"
                                :key="index"
                            >
                                <van-field
                                    :formatter="formatterStr"
                                    class="otherForm"
                                    v-if="
                                        item.value.includes('其他') &&
                                        (answerSelected.includes(item.key) || answerPicked === item.key)
                                    "
                                    :placeholder="item.example"
                                    maxlength="14"
                                    v-model="otherText"
                                    label-width="0"
                                />
                                <span v-else>{{ index + 1 }}.{{ item.value }}</span>
                                <input
                                    v-if="'type' in singleQues && singleQues.type === 1"
                                    style="display: none"
                                    type="radio"
                                    v-model="answerPicked"
                                    :value="item.key"
                                    :id="item.value"
                                />
                                <input
                                    v-if="'type' in singleQues && singleQues.type === 2"
                                    style="display: none"
                                    type="checkbox"
                                    v-model="answerSelected"
                                    :value="item.key"
                                    :id="item.value"
                                />
                                <div class="radio-wrapper">
                                    <div
                                        v-if="'type' in singleQues && singleQues.type === 1"
                                        class="normal"
                                        :class="{ selected: item.key === answerPicked }"
                                    ></div>
                                    <div
                                        v-if="'type' in singleQues && singleQues.type === 2"
                                        class="mup-normal"
                                        :class="{
                                            'mup-selected': answerSelected.includes(item.key)
                                        }"
                                    ></div>
                                </div>
                            </label>
                        </div>
                        <div class="btn-group flex-center">
                            <div class="btn prev-btn" v-if="step != 1" @click="prevQues">上一题</div>
                            <div class="btn next-btn" v-if="step != 9" @click="nextQues">下一题</div>
                            <div class="btn next-btn" v-if="step === 9" @click="submit">提交</div>
                        </div>
                    </div>
                </div>
                <van-loading class="ab-center" type="spinner" v-if="load" />
            </section>
        </div>
        <!-- 弹窗 -->
        <van-dialog
            class="question-dio"
            getContainer="body"
            v-model:show="continueDio"
            :showConfirmButton="false"
            :show-cancel-button="false"
        >
            <div class="quesdio-close" @click="continueDio = false"></div>
            <div class="question-wrapper">
                <div class="title">温馨提示</div>
                <div class="desc">
                    亲爱的会员，目前还有
                    <span style="color: #ff4981">{{ totalQusNum - answeredNumNow }}个</span>
                    问题尚未完成，
                    <br />
                    价值
                    <span style="color: #fff476">{{ VBTotal - answeredListVB }}</span>
                    V币，确认现在提交吗？
                </div>
                <div class="btn-group flex-center">
                    <div class="btn prev-btn" @click="ansAgain">继续完成</div>
                    <div class="btn next-btn" @click="finishAns">直接提交</div>
                </div>
                <div class="info">注：每个自然月内仅限参与一次，次月自动更新</div>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss" scoped>
.theme-text {
    color: #fff476;
}
.bold {
    font-weight: bold;
}
.questionnaire-page {
    color: #fff;
    line-height: 1.6;
    .expand-page {
        background-image: url("@/assets/img/template/july/question/bg.png");
        background-repeat: no-repeat;
        background-position: center top;
        background-size: contain;
        padding-top: 2.6rem;
        padding-bottom: 72px;
    }
    .start-btn {
        margin: 0.21rem auto 0;
        width: 1.6rem;
        height: 0.45rem;
        background: url("@/assets/img/template/july/question/start-btn.png") no-repeat center;
        background-size: contain;
    }

    .content-wrapper {
        min-height: 2.76rem;
        position: relative;

        .block-wrapper {
            width: 3.58rem;
            margin: auto;
            box-sizing: border-box;
            background-image: url("@/assets/img/template/july/question/center-border.png");
            background-position: center top;
            background-size: contain;
            background-repeat: no-repeat repeat-y;
            position: relative;

            &::before {
                content: "";
                position: absolute;
                top: -0.28rem;
                left: 0;
                right: 0;
                height: 0.28rem;
                width: 100%;
                background: url("@/assets/img/template/july/question/top-border.png") no-repeat center;
                background-size: contain;
            }

            &::after {
                content: "";
                position: absolute;
                bottom: -0.208rem;
                left: 0;
                right: 0;
                width: 100%;
                height: 0.21rem;
                background: url("@/assets/img/template/july/question/bottom-border.png") no-repeat center;
                background-size: contain;
            }
        }

        .answer-wrapper {
            min-height: 2.76rem;
            padding-top: 0.09rem;

            .header-wrapper {
                white-space: nowrap;
                margin: auto;
                width: 3.22rem;
                position: relative;

                &::after {
                    content: "";
                    position: absolute;
                    bottom: -0.16rem;
                    width: 100%;
                    border-bottom: 0.005rem dashed rgba(255, 255, 255, 0.2);
                }

                .text {
                    font-size: 0.12rem;
                }

                .progress-wrapper {
                    overflow: hidden;
                    margin-left: 0.07rem;
                    margin-right: 0.06rem;
                    width: 2.07rem;
                    height: 0.18rem;
                    box-sizing: border-box;
                    border-radius: 0.09rem;
                    border: solid 0.005rem #2d3b69;
                    background-color: #010235;
                    padding: 0.015rem;

                    .step-width {
                        font-size: 0.12rem;
                        height: 100%;
                        border-radius: 0.07rem;
                        box-shadow: inset 0 0.005rem 0 0 #72fff0;
                        background-image: linear-gradient(to top, #07e9f1, #07f1b7);
                        color: #000;
                        text-align: center;
                        transition: width 0.3s ease-out;
                        line-height: 1;

                        span {
                            transform: scale(0.8);
                        }
                    }
                }
            }

            .core-wrapper {
                margin: 0.3rem auto 0;

                .ask-line {
                    padding: 0 0.19rem;
                }

                .otherForm {
                    padding: 0;
                    background-color: transparent;
                    caret-color: #00f5ff;
                    font-size: 0.14rem;
                    line-height: 0.5rem;
                    width: 2.7rem;

                    &.lastForm {
                        margin: 0 auto 0.66rem;
                    }

                    :deep(.van-field__control) {
                        color: #fff;
                    }
                }

                .blockk {
                    width: 3.2rem;
                    height: 0.5rem;
                    box-sizing: border-box;
                    padding: 0 0.11rem;
                    background: url("@/assets/img/template/july/question/selec.png") no-repeat center;
                    background-size: contain;
                    margin-bottom: 0.1rem;
                    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);

                    &.block-selected {
                        width: 3.22rem;
                        background-image: url("@/assets/img/template/july/question/selected.png");
                        background-size: contain;
                    }
                }

                .radio-wrapper {
                    .normal {
                        width: 0.24rem;
                        height: 0.24rem;
                        box-sizing: border-box;
                        border: solid 1px #4c5d95;
                        background-color: #010235;
                        border-radius: 50%;

                        &::after {
                            content: "";
                            transition: transform 0.2s ease-out;
                            transform: scale(0);
                        }
                    }

                    .selected {
                        width: 0.24rem;
                        height: 0.24rem;
                        border-radius: 50%;
                        box-sizing: border-box;
                        border: solid 0.01rem #07e9ef;
                        position: relative;

                        &::after {
                            content: "";
                            position: absolute;
                            display: block;
                            top: 0.035rem;
                            left: 0.035rem;
                            transform: scale(1);
                            width: 0.15rem;
                            height: 0.15rem;
                            background-color: #07e9ef;
                            border-radius: 50%;
                        }
                    }

                    .mup-normal {
                        width: 0.22rem;
                        height: 0.22rem;
                        box-sizing: border-box;
                        border: solid 0.01rem #4c5d95;
                        background-color: #010235;
                        position: relative;

                        &::after {
                            content: "";
                            transition: transform 0.2s ease-out;
                            transform: scale(0);
                        }

                        &.mup-selected {
                            border-style: solid;
                            border-width: 0.01rem;
                            border-image-source: linear-gradient(to top, #07e9ef, #07f1ba);
                            border-image-slice: 1;

                            &::after {
                                content: "";
                                position: absolute;
                                bottom: 0.02rem;
                                left: 0.02rem;
                                width: 0.24rem;
                                height: 0.21rem;
                                background: url("@/assets/img/template/july/question/gou.png") no-repeat center;
                                background-size: contain;
                                transform: scale(1);
                            }
                        }
                    }
                }

                .answer-block {
                    margin-top: 0.1rem;
                }
            }
        }

        .label-img {
            position: absolute;
            top: -0.29rem;
            left: -0.02rem;
            width: 0.665rem;
            height: 0.6rem;
            background: url("@/assets/img/template/july/question/first-label.png") no-repeat center;
            background-size: 100% 100%;
        }

        .center-block {
            margin: auto;
            width: 2.94rem;
            height: 1.69rem;
            background: url("@/assets/img/template/july/question/ask-bg.png") no-repeat center;
            background-size: 100% 100%;
            box-sizing: border-box;
            padding: 0 0.2rem;
        }

        .first-screen {
            min-height: 2.76rem;
            padding-top: 0.125rem;

            .top-text {
                padding: 0 0.56rem;
                margin-bottom: 0.14rem;
            }

            .qr-wrapper {
                margin: 0.2rem auto 0;
                width: 1.17rem;
                height: 1.17rem;
                background: url("@/assets/img/template/july/question/qr-bg.png") no-repeat center;
                background-size: 100% 100%;

                .qr-img {
                    width: 1.05rem;
                    height: 1.05rem;
                }
            }

            .btn {
                margin-top: 0.26rem;
                margin-bottom: 0.22rem;
            }

            .input-wrapper {
                margin: auto;
                width: 3.02rem;
                height: 0.42rem;
                box-sizing: border-box;
                padding: 0 0.09rem 0 0.125rem;
                background: url("@/assets/img/template/july/question/input-wrapper.png") no-repeat center;
                background-size: contain;

                .link {
                    width: 1.98rem;
                }

                .copy-btn {
                    width: 0.58rem;
                    height: 0.28rem;
                    line-height: 0.28rem;
                    text-align: center;
                    background-image: linear-gradient(to left, #07e9f1, #07f1b7);
                    font-size: 0.13rem;
                    color: #000;
                    border-radius: 0.02rem;
                }
            }
        }

        .btn {
            margin: 0.12rem auto 0.08rem;
            text-align: center;
            width: 1.42rem;
            height: 0.45rem;
            line-height: 0.45rem;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;

            &.prev-btn {
                background-image: url("@/assets/img/template/july/question/prev-btn.png");
                margin-right: 0.135rem;
            }

            &.next-btn {
                color: #000;
                font-weight: 600;
                background-image: url("@/assets/img/template/july/question/next-btn.png");
            }
        }
    }
}
</style>
<style lang="scss">
.question-dio {
    top: 45%;
    width: 3.33rem;
    height: 2.65rem;
    background: url("@/assets/img/template/july/question/dio-bg.png") no-repeat center;
    background-size: 100% 100%;
    font-size: 0.14rem;
    overflow: visible;

    .quesdio-close {
        position: absolute;
        bottom: -0.36rem;
        left: 50%;
        transform: translateX(-50%);
        width: 0.21rem;
        height: 0.21rem;
        background: url("@/assets/img/template/july/question/close-icon.png") no-repeat center;
        background-size: 100% 100%;
    }

    .question-wrapper {
        color: #fff;
        text-align: center;
        padding-top: 0.26rem;

        .title {
            position: relative;

            &::after {
                content: "";
                width: 2.3rem;
                height: 0.075rem;
                position: absolute;
                top: 58%;
                left: 50%;
                transform: translate3d(-50%, -50%, 0);
                background: url("@/assets/img/template/july/question/line.png") no-repeat center;
                background-size: contain;
            }
        }

        .desc {
            margin: 0.3rem auto 0;
            line-height: 1.46;
        }

        .btn-group {
            .btn {
                margin: 0.3rem auto 0;
                text-align: center;
                width: 1.42rem;
                height: 0.45rem;
                line-height: 0.45rem;
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;

                &.prev-btn {
                    background-image: url("@/assets/img/template/july/question/prev-btn.png");
                    margin-right: 0.135rem;
                }

                &.next-btn {
                    color: #000;
                    font-weight: 600;
                    background-image: url("@/assets/img/template/july/question/next-btn.png");
                }
            }
        }

        .info {
            font-size: 0.12rem;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1;
            margin-top: 0.22rem;
        }
    }
}
</style>
