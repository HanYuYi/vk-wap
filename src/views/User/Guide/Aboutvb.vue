<script setup lang="ts">
import { ref } from "vue"
import { useSysStore } from "@/stores/system"

const systemParams = useSysStore()

const active = ref(0)
const pageNavList = [
    {
        id: 1,
        name: "V币规则"
    },
    {
        id: 2,
        name: "如何获取V币"
    }
]
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">关于V币</div>
        </HeaderBar>
        <div class="expand-page pb-20px">
            <van-tabs v-model:active="active" background="transparent" animated swipeable :ellipsis="false">
                <van-tab v-for="(tab, i) in pageNavList" :key="i" :title="tab.name">
                    <div class="content pt-10px px-12px">
                        <section v-if="active === 0">
                            <div class="content_title">1、什么是V币？</div>
                            <div class="content_text">
                                V币是VKGAME赠与玩家的虚拟币，持有V币的玩家还可以用V币兑换一定比例的RMB现金投注额、在V币商城兑换超值物品等。
                            </div>
                            <div class="content_title">2、如何赚取V币？</div>
                            <div class="content_text">
                                1）PC签到赚取，每天打开VKGAME首页或者个人中心都可以签到赚V币，首日可领10个，连续第二天可领20个，第三天及以后连续的每天都是30个。
                                <br />
                                2）流水赚V币，用户每累计达到30的有效流水即可获得1V币。用户每日所获取的V币将于次日中午12:00前自动派发，V币计算周期为：昨日0点至今日0点的流水报表。IM电竞游戏将不计算在V币获取的有效流水中。
                                <br />
                                电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水。所有轮盘类游戏、牛牛、骰宝、捕鱼王、空战世纪不计算为有效流水；
                                PT电子游戏中以下游戏不计算为有效流水：
                                <span @click="systemParams.ActiveMoreRules.isShow = true" text="#27bc74">点击查看</span>
                                。
                                <br />
                                3）参与平台V币相关活动赚取V币奖励。
                            </div>
                            <div class="content_title">3、如何使用和兑换V币？</div>
                            <div class="content_text">1）参与商城兑换，在V币商城兑换现金投注额、实物奖品等。</div>
                            <div class="content_title">4、如何查看V币明细？</div>
                            <div class="content_text">V币明细查看，请进入个人中心—概览页后点击我的V币。</div>
                            <div class="content_title">5、哪些用户行为是违规的？会有什么处罚措施？</div>
                            <div class="content_text">
                                （1）通过人工操作或机器程序批量注册垃圾账号；
                                <br />
                                （2）通过人工操作或机器程序等非正常途径获取V币；
                                <br />
                                （3）在获取和使用V币的过程中恶意套现等扰乱秩序行为，VKGAME将取消您的获取资格，并有权撤销违规交易（包含,活动、抽奖、兑换等），扣除V币（含已使用的及未使用的）,
                                必要时追究法律责任。
                                <br />
                                满足以上3情况的任意一种用户，通过抽奖、兑换等方式，在VKGAME获得礼品，VKGAME都将有权将该用户拉入黑名单、同时扣除相应的V币、及取消该用户的获奖资格。
                            </div>
                            <div class="content_title">6、注意事项</div>
                            <div class="content_text">
                                a. V币兑换或抽奖的礼品以VKGAME平台上的资料为准，如遇不可抗力因素，V币保留更换其它等值奖项的权利。
                                <br />
                                b. V币所有的实物礼品寄送地区仅限用户所在国家或地区，VKGAME不处理跨国邮寄礼品之事宜。
                                <br />
                                c. V币保留对活动进行变动和调整的权利，具体情形以VKGAME官方活动页面上文案表述为准。
                                <br />
                                d. 其他未尽事宜，VKGAME拥有最终解释权。
                                <br />
                                e.
                                对于存在作弊、不良交易、不良注册、发送垃圾消息、欺诈等不良行为的账号及其相关联的账号，以及已被冻结的账号及其相关联的账号，VKGAME有权对其做扣除V币处理。最终解释权归VKGAME所有。f.
                                本规则自2020年3月1日00:00起执行。
                            </div>
                        </section>
                        <section v-if="active === 1">
                            <table cellpadding="0" cellspacing="0">
                                <thead>
                                    <tr>
                                        <th>项目</th>
                                        <th>获取V币额度</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>注册账号</td>
                                        <td class="warning_color">+100</td>
                                    </tr>
                                    <tr>
                                        <td>绑定银行卡</td>
                                        <td class="warning_color">+100</td>
                                    </tr>
                                    <tr>
                                        <td>绑定手机卡</td>
                                        <td class="warning_color">+100</td>
                                    </tr>
                                    <tr>
                                        <td>自定义头像和昵称</td>
                                        <td class="warning_color">+30</td>
                                    </tr>
                                    <tr>
                                        <td>设置安全问题</td>
                                        <td class="warning_color">+50</td>
                                    </tr>
                                    <tr>
                                        <td>设置交易密码</td>
                                        <td class="warning_color">+50</td>
                                    </tr>
                                    <tr>
                                        <td>创建ROLL房间，且饰品价值＞100</td>
                                        <td class="warning_color">+200</td>
                                    </tr>
                                    <tr>
                                        <td>用户推广首次充值</td>
                                        <td class="warning_color">+200</td>
                                    </tr>
                                    <tr>
                                        <td>完成问卷调查</td>
                                        <td class="warning_color">+1888</td>
                                    </tr>
                                    <tr>
                                        <td>设置交易密码</td>
                                        <td class="warning_color">+10</td>
                                    </tr>
                                    <tr>
                                        <td>流水获取</td>
                                        <td class="warning_color">30流水+1</td>
                                    </tr>
                                    <tr>
                                        <td>每日充值≥500</td>
                                        <td class="warning_color">+100</td>
                                    </tr>
                                    <tr>
                                        <td>每日满足任意游戏流水≥1000</td>
                                        <td class="warning_color">+20</td>
                                    </tr>
                                    <tr>
                                        <td>每日满足任意游戏流水≥10000</td>
                                        <td class="warning_color">+50</td>
                                    </tr>
                                    <tr>
                                        <td>每日参与两种以上不同类型的游戏并完成流水≥500</td>
                                        <td class="warning_color">+50</td>
                                    </tr>
                                    <tr>
                                        <td>连续签到</td>
                                        <td style="width: 67%; padding: 0.2em" class="warning_color">
                                            首日可领10个，连续第二天可领20个，第三天及以后连续的每天都是30个。
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "guide.scss";
table {
    width: 95%;
    margin: 10px;
    text-align: center;
    line-height: 1.6;

    th {
        height: 50px;
        font-size: 16px;
        font-weight: normal;
        border: 1px solid var(--vk-old-text-color);
    }
    td {
        height: 40px;
        font-size: 14px;
        border: 1px solid var(--vk-old-text-color);
    }
}
</style>
