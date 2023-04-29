<script setup lang="ts">
import Block from "./block.vue"
import { showConfirmDialog } from "vant"
import { useSysStore } from "@/stores/system"
import { useRouter } from "vue-router"

const router = useRouter()
const systemParams = useSysStore()

const jump = (path: string): void => {
    router.push(path)
}

// 退出登录
const onLoginOutConfirm = async (): Promise<void> => {
    try {
        const dialogRes = await showConfirmDialog({
            title: "提示",
            message: "您确认要退出？",
            className: "vk-confirm-dialog",
            width: 300,
            confirmButtonText: "确认",
            confirmButtonColor: "#07f1b7"
        })
        if (dialogRes === "confirm") {
            const isOut: boolean = await systemParams.loginOut()
            if (isOut) {
                router.replace("/")
            }
        }
    } catch (e: unknown) {
        // on cancel
        console.error(e)
    }
}
</script>

<template>
    <div bg="mypageColor">
        <HeaderBar>
            <div class="header_title">设置</div>
        </HeaderBar>
        <div class="expand-page pt-12px">
            <div>
                <Block @click="jump('/userinfoset')" :title="'个人资料'" :showlabel="false">
                    <template #lefticon>
                        <div class="left-icon personal-icon"></div>
                    </template>
                </Block>
                <Block @click="jump('/usersafety')" :title="'账号与安全'" :showlabel="false">
                    <template #lefticon>
                        <div class="left-icon safe-icon"></div>
                    </template>
                </Block>
            </div>
            <!-- <Block class="my-12px only" :title="'通知设置'" :showlabel="false">
        <template #lefticon>
          <div class="left-icon notice-icon"></div>
        </template>
      </Block> -->
            <div class="mt-12px">
                <Block @click="jump('/guide')" :title="'新手引导'" :showlabel="false">
                    <template #lefticon>
                        <div class="left-icon guide-icon"></div>
                    </template>
                </Block>
                <Block @click="jump('/about')" :title="'关于'" :showlabel="false">
                    <template #lefticon>
                        <div class="left-icon about-icon"></div>
                    </template>
                </Block>
            </div>
            <div class="logout-btn" v-if="systemParams.isLogin" @click="onLoginOutConfirm">退出当前登录</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.logout-btn {
    width: 3.43rem;
    height: 0.48rem;
    box-sizing: border-box;
    margin: 0.24rem auto;
    border-radius: 0.08rem;
    box-shadow: 0 0.01rem 0.03rem 0 rgba(97, 150, 173, 0.1), 0 0.01rem 0 0 #dde7ec;
    border: solid 0.005rem #ecf2f1;
    background-image: linear-gradient(to bottom, #ffffff 0%, rgba(255, 255, 255, 0.25) 100%);
    font-size: 0.14rem;
    font-weight: 600;
    color: #808a87;
    text-align: center;
    line-height: 0.48rem;
}
</style>
