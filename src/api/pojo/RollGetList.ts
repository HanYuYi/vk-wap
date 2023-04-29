import { TotalOrCountData } from "@/api/pojo/TotalOrCountData"
import type { Info } from "@/api/pojo/RollView"

export class List {
    id: number

    user_id: number

    desc: string

    price: string

    count: number

    apply_total: number

    is_end: number

    create_time: string

    start_time: number

    end_time: number

    total_win: number

    is_del: number

    is_hide: number

    min_lever: number

    sort: number

    max_lever: number

    is_festival: number

    nickname: string

    username: string

    head_image: string

    user_lever: number

    color: string

    has_pass: boolean

    items: { icon_url: string; market_name: string }[]

    tags: Tags & Pick<List, "id" | "create_time" | "is_del" | "color">
}

type UserTags = Info["user_tags"][number]

export class Tags {
    tag_name: UserTags["tag_name"]

    img: string

    background: string

    border: string

    background_app: UserTags["background_app"]

    border_app: UserTags["border_app"]
}

export class RollGetList extends TotalOrCountData<List> {
    count: number = 0

    list: List[] = []
}
