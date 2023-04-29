<script setup lang="ts">
import IconHome from "@/assets/img/template/july/home/draw/icon-home.png"
import IconWallet from "@/assets/img/template/july/home/draw/icon-wallet.png"
import IconGift from "@/assets/img/template/july/home/draw/icon-gift.png"
import IconVb from "@/assets/img/template/july/home/draw/icon-vb.png"
import IconVip from "@/assets/img/template/july/home/draw/icon-vip.png"
import IconUser from "@/assets/img/template/july/home/draw/icon-user.png"
import IconApp from "@/assets/img/template/july/home/draw/icon-download.png"
import IconJoin from "@/assets/img/template/july/home/draw/icon-join.png"
import IconProxy from "@/assets/img/template/july/home/draw/icon-proxy.png"

import { useSysStore } from "@/stores/system"
import { useWalletStore } from "@/stores/wallet"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { computed, watch } from "vue"
import { usePlaceImg } from "@/utils/globalImgs"
import Badge from "@/components/Badge.vue"

const { GrayAvatar } = usePlaceImg()
const systemParams = useSysStore()
const walletStore = useWalletStore()
const router: Router = useRouter()

watch(
    () => systemParams.showDraw,
    (val?: boolean) => {
        if (val) {
            if (systemParams.isLogin) {
                walletStore.loadMoney("NM")
                systemParams.getMsgCount()
            }
        }
    }
)
interface Menus {
    url: string
    title: string
    classname: string
    tag: string
    icon: string
}

const menus: Menus[] = [
    {
        url: "/",
        title: "首页",
        classname: "home",
        tag: "route",
        icon: IconHome
    },
    {
        url: "/finance",
        title: "账户管理",
        classname: "wallet",
        tag: "route",
        icon: IconWallet
    },
    {
        url: "/discovery",
        title: "优惠活动",
        classname: "gift",
        tag: "route",
        icon: IconGift
    },
    {
        url: "/vbmarket",
        title: "V币商城",
        classname: "vb",
        tag: "route",
        icon: IconVb
    },
    {
        url: "/vipsystem",
        title: "VIP重磅升级",
        classname: "vip",
        tag: "route",
        icon: IconVip
    },
    {
        url: "/user",
        title: "个人中心",
        classname: "user",
        tag: "route",
        icon: IconUser
    },
    {
        url: "",
        title: "APP下载",
        classname: "app",
        tag: "href",
        icon: IconApp
    },
    {
        url: "/jointly",
        title: "合作加盟",
        classname: "join",
        tag: "route",
        icon: IconJoin
    },
    {
        url: "",
        title: "我的代理",
        classname: "proxy",
        tag: "href",
        icon: IconProxy
    }
]

const filterMenu = computed<Menus[]>(() => {
    if (
        systemParams.isLogin &&
        "user_type" in systemParams.userInfo &&
        systemParams.userInfo.user_type === 2 &&
        "proxy_href" in systemParams.userInfo &&
        systemParams.userInfo.proxy_href
    ) {
        return menus.filter((item: Menus) => item.classname !== "join")
    } else {
        return menus.filter((item: Menus) => item.classname !== "proxy")
    }
})

const proxyUrl = computed<string | null>(() =>
    "proxy_href" in systemParams.userInfo && systemParams.userInfo.proxy_href
        ? systemParams.userInfo.proxy_href + "&gfrom=wap"
        : null
)

const jump = (path: string, tag: string = "route", key: string = ""): void => {
    systemParams.showDraw = false
    if (tag === "route") {
        router.push(path)
    }
    if (tag === "href") {
        if (key === "app") {
            window.open(systemParams.appdownUrl)
        }
        if (key === "proxy" && proxyUrl.value) {
            location.href = proxyUrl.value
        }
    }
}

const handleBackToWeb = (): void => {
    if (window.domainName && window.domainName._WAP_TO_PC) {
        systemParams.showDraw = false
        window.location.href = window.domainName._WAP_TO_PC + "?backweb"
    }
}
</script>

