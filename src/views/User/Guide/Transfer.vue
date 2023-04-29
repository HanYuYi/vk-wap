<script setup lang="ts">
import img1 from "@/assets/img/template/july/my/guide/transfer/1.jpg"
import img2 from "@/assets/img/template/july/my/guide/transfer/2.jpg"
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">站内转账</div>
        </HeaderBar>
        <div class="expand-page pb-20px pt-10px px-14px">
            <div class="content">
                <div class="content_title">如何游戏转账</div>
                <div class="content_text">
                    在充值后如需参与下注，需要先进行站内转账，对应游戏中的余额，可通过转账功能实现与主钱包互转分配余额，打开侧边栏菜单栏进入【账户管理】或【个人中心】-【资金管理】，输入需要转入或者转出的额度，点击【确认】。系统会提示您转账成功！随后您可查看游戏钱包余额哦。
                </div>
                <div class="content_img">
                    <img :src="img1" alt="" />
                </div>
                <div class="content_img">
                    <img :src="img2" alt="" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "guide.scss";
</style>
