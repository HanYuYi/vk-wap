<script setup lang="ts">
import reg1 from "@/assets/img/template/july/my/guide/register/1.jpg"
import reg2 from "@/assets/img/template/july/my/guide/register/2.jpg"
import reg3 from "@/assets/img/template/july/my/guide/register/3.jpg"
import reg4 from "@/assets/img/template/july/my/guide/register/4.jpg"
import reg5 from "@/assets/img/template/july/my/guide/register/5.jpg"
import reg6 from "@/assets/img/template/july/my/guide/register/6.jpg"
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">注册</div>
        </HeaderBar>
        <div class="expand-page pb-20px pt-10px px-14px">
            <div class="content">
                <div class="content_title">账户注册流程</div>
                <div class="content_text">1.登录威客网址（www.vkgame.one），选择线路，打开手机版网页，点击【登录/注册】</div>
                <div class="content_img">
                    <img :src="reg1" alt="" />
                </div>
                <div class="content_img">
                    <img :src="reg2" alt="" />
                </div>
                <div class="content_text">默认为手机号码注册方式，您也可以切换为账号密码注册方式</div>
                <div class="content_img">
                    <img :src="reg3" alt="" />
                </div>
                <div class="content_text">
                    <p>
                        2.默认选择【中国大陆+86，非大陆地址注册点击+86后的△键点击下拉框选择您所在地区】，发送验证码【账户注册成功则默认为账户绑定此手机号】；
                        <br />
                        验证码 - 输入验证码点击【立即注册】即可注册成功，如验证码一直没有收到，请联系【在线客服】查询；
                        <br />
                        邀请码 - 如无邀请者则无需填写邀请码；
                        <br />
                    </p>
                    <span class="warning_color">注意：注册时即代表同意《VKGAME服务协议》</span>
                    <p>
                        用户名 - 用来登入帐户，必须6-12位小写字母数字；
                        <br />
                        密码 - 有大小写之分，必须6-20位大小写字母数字或下划线；
                    </p>
                </div>
                <div class="content_img">
                    <img :src="reg4" alt="" />
                </div>
                <div class="content_text">
                    3.若在电脑端使用手机号或极速注册方式成功后，进入【个人中心】，可点击右上角【编辑图标】进行修改用户名，用户名只可修改一次。
                </div>
                <div class="content_img">
                    <img :src="reg5" alt="" />
                </div>
                <div class="content_img">
                    <img :src="reg6" alt="" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "guide.scss";
</style>
