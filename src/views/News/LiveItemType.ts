import type { GameOptions } from "@/composable/util"

/**
 * Props
 */
export interface Props {
    item: {
        // 直播状态
        status: number

        // 直播类型
        game_type: number

        // 直播名称
        league_name: string

        // 直播时间
        show_time: string

        // 左侧战队logo
        home_team_pic: string

        // 左侧战队名称
        home_team_name: string

        // 投一注跳转参数
        bet_url_pc?: {
            jump_url: GameOptions["url"]
            is_need_login: GameOptions["isNeedLogin"]
            is_check_name: GameOptions["isCheckName"]
        }

        // 右侧战队logo
        away_team_pic: string

        // 右侧战队名称
        away_team_name: string
    }
}
