<script setup lang="ts">
import { ref } from "vue"
import { useSysStore } from "@/stores/system"
import { whenever } from "@vueuse/core"

const systemParams = useSysStore()

const show = ref(false)

whenever(
    () => systemParams.levelInfo.isShow,
    () => {
        show.value = true
    }
)

const close = (): void => {
    systemParams.levelInfo = {
        isShow: false
    }
    systemParams.getDialogStatus()
}
</script>

<template>
    <div v-if="systemParams.levelInfo.isShow">
        <van-dialog
            teleport="body"
            close-on-click-overlay
            v-model:show="show"
            :show-confirm-button="false"
            @close="close"
            className="level-diolog"
        >
            <div
                class="level-wrapper"
                :class="{
                    dispirited: systemParams.levelInfo.type == 11,
                    grading: systemParams.levelInfo.type == 10,
                    happy_classic:
                        (systemParams.levelInfo.type == 9 || systemParams.levelInfo.type == 12) &&
                        systemParams.levelInfo.level == 1,
                    happy_gold:
                        (systemParams.levelInfo.type == 9 || systemParams.levelInfo.type == 12) &&
                        systemParams.levelInfo.level >= 2 &&
                        systemParams.levelInfo.level <= 4,
                    happy_platinum:
                        (systemParams.levelInfo.type == 9 || systemParams.levelInfo.type == 12) &&
                        systemParams.levelInfo.level >= 5 &&
                        systemParams.levelInfo.level <= 7,
                    happy_diamond:
                        (systemParams.levelInfo.type == 9 || systemParams.levelInfo.type == 12) &&
                        systemParams.levelInfo.level >= 8 &&
                        systemParams.levelInfo.level <= 10,
                    happy_honour:
                        (systemParams.levelInfo.type == 9 || systemParams.levelInfo.type == 12) &&
                        systemParams.levelInfo.level == 11,
                    happy_premier:
                        (systemParams.levelInfo.type == 9 || systemParams.levelInfo.type == 12) &&
                        systemParams.levelInfo.level == 12,
                    happy: systemParams.levelInfo.type == 9 || systemParams.levelInfo.type == 12
                }"
            >
                <h3 class="font-bold" v-html="systemParams.levelInfo.title"></h3>
                <p v-html="systemParams.levelInfo.message" v-show="systemParams.levelInfo.type != 10"></p>

                <div @click="levelWarnClose()">
                    <router-link to="vipsystem" class="level_btn" v-show="systemParams.levelInfo.type">
                        {{
                            systemParams.levelInfo.type == 11
                                ? "查看VIP升级规则"
                                : systemParams.levelInfo.type == 9
                                ? "解锁" + systemParams.levelInfo.vip_name + "勋章"
                                : "查看我的特权"
                        }}
                    </router-link>
                </div>
            </div>
            <div class="level_close" @click="show = false"></div>
        </van-dialog>
    </div>
</template>

<style lang="scss">
.van-dialog.level-diolog {
    overflow: visible;
    top: 46%;
    width: 315px;
    .level_close {
        margin: auto;
        width: 0.16rem;
        height: 0.16rem;
        background: url("@/assets/img/vipsystemnew/close.png") no-repeat center;
        background-size: 100% 100%;
        cursor: pointer;

        &:hover {
            background: url("@/assets/img/vipsystemnew/close_h.png") no-repeat;
            background-size: 100% 100%;
        }
    }

    .level_btn {
        position: absolute;
        left: 50%;
        line-height: 35px;
        height: 35px;
        transform: translateX(-50%);
        bottom: 0.6rem;
        width: 1.5rem;
        border-radius: 0.17rem;
        background-image: linear-gradient(to right, #dbb292, #f8dfc4);
        box-shadow: -1px 2.8px 7px 0 rgba(0, 0, 0, 0.28);
        background-color: #dbb292;
        font-size: 0.12rem;
        font-weight: bold;
        color: #78482f;
        text-align: center;
    }

    .level-wrapper {
        position: relative;
        width: 3.15rem;
        height: 3.275rem;
        text-align: center;
        h3 {
            font-size: 0.2rem;
            letter-spacing: 0.02rem;
            line-height: 1.4;
        }

        p {
            font-size: 0.12rem;
            text-align: left;
        }
        /*升级*/
        &.happy {
            background-size: 3.15rem 3.275rem;
            padding-left: 75px;
            padding-top: 30px;

            &.happy_classic {
                background: url("@/assets/img/vipsystemnew/popup/1.png") center top no-repeat;
                background-size: 100% 100%;
                padding-top: 82px;
            }

            &.happy_gold {
                background: url("@/assets/img/vipsystemnew/popup/2-4.png") center top no-repeat;
                background-size: 100% 100%;
            }

            &.happy_platinum,
            &.happy_diamond,
            &.happy_honour,
            &.happy_premier {
                background: url("@/assets/img/vipsystemnew/popup/5-12.png") center top no-repeat;
                background-size: 100% 100%;
            }

            h3 {
                line-height: 1.1;
                text-align: left;
                color: #78482f;
            }

            p {
                transform: scale(0.8);
                transform-origin: left;
                width: 2.5rem;
                color: #875940;
                margin-top: 0.05rem;
            }
        }

        /*降级*/
        &.dispirited {
            background: url("@/assets/img/vipsystemnew/popup/box_dispirited.png") center top no-repeat;
            background-size: 100% 100%;
            padding-top: 100px;

            h3 {
                color: #f2eded;
            }

            p {
                color: #f2eded;
                transform: scale(0.8);
                text-align: center;
                line-height: 2;
                text-align: left;
                display: inline-block;
            }
        }

        /*保级*/
        &.grading {
            background: url("@/assets/img/vipsystemnew/popup/grading.png") center top no-repeat;
            background-size: 100% 100%;
            padding-top: 110px;

            h3 {
                color: #7a492f;
            }
        }
    }
}
</style>
