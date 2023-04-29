import { TotalOrCountData } from "@/api/pojo/TotalOrCountData"

export class List {
    goods_id: string

    goods_name: string

    goods_pic: string

    show_time: string
}

export class VMallMyConvertList extends TotalOrCountData<List> {}
