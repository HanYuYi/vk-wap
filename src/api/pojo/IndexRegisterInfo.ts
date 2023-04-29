export interface Focus {
    id: number

    title: string

    mob_focus_img: string

    wap_door_url: string

    is_share: number
}

export class IndexRegisterInfo {
    register_tips: string

    register_finish_tips: string

    focus: Focus[]

    verfiy: string

    cs_link: string
}
