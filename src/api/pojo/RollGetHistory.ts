export class ListItem {
    win_time: number

    room_id: number

    icon_url: string
}

export class RollGetHistory {
    count: number

    list: ListItem[] = []
}
