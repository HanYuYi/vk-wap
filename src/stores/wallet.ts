import { defineStore } from "pinia"
import ApiSetting from "@/api/service"
import WalletStoreState from "@/stores/WalletStoreState"
import type { RichPayGetRichPayInit } from "@/api/pojo/active/RichPayGetRichPayInit"
import { HttpPlus } from "@/api/HttpPlus"
import type { BusinessResponse } from "@/api/HttpPlus"
import type { DepositExchangeList } from "@/api/pojo/DepositExchangeList"
import type { DepositGetMoney } from "@/api/pojo/DepositGetMoney"

export const useWalletStore = defineStore("wallet", {
    state: () => ({ ...new WalletStoreState() }),

    getters: {
        mainWallet: (state) => {
            return state.gameWalletList[0]
        },
        gameWalletExceptMain: (state) => {
            return state.gameWalletList.filter((item: DepositExchangeList) => item.code !== "NM")
        }
    },

    actions: {
        loadMoney(payload: string): void {
            this.getUserMoney(payload)
            this.getUserVbMoney()
        },

        /**
         * 获取钱包余额
         * @param payload
         */
        async getUserMoney(payload: string): Promise<BusinessResponse<DepositGetMoney>> {
            const params = { game_code: payload }
            HttpPlus.setUrlOptions(ApiSetting.index.getMoney)
            const res = await HttpPlus.sendHttpRequest<DepositGetMoney, typeof params>(params)
            if (res.status === 1 && res.data) {
                this.userMoney[res.data.game_code] = res.data.amount
            }
            return res
        },

        /**
         * 获取vb余额
         */
        async getUserVbMoney(): Promise<void> {
            type DepositGetVirtualMoney = {
                amount: number
                vmall_day_times: number
            }

            HttpPlus.setUrlOptions(ApiSetting.index.getVirtualMoney)
            const res = await HttpPlus.sendHttpRequest<DepositGetVirtualMoney>()
            if (res.status === 1 && res.data) {
                this.userVbMoney = res.data.amount
                this.vbExchageTimesToday = res.data.vmall_day_times
            }
        },

        /**
         * 初始化V富通钱包数据
         */
        async getRichpayData(): Promise<void> {
            HttpPlus.setUrlOptions(ApiSetting.active.richPayInit)
            const res = await HttpPlus.sendHttpRequest<RichPayGetRichPayInit>()
            if (res.status === 1 && res.data) {
                this.richpayInitData = res.data
            }
        },

        /**
         * 获取所有钱包
         */
        async getWalletAll(): Promise<void> {
            HttpPlus.setUrlOptions(ApiSetting.user.getGameWalletList)
            const res = await HttpPlus.sendHttpRequest<DepositExchangeList[]>()
            if (res.status === 1) {
                this.gameWalletList = res.data
                // 获取钱包金额
                this.gameWalletList.forEach((item: DepositExchangeList) => {
                    this.loadGameWalletMoney(item)
                })
            }
        },

        /**
         * 处理每个钱包余额
         * @param item
         */
        async loadGameWalletMoney(item: DepositExchangeList): Promise<void> {
            const res: BusinessResponse<DepositGetMoney> = await this.getUserMoney(item.code)
            if (res.status === 1) {
                item.money = res.data.amount ? res.data.amount : "0.00"
            } else {
                item.getMoneyFail = true
                item.errMsg = res.message
                item.errorcode = res.error_code
            }
        }
    }
})
