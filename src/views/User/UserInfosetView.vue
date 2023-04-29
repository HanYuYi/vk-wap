<script setup lang="ts">
import clearIcon from "@/assets/img/template/july/my/set/icon/clear-icon.png"

import { Cropper } from "vue-advanced-cropper"
import "vue-advanced-cropper/dist/style.css"
import Block from "./block.vue"
import { ref, computed, unref } from "vue"
import { useSysStore } from "@/stores/system"
import { formatterYMD } from "@/utils/date"
import ApiSetting from "@/api/service"
import { formatterStr } from "@/composable/validate"
import { showToast, showConfirmDialog } from "vant"
import { useNow, useDateFormat } from "@vueuse/core"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

const showAlbum = ref(false) // 显示相册，修改头像
const showCropperPage = ref(false)
const img = ref("")
const resImg = ref("")

const getRoundedCanvas = (sourceCanvas: HTMLCanvasElement): HTMLCanvasElement => {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    let width = sourceCanvas.width
    let height = sourceCanvas.height
    // 为了每张图片的大小不超过50k,所以不论裁剪多大，最后上传的，最大宽度不超过90。
    if (width > 160) {
        width = 160
    }
    if (height > 160) {
        height = 160
    }
    canvas.width = width
    canvas.height = height
    context.imageSmoothingEnabled = true
    context.drawImage(sourceCanvas, 0, 0, width, height)
    context.globalCompositeOperation = "destination-in"
    /* context.beginPath();
   context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true); */
    context.fill()
    return canvas
}

const change = ({ canvas }: { canvas: HTMLCanvasElement }): void => {
    const roundedCanvas = getRoundedCanvas(canvas)
    resImg.value = roundedCanvas.toDataURL()
}
// 更换头像
const onRead = ({ content }: { content?: string }): void => {
    img.value = content
    showCropperPage.value = true
    showAlbum.value = false
}

// 取消更换头像
const cancelCrop = (): void => {
    img.value = ""
    resImg.value = ""
    showCropperPage.value = false
    showAlbum.value = false
}

// 确定更换头像
const confirmCrop = async (): Promise<void> => {
    if (!resImg.value) return

    HttpPlus.setUrlOptions(ApiSetting.user.uploadUserImg)
    const res = await HttpPlus.sendHttpRequest<{}, { image: string }>({
        image: resImg.value
    })

    if (res.status === 1) {
        systemParams.userInfo.head_image = resImg.value
        showToast({
            className: "vk-toast-success",
            message: "上传成功",
            icon: "checked"
        })
        cancelCrop()
    }
}

const YEAR = unref(useDateFormat(useNow(), "YYYY"))
const MONTH = unref(useDateFormat(useNow(), "MM"))
const DAY = unref(useDateFormat(useNow(), "DD"))

const showRight = ref(false) // 修改右边的弹层

type Status = "username" | "nickname" | "sign" | "birth" | ""
const status = ref<Status>("")
const showBirth = ref(false)
const username = ref("")
const currentDate = ref([YEAR, MONTH, DAY])
const minDate = new Date("1960/01/01")

// 传入接口的时间格式
const dataSelect = computed<string>(() => currentDate.value[0] + "/" + currentDate.value[1] + "/" + currentDate.value[2])

const personalTitle = computed(() => {
    switch (status.value) {
        case "username":
            return "修改用户名"
        case "nickname":
            return "修改昵称"
        case "sign":
            return "修改个性签名"
        default:
            return ""
    }
})

const personalTips = computed(() => {
    switch (status.value) {
        case "username":
            return "用户名格式为6-12位小写字母或数字，仅可修改一次"
        default:
            return ""
    }
})

const personalPlacehold = computed(() => {
    switch (status.value) {
        case "username":
            return "请输入用户名"
        case "nickname":
            return "请输入昵称"
        case "sign":
            return "请输入个性签名"
        default:
            return ""
    }
})

// 取消
const cancel = (): void => {
    showRight.value = false
    showBirth.value = false
    status.value = ""
    username.value = ""
    currentDate.value = [YEAR, MONTH, DAY]
}

