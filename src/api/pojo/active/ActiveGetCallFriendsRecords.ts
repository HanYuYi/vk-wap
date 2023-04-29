import { TotalOrCountData } from "@/api/pojo/TotalOrCountData"

export class List {
    invitee_name: string

    total_bet_amount: string

    active_three_rebate: string

    total_amount: string

    create_time: string
}

export class ActiveGetCallFriendsRecords extends TotalOrCountData<List> {}
