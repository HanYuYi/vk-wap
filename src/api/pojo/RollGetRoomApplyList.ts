import { TotalOrCountData } from "@/api/pojo/TotalOrCountData"

export class List {
    user_lever: number

    username: string

    nickname: string

    head_image: string

    color: string
}

export class RollGetRoomApplyList extends TotalOrCountData<List> {}
