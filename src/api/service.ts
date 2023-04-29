const ApiSetting = {
    index: {
        getAlertInfo: {
            url: "/User/alert"
        },
        takeBirthPresent: {
            url: "/User/takeBirthPresent"
        },
        getKfUrl: {
            url: "/extra/getSomeLink/"
        },
        getCsLinks: {
            url: "/extra/getCsLinks/"
        },
        getUserInfo: {
            url: "/Index/getUserInfo/",
            repeat: true
        },
        resetUnusalLogin: {
            url: "/index/resetUnusalLogin/"
        },
        loginInit: {
            url: "/index/registerInfo/"
        },
        login: {
            url: "/index/dologin/"
        },
        loginOut: {
            url: "/Index/logout/"
        },
        register: {
            url: "/index/register/"
        },
        forgetPass: {
            url: "/Index/forgetPass/"
        },
        getCountryPrefix: {
            url: "/extra/getCountryPrefix/",
            method: "get" as "get"
        },
        sendPhoneVerCode: {
            url: "/Index/checkMessage/"
        },
        getMoney: {
            url: "/Deposit/getMoney/",
            repeat: true,
            timeout: 60000
        },
        getVirtualMoney: {
            url: "/Deposit/getVirtualMoney/"
        },
        getUnReadMsgCount: {
            url: "/User/messageNum/"
        },
        homePagePop: {
            // 首页弹窗新加的接口，先请求这个展示王者归来和问卷调查，如果没数据，在请求老接口看是否弹今日热带你
            newRecommend: {
                url: "/index/getIndexAlert"
            },
            // 今日热点老接口
            wonderfulRecommendList: {
                url: "/Index/getWonderfulRecommendList"
            }
        }
    },
    home: {
        getHomeBanner: {
            url: "/Index/index/"
        },
        // 新版面接口，包含banner, 公告，游戏
        getHomeData: {
            url: "/index/indexV2"
        },
        getHotGame: {
            url: "/index/getHotGame"
        }
    },
    roll: {
        getRollRoomList: {
            url: "/roll/getList/"
        },
        getRoomInfo: {
            url: "/roll/view/",
            repeat: true
        },
        getRoomPlayerList: {
            url: "/roll/getroomapplylist/",
            timeout: 20000
        },
        getRoomAwardsPlayerList: {
            url: "/roll/getroomwinlist/"
        },
        getTitleMenu: {
            url: "/roll/getTitleMenu/",
            repeat: true
        },
        getUserProfile: {
            url: "/roll/getUserProfile/"
        },
        getHistoryList: {
            url: "/roll/getHistory/"
        },
        applyRollTags: {
            url: "/roll/applyTags/"
        },
        joinRoom: {
            url: "/roll/applyroom/"
        },
        createCheck: {
            url: "/roll/createcheck/"
        },
        createRoom: {
            url: "/roll/createroom/"
        },
        getCreateUserPackage: {
            url: "/roll/userpackage/"
        },
        editRoom: {
            url: "/roll/editRoom/"
        },
        cancelRoom: {
            url: "/roll/cancelroom/"
        }
    },
    user: {
        // 查询用户收货地址
        checkAddress: {
            url: "/UserAddress/getAddress"
        },
        // 添加/修改收货地址
        addAddress: {
            url: "/UserAddress/saveAddress"
        },
        // 查询快递信息
        deliverInfo: {
            url: "/Vmall/delivery"
        },
        // 确认发快递
        confirmExpress: {
            url: "/Vmall/express"
        },
        // 修改快递地址
        modifyExpress: {
            url: "/Vmall/changeAddress"
        },
        // 打开虚拟物品
        openVirGoods: {
            url: "/Vmall/virtualItem"
        },
        // 修改平台帐号信息
        changeAccount: {
            url: "/Vmall/changeAccount"
        },
        redeemCode: {
            url: "/Deposit/useCoupon/"
        },
        getTaskCount: {
            url: "/User/getTaskNum/"
        },
        uploadUserImg: {
            url: "/User/uploadHead/",
            timeout: 20000
        },
        signIn: {
            url: "/User/signdaily/"
        },
        upDateUserInfo: {
            url: "/User/updateBaseInfo/"
        },
        setLoginPwd: {
            url: "/User/resetPassword/"
        },
        setTradePwd: {
            url: "/User/resetSecurityPassword/"
        },
        getSafeQuestion: {
            url: "/User/safeQuestion/"
        },
        setSafeQuestion: {
            url: "/User/setSafeQuestion/"
        },
        verifySafeQuestion: {
            url: "/User/verifySafeQuestion/"
        },
        bindPhone: {
            url: "/User/bindPhone/"
        },
        verPhoneNumber: {
            url: "/User/verifyOldPhone/"
        },
        updatePhone: {
            url: "/User/updatePhone/"
        },
        getUserBankList: {
            url: "/UserBank/userbankList/"
        },
        getBankUserList: {
            url: "/UserBank/bankAndArea/"
        },
        addUserBankCard: {
            url: "/UserBank/addBank/"
        },
        checkUserBank: {
            url: "/UserBank/checkBank/"
        },
        lockBankCard: {
            url: "/UserBank/lockBank/"
        },
        setDefaultBank: {
            url: "/UserBank/setDefaultBank/"
        },
        getVirtualBankType: {
            url: "/UserVirtualBank/bank/"
        },
        addVirtualBank: {
            url: "/UserVirtualBank/addBank/"
        },
        getVirtualBankList: {
            url: "/UserVirtualBank/userbankList/"
        },
        virtuallockBank: {
            url: "/UserVirtualBank/lockBank/"
        },
        setDefaultVirtual: {
            url: "/UserVirtualBank/setDefaultBank/"
        },
        getTaskList: {
            url: "/User/gettasklist/"
        },
        getTaskPrize: {
            url: "/User/getTaskPrize/"
        },
        getMessageList: {
            url: "/User/getMessageList/"
        },
        getNoticeList: {
            url: "/Index/getNotice"
        },
        getMessageDetail: {
            url: "/User/messageDetail/"
        },
        getUserSeoInfo: {
            url: "/User/seo/"
        },
        setSeoKey: {
            url: "/User/saveUserSeo/"
        },
        getGameWalletList: {
            url: "/Deposit/exchangeList/"
        },
        getDepositList: {
            url: "/Deposit/getdeposittype/"
        },
        getTradingRecordList: {
            url: "/User/orderList/"
        },
        getVcoinList: {
            url: "/User/vcoinList"
        },
        getTradingRecordDetail: {
            url: "/User/orderDetail/"
        },
        getTradingTypeList: {
            url: "/User/orderTypeList/"
        },
        applyDeposit: {
            url: "/Deposit/applyDeposit/",
            timeout: 60000
        },
        withdrawIndex: {
            url: "/Deposit/withdraw/"
        },
        withdrawCheck: {
            url: "/Deposit/withdrawCheck/"
        },
        withdrawSubmit: {
            url: "/Deposit/withdrawDo/",
            timeout: 60000
        },
        withdrawToRichPaySubmit: {
            url: "/Deposit/withdrawToRichPay"
        },
        transferSubmit: {
            url: "/Deposit/moneyExchange/"
        },
        getUserPackage: {
            url: "/UserSteam/getUserPackage/"
        },
        openPackage: {
            url: "/roll/openPackage"
        },
        itemExchange: {
            url: "/roll/itemExchange"
        },
        getSteamStock: {
            url: "/UserSteam/getSteamStock/",
            timeout: 60000
        },
        checkSteamTradeStatus: {
            url: "/UserSteam/getSteamTradeStatus/",
            repeat: true
        },
        packageToSteam: {
            url: "/UserSteam/packageToSteam/",
            timeout: 60000
        },
        steamToPackage: {
            url: "/UserSteam/steamToPackage/",
            timeout: 60000
        },
        getPackageRecord: {
            url: "/UserSteam/getPackageRecord/"
        },
        setSteamTradeUrl: {
            url: "/UserSteam/updateTradeUrl/"
        },
        getUserSteamInfo: {
            url: "/UserSteam/getUserSteamInfo/"
        },
        getSteamItemDetail: {
            url: "/Index/steamItemDetail/",
            repeat: true
        },
        // 一键转入
        setQuicklyTransfer: {
            url: "/deposit/setQuicklyTransfer",
            repeat: true
        },
        // 余额回收
        getBackAllMoney: {
            url: "/deposit/getBackAllMoney",
            repeat: true
        }
    },
    active: {
        getActiveList: {
            url: "/Active/index/"
        },
        getUserJoinStatus: {
            url: "/Active/getUserJoinStatus"
        },
        getNewplayerWelfareList: {
            url: "/Active/newWelfare/"
        },
        playgroundActive: {
            initRedPacketActive: {
                url: "/active/specialvenue"
            },
            initWaterActive: {
                url: "/active/specialwater"
            },
            joinRedPacketBonus: {
                url: "/active/joinSpecialVenue"
            },
            joinWaterBonus: {
                url: "/active/joinSpecialWater"
            }
        },
        dotaMojor: {
            activeInit: {
                url: "/active/getDotaMajor2023Init"
            },
            guessDotaMajor: {
                url: "/active/joinDotaMajor2023"
            },
            getApplyList: {
                url: "/active/getDotaMajor2023ApplyList"
            }
        },
        // 老会员回归
        regress: {
            init: {
                url: "/Active/getRegressInit"
            },
            join: {
                url: "/Active/getRegress"
            }
        },
        // 2022 真人首存/复存
        RealPerson2022: {
            FirstRechargeInit: {
                url: "/Active/getRealPersonFirstRechargeInit"
            },
            SecondRechargeInit: {
                url: "/Active/getRealPersonSecondRechargeInit"
            }
        },
        // 2022 棋牌首存/复存
        Chess2022: {
            FirstRechargeInit: {
                url: "/Active/getChessCardsFirstRechargeInit"
            },
            SecondRechargeInit: {
                url: "/Active/getChessCardsSecondRechargeInit"
            }
        },
        // 2022 电玩首存/复存
        Elec2022: {
            FirstRechargeInit: {
                url: "/Active/getVideoGameFirstRechargeInit"
            },
            SecondRechargeInit: {
                url: "/Active/getVideoGameSecondRechargeInit"
            }
        },
        // 迎新唤友
        callFriends: {
            init: {
                url: "/Active/getCallFriendsInit"
            },
            records: {
                url: "/Active/getCallFriendsRecords"
            }
        },
        // 电竞首存
        getEgameFirstTransferInit: {
            url: "/Active/getEgameFirstTransferInit"
        },
        getSportIndemnityInit: {
            // 欧冠包赔
            url: "/Active/getSportIndemnityInit"
        },
        getIndemnityGameList: {
            url: "/Active/getIndemnityGameList"
        },
        // VIP月救援金
        getVipMonthRescueInit: {
            url: "/vip/getVipMonthRescueInit"
        },
        // VIP月成就奖
        getVipMonthAchienementAwardInit: {
            url: "/vip/getVipMonthAchienementAwardInit"
        },
        // VIP月成就奖
        joinVipMonthAchienementAward: {
            url: "/vip/joinVipMonthAchienementAward"
        },
        joinVipMonthRescueActive: {
            url: "/vip/joinVipMonthRescueActive"
        },
        // VIP存款优惠
        getVipTransferInit: {
            url: "/vip/getVipTransferInit"
        },
        getVipTransferBonus: {
            url: "/vip/getVipTransferBonus"
        },
        // VIP游戏体验金
        getVipPrivilegeInit: {
            url: "/vip/getVipPrivilegeInit"
        },
        joinVipPrivilegeActive: {
            url: "/vip/joinVipPrivilegeActive"
        },
        // vip返水
        vipGameBack: {
            url: "/vip/vipGameBack"
        },
        // vip主页面
        getVipHallInit: {
            url: "/vip/getVipHallInit"
        },
        getRewardsMsg: {
            url: "/vip/getRewardsMsg"
        },
        // 电子救援金
        getSlotRescueFundInit: {
            url: "/active/getSlotRescueFundInit"
        },
        // 棋牌救援金
        getChessRescueFundInit: {
            url: "/active/getChessRescueFundInit"
        },
        // 雀王活动
        getChessKingInit: {
            url: "/active/getChessKingInit"
        },
        getSportGasInit: {
            url: "/active/getSportGasInit"
        },
        getActivePopup: {
            url: "/active/getActivePopup"
        },
        goodLuckUpgradeInit: {
            url: "/active/getGoodLuckUpgradeInit"
        },
        getVipTransferAgainInit: {
            url: "/active/getVipTransferAgainInit"
        },
        joinVipTransferAgain: {
            url: "/active/joinVipTransferAgain"
        },
        sportWeekDepositInit: {
            url: "/active/getSportWeekDepositInit"
        },
        shabaIndemnityActiveInit: {
            url: "/active/getNewSportIndemnityInit"
        },
        usdtDepositInit: {
            url: "/active/getUsdtDepositInit"
        },
        getUsdtDeposit: {
            url: "/Active/joinUsdtDeposit"
        },
        getFiveMajorLeaguesInit: {
            url: "/active/getFiveMajorLeaguesInit"
        },
        // v富通活动
        richPayInit: {
            url: "/RichPay/getRichPayInit"
        },
        nba2022: {
            getNbaIndependentInit: {
                url: "/active/getNbaIndependentInit"
            },
            getNbaInit: {
                url: "/active/getNba2022Init"
            },
            getNbaBetInit: {
                url: "/active/getNbaBetReturnInit"
            },
            getNbaWinInit: {
                url: "/active/getNbaProfitReturnInit"
            }
        },
        quartermasterData: {
            init: {
                url: "/active/getActiveQmgInit"
            },
            takeVB: {
                url: "/active/drawQmgDayTask?a=" + new Date().getTime()
            },
            takeSurprised: {
                url: "/active/drawQmgDayPrize?a=" + new Date().getTime()
            }
        },
        initBackwaterForever: {
            url: "/active/getRealPersonDailyReturnInit"
        }
    },
    // 威客历程
    getVkStyleList: {
        url: "/Index/getVkstyleList"
    },
    getPGList: {
        url: "/Pg/getGameList/"
    },
    // vb商城
    getGoodsType: {
        url: "/vmall/getGoodsType"
    },
    getGoodsList: {
        url: "/vmall/getGoodsList"
    },
    convertGoods: {
        url: "/vmall/convertGoods"
    },
    myConvertList: {
        url: "/vmall/myConvertList"
    },
    getConvertTop: {
        url: "/vmall/getConvertTop"
    },
    // ptgame
    ptSlotgetGameList: {
        url: "/ptSlot/getGameList"
    },
    ptCollectGame: {
        url: "/ptSlot/collectGame"
    },
    pyGetJackpot: {
        url: "/ptSlot/getJackpot"
    },
    // 新版问卷调查
    questionnaire: {
        init: {
            url: "/active/getSurveyGammaInit"
        },
        submit: {
            url: "/active/surveyGammaJoin"
        }
    },
    // 合营
    getProxyInfoInit: {
        url: "/ProxyApply/getInfoInit"
    },
    ProxyApply: {
        url: "/ProxyApply/apply"
    },
    // V富通
    richPayGetOrderList: {
        url: "/richPay/getOrderList"
    },
    richPayTransferOutToMain: {
        url: "/RichPay/transferOutToMain"
    },
    richPaylottery: {
        url: "/RichPay/lottery"
    },
    richPaySavePrize: {
        url: "/RichPay/savePrize"
    },
    richPayWithdrawInterest: {
        url: "/RichPay/withdrawInterest"
    },
    richPayGetPrizeList: {
        url: "/RichPay/getPrizeList"
    },
    richPayGetjoinPlus: {
        url: "/RichPay/joinPlus"
    },
    vkNews: {
        banner: {
            url: "/information/getBanner"
        },
        notice: {
            url: "/information/getNotice"
        },
        newsType: {
            url: "/information/getCategories"
        },
        newsList: {
            url: "/information/getList"
        },
        newsDetail: {
            url: "/information/getDetail"
        },
        // 直播
        getLive: {
            url: "/index/getHotLive"
        },
        // 赛程
        getSchedule: {
            url: "/index/getSchedule"
        },
        // 打开直播
        openLive: {
            url: "/index/getLive"
        },
        // 推荐赛事
        recommendMatch: {
            url: "/index/getRecommend"
        }
    }
}

export default ApiSetting
