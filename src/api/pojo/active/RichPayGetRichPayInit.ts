import { BaseActiveStruct } from "../BaseStruct"

interface ProfitList {
    amount: string
    is_show_color: number
    show_username: string
    status_cn: string
    time: string
}

interface VipYearConf {
    level: number
    vip_apr: number
    vip_name: string
}

export class WalletInfo {
    // 优惠券
    coupon_type: number = 0

    // 优惠券的值
    coupon_value: number = 0

    // 未提利息
    interest_balance: number = 0.0

    // 抽奖机会
    lottery_chance: number = 0

    // 七日预期收益
    seven_day_ideal_income: number = 0.0

    // 总资产
    total_balance: number = 0.0

    // 已提利息
    total_income: number = 0.0

    // 当前用户年利率
    year_show: number = 0

    // 七日预期收益计算利率
    richpay_seven_day_rate: number = 0
}

/**
 * V富通
 */
export class RichPayGetRichPayInit extends BaseActiveStruct {
    // 是否开启V富通钱包
    is_use_richpay: number = 1

    // 今日剩余红利额度
    last_bonus: number = 0

    // 盈利榜list
    time_to_time_records: ProfitList[] = []

    // 虚拟币使用教程视频url
    video: string[] = []

    // 年利率列表
    vip_year_conf: VipYearConf[] = []

    // V富通钱包详细信息
    wallet_info: WalletInfo = new WalletInfo()

    // 是否被锁
    wallet_is_lock: number
}
