export class ActiveGetNbaBetReturnInit {
    active_bet_limit: number = 5

    today_bonus: number = 0

    yesterday_bet: number = 0

    active_type: number = 0

    // 状态： 0  可领   1 已领取 2 昨日未达到领取条件  *** 其他状态
    status: number = 0

    status_tips: string = ""

    active_setting: {
        info: { bet_amount: number; bonus: number }[]
    } = {
        info: [
            {
                bet_amount: 3000,
                bonus: 8
            },
            {
                bet_amount: 8000,
                bonus: 18
            },
            {
                bet_amount: 15000,
                bonus: 38
            },
            {
                bet_amount: 30000,
                bonus: 58
            },
            {
                bet_amount: 60000,
                bonus: 88
            },
            {
                bet_amount: 100000,
                bonus: 188
            },
            {
                bet_amount: 300000,
                bonus: 388
            },
            {
                bet_amount: 500000,
                bonus: 588
            },
            {
                bet_amount: 1000000,
                bonus: 888
            }
        ]
    }
}
