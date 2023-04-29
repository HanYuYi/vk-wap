export class UserOrderDetail {
    amount: number | string

    title: string

    order_type_id: number

    // 元组
    process?: [[string, string], [string], [string, string]?]

    status?: number

    time: string

    order_no: string
}
