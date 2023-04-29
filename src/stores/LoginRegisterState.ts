import { useLocalStorage } from "@vueuse/core"
import type { RemovableRef } from "@vueuse/core"
import type { IndexRegisterInfo } from "@/api/pojo/IndexRegisterInfo"
import type { Focus } from "@/api/pojo/IndexRegisterInfo"

interface LoginRegModelData {
    verfiy: number
    registerTips: IndexRegisterInfo["register_tips"]
    registerLeaveTips: IndexRegisterInfo["register_finish_tips"]
    registerSwiperData: Array<Required<Focus> & { img: Focus["mob_focus_img"]; wap_url: Focus["wap_door_url"] }>
}

export default class LoginRegisterState {
    // 登录模式 phone/username
    loginMode: RemovableRef<string> = useLocalStorage("loginMode", "phone")

    // 注册模式 phone/username
    registerMode: RemovableRef<string> = useLocalStorage("registerMode", "phone")

    // 登录注册模块初始化公用信息
    loginRegModelData: LoginRegModelData = {
        //  0: 文字验证码    1: 极验
        verfiy: 1,
        // 注册页banner
        registerSwiperData: [],
        // 注册tag提示
        registerTips: "",
        // 离开注册弹窗内容
        registerLeaveTips: ""
    }

    captchaObj: any = null

    //注册页回退弹窗
    showRegLeaveDialog: boolean = false
}
