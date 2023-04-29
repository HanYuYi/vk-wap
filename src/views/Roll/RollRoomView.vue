<script setup lang="ts">
import RollPrizeItem from "./RollPrizeItem.vue"
import RollPlayer from "./RollPlayer.vue"
import ApiSetting from "@/api/service"
import { useCountDown } from "@vant/use"
import { useSysStore } from "@/stores/system"
import { usePlaceImg } from "@/utils/globalImgs"
import { showConfirmDialog, showToast } from "vant"
import { ref, computed } from "vue"
import { useDateFormat } from "@vueuse/core"
import { useRoute, useRouter } from "vue-router"
import type { Router, RouteLocationNormalizedLoaded } from "vue-router"
import { formatterStr } from "@/composable/validate"
import { HttpPlus } from "@/api/HttpPlus"
import type { RollGetRoomApplyList } from "@/api/pojo/RollGetRoomApplyList"
import type { RollGetRoomWinList } from "@/api/pojo/RollGetRoomWinList"
import type { Info, RollView } from "@/api/pojo/RollView"

const route: RouteLocationNormalizedLoaded = useRoute()
const router: Router = useRouter()
const systemParams = useSysStore()
const { GrayAvatar }: Record<string, string> = usePlaceImg()

const headTitle = computed(() => {
    return `房间号：${route.query.id}`
})

const editBtnDis = computed<boolean>(() => {
    if (editRoomDialog.value.showPwdInput) {
        return !editRoomDialog.value.desc || !editRoomDialog.value.roomPwd
    } else {
        return !editRoomDialog.value.desc
    }
})

const editBtnLoading = ref(false)

const editRoomSubmit = async (): Promise<void> => {
    editBtnLoading.value = true
    try {
        const params = {
            room_id: masterInfo.value.id,
            desc: editRoomDialog.value.desc,
            password: editRoomDialog.value.roomPwd
        }

        HttpPlus.setUrlOptions(ApiSetting.roll.editRoom)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        editBtnLoading.value = false

        if (res.status === 1) {
            masterInfo.value.desc = editRoomDialog.value.desc
            showToast({
                className: "vk-toast-success",
                message: res.message,
                icon: "checked"
            })
            const timer = setTimeout(() => {
                clearTimeout(timer)
                showRight.value = false
            }, 300)
        }
    } catch (error: unknown) {
        editBtnLoading.value = false
        throw error
    }
}

const showPopover = ref(false)
const btnLoading = ref(false)

const btnText = computed(() => {
    if (rollRoomInfo.value.is_end) {
        return "活动已结束"
    }
    if (rollRoomInfo.value.is_owner) {
        return "编辑房间"
    }
    if (rollRoomInfo.value.has_applyed) {
        return "已参与"
    }
    return "参与活动"
})

const btnDisable = computed(() => {
    return Boolean(rollRoomInfo.value.is_end || rollRoomInfo.value.has_applyed)
})

const rollRoomInfo = ref<Partial<RollView>>({})
const masterInfo = ref<Partial<Info>>({})
const showCountDown = ref(false)
const userLevel = ref(0)
const needTips = ref("")

const showRight = ref(false)

const editRoomDialog = ref({
    visible: false,
    desc: "",
    roomPwd: "",
    showPwdInput: false
})

const roomPwdDialog = ref({
    visible: false,
    roomPwd: "",
    verfiyCode: "",
    veriImgUrl: ""
})

const hanldeShowMore = (type: number) => {
    if (type === 1) {
        //奖品池
        systemParams.setRouteParams<{ prize: RollView["items"] }>({ prize: rollRoomInfo.value?.items })
        router.push("/rollroom/prize")
    }
    if (type === 2) {
        //参与名单
        router.push(`/rollroom/players?id=${route.query.id}`)
    }
    if (type === 3) {
        //获奖名单
        router.push(`/rollroom/rewards?id=${route.query.id}`)
    }
}

const popTitle = computed(() => {
    if (editRoomDialog.value.visible) {
        return "编辑房间"
    }
    if (roomPwdDialog.value.visible) {
        return "参加活动"
    }
    return ""
})

// 参与活动
const join = (): void => {
    if (rollRoomInfo.value.is_owner) {
        // 编辑房间
        editRoomDialog.value.desc = ""
        editRoomDialog.value.roomPwd = ""
        editRoomDialog.value.visible = true
        showRight.value = true
    } else {
        // 参与活动
        roomPwdDialog.value.roomPwd = ""
        roomPwdDialog.value.verfiyCode = ""
        if (systemParams.isLogin) {
            if (rollRoomInfo.value.need_pass) {
                roomPwdDialog.value.visible = true
                showRight.value = true
                changeVerCodeImg()
            } else {
                joinRoomSubmit()
            }
        } else {
            showToast({
                className: "vk-toast-fail",
                message: "请您先登录",
                icon: "warning"
            })
        }
    }
}

