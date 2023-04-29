import type { UserAddressGetAddress } from "@/api/pojo/UserAddressGetAddress"
import type { UserBankBankAndArea } from "@/api/pojo/UserBankBankAndArea"
import type { TotalOrCountData } from "@/api/pojo/TotalOrCountData"
import type { VMallDelivery } from "@/api/pojo/VMallDelivery"
import type { LoginList } from "@/api/pojo/UserGetMessageList"
import type { UserVirtualBankBank } from "@/api/pojo/UserVirtualBankBank"

export interface PaginationData {
    total?: any
    pageSize: number
    pageNum: number
}
// 省市item类型
export type AreaInfosItem = UserBankBankAndArea["areaInfos"][0]

export interface AreaInfo {
    text: AreaInfosItem["name"]
    value: AreaInfosItem["id"]
}

// 匹配 vant 省市组件类型
export interface AreaInfoByNesting extends AreaInfo {
    text: AreaInfosItem["name"]
    value: AreaInfosItem["id"]
    children: AreaInfo[]
}

export default class FreshState {
    // van-pull-refresh状态
    refreshLoading: boolean = false

    listLoading: boolean = false

    listError: boolean = false

    listFinished: boolean = false

    paginationData: PaginationData = {
        total: null,
        pageSize: 10,
        pageNum: 1
    }

    list?: TotalOrCountData<unknown>["list"] | VMallDelivery["list"]["data"] = []

    // 登录日志
    loginLogList?: LoginList = []

    // 用户的收货地址
    userAddress?: UserAddressGetAddress["list"] = null

    // 经过换算的省市区，用于适配vant级联选择器
    AreaInfo?: AreaInfoByNesting[] = []

    // 接口原始数据的省市区
    AreaOrigin?: UserBankBankAndArea["areaInfos"] = []

    bankInfo?: UserBankBankAndArea["bankInfo"] = []

    CryptoCurrencyInfo: UserVirtualBankBank["bankInfo"] = []
}
