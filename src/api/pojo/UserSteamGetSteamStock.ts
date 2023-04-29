import { TotalOrCountData } from "@/api/pojo/TotalOrCountData"

export class ListItem {
    id: number

    can_change: number

    can_open?: boolean

    is_money: number

    can_delivery: boolean

    game_id: number

    is_virtual: number

    icon_url: string

    name: string

    money: number

    discount: number

    discount_money: number

    tmoney: number
}
// TODO
// 后端说是实时拿的三方数据，无法提供数据类型，测试账号也没有相关数据
export class UserSteamGetSteamStock extends TotalOrCountData<ListItem> {}
