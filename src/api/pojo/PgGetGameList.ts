export class gameListItem {
    game_code: string

    hot: number

    icon: string

    title: string
}

export class PgGetGameList {
    game_list: gameListItem[]

    game_play: string
}
