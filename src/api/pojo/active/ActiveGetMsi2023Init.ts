export class ActiveGetMsi2023Init {

  active_show_time:string

  is_login:number

  my_coupon:number

  extra_ticket:0

  egame_bet:0

  my_ticket:number

  open_tips:string

  // 中奖记录
  gift_records:{
    list:{
      create_time:string
      item_id:number
      item_name:string
    }[]
    total:number
  }

  ticket:{
    bet:number
    status:number
  }[]

  prize_goods:{
    goods_name:string
    goods_pic:string
    id:number
    is_choose:number
  }[]

  roll_tips:string[]

  // 开箱中奖弹幕
  bullet_screen: { head_image: string; goods_name: string; username: string }[]
}

export class ActiveMsi2023GiftData {
  id?:number
  type:number
  icon_url:string
  ticket?:number
  lotteryTicketIcon?:string
  price:string
  goods_name: string
}
export class ActiveMsi2023Competitions extends Array {
  data: {
    id:number
    game_name:string
    status:number
    start_time:number
    end_time:number
    deposit_start_time:number
    deposit_end_time:number
    l_team_name:string
    l_team_logo:string
    r_team_name:string
    length: number
    r_team_logo:string
    deposit_need_money:number
    deposit_status:number
    deposit_money:number
  }[]
}

export class ActiveMsi2023Record {
  list:{
    id:number
    game_name:string
    status:number
    start_time:number
    end_time:number
    deposit_start_time:number
    deposit_end_time:number
    l_team_name:string
    l_team_logo:string
    r_team_name:string
    length: number
    r_team_logo:string
    deposit_need_money:number
    deposit_status:number
    deposit_money:number
  }[]
  total:number
}
