<script setup lang="ts">
import img1 from "@/assets/img/template/july/my/guide/forget/1.jpg"
import img2 from "@/assets/img/template/july/my/guide/forget/2.jpg"
import img3 from "@/assets/img/template/july/my/guide/forget/3.jpg"
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">忘记密码</div>
        </HeaderBar>
        <div class="expand-page pb-20px pt-10px px-14px">
            <div class="content">
                <div class="content_title">忘记密码</div>
                <div class="content_text">
                    如果忘记登录密码不用担心，可马上选择自助方式来重置。
                    <br />
                    参考流程：
                    <br />
                    1.打开侧边栏，点击【登录/注册】,点击“忘记密码”，根据页面提示找回修改密码
                </div>
                <div class="content_img">
                    <img :src="img1" alt="" />
                </div>
                <div class="content_text">
                    2.自助修改密码需要提供用户账号、绑定手机号码、回答密保问题、设置新密码、再次确认密码后提交即可修改成功
                </div>
                <div class="content_img">
                    <img :src="img2" alt="" />
                </div>
                <div class="content_img">
                    <img :src="img3" alt="" />
                </div>
                <div class="content_text warning_color">
                    温馨提示：若未设置密保问题无法使用自助操作的用户，请点击【在线客服】，申请人工服务为您找回密码
                </div>
                <div class="content_text">
                    3.申请人工找回密码、修改绑定银行账号、绑定手机号码等业务受理时，为保障用户资金安全需要您提供以下信息进行核实修改；
                    <br />
                    可提供大陆二代身份证、临时身份证电子版、二选一即可，游戏账号、真实姓名（与身份证对应）、银行卡账号、电话号码、游戏账户余额等信息核实修改
                </div>
                <div class="content_text warning_color">
                    【VKGAME承诺您所提供的证件仅作为核实身份信息所用，不做任何备份及不外泄】
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "guide.scss";
</style>
