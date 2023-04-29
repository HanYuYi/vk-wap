export class StatusType {
    status: number

    status_tips: string
}

export class ActiveSpecialWater {
    active_start_time: number = 0

    zr_water: number

    qp_water: number

    dz_water: number

    zr_status: StatusType

    is_login: boolean
}
