import axios from "axios"
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import type { SomePartial } from "@/types"
import { useSysStore } from "@/stores/system"
import type SystemStoreState from "@/stores/SystemStoreState"
import { decrypt, encrypt, getmd5, objKeySort } from "@/api/paramsMiddleware"
import qs from "qs"
import { showToast } from "vant"
import router from "@/router"
import type { Store } from "pinia"
import type { AxiosSendMethod } from "@/types"

/**
 * http请求接口对象
 */
export interface ApiInterface {
    method: AxiosSendMethod
    url: string
    timeout: number
    repeat?: boolean
}

// 接口返回的基础业务数据类型
export interface BusinessResponse<T> {
    data?: T
    status: number
    message: string
    token?: string
    hide_error?: number
    error_code?: number
    jump_type?: number
    ip?: string
    cs_link?: string
    show_verify?: number

    // 游戏接口维护信息
    info?: string
}

/**
 * ts 重新封装http请求
 */
export class HttpPlus {
    // url接口对象
    private static urlOptions: SomePartial<ApiInterface, "url"> = {
        timeout: 5000,
        method: "post"
    }

    // 接口防抖对象
    private static repeatState: Record<string, boolean> = {}

    // axios实例
    private static axiosInstance: AxiosInstance = null

    // response拦截器错误提示
    private static responseTipsMaps: Map<number | string, string> = new Map()

    /**
     * urlOptions setter
     */
    public static setUrlOptions(urlRow: SomePartial<ApiInterface, "method" | "timeout">): void {
        HttpPlus.urlOptions = { ...HttpPlus.urlOptions, ...urlRow }
    }

    private constructor() {}

    public static init(): void {
        HttpPlus.baseConfiguration()
        HttpPlus.axiosInstance = axios.create()
        HttpPlus.responseTipsConfiguration()

        HttpPlus.requestInterceptors()
        HttpPlus.responseInterceptors()
    }

    /**
     * 装载基础配置
     */
    private static baseConfiguration(): void {
        axios.defaults.baseURL = "/api/"
        axios.defaults.headers.common["COMPANY"] = "vkgame"
        axios.defaults.headers.common["VKEGAME"] = "z9neaasi"
        axios.defaults.headers.get["Content-Type"] = "application/json; charset=UTF-8"
        axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8"
    }

    /**
     * 服务报错提配置
     */
    private static responseTipsConfiguration(): void {
        // 服务错误
        HttpPlus.responseTipsMaps.set(404, "服务器连接失败")
        HttpPlus.responseTipsMaps.set("ERR_NETWORK", "网络错误")
        HttpPlus.responseTipsMaps.set("ECONNABORTED", "请求超时")
    }

    /**
     * 发送请求
     * @param requestParams 业务请求参数
     * @private
     */
    public static sendHttpRequest<T, V = {}>(requestParams?: V): Promise<BusinessResponse<T>> {
        return new Promise((resolve, reject?: any) => {
            // 同一个接口不允许连续被请求，除非参数repeat设置为true
            if (HttpPlus.repeatState?.[HttpPlus.urlOptions.url] && !HttpPlus.urlOptions.repeat) {
                return
            }
            HttpPlus.repeatState[HttpPlus.urlOptions.url] = true

            const systemStore: Store<string, SystemStoreState, any, any> = useSysStore()

            const sendParams = HttpPlus.dynamicConfiguration<V>(requestParams)

            // 重置urlOptions基本参数
            delete this.urlOptions.repeat
            this.urlOptions.method = "post"

            HttpPlus.axiosInstance(sendParams)
                .then((response: AxiosResponse<string>) => {
                    HttpPlus.repeatState[sendParams.url] = false
                    resolve(HttpPlus.executionAfterSuccess<T>(response, systemStore))
                })

                .catch((err: Pick<AxiosResponse, "data" | "status">) => {
                    HttpPlus.repeatState[sendParams.url] = false
                    reject(HttpPlus.executionAfterError(err, systemStore))
                })
        })
    }

    /**
     * 装载动态业务入参
     * @param requestParams
     * @private
     */
    private static dynamicConfiguration<V>(requestParams?: V) {
        HttpPlus.axiosInstance.defaults.timeout = HttpPlus.urlOptions.timeout

        const baseParams: { data?: V } & Pick<ApiInterface, "url" | "method"> = {
            url: HttpPlus.urlOptions.url,
            method: HttpPlus.urlOptions.method
        }

        // post的业务入参
        if (requestParams && baseParams.method === "post") {
            baseParams.data = encrypt(
                JSON.stringify(
                    Object.assign(requestParams, {
                        auth_key: getmd5(decodeURIComponent(qs.stringify(objKeySort(requestParams)).toString()))
                    })
                )
            )
        }

        return baseParams
    }

    /**
     * Axios request 拦截器
     * @private
     */
    private static requestInterceptors(): void {
        HttpPlus.axiosInstance.interceptors.request.use(
            function (config: AxiosRequestConfig<string | undefined>): AxiosRequestConfig<string | undefined> {
                return config
            },
            function (error: any): Promise<any> {
                return Promise.reject(error)
            }
        )
    }

    /**
     * Axios response 拦截器
     * @private
     */
    private static responseInterceptors(): void {
        HttpPlus.axiosInstance.interceptors.response.use(
            function (response: AxiosResponse<string, string | undefined>) {
                return response
            },
            function (error: any): Promise<any> {
                const { code, status }: { code: string; status: number } = error.toJSON()

                for (const [key, value] of HttpPlus.responseTipsMaps) {
                    if (status === key || code === key) {
                        showToast({ className: "vk-toast-fail", message: value, icon: "warning" })
                    }
                }

                return Promise.reject(error)
            }
        )
    }

    /**
     * 请求成功后执行
     * @param response
     * @param store
     * @private
     */
    private static executionAfterSuccess<T>(
        response: AxiosResponse<string>,
        store: Store<string, SystemStoreState, any, any>
    ): BusinessResponse<T> {
        // 这里的status是http的状态码，不是接口返回的字段
        if (response?.status === 200 || response?.status === 304 || response?.status === 400) {
            const businessRes: BusinessResponse<T> = JSON.parse(decrypt(response.data))

            // 接口报错，非http报错
            if (businessRes?.status !== 1 && !businessRes.hide_error && businessRes.message) {
                store.PageLoading = false
                showToast({ className: "vk-toast-fail", message: businessRes.message, icon: "warning" })
            }

            if (businessRes?.error_code === 103) {
                store.isLogin = false
                store.resetAllStore()
                if (businessRes.jump_type === 4) {
                    store.signDialogShow = false
                    store.showDraw = false
                    router.push({ path: "/login" })
                }
            }

            // ip限制
            if (businessRes?.error_code === 106) {
                store.KFUrl = businessRes?.cs_link
                store.IPForbid = businessRes?.ip
                router.push({ path: "/ipban" })
            }

            return businessRes
        }
    }

    /**
     * 请求失败后执行
     * @param response
     * @param store
     * @private
     */
    private static executionAfterError(
        response: Pick<AxiosResponse, "data" | "status">,
        store: Store<string, SystemStoreState, any, any>
    ) {
        store.PageLoading = false
        return response
    }
}

HttpPlus.init()
