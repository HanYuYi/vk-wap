export class BackSettingItem {
    bti_back: string

    chess_back: string

    crown_back: string

    egame_back: string

    imgame_back: string

    level: string

    live_game_back: string

    other_egame_back: string

    pb_sport_back: string

    slots_back: string

    sport_back: string
}

export class BaseSettingItem {
    brithday_bonus: string

    cs_type: string

    is_fast_withdraw: number

    is_festival_gift: number

    is_vk_girl: number

    island_tour: string

    level: string

    upgrade_bonus: string

    vmall_day_times: number

    withdraw_limit: string
}

export class LevelSettingItem {
    level: string

    level_name: string

    level_type: string

    relegation_bet: number

    relegation_deposit: number

    upgrade_bet: number

    upgrade_deposit: number
}

export class MonthAchievementAwardItem {
    bonus: string

    total_profit: string
}

export class MonthRescueSettingItem {
    loss: string

    percent: string
}

export interface RewardListItem {
    [propName: string]: {
        id: number

        sort: number

        card_name: string

        card_en: string

        is_show: number

        status: number

        max_bonus: number

        bonus: number

        url_type: number

        url: string

        tips: string

        btn_tips: string

        level: number

        bonus_type?: string
    }
}

export class TransferSettingItem {
    deposit: number

    limit: number

    percent: number

    bonus: number
}

export class VipGetVipHallInit {
    back_setting: Array<BackSettingItem>

    base_setting: Array<BaseSettingItem>

    level_setting: Array<LevelSettingItem>

    month_achievement_award: Array<MonthAchievementAwardItem & Pick<LevelSettingItem, "level" | "level_name">>

    month_rescue_setting: Array<
        MonthRescueSettingItem & (Pick<MonthAchievementAwardItem, "bonus"> & Pick<LevelSettingItem, "level">)
    >

    privilege_setting: Array<Pick<MonthAchievementAwardItem, "bonus"> & Pick<LevelSettingItem, "level">>

    reward_list: Array<RewardListItem>

    transfer_setting: Array<TransferSettingItem & Pick<LevelSettingItem, "level">>

    head_image: string

    is_login: number

    keep_day: number

    level: number

    nickname: string

    percent_relegation: number

    percent_upgrade: number

    relegation_bet: number

    relegation_deposit: number

    relegation_requrie_bet: number

    relegation_requrie_deposit: number

    upgrade_bet: number

    upgrade_deposit: number

    upgrade_requrie_bet: number

    upgrade_requrie_deposit: number

    valid_day: number
}
