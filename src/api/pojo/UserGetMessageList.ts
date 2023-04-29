class List {
    add_time: number

    content: string

    from: string

    id: number

    is_read: number

    title: string

    user_id: number
}

export class SomeLoginList {
    area_info: string

    ip: number

    real_ip: number

    time: number
}

export type LoginList = Array<SomeLoginList & Pick<List, "id" | "user_id">>

export class UserGetMessageList {
    count: number

    list: List[]

    loginList: LoginList
}
