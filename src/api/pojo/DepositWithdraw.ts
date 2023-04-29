import type { UserBankUserBankList } from "@/api/pojo/UserBankUserBankList"
import type { UserVirtualBankUserBankList } from "@/api/pojo/UserVirtualBankUserBankList"
import type { WalletInfo } from "@/api/pojo/active/RichPayGetRichPayInit"
import type { RichPayGetRichPayInit } from "@/api/pojo/active/RichPayGetRichPayInit"

export class DepositWithdraw {
    withdraw_max: number

    withdraw_min: string

    mid_money: string

    mid_fee: string

    withdraw_virtual_min_num: number

    withdraw_virtual_min: number

    richpay_conf: Pick<RichPayGetRichPayInit, "wallet_is_lock"> & {
        input_tips: string
        withdraw_show_max: number
        withdraw_show_mid: number
        withdraw_show_min: number
        coupon_value: number
    }

    richpay_year_show: number

    richpay_seven_day_rate: number

    withdraw_show_min: string

    withdraw_show_mid: number

    withdraw_show_max: number

    limitAmount: string

    virtualCount: number

    virtualBankLimit: number

    todayLeftWithdraw: string

    needMsgCode: boolean

    has_securitypwd: boolean

    msg: string

    maxWithdraw: number

    wallet_type: { bank_id: number; is_hot: number; name: string }[]

    count: number

    bankLimit: number

    userMoney: string

    banks: UserBankUserBankList["banks"]

    virtualBanks: Array<
        UserVirtualBankUserBankList["banks"][number] & {
            id: number
            exchange_rate: string
            withdraw_virtual_min_num: number
            withdraw_virtual_show_min: number
            withdraw_virtual_show_mid: number
            withdraw_virtual_show_max: number
            // 前端自定义
            showbankUrl: string
        }
    >
}
