/**
 * 时间轴计算
 * @param timestamp
 * @param formatYMD
 * @return {string}
 */
export function useTimeAgo(timestamp: number, formatYMD: string): string {
    if (typeof timestamp === "undefined") return ""

    const numTimestamp: number = +timestamp
    const remainTimestamp: number = Date.now() - numTimestamp
    const currentDate: Date = new Date()
    let backForMat: string = ""

    // 当天凌晨0点
    const today: number = new Date(
        `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} 00:00:00`
    ).getTime()

    const timeMap = new Map<() => boolean, () => string>()
    // 1年前
    timeMap.set(
        () => {
            return remainTimestamp > 1000 * 60 * 60 * 24 * 7 && new Date(numTimestamp).getFullYear() < currentDate.getFullYear()
        },
        () => formatYMD
    )
    // 1天内
    timeMap.set(
        () => {
            return remainTimestamp < 1000 * 60 * 60 * 24 && currentDate.getDate() === new Date(numTimestamp).getDate()
        },
        () => `${(remainTimestamp / (1000 * 60 * 60)) | 0}小时前`
    )
    // 1小时内
    timeMap.set(
        () => {
            return remainTimestamp < 1000 * 60 * 60
        },
        () => `${(remainTimestamp / (1000 * 60)) | 0}分钟前`
    )
    // 1分钟内
    timeMap.set(
        () => {
            return remainTimestamp < 1000 * 60
        },
        () => "刚刚"
    )
    // 昨天
    timeMap.set(
        () => {
            return numTimestamp > today - 1000 * 60 * 60 * 24 && numTimestamp < today
        },
        () => {
            const hours = new Date(numTimestamp).getHours()
            const minutes = new Date(numTimestamp).getMinutes()
            return `昨天${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`
        }
    )
    // 前天
    timeMap.set(
        () => {
            return numTimestamp > today - 1000 * 60 * 60 * 24 * 2 && numTimestamp < today - 1000 * 60 * 60 * 24
        },
        () => {
            const hours = new Date(numTimestamp).getHours()
            const minutes = new Date(numTimestamp).getMinutes()
            return `前天${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`
        }
    )
    // 7天内
    timeMap.set(
        () => {
            return numTimestamp > today - 1000 * 60 * 60 * 24 * 7 && numTimestamp < today - 1000 * 60 * 60 * 24 * 2
        },
        () => {
            return `${(remainTimestamp / (1000 * 60 * 60 * 24)) | 0}天前`
        }
    )
    // 超过7天
    timeMap.set(
        () => {
            return (
                remainTimestamp >= 1000 * 60 * 60 * 24 * 7 && new Date(numTimestamp).getFullYear() === currentDate.getFullYear()
            )
        },
        () => {
            const month = new Date(numTimestamp).getMonth() + 1
            const day = new Date(numTimestamp).getDate()
            return `${month < 10 ? `0${month}` : month}月${day < 10 ? `0${day}` : day}日`
        }
    )

    for (const [key, value] of timeMap) {
        key() && (backForMat = value())
    }

    return backForMat
}
