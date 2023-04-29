export class Data {
    answer: { key: number; value: string; example: string }[]

    no: number

    question: string

    type: number

    vCoin: number
}

export class ActiveGetSurveyGammaInit {
    data: Array<Data[]>

    is_finish_this_month: boolean

    is_first: boolean

    share_qr_code?: string

    share_url?: string

    v_coin?: number
}
