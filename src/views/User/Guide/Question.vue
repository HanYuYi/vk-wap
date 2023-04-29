<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">常见问题</div>
        </HeaderBar>

        <div class="expand-page pb-20px pt-10px px-14px">
            <div class="content">
                <div class="main_title">常见问题</div>

                <div class="sub_title">Q：如何计算有效流水？</div>
                <div class="content_text">
                    A：电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；有效流水计算范围=“盈利注单”的盈利金额+“失利注单”的失利金额。
                </div>

                <div class="sub_title">Q：什么是V币？</div>
                <div class="content_text">
                    A：V币是VKGAME赠与玩家的虚拟币，V币可用于体验电竞赛事中的任何一场竞猜，持有V币的玩家还能兑换一定比例的美金或RMB，此外，玩家还可以用V币进行抽奖、兑换超值物品等。
                </div>

                <div class="sub_title">Q：怎样获得V币？</div>
                <div class="content_text">
                    <p>
                        A：1）PC签到赚取，每天打开VKGAME首页或者个人中心频道都可以签到赚V币，首日可领10个，连续第二天可领20个，第三天及以后连续的每天都是30个。
                        <br />
                        2）完成任务赚取V币奖励。
                        <a class="to_link text-#07f1b7 underline" href="/task">查看任务中心</a>
                    </p>
                    <router-link to="/guide/aboutvb" style="text-decoration: underline; color: #07f1b7">
                        详情点击：如何获取V币
                    </router-link>
                </div>
                <div class="sub_title">Q：什么是赔率？赔率的高低代表什么？</div>
                <div class="content_text">
                    A：赔率指比赛双方在竞猜结束后的收赔指数，竞猜获胜方获得的额外奖励由赔率决定。更被看好，获得更多竞猜资本的一方赔率较低，获胜后支持该方的玩家获得的额外收益少。不被看好，获得更少竞猜资本的一方赔率较高，获胜后玩家获得额外收益高。通常来讲，热门队伍（选手）的支持者更多，获胜几率大，赔率低，获胜后的收益小。
                </div>
                <div class="sub_title">Q：什么是流水？</div>
                <div class="content_text">A：流水只是可以理解为有效投注的总金额，流水可能关系到提款,返水和某些特定活动。</div>
                <div class="sub_title">Q：什么是返水？</div>
                <div class="content_text">A：根据会员的有效投注总金额也就是流水，来给予一定的比例的奖金。</div>
                <div class="sub_title">Q：如何进行存款？</div>
                <div class="content_text">
                    A：您可以选择各大银行网银，QQ/银联/支付宝扫码等方式进行单笔最低100元，最高40000元的存款。
                </div>
                <div class="sub_title">Q：存款后马上可以提款吗？</div>
                <div class="content_text">
                    A：为了防止洗钱等非法活动，玩家在完成1倍投注即可提款，例如：存款1000元，投注1000元后即可提款。
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "guide.scss";
</style>