// 确认日期先弹窗
const confirmDate = async (): Promise<void> => {
    showBirth.value = false
    try {
        const dialogRes = await showConfirmDialog({
            title: "提示",
            message: `生日设置成功后不可修改！\n请再次确认生日日期：\n${dataSelect.value}`,
            className: "vk-confirm-dialog",
            width: 300,
            confirmButtonText: "确认",
            cancelButtonText: "重置",
            confirmButtonColor: "#07f1b7"
        })
        if (dialogRes === "confirm") {
            await done()
        }
    } catch (e: unknown) {
        // on cancel
        showBirth.value = true
        console.error(e)
    }
}

type DoneParameter = { username?: string; nickname?: string; specific_sign?: string; date?: string }
// 完成
const done = async (): Promise<void> => {
    let params: DoneParameter

    switch (status.value) {
        case "username":
            if (!username.value) {
                showToast({
                    className: "vk-toast-fail",
                    message: "用户名不能为空",
                    icon: "warning"
                })
                return
            }
            if (username.value === systemParams.userInfo.username) {
                cancel()
                return
            }
            params = { username: username.value }
            break

        case "nickname":
            if (!username.value) {
                showToast({
                    className: "vk-toast-fail",
                    message: "昵称不能为空",
                    icon: "warning"
                })
                return
            }
            if (username.value === systemParams.userInfo.nickname) {
                cancel()
                return
            }
            params = { nickname: username.value }
            break

        case "sign":
            if (!username.value) {
                showToast({
                    className: "vk-toast-fail",
                    message: "请输入个性签名",
                    icon: "warning"
                })
                return
            }
            if (username.value === systemParams.userInfo.specific_sign) {
                cancel()
                return
            }
            params = { specific_sign: username.value }
            break

        case "birth":
            params = { date: unref(dataSelect) }
            break
    }

    HttpPlus.setUrlOptions(ApiSetting.user.upDateUserInfo)
    const res = await HttpPlus.sendHttpRequest<{}, DoneParameter>(params)

    if (res.status === 1) {
        if (status.value === "username") {
            systemParams.userInfo.change_flag = 0
        }
        if (status.value === "birth") {
            systemParams.userInfo.birth = unref(dataSelect)
        }
        showToast({
            className: "vk-toast-success",
            message: "保存成功",
            icon: "checked"
        })
        cancel()
        systemParams.getUserInfo()
    }
}

const modify = (type: Status): void => {
    status.value = type
    if (type === "username" && systemParams.userInfo.change_flag !== 1) return
    if (type === "birth" && systemParams.userInfo.birth) return
    switch (type) {
        case "username":
            username.value = systemParams.userInfo.username
            break
        case "nickname":
            username.value = systemParams.userInfo.nickname
            break
        case "sign":
            username.value = systemParams.userInfo.specific_sign
            break
        default:
            break
    }
    if (type === "birth") {
        showBirth.value = true
    } else {
        showRight.value = true
    }
}
</script>

