export class Detail {
    match_time: string

    title: string

    tag_color: string

    tag: string

    timestamp: string

    is_hide_read: number

    read_count: number

    content: string

    is_recommend: number

    team_a_logo: string

    match_name: string

    team_b_logo: string

    team_a_name: string

    team_a_odds: number

    team_b_odds: number

    team_b_name: string

    redirect_link: string
}

export class Recommend extends Detail {
    type: number

    id: number

    images: string[]
}

export class InformationGetDetail {
    detail?: Detail

    recommend: Recommend[]
}
