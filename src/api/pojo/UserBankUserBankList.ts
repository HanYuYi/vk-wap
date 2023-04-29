export class AccountItem {
    id: number

    bank_color: string[]

    bank_name: string

    logo: string

    is_default: number

    account_name: string

    province: string

    city: string
}

export class BaseUserBankList<T = {}> {
    count: number

    bank_lock: number

    bankLimit: number

    banks?: Array<AccountItem & T>

    logo_back: string

    svg: string

    bank_url: string
}

export class UserBankUserBankList extends BaseUserBankList<{ show_account: string; svg: string }> {}