<template>
    <div class="personal-page bg-mypageColor">
        <HeaderBar>
            <div class="header_title">个人资料</div>
        </HeaderBar>

        <div class="expand-page py-12px">
            <Block @click.stop="showAlbum = true" class="mb-12px only" :title="'头像'">
                <template #lefticon>
                    <div class="left-icon avatar-icon"></div>
                </template>
                <template #label>
                    <AvatarCircle :showRate="false" :width="50" :imgWidth="50" class="avatar mr-10px" />
                </template>
            </Block>
            <div>
                <Block
                    @click="modify('username')"
                    :title="'用户名'"
                    :label="systemParams.userInfo.username"
                    :disable="systemParams.userInfo.change_flag !== 1"
                >
                    <template #lefticon>
                        <div class="left-icon user-icon"></div>
                    </template>
                </Block>
                <Block @click="modify('nickname')" :title="'昵称'" :label="systemParams.userInfo.nickname">
                    <template #lefticon>
                        <div class="left-icon nickname-icon"></div>
                    </template>
                </Block>
                <Block
                    @click="modify('birth')"
                    :title="'生日'"
                    :label="systemParams.userInfo.birth"
                    :disable="!!systemParams.userInfo.birth"
                >
                    <template #lefticon>
                        <div class="left-icon birth-icon"></div>
                    </template>
                </Block>
                <Block @click="modify('sign')" :title="'个性签名'" :label="systemParams.userInfo.specific_sign">
                    <template #lefticon>
                        <div class="left-icon sign-icon"></div>
                    </template>
                </Block>
            </div>
            <!-- 修改头像 -->
            <van-popup
                :overlayStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }"
                teleport="body"
                class="album-overpop"
                v-model:show="showAlbum"
                position="bottom"
            >
                <div class="hstack flex-col">
                    <van-uploader :after-read="onRead">
                        <div class="album-btn van-haptics-feedback text-#1c90c2">从相册选择</div>
                    </van-uploader>
                    <div class="album-btn van-haptics-feedback text-#999999" @click="showAlbum = false">取消</div>
                </div>
            </van-popup>
            <!-- 修改资料 -->
            <van-popup
                teleport="body"
                class="personal-overpop bg-mypageColor"
                v-model:show="showRight"
                position="right"
                :style="{
                    width: '100%',
                    height: '100%'
                }"
            >
                <HeaderBar>
                    <template #left>
                        <div class="text-#aaaaab" @click="cancel">取消</div>
                    </template>
                    <div class="header_title">{{ personalTitle }}</div>
                    <template #right>
                        <div class="text-#1c90c2" @click="done">保存</div>
                    </template>
                </HeaderBar>
                <div class="px-12px w-full py-12px userset-textarea">
                    <van-field
                        v-if="status === 'sign'"
                        class="peronal-input"
                        type="textarea"
                        :border="false"
                        v-model="username"
                        :clear-icon="clearIcon"
                        clearable
                        name="username"
                        show-word-limit
                        maxlength="30"
                        :formatter="formatterStr"
                        :placeholder="personalPlacehold"
                    />
                    <van-field
                        v-else
                        class="peronal-input"
                        :border="false"
                        v-model="username"
                        :clear-icon="clearIcon"
                        clearable
                        name="username"
                        :maxlength="12"
                        :formatter="formatterStr"
                        :placeholder="personalPlacehold"
                    />

                    <div class="text-12px ml-2px mt-14px leading-normal text-#bbbbbc">
                        {{ personalTips }}
                    </div>
                </div>
            </van-popup>
            <!-- 修改生日 -->
            <van-popup
                :overlayStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }"
                teleport="body"
                class="album-overpop"
                v-model:show="showBirth"
                position="bottom"
            >
                <van-date-picker
                    v-model="currentDate"
                    :formatter="formatterYMD"
                    title="选择日期"
                    :min-date="minDate"
                    @cancel="cancel"
                    @confirm="confirmDate"
                />
            </van-popup>
        </div>
        <Teleport to="body">
            <div class="cropper_box z-8888 fixed top-0 left-0 flex-center w-screen h-screen bg-#000" v-if="showCropperPage">
                <div
                    class="hstack z-9999 absolute top-0 left-0 w-full left-0 bg-#f5f5f5 h-40px leading-40px text-16px text-center"
                >
                    <div class="btn flex-1" @click="cancelCrop">取消</div>
                    <div class="btn flex-1" @click="confirmCrop" style="border-left: 1px solid #000000">确定</div>
                </div>

                <cropper :src="img" @change="change" />
            </div>
        </Teleport>
    </div>
</template>

<style lang="scss">
.van-popup.album-overpop {
    background: transparent;
    .album-btn {
        margin: auto;
        margin-bottom: 8px;
        width: 351px;
        height: 44px;
        border-radius: 6px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
        text-align: center;
        line-height: 44px;
        font-size: 14px;
        background-color: #ffffff;
    }
}

.van-popup.personal-overpop {
    .peronal-input {
        box-shadow: 0 4px 12px 0 rgba(52, 166, 202, 0.05);
        line-height: 38px;
        font-weight: bold;
        border-radius: 8px;
        border: solid 1px #d8e1e0;
        .van-icon__image {
            width: 20px;
            height: 20px;
        }
        .van-field__word-limit {
            color: #9da4a4;
            font-weight: normal;
        }
    }
}
</style>
