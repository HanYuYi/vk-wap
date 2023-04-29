import { BaseActiveStruct } from "@/api/pojo/BaseStruct"

export class ActiveGetChessCardsFirstRechargeInit extends BaseActiveStruct {
    // 状态： 0  可领   1 已领取   *** 其他状态
    status: number = 0

    status_tips: string = ""

    bonus: number = 0

    amount: number = 0

    sumAmount: number = 0

    active_setting?: {
        limit: number

        max_bonus: number

        min_deposit: number

        rate: string
    } = {
        limit: 15,
        max_bonus: 588,
        min_deposit: 100,
        rate: "38%"
    }

    walletList: { name: string; code: string }[]
}
