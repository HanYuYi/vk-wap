import { TotalOrCountData } from "@/api/pojo/TotalOrCountData"

export class List {
    order_no: string

    time: string

    amount: string

    status_cn: string

    is_show_color: number

    operations: number
}

export class RichPayGetOrderList extends TotalOrCountData<List> {}
