import { defineStore } from "pinia"
import ApiSetting from "@/api/service"
import LoginRegisterState from "@/stores/LoginRegisterState"
import { HttpPlus } from "@/api/HttpPlus"
import type { IndexRegisterInfo } from "@/api/pojo/IndexRegisterInfo"
import type { Focus } from "@/api/pojo/IndexRegisterInfo"

export const useLoginStore = defineStore("login", {
    state: () => ({ ...new LoginRegisterState() }),

    actions: {
        async loginRegInit(): Promise<void> {
            HttpPlus.setUrlOptions(ApiSetting.index.loginInit)
            const res = await HttpPlus.sendHttpRequest<IndexRegisterInfo>()

            if (res.status === 1 && res.data) {
                this.loginRegModelData = {
                    verfiy: Number(res.data.verfiy),
                    registerTips: res.data.register_tips,
                    registerLeaveTips: res.data.register_finish_tips,
                    registerSwiperData: res.data.focus.map((item: Focus) => {
                        return {
                            ...item,
                            img: item.mob_focus_img,
                            wap_url: item.wap_door_url
                        }
                    })
                }
            }
        }
    }
})
