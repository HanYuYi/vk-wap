import type { UserSteamPackageToSteam } from "@/api/pojo/UserSteamPackageToSteam"

export class UserSteamSteamToPackage extends Array {
    data: Array<Pick<UserSteamPackageToSteam["data"][number], "tradeofferid" | "url">>
}