const resetPop = (): void => {
    editRoomDialog.value.desc = ""
    editRoomDialog.value.roomPwd = ""
    editRoomDialog.value.visible = false
    roomPwdDialog.value.roomPwd = ""
    roomPwdDialog.value.verfiyCode = ""
    roomPwdDialog.value.visible = false
}

//验证码切换
const changeVerCodeImg = (): void => {
    roomPwdDialog.value.veriImgUrl = systemParams.verCodeUrl + "?" + new Date().getTime()
}

//提交参与活动
const joinRoomSubmit = async (): Promise<void> => {
    systemParams.PageLoading = true
    const params = {
        room_id: route.query.id,
        password: roomPwdDialog.value.roomPwd,
        verify: roomPwdDialog.value.verfiyCode
    }
    try {
        HttpPlus.setUrlOptions(ApiSetting.roll.joinRoom)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)

        systemParams.PageLoading = false
        if (res.status === 1) {
            rollRoomInfo.value.has_applyed = 1
            showToast({
                className: "vk-toast-success",
                message: res.message,
                icon: "checked"
            })
            roomPwdDialog.value.visible = false
            showRight.value = false
            loadRollRoomPlayerList()
        }
    } catch (e: unknown) {
        systemParams.PageLoading = false
        throw e
    }
}

// 是否要撤销房间
const cancel = async (): Promise<void> => {
    try {
        const dialogRes = await showConfirmDialog({
            title: "提示",
            message: "您确认要撤销此活动吗？",
            className: "vk-confirm-dialog",
            confirmButtonText: "确定",
            width: 300
        })
        if (dialogRes === "confirm") {
            systemParams.PageLoading = true
            HttpPlus.setUrlOptions(ApiSetting.roll.cancelRoom)
            const res = await HttpPlus.sendHttpRequest<{}, { room_id: number }>({
                room_id: masterInfo.value.id
            })

            systemParams.PageLoading = false
            if (res.status === 1) {
                showToast({
                    className: "vk-toast-success",
                    message: res.message,
                    icon: "checked"
                })
                router.push("/roll")
            }
        }
    } catch (e: unknown) {
        // on cancel
        systemParams.PageLoading = false
    }
}

const formatDate = (day: number): string[] => {
    return day.toString().split("")
}

const playerList = ref<RollGetRoomApplyList["list"]>([])

const playerListCount = ref(0)
// 参与名单
const loadRollRoomPlayerList = async (): Promise<void> => {
    const params = {
        room_id: route.query.id,
        page: 1
    }

    HttpPlus.setUrlOptions(ApiSetting.roll.getRoomPlayerList)
    const res = await HttpPlus.sendHttpRequest<RollGetRoomApplyList, typeof params>(params)
    if (res.status === 1) {
        playerListCount.value = res.data.count
        if (res.data.list.length) {
            playerList.value = res.data.list
        }
    }
}

const countDown = useCountDown({
    time: 60 * 1000,
    onFinish: () => {
        countDown.reset()
    }
})
const countdownTime = countDown.current

const getRoomInfo = async (): Promise<void> => {
    systemParams.PageLoading = true

    HttpPlus.setUrlOptions(ApiSetting.roll.getRoomInfo)
    const res = await HttpPlus.sendHttpRequest<RollView, { room_id: string }>({
        room_id: route.query.id as string
    })
    systemParams.PageLoading = false

    if (res.status === 1) {
        if (res.data.info.is_del || res.data.info.is_hide) {
            router.push("/roll")
            return
        }

        rollRoomInfo.value = res.data

        showCountDown.value = !res.data.is_end
        masterInfo.value = res.data.info
        userLevel.value = res.data.user_lever
        if (showCountDown.value) {
            const offset = new Date(res.data.info.end_time * 1000).getTime() - new Date().getTime()
            if (offset <= 0) {
                showCountDown.value = false
                return
            }
            countDown.reset(offset)
            countDown.start()
        }
        if (res.data.is_end) {
            loadRoomAwardsPlayerList()
        }
        // 参与条件
        if (res.data.needJoin.length) {
            needTips.value = res.data.needJoin.join(",")
        }
        //修改房间  是否需要密码
        editRoomDialog.value.showPwdInput = Boolean(res.data.passAvalible)
    }
}

const winPlayerList = ref<RollGetRoomWinList["data"]>([])

