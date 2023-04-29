export class IndexGetHotGame extends Array {
    data: Array<{
        game_list: Array<{
            team_logo_1: string

            team_1_point: string

            team_name_1: string

            team_logo_2: string

            team_2_point: string

            team_name_2: string

            event_name: string

            game_start_time: number

            bet_url: string
        }>

        is_select: number

        go_bet_url: string

        name: string

        tag: string
    }>
}
