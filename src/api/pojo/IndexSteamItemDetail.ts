export class IndexSteamItemDetail {
    icon_url: string

    name_color: string

    market_name: string

    game_icon: string

    game_name: string

    type: string

    desc:
        | {
              color: string

              type: string

              value: string
          }[]
        | string
}
