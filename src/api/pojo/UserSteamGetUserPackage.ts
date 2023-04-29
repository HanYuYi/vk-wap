import { TotalOrCountData } from "@/api/pojo/TotalOrCountData"

export class List {
    id: number

    user_id: number

    active_id: number

    record_id: number

    goods_id: number

    steam_item_id: number

    create_time: string

    game_id: number

    is_lock: number

    money: number

    can_change: number

    is_read: number

    icon_url: string

    market_name?: string

    name?: string

    name_color?: string

    type: number

    price: number

    is_money: number

    couponType: number

    img: string

    goods_name?: string

    goods_pic?: string

    is_cash?: number

    is_virtual?: number

    expire_days: number

    is_expire: number

    discount: number

    discount_money: number

    tmoney: number

    can_open?: boolean

    can_delivery: boolean

    fmoney?: number
}

export class UserSteamGetUserPackage extends TotalOrCountData<List> {}
