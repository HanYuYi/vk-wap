import type { IndexGetHotLive } from "@/api/pojo/IndexGetHotLive"

export class BetUrl {
    is_check_name: number

    is_need_login: number

    jump_url: string

    title: string
}

export class GameList {
    id: number

    title: string

    game_type: number

    league_name: string

    home_team_name: string

    away_team_name: string

    home_team_pic: string

    away_team_pic: string

    home_team_point: string

    away_team_point: string

    live_id: number

    create_time: string

    bet_url: string

    is_check_name: number

    is_need_login: number

    live_line_list?: Array<IndexGetHotLive["default"]>

    show_time: string

    status: number
}

export class IndexGetSchedule extends Array {
    data: Array<{
        bet_url: BetUrl

        game_list: Array<GameList>

        icon: string

        icon_hover: string

        name: string

        tag: string
    }>
}
