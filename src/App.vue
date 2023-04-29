<script setup lang="ts">
import LoadingView from "@/views/LoadingView.vue"
import { RouterView, useRoute } from "vue-router"
import { useSysStore } from "@/stores/system"
import { onMounted, watch, computed } from "vue"
import { showLoadingToast, allowMultipleToast } from "vant"
import DialogSign from "@/components/dialog/DialogSign.vue"
import DialogHotSpot from "@/components/dialog/DialogHotSpot.vue"
import DialogInstro from "@/components/dialog/DialogInstro.vue"
import DialogLevel from "@/components/dialog/DialogLevel.vue"
import DialogRechargeGift from "@/components/dialog/DialogRechargeGift.vue"
import DialogRegisterGift from "@/components/dialog/DialogRegisterGift.vue"
import DialogBirthday from "@/components/dialog/DialogBirthday.vue"
import DialogUnusual from "@/components/dialog/DialogUnusual.vue"
import DialogMore from "@/components/dialog/DialogMore.vue"

// 获取全局状态里面的系统参数，类似之前的mapstate + mapAction + mapMutation
const systemParams = useSysStore()
const route = useRoute()

// 全局vant组件通用样式覆盖，插入body中的不生效，没被app包裹进来
const themeVars = {
    TabsLineHeight: "0.44rem",
    TabFontSize: "0.15rem",
    TabTextColor: "#7c839f",
    TabActiveTextColor: "#262933",
    CheckboxBorderColor: "#7c839f"
}

// 弹窗背景毛玻璃效果
watch(
    () => systemParams.appRootBlur,
    (val: boolean) => {
        if (val) {
            document.body.style.backgroundColor = "rgba(5, 6, 26, 0.8)"
        } else {
            switch (route.name) {
                case "login":
                    document.body.style.backgroundColor = "#212432"
                    break
                default:
                    document.body.style.backgroundColor = ""
                    break
            }
        }
    }
)

allowMultipleToast()

// 页面loading开启时，显示vant-loading
let loadingToast: ReturnType<typeof showLoadingToast> = null
watch(
    () => systemParams.PageLoading,
    (val) => {
        if (val) {
            loadingToast = showLoadingToast({
                duration: 0,
                message: "加载中...",
                forbidClick: true,
                loadingType: "spinner"
            })
        } else {
            if (loadingToast) {
                loadingToast.close()
            }
        }
    }
)

// 一级页面显示BottomTab
const isShowBottomTab = computed<boolean>(() => {
    const showBTRNames: string[] = ["home", "discovery", "sponsor", "news", "userhome"]
    const RouteName = route.name as string
    return showBTRNames.includes(RouteName)
})

onMounted(() => {
    // 请求客服
    systemParams.getKFUrl()
    const beforeDom: Element = document.querySelector("#beforeapp")
    beforeDom && beforeDom.remove()
})
</script>

<template>
    <div :class="{ 'blur-lg': systemParams.appRootBlur }">
        <RouterView v-slot="{ Component }">
            <template v-if="Component">
                <Transition mode="out-in">
                    <keep-alive :include="['a']" :exclude="['FinanceIndex, DepositView']">
                        <Suspense>
                            <!-- 主要内容 -->
                            <van-config-provider :theme-vars="themeVars">
                                <component :is="Component"></component>
                                <!-- 客服线路选择弹窗 -->
                                <ServiceLine />
                                <!--客服iframe-->
                                <KfIframe />
                                <!-- 签到弹窗 -->
                                <DialogSign />
                                <!-- 今日热点弹窗 -->
                                <DialogHotSpot />
                                <!-- 新手引导 -->
                                <DialogInstro />
                                <!--升级、降级提示-->
                                <DialogLevel />
                                <!-- 充值红包 -->
                                <DialogRechargeGift />
                                <!-- 注册红包 -->
                                <DialogRegisterGift />
                                <!-- 生日红包 -->
                                <DialogBirthday />
                                <!-- 弱密码修改、异常登录验证 -->
                                <DialogUnusual />
                                <!-- 活动查看更多PT电子弹窗 -->
                                <DialogMore />
                            </van-config-provider>
                            <!-- 加载中状态 -->
                            <template #fallback>
                                <LoadingView />
                            </template>
                        </Suspense>
                    </keep-alive>
                </Transition>
            </template>
        </RouterView>

        <BottomTab v-if="isShowBottomTab" />
    </div>
</template>

<style></style>
