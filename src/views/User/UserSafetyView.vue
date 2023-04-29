<script setup lang="ts">
import Block from "./block.vue"
import { useSysStore } from "@/stores/system"
import { useRouter } from "vue-router"
import { formatterSecPhone } from "@/composable/validate"

const router = useRouter()
const systemParams = useSysStore()

const jump = (path: string): void => {
    router.push(path)
}
</script>

<template>
    <div class="personal-page bg-mypageColor">
        <HeaderBar>
            <div class="header_title">账号与安全</div>
        </HeaderBar>
        <div class="expand-page py-12px">
            <div>
                <Block
                    @click="jump('/modifypass')"
                    :title="'账户密码'"
                    :title-lable="systemParams.userInfo.has_loginpwd ? '已保护' : '未设置'"
                    :green-title="!!systemParams.userInfo.has_loginpwd"
                    :showlabel="false"
                >
                    <template #lefticon>
                        <div class="left-icon pass-icon"></div>
                    </template>
                </Block>
                <Block
                    @click="jump('/modifypass?type=1')"
                    :title="'交易密码'"
                    :title-lable="systemParams.userInfo.has_securitypwd ? '已保护' : '未设置'"
                    :green-title="!!systemParams.userInfo.has_securitypwd"
                    :showlabel="false"
                >
                    <template #lefticon>
                        <div class="left-icon pass-money-icon"></div>
                    </template>
                </Block>
            </div>
            <div class="mt-12px">
                <Block
                    @click="jump('/modifyquestion')"
                    :title="'密保问题'"
                    :title-lable="systemParams.userInfo.has_question ? '已开启' : '未设置'"
                    :green-title="!!systemParams.userInfo.has_question"
                    :showlabel="false"
                >
                    <template #lefticon>
                        <div class="left-icon question-icon"></div>
                    </template>
                </Block>
                <Block
                    @click="jump('/modifyphone')"
                    :title="systemParams.userInfo.tel ? '修改手机号' : '绑定手机号'"
                    :label="systemParams.userInfo.tel ? formatterSecPhone(systemParams.userInfo.tel) : ''"
                    :label-robot="true"
                >
                    <template #lefticon>
                        <div class="left-icon phone-icon"></div>
                    </template>
                </Block>
            </div>
        </div>
    </div>
</template>
