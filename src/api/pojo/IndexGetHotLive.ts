import type { BetUrl, IndexGetSchedule } from "@/api/pojo/IndexGetSchedule"
import type { GameList } from "@/api/pojo/IndexGetSchedule"

export class LiveItem {
    bet_url: BetUrl
    icon: IndexGetSchedule["data"][0]["icon"]
    icon_hover: IndexGetSchedule["data"][0]["icon_hover"]
    name: IndexGetSchedule["data"][0]["name"]
    live_list: Array<
        {
            bet_url_pc: Array<BetUrl>
            level: number
            start_time: number
        } & GameList
    >
}

export class IndexGetHotLive {
    default: { name: string; url: string }

    live: {
        basketball: LiveItem

        egame: LiveItem

        hot: LiveItem

        soccer: LiveItem
    }

    show_live: number
}
