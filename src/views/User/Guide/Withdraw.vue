<script setup lang="ts">
import img1 from "@/assets/img/template/july/my/guide/withdraw/1.jpg"
import img2 from "@/assets/img/template/july/my/guide/withdraw/2.jpg"
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">提款</div>
        </HeaderBar>
        <div class="expand-page pb-20px pt-10px px-14px">
            <div class="content">
                <div class="content_title">如何提款</div>
                <div class="content_text">
                    1.打开侧边栏菜单栏进入【账户管理】或【个人中心】-【资金管理】
                    <br />
                    2.点击【提现】，单笔提款限额100-50000元，单日累计最高20万，24小时内最多可申请20笔提款
                    <br />
                    3.输入您的提款额度、选择提款银行账号、输入交易密码并确认信息，点击【确认提款】即可
                </div>
                <div class="content_img">
                    <img :src="img1" alt="" />
                </div>
                <div class="content_text warning_color">
                    温馨提示：1）第一次提款，需要先添加银行卡及设置交易密码。游戏钱包中的额度请点击【转账】转入到主钱包；
                    <br />
                    2）提款时需要您完成充值后的一倍有效流水，比如充值1000后，需要达到的有效投注额大于等于1000即可；
                    <br />
                    3）如7天之内未有提款记录的用户，将显示账号异常，需进行验证身份，发送手机验证码并填写即可。
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
