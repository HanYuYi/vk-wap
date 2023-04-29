<script setup lang="ts">
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
            <div class="header_title">Gaite.io</div>
        </HeaderBar>
        <div class="expand-page pb-20px">
            <van-tabs v-model:active="active" background="transparent" animated swipeable :ellipsis="false">
                <van-tab v-for="(tab, i) in pageNavList" :key="i" :title="tab.name">
                    <div class="content pt-10px px-14px">
                        <div class="content_title">{{ tab.name }}</div>
                        <template v-if="active === 0">
                            <div class="content_text">步骤1/4: 访问https://www.gate.tv/cn/mobileapp下载最新版本手机APP。</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/gate/register/1.jpg" alt="" />
                            </div>
                            <div class="content_text">
                                步骤2/4:
                                打开Gate.io手机App，点击页面左上角【用户中心】，选择【登录/注册】，进入登录页面。（以Android版本为例）。
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/gate/register/2.jpg" alt="" />
                            </div>
                            <div class="content_text">
                                步骤3/4: 在进入登录页面后，点击下方【免费注册】，即可进入Gate.io账户注册页面进行注册。
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/gate/register/3.jpg" alt="" />
                            </div>
                            <div class="content_text">
                                步骤4/4: 选择邮箱注册，按照要求填写信息，完成邮箱验证，点击【确认】,即可注册成功。
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/gate/register/4.jpg" alt="" />
                            </div>
                        </template>
                        <template v-if="active === 1">
                            <div class="content_text">
                                步骤1/3: .首先打开芝麻开门APP，登录完成后点击右下角【钱包】选择【提现】—选择币种【USDT】。
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/gate/buyUSDT/1.jpg" alt="" />
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/gate/buyUSDT/1_1.jpg" alt="" />
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/gate/buyUSDT/1_2.jpg" alt="" />
                            </div>
                            <div class="content_text">
                                步骤2/3:
                                选择【链上提现】—选择提现网络，网络以【USDT-TRC20】为例输入／粘贴【提现地址/域名】—【提现金额】—【申请提现到地址】。
                                <br />
                                注意：提币地址和数量需要和收银台页面展示信息一致。
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/gate/buyUSDT/2.jpg" alt="" />
                            </div>
                            <div class="content_text">步骤3/3: 二次确认转账信息正确并验证【资金密码】【手机验证码/谷歌验证】</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/gate/buyUSDT/3.jpg" alt="" />
                            </div>
                        </template>
                        <template v-if="active === 2">
                            <div class="content_text">步骤1/3: 打开并登录GATE APP，选择【钱包】点击【充值】。</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/gate/biurl/1.jpg" alt="" />
                            </div>
                            <div class="content_text">步骤2/3: 选择或搜索您想要绑定的虚拟币币种，点击进入。</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/gate/biurl/2.jpg" alt="" />
                            </div>
                            <div class="content_text">
                                步骤3/3:
                                点击【复制】注：该地址为新链地址，对拥有多个链名称的币种，如果需要绑定旧链地址需要到Web端或者APP进行选择查看复制地址。
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/gate/biurl/3.jpg" alt="" />
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
