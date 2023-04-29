<script setup lang="ts">
import { ref, watch } from "vue"
import { useSysStore } from "@/stores/system"

const systemParams = useSysStore()

const show = ref(false)

watch(
    () => systemParams.ActiveMoreRules.isShow,
    (bool: boolean) => {
        if (bool) show.value = true
    }
)

const close = (): void => {
    systemParams.ActiveMoreRules = {
        isShow: false,
        classname: ""
    }
}
</script>

<template>
    <div v-if="systemParams.ActiveMoreRules.isShow">
        <van-dialog
            teleport="body"
            close-on-click-overlay
            v-model:show="show"
            :show-confirm-button="false"
            @close="close"
            className="morerules-diolog"
        >
            <div class="ptgame_more_rule_box" :class="systemParams.ActiveMoreRules.classname">
                <table class="ptgame_more_rule" border="0" cellspacing="0">
                    <tr>
                        <th colspan="2">有效流水不含下面游戏</th>
                    </tr>
                    <tr>
                        <td>捕鱼多福</td>
                        <td>巨龙累积奖金轮盘赌</td>
                    </tr>
                    <tr>
                        <td>疯狂乐透</td>
                        <td>钻石拼轮盘赌</td>
                    </tr>
                    <tr>
                        <td>百家乐</td>
                        <td>迷你轮盘</td>
                    </tr>
                    <tr>
                        <td>专赌21点</td>
                        <td>奖金轮盘</td>
                    </tr>
                    <tr>
                        <td>炸金花</td>
                        <td>完美 21 点</td>
                    </tr>
                </table>
            </div>
            <div class="close-btn" @click="show = false"></div>
        </van-dialog>
    </div>
</template>

<style lang="scss">
.van-dialog.morerules-diolog {
    width: 300px;
    border-radius: 0;
    overflow: visible;
    .close-btn {
        margin: 30px auto 0;
        width: 0.18rem;
        height: 0.18rem;
        background: url("@/assets/img/template/july/leftnav_closeicon.png") no-repeat;
        background-size: 100% 100%;
    }
    .ptgame_more_rule_box {
        width: 300px;
        position: relative;
        background-color: #17191f;
        .ptgame_more_rule {
            width: 100%;
            color: #fff;
            font-size: 14px;
            border: 1px solid var(--vk-primary-green);
            tr {
                width: 100%;
                display: flex;
                justify-content: center;

                &:nth-child(odd) {
                    background: #1c1e25;
                }

                td {
                    &:first-child {
                        border-right: 1px solid #4b5064;
                    }
                }
            }

            th {
                color: #07f1b7;
                font-weight: normal;
                height: 0.4rem;
                text-align: center;
                line-height: 0.4rem;
            }

            td {
                border-top: 1px solid #4b5064;
                height: 0.4rem;
                line-height: 0.4rem;
                text-align: center;
                flex: 1;
            }
        }
        &.quartermaster-style-class {
            background-color: #122333;
            .ptgame_more_rule {
                border-color: #4b5064;
                tr {
                    &:nth-child(odd) {
                        background: #122333;
                    }
                }
                th {
                    color: white;
                }
            }
        }
        &.callfriends {
            .ptgame_more_rule {
                border-color: #b8995e;
                th {
                    color: #b8995e;
                }
            }
        }
        &.regress {
            .ptgame_more_rule {
                border-color: #0ee9e5;
                th {
                    color: #0ee9e5;
                }
            }
        }
        &.DotaMojor {
            .ptgame_more_rule {
                border-color: #405a82;
                th {
                    color: #405a82;
                }
            }
        }
        &.PlayGround {
            .ptgame_more_rule {
                border-color: #c83934;
                th {
                    color: #c83934;
                }
            }
        }
    }
}
</style>
