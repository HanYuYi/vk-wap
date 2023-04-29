import { TotalOrCountData } from "@/api/pojo/TotalOrCountData"

export class List {
    id: number

    title: string

    category: number

    tag: string

    type: number

    is_hot: number

    is_recommend: number

    match_name: string

    team_a_name: string

    team_b_name: string

    is_hide_read: number

    read_count: number

    create_time: string

    images: string[]

    iasdk2: string

    timestamp: string

    tag_color: string
}

export class InformationGetList extends TotalOrCountData<List> {}
