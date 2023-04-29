/**
 * wallet store 实体
 */
import { RichPayGetRichPayInit } from "@/api/pojo/active/RichPayGetRichPayInit"
import type { DepositExchangeList } from "@/api/pojo/DepositExchangeList"

export default class WalletStoreState {
    // 钱包余额
    userMoney: Record<string, string> = {
        EG: " 0.00",
        RG: "0.00",
        TF: "0.00",
        IM: "0.00",
        SABACV: "0.00",
        FB: "0.00",
        BTI: "0.00",
        CROWN: "0.00",
        PINNACLE: "0.00",
        SABA: "0.00",
        IMSB: "0.00",
        AG: "0.00",
        PM: "0.00",
        ALLBET: "0.00",
        PT: "0.00",
        LY: "0.00",
        KY: "0.00",
        BL: "0.00",
        LC: "0.00",
        PG: "0.00",
        GM: "0.00",
        NM: "0.00",
        MG: "0.00",
        EBET: "0.00",
        LK: "0.00",
        FY: "0.00"
    }

    // 用户VB余额
    userVbMoney: number = 0

    // vb今天剩余的兑换次数
    vbExchageTimesToday: number = 0

    // V富通
    richpayInitData: RichPayGetRichPayInit = new RichPayGetRichPayInit()

    gameWalletList: DepositExchangeList[] = []
}
