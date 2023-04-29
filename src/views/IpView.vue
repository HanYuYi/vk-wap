<script setup lang="ts">
import { useSysStore } from "@/stores/system"

const systemParams = useSysStore()
</script>

<template>
    <div class="page_ip_forbi w-screen h-screen text-center text-white">
        <div class="flex-center flex-col">
            <img class="w-153px h-40px mt-40px" src="@/assets/img/ipban/logo.png" alt="" />
            <div class="px-48px text-left text-14px leading-normal mt-60px float-left">
                <div>
                    <img class="w-36px h-36px align-middle" src="@/assets/img/ipban/ban-icon.png" alt="" />
                    <span class="text-24px font-bold tracking-6px ml-10px align-middle">禁止访问</span>
                </div>
                <p class="mt-7px">当前地区不允许访问</p>
                <p class="ipadress text-primaryGreen" v-show="systemParams.IPForbid">IP : {{ systemParams.IPForbid }}</p>
                <div class="flex_box">
                    <div class="icon kefu_icon inline-block align-middle"></div>
                    <span align-middle>如有任何问题，请联系我们的</span>
                    <a
                        class="underline font-bold text-primaryGreen"
                        href="javascript:;"
                        @click="systemParams.UpdateKFDialogShow(true)"
                    >
                        在线客服
                    </a>
                </div>
                <div class="flex_box">
                    <div class="icon email_icon inline-block align-middle"></div>
                    <span class="uppercase align-middle">或发邮件至 cs@vkgame.com</span>
                </div>
                <p>给您造成不便，敬请谅解。</p>

                <p class="uppercase mt-7px">We are not serving your location.</p>
                <p class="uppercase">Please contact our Customer Service Support 24/7 Live Help</p>
                <p class="uppercase">or Drop us an email to cs@vkgame.com</p>
                <p class="uppercase">Apologise for any inconvenience that this may have caused.</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page_ip_forbi {
    background: url("@/assets/img/ipban/bg.jpg") no-repeat center top;
    background-size: 100% 100%;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    .icon {
        width: 14px;
        height: 14px;
        margin-right: 10px;
    }
    .kefu_icon {
        background: url("@/assets/img/ipban/kefu-icon.png") no-repeat center center;
        background-size: 12px 14px;
    }

    .email_icon {
        background: url("@/assets/img/ipban/email-icon.png") no-repeat center center;
        background-size: 14px 11px;
    }
}
</style>
