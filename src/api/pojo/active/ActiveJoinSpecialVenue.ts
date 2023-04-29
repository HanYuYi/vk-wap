import { BaseActiveStruct } from "@/api/pojo/BaseStruct"

export class ActiveJoinSpecialVenue extends BaseActiveStruct {
    status: number

    status_tips: string

    bonus_status: number

    bonus_status_tips: string

    // 用户已转账场馆 1:真人  2:棋牌  3:电子
    my_venue: number = 1

    // 已领取红包次数
    my_joins: number = 0

    // 已首充的金额
    my_deposit: number = 0

    // 已首充且已转账金额
    my_transfer: number = 0

    // 弹幕list
    bullet_screen: {
        username: string
        head_image: string
        goods_name: string
    }[] = []
}
