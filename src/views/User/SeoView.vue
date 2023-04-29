<script setup lang="ts">
import useClipboard from "vue-clipboard3"
import { formatNumberSplit } from "@/utils/numberUtils"
import { ref, nextTick } from "vue"
import ApiSetting from "@/api/service"
import { showToast } from "vant"
import { useRouter } from "vue-router"
import { HttpPlus } from "@/api/HttpPlus"
import type { UserSeo } from "@/api/pojo/UserSeo"

const router = useRouter()
const { toClipboard } = useClipboard()

const doCopy = async (text?: string): Promise<void> => {
    if (text) {
        try {
            await toClipboard(text)
            showToast({
                className: "vk-toast-success",
                message: "复制成功",
                icon: "checked"
            })
        } catch (e: unknown) {
            console.error(e)
        }
    }
}

const editFlag = ref(false)
const btnloading = ref(false)
const newSeoKey = ref("")
const data = ref<Partial<UserSeo>>({})
const editSeoKeyRef = ref<HTMLInputElement | null>(null)

const handleEdit = async (): Promise<void> => {
    if (!editFlag.value) {
        // 修改
        editFlag.value = true
        newSeoKey.value = data.value?.seo_key
        nextTick(() => {
            if (editSeoKeyRef.value) {
                editSeoKeyRef.value.focus()
            }
        })
    } else {
        // 保存
        editFlag.value = false
        if (!newSeoKey.value) {
            showToast({
                className: "vk-toast-fail",
                message: "邀请码不能为空",
                icon: "warning"
            })
            return
        }
        data.value.seo_key = newSeoKey.value
        btnloading.value = true
        try {
            HttpPlus.setUrlOptions(ApiSetting.user.setSeoKey)
            const res = await HttpPlus.sendHttpRequest<{}, { seo_key: string }>({ seo_key: newSeoKey.value })
            btnloading.value = false

            if (res.status === 1) {
                showToast({
                    className: "vk-toast-success",
                    message: "保存成功",
                    icon: "checked"
                })
                const str = data.value?.seoUrl.split("?")[0]
                data.value.seoUrl = str + "?" + newSeoKey.value
            }
        } catch (error: unknown) {
            btnloading.value = false
            console.error(error)
        }
    }
}

const init = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.user.getUserSeoInfo)
    const res = await HttpPlus.sendHttpRequest<UserSeo>()
    if (res.status === 1 && res.data) {
        const MONEY = res.data.seo_top_tips.replace(/[^\d]/g, "")
        const moneyStr = `<span style="font-size:0.15rem;font-weight:bold;color:#38a95f">${formatNumberSplit(MONEY, 0)}</span>`
        const StartPos = res.data.seo_top_tips.indexOf("计")
        const EndPos = res.data.seo_top_tips.indexOf("元")
        const newTips = res.data.seo_top_tips.slice(0, StartPos + 1) + moneyStr + res.data.seo_top_tips.slice(EndPos)

        data.value = Object.assign({}, res.data, {
            seo_top_tips: newTips
        })
    }
}

init()
</script>

<template>
    <div class="seo-page bg-light-green">
        <HeaderBar>
            <div class="header_title">推广分享</div>
        </HeaderBar>
        <div class="expand-page pt-20px font-classic">
            <!--累计注册 充值人数-->
            <div class="top-wrapper px-12px pb-20px vstack">
                <div class="box reg">
                    <div class="title">累计注册</div>
                    <div class="desc">
                        <span class="text-white text-24px mr-6px font-bold">
                            {{ data?.registerCount }}
                        </span>
                        人
                    </div>
                </div>
                <div class="box deposit">
                    <div class="title">累计充值</div>
                    <div class="desc">
                        <span class="text-white text-24px mr-6px font-bold">
                            {{ data?.depositCount }}
                        </span>
                        人
                    </div>
                </div>
            </div>

            <div py-20px px-12px text-center>
                <img class="h-120px max-w-90%" :src="data?.showQrcode" alt="" />
                <!--推广链接 邀请码-->
                <div text="oldText" leading-relaxed mt-20px>
                    <div text="20px" font-bold>专属推广链接</div>
                    <div text="12px">{{ data?.seoUrl }}</div>
                    <div class="btn" @click="doCopy(data?.seoUrl)">复制链接</div>
                </div>
                <!--邀请码-->
                <div mt-40px text-center>
                    <div class="flex-center">
                        <div text="20px" font-bold>推广邀请码</div>
                        <van-button
                            size="small"
                            @click="handleEdit"
                            :loading="btnloading"
                            class="ml-10px text-16px text-#27bc74 bg-transparent border-none"
                            plain
                        >
                            {{ editFlag ? "保存" : "修改" }}
                        </van-button>
                    </div>
                    <div class="seo_link text-16px text-center h-30px leading-30px">
                        <input type="text" v-if="editFlag" v-model="newSeoKey" ref="editSeoKeyRef" autofocus />
                        <span v-else>{{ data?.seo_key }}</span>
                    </div>
                    <div class="btn" @click="doCopy(data?.seo_key)">复制邀请码</div>
                </div>
                <p class="seo_tips mt-40px text-left text-#7c839f text-12px leading-normal" v-if="data?.seo_top_tips">
                    <span v-html="data?.seo_top_tips"></span>
                    <span class="detail" @click="router.push('/callfriends')">活动详情</span>
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.seo-page {
    .top-wrapper {
        border-bottom: 1px solid #c6d0db;
    }
    .seo_tips {
        .detail {
            color: #27bc74;
            text-decoration: underline;
        }
    }
    .seo_link {
        input {
            font-size: 0.16rem;
            text-align: center;
            height: 0.3rem;
            line-height: 0.3rem;
            border: none;
            background: none;
            -webkit-user-select: auto;
        }
    }
    .btn {
        width: 140px;
        margin: 10px auto;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 30px;
        color: #000;
        font-size: 15px;
        background: linear-gradient(to right, #07e9f1, #07f1b7);
    }
    .box {
        width: 160px;
        height: 92px;
        border-radius: 4px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        margin: 0 7px;
        box-shadow: 0 0 16px 3px rgb(0 0 0 / 20%);
        .title {
            color: #fff;
            font-size: 16px;
            height: 28px;
            line-height: 28px;
        }
        .desc {
            color: #7c839f;
            height: 25px;
            line-height: 25px;
            font-size: 12px;
        }
        &.reg {
            background-image: url("@/assets/img/template/july/my/seo/seo_reg_bg.png");
        }
        &.deposit {
            background-image: url("@/assets/img/template/july/my/seo/seo_deposit_bg.png");
        }
    }
}
</style>
