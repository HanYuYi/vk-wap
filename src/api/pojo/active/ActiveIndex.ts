export class Data {
    active_id: number

    desc: string

    img: string

    is_vip: number

    prize_type: string

    show_time: string

    status: string

    time_tag: number

    title: string

    type: number

    url: string

    user_status: number

    // 前端自定义
    _label_id: number

    // 前端自定义
    _status_arr: number[]

    // 前端自定义
    _type_arr: number[]

    // 前端自定义
    user_status_tips?: string
}

export class ActiveIndex {
    data: Array<Data>

    prize_list: Array<
        Pick<Data, "desc"> & {
            head_image: string
            prize: string
            username: string
        }
    >

    show_lists: Array<
        Pick<Data, "title"> & {
            // 前端自定义
            id?: number
            status?: number
            icon: string
            // 前端自定义
            activeIcon: string
        }
    >

    type_lists: Record<string, string>
}
