export class GameItem {
    game_list: Array<{
        bg_color: string
        code: string
        img: string
        is_host: number
        is_need_login: number
        is_new: number
        is_redirect: number
        title: string
        title_sub: string
        url: string
        is_hot?: number
    }>
    game_title: string
}

export class IndexIndexV2 {
    banner?: Array<{
        img: string
        title: string
        wap_url: string
    }>

    notice?: Array<{
        show_cn: string
        title: string
        create_time: string
        content_cn: string
    }>

    is_new_msg: number

    chess: GameItem

    egame: GameItem

    live: GameItem

    slot: GameItem

    sports: GameItem
}
