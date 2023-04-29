<script setup lang="ts">
import { ref } from "vue"

const active = ref(0)
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">登录器安装教程</div>
        </HeaderBar>

        <div class="expand-page pb-20px">
            <van-tabs v-model:active="active" background="transparent" animated swipeable :ellipsis="false" shrink>
                <van-tab title="Android教程">
                    <div class="content pt-10px px-14px">
                        <section>
                            <div class="content_text">1. 请在VKGAME官方网址主页的“威客登录器”选择 Android系统扫码下载；</div>
                            <div class="content_text">2. 下载成功后，打开安装包，完成安装即可启动 威客登录器。</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/logger/logger_android_2.png" alt="" />
                            </div>
                        </section>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "guide.scss";
</style>
