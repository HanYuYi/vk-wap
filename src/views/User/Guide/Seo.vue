<script setup lang="ts">
import img1 from "@/assets/img/template/july/my/guide/seo/1.jpg"
import img2 from "@/assets/img/template/july/my/guide/seo/2.jpg"
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">推广/分享</div>
        </HeaderBar>
        <div class="expand-page pb-20px pt-10px px-14px">
            <div class="content">
                <div class="content_text">
                    网站每一位用户都拥有个人专属推广链接及推广邀请码，可通过QQ、微博、微信、浏览器等多种方式将推广链接或优惠码分享给好友进行注册
                    <br />
                    1.打开侧边栏菜单栏进入【个人中心】-【推荐】-【推广分享】
                </div>
                <div class="content_img">
                    <img :src="img1" alt="" />
                </div>
                <div class="content_text">
                    2.【推广分享】中可看到您的专属推广二维码、推广链接及推广码，可直接发送给好友使用您的推广链接或二维码进行注册
                </div>
                <div class="content_img">
                    <img :src="img2" alt="" />
                </div>
                <div class="content_text warning_color">
                    温馨提示：1）推广链接与推广邀请码可二选一分享给好友注册（推广链接可修改），使用推广邀请码注册时，可实现在不同域名下注册成为您的推广用户；
                    <br />
                    2）邀请人与被邀请人必须为不同身份的真实玩家，且邀请人等级需≥2级，每一手机号码、银行卡、电脑、IP地址（包括使用VPN）都会判定为同一玩家，双方必须绑定银行卡
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "guide.scss";
</style>