<template>
    <div class="drawermenu">
        <!--未登录时-->
        <div class="drawer_top hstack" @click="jump('/login')" v-if="!systemParams.isLogin">
            <img class="avatar" :src="GrayAvatar" alt="" />
            <div class="dt-right">
                <div class="text">登录/注册</div>
                <div class="desc">登录威客，精彩等着您！</div>
            </div>
        </div>
        <div class="login_top" v-else>
            <div class="drawer_top hstack">
                <AvatarCircle class="avatar" />
                <div class="dt-right">
                    <div class="hstack">
                        <div class="text van-ellipsis">
                            {{ systemParams.userInfo.nickname }}
                        </div>
                        <div class="vip w-42.5px h-18px ml-9px" :class="`vip${systemParams.userInfo.user_lever}`"></div>
                    </div>
                    <SignButton />
                </div>
            </div>
            <div class="money-box flex draw-shadow items-center">
                <div class="flex flex-col flex-1">
                    <div class="flex-center">
                        <div class="wallet-icon money-icon"></div>
                        <MoneySplit :amount="walletStore.userMoney.NM" />
                    </div>
                    <div class="text">主钱包余额</div>
                </div>
                <div class="line"></div>
                <div class="flex flex-col flex-1">
                    <div class="flex-center">
                        <div class="wallet-icon vb-icon"></div>
                        <MoneySplit :amount="walletStore.userVbMoney" :diglen="0" />
                    </div>
                    <div class="text">V币余额</div>
                </div>
            </div>
        </div>
        <!--左侧导航-->
        <div class="aside_nav_list" :class="{ 'aside-navlist_login': systemParams.isLogin }">
            <div class="aside_nav_box">
                <div
                    v-for="(item, index) in filterMenu"
                    :key="index"
                    :class="`nav_${item.classname}`"
                    class="list_box"
                    @click="jump(item.url, item.tag, item.classname)"
                >
                    <div class="box_icon" :style="{ backgroundImage: `url(${item.icon})` }">
                        <DownArrow class="svg-down" v-if="item.classname === 'app'" />
                    </div>
                    <div class="box_title">{{ item.title }}</div>
                    <Badge :num="systemParams.msgCount" v-if="systemParams.isLogin && item.classname === 'user'" />
                </div>
            </div>
        </div>

        <div class="drawer_bottom draw-shadow van-haptics-feedback" @click="handleBackToWeb">返回电脑版</div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/style/vip.scss";
@keyframes down {
    0% {
        opacity: 0;
        transform: translateY(0);
    }

    100% {
        opacity: 1;
        transform: translateY(7px);
    }
}

.svg-down {
    width: 30px;
    height: 26px;
    animation: down 1.2s ease infinite;
}
.drawermenu {
    background: url("@/assets/img/template/july/home/draw/bg.png") no-repeat center top;
    background-size: contain;
    padding-top: 12px;
    .vk-sign-btn {
        margin-top: 6px;
        width: fit-content;
        height: 28px;
        display: flex;
        align-items: center;
        padding: 0 10px 0 6px;
    }
    .drawer_top {
        margin-top: 10px;
        color: var(--vk-primary-text-color);
        .text {
            font-size: 14px;
            font-weight: 600;
            line-height: 1.29;
            max-width: 86px;
            font-family: Roboto;
        }

        .desc {
            color: var(--vk-desc-text-color);
            margin-top: 5px;
            font-size: 12px;
            line-height: 1.5;
        }
    }
    .avatar {
        width: 54px;
        height: 54px;
        margin-left: 12px;
    }
    .dt-right {
        margin-left: 12px;
    }
    .wallet-icon {
        width: 15px;
        height: 15px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: 4px;
    }

    .money-icon {
        background-image: url("@/assets/img/template/july/home/draw/money-icon.png");
    }

    .vb-icon {
        background-image: url("@/assets/img/template/july/home/draw/vb-icon.png");
    }
    .money-box {
        width: 210px;
        height: 64px;
        border-radius: 8px;
        margin: 20px auto 0;
        text-align: center;

        .line {
            height: 44px;
            width: 1px;
            background-image: linear-gradient(to bottom, rgba(198, 206, 205, 0.5) 0%, #c6cecd 51%, rgba(198, 206, 205, 0.5) 100%);
        }

        .MoneySplit {
            font-size: 14px;
            font-weight: bold;
            line-height: 1.71;
            color: var(--vk-primary-text-color);
        }

        .text {
            color: var(--vk-second-text-color);
            font-size: 12px;
            line-height: 1.27;
        }
    }

    .aside_nav_list {
        overflow-y: scroll;
        height: calc(100vh - 170px);
        height: calc(var(--vh) * 100 - 170px);
        margin-top: 17.5px;

        &.aside-navlist_login {
            margin-top: 10px;
            height: calc(100vh - 236px);
            height: calc(var(--vh) * 100 - 236px);
        }

        .aside_nav_box {
            height: auto;
        }

        .list_box {
            width: 100%;
            padding: 11px 0 11px 16px;
            position: relative;
            display: flex;
            align-items: center;
            box-sizing: border-box;

            &:last-child {
                margin-bottom: 12px;
            }

            .box_title {
                font-weight: 600;
                line-height: 2.31;
                font-size: 13px;
                word-break: break-all;
                white-space: nowrap;
                color: var(--vk-primary-text-color);
            }

            .box_icon {
                width: 30px;
                height: 30px;
                margin-right: 12.5px;
                background-size: 100% 100%;
                background-position: center center;
                background-repeat: no-repeat;
                position: relative;
            }
        }
    }

    .drawer_bottom {
        position: absolute;
        border: solid 1px #ecf2f1;
        height: 42px;
        line-height: 40px;
        width: 206px;
        bottom: 34px;
        text-align: center;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        color: #8a8f8d;
    }

    .draw-shadow {
        background-image: linear-gradient(to bottom, #fff 0%, rgba(255, 255, 255, 0.5) 100%);
        box-shadow: 0 2px 6px 0 rgba(52, 166, 202, 0.05), 0 1px 0 0 #e6eff3;
    }
}
</style>
