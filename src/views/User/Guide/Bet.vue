<script setup lang="ts">
import img1 from "@/assets/img/template/july/my/guide/bet/1.jpg"
import img2 from "@/assets/img/template/july/my/guide/bet/2.jpg"
import img3 from "@/assets/img/template/july/my/guide/bet/3.jpg"
import img4 from "@/assets/img/template/july/my/guide/bet/4.jpg"
import img5 from "@/assets/img/template/july/my/guide/bet/5.jpg"
import img6 from "@/assets/img/template/july/my/guide/bet/6.jpg"
import img7 from "@/assets/img/template/july/my/guide/bet/7.jpg"

import { ref } from "vue"

const active = ref(0)
const pageNavList = [
    {
        id: 1,
        name: "电竞赛事",
        title: "电竞赛事",
        img1: img1,
        img2: img2,
        img3: img3,
        img4: "",
        text1: "1.在【账户管理】-【转账】选择“主钱包”转账到“电竞钱包”，输入转账金额，再点击“确定”。<br/>2.打开侧边栏进入首页，点击【电竞赛事】进入电竞赛事页面。",
        text2: "3.选择希望投注的赛事及玩法，并选择所选队伍下方的赔率（“+”为总盘口数，同时可最多选取8笔注单）。",
        text21: "下注倒计时最后一分钟将无法下注。",
        text3: "4.在投注弹框中选择“RMB”，输入投注金额，点击“立即投注”",
        text4: "1）选择“模式”：RMB<br/>2）输入投注金额<br/>3）选择“立即投注”，系统会提示您投注成功！赔率有变更时请先点击“接受赔率变更”（同时可最多选取8笔注单）<br/>"
    },
    {
        id: 2,
        name: "体育赛事",
        title: "体育赛事",
        img1: img4,
        img2: img5,
        img3: img6,
        img4: img7,
        text1: "1.在【账户管理】-【转账】选择“主钱包”转账到“体育钱包”或“平博钱包”，输入转账金额，再点击“确定”。<br/>2.打开侧边栏进入首页，点击【威客体育】或【平博Sports】进入体育赛事页面。",
        text2: "3.威客体育玩法：1）在菜单中选择投注类别",
        text21: "",
        text3: "2）进入投注区，选择希望投注的赛事及队伍，并选择相应的赔率。",
        text4: "3）输入投注金额，选择“投注”。注意：美国东部时间GMT-4比北京时间慢12小时。",
        text5: ""
    }
]
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">如何参与赛事投注</div>
        </HeaderBar>
        <div class="expand-page pb-20px">
            <van-tabs v-model:active="active" background="transparent" animated swipeable :ellipsis="false">
                <van-tab v-for="(tab, i) in pageNavList" :key="i" :title="tab.name">
                    <div class="content pt-10px px-14px">
                        <div class="content_title">{{ tab.title }}</div>
                        <div class="content_text" v-html="tab.text1"></div>
                        <div class="content_img">
                            <img :src="tab.img1" alt="" />
                        </div>
                        <div class="content_text">
                            {{ tab.text2 }}
                            <span class="warning_color" v-if="tab.text21">{{ tab.text21 }}</span>
                        </div>
                        <div class="content_img">
                            <img :src="tab.img2" alt="" />
                        </div>
                        <div class="content_text" v-if="tab.text3">{{ tab.text3 }}</div>
                        <div class="content_img">
                            <img :src="tab.img3" alt="" />
                        </div>
                        <div class="content_text" v-if="tab.text4">
                            <span v-html="tab.text4"></span>
                        </div>
                        <div class="content_img" v-if="tab.img4">
                            <img :src="tab.img4" alt="" />
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "guide.scss";
</style>