// 获取获奖名单
const loadRoomAwardsPlayerList = async (): Promise<void> => {
    winPlayerList.value = []
    HttpPlus.setUrlOptions(ApiSetting.roll.getRoomAwardsPlayerList)
    const res = await HttpPlus.sendHttpRequest<RollGetRoomWinList["data"], { room_id: string }>({
        room_id: route.query.id as string
    })

    if (res.status === 1 && res.data.length) {
        winPlayerList.value = res.data
    }
}

if (!route.query.id) {
    if (!window.history.state) {
        router.push("/")
    } else {
        router.back()
    }
}

getRoomInfo()
loadRollRoomPlayerList()
</script>

<template>
    <div class="rollroom-page bg-#e8f1ef font-classic">
        <HeaderBar>
            <div class="header_title">{{ headTitle }}</div>
            <template #right>
                <div class="text-15px w-81px text-right">
                    <span @click="cancel" v-if="rollRoomInfo?.is_owner && masterInfo?.apply_total == 0">
                        {{ route.meta.rightTitle }}
                    </span>
                </div>
            </template>
        </HeaderBar>
        <div class="expand-page">
            <!--倒计时-->
            <div class="roll_countdown" v-if="showCountDown">
                <div class="coundown_title">开奖倒计时</div>
                <div class="num_box" v-if="formatDate(countdownTime?.days).length === 1">
                    {{ countdownTime?.days }}
                </div>
                <template v-else>
                    <div class="num_box">{{ formatDate(countdownTime?.days)[0] }}</div>
                    <div class="num_box">{{ formatDate(countdownTime?.days)[1] }}</div>
                </template>
                <div>天</div>
                <template v-if="formatDate(countdownTime?.hours).length === 1">
                    <div class="num_box">0</div>
                    <div class="num_box">
                        {{ countdownTime?.hours }}
                    </div>
                </template>
                <template v-else>
                    <div class="num_box">{{ formatDate(countdownTime?.hours)[0] }}</div>
                    <div class="num_box">{{ formatDate(countdownTime?.hours)[1] }}</div>
                </template>
                <div class="time_split"></div>
                <template v-if="formatDate(countdownTime?.minutes).length === 1">
                    <div class="num_box">0</div>
                    <div class="num_box">
                        {{ countdownTime?.minutes }}
                    </div>
                </template>
                <template v-else>
                    <div class="num_box">{{ formatDate(countdownTime?.minutes)[0] }}</div>
                    <div class="num_box">{{ formatDate(countdownTime?.minutes)[1] }}</div>
                </template>
                <div class="time_split"></div>
                <template v-if="formatDate(countdownTime?.seconds).length === 1">
                    <div class="num_box">0</div>
                    <div class="num_box">
                        {{ countdownTime?.seconds }}
                    </div>
                </template>
                <template v-else>
                    <div class="num_box">{{ formatDate(countdownTime?.seconds)[0] }}</div>
                    <div class="num_box">{{ formatDate(countdownTime?.seconds)[1] }}</div>
                </template>
            </div>
            <!--roll房间信息-->
            <div class="user_roll_info van-hairline--bottom">
                <div class="user_headimg">
                    <img
                        v-lazy="{
                            src: masterInfo?.head_image,
                            error: GrayAvatar,
                            loading: GrayAvatar
                        }"
                        alt=""
                    />
                </div>
                <div class="user_roll_info_detail">
                    <div class="info_top">
                        <span class="user_name van-ellipsis">{{ masterInfo.username }}</span>
                        <span class="user_level" :class="'lv' + userLevel">VIP.{{ userLevel }}</span>
                        <span class="win_player_count fr">可获奖人数:{{ masterInfo.total_win }}人</span>
                    </div>
                    <div class="user_actors">
                        <span
                            class="tag_box"
                            v-for="(tag, index) in masterInfo.user_tags"
                            :key="tag.id"
                            v-show="index < 4"
                            :style="{
                                background: 'linear-gradient(#' + tag.background_app + ', #' + tag.border_app + ')'
                            }"
                        >
                            {{ tag.tag_name }}
                        </span>
                    </div>
                    <div class="roll_time">
                        ROLL时间:
                        {{ useDateFormat(Number(masterInfo?.end_time * 1000), "YYYY/MM/DD HH:mm").value }}
                    </div>
                </div>
            </div>
            <!--房间状态-->
            <div class="room_desc_join">
                <div class="room_desc">
                    {{ masterInfo.desc }}
                </div>
                <div class="roll_room_btn">
                    <van-button
                        class="border-none h-30px leading-30px rounded-30px text-15px"
                        :class="{
                            'bg-#f2f2f5! opacity-100 text-#53586b': btnDisable,
                            'primary-btn text-black': !btnDisable
                        }"
                        @click="join"
                        :loading="btnLoading"
                        :disabled="btnDisable"
                        block
                    >
                        {{ btnText }}
                    </van-button>
                </div>
                <div class="room_limit" v-show="needTips">参与条件{{ needTips }}</div>
            </div>
            <!--奖品池-->
            <div class="roll_prize_pool section">
                <div class="section_top">
                    <span class="title">奖品池</span>
                    <van-popover :offset="[38, 2]" class="roll-popover" v-model:show="showPopover" theme="dark">
                        <span class="popover-tooltip-content">本站的饰品价格参考自Steam市场价格</span>
                        <template #reference>
                            <span class="price_tip">!</span>
                        </template>
                    </van-popover>
                    <span class="item_total">
                        (共{{ masterInfo.count ? masterInfo.count : 0 }}件 | 总价值￥{{
                            masterInfo.price ? masterInfo.price : "0.00"
                        }})
                    </span>
                    <div class="to_more fr" @click="hanldeShowMore(1)">查看更多&gt;</div>
                </div>

                <RollPrizeItem :items="rollRoomInfo?.items ?? []" />
            </div>
            <!--参与名单-->
            <div class="join_player_list section" v-if="playerList.length > 0">
                <div class="section_top">
                    <span class="title">参与玩家</span>
                    <span class="item_total">(共{{ playerListCount }}人)</span>
                    <div class="to_more fr" @click="hanldeShowMore(2)">查看更多&gt;</div>
                </div>
                <div class="section_content player_list">
                    <RollPlayer :items="playerList.slice(0, 8)" />
                </div>
            </div>
            <!--获奖名单-->
            <div class="win_player_list section" v-if="winPlayerList.length">
                <div class="section_top">
                    <span class="title">获奖名单</span>
                    <span class="item_total">(共{{ winPlayerList.length }}人)</span>
                    <div class="to_more fr" @click="hanldeShowMore(3)" v-if="winPlayerList.length > 8">查看更多&gt;</div>
                </div>
                <div class="section_content win_player player_list">
                    <RollPlayer showPrize :items="winPlayerList.slice(0, 8)" />
                </div>
            </div>
        </div>
        <!-- 右侧弹出 编辑房间-->
        <van-popup @closed="resetPop" v-model:show="showRight" position="right" :style="{ width: '100%', height: '100%' }">
            <HeaderBar>
                <template #left>
                    <div @click="showRight = false" class="top-icon left-icon"></div>
                </template>
                <div class="header_title">{{ popTitle }}</div>
                <template #right>
                    <div class="icon-placeholder w-22px h-22px"></div>
                </template>
            </HeaderBar>
            <!-- 编辑房间 -->
            <div class="expand-page bg-#e8f1ef py-15px text-#262933" v-if="editRoomDialog.visible">
                <div class="edit_box">
                    <p class="px-12px h-25px text-17px font-bold leading-relaxed">房间概述</p>
                    <van-field
                        class="bg-transparent"
                        v-model="editRoomDialog.desc"
                        clearable
                        rows="6"
                        autosize
                        type="textarea"
                        :formatter="formatterStr"
                        maxlength="256"
                        placeholder="活动说明最多不能超过256字"
                        show-word-limit
                    />
                </div>
                <div
                    class="edit_box_password text-14px hstack justify-between pl-12px h-50px mt-10px van-hairline--top van-hairline--bottom"
                    v-if="editRoomDialog.showPwdInput"
                >
                    <p class="edit_box_password_p1 whitespace-nowrap">房间新密码</p>
                    <van-field
                        class="bg-transparent"
                        input-align="right"
                        clearable
                        :formatter="formatterStr"
                        v-model="editRoomDialog.roomPwd"
                        placeholder="请输入房间新密码"
                    />
                </div>
                <div class="w-350px mt-30px mx-auto">
                    <van-button
                        :disabled="editBtnDis"
                        :loading="editBtnLoading"
                        block
                        class="primary-btn h-30px leading-30px rounded-30px text-15px text-#000"
                        @click="editRoomSubmit"
                    >
                        确认
                    </van-button>
                </div>
            </div>
            <!-- 参加活动 -->
            <div class="expand-page bg-#e8f1ef text-#262933" v-if="roomPwdDialog.visible">
                <div class="room_pwd_input_box van-hairline--bottom">
                    <van-field
                        clearable
                        :formatter="formatterStr"
                        v-model="roomPwdDialog.roomPwd"
                        placeholder="请输入ROLL密码"
                        label="ROLL密码"
                    />
                </div>
                <div class="room_pwd_input_box hstack pr-12px bg-white">
                    <van-field
                        :border="false"
                        clearable
                        :formatter="formatterStr"
                        v-model="roomPwdDialog.verfiyCode"
                        placeholder="请输入验证码"
                        label="验证码"
                    />
                    <img
                        class="vercode_img block w-70px h-30px"
                        :src="roomPwdDialog.veriImgUrl"
                        @click="changeVerCodeImg"
                        alt="验证码"
                    />
                </div>
                <div class="w-350px mt-20px mx-auto">
                    <van-button
                        :disabled="!roomPwdDialog.roomPwd || !roomPwdDialog.verfiyCode"
                        block
                        class="primary-btn h-30px leading-30px rounded-30px text-15px text-#000"
                        @click="joinRoomSubmit"
                    >
                        立即参与
                    </van-button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/style/vip.scss";
