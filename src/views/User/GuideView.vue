<script setup lang="ts">
import Block from "./block.vue"
import { useRouter } from "vue-router"

const router = useRouter()

const jump = (path: string): void => {
    router.push(path)
}
</script>

<template>
    <div class="personal-page bg-mypageColor">
        <HeaderBar>
            <div class="header_title">新手引导</div>
        </HeaderBar>

        <div class="expand-page py-12px">
            <Block @click="jump('/guide/appinstall')" title="APP安装指引" :showlabel="false" />

            <Block @click="jump('/guide/register')" title="注册" :showlabel="false" />

            <Block @click="jump('/guide/deposit')" title="充值" :showlabel="false" />

            <Block @click="jump('/guide/withdraw')" title="提款" :showlabel="false" />

            <Block @click="jump('/guide/bet')" title="如何参与赛事投注" :showlabel="false" />

            <Block @click="jump('/guide/transfer')" title="站内转账" :showlabel="false" />

            <Block @click="jump('/guide/cryptocurrency')" title="关于虚拟币" :showlabel="false" />

            <Block @click="jump('/guide/aboutvb')" title="关于V币" :showlabel="false" />

            <Block @click="jump('/guide/roll')" title="饰品/红包" :showlabel="false" />

            <Block @click="jump('/guide/seo')" title="推广分享" :showlabel="false" />

            <Block @click="jump('/guide/package')" title="我的背包" :showlabel="false" />

            <Block @click="jump('/guide/forget')" title="忘记密码" :showlabel="false" />

            <Block @click="jump('/guide/question')" title="常见问题" :showlabel="false" />

            <Block @click="jump('/guide/hijacking')" title="防劫持教程" :showlabel="false" />

            <Block @click="jump('/guide/logger')" title="登录器安装教程" :showlabel="false" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
:deep(.block-wrapper) {
    .single-box {
        .input-box {
            width: 100%;
        }
    }
}
</style>
