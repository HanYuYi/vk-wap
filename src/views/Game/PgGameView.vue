<script setup lang="ts">
import ApiSetting from "@/api/service"
import { useStartGame } from "@/composable/util"
import { useSysStore } from "@/stores/system"
import { showToast } from "vant"
import { ref, unref } from "vue"
import type { gameListItem } from "@/api/pojo/PgGetGameList"
import { HttpPlus } from "@/api/HttpPlus"
import type { PgGetGameList } from "@/api/pojo/PgGetGameList"

const systemParams = useSysStore()

const gameList = ref<gameListItem[]>([{ hot: 0, game_code: "all", title: "全部", icon: "" }])

const showMaintainPage = ref(true)
const maintainTime = ref("")
const maintainText = ref("")
const showPage = ref(true)

const url = ref("")

const init = async (): Promise<void> => {
    showPage.value = true
    showMaintainPage.value = false
    systemParams.PageLoading = true

    HttpPlus.setUrlOptions(ApiSetting.getPGList)
    const res = await HttpPlus.sendHttpRequest<PgGetGameList>()
    systemParams.PageLoading = false

    if (res.status === 1) {
        gameList.value = gameList.value.concat(res.data.game_list)
        url.value = res.data.game_play
    } else {
        showPage.value = false
        showMaintainPage.value = true
        maintainTime.value = res.message
        maintainText.value = res.info
    }
}

const getDashKey = (key: string): string => {
    return key ? key.replace(/\\-/g, "_") : ""
}

const jumpToGame = (key: string): void => {
    if (!key) {
        showToast({
            className: "vk-toast-fail",
            message: "请稍后再试",
            icon: "warning"
        })
        return
    }

    if (url.value) {
        useStartGame(
            {
                url: unref(url) + "?game_code=" + (key === "all" ? "" : key),
                isNeedLogin: true,
                isCheckName: true,
                changeFlag: systemParams.userInfo.change_flag
            },
            systemParams.isLogin,
            true
        )
    }
}

init()
</script>

<template>
    <div class="bg-#e8f1ef font-classic leading-relaxed!">
        <HeaderBar>
            <div class="header_title">PG电子游艺</div>
        </HeaderBar>
        <div class="expand-page pggame-page">
            <div class="wrapper" v-if="showMaintainPage">
                <Maintain :time="maintainTime" :content="maintainText"></Maintain>
            </div>
            <div class="relative" v-if="showPage">
                <img class="game_banner" src="@/assets/img/pggame/vk-wap-inner-banner.jpg" />
                <section>
                    <ul class="game_list">
                        <li class="game_item sprite" v-for="(item, index) in gameList" :key="index">
                            <div class="game_item_icon_box" :class="{ game_item_icon_big_box: item.big }">
                                <span
                                    class="game_item_icon sprite"
                                    v-show="!item.hot"
                                    @click="jumpToGame(item.game_code)"
                                    :class="[getDashKey(item.game_code), item.game_code !== 'all' ? 'bg' : '']"
                                    :style="{
                                        backgroundImage: item.game_code !== 'all' ? `url(${item.icon})` : ''
                                    }"
                                ></span>
                                <img
                                    class="game_item_icon"
                                    @click="jumpToGame(item.game_code)"
                                    :src="item.icon"
                                    v-show="item.hot"
                                    alt=""
                                />
                            </div>

                            <span class="game_item_text">{{ item.title }}</span>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.pggame-page {
    padding-bottom: 20px;
    .game_banner {
        width: 100%;
    }
    .game_list {
        margin-top: 0.2rem;
        padding: 0 0.15rem;
        display: flex;
        align-items: center;
        /* justify-content: space-between; */
        flex-wrap: wrap;
    }
    .game_list .game_item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        margin-right: 0.11rem;
    }
    .game_list .game_item:nth-child(4n) {
        margin-right: 0;
    }
    .game_list .game_item_text {
        display: inline-block;
        color: #262933;
        font-size: 0.11rem;
        line-height: 0.22rem;
    }
    .game_list .game_item_icon_box {
        padding-top: 0.15rem;
    }

    .game_list .game_item_icon_big_box .game_item_icon {
        height: 0.85rem;
        margin-top: 0;
    }
    .game_list .game_item_icon {
        margin-top: 0.08rem;
        display: inline-block;
        width: 0.77rem;
        height: 0.79rem;
        transition: opacity 0.2s linear;
    }
    .game_list .game_item_icon:active {
        opacity: 0.6;
    }

    .all {
        background: url("@/assets/img/pggame/pg-game-icons.png") no-repeat 2.852% 11.751%;
    }
    .sprite {
        background-size: 3.75rem 5.13rem;
    }
    .sprite.bg {
        background-size: 100% 100%;
    }
}
</style>
