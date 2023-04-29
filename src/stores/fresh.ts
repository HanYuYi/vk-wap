import { defineStore } from "pinia"
import type { ApiInterface } from "@/api/HttpPlus"
import ApiSetting from "@/api/service"
import { showToast } from "vant"
import FreshState from "@/stores/FreshState"
import type { AreaInfosItem, AreaInfoByNesting } from "@/stores/FreshState"
import type { PaginationData } from "@/stores/FreshState"
import type { SomePartial } from "@/types"
import { HttpPlus } from "@/api/HttpPlus"
import type { VMallDelivery } from "@/api/pojo/VMallDelivery"
import type { UserGetMessageList } from "@/api/pojo/UserGetMessageList"
import type { TotalOrCountData } from "@/api/pojo/TotalOrCountData"
import type { UserAddressGetAddress } from "@/api/pojo/UserAddressGetAddress"
import type { UserBankBankAndArea } from "@/api/pojo/UserBankBankAndArea"
import type { UserVirtualBankBank } from "@/api/pojo/UserVirtualBankBank"

type HttpType<T> = VMallDelivery | UserGetMessageList | TotalOrCountData<T>

type ParamsType<T> = {
    [K in keyof T]: T[K]
} & {
    page: PaginationData["pageNum"]
    limit?: PaginationData["pageSize"]
    page_size?: PaginationData["pageSize"]
}

export const useFreshStore = defineStore("fresh", {
    state: () => ({ ...new FreshState() }),

    getters: {
        listLen: (state): number => state.list.length
    },

    actions: {
        resetList(): void {
            this.paginationData.total = null
            this.paginationData.pageNum = 1
            this.list = []
            this.loginLogList = []
            this.listFinished = false
        },

        /**
         * 可下拉刷新的获取数据
         * 后端接口不规范，deliverInfo多返回了一个list,走listData方式特殊处理
         * @param payload {
         *     url: url对象
         *     params: 业务入参
         *     limit: 分页入参key的命名
         *     后端返回的list数据 data.list.data | data.list结构
         * }
         */
        async getList<T extends TotalOrCountData | VMallDelivery, P>(payload: {
            url: SomePartial<ApiInterface, "method" | "timeout">
            params?: P
            limit?: boolean
            isLoginLog?: boolean
        }): Promise<void> {
            // 数据已加载完成
            if (this.paginationData.total !== null && this.list.length >= this.paginationData.total) {
                this.listLoading = false
                this.listFinished = true
                return
            }

            try {
                // 动态配置入参
                const params: ParamsType<P> = {
                    ...(payload.params && { ...payload.params }),
                    page: this.paginationData.pageNum
                }
                params[payload.limit ? "limit" : "page_size"] = this.paginationData.pageSize

                // 发起请求
                HttpPlus.setUrlOptions(payload.url)
                const res = await HttpPlus.sendHttpRequest<HttpType<T>, ParamsType<P>>(params)

                this.listLoading = false

                if (this.refreshLoading) this.refreshLoading = false

                // 存数据到state
                if (res.status === 1 && res.data) {
                    // 针对 /Vmall/delivery 接口单独处理

                    this.list = [...this.list].concat((<VMallDelivery["list"]>res.data.list).data || res.data.list)

                    // 针对 /User/getMessageList/ 接口单独处理
                    if (payload.isLoginLog && (<UserGetMessageList>res.data).loginList) {
                        // 登录日志只查第一页
                        this.loginLogList = (res.data as UserGetMessageList).loginList
                        // this.loginLogList = [...this.loginLogList].concat(res.data.loginList)
                    }

                    this.paginationData.pageNum += 1

                    if ("total" in res.data.list) {
                        this.paginationData.total = res.data.list.total
                    } else {
                        if (payload.isLoginLog) {
                            this.paginationData.total = this.paginationData.pageSize
                            this.listLoading = false
                            this.listFinished = true
                        } else {
                            if ("total" in res.data) {
                                this.paginationData.total = res.data.total
                            }
                            if ("count" in res.data) {
                                this.paginationData.total = res.data.count
                            }
                        }
                    }
                } else {
                    this.listLoading = false
                    this.listFinished = true
                    return
                }
            } catch (error: unknown) {
                this.listError = true
                this.listLoading = false
                this.refreshLoading = false
                throw error
            }
        },

        /**
         * 查询是否存在收货地址
         */
        async checkAddress(): Promise<boolean> {
            HttpPlus.setUrlOptions(ApiSetting.user.checkAddress)
            const res = await HttpPlus.sendHttpRequest<UserAddressGetAddress>()
            if (res.status === 1 && res.data.list) {
                this.userAddress = res.data.list
                return true
            }
            return false
        },

        /**
         * 确认发快递
         * @param payload
         */
        async confirmExpress(payload: { address_id: number; package_id: number }): Promise<boolean> {
            HttpPlus.setUrlOptions(ApiSetting.user.confirmExpress)
            const res = await HttpPlus.sendHttpRequest(payload)
            if (res.status === 1) {
                showToast({
                    className: "vk-toast-success",
                    message: res.message,
                    icon: "checked"
                })
                return true
            }
            return false
        },

        /**
         * 银行卡和省市
         */
        async loadAreaBank(): Promise<void> {
            HttpPlus.setUrlOptions(ApiSetting.user.getBankUserList)
            const res = await HttpPlus.sendHttpRequest<UserBankBankAndArea>()
            if (res.status === 1) {
                res.data.bankInfo && res.data.bankInfo.length && (this.bankInfo = res.data.bankInfo)

                if (res.data.areaInfos) {
                    this.AreaOrigin = res.data.areaInfos

                    const arr: AreaInfoByNesting[] = []

                    res.data.areaInfos.forEach((item: AreaInfosItem) => {
                        if (item.parent_id === 0) {
                            arr.push({
                                text: item.name,
                                value: item.id,
                                children: []
                            })
                        } else {
                            arr.forEach((proVice: AreaInfoByNesting) => {
                                if (proVice.value === item.parent_id) {
                                    proVice.children.push({
                                        text: item.name,
                                        value: item.id
                                    })
                                }
                            })
                        }
                    })
                    this.AreaInfo = arr
                }
            }
        },

        /**
         * 支持的虚拟币币种
         */
        async loadCryptoCurrency(): Promise<void> {
            HttpPlus.setUrlOptions(ApiSetting.user.getVirtualBankType)
            const res = await HttpPlus.sendHttpRequest<UserVirtualBankBank>()

            if (res.status === 1 && res.data && res.data.bankInfo.length) {
                this.CryptoCurrencyInfo = res.data.bankInfo
            }
        }
    }
})
