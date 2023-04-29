export class UserMessageDetail {
    app_content: string

    app_ext: {
        jump_wap: {
            text: string
            url: string
        }

        copy: string
    } | null

    title: string

    add_time: string
}
