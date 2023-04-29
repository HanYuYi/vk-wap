export class DepositApplyDeposit {
    type: string

    // 三方充值信息
    params: Record<string, any>

    deposit_type: number

    url: string

    account?: {
        acount_bank: string

        acount: string

        name: string

        acount_bank_info: string

        deposit_min: string

        desposit_type_tip: string

        show_over_time: string
    }

    money: number

    orderId: string

    account_diff?: number
}
