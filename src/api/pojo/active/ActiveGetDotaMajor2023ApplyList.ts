import { TotalOrCountData } from "@/api/pojo/TotalOrCountData"

export class List {
    game_name: string

    team_name_1: string

    team_name_2: string

    is_win: number

    apply_time: string

    result: string
}
export class ActiveGetDotaMajor2023ApplyList extends TotalOrCountData<List> {}
