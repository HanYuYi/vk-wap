export class ListItem {
    type_id: number

    can_discount: number

    spec_goods: number

    spec_times: number

    goods_id: number

    show_last_text: string

    goods_pic: string

    need_level: number

    new_discount_percent: string

    goods_name: string

    convert_price: number

    old_price: number
}

export class VmallGetGoodsList {
    count: number

    list: ListItem[]
}
