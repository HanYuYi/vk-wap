<script setup lang="ts">
import ApiSetting from "@/api/service"
import { ref } from "vue"
import { useSysStore } from "@/stores/system"
import { HttpPlus } from "@/api/HttpPlus"

const systemParams = useSysStore()

class ActiveNewWelfare extends Array {
    data: {
        vb: number

        title: string

        desc: string

        has_get: boolean

        url: string

        button: string
    }[] = []
}

const list = ref<ActiveNewWelfare["data"]>(new ActiveNewWelfare().data)

const init = async (): Promise<void> => {
    systemParams.PageLoading = true
    HttpPlus.setUrlOptions(ApiSetting.active.getNewplayerWelfareList)
    const res = await HttpPlus.sendHttpRequest<ActiveNewWelfare["data"]>()
    systemParams.PageLoading = false
    if (res.status === 1) {
        list.value = res.data
    }
}

init()
</script>

<template>
    <div class="font-classic leading-relaxed bg-#17191f">
        <HeaderBar>
            <div class="header_title">新人专属福利</div>
        </HeaderBar>

        <div class="expand-page NewWelfare-page">
            <!-- banner-->
            <div class="banner">
                <img src="@/assets/img/active/general/NewWelfare/banner.png" alt="" />
            </div>
            <div class="active_wrapper get_prize_list">
                <section v-if="list.length">
                    <div class="get_prize_box clear-both" v-for="(item, index) in list" :key="index" :class="['b' + (index + 1)]">
                        <div class="vb">
                            <span>
                                <em>{{ item.vb }}</em>
                                VB
                            </span>
                        </div>
                        <div class="box_info">
                            <span class="info_wrapper">
                                <div class="text_title">{{ item.title }}</div>
                                <div class="box_desc" v-html="item.desc"></div>
                            </span>
                        </div>
                        <div class="box_btn">
                            <span class="got" v-if="item.has_get">
                                <img src="@/assets/img/active/general/NewWelfare/icon-welfare-got.png" alt="" />
                            </span>
                            <router-link :to="item.url" class="get" v-else>{{ item.button }}</router-link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.NewWelfare-page {
    .banner {
        width: 100%;
        position: relative;
        img {
            width: inherit;
            pointer-events: none;
        }
    }
    section {
        margin-top: 0.2rem;
        font-size: 0.14rem;
    }
    .get_prize_list {
        position: relative;
        width: 100%;
        top: -50px;
        padding: 0 15px 8px;
        .get_prize_box {
            border-radius: 0.06rem;
            padding: 0.1rem 0.12rem;
            height: 102px;
            line-height: 90px;
            font-size: 0.14rem;
            margin: 0.06rem;
            > div {
                float: left;
                box-sizing: border-box;
                padding: 0 0 0 0.05rem;
                height: 100%;
            }
            .box_btn {
                width: 22%;
                text-align: right;
                .get {
                    display: inline-block;
                    vertical-align: middle;
                    width: 100%;
                    height: 0.28rem;
                    line-height: 0.28rem;
                    background: url("@/assets/img/active/general/NewWelfare/btn_normal.png") no-repeat;
                    background-size: 100% 100%;
                    text-align: center;
                    font-size: 0.12rem;
                    &:active {
                        background-image: url("@/assets/img/active/general/NewWelfare/btn_pressed.png");
                    }
                }
                .got {
                    display: inline-block;
                    height: 100%;
                    width: 90%;
                    text-align: right;
                    img {
                        width: 100%;
                        vertical-align: middle;
                    }
                }
            }
            .vb {
                width: 18%;
                text-align: center;
                color: #f4d364;
                position: relative;
                background: url("@/assets/img/active/general/NewWelfare/Vcoin.png") no-repeat;
                background-size: 100% auto;
                span {
                    position: absolute;
                    text-align: center;
                    line-height: normal;
                    left: 0;
                    width: 100%;
                    bottom: 0.05rem;
                    font-weight: bold;
                    em {
                        font-size: 0.18rem;
                        font-style: normal;
                    }
                }
            }
        }
        .box_info {
            width: 60%;
            color: #7c839f;
            overflow: hidden;
            .text_title {
                color: #fff;
                font-size: 0.18rem;
            }
            .info_wrapper {
                display: inline-block;
                vertical-align: middle;
                width: 100%;
                line-height: normal;
                .box_desc {
                    font-size: 0.12rem;
                }
            }
        }
    }
    .get_prize_box.b1 {
        background: url("@/assets/img/active/general/NewWelfare/welfare_b1.png") no-repeat;
        background-size: 100% 100%;
    }
    .get_prize_box.b2 {
        background: url("@/assets/img/active/general/NewWelfare/welfare_b2.png") no-repeat;
        background-size: 100% 100%;
    }
    .get_prize_box.b3 {
        background: url("@/assets/img/active/general/NewWelfare/welfare_b3.png") no-repeat;
        background-size: 100% 100%;
    }
    .get_prize_box.b4 {
        background: url("@/assets/img/active/general/NewWelfare/welfare_b4.png") no-repeat;
        background-size: 100% 100%;
    }
    .get_prize_box.b5 {
        background: url("@/assets/img/active/general/NewWelfare/welfare_b5.png") no-repeat;
        background-size: 100% 100%;
    }
    .get_prize_box.b6 {
        background: url("@/assets/img/active/general/NewWelfare/welfare_b6.png") no-repeat;
        background-size: 100% 100%;
    }
    .get_prize_box.b7 {
        background: url("@/assets/img/active/general/NewWelfare/welfare_b7.png") no-repeat;
        background-size: 100% 100%;
    }
}
</style>
