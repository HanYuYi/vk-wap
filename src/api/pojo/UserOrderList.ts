import { TotalOrCountData } from "@/api/pojo/TotalOrCountData"

export class List {
    id: number

    user_id: number

    order_type_id: number

    title: string

    amount: string

    description: string

    balance: string

    ip: number

    time: number

    status: number

    key: string

    order_no: string

    operations: number
}

export class UserOrderList extends TotalOrCountData<List> {}
