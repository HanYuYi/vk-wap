import type { IndexSteamItemDetail } from "@/api/pojo/IndexSteamItemDetail"

export class Info {
    id: number

    username: string

    total_win: number

    user_tags: {
        id: number

        background_app: string

        border_app: string

        tag_name: string
    }[]

    is_del: number

    is_hide: number

    end_time: number

    desc: string

    count: number

    price: string
}

export class RollView {
    info: Info

    is_end: number

    user_lever: number

    needJoin: string[]

    passAvalible: number

    is_owner: number

    has_applyed: number

    need_pass: number

    items?: Array<{
        game_id: number

        steam_item_id: number

        icon_url: string

        price: string

        market_name?: string

        itemDetailData?: IndexSteamItemDetail
    }>
}
