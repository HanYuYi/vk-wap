export class Data {
    id: number

    active_id: number

    package_id: number

    goods_id: number

    goods_name: string

    is_virtual: number

    user_id: number

    receive: string

    phone: string

    province_id: number

    province: string

    city_id: number

    city: string

    address: string

    is_lock: number

    secret: string

    express_name: string

    express_no: string

    status: number

    remark: string

    create_time: string

    is_read: number

    username: string

    name: string

    img: string

    icon_url: string

    create_date: string
}

export class List {
    data: Data[]

    total: number
}

export class VMallDelivery {
    list: List
}
