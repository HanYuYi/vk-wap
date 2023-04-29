export class GameListItem {
    game_code: string

    icon: string

    is_collect: number

    is_hot: number

    is_prize: number

    is_table: number

    title: string

    url: string
}

export class PtSlotGetGameList {
    bet_win_list: string[]

    game_list: GameListItem[]

    prize_pool?: number
}
