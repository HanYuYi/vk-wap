import { defineStore } from "pinia"
import { useWalletStore } from "./wallet"
import { useLoginStore } from "./loginRegister"
import ApiSetting from "@/api/service"
import { showToast } from "vant"
import SystemStoreState from "@/stores/SystemStoreState"
import type { UserGetTaskNum } from "@/stores/SystemStoreState"
import type ExtraGetCountryPrefix from "@/api/pojo/ExtraGetCountryPrefix"
import type { UserAlert } from "@/api/pojo/UserAlert"
import { HttpPlus } from "@/api/HttpPlus"
import type { IndexGetUserInfo } from "@/api/pojo/IndexGetUserInfo"
import type { IndexDoLogin } from "@/api/pojo/IndexDoLogin"
import type { IndexRegister } from "@/api/pojo/IndexRegister"
import type { extraGetSomeLink, ExtraGetCsLinks } from "@/api/pojo/ExtraGetSomeLink"

export const useSysStore = defineStore("system", {
    state: () => ({ ...new SystemStoreState() }),

    getters: {
        /**
         * 客服链接
         * @param state
         */
        currentKfUrl: (state): string => {
            // 1 普通 2 代理
            if (state.KFUrlStatus === 1) {
                if (state.KFUrlByList.length) {
                    return state.KFUrlByList[state.KFListIndex]?.link ? state.KFUrlByList[state.KFListIndex]?.link : state.KFUrl
                } else {
                    return state.KFUrl
                }
            } else {
                return state.KFProxyUrl
            }
        }
    },

    actions: {
        setRouteParams<T>(payload: T) {
            this.routeParams = payload
        },

        resetAllStore(): void {
            const wallet = useWalletStore()
            const loginReg = useLoginStore()
            this.$reset()
            wallet.$reset()
            loginReg.$reset()
        },

        /**
         * 写入用户信息
         * @param payload
         */
        updateUserInfo<
            T extends IndexDoLogin | IndexRegister | IndexGetUserInfo | Pick<IndexGetUserInfo, "wallet_onekey_status">
        >(payload: T): void {
            this.userInfo = { ...this.userInfo, ...payload }

            if ("is_password_weak" in payload && "is_unusal" in payload) {
                this.unusualWeakpass = Number(payload.is_password_weak)

                this.unusualLogin = Number(payload.is_unusal)
            } else {
                this.unusualWeakpass = 0

                this.unusualLogin = 0
            }
        },

        /**
         * 获取用户信息
         */
        async getUserInfo(): Promise<void> {
            try {
                HttpPlus.setUrlOptions(ApiSetting.index.getUserInfo)
                const response = await HttpPlus.sendHttpRequest<IndexGetUserInfo>()

                if (response.status === 1 && response.data.isLogin === 1) {
                    this.updateUserInfo<IndexGetUserInfo>(response.data)
                    this.isLogin = true
                } else {
                    this.isLogin = false
                    this.resetAllStore()
                    this.unusualWeakpass = 0
                    this.unusualLogin = 0
                }
            } catch (error) {
                this.isLogin = false
                this.resetAllStore()
                this.unusualWeakpass = 0
                this.unusualLogin = 0
            }
        },

        /**
         * 退出登录
         */
        async loginOut(): Promise<boolean> {
            HttpPlus.setUrlOptions(ApiSetting.index.loginOut)
            const res = await HttpPlus.sendHttpRequest()
            if (res.status === 1) {
                showToast({ className: "vk-toast-success", message: "退出成功", icon: "checked" })
                this.isLogin = false
                this.resetAllStore()
                return true
            }
            return false
        },

        /**
         * 获取各种弹窗数据
         * @param payload
         */
        async getDialogStatus(payload?: number): Promise<void> {
            HttpPlus.setUrlOptions(ApiSetting.index.getAlertInfo)
            const res = await HttpPlus.sendHttpRequest<UserAlert>()
            if (res.status === 1) {
                const { type } = res.data
                if (type) {
                    this.dialogData = res.data
                    // 弹生日红包
                    this.showBirthGift = type === 6

                    // 弹注册红包
                    if (type === 7) {
                        this.showRegisterGift = payload === 0
                    } else {
                        this.showRegisterGift = false
                    }

                    // 弹充值红包
                    this.showRechargeGift = type === 8

                    if (type === 9 || type === 10 || type === 11 || type === 12) {
                        this.levelInfo = { ...res.data, isShow: true }
                    } else {
                        this.levelInfo = { ...res.data, isShow: false }
                    }
                } else {
                    this.showBirthGift = false
                    this.showRegisterGift = false
                    this.showRechargeGift = false
                    this.levelInfo = { isShow: false }
                }
            }
        },

        setAppDownBar(payload: boolean): void {
            this.isShowAppDownBar = payload
        },
        setAppDownUrl(url: string): void {
            this.appdownUrl = url
            localStorage.setItem("appdownUrl", url)
        },

        async getKFUrl(): Promise<void> {
            HttpPlus.setUrlOptions(ApiSetting.index.getKfUrl)
            const res = await HttpPlus.sendHttpRequest<extraGetSomeLink>()

            if (res.status === 1 && res.data) {
                this.KFUrl = res.data.cs_link
                this.verCodeUrl = res.data.captcha_link
                this.setAppDownUrl(res.data.app_download_link)
                this.KFProxyUrl = res.data.proxy_cs_link
            }
        },

        /**
         * header右上角点击客服icon请求客服链接
         */
        async clickHeaderKF(): Promise<void> {
            this.PageLoading = true
            HttpPlus.setUrlOptions(ApiSetting.index.getCsLinks)
            const res = await HttpPlus.sendHttpRequest<ExtraGetCsLinks[]>()
            this.PageLoading = false
            if (res.status === 1 && res.data && res.data.length) {
                console.info("客服链接即时请求新接口：", res.data)
                this.KFUrlByList = res.data
                this.appRootBlur = true
                this.isShowKFSelect = true
            }
        },

        /**
         * 更新普通客服
         * @param payload
         * @constructor
         */
        UpdateKFDialogShow(payload: boolean): void {
            this.KFUrlStatus = 1
            this.KFListIndex = 0
            this.kfDialogShow = payload
        },

        /**
         * 更新代理客服
         * @param payload
         * @constructor
         */
        UpdateProxyKFDialogShow(payload: boolean): void {
            this.KFUrlStatus = 2
            this.kfDialogShow = payload
        },

        async getMsgCount(): Promise<void> {
            HttpPlus.setUrlOptions(ApiSetting.index.getUnReadMsgCount)
            const res = await HttpPlus.sendHttpRequest<{ count: string }>()
            if (res.status == 1 && res.data) {
                this.msgCount = Number(res.data.count)
            }
        },

        /**
         * 签到
         */
        async handleSign(): Promise<void> {
            if (this.userInfo.has_sign) {
                return
            }
            const wallet = useWalletStore()

            this.PageLoading = true
            HttpPlus.setUrlOptions(ApiSetting.user.signIn)
            const res = await HttpPlus.sendHttpRequest<{ day: number; vb: number }>()
            this.PageLoading = false
            if (res.status === 1 && res.data) {
                this.siginInPrize = res.data
                this.userInfo.has_sign = true
                this.userInfo.continue_sign = res.data.day
                wallet.getUserVbMoney()
                this.signDialogShow = true
            }
        },

        /**
         * 获取任务数量，仅登录后请求接口并显示
         */
        async loadTaskCount(): Promise<void> {
            HttpPlus.setUrlOptions(ApiSetting.user.getTaskCount)
            const res = await HttpPlus.sendHttpRequest<UserGetTaskNum>()

            if (res.status == 1 && res.data) {
                this.taskCount = res.data
            }
        },

        /**
         * 获取国家list数据
         */
        async getAreaCode(): Promise<void> {
            HttpPlus.setUrlOptions(ApiSetting.index.getCountryPrefix)
            const res = await HttpPlus.sendHttpRequest<Array<ExtraGetCountryPrefix>>()

            const { status, data } = res
            if (status === 1 && data.length) {
                data.forEach((v: any) => {
                    v.value = v.number
                    v.name = "+" + v.number + " " + v.cn
                })
                this.countryCodeList = data
                this.countryCode = data[0]
            }
        }
    }
})
