export class PublicType {
    id: number
    task_id: number
    user_id: number
    title: string
    prize_experience: number
    prize_nb: number
    icon: string
}

export class UserGetTaskList {
    allTask: {
        [propName: string]: Array<
            PublicType & {
                type: number
                do_times: number
                finish_percent: number
                status: number
                desc: string
                need_times: number
                jump_url: string
                finish_time?: number
            }
        >
    }

    finishTask: Array<
        PublicType & {
            survey_id: number
            finish_time: number
            status?: number
            jump_url?: string
        }
    >

    typeArr: string[]
}
