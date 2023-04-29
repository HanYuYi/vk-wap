import { ref, unref, onMounted, nextTick, computed } from "vue"
import type { Ref } from "vue"
import { useElementSize } from "@vueuse/core"
import { showDialog, showToast } from "vant"

export interface GameOptions {
    url: string
    isNeedLogin?: boolean | number
    isCheckName?: boolean | number
    changeFlag?: boolean | number
}

/**
 * 进入游戏
 * @param gameOptions
 * @param isLogin
 * @param isToast
 */
export function useStartGame(gameOptions: GameOptions, isLogin?: boolean, isToast: boolean = false): boolean {
    // 是否验证快捷用户名: 快捷的需要修改后才可以访问

    if (gameOptions.isNeedLogin && !isLogin) {
        if (isToast) {
            showToast({ className: "vk-toast-fail", message: "请您先登录", icon: "warning" })
        }
        return false
    }

    // 限制修改用户名后才能游戏
    if (gameOptions.isCheckName && gameOptions.changeFlag === 1) {
        showDialog({
            message: "请先前往个人中心修改用户名，方可进入游戏",
            className: "vk-confirm-dialog",
            width: 300,
            confirmButtonText: "确定",
            confirmButtonColor: "#07f1b7"
        })
        return true
    }

    /////////////////////////////////////////
    // 平博三方修复safari浏览器无法显示页面的问题 //
    /////////////////////////////////////////
    window.addEventListener("message", (event: MessageEvent<any>): void => {
        // check pinnacle origin
        if (event.origin && event.origin.toLowerCase().endsWith(".tender88.com")) {
            const postData = event.data
            switch (postData.action) {
                case "OPEN_WINDOW":
                    window.open(postData.url)
                    break
                default:
                    break
            }
        }
    })

    window.open(gameOptions.url, "_blank")
    return true
}

/**
 * 跑马灯计算跑马灯元素宽度
 * @param speed
 */
export function useMarquee(speed: number = 90) {
    // 跑马灯内容宽度
    const marqueeWidth: Ref<number> = ref(0)
    // 跑马灯过渡时间
    const marqueeDuration = computed<number>(() => (unref(marqueeWidth.value) * 2) / speed)
    onMounted(async (): Promise<void> => {
        await nextTick()
        const ele: HTMLElement = document.querySelector(".marquee")
        if (ele) {
            ;(marqueeWidth as Ref).value = useElementSize(ele).width
        }
    })

    return { marqueeDuration, marqueeWidth }
}

/**
 * animation.css动画添加和自动删除class
 * @param element
 * @param animation
 * @param needPreFix 是否需要前缀，目前项目使用unocss封装好的，就不需要前缀了
 * @param isAdd 是否先添加classname再删除
 * @param prefix
 */
export const animateCSS = (
    element: string,
    animation: string,
    needPreFix: boolean = false,
    isAdd: boolean = true,
    prefix: string = "animate__"
): Promise<string> =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName: string = needPreFix ? `${prefix}${animation}` : `${animation}`
        const node: Element = document.querySelector(element)

        if (isAdd) {
            node.classList.add(`${prefix}animated`, animationName)
        }

        node.addEventListener(
            "animationend",

            function (event: Event) {
                // When the animation ends, we clean the classes and resolve the Promise
                event.stopPropagation()
                node.classList.remove(`${prefix}animated`, animationName)
                resolve("Animation ended")
            },
            { once: true }
        )
    })
