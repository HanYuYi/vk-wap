<script setup lang="ts">
import { useSysStore } from "@/stores/system"
import { usePlaceImg } from "@/utils/globalImgs"
import { useStartGame } from "@/composable/util"
import type { GameOptions } from "@/composable/util"

const { lazyNewLogo } = usePlaceImg()
const systemParams = useSysStore()

/**
 * Props
 */
interface Props {
    item: {
        // 直播状态
        status: number

        // 直播类型
        game_type: number

        // 直播名称
        league_name: string

        // 直播时间
        show_time: string

        // 左侧战队logo
        home_team_pic: string

        // 左侧战队名称
        home_team_name: string

        // 投一注跳转参数
        bet_url_pc?: {
            jump_url: GameOptions["url"]
            is_need_login: GameOptions["isNeedLogin"]
            is_check_name: GameOptions["isCheckName"]
        }

        // 右侧战队logo
        away_team_pic: string

        // 右侧战队名称
        away_team_name: string
    }
}
const props = defineProps<Props>()
</script>

<template>
    <div class="live-list-item">
        <slot name="statu-label">
            <div class="status-label" :class="{ 'label-disabled': props.item.status != 2 }">
                <div class="label-text">
                    <img
                        v-if="props.item.game_type === 1"
                        class="live-status-icon"
                        src="@/assets/img/template/july/news/live/living-foot.png"
                        alt=""
                    />
                    <img
                        v-if="props.item.game_type === 2"
                        class="live-status-icon"
                        src="@/assets/img/template/july/news/live/living-bas.png"
                        alt=""
                    />
                    <img
                        v-if="props.item.game_type === 3"
                        class="live-status-icon"
                        src="@/assets/img/template/july/news/live/living-es.png"
                        alt=""
                    />
                    <span class="text" :style="props.item.status != 2 && 'color:#6c6c6c'">
                        {{ props.item.status === 2 ? "直播中" : "未开始" }}
                    </span>
                </div>
            </div>
        </slot>
        <slot name="living-img">
            <div class="liveing-img" v-if="props.item.status === 2"></div>
        </slot>
        <slot name="top">
            <div class="live-match-title">
                <span class="title-text van-ellipsis font-robot">{{ props.item.league_name }}</span>
            </div>
            <div class="live-match-time font-robot" v-if="props.item.status != 2">
                {{ props.item.show_time }}
            </div>
        </slot>
        <div class="mt-1px flex">
            <div class="left-match">
                <img
                    class="team-logo"
                    v-lazy="{
                        src: props.item.home_team_pic,
                        error: lazyNewLogo,
                        loading: lazyNewLogo
                    }"
                    alt=""
                />
                <div class="team-name van-ellipsis font-robot">
                    {{ props.item.home_team_name }}
                </div>
            </div>
            <slot name="center">
                <div class="center-match">
                    <div class="vs-text font-robot" :style="props.item.status != 2 && 'visibility: hidden'">VS</div>
                    <div
                        class="bet-btn primary-btn"
                        @click.stop="
                            () => {
                                useStartGame(
                                    {
                                        url: props.item.bet_url_pc.jump_url,
                                        isNeedLogin: props.item.bet_url_pc.is_need_login,
                                        isCheckName: props.item.bet_url_pc.is_check_name,
                                        changeFlag: systemParams.userInfo.change_flag
                                    },
                                    systemParams.isLogin,
                                    true
                                )
                            }
                        "
                    >
                        投一注
                    </div>
                </div>
            </slot>
            <div class="right-match">
                <img
                    class="team-logo"
                    v-lazy="{
                        src: props.item.away_team_pic,
                        error: lazyNewLogo,
                        loading: lazyNewLogo
                    }"
                    alt=""
                />
                <div class="team-name van-ellipsis font-robot">
                    {{ props.item.away_team_name }}
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.live-list-item {
    text-align: center;
    margin: 9px auto 8px;
    width: 345px;
    height: 112px;
    background: url("@/assets/img/template/july/news/live/item-bg.png") no-repeat center;
    background-size: 100% 100%;
    border-radius: 10px;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.2);
    position: relative;
    .left-match,
    .right-match {
        flex: 0.35;
    }

    .center-match {
        flex: 0.3;
    }
    .status-label {
        position: absolute;
        top: 0;
        left: -4.5px;
        width: 55.5px;
        height: 56.5px;
        background: url("@/assets/img/template/july/news/live/live-label.png") no-repeat center;
        background-size: 100% 100%;
        font-size: 12px;
        color: #fff;

        &.label-disabled {
            background-image: url("@/assets/img/template/july/news/live/live-label-dis.png");
        }

        .label-text {
            display: flex;
            align-items: center;
            position: relative;
            top: 7.5px;
            text-align: center;
            white-space: nowrap;
            transform: rotate(-30deg);

            .live-status-icon {
                position: relative;
                left: -4px;
                width: 19px;
                height: 19px;
            }

            .text {
                line-height: 1.2;
                display: inline-block;
                transform: scale(0.75);
                position: relative;
                top: 1px;
                left: -7px;
            }
        }
    }

    :deep(.liveing-img) {
        position: absolute;
        right: 15px;
        top: 7.5px;
        width: 20px;
        height: 20px;
        background: url("@/assets/img/template/july/news/live/live_gif.gif") no-repeat center;
        background-size: 100% 100%;

        &.sche-img {
            top: 8px;
            width: 17px;
            height: 16.5px;
            background-image: url("@/assets/img/template/july/news/live/sche-img.png");
        }
    }

    .live-match-title {
        font-size: 15px;
        color: #000;
        line-height: 1.6;

        .title-text {
            width: 200px;
            display: inline-block;
            margin-top: 8px;
        }
    }

    .live-match-time {
        line-height: 1.6;
        position: absolute;
        top: 31px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        color: var(--vk-old-light-text-color);
    }
    .team-logo {
        width: 26px;
        height: 26px;
    }

    .team-name {
        line-height: 2.5;
        margin: auto;
        font-size: 12px;
        color: #000;
        max-width: 84px;
    }

    :deep(.vs-text) {
        line-height: 2;
        font-size: 12px;
        color: #4b566b;
        white-space: nowrap;
    }

    .bet-btn {
        margin: 9px auto 0;
        width: 80px;
        height: 30px;
        border-radius: 15px;
        box-sizing: border-box;
        line-height: 31px;
        font-size: 12px;
        font-weight: bold;
        color: #000;
    }
}
</style>
