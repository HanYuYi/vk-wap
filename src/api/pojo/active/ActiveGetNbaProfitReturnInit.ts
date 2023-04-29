export class ActiveGetNbaProfitReturnInit {
    active_bet_limit: number = 8

    today_bonus: number = 0

    // 状态： 0  可领   1 已领取 2 昨日未达到领取条件  *** 其他状态
    status: number = 0

    status_tips: string = ""

    active_type: number = 2

    yesterday_profit: number = 0
}
