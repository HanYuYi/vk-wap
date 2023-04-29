import activeRoutes from "./activeRoutes"
import type { RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        component: () => import("@/views/HomeView.vue"),
        meta: {
            needHeaderKFBtn: true
        }
    },
    ...activeRoutes,
    {
        path: "/user",
        name: "userhome",
        component: () => import("@/views/MyView.vue"),
        meta: {
            showDrawIcon: true,
            needHeaderKFBtn: true,
            isBgWhiteTransparent: true
        }
    },
    {
        path: "/finance",
        meta: { needAuth: true, needHeaderKFBtn: true, headLogIcon: true },
        name: "finance",
        component: () => import("@/views/Finance/FinanceIndex.vue"),
        children: [
            {
                path: "",
                name: "transfer",
                component: () => import("@/views/Finance/TransferView.vue")
            },
            {
                path: "deposit",
                name: "deposit",
                component: () => import("@/views/Finance/DepositView.vue")
            },
            {
                path: "withdraw",
                name: "withdraw",
                component: () => import("@/views/Finance/WithdrawView.vue")
            }
        ]
    },
    {
        path: "/bankcard",
        name: "bankcard",
        component: () => import("@/views/Finance/BankCardView.vue"),
        meta: { needAuth: true }
    },
    // 威客赞助专题
    {
        path: "/sponsor",
        name: "sponsor",
        component: () => import("@/views/sponsor/Index.vue"),
        meta: {
            showDrawIcon: true,
            needHeaderKFBtn: true
        }
    },
    {
        path: "/roll",
        name: "roll",
        component: () => import("@/views/Roll/RollView.vue"),
        meta: { showDrawIcon: true, needHeaderKFBtn: true, headSearchIcon: true }
    },
    {
        path: "/rollroomsearch",
        name: "rollroomsearch",
        component: () => import("@/views/Roll/RollromSearchView.vue"),
        meta: { headSearchIcon: true }
    },
    {
        path: "/rollroom",
        children: [
            {
                path: "",
                name: "rollroom",
                component: () => import("@/views/Roll/RollRoomView.vue"),
                meta: { leftTitle: "饰品/红包", rightTitle: "撤销活动" }
            },
            {
                path: "prize",
                name: "rollroomPrize",
                component: () => import("@/views/Roll/RollRoomPrizeView.vue")
            },
            {
                path: "prizeDetail",
                name: "rollroomPrizeDetail",
                component: () => import("@/views/Roll/RollRoomPrizeDetailView.vue")
            },
            {
                path: "players",
                name: "rollroomPlayers",
                component: () => import("@/views/Roll/RollPlayersView.vue")
            },
            {
                path: "rewards",
                name: "rollroomRewards",
                component: () => import("@/views/Roll/RollRewardsView.vue")
            }
        ]
    },
    {
        path: "/myroll",
        name: "myroll",
        component: () => import("@/views/Roll/MyRollView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/rollrule",
        name: "rollrule",
        component: () => import("@/views/Roll/RollRuleView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/createroom",
        name: "createroom",
        component: () => import("@/views/Roll/CreateRollRoomView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/applyactor",
        name: "applyactor",
        component: () => import("@/views/Roll/ApplyActorView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/vkstyle",
        name: "vkstyle",
        component: () => import("@/views/sponsor/Vkstyle.vue")
    },
    {
        path: "/tnc",
        name: "tnc",
        component: () => import("@/views/sponsor/Tnc.vue")
    },
    {
        path: "/battle",
        name: "battle",
        component: () => import("@/views/sponsor/Battle.vue")
    },
    {
        path: "/discovery",
        name: "discovery",
        component: () => import("@/views/DiscoveryView.vue"),
        meta: {
            showDrawIcon: true,
            needHeaderKFBtn: true
        }
    },
    {
        path: "/vipsystem",
        name: "vipsystem",
        component: () => import("@/views/VipSystemView.vue"),
        meta: {
            showDrawIcon: true
        }
    },
    {
        path: "/vbmarket",
        name: "vbmarket",
        component: () => import("@/views/VB/VbMarketView.vue"),
        meta: { needHeaderKFBtn: true, headLogIcon: true }
    },
    {
        path: "/myvb",
        name: "vbmarketRecord",
        component: () => import("@/views/VB/VbMyRecord.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/vbrank",
        name: "vbrank",
        component: () => import("@/views/VB/VbRankView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/package",
        name: "package",
        component: () => import("@/views/User/Package/PackageView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/packageAddress",
        name: "packageAddress",
        component: () => import("@/views/User/Package/PackageAddressView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/deliveryInfo",
        name: "deliveryInfo",
        component: () => import("@/views/User/Package/DeliveryInfoView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/packagelog",
        name: "packagelog",
        component: () => import("@/views/User/PackageLogView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/news",
        name: "news",
        component: () => import("@/views/News/NewsIndex.vue"),
        meta: {
            showDrawIcon: true,
            needHeaderKFBtn: true
        }
    },
    {
        path: "/news/news/:id",
        name: "newsDetails",
        component: () => import("@/views/News/NewsDetails.vue")
    },
    {
        path: "/news/live/:id",
        name: "liveVideo",
        component: () => import("@/views/News/LiveVideo.vue"),
        meta: {
            headWhiteIcon: true
        }
    },
    {
        path: "/ipban",
        name: "IpForbi",
        component: () => import("@/views/IpView.vue")
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/LoginView.vue"),
        meta: {
            needHeaderKFBtn: true,
            themeColor: "#212432",
            headWhiteIcon: true,
            isBlackBgTransparent: true
        }
    },
    {
        path: "/register",
        name: "register",
        component: () => import("@/views/RegisterView.vue"),
        meta: {
            needHeaderKFBtn: true,
            themeColor: "#212432",
            headWhiteIcon: true,
            isBlackBgTransparent: true
        }
    },
    {
        path: "/forget",
        name: "forget",
        component: () => import("@/views/ForgetView.vue"),
        meta: {
            needHeaderKFBtn: true,
            themeColor: "#212432",
            headWhiteIcon: true,
            isBlackBgTransparent: true
        }
    },
    {
        path: "/serviceterms",
        name: "serviceterms",
        component: () => import("@/views/ServiceTextView.vue")
    },
    {
        path: "/privacy",
        name: "privacy",
        component: () => import("@/views/PrivacyView.vue")
    },
    {
        path: "/jointly",
        name: "jointly",
        component: () => import("@/views/User/JoinView.vue")
    },
    {
        path: "/richpay",
        name: "richpay",
        component: () => import("@/views/Richpay/RichpayView.vue")
    },
    {
        path: "/vrichrecord",
        name: "vrichrecord",
        component: () => import("@/views/Richpay/VrichrecordView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/userinfoset",
        name: "userinfoset",
        component: () => import("@/views/User/UserInfosetView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/setting",
        name: "setting",
        component: () => import("@/views/User/SettingView.vue")
    },
    {
        path: "/usersafety",
        name: "usersafety",
        component: () => import("@/views/User/UserSafetyView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/modifypass",
        name: "modifypass",
        component: () => import("@/views/User/ModifyPassView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/modifyquestion",
        name: "modifyquestion",
        component: () => import("@/views/User/ModifyQuestionView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/modifyphone",
        name: "modifyphone",
        component: () => import("@/views/User/ModifyPhoneView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/guide",
        children: [
            {
                path: "",
                name: "guide",
                component: () => import("@/views/User/GuideView.vue")
            },
            {
                path: "appinstall",
                name: "guideAppinstall",
                component: () => import("@/views/User/Guide/AppInstall.vue")
            },
            {
                path: "register",
                name: "guideRegister",
                component: () => import("@/views/User/Guide/Register.vue")
            },
            {
                path: "deposit",
                name: "guideDeposit",
                component: () => import("@/views/User/Guide/Deposit.vue")
            },
            {
                path: "withdraw",
                name: "guideWithdraw",
                component: () => import("@/views/User/Guide/Withdraw.vue")
            },
            {
                path: "bet",
                name: "guideBet",
                component: () => import("@/views/User/Guide/Bet.vue")
            },
            {
                path: "transfer",
                name: "guideTransfer",
                component: () => import("@/views/User/Guide/Transfer.vue")
            },
            {
                path: "seo",
                name: "guideSeo",
                component: () => import("@/views/User/Guide/Seo.vue")
            },
            {
                path: "package",
                name: "guidePackage",
                component: () => import("@/views/User/Guide/Package.vue")
            },
            {
                path: "forget",
                name: "guideForget",
                component: () => import("@/views/User/Guide/Forget.vue")
            },
            {
                path: "question",
                name: "guideQuestion",
                component: () => import("@/views/User/Guide/Question.vue")
            },
            {
                path: "aboutvb",
                name: "guideAboutvb",
                component: () => import("@/views/User/Guide/Aboutvb.vue")
            },
            {
                path: "roll",
                name: "guideRoll",
                component: () => import("@/views/User/Guide/Roll.vue")
            },
            {
                path: "cryptocurrency",
                name: "guideCryptoCurrency",
                component: () => import("@/views/User/Guide/CryptoCurrency.vue")
            },
            {
                path: "ccokx",
                name: "guideCCOY",
                component: () => import("@/views/User/Guide/CCokx.vue"),
                meta: {
                    leftTitle: "关于虚拟币"
                }
            },
            {
                path: "ccgate",
                name: "guideGate",
                component: () => import("@/views/User/Guide/CCgate.vue"),
                meta: {
                    leftTitle: "关于虚拟币"
                }
            },
            {
                path: "hijacking",
                name: "hijacking",
                component: () => import("@/views/User/Guide/HiJacking.vue")
            },
            {
                path: "logger",
                name: "logger",
                component: () => import("@/views/User/Guide/Logger.vue")
            }
        ]
    },
    {
        path: "/about",
        name: "about",
        component: () => import("@/views/User/AboutView.vue")
    },
    {
        path: "/seo",
        name: "seo",
        component: () => import("@/views/User/SeoView.vue"),
        meta: { needAuth: true }
    },
    {
        path: "/redeemcode",
        name: "redeemcode",
        component: () => import("@/views/User/RedeemCode.vue"),
        meta: { needAuth: true },
        beforeEnter: (to: any, from: any) => {
            if (!from.name && to.query?.code) {
                return { path: "/redeemcode", replace: true }
            }
            return true
        }
    },
    {
        path: "/task",
        meta: { needAuth: true },
        children: [
            {
                path: "",
                name: "task",
                component: () => import("@/views/User/TaskView.vue"),
                meta: { headLogIcon: true }
            },
            {
                path: "log",
                name: "tasklog",
                component: () => import("@/views/User/TaskLogView.vue")
            }
        ]
    },
    {
        path: "/questionnaire",
        name: "questionnaire",
        component: () => import("@/views/QuestionnView.vue")
    },
    {
        path: "/messages",
        children: [
            {
                path: "",
                name: "messages",
                component: () => import("@/views/Message/MessageView.vue")
            },
            {
                path: ":id",
                name: "messagedetail",
                component: () => import("@/views/Message/MessageDetail.vue"),
                meta: {
                    leftTitle: "消息公告"
                }
            }
        ]
    },
    {
        path: "/tradingrecord",
        meta: {
            needAuth: true
        },
        children: [
            {
                path: "",
                name: "tradingrecord",
                component: () => import("@/views/User/TranRecord/TradingRecordView.vue"),
                meta: { needHeaderKFBtn: true }
            },
            {
                path: "detail",
                name: "tradingRecorDetail",
                component: () => import("@/views/User/TranRecord/TradingRecordDetail.vue")
            }
        ]
    },
    {
        path: "/ptgame",
        name: "ptgame",
        component: () => import("@/views/Game/PtGameView.vue")
    },
    {
        path: "/pggame",
        name: "pggame",
        component: () => import("@/views/Game/PgGameView.vue")
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@/views/404.vue")
    }
]

export default routes