.rollroom-page {
    line-height: 1.6;
    font-size: 12px;
    .fr {
        float: right;
    }
    .roll_countdown {
        height: 0.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f5f5f5;
        font-size: 0.14rem;
        .coundown_title {
            margin-right: 0.1rem;
        }
        .num_box {
            background-color: #262933;
            border-radius: 0.03rem;
            width: 0.18rem;
            color: #c6d0db;
            text-align: center;
            font-size: 0.16rem;
            height: 0.24rem;
            margin: 0 0.03rem;
        }
        .time_split {
            height: 0.24rem;
            width: 0.04rem;
            background: url("@/assets/img/template/july/roll/time_dot.png") no-repeat center;
            background-size: contain;
        }
    }
    .user_actors {
        height: 0.2rem;
        line-height: 0.2rem;
        .tag_box {
            display: inline-block;
            height: 0.192rem;
            font-size: 0.12rem;
            line-height: 0.192rem;
            padding: 0 0.062rem;
            margin-right: 0.03rem;
            vertical-align: middle;
            border-radius: 0.3rem;
            color: #fff;
        }
    }
    .user_roll_info {
        background-color: #fff;
        padding: 0.15rem;
        display: flex;
        .user_headimg {
            flex: 1;
            box-sizing: border-box;
            padding-right: 0.1rem;
            img {
                width: 0.7rem;
                border-radius: 50%;
            }
        }
        .user_roll_info_detail {
            flex: 4;
            height: 0.7rem;
            .info_top {
                width: 100%;
                height: 0.26rem;
                line-height: 0.26rem;
            }
            .user_name {
                font-size: 0.16rem;
                display: inline-block;
                max-width: 1.2rem;
                vertical-align: middle;
                font-weight: bold;
            }
            .user_level {
                margin-left: 0.1rem;
                display: inline-block;
                vertical-align: middle;
            }
            .roll_time {
                display: flex;
                height: 0.2rem;
                justify-content: flex-start;
                align-items: center;
                color: #7c839f;
                margin-top: 0.04rem;
            }
        }
    }
    .room_desc_join {
        padding: 0.2rem;
        background-color: #fff;
        .room_desc {
            min-height: 0.5rem;
        }
        .roll_room_btn {
            margin-top: 0.1rem;
        }
        .room_limit {
            margin-top: 0.1rem;
            color: #c6d0db;
            text-align: center;
        }
    }
    .section {
        padding: 0.15rem 0.12rem 0.06rem;
        .section_top {
            color: #7c839f;
            height: 0.3rem;
            line-height: 0.3rem;
            > * {
                display: inline-block;
            }
            > span {
                vertical-align: baseline;
            }
            .title {
                font-size: 0.18rem;
                font-weight: bold;
                color: #262933;
            }
            .price_tip {
                display: inline-block;
                height: 0.15rem;
                width: 0.15rem;
                text-align: center;
                line-height: 0.15rem;
                border: 1px solid #7c839f;
                border-radius: 50%;
                margin: 0 0.05rem;
            }
        }
        .section_content {
            max-height: 5rem;
            overflow: hidden;
            margin-top: 0.1rem;
        }
    }
    .roll_item_list {
        max-height: 1.26rem;
        overflow: hidden;
        margin-top: 0.1rem;
    }
    .join_player_list .item_total,
    .win_player_list .item_total {
        margin-left: 0.06rem;
    }
}
</style>
<style lang="scss">
.roll-popover {
    font-size: 12px;
    line-height: 1.6;
    .van-popover__arrow {
        color: #262933;
    }
    .van-popover__content {
        background: #262933;
        padding: 0 0.05rem;
        border-radius: 3px;
    }
    .popover-tooltip-content {
        color: #fff;
    }
}
</style>
