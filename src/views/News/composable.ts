import ApiSetting from "@/api/service"
import { showToast } from "vant"
import type { GameList } from "@/api/pojo/IndexGetSchedule"
import { HttpPlus } from "@/api/HttpPlus"

type ToWatchLive = Pick<GameList, "game_type" | "live_id" | "id"> & { next: boolean }

/**
 * 到直播页面看直播
 * @param item
 */
export async function toWatchLive<T extends ToWatchLive>(item: T): Promise<ToWatchLive | false> {
    const isIOS: boolean = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

    if (item.next) {
        const params = {
            game_type: item.game_type,
            live_id: item.live_id ? item.live_id : item.id,
            ios: isIOS ? 1 : 0 // 判断用户当前是不是iphone,如果是，只获取m3u8的视频资源
        }

        HttpPlus.setUrlOptions(ApiSetting.vkNews.openLive)
        const res = await HttpPlus.sendHttpRequest<GameList["live_line_list"], typeof params>(params)

        if (res.status === 1 && res.data.length) {
            return {
                ...item,
                live_line_list: res.data
            }
        }
    } else {
        showToast({
            className: "vk-toast-fail",
            message: "赛事暂未开始，敬请期待",
            icon: "warning"
        })
        return false
    }
}
