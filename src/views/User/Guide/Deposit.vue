<script setup lang="ts">
import img1 from "@/assets/img/template/july/my/guide/deposit/1.jpg"
import img2 from "@/assets/img/template/july/my/guide/deposit/2.jpg"
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">充值</div>
        </HeaderBar>
        <div class="expand-page pb-20px pt-10px px-14px">
            <div class="content">
                <div class="content_title">如何充值</div>
                <div class="content_text">1.打开侧边栏菜单进入【账户管理】或【个人中心】-【资金管理】</div>
                <div class="content_text">
                    2.点击【充值】，选择页面，目前已有通道，按照页面提示进行充值
                    <br />
                    <span class="warning_color">
                        温馨提示：部分充值渠道只限PC端使用，如您使用手机端充值渠道不是很方便，建议转至PC端，提供更多通道供您使用；
                        <br />
                        充值中出现的账号、二维码仅为一次性使用，不得重复使用。重复使用造成的资金丢失，本平台概不负责；
                        <br />
                        假如您的充值订单超过15分钟仍未到账，请及时联系在线客服帮您处理；
                    </span>
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
