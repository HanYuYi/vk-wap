import { defineStore } from "pinia"
import ApiSetting from "@/api/service"
import { HttpPlus } from "@/api/HttpPlus"
import type { UserGetTaskList } from "@/api/pojo/UserGetTaskList"

interface NewlyAddedType {
    btnloading?: boolean
    prizeDesc?: string
}

type TaskLogList = Array<UserGetTaskList["allTask"][0][0] & NewlyAddedType>

export type TaskListArrList = Array<UserGetTaskList["finishTask"][0] & NewlyAddedType>

export type TaskListArr = Array<{ title: string; list: TaskListArrList }>

class TaskStoreState {
    // 任务中心任务日志
    taskLogList: TaskLogList = []

    // 任务中心任务
    taskListArr: TaskListArr = [
        {
            title: "新手任务",
            list: []
        },
        {
            title: "每日任务",
            list: []
        },
        {
            title: "活动任务",
            list: []
        }
    ]
}

export const useTask = defineStore("task", {
    state: () => ({ ...new TaskStoreState() }),

    actions: {
        async task(): Promise<void> {
            this.taskLogList = []

            HttpPlus.setUrlOptions(ApiSetting.user.getTaskList)
            const res = await HttpPlus.sendHttpRequest<UserGetTaskList>()

            if (res.status === 1) {
                // 当前任务
                if (res.data.typeArr.length > 0) {
                    for (let i = 0; i < res.data.typeArr.length; i++) {
                        const typeKey: string = res.data.typeArr[i]
                        const typeIndex: number = Number.parseInt(typeKey) - 1
                        this.taskListArr[typeIndex].list = taskListFormat(res.data.allTask[typeKey])
                    }
                }

                // 领取日志
                if (res.data.finishTask.length > 0) {
                    this.taskLogList = taskListFormat(res.data.finishTask)
                }
            }
        }
    }
})

function taskListFormat(list: TaskLogList): TaskListArrList

function taskListFormat(list: TaskListArrList): TaskLogList

/**
 * 处理处理的工具方法
 * @param list
 */
function taskListFormat(list: any): TaskLogList | TaskListArrList {
    list.forEach((item: any) => {
        if (!("btnloading" in item)) {
            item.btnloading = false
        }

        const prizeDescMap = new Map<() => boolean, string>()
        prizeDescMap.set(
            () => item.prize_experience !== 0 && item.prize_nb !== 0,
            `<span>+${item.prize_experience}</span>经验&nbsp;&nbsp;<span>+${item.prize_nb}</span>V币`
        )
        prizeDescMap.set(() => item.prize_experience !== 0, `<span>+${item.prize_experience}</span>经验`)

        prizeDescMap.set(() => item.prize_nb !== 0, `<span>+${item.prize_nb}</span>V币`)

        for (const [key, value] of prizeDescMap) {
            key() && (item.prizeDesc = value)
        }
    })

    return list
}
