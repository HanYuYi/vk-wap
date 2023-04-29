<script setup lang="ts">
import img1 from "@/assets/img/template/july/my/guide/package/1.jpg"
import img2 from "@/assets/img/template/july/my/guide/package/2.png"
import img3 from "@/assets/img/template/july/my/guide/package/3.png"
import img4 from "@/assets/img/template/july/my/guide/package/4.png"
import img5 from "@/assets/img/template/july/my/guide/package/5.png"
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">我的背包</div>
        </HeaderBar>
        <div class="expand-page pb-20px pt-10px px-14px">
            <div class="content">
                <div class="content_text">
                    在网站参与饰品市场或抽奖所获得的游戏饰品将自动发放到【我的背包】
                    <br />
                    我的背包中，您可以查看在威客网站获得的奖励，还可以将物品转至绑定的Steam账户中
                    <br />
                    打开侧边栏菜单栏进入【个人中心】-【我的应用】-【我的背包】
                </div>
                <div class="content_img">
                    <img :src="img1" alt="" />
                </div>
                <div class="content_text">
                    需要将获得饰品存入/取回功能，需要设置交易链接，才能接收机器人报价，具体设置步骤如下：
                    <br />
                    1）点击【我的背包】-【交易URL设置】，将steam交易链接填写到下方【保存修改】
                </div>
                <div class="content_img">
                    <img :src="img2" alt="" />
                </div>
                <div class="content_text">
                    2）如果不记得您的交易链接，【点击查看steam交易URL】超链接将直接跳转到steam登录页面，您登录steam账号，进入【库存】-【交易报价】-【谁能向我发送交易报价？】即可看到您的交易链接，将链接复制到VKGAME网站，保存修改；
                </div>
                <div class="content_img">
                    <img :src="img3" alt="" />
                </div>
                <div class="content_text">
                    3）在做存取操作时您需要将steam账号个人资料状态或者库存设置为公开，否则机器人无法向您发送报价
                    <br />
                    点击编辑隐私设置，将个人资料状态、库存全部选择公开，点击保存更改
                </div>
                <div class="content_img">
                    <img :src="img4" alt="" />
                </div>
                <div class="content_img">
                    <img :src="img5" alt="" />
                </div>
                <div class="content_text warning_color">
                    温馨提示：
                    <br />
                    注意不要勾选到最下方的“保持您的Steam礼物库存只有您自己可见，忽略以上库存设定
                    <br />
                    若在饰品存取的过程中遇到任何问题，请附带系统提示及steam中机器人报价的对应截图，交易链接联系客服为您处理
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "guide.scss";
</style>
