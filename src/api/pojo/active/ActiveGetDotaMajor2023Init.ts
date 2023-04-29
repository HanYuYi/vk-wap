export class ActiveGetDotaMajor2023Init {
    active_id: number

    is_login: number = 0

    show_time: string = ""

    // 活动一数据
    active_one: {
        // 赛事list
        list?: {
            id: number

            date_time: string

            game_type: string

            game_name: string

            guess_who_id: number

            team_id_1: number

            team_id_2: number

            // -1: 未开   0: 和局   -2: 输   >0: 赢队伍的id
            result: number

            l_team_logo: string

            r_team_logo: string

            l_team_name: string

            r_team_name: string

            start_time: number

            deposit_start_time: number

            deposit_end_time: number

            // 0：未开始   1：竞猜中   2：进行中   4：已结束
            game_status: number
        }[]

        // 竞猜次数
        quiz_times: number
    } = {
        list: [],

        quiz_times: 0
    }

    // 活动二数据
    active_two: {
        // 昨日累计有效投注金额
        yesterday_profit: number
        // 今日可领金额
        today_bonus: number
        // 今日已领金额
        a_today_bonus: number
        // 返利列表
        active_setting: { amount: number; bonus: number }[]
        // 所需流水倍数
        active_bet_limit: number
        // 电竞钱包
        wallet: { name: string; code: string }[]

        status: number

        status_tips: string
    } = {
        yesterday_profit: 0,

        today_bonus: 0,

        a_today_bonus: 0,

        active_setting: [],

        active_bet_limit: 0,

        wallet: [],

        // 0: 可领取  3: 已领取
        status: 1,

        status_tips: ""
    }
}
