import { TotalOrCountData } from "@/api/pojo/TotalOrCountData"

export class List {
    id: number

    category: number

    img: string

    label: number

    title: string

    content: string

    show_type: string

    sort: number

    status: number

    create_time: string

    desc: string

    time: number
}

export class IndexGetNotice extends TotalOrCountData<List> {}
