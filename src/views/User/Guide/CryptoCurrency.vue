<script setup lang="ts">
import { ref } from "vue"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

const active = ref(0)
const pageNavList = [
    {
        id: 1,
        name: "什么是虚拟币"
    },
    {
        id: 2,
        name: "如何绑定"
    },
    {
        id: 3,
        name: "充值余额"
    },
    {
        id: 4,
        name: "提至虚拟币"
    },
    {
        id: 5,
        name: "交易平台"
    }
]

if (route.query?.id) {
    active.value = Number(route.query.id)
}
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">关于虚拟币</div>
        </HeaderBar>
        <div class="expand-page pb-20px">
            <van-tabs v-model:active="active" background="transparent" animated swipeable :ellipsis="false">
                <van-tab v-for="(tab, i) in pageNavList" :key="i" :title="tab.name">
                    <div class="content pt-10px px-14px" :class="{ 'px-0!': active === 4 }">
                        <section v-if="active === 0">
                            <div class="content_title">什么是虚拟币</div>
                            <div class="content_text">
                                虚拟币是一种不具备实体形式的、仅以数字形式存在的货币，也称之为“数字货币”。
                                <br />

                                其性质与实体货币相似，允许在互联网上即时地、无地理限制地转让，主流的数字货币如USDT(泰达币)、BTC(比特币)、ETH(以太坊)等。
                                <br />

                                用户可以通过数字货币交易平台购买数字货币，在平台进行支付、兑换成人民币从而进行游戏。
                                <br />
                                <div @click="active = 4" class="text-#07f1b7">点击查看如何交易虚拟币 >>>></div>
                            </div>
                            <div class="content_title">虚拟币有哪些优势</div>
                            <div class="content_text">
                                ·高度加密
                                <br />
                                与银行卡等传统交易方式相比，玩家不需要给出自己的姓名或卡号即可完成虚拟币交易，避免敏感信息泄露。
                                <br />
                                <br />
                                ·交易快速
                                <br />
                                虚拟币所采用的区块链技术具有去中心化特点，不需要清算中心机构来处理数据，交易时间大大缩短。
                                <br />
                                <br />
                                ·去中心化
                                <br />
                                不由央行或当局发行，不受银行监管，玩家可随心所欲地使用存放在自己数字钱包里的资金。
                            </div>
                            <div class="content_title">虚拟币币种推荐</div>
                            <div class="content_text">
                                泰达币（Tether）也被称为USDT，其价值等同于美元。1 USDT≈1
                                美元，该特点使USDT成为全球加密数字货币中规模最大、流通性最高的稳定币，具有良好的保值性，也是网站所使用的主要币种。
                                <br />
                                <br />

                                泰达币（USDT）的主要优势为：安全、便捷，其具体表现在：
                                <br />

                                安全方面：价格稳定、流通性高、匿名交易；便捷方面：不受银行监管、24小时随时交易、全球交易无地域限制。
                            </div>
                            <div class="content_title">虚拟币交易平台推荐</div>
                            <div class="content_text">
                                <!-- ·火币<br>

                火币网是老牌虚拟币交易平台之一，以太坊、莱特币等上百种数字货币的交易及投资。
                 <span @click="cellClick(vbdatas[0])"  class="text-#07f1b7">了解更多</span><br><br>-->

                                <!-- ·币安<br>

                币安于2017年上线，提供比特币、莱特币、以太坊、BNB、USDT等主流数字货币交易。
                 <span  @click="cellClick(vbdatas[1])"  class="text-#07f1b7">了解更多</span><br><br>-->

                                ·欧易
                                <br />

                                欧易是全球著名的数字资产交易平台之一，主要面向全球用户提供比特币、莱特币、以太币等数字资产的币币和衍生品交易服务。
                                <span @click="router.push('/guide/ccokx')" class="text-#07f1b7">了解更多</span>
                                <br />
                                <br />

                                ·Gate.io
                                <br />

                                Gate.io
                                数字资产交易平台成立于2013年，在行业内深耕8年，多次登上全球行业内权威机构的真实交易量、透明数字资产、高投资回报率等排行榜单前十，是全球最值得信赖的数字货币交易所之一。
                                <span @click="router.push('/guide/ccgate')" class="text-#07f1b7">了解更多</span>
                                <br />
                                <br />
                            </div>
                        </section>
                        <section v-if="active === 1">
                            <div class="content_title">如何绑定虚拟币</div>
                            <div class="content_text">
                                使用交易平台的充币地址，绑定虚拟币账户后，即可将平台余额提现到虚拟币账户中。
                            </div>
                            <div class="content_text">
                                步骤1/5: 根据不同的虚拟币交易平台，进入不同的账户开设流程，获取虚拟币充币地址：
                            </div>
                            <span @click="router.push('/guide/ccokx?type=2')" class="text-#07f1b7">
                                点击进入查看：欧易交易平台 如何获取充币地址
                            </span>
                            <br />
                            <br />
                            <span @click="router.push('/guide/ccgate?type=2')" class="text-#07f1b7">
                                点击进入查看：Gate.io交易平台 如何获取充币地址
                            </span>
                            <br />
                            <br />
                            <div class="content_text">步骤2/5: 点击左上角[三]“个人中心-收款账户-虚拟币”；</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/bind/step2-1.jpg" alt="" />
                                <img src="@/assets/img/template/july/my/guide/crypto/bind/step2-2.jpg" alt="" />
                            </div>
                            <div class="content_text">步骤3/5: 点击添加虚拟币；</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/bind/step3.jpg" alt="" />
                            </div>
                            <div class="content_text">步骤4/5: 输入当前账号的手机号码进行安全验证；</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/bind/step4.jpg" alt="" />
                            </div>
                            <div class="content_text">
                                步骤5/5:
                                在已开通账户的虚拟币交易平台，复制需要交易的支付链接，然后在以下界面，正确选择币种，并粘贴支付链接到输入框，点击保存。绑定完成后，即可向该虚拟币账户提现。
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/bind/step5.jpg" alt="" />
                            </div>
                        </section>
                        <section v-if="active === 2">
                            <div class="content_title">虚拟币充值余额</div>
                            <div class="content_text">步骤1/5: 点击底部导航栏“我的”，进入个人中心后，点击“充值”；</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/buzou1-2.jpg" alt="" />
                                <img src="@/assets/img/template/july/my/guide/crypto/buzou1-3.jpg" alt="" />
                            </div>
                            <div class="content_text">步骤2/5: 输入充值金额，选择充值线路，点击“立即充值”按钮；</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/buzou2.jpg" alt="" />
                            </div>
                            <div class="content_text">步骤3/5: 请在转账剩余时间结束前完成转账；</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/buzou3-1.jpg" alt="" />
                                <img src="@/assets/img/template/july/my/guide/crypto/buzou3-2.jpg" alt="" />
                            </div>
                            <div class="content_text">
                                步骤4/5: 复制支付链接或保存二维码后，在不同的虚拟币交易平台，进入后续支付流程：
                            </div>
                            <span @click="router.push('/guide/ccokx?type=1')" class="text-#07f1b7">
                                点击进入查看：欧易交易平台 如何充值USDT到VK
                            </span>
                            <br />
                            <br />
                            <span @click="router.push('/guide/ccgate?type=1')" class="text-#07f1b7">
                                点击进入查看：Gate.io交易平台 如何充值USDT到VK
                            </span>
                            <br />
                            <br />

                            <div class="content_text">
                                步骤5/5:
                                本次充值完成，等待游戏账号余额增加即可，不同数币到账时间略有差别，如长时间未到账，请联系客服协助解决。
                            </div>
                        </section>
                        <section v-if="active === 3">
                            <div class="content_title">余额提现至虚拟币</div>
                            <div class="content_text">步骤1/2: 点击左上角[三]“个人中心-提现”，或点击“账户管理-提现”；</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/transfer_to_VCA/step1-1.jpg" alt="" />
                                <img src="@/assets/img/template/july/my/guide/crypto/transfer_to_VCA/step1-2.jpg" alt="" />
                                <img src="@/assets/img/template/july/my/guide/crypto/transfer_to_VCA/step1-3.jpg" alt="" />
                            </div>
                            <div class="content_text">
                                步骤2/2:
                                输入提款金额，选择提现到【虚拟币】，再选择您想要收款的虚拟币账户（可即时新增虚拟币账户）；
                            </div>
                            <div class="content_text">您可以从【预计到账】中，根据实时市场汇率，参考提现后的具体到账数量；</div>
                            <div class="content_text">最后，输入【交易密码】，短信验证成功后即可完成提款。</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/crypto/transfer_to_VCA/step2.jpg" alt="" />
                            </div>
                        </section>
                        <section v-if="active === 4">
                            <van-cell
                                class="bg-transparent"
                                title-class="text-16px text-oldText"
                                size="large"
                                title="欧易"
                                is-link
                                to="/guide/ccokx"
                            />
                            <van-cell
                                class="bg-transparent"
                                size="large"
                                title-class="text-16px text-oldText"
                                title="Gate.io"
                                is-link
                                to="/guide/ccgate"
                            />
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
