<script setup lang="ts">
import ApiSetting from "@/api/service"
import { useSysStore } from "@/stores/system"
import { ref } from "vue"
import { useDateFormat } from "@vueuse/core"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { usePlaceImg } from "@/utils/globalImgs"
import { showToast } from "vant"
import { useFreshStore } from "@/stores/fresh"
import type { RollGetUserProfile } from "@/api/pojo/RollGetUserProfile"
import { HttpPlus } from "@/api/HttpPlus"
import type { RollGetHistory } from "@/api/pojo/RollGetHistory"

const { GrayAvatar, lazyPack140 } = usePlaceImg()
const router: Router = useRouter()
const freshStore = useFreshStore()
const systemParams = useSysStore()

const formatDate = (time: number | string): string => {
    return useDateFormat(Number(time), "YYYY/MM/DD HH:mm").value
}

const rollUserInfo = ref<Partial<RollGetUserProfile>>({})
const applyedUser = ref(0)
const winTotal = ref(0)

freshStore.resetList()

//去创建房间
const handleToCreateRoom = (): void => {
    if (rollUserInfo.value?.canCreate == 1) {
        router.push({ path: "/createroom" })
    } else {
        showToast({
            className: "vk-toast-fail",
            message: "没有创建ROLL的权限",
            icon: "warning"
        })
    }
}

//获取基本信息
const getUserProfile = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.roll.getUserProfile)
    const res = await HttpPlus.sendHttpRequest<RollGetUserProfile>()

    if (res.status === 1) {
        rollUserInfo.value = res.data
        applyedUser.value = res.data.extraInfo.applyed_user
        winTotal.value = res.data.extraInfo.win_total
    }
}

//获取获奖列表
const getHistoryList = async (): Promise<void> => {
    freshStore.getList<RollGetHistory, {}>({
        url: ApiSetting.roll.getHistoryList,
        params: {},
        limit: true
    })
}

getUserProfile()
</script>

