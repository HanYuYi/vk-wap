import ExtraGetCountryPrefix from "@/api/pojo/ExtraGetCountryPrefix"
import type { UserAlert } from "@/api/pojo/UserAlert"
import { useLocalStorage } from "@vueuse/core"
import type { RemovableRef } from "@vueuse/core"
import GrayAvatar from "@/assets/defaultimg/default_headimg.png"
import type { IndexGetUserInfo } from "@/api/pojo/IndexGetUserInfo"

// 用户信息类型，来自与好几个接口
type UserInfoFirst = Pick<IndexGetUserInfo, "head_image" | "change_flag" | "continue_sign">

type UserInfoLast = Partial<Pick<IndexGetUserInfo, "tel" | "username" | "nickname" | "specific_sign" | "birth" | "has_sign">>

// 任务数量
export interface UserGetTaskNum {
    count: number
    finish: number
    package_count: number
}

/**
 * system store 实体
 */
export default class SystemStoreState {
    // header透明度
    headBgColorOpacity: number = 0

    // 是否开启背景毛玻璃效果
    appRootBlur: boolean = false

    // 全局loading显隐
    PageLoading: boolean = false

    // 是否显示app下载栏
    isShowAppDownBar: boolean = false

    // 是否存在站内信，用于显示小红点
    isShowZNXBadge: number = 0

    // app下载链接
    appdownUrl: RemovableRef<string> = useLocalStorage("appdownUrl", "https://vkgame.app/")

    // 1: 普通，2: 代理
    KFUrlStatus: number = 1

    // 老的客服链接
    KFUrl: string = ""

    // 是否显示侧边栏
    showDraw: boolean = false

    // 签到弹窗
    signDialogShow: boolean = false

    // 签到成功返回的数据
    siginInPrize: { day: number; vb: number } = null

    // 客服iframe弹窗
    kfDialogShow: boolean = false

    // 选择客服线路的弹窗
    isShowKFSelect: boolean = false

    // 验证码链接域名
    verCodeUrl: RemovableRef<string> = useLocalStorage("vcurl", "/api/extra/captcha")

    // 受限IP
    IPForbid: string = ""

    // 普通客服url List，第一条为主线路
    KFUrlByList: { link?: string }[] = []

    // 当前客服线路索引
    KFListIndex: number = 0

    // 代理客服链接
    KFProxyUrl: string = "https://secure.livechatinc.com/licence/12747459/v2/open_chat.cgi?groups=3"

    // 用户是否登录
    isLogin: RemovableRef<boolean> = useLocalStorage("isLogin", false)

    // 是否展示热点信息
    loadHotSpot: boolean = false

    // 异常状态之弱密码
    unusualWeakpass: RemovableRef<number> = useLocalStorage("unusualWeakpass", 0)

    // 异常状态之异常登录
    unusualLogin: RemovableRef<number> = useLocalStorage("unusualLogin", 0)

    userInfo: RemovableRef<(UserInfoFirst & UserInfoLast) | IndexGetUserInfo> = useLocalStorage("user", {
        head_image: GrayAvatar,
        change_flag: 0,
        continue_sign: 0
    })

    // 消息数量
    msgCount: number = 0

    // 任务数量
    taskCount: UserGetTaskNum = {
        count: 0,
        finish: -1,
        package_count: 0
    }

    // 路由跳转的参数
    routeParams: RemovableRef<unknown> = useLocalStorage("pinia/system/routeparams", {})

    countryCode: ExtraGetCountryPrefix = new ExtraGetCountryPrefix()

    countryCodeList: ExtraGetCountryPrefix[] = []

    // userid_yymmdd: 当前用户的今天时间标记，用于今日热点弹窗等
    todayTimeStamp: RemovableRef<string> = useLocalStorage("today_time_stamp", null)

    mediaPath: Record<string, string> = {
        tnc: "/static/video/tnc.mp4",
        vkstyle: "/static/video/vk_style.mp4",
        dcwallet: "/static/video/dc.mp4"
    }

    dialogData: UserAlert = {}

    // 是否弹注册红包弹窗
    showRegisterGift: boolean = false

    // 是否弹充值红包弹窗
    showRechargeGift: boolean = false

    // 是否弹生日礼包弹窗
    showBirthGift: boolean = false

    // 新版设置成功的弹窗
    showSuccessDio: boolean = false

    // 用户等级
    levelInfo: UserAlert & { isShow: boolean } = {
        isShow: false
    }

    // PT电子等弹窗，在活动规则使用
    ActiveMoreRules: { isShow: boolean; classname: string } = {
        isShow: false,
        classname: ""
    }
}
