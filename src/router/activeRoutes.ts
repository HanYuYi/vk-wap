import type { RouteRecordRaw } from "vue-router"

const activeRoutes: Array<RouteRecordRaw> = [
    {
        path: "/callfriends",
        name: "callfriends",
        component: () => import("@/views/Active/General/CallFriends/Index.vue")
    },
    {
        path: "/callFriendsRecords",
        name: "callFriendsRecords",
        component: () => import("@/views/Active/General/CallFriends/CallFriendsRecords.vue")
    },
    {
        path: "/VideoGameFirstRecharge",
        name: "VideoGameFirstRecharge",
        component: () => import("@/views/Active/General/Elec/VideoGameFirstRecharge.vue")
    }, // 2022 电玩首存
    {
        path: "/VideoGameSecondRecharge",
        name: "VideoGameSecondRecharge",
        component: () => import("@/views/Active/General/Elec/VideoGameSecondRecharge.vue")
    }, // 2022 电玩复存
    {
        path: "/RealPersonFirstRecharge",
        name: "RealPersonFirstRecharge",
        component: () => import("@/views/Active/General/RealPerson/RealPersonFirstRecharge.vue")
    }, // 2022 真人首存
    {
        path: "/RealPersonSecondRecharge",
        name: "RealPersonSecondRecharge",
        component: () => import("@/views/Active/General/RealPerson/RealPersonSecondRecharge.vue")
    }, // 2022 真人复存
    {
        path: "/RealPersonDailyReturn",
        name: "RealPersonDailyReturn",
        component: () => import("@/views/Active/General/RealPerson/RealPersonDailyReturn.vue")
    }, // 2022 真人每日返不停
    {
        path: "/ChessCardsFirstRecharge",
        name: "ChessCardsFirstRecharge",
        component: () => import("@/views/Active/General/Chess/ChessCardsFirstRecharge.vue")
    }, // 2022 棋牌首存
    {
        path: "/ChessCardsSecondRecharge",
        name: "ChessCardsSecondRecharge",
        component: () => import("@/views/Active/General/Chess/ChessCardsSecondRecharge.vue")
    }, // 2022 棋牌复存
    {
        path: "/FiveMajorLeagues2022",
        name: "FiveMajorLeagues2022",
        component: () => import("@/views/Active/General/Sports/FiveMajorLeagues2022.vue")
    }, // 五大联赛
    {
        path: "/UsdtDeposit",
        name: "UsdtDeposit",
        component: () => import("@/views/Active/General/UsdtDeposit.vue")
    }, // USDT存款三重好礼
    {
        path: "/quartermaster",
        name: "quartermaster",
        component: () => import("@/views/Active/General/QuarterMaster.vue")
    }, // 威客军需官
    {
        path: "/nba2022",
        name: "nba2022",
        component: () => import("@/views/Active/General/Sports/NBA2022.vue")
    }, // NBA常规赛
    {
        path: "/regress",
        name: "regress",
        component: () => import("@/views/Active/General/Regress/RegressIndex.vue")
    }, // 老会员回归
    {
        path: "/dcWallet",
        name: "dcWallet",
        component: () => import("@/views/Active/General/DCWallet/DCWalletIndex.vue")
    }, // DC钱包
    {
        path: "/goodluckupgrade",
        name: "goodLuckUpgrade",
        component: () => import("@/views/Active/General/UsdtDepositNew/Index.vue")
    }, // USDT存送再升级
    {
        path: "/sportWeekDeposit",
        name: "sportWeekDeposit",
        component: () => import("@/views/Active/General/Sports/SportsWeekDeposit.vue")
    }, // 体育周存款返利
    {
        path: "/sabaIndemnity",
        name: "sabaIndemnity",
        component: () => import("@/views/Active/General/Sports/SabaIndemnity.vue")
    }, // 体育首单包赔
    {
        path: "/alwaysWon",
        name: "alwaysWon",
        component: () => import("@/views/Active/General/Sports/AlwaysWon.vue")
    }, // 体育连赢
    {
        path: "/egameshoucun",
        name: "egameshoucun",
        component: () => import("@/views/Active/General/Egame/EgameFirstRecharge.vue")
    }, // 电竞首存
    {
        path: "/sportgas",
        name: "sportgas",
        component: () => import("@/views/Active/General/Sports/SportGas.vue")
    }, // 威客体育加油站
    {
        path: "/slotrescue",
        name: "slotrescue",
        component: () => import("@/views/Active/General/Elec/SlotRescue.vue")
    }, // 打虎英雄救援尽
    {
        path: "/indemnity",
        name: "indemnity",
        component: () => import("@/views/Active/General/Sports/SportIndemnity.vue")
    }, // 威客体育包赔单
    {
        path: "/chessking",
        name: "chessking",
        component: () => import("@/views/Active/General/Chess/Chessking.vue")
    }, // 雀王争霸
    {
        path: "/viptransfer",
        name: "viptransfer",
        component: () => import("@/views/Active/VIP/VipTransfer.vue")
    }, // VIP存款优惠
    {
        path: "/viptransferagain",
        name: "viptransferagain",
        component: () => import("@/views/Active/VIP/VipTransferAgain.vue")
    }, // VIP再存优惠
    {
        path: "/vipback",
        name: "vipback",
        component: () => import("@/views/Active/VIP/VipBack.vue")
    }, // VIP返水优惠
    {
        path: "/vipprivilege",
        name: "vipprivilege",
        component: () => import("@/views/Active/VIP/VipPrivil.vue")
    }, // VIP月体验金
    {
        path: "/vipachienement",
        name: "vipachienement",
        component: () => import("@/views/Active/VIP/VipAcheie.vue")
    }, // VIP月成就奖
    {
        path: "/vipmonthrescue",
        name: "vipmonthrescue",
        component: () => import("@/views/Active/VIP/VipMonthRescue.vue")
    }, // VIP月救援金
    {
        path: "/chessrescue",
        name: "chessrescue",
        component: () => import("@/views/Active/General/Chess/ChessRescue.vue")
    }, // 棋牌救援金
    {
        path: "/newwelfare",
        name: "newwelfare",
        component: () => import("@/views/Active/General/NewWelfare/Index.vue")
    }, // 新人专属福利
    {
        path: "/getvb",
        name: "getvb",
        component: () => import("@/views/Active/General/GetVb/Index.vue")
    }, // 洪荒之力
    {
        path: "/virtualCoiCourse",
        name: "virtualCoiCourse",
        component: () => import("@/views/CryptoCurrCourse/CryptoCurrCourseView.vue")
    }, // 虚拟币充值教程
    {
        path: "/dotaMojor",
        name: "dotaMojor",
        component: () => import("@/views/Active/General/Egame/DotaMojor.vue")
    }, // DOTA2 MAJOR
    {
        path: "/playground",
        name: "playground",
        component: () => import("@/views/Active/Special/PlayGround/PlayGround.vue")
    }, // 娱乐专场
    {
        path: "/msi2023",
        name: "msi2023",
        component: () => import("@/views/Active/Special/msi2023/index.vue")
    }
]

export default activeRoutes
