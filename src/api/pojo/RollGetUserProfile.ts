export class RollGetUserProfile {
    applyed: number

    applyTags: Array<{
        id: number
        tag_name: string
    }>

    userTags: Array<{
        id: number
        tag_name: string
        background_app: string
        border_app: string
    }>

    extraInfo: {
        applyed_user: number

        win_total: number
    }

    canCreate: number
}
