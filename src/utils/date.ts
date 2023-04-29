import { pad } from "./commonUtils"
/**
 * 给日期拼接汉字单位
 * @param type
 * @param option
 */
interface DateConst {
    year: "年"
    month: "月"
    day: "日"
}
export const formatterYMD = (type: keyof DateConst, option: { text: string }): { text: string } => {
    const charObj: DateConst = { year: "年", month: "月", day: "日" }
    option.text += charObj[type]

    return option
}

interface TimeConst {
    hour: "时"
    minute: "分"
    second: "秒"
}
/**
 * 给时间拼接汉字单位
 * @param type
 * @param option
 */
export const formatterHMS = (type: keyof TimeConst, option: { text: string }): { text: string } => {
    const charObt: TimeConst = { hour: "时", minute: "分", second: "秒" }
    option.text += charObt[type]

    return option
}

/**
 * 倒计时时间格式化
 * @param obj
 * @param needHours
 * @param needDays
 */
interface FormatCountDownParams {
    days: string | number
    hours: string | number
    minutes: string | number
    seconds: string | number
}
export const formatCountDown = <T extends FormatCountDownParams>(
    obj: T,
    needHours: boolean = false,
    needDays: boolean = true
): string => {
    if ("days" in obj && needDays) {
        return obj.days + "天" + obj.hours + "小时"
    }

    if (needHours) {
        return pad(obj.hours) + ":" + pad(obj.minutes) + ":" + pad(obj.seconds)
    }

    const mAndS: string = pad(obj.minutes) + ":" + pad(obj.seconds)
    return obj.hours ? pad(obj.hours) + ":" + mAndS : mAndS
}