<template>
    <div class="myroll-page bg-#e8f1ef font-classic">
        <HeaderBar>
            <div class="header_title">我的ROLL</div>
            <template #right>
                <router-link to="/rollrule" class="text-16px">规则</router-link>
            </template>
        </HeaderBar>
        <div class="expand-page">
            <!--用户信息-->
            <div class="user_roll_info">
                <div class="user_headimg">
                    <img
                        class="border-#c6d0db border"
                        v-lazy="{
                            src: systemParams.userInfo.head_image,
                            error: GrayAvatar,
                            loading: GrayAvatar
                        }"
                        alt=""
                    />
                </div>
                <div class="user_roll_info_detail">
                    <div class="info_top">
                        <div class="user_info">
                            <span class="user_name van-ellipsis">{{ systemParams.userInfo.username }}</span>
                            <span class="user_level" :style="{ color: systemParams.userInfo?.color }">
                                VIP.{{ systemParams.userInfo.user_lever }}
                            </span>
                        </div>
                        <!--去成为认证大咖 -->
                        <router-link class="to_apply_actor_btn" to="/applyactor" v-if="rollUserInfo.applyed === 0">
                            成为认证大咖
                        </router-link>
                    </div>
                    <!--已申请的大咖称号-->
                    <div class="user_actors">
                        <span
                            class="tag_box"
                            v-for="(tag, index) in rollUserInfo.userTags"
                            :key="tag.id"
                            v-show="index < 4"
                            :style="{
                                background: 'linear-gradient(#' + tag.background_app + ', #' + tag.border_app + ')'
                            }"
                        >
                            {{ tag.tag_name }}
                        </span>
                    </div>
                    <div class="user_fans_items">
                        <div class="user_fans_number">拥有粉丝{{ applyedUser }}人</div>
                        <div class="split"></div>
                        <div class="user_items_number">纳入囊中{{ winTotal }}件</div>
                    </div>
                </div>
            </div>
            <!--获奖列表-->
            <div class="user_roll_prize_list">
                <div class="title">获奖列表</div>
                <div class="list_row">
                    <div class="roll_time">时间</div>
                    <div class="roll_room_number">房间号</div>
                    <div class="roll_item_prize">获奖饰品</div>
                </div>
                <div class="list_wrapper">
                    <ListLazy
                        :finishedText="!freshStore.listLoading && !freshStore.list.length ? '暂无数据' : '已经全部加载完毕'"
                        @load="getHistoryList"
                    >
                        <div class="list_row van-hairline--bottom" v-for="(item, index) in freshStore.list" :key="index">
                            <div class="roll_time">
                                {{ formatDate(item?.win_time * 1000) }}
                            </div>
                            <div class="roll_room_number">
                                {{ item?.room_id }}
                            </div>
                            <div class="roll_item_prize">
                                <img
                                    v-lazy="{
                                        src: item?.icon_url,
                                        error: lazyPack140,
                                        loading: lazyPack140
                                    }"
                                    alt=""
                                />
                            </div>
                        </div>
                    </ListLazy>
                </div>
            </div>
            <div class="to_createroom_link van-hairline--top" @click="handleToCreateRoom">创建</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.myroll-page {
    line-height: 1.6;
    font-size: 12px;
    :deep(.header-left) {
        width: 32px;
    }
    .user_actors {
        height: 20px;
        line-height: 20px;
    }
    .user_roll_info {
        background-color: #fff;
        padding: 0.15rem;
        display: flex;
        .user_headimg {
            flex: 1;
            box-sizing: border-box;
            padding-right: 0.1rem;
            width: 80px;
            height: 70px;
            img {
                width: 0.7rem;
                height: 0.7rem;
                border-radius: 50%;
            }
        }
        .user_roll_info_detail {
            flex: 4;
            display: flex;
            align-content: center;
            flex-direction: column;
            height: 0.7rem;
            .info_top {
                display: flex;
                justify-content: space-between;
                .to_apply_actor_btn {
                    padding: 0.02rem 0.06rem;
                    border: 1px solid #07ecda;
                    color: #07ecda;
                    border-radius: 0.3rem;
                }
            }
            .user_info {
                height: 0.26rem;
                line-height: 0.26rem;
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
            }
            .user_fans_items {
                display: flex;
                height: 0.2rem;
                align-items: center;
                color: #7c839f;
                margin-top: 0.01rem;
            }
            .split {
                height: 0.15rem;
                width: 1px;
                background-color: #c6d0db;
                margin: 0 0.3rem;
            }
        }
    }
    .user_roll_prize_list {
        padding-top: 0.1rem;
        .title {
            height: 0.2rem;
            font-size: 0.16rem;
            padding-left: 0.12rem;
            font-weight: bold;
            margin-bottom: 0.18rem;
        }
        .list_row {
            display: flex;
            padding: 0 0.12rem;
            color: #7c839f;
            height: 0.22rem;
            line-height: 0.22rem;
            font-size: 0.14rem;
            .roll_time {
                flex: 3;
            }
            .roll_room_number {
                flex: 1;
            }
            .roll_item_prize {
                flex: 2;
                text-align: right;
                height: 100%;
                box-sizing: border-box;
                img {
                    height: 100%;
                }
            }
        }
        .list_wrapper {
            margin-top: 0.05rem;
            margin-bottom: 0.46rem;
            .list_row {
                font-size: 0.16rem;
                height: 0.56rem;
                line-height: 0.56rem;
                .roll_item_prize {
                    line-height: normal;
                    padding: 0.04rem 0;
                }
            }
        }
    }
    .to_createroom_link {
        position: fixed;
        width: 100%;
        left: 0;
        bottom: 0;
        height: 0.46rem;
        line-height: 0.46rem;
        font-size: 0.18rem;
        text-align: center;
        background-color: #fff;
    }
}
</style>
