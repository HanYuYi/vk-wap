import type { UserVirtualBankBank } from "@/api/pojo/UserVirtualBankBank"

type UserVirtualBank = UserVirtualBankBank["bankInfo"][0]

export class UserBankBankAndArea {
    areaInfos: { id: number; parent_id: number; name: string }[]

    bankInfo: Array<{ exchange_rate: string } & Required<UserVirtualBank>>
}
