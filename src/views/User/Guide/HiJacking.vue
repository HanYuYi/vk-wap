<script setup lang="ts">
import { ref } from "vue"

const active = ref(0)
const pageNavList = [
    {
        id: 1,
        name: "Android教程 "
    },
    {
        id: 2,
        name: "iOS教程 "
    }
]
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">防劫持教程</div>
        </HeaderBar>

        <div class="expand-page pb-20px">
            <van-tabs v-model:active="active" background="transparent" animated swipeable :ellipsis="false">
                <van-tab v-for="(tab, i) in pageNavList" :key="i" :title="tab.name">
                    <div class="content pt-10px px-14px">
                        <section v-if="active === 0">
                            <div class="content_text">1. 打开手机，点击“设置”应用程序。</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/hijacking/hijacking_android_image1.png" alt="" />
                            </div>
                            <div class="content_text">2.点击“Wi-Fi”进入Wi-Fi列表，并选择连接上可用的Wi-Fi网络。</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/hijacking/hijacking_android_image2.png" alt="" />
                            </div>
                            <div class="content_text">
                                3.连接上可用的Wi-Fi网络后，然后点击Wi-Fi网络名称右方的“箭头”按钮进入网络详情。
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/hijacking/hijacking_android_image3.png" alt="" />
                            </div>
                            <div class="content_text">4.在该Wi-Fi网络详情部分找到“IP设置”，点击设置为“静态”。</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/hijacking/hijacking_android_image4.png" alt="" />
                            </div>
                            <div class="content_text">
                                5.分别将“DNS1”和“DNS2”设置为“114.114.114.114”、“8.8.8.8”，然后点击“保存”即可。
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/hijacking/hijacking_android_image5.png" alt="" />
                            </div>
                        </section>
                        <section v-if="active === 1">
                            <div class="content_text">1.打开手机，点击“设置”应用程序。</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/hijacking/hijacking_ios_image1.png" alt="" />
                            </div>
                            <div class="content_text">2.点击“Wi-Fi”进入Wi-Fi列表，并选择连接上可用的Wi-Fi网络。</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/hijacking/hijacking_ios_image2.png" alt="" />
                            </div>
                            <div class="content_text">
                                3.连接上可用的Wi-Fi网络后，然后点击Wi-Fi网络名称右方的“显示信息”按钮（字母“i”）。
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/hijacking/hijacking_ios_image3.png" alt="" />
                            </div>
                            <div class="content_text">4.在该Wi-Fi网络详情部分向下滚动，找到“配置DNS”。</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/hijacking/hijacking_ios_image4.png" alt="" />
                            </div>
                            <div class="content_text">5.配置DNS设置选择“手动”，然后点击“添加服务器”。</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/hijacking/hijacking_ios_image5.png" alt="" />
                            </div>
                            <div class="content_text">6.在此输入“114.114.114.114”后点击“存储”。</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/hijacking/hijacking_ios_image6.png" alt="" />
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
