<script setup lang="ts">
import reg1 from "@/assets/img/template/july/my/guide/crypto/okex/register/1.jpg"
import reg2 from "@/assets/img/template/july/my/guide/crypto/okex/register/2.jpg"
import reg3 from "@/assets/img/template/july/my/guide/crypto/okex/register/3.jpg"
import reg31 from "@/assets/img/template/july/my/guide/crypto/okex/register/3_1.jpg"
import reg4 from "@/assets/img/template/july/my/guide/crypto/okex/register/4.jpg"
import reg5 from "@/assets/img/template/july/my/guide/crypto/okex/register/5.jpg"
import deo1 from "@/assets/img/template/july/my/guide/crypto/okex/buyUSDT/1.jpg"
import deo11 from "@/assets/img/template/july/my/guide/crypto/okex/buyUSDT/1_1.jpg"
import deo2 from "@/assets/img/template/july/my/guide/crypto/okex/buyUSDT/2.jpg"
import deo21 from "@/assets/img/template/july/my/guide/crypto/okex/buyUSDT/2_1.jpg"
import deo22 from "@/assets/img/template/july/my/guide/crypto/okex/buyUSDT/2_2.jpg"
import deo3 from "@/assets/img/template/july/my/guide/crypto/okex/buyUSDT/3.jpg"
import deo4 from "@/assets/img/template/july/my/guide/crypto/okex/buyUSDT/4.jpg"
import deo5 from "@/assets/img/template/july/my/guide/crypto/okex/buyUSDT/5.jpg"
import add1 from "@/assets/img/template/july/my/guide/crypto/okex/biurl/1.jpg"
import add2 from "@/assets/img/template/july/my/guide/crypto/okex/biurl/2.jpg"
import add3 from "@/assets/img/template/july/my/guide/crypto/okex/biurl/3.jpg"

import { ref } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

const active = ref(0)
const pageNavList = [
    {
        id: 1,
        name: "下载&注册"
    },
    {
        id: 2,
        name: "充值"
    },
    {
        id: 3,
        name: "获取收款地址"
    }
]

if (route.query?.type) {
    active.value = Number(route.query?.type)
}
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">欧易</div>
        </HeaderBar>
        <div class="expand-page pb-20px">
            <van-tabs v-model:active="active" background="transparent" animated swipeable :ellipsis="false">
                <van-tab v-for="(tab, i) in pageNavList" :key="i" :title="tab.name">
                    <div class="content pt-10px px-14px">
                        <div class="content_title">{{ tab.name }}</div>
                        <template v-if="active === 0">
                            <div class="content_text">步骤1/5: 访问https://www.okex.com 下载最新版本手机APP。</div>
                            <div class="content_img">
                                <img :src="reg1" alt="" />
                            </div>
                            <div class="content_text">
                                步骤2/5: 选择【登录/注册】点击【注册新账】支持手机号注册和邮箱注册两种方式，按照要求填写信息。
                            </div>
                            <div class="content_img">
                                <img :src="reg2" alt="" />
                            </div>
                            <div class="content_text">步骤3/5: 这里以手机注册为例，填写手机账号完成手机短信验证。</div>
                            <div class="content_img">
                                <img :src="reg3" alt="" />
                            </div>
                            <div class="content_img">
                                <img :src="reg31" alt="" />
                            </div>
                            <div class="content_text">步骤4/5: 设置登陆密码（设置带有大小写及特殊符号安心系数更高）。</div>
                            <div class="content_img">
                                <img :src="reg4" alt="" />
                            </div>
                            <div class="content_text">步骤5/5: 完成注册，欢迎来到数字货币的世界。</div>
                            <div class="content_img">
                                <img :src="reg5" alt="" />
                            </div>
                        </template>
                        <template v-if="active === 1">
                            <div class="content_text">
                                步骤1/5:
                                首先打开欧易官方APP点击上方【登录】，输入账号和密码完成安全验证（如果您没有注册先去注册）。
                            </div>
                            <div class="content_img">
                                <img :src="deo1" alt="" />
                            </div>
                            <div class="content_img">
                                <img :src="deo11" alt="" />
                            </div>
                            <div class="content_text">
                                步骤2/5: 账户登录完成后点击右下角【资产】选择【提现】—选择币种【USDT】。
                            </div>
                            <div class="content_img">
                                <img :src="deo2" alt="" />
                            </div>
                            <div class="content_img">
                                <img :src="deo21" alt="" />
                            </div>
                            <div class="content_img">
                                <img :src="deo22" alt="" />
                            </div>
                            <div class="content_text">
                                步骤3/5:
                                选择【链上提现】—选择提现网络，网络以【USDT-ERC20】为例输入／粘贴【USDT地址/域名】—【数量】—【下一步】。
                                <br />
                                注意：提币地址和数量需要和收银台页面展示信息一致。
                            </div>
                            <div class="content_img">
                                <img :src="deo3" alt="" />
                            </div>
                            <div class="content_text">
                                步骤4/5: 二次确认转账信息正确并验证【资金密码】【邮箱验证码】【手机验证码/谷歌验证】。
                            </div>
                            <div class="content_img">
                                <img :src="deo4" alt="" />
                            </div>
                            <div class="content_text">
                                步骤5/5: 验证完成后点击【确认】成功发起提款申请后，等候1-3分钟即可成功到账。
                            </div>
                            <div class="content_img">
                                <img :src="deo5" alt="" />
                            </div>
                        </template>
                        <template v-if="active === 2">
                            <div class="content_text">步骤1/3: 打开并登录欧易APP，选择【资产】—>>【资金账户】，点击充值。</div>
                            <div class="content_img">
                                <img :src="add1" alt="" />
                            </div>
                            <div class="content_text">步骤2/3: 选择或搜索您想要绑定的虚拟币币种，点击进入。</div>
                            <div class="content_img">
                                <img :src="add2" alt="" />
                            </div>
                            <div class="content_text">
                                步骤3/3:
                                点击【复制地址】注：该地址为新链地址，对拥有多个链名称的币种，如果需要绑定旧链地址需要到Web端或者APP进行选择查看复制地址。
                            </div>
                            <div class="content_img">
                                <img :src="add3" alt="" />
                            </div>
                        </template>
                        <div>
                            <div class="content_title">注意事项</div>
                            <div class="content_text">
                                · 操作时请尽快完成[购买USDT]与[平台USDT存款]步骤，以免长时间未完成操作导致二维码失效。
                                <br />

                                ·
                                请购买与存款页面所相对应的USDT类型，如在存款页面选择ERC20则购买时也选择ERC20，不同类型转账将导致失败。
                                <br />

                                · 转出时需要支付少量手续费，请在买币前联系对应交易平台客服了解手续费数量。
                                <br />

                                · 若三次取消交易当日将无法再进行买入。
                                <br />

                                · 如遇交易平台无法打开时建议尝试更换浏览器或开启VPN进行操作。
                                <br />

                                · 进行任意交易前请确认好信息。
                                <br />

                                ·
                                本使用说明为热门交易平台功能介绍，不负责担保任何交易结果，使用中若遇到操作、账户类的问题，请在交易平台[帮助中心]联系[在线客服]。
                                <br />

                                · 若交易平台的内容有所变更，一切以交易平台官方信息为准。
                            </div>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "guide.scss";
.content {
    .content_text {
        font-size: 12px;
    }

    .content_img {
        box-shadow: none;
    }
}
</style>
