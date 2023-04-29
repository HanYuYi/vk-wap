import { createRouter, createWebHistory } from "vue-router"
import routes from "./routes"
import { useSysStore } from "@/stores/system"
import { showToast } from "vant"

const isLoginComp = (name: string): boolean => ["login", "register", "forget"].includes(name)

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { top: 0 }
    }
})

router.beforeEach(async (to, from, next) => {
    // 动态改变主题色
    const element: HTMLMetaElement = document.querySelector('meta[name~="theme-color"]')
    const rootColor: string = element && element.getAttribute("content")
    if (to.meta.themeColor) {
        if (rootColor && rootColor != to.meta.themeColor) {
            element.setAttribute("content", to.meta.themeColor as string)
        }
    } else {
        if (element) {
            element.content = "#fffffe"
        }
    }

    if (to.matched.length === 0) {
        from.name ? next({ name: from.name }) : next("/")
    } else {
        if (to.meta.needAuth) {
            const sysParams = useSysStore()
            await sysParams.getUserInfo()
            if (sysParams.isLogin) {
                isLoginComp(to.name as string) ? next("/") : next()

                // 登录状态，看是否弹出各种红包弹窗
                await sysParams.getDialogStatus(+to.query.code)
            } else {
                // 未登录状态，如果路由需要鉴权，则弹提示，并自动跳转到登录页面
                if (to.meta.needAuth) {
                    if (isLoginComp(to.name as string)) {
                        next()
                    } else {
                        showToast({ className: "vk-toast-fail", message: "您还未登录，请登录", icon: "warning" })
                        next("/login")
                    }
                } else {
                    // 不需要鉴权的
                    next()
                }
            }
        } else {
            // 不需要鉴权的
            next()
        }
    }
})

export default router
