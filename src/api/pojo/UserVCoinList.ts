import { TotalOrCountData } from "@/api/pojo/TotalOrCountData"

export class List {
    order_no: string

    time: number

    type: number

    amount: number

    balance: number

    description: string
}

export class UserVCoinList extends TotalOrCountData<List> {}
