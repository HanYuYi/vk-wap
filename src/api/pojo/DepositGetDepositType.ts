export class ExtInfoItem {
    name: string

    field?: string

    desc: string
}

export class BanksItems {
    // 前端自定义字段
    id?: number

    // 前端自定义字段
    name?: string

    is_show_account_name: number

    bank_id: number

    deposit_min: string

    deposit_max: string

    banks: { icon_png?: string; name: string; value: string }[]
}

export class DepositGetDepositType extends Array {
    data: Array<{
        logo: string

        is_hot: number

        type_name: string

        recommend_tips: string

        is_risk: boolean

        risk_tips: string

        ext_info: ExtInfoItem[]

        banks: BanksItems[]
    }>
}
