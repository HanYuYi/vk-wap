<script setup lang="ts">
import { ref } from "vue"

const active = ref(0)
const pageNavList = [
    {
        id: 1,
        name: "如何创建房间"
    },
    {
        id: 2,
        name: "如何参与"
    },
    {
        id: 3,
        name: "如何认证"
    },
    {
        id: 4,
        name: "行为准则"
    }
]
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">饰品/红包</div>
        </HeaderBar>
        <div class="expand-page pb-20px">
            <van-tabs v-model:active="active" background="transparent" animated swipeable :ellipsis="false">
                <van-tab v-for="(tab, i) in pageNavList" :key="i" :title="tab.name">
                    <div class="content pt-10px px-14px">
                        <section v-if="active === 0">
                            <div class="content_text">VKGAME账户等级大于等于1级并绑定银行卡用户即可参与饰品/红包活动</div>
                            <div class="content_title">如何创建房间</div>
                            <div class="content_text">
                                在饰品/红包中，等级大于等于2级的用户即可创建一个属于自己的房间，将VKGAME背包库存中的DOTA2与CSGO饰品作为礼物发放给参与你活动的用户
                                <br />
                                1）打开侧边栏菜单栏进入【饰品/红包】或【个人中心】-【我的应用】-【饰品/红包】
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/roll/1.jpg" alt="" />
                            </div>
                            <div class="content_text">2）选择【饰品/红包】-【我的ROLL】，点击【创建ROLL房间】，进入创建页面</div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/roll/2.jpg" alt="" />
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/roll/3.jpg" alt="" />
                            </div>
                            <div class="content_text">
                                3）【添加饰品】在【我的饰品库】中选择DATA2或者CSGO的饰品用于参与ROLL，点击【创建】即可
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/roll/4.jpg" alt="" />
                            </div>
                            <div class="content_text warning_color">
                                活动说明：主要填写关于这次ROLL活动的介绍，说明中出现QQ，QQ群，微信号，微博号或带广告性质链接的房间，系统将自动屏蔽房间描述
                            </div>
                            <div class="content_text warning_color">
                                活动时间：ROLL时间范围大于一小时，开始时间至截止时间不得大于6天，根据设置的开始时间及结束时间自动将饰品ROLL给参与玩家
                            </div>
                            <div class="content_text warning_color">
                                中奖人数：中奖人数不限制，ROLL出的饰品个数不得小于中奖人数
                            </div>
                            <div class="content_text warning_color">
                                房间密码：只有通过VKGAME认证的用户、或用户等级大于或等于3级方可设置房间密码
                            </div>
                            <div class="content_text">
                                4.房间创建完成后在ROLL首页【我发起的】可以看到您所发起的ROLL活动
                                <br />
                                5.点击发起的ROLL房间，可查房间号、奖品池、及参与名单、更改编辑房间密码及说明
                            </div>
                            <div class="content_text warning_color">
                                温馨提示：所有房间在无人参与时，房主可以自主关闭房间，有人参与后无法撤消活动
                            </div>
                        </section>
                        <section v-if="active === 1">
                            <div class="content_text">
                                注册VKGAME账户等级大于等于1级的用户即可参与饰品/红包活动
                                <br />
                                1.在ROLL首页，可通过最热/最新参与ROLL活动，亦可直接搜索房间号参与
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/roll/5.jpg" alt="" />
                            </div>
                            <div class="content_text">
                                2.点击需参与房间，进入到该房间页面，点击【立即参与】，输入该房ROLL密码（若房主未设置密码则不需）、验证码即可参加；
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/roll/6.jpg" alt="" />
                            </div>
                            <div class="content_title">查看ROLL结果</div>
                            <div class="content_text">
                                在ROLL活动中被幸运抽中的会员系统会自动发站内信通知，所得饰品将自动发放到【个人中心】-【我的背包】，用户可以查看“我的库存”，也可以通过查看【我参与的】的活动点击查看详情。
                            </div>
                        </section>
                        <section v-if="active === 2">
                            <div class="content_text">
                                VKGAME认证用户将有饰品市场房间加密特权
                                <br />
                                认证流程：登录需要申请头衔的VKGAME账号，在【我的ROLL】顶部，“成为认证大咖”点击填写申请，提供对应头衔以及满足条件的凭证
                            </div>
                            <div class="content_img">
                                <img src="@/assets/img/template/july/my/guide/roll/7.jpg" alt="" />
                            </div>
                            <div class="content_text">
                                <span class="sub_title">网站系统自动认证头衔及条件:</span>
                                <br />
                                <span class="warning_color">土豪：</span>
                                累计发起roll，饰品件数大于等于200且价值超过3000元
                                <br />
                                <span class="warning_color">收割机：</span>
                                中奖饰品大于等于50件以上
                                <br />
                                <span class="warning_color">宇宙中心呼唤爱：</span>
                                连续100次以上未中奖
                                <br />
                                <span class="warning_color">万人瞩目：</span>
                                创建房间参与人数大于2000
                                <br />
                            </div>
                            <div class="content_text">
                                <span class="sub_title">需联系官方认证头衔及条件:</span>
                                <br />
                                <span class="warning_color">名人：微博大V</span>
                                通过新浪微博官方认证工作人员或自媒体，并提交账号后台截图。
                                <br />
                                <span class="warning_color">堂主：贴吧吧主</span>
                                提供贴吧ID与相关证明材料
                                <br />
                                <span class="warning_color">知名主播：主播</span>
                                近15天内正在直播且提供平台直播间地址和签约证明
                                <br />
                                <span class="warning_color">组织机构：</span>
                                第三方平台网站跟电竞相关的行业，包含自媒体，公司，公众号
                                <br />
                            </div>
                        </section>
                        <section v-if="active === 3">
                            <div class="content_title">恶意行为认定</div>
                            <div class="content_text">
                                <span class="warning_color">
                                    有多次恶意行为的用户将被屏蔽“饰品市场”功能，永久无法参与或创建任何Roll活动。
                                </span>
                                <p>
                                    具体恶意行为的认定包含但不限于以下：
                                    <br />
                                    1.说明描述包含中出现QQ，QQ群，微信号，微博号或带广告性质链接及与本网站业务有冲突的房间，系统将自动屏蔽房间描速；
                                    <br />
                                    2.昵称，头像设置包含QQ，QQ群，微信号，二维码；
                                    <br />
                                    3.故意创建多个ROLL房间，且单个房间内参与Roll的饰品的总价值都很小；
                                    <br />
                                    4.故意注册多个VKGAME账号，并同时参与同一个Roll活动；
                                    <br />
                                    5.通过非法行为，例如黑客行为，破坏ROLL活动公平性的；
                                    <br />
                                    6.利用ROLL活动进行恶意转移饰品；
                                    <br />
                                    7.利用ROLL功能堆积饰品；
                                </p>
                            </div>
                            <div class="content_text">以上规则的最终解释权归VKGAME所有</div>
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
