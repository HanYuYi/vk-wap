import { BaseActiveStruct } from "@/api/pojo/BaseStruct"

export class RankItem {
    username: string

    bonus: string

    invite_count: number

    register_date: string
}
export class ActiveGetCallFriendsInit extends BaseActiveStruct {
    inviter_rank: RankItem[]

    invitee_rank: RankItem[]

    active_three: {
        rebate_status: number

        rebate_today: number

        total_bet: number

        total_rebate: number

        has_mobile?: number
    }
}
