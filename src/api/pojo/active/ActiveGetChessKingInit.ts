import { BaseActiveStruct } from "@/api/pojo/BaseStruct"

export class WeekItem {
    rank: number

    head_image: string

    username: string

    level: number
}

export class ActiveGetChessKingInit extends BaseActiveStruct {
    status: number = 0

    status_tip: string = ""

    bouns: number = 0

    is_monday: boolean = false

    last_week: WeekItem[] = []

    current_week: WeekItem[] = []

    active_setting?: {
        list: { level_cn: string; bonus: number }[]

        bet_times: number
    } = { list: [], bet_times: 3 }
}
